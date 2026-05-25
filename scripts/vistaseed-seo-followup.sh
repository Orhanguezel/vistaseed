#!/usr/bin/env bash
set -euo pipefail

HOST="${HOST:-vps-vistainsaat}"
PUBLIC_ORIGIN="${PUBLIC_ORIGIN:-https://www.vistaseeds.com.tr}"
PANEL_ORIGIN="${PANEL_ORIGIN:-https://panel.vistaseeds.com.tr}"

check_head() {
  local label="$1"
  local url="$2"
  local expected="$3"
  local result

  result="$(curl -k -sS --max-time 15 -o /dev/null -w '%{http_code} %{redirect_url}' -I "$url" 2>/dev/null || true)"
  printf '| %s | `%s` | `%s` | `%s` |\n' "$label" "$url" "$expected" "$result"
}

check_post() {
  local label="$1"
  local url="$2"
  local expected="$3"
  local body="${4:-}"
  local result

  if [[ -n "$body" ]]; then
    result="$(curl -k -sS --max-time 15 -o /dev/null -w '%{http_code}' -X POST -H 'content-type: application/json' --data "$body" "$url" 2>/dev/null || true)"
  else
    result="$(curl -k -sS --max-time 15 -o /dev/null -w '%{http_code}' -X POST "$url" 2>/dev/null || true)"
  fi

  printf '| %s | `%s` | `%s` | `%s` |\n' "$label" "$url" "$expected" "$result"
}

today="$(date +%F)"

cat <<MARKDOWN
# VistaSeeds SEO Follow-up Smoke

Tarih: ${today}
Host: \`${HOST}\`

## HTTP Smoke

| Kontrol | URL | Beklenen | Sonuc |
|---|---|---|---|
MARKDOWN

check_head 'old product redirect' "${PUBLIC_ORIGIN}/tr/urun/saray-f1" '308 -> /tr/urunler/saray-f1'
check_head 'old product redirect' "${PUBLIC_ORIGIN}/tr/urun/avar" '308 -> /tr/urunler/avar'
check_head 'old group redirect' "${PUBLIC_ORIGIN}/tr/grup-sirketlerimiz/vista-prestige" '308 -> /tr/hakkimizda'
check_head 'localized redirect' "${PUBLIC_ORIGIN}/en/contact" '308 -> /en/iletisim'
check_head 'localized redirect' "${PUBLIC_ORIGIN}/de/produkte" '308 -> /de/urunler'
check_head 'apple touch precomposed' "${PUBLIC_ORIGIN}/apple-touch-icon-precomposed.png" '200'
check_head 'panel robots' "${PANEL_ORIGIN}/robots.txt" '200'
check_head 'panel apple touch' "${PANEL_ORIGIN}/apple-touch-icon.png" '200'
check_head 'probe block dotenv' "${PUBLIC_ORIGIN}/.env" '000/444 connection close'
check_head 'probe block wp-login' "${PUBLIC_ORIGIN}/wp-login.php" '000/444 connection close'
check_post 'auth token empty body' "${PANEL_ORIGIN}/api/v1/auth/token" '400'
check_post 'auth token wrong login' "${PANEL_ORIGIN}/api/v1/auth/token" '401' '{"email":"codex-smoke@example.com","password":"wrong-password"}'

cat <<'MARKDOWN'

## Log Summary

MARKDOWN

read_log_summary() {
  bash -s <<'REMOTE'
set -euo pipefail

public_logs=(/var/log/nginx/vistaseed.access.log /var/log/nginx/vistaseed.access.log.1 /var/log/nginx/vistaseed.access.log.*.gz)
panel_logs=(/var/log/nginx/vistaseed-panel.access.log /var/log/nginx/vistaseed-panel.access.log.1 /var/log/nginx/vistaseed-panel.access.log.*.gz)

printf "### Public status totals\n\n"
printf '```text\n'
zcat -f "${public_logs[@]}" 2>/dev/null | awk '{count[$9]++} END {for (status in count) print status, count[status]}' | sort -n
printf '```\n\n'

printf "### Panel status totals\n\n"
printf '```text\n'
zcat -f "${panel_logs[@]}" 2>/dev/null | awk '{count[$9]++} END {for (status in count) print status, count[status]}' | sort -n
printf '```\n\n'

printf "### Faz 2 pattern counters\n\n"
printf '| Pattern | Public | Panel |\n'
printf '|---|---:|---:|\n'

count_public() {
  local pattern="$1"
  zcat -f "${public_logs[@]}" 2>/dev/null | grep -E "$pattern" | wc -l
}

count_panel() {
  local pattern="$1"
  zcat -f "${panel_logs[@]}" 2>/dev/null | grep -E "$pattern" | wc -l
}

patterns=(
  '/tr/urun/[^ ]+'
  '/tr/grup-sirketlerimiz/[^ ]+'
  'apple-touch-icon-precomposed\.png'
  '\.env|/\.git|wp-login|wp-admin|\.php|sitemap\.txt|atom\.xml'
  '/api/v1/auth/token'
  'utm_campaign='
)

for pattern in "${patterns[@]}"; do
  printf '| `%s` | %s | %s |\n' "$pattern" "$(count_public "$pattern")" "$(count_panel "$pattern")"
done

printf "\n### Recent 5xx samples\n\n"
printf '```text\n'
zcat -f "${public_logs[@]}" "${panel_logs[@]}" 2>/dev/null | awk '$9 ~ /^5/ {print $0}' | tail -40
printf '```\n'
REMOTE
}

if [[ "$HOST" == "local" || "$HOST" == "localhost" || "$HOST" == "127.0.0.1" ]]; then
  read_log_summary
else
  ssh "$HOST" "$(declare -f read_log_summary); read_log_summary"
fi
