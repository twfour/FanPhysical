#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/fanphysics/current}"
DOMAIN="${DOMAIN:-physics.qinyibin.com}"
CERT_DIR="${CERT_DIR:-/etc/nginx/ssl/$DOMAIN}"
NGINX_CONF="${NGINX_CONF:-/etc/nginx/conf.d/fanphysics.conf}"
SSH_TARGET="${SSH_TARGET:-root@101.37.82.5}"
SSH_KEY_FILE="${SSH_KEY_FILE:-$HOME/.ssh/flower_position_aliyun_ed25519}"
CURL_OPTS=(--noproxy '*' --connect-timeout 8 --max-time 15)
TOKEN=""

ssh_exec() {
  ssh -i "$SSH_KEY_FILE" -o BatchMode=yes -o ConnectTimeout=8 -o StrictHostKeyChecking=no "$SSH_TARGET" "$1"
}

cleanup() {
  if [[ -n "$TOKEN" && -f "$SSH_KEY_FILE" ]]; then
    ssh_exec "rm -f '$APP_DIR/.well-known/acme-challenge/$TOKEN'" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

if [[ ! -f "$SSH_KEY_FILE" ]]; then
  echo "SSH key not found: $SSH_KEY_FILE" >&2
  exit 1
fi

echo "==> Preparing ACME challenge"
TOKEN="fanphysics-https-check-$(date +%s)"
ssh_exec "set -e; mkdir -p '$APP_DIR/.well-known/acme-challenge'; printf '$TOKEN' > '$APP_DIR/.well-known/acme-challenge/$TOKEN'"

echo "==> Checking public DNS and HTTP challenge"
if [[ "$(curl "${CURL_OPTS[@]}" -fsS "http://$DOMAIN/.well-known/acme-challenge/$TOKEN" 2>/dev/null || true)" != "$TOKEN" ]]; then
  echo "HTTP challenge is not reachable for $DOMAIN. Add A record $DOMAIN -> 101.37.82.5 and wait for DNS propagation." >&2
  exit 1
fi

echo "==> Issuing and installing certificate"
ssh_exec "set -e
/root/.acme.sh/acme.sh --issue -d '$DOMAIN' -w '$APP_DIR' --keylength ec-256
mkdir -p '$CERT_DIR'
/root/.acme.sh/acme.sh --install-cert -d '$DOMAIN' --ecc \\
  --key-file '$CERT_DIR/privkey.pem' \\
  --fullchain-file '$CERT_DIR/fullchain.pem' \\
  --reloadcmd 'systemctl reload nginx'
cp '$APP_DIR/deploy/aliyun/nginx-https.conf' '$NGINX_CONF'
nginx -t
systemctl reload nginx"

echo "==> Checking HTTPS"
curl "${CURL_OPTS[@]}" -fsS "https://$DOMAIN/api/health"
echo
echo "HTTPS enabled."
