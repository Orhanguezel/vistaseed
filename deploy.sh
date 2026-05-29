#!/bin/bash
set -e

MONOREPO_ROOT="${MONOREPO_ROOT:-/var/www/tarim-dijital-ekosistem}"
PROJECT_ROOT="$MONOREPO_ROOT/projects/vistaseeds"
cd "$PROJECT_ROOT"

echo "=== [1/7] shared-backend güncelle ==="
cd "$MONOREPO_ROOT"
git pull origin main
cd "$PROJECT_ROOT"

echo "=== [2/7] vistaseed repo güncelle ==="
git pull origin main

echo "=== [3/7] Backend build ==="
cd backend && bun run build
cd ..

echo "=== [4/7] Backend restart ==="
pm2 restart vistaseed-backend
sleep 3

echo "=== [5/7] Frontend build ==="
cd frontend && bun run build
cd ..

echo "=== [6/7] Admin panel build ==="
cd admin_panel && bun run build
cd ..

echo "=== [7/7] Frontend + Admin restart ==="
pm2 restart vistaseed-frontend vistaseed-admin-panel

echo "=== Deploy tamamlandi ==="
pm2 ls | grep vistaseed
