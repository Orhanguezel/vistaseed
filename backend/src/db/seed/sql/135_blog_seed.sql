-- Örnek blog yazıları (TR)

INSERT INTO blog_posts (id, category, author, image_url, status, published_at, is_active, display_order)
VALUES
  ('a1000001-0001-4001-8001-000000000001', 'tohum-bilimi', 'VistaSeed', NULL, 'published', NOW(3), 1, 0),
  ('a1000001-0001-4001-8001-000000000002', 'ekim-teknikleri', 'VistaSeed', NULL, 'published', NOW(3), 1, 1)
ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);

INSERT INTO blog_posts_i18n (blog_post_id, locale, title, slug, excerpt, content, meta_title, meta_description)
VALUES
  (
    'a1000001-0001-4001-8001-000000000001',
    'tr',
    'Tohum çimlenme oranını artırmanın yolları',
    'tohum-cimlenme-oranini-artirmanin-yollari',
    'Laboratuvar ve saha koşullarında çimlenme başarısı için pratik öneriler.',
    '<p>Çimlenme; su, sıcaklık ve tohum kalitesi ile doğrudan ilişkilidir. Önce çeşit kartınızdaki önerilen sıcaklık aralığına uyun.</p><p>Ekim öncesi tohum hijyeni ve doğru derinlik, saha tutarlılığını artırır.</p>',
    'Tohum çimlenme oranı',
    'VistaSeed blog: çimlenme ipuçları.'
  ),
  (
    'a1000001-0001-4001-8001-000000000002',
    'tr',
    'Sonbahar ekiminde sulama planı',
    'sonbahar-ekiminde-sulama-plani',
    'Sebze tohumlarında sonbahar ekimi için sulama zamanlaması.',
    '<p>Sonbahar ekiminde toprak nemini sabit tutmak verimi korur. İlk hafta yüzeysel, köklenme sonrası derin sulamaya geçin.</p>',
    'Sonbahar sulama',
    'Ekim teknikleri: sulama.'
  )
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  excerpt = VALUES(excerpt),
  content = VALUES(content),
  updated_at = VALUES(updated_at);
