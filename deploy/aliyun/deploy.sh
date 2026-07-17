#!/usr/bin/env bash
set -euo pipefail

APP_BASE="${APP_BASE:-/opt/fanphysics}"
ENV_FILE="${ENV_FILE:-/etc/fanphysics.env}"
NGINX_CONF="${NGINX_CONF:-/etc/nginx/conf.d/fanphysics.conf}"
SSH_TARGET="${SSH_TARGET:-root@101.37.82.5}"
SSH_KEY_FILE="${SSH_KEY_FILE:-$HOME/.ssh/flower_position_aliyun_ed25519}"
ARCHIVE_REMOTE="${ARCHIVE_REMOTE:-/tmp/fanphysics.tar.gz}"
DOMAIN="${DOMAIN:-physics.qinyibin.com}"
RELEASE_ID="${RELEASE_ID:-$(date +%Y%m%d%H%M%S)}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TMP_ARCHIVE="$(mktemp -t fanphysics.XXXXXX.tar.gz)"

cleanup() {
  rm -f "$TMP_ARCHIVE"
}
trap cleanup EXIT

if [[ ! -f "$SSH_KEY_FILE" ]]; then
  echo "SSH key not found: $SSH_KEY_FILE" >&2
  exit 1
fi

echo "==> Packaging runtime files"
(
  cd "$ROOT_DIR"
  COPYFILE_DISABLE=1 LC_ALL=C LANG=C tar --no-xattrs -czf "$TMP_ARCHIVE" \
    classical-mechanics-demo.html \
    server.py \
    assets \
    data \
    math \
    deploy/aliyun
)

echo "==> Uploading release $RELEASE_ID"
scp -i "$SSH_KEY_FILE" -o BatchMode=yes -o ConnectTimeout=8 -o StrictHostKeyChecking=no \
  "$TMP_ARCHIVE" "$SSH_TARGET:$ARCHIVE_REMOTE"

echo "==> Installing and activating release"
ssh -i "$SSH_KEY_FILE" -o BatchMode=yes -o ConnectTimeout=8 -o StrictHostKeyChecking=no \
  "$SSH_TARGET" "set -e
if ! id -u fanphysics >/dev/null 2>&1; then
  useradd --system --home-dir '$APP_BASE' --shell /sbin/nologin fanphysics
fi
test -f '$ENV_FILE' || { echo 'Missing $ENV_FILE; run deploy/aliyun/install_env.sh first.' >&2; exit 1; }
mkdir -p '$APP_BASE/releases/$RELEASE_ID'
tar -xzf '$ARCHIVE_REMOTE' -C '$APP_BASE/releases/$RELEASE_ID'
rm -f '$ARCHIVE_REMOTE'
chown -R root:root '$APP_BASE/releases/$RELEASE_ID'
find '$APP_BASE/releases/$RELEASE_ID' -type d -exec chmod 755 {} +
find '$APP_BASE/releases/$RELEASE_ID' -type f -exec chmod 644 {} +
chmod 755 '$APP_BASE/releases/$RELEASE_ID/deploy/aliyun/'*.sh
ln -sfn '$APP_BASE/releases/$RELEASE_ID' '$APP_BASE/current.next'
mv -Tf '$APP_BASE/current.next' '$APP_BASE/current'
cp '$APP_BASE/current/deploy/aliyun/fanphysics.service' /etc/systemd/system/
if [[ ! -f '$NGINX_CONF' ]]; then
  cp '$APP_BASE/current/deploy/aliyun/nginx.conf' '$NGINX_CONF'
elif grep -q 'ssl_certificate' '$NGINX_CONF'; then
  echo 'Keeping existing HTTPS nginx config'
else
  cp '$APP_BASE/current/deploy/aliyun/nginx.conf' '$NGINX_CONF'
fi
systemctl daemon-reload
systemctl enable --now fanphysics.service
systemctl restart fanphysics.service
nginx -t
systemctl reload nginx
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  curl -fsS http://127.0.0.1:8010/api/health >/dev/null 2>&1 && break
  sleep 1
done
curl -fsS http://127.0.0.1:8010/api/health >/dev/null
systemctl --no-pager --lines=0 status fanphysics.service >/dev/null
ls -1dt '$APP_BASE'/releases/* | tail -n +4 | xargs -r rm -rf"

echo "==> Checking Nginx virtual host"
curl --noproxy '*' --fail --silent --show-error \
  --header "Host: $DOMAIN" "http://101.37.82.5/api/health"
echo
echo "Deploy complete."
