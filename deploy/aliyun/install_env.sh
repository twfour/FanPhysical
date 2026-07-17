#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_SOURCE="${ENV_SOURCE:-$ROOT_DIR/.env}"
ENV_FILE="${ENV_FILE:-/etc/fanphysics.env}"
SSH_TARGET="${SSH_TARGET:-root@101.37.82.5}"
SSH_KEY_FILE="${SSH_KEY_FILE:-$HOME/.ssh/flower_position_aliyun_ed25519}"
TMP_ENV="$(mktemp -t fanphysics-env.XXXXXX)"

cleanup() {
  rm -f "$TMP_ENV"
}
trap cleanup EXIT

if [[ ! -f "$ENV_SOURCE" ]]; then
  echo "Environment source not found: $ENV_SOURCE" >&2
  exit 1
fi
if [[ ! -f "$SSH_KEY_FILE" ]]; then
  echo "SSH key not found: $SSH_KEY_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_SOURCE"
set +a

if [[ -z "${DEEPSEEK_API_KEY:-}" ]]; then
  echo "DEEPSEEK_API_KEY is missing from $ENV_SOURCE" >&2
  exit 1
fi

umask 077
{
  printf 'HOST=127.0.0.1\n'
  printf 'PORT=8010\n'
  printf 'FANPHYSICS_ENV=production\n'
  printf 'DEEPSEEK_API_KEY=%s\n' "$DEEPSEEK_API_KEY"
  printf 'DEEPSEEK_MODEL=%s\n' "${DEEPSEEK_MODEL:-deepseek-v4-flash}"
  printf 'DEEPSEEK_THINKING=disabled\n'
  printf 'DEEPSEEK_TIMEOUT_SECONDS=90\n'
  printf 'DEEPSEEK_MAX_RETRIES=2\n'
} > "$TMP_ENV"

echo "==> Uploading protected environment file"
scp -i "$SSH_KEY_FILE" -o BatchMode=yes -o ConnectTimeout=8 -o StrictHostKeyChecking=no \
  "$TMP_ENV" "$SSH_TARGET:/tmp/fanphysics.env"
ssh -i "$SSH_KEY_FILE" -o BatchMode=yes -o ConnectTimeout=8 -o StrictHostKeyChecking=no \
  "$SSH_TARGET" "install -o root -g root -m 600 /tmp/fanphysics.env '$ENV_FILE'; rm -f /tmp/fanphysics.env; if systemctl is-active --quiet fanphysics.service; then systemctl restart fanphysics.service; fi"
echo "Environment installed at $ENV_FILE."
