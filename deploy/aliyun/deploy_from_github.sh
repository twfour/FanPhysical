#!/usr/bin/env bash
set -euo pipefail

APP_BASE="${APP_BASE:-/opt/fanphysics}"
NGINX_CONF="${NGINX_CONF:-/etc/nginx/conf.d/fanphysics.conf}"
SSH_TARGET="${SSH_TARGET:-root@101.37.82.5}"
SSH_KEY_FILE="${SSH_KEY_FILE:-$HOME/.ssh/flower_position_aliyun_ed25519}"
GITHUB_REPOSITORY="${GITHUB_REPOSITORY:-twfour/FanPhysical}"
GIT_COMMIT="${GIT_COMMIT:-$(git rev-parse HEAD)}"
RELEASE_ID="${RELEASE_ID:-$(date +%Y%m%d%H%M%S)}"
DOMAIN="${DOMAIN:-physics.qinyibin.com}"

if [[ ! -f "$SSH_KEY_FILE" ]]; then
  echo "SSH key not found: $SSH_KEY_FILE" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean. Commit changes before deploying." >&2
  exit 1
fi

echo "==> Deploying commit $GIT_COMMIT"
echo "==> ECS will download the release from GitHub"

ssh \
  -i "$SSH_KEY_FILE" \
  -o BatchMode=yes \
  -o ConnectTimeout=8 \
  -o ServerAliveInterval=5 \
  -o ServerAliveCountMax=3 \
  -o StrictHostKeyChecking=no \
  "$SSH_TARGET" \
  bash -s -- "$APP_BASE" "$NGINX_CONF" "$GITHUB_REPOSITORY" "$GIT_COMMIT" "$RELEASE_ID" <<'REMOTE'
set -euo pipefail

APP_BASE="$1"
NGINX_CONF="$2"
GITHUB_REPOSITORY="$3"
GIT_COMMIT="$4"
RELEASE_ID="$5"
ARCHIVE="/tmp/fanphysics-${GIT_COMMIT}.tar.gz"
RELEASE_DIR="$APP_BASE/releases/$RELEASE_ID"

curl \
  --fail \
  --location \
  --connect-timeout 10 \
  --max-time 120 \
  "https://codeload.github.com/${GITHUB_REPOSITORY}/tar.gz/${GIT_COMMIT}" \
  --output "$ARCHIVE"

mkdir -p "$RELEASE_DIR"
tar -xzf "$ARCHIVE" --strip-components=1 -C "$RELEASE_DIR"
rm -f "$ARCHIVE"

chown -R root:root "$RELEASE_DIR"
find "$RELEASE_DIR" -type d -exec chmod 755 {} +
find "$RELEASE_DIR" -type f -exec chmod 644 {} +
chmod 755 "$RELEASE_DIR/deploy/aliyun/"*.sh

ln -sfn "$RELEASE_DIR" "$APP_BASE/current.next"
mv -Tf "$APP_BASE/current.next" "$APP_BASE/current"

cp "$APP_BASE/current/deploy/aliyun/fanphysics.service" /etc/systemd/system/
cp "$APP_BASE/current/deploy/aliyun/nginx-https.conf" "$NGINX_CONF"

systemctl daemon-reload
systemctl restart fanphysics.service
nginx -t
systemctl reload nginx

for attempt in 1 2 3 4 5 6 7 8 9 10; do
  curl -fsS http://127.0.0.1:8010/api/health >/dev/null 2>&1 && break
  sleep 1
done
curl -fsS http://127.0.0.1:8010/api/health
echo

ls -1dt "$APP_BASE"/releases/* | tail -n +4 | xargs -r rm -rf
echo "Activated release $RELEASE_ID"
REMOTE

echo "==> Checking public endpoint"
curl --fail --silent --show-error --max-time 10 "https://$DOMAIN/api/health"
echo
echo "Deploy complete: $RELEASE_ID ($GIT_COMMIT)"
