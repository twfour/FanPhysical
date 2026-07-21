#!/usr/bin/env python3
import tempfile
import time
import unittest
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from learning_sync import LearningSyncService, SESSION_COOKIE


class LearningSyncTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.service = LearningSyncService(
            password="fanphysics-test-password",
            state_path=Path(self.temporary_directory.name) / "learning-state.json",
        )

    def tearDown(self):
        self.temporary_directory.cleanup()

    def test_newer_record_and_tombstone_win(self):
        current = {
            "stores": {
                "exploration": {
                    "problem:stage:0": {"value": "旧回答", "updatedAt": 100, "deleted": False},
                },
            },
        }
        incoming = {
            "stores": {
                "exploration": {
                    "problem:stage:0": {"value": "新回答", "updatedAt": 200, "deleted": False},
                    "problem:stage:1": {"value": "", "updatedAt": 300, "deleted": True},
                },
            },
        }
        merged = self.service.merge_states(current, incoming)
        self.assertEqual(merged["stores"]["exploration"]["problem:stage:0"]["value"], "新回答")
        self.assertTrue(merged["stores"]["exploration"]["problem:stage:1"]["deleted"])

    def test_state_round_trip_keeps_three_point_score(self):
        payload = {
            "stores": {
                "realLife": {
                    "problem:real-life": {"value": "迁移回答", "updatedAt": 400, "deleted": False},
                },
                "realLifeChecks": {
                    "problem:real-life": {"value": [2, 0, 2], "updatedAt": 500, "deleted": False},
                },
            },
        }
        self.service.save_state(payload)
        loaded = self.service.load_state()
        self.assertEqual(loaded["stores"]["realLife"]["problem:real-life"]["value"], "迁移回答")
        self.assertEqual(loaded["stores"]["realLifeChecks"]["problem:real-life"]["value"], [0, 2])

    def test_signed_session_cookie_is_accepted(self):
        token = self.service.create_session_token()
        headers = {"Cookie": f"{SESSION_COOKIE}={token}"}

        self.assertTrue(self.service.session_is_valid(headers))
        payload = f"{int(time.time()) - 1}.expired"
        expired = f"{payload}.{self.service.session_signature(payload)}"
        headers = {"Cookie": f"{SESSION_COOKIE}={expired}"}
        self.assertFalse(self.service.session_is_valid(headers))


if __name__ == "__main__":
    unittest.main()
