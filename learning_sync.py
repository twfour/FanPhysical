"""Authenticated storage and merge rules for browser learning records."""

import hashlib
import hmac
import json
import os
import secrets
import threading
import time
from http.cookies import SimpleCookie
from pathlib import Path


MAX_STATE_BODY_BYTES = 400_000
MAX_STORE_ENTRIES = 2_000
MAX_RESPONSE_CHARS = 12_000
SESSION_COOKIE = "fanphysics_learning_session"
SESSION_SECONDS = 30 * 24 * 60 * 60
STORE_TYPES = {
    "exploration": "text",
    "realLife": "text",
    "realLifeChecks": "checks",
    "learningCycle": "text",
}


class LearningSyncService:
    """Owns learning-state validation, persistence, and signed sessions."""

    def __init__(self, password, state_path, app_env="development"):
        self.password = password if isinstance(password, str) else ""
        self.enabled = len(self.password) >= 12
        self.state_path = Path(state_path)
        self.app_env = str(app_env or "development").strip().lower()
        self.lock = threading.RLock()

    def password_matches(self, candidate):
        if not self.enabled or not isinstance(candidate, str):
            return False
        return hmac.compare_digest(candidate.encode("utf-8"), self.password.encode("utf-8"))

    def session_signature(self, payload):
        key = ("fanphysics-learning-session:" + self.password).encode("utf-8")
        return hmac.new(key, payload.encode("utf-8"), hashlib.sha256).hexdigest()

    def create_session_token(self):
        expires_at = int(time.time()) + SESSION_SECONDS
        payload = f"{expires_at}.{secrets.token_urlsafe(18)}"
        return f"{payload}.{self.session_signature(payload)}"

    def session_is_valid(self, headers):
        raw_cookie = headers.get("Cookie", "") if headers else ""
        if not raw_cookie or not self.enabled:
            return False
        cookie = SimpleCookie()
        try:
            cookie.load(raw_cookie)
        except Exception:
            return False
        morsel = cookie.get(SESSION_COOKIE)
        if morsel is None:
            return False
        try:
            expires_text, nonce, signature = morsel.value.split(".", 2)
            expires_at = int(expires_text)
        except (TypeError, ValueError):
            return False
        if not nonce or expires_at < int(time.time()):
            return False
        payload = f"{expires_text}.{nonce}"
        return hmac.compare_digest(signature, self.session_signature(payload))

    def session_cookie(self, headers, token, max_age=SESSION_SECONDS):
        parts = [
            f"{SESSION_COOKIE}={token}",
            "Path=/",
            f"Max-Age={max_age}",
            "HttpOnly",
            "SameSite=Strict",
        ]
        forwarded_proto = (headers.get("X-Forwarded-Proto", "") if headers else "").split(",", 1)[0].strip()
        if self.app_env == "production" or forwarded_proto == "https":
            parts.append("Secure")
        return "; ".join(parts)

    @staticmethod
    def empty_state():
        return {
            "version": 1,
            "updatedAt": 0,
            "stores": {name: {} for name in STORE_TYPES},
        }

    @staticmethod
    def normalize_record(record, store_type):
        if store_type == "text" and isinstance(record, str):
            return {
                "value": record[:MAX_RESPONSE_CHARS],
                "updatedAt": 0,
                "deleted": not bool(record),
            }
        if not isinstance(record, dict):
            return None
        updated_at = record.get("updatedAt", 0)
        if isinstance(updated_at, bool) or not isinstance(updated_at, (int, float)):
            updated_at = 0
        updated_at = max(0, min(int(updated_at), int(time.time() * 1000) + 5 * 60 * 1000))
        deleted = bool(record.get("deleted"))
        if store_type == "checks":
            raw_value = record.get("value", [])
            if not isinstance(raw_value, list):
                return None
            value = sorted(
                {
                    item
                    for item in raw_value
                    if isinstance(item, int) and not isinstance(item, bool) and 0 <= item < 20
                }
            )
            deleted = deleted or not value
        else:
            raw_value = record.get("value", "")
            if not isinstance(raw_value, str):
                return None
            value = raw_value.strip()[:MAX_RESPONSE_CHARS]
            deleted = deleted or not value
        return {"value": value, "updatedAt": updated_at, "deleted": deleted}

    def normalize_state(self, payload):
        state = self.empty_state()
        raw_stores = payload.get("stores") if isinstance(payload, dict) else None
        if not isinstance(raw_stores, dict):
            return state
        for store_name, store_type in STORE_TYPES.items():
            raw_store = raw_stores.get(store_name)
            if not isinstance(raw_store, dict):
                continue
            normalized_store = {}
            for key, record in list(raw_store.items())[:MAX_STORE_ENTRIES]:
                if not isinstance(key, str) or not key or len(key) > 240:
                    continue
                normalized_record = self.normalize_record(record, store_type)
                if normalized_record is not None:
                    normalized_store[key] = normalized_record
            state["stores"][store_name] = normalized_store
        state["updatedAt"] = max(
            (
                record["updatedAt"]
                for store in state["stores"].values()
                for record in store.values()
            ),
            default=0,
        )
        return state

    def merge_states(self, current, incoming):
        merged = self.empty_state()
        current = self.normalize_state(current)
        incoming = self.normalize_state(incoming)
        for store_name in STORE_TYPES:
            keys = set(current["stores"][store_name]) | set(incoming["stores"][store_name])
            for key in keys:
                old_record = current["stores"][store_name].get(key)
                new_record = incoming["stores"][store_name].get(key)
                if old_record is None:
                    selected = new_record
                elif new_record is None:
                    selected = old_record
                elif new_record["updatedAt"] >= old_record["updatedAt"]:
                    selected = new_record
                else:
                    selected = old_record
                if selected is not None:
                    merged["stores"][store_name][key] = selected
        merged["updatedAt"] = max(current.get("updatedAt", 0), incoming.get("updatedAt", 0))
        return merged

    def _load_state_unlocked(self):
        try:
            payload = json.loads(self.state_path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            return self.empty_state()
        except (OSError, json.JSONDecodeError):
            return self.empty_state()
        return self.normalize_state(payload)

    def load_state(self):
        with self.lock:
            return self._load_state_unlocked()

    def save_state(self, incoming):
        with self.lock:
            state = self.merge_states(self._load_state_unlocked(), incoming)
            self.state_path.parent.mkdir(parents=True, exist_ok=True)
            temporary_path = self.state_path.with_name(
                f"{self.state_path.name}.tmp-{os.getpid()}-{threading.get_ident()}"
            )
            temporary_path.write_text(
                json.dumps(state, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            os.chmod(temporary_path, 0o600)
            os.replace(temporary_path, self.state_path)
        return state
