-- =============================================================
-- Neden Biz? (Values) Custom Page Seed
-- Bu sayfa ana sayfadaki "Neden Biz?" bölümünü dinamikleştirir.
-- =============================================================

INSERT INTO `custom_pages` (`id`, `module_key`, `is_published`, `display_order`) VALUES
('neden-biz-uuid-001', 'kurumsal', 1, 99);

INSERT INTO `custom_pages_i18n` (`page_id`, `locale`, `title`, `slug`, `content`, `summary`) VALUES
('neden-biz-uuid-001', 'tr', 'Neden Vista Seed?', 'neden-biz', 
'[
  {"icon": "sun", "title": "Yüksek Verim", "description": "Modern ıslah teknikleriyle geliştirilen, bölgesel adaptasyonu yüksek ve verimi kanıtlanmış tohumlar sunuyoruz."},
  {"icon": "shield", "title": "Kalite Garantisi", "description": "Tüm tohumlarımız TUAB standartlarında laboratuvar testlerinden geçer ve %95 üzeri çimlendirme garantisiyle sunulur."},
  {"icon": "users", "title": "Çiftçi Dostu", "description": "Sadece tohum satmıyoruz; ekimden hasada kadar teknik destek ve danışmanlık ile çiftçimizin her an yanındayız."},
  {"icon": "beaker", "title": "Sürekli AR-GE", "description": "Geleceğin tarımı için bugünden çalışıyoruz. Yerli ve millî hibrit çeşitlerimizi sürekli geliştiriyoruz."}
]', 
'Tarımda sürdürülebilir başarı için neden Vista Seed tercih etmelisiniz? İşte temel değerlerimiz.');
