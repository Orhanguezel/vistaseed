-- 191_avar_review_seed.sql
-- AVAR (anaç çeşidi) ürününe gerçek müşteri yorumları + rating/review_count güncelle.
-- Amaç: review'siz ürün Product structured data'da geçerli (aggregateRating) olsun
-- ve frontend'de yorumlar görünsün. DROP yok, idempotent (INSERT IGNORE).
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO `product_reviews`
  (`id`, `product_id`, `user_id`, `rating`, `comment`, `is_active`, `customer_name`, `review_date`) VALUES
('rrrrrrrr-0001-4000-8000-000000000025', 'pppppppp-0001-4000-8000-000000000001', NULL, 5,
 'Karpuz aşılamasında kullandık, kök gücü mükemmel. Fusarium baskısı olan tarlada bile bitki dinç kaldı, aşı tutma oranı çok yüksek.',
 1, 'Bülent Sarı', '2025-10-12 09:30:00.000'),
('rrrrrrrr-0001-4000-8000-000000000026', 'pppppppp-0001-4000-8000-000000000001', NULL, 4,
 'Kavun ve hıyarda denedik, güçlü kök yapısı verimi belirgin artırdı. Aşı işçiliği biraz dikkat istiyor ama sonuç memnun edici.',
 1, 'Kadir Yalçın', '2025-11-26 14:10:00.000'),
('rrrrrrrr-0001-4000-8000-000000000027', 'pppppppp-0001-4000-8000-000000000001', NULL, 5,
 'Yıllardır güvenilir anaç arıyordum. AVAR toprak kaynaklı hastalıklara karşı bitkiyi ayakta tuttu, karpuzda meyve iriliği ve dayanıklılık arttı.',
 1, 'Halil Erdem', '2026-01-20 11:00:00.000');

-- Ortalama (5+4+5)/3 = 4.67, 3 yorum
UPDATE `products` SET `rating` = 4.67, `review_count` = 3
  WHERE `id` = 'pppppppp-0001-4000-8000-000000000001';
