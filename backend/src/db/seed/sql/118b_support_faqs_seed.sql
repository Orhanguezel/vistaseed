SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `support_faqs` (`id`, `category`, `display_order`, `is_published`)
VALUES
  ('66666666-6666-4666-8666-666666666661', 'genel',   1, 1),
  ('66666666-6666-4666-8666-666666666662', 'urunler', 2, 1),
  ('66666666-6666-4666-8666-666666666663', 'genel',   3, 1),
  ('66666666-6666-4666-8666-666666666664', 'hesap',   4, 1),
  ('66666666-6666-4666-8666-666666666665', 'teknik',  5, 1)
ON DUPLICATE KEY UPDATE
  `category` = VALUES(`category`),
  `display_order` = VALUES(`display_order`),
  `is_published` = VALUES(`is_published`);

INSERT INTO `support_faqs_i18n` (`faq_id`, `locale`, `question`, `answer`)
VALUES
  ('66666666-6666-4666-8666-666666666661', 'tr', 'Şirketiniz ne iş yapıyor?', 'Firmamız sektöründe kaliteli ürün ve hizmet sunmaktadır. Detaylı bilgi için Hakkımızda sayfamızı ziyaret edebilirsiniz.'),
  ('66666666-6666-4666-8666-666666666662', 'tr', 'Ürünlerinizi nasıl satın alabilirim?', 'Ürün katalogumuzu inceleyerek iletişim formu üzerinden sipariş verebilirsiniz.'),
  ('66666666-6666-4666-8666-666666666663', 'tr', 'İletişim bilgilerinize nasıl ulaşabilirim?', 'İletişim sayfamızdan telefon, e-posta ve adres bilgilerimize ulaşabilirsiniz.'),
  ('66666666-6666-4666-8666-666666666664', 'tr', 'Hesabımı nasıl oluşturabilirim?', 'Üye Ol sayfasından e-posta adresiniz ve şifreniz ile kayıt olabilirsiniz.'),
  ('66666666-6666-4666-8666-666666666665', 'tr', 'Teknik destek nasıl alabilirim?', 'İletişim formunu doldurarak veya destek e-posta adresimize yazarak yardım alabilirsiniz.'),
  ('66666666-6666-4666-8666-666666666661', 'en', 'What does your company do?', 'We provide quality products and services in our field. You can visit the About Us page for detailed information.'),
  ('66666666-6666-4666-8666-666666666662', 'en', 'How can I purchase your products?', 'You can review our product catalog and place an order through the contact form.'),
  ('66666666-6666-4666-8666-666666666663', 'en', 'How can I access your contact information?', 'You can find our phone, email, and address information on the Contact page.'),
  ('66666666-6666-4666-8666-666666666664', 'en', 'How can I create an account?', 'You can register with your email address and password on the Sign Up page.'),
  ('66666666-6666-4666-8666-666666666665', 'en', 'How can I get technical support?', 'You can get help by filling out the contact form or by sending an email to our support address.')
ON DUPLICATE KEY UPDATE
  `question` = VALUES(`question`),
  `answer` = VALUES(`answer`);
