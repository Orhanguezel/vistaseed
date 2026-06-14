-- 2026-06-13 audit spike cleanup helper
-- Kullanmadan once SELECT bloklarini calistirip sayilari dogrulayin.
-- DELETE bloklari bilincli olarak yorum satirindadir.

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Spike kaynagi: admin google-connect exchange loop.
SELECT
  ip,
  path,
  COUNT(*) AS hits,
  MIN(created_at) AS first_seen,
  MAX(created_at) AS last_seen
FROM audit_request_logs
WHERE DATE(created_at) = '2026-06-13'
  AND path = '/api/v1/admin/google-connect/exchange'
GROUP BY ip, path
ORDER BY hits DESC;

-- 13 Haziran genel top kaynak/path raporu.
SELECT ip, path, COUNT(*) AS hits
FROM audit_request_logs
WHERE DATE(created_at) = '2026-06-13'
GROUP BY ip, path
ORDER BY hits DESC
LIMIT 50;

-- Onaydan sonra spike satirlarini temizlemek icin:
-- DELETE FROM audit_request_logs
-- WHERE DATE(created_at) = '2026-06-13'
--   AND path = '/api/v1/admin/google-connect/exchange';

-- Local/SSR kaynakli 127.0.0.1 API gurultusunu ayni gun temizlemek gerekirse:
-- DELETE FROM audit_request_logs
-- WHERE DATE(created_at) = '2026-06-13'
--   AND ip = '127.0.0.1'
--   AND path LIKE '/api/%';
