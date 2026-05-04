#!/bin/bash
set -e
cd /var/www/vistaseed

echo "=== [1/7] shared-backend güncelle ==="
cd /var/www/packages
git pull origin main
cd /var/www/vistaseed

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
