#!/bin/bash
# Corporate Site — Production DB Migration Script
# Kullanim:
#   ./scripts/migrate.sh              # Tum schema SQL'lerini calistir (seed/data yok)
#   ./scripts/migrate.sh --only=115   # Sadece belirli dosyayi calistir
#   ./scripts/migrate.sh --seed       # Schema + seed (sadece ilk kurulum)
#
# ONEMLI: Bu script DROP yapmaz. Sadece CREATE IF NOT EXISTS + ALTER yapar.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

cd "$BACKEND_DIR"

# Schema dosyalari (seed haric)
SCHEMA_FILES=(
  "001_auth_schema.sql"
  "004_site_settings_schema.sql"
  "005_theme_config.sql"
  "007_storage_assets.sql"
  "008_contact_messages.sql"
  "011_notifications_schema_seed.sql"
  "016_audit_schema.sql"
  "017_categories_schema.sql"
  "018_email_templates_schema.sql"
  "019_gallery_schema.sql"
  "020_telegram_schema.sql"
  "028_users_rules_accepted_column.sql"
  "143_users_ecosystem_id.sql"
  "115_custom_pages_schema.sql"
  "116_support_schema.sql"
  "149_support_ticket_messages.sql"
)

if [[ "${1:-}" == "--seed" ]]; then
  echo ">>> Tam seed (schema + data) — ilk kurulum modu"
  bun src/db/seed/index.ts --no-drop
  exit 0
fi

if [[ "${1:-}" =~ ^--only= ]]; then
  ONLY="${1#--only=}"
  echo ">>> Sadece: $ONLY"
  bun src/db/seed/index.ts --no-drop --only="$ONLY"
  exit 0
fi

echo ">>> Schema migration (--no-drop, sadece schema dosyalari)"
# Schema prefix'lerini cikar ve --only ile calistir
PREFIXES=""
for f in "${SCHEMA_FILES[@]}"; do
  PREFIX=$(echo "$f" | grep -oP '^\d+')
  if [[ -n "$PREFIXES" ]]; then
    PREFIXES="$PREFIXES,$PREFIX"
  else
    PREFIXES="$PREFIX"
  fi
done

bun src/db/seed/index.ts --no-drop --only="$PREFIXES"

echo ">>> Migration tamamlandi."
