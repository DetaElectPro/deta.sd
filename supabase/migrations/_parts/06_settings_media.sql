-- =============================================================
-- 06_settings_media.sql
-- إعدادات الموقع الأساسية + الترجمات + صور الخلفية + الوسائط
-- قاعدة البيانات: Postgres (Supabase)
-- ملاحظة: هذا الملف آمن للتكرار (idempotent)
--   - site_settings: ON CONFLICT (key) DO NOTHING
--   - site_setting_translations: ON CONFLICT (setting_key, language_code) DO NOTHING
--   - background_images: حماية بـ WHERE NOT EXISTS
--   - media: حماية بـ WHERE NOT EXISTS على url
-- =============================================================

-- -------------------------------------------------------------
-- 1) إعدادات الموقع الأساسية (site_settings)
-- الأعمدة: key, value, description, type
-- النوع 'text' للكل ما عدا الأرقام فالنوع 'number'
-- -------------------------------------------------------------
INSERT INTO site_settings (key, value, description, type) VALUES
  ('company_name', 'مجموعة ديتا للصادرات الزراعية', 'اسم الشركة الرسمي', 'text'),
  ('company_tagline', 'من الحقول السودانية إلى الأسواق العالمية', 'الشعار الرئيسي للشركة', 'text'),
  ('phone', '+249183000000', 'رقم هاتف الشركة', 'text'),
  ('email', 'info@deta.sd', 'البريد الإلكتروني الرسمي', 'text'),
  ('address', 'الخرطوم، السودان - شارع النيل', 'عنوان الشركة', 'text'),
  ('working_hours', 'الأحد - الخميس: 8ص - 5م', 'ساعات العمل الرسمية', 'text'),
  ('facebook', 'https://facebook.com/detagroup', 'رابط فيسبوك', 'text'),
  ('twitter', 'https://twitter.com/detagroup', 'رابط تويتر', 'text'),
  ('linkedin', 'https://linkedin.com/company/detagroup', 'رابط لينكدإن', 'text'),
  ('instagram', 'https://instagram.com/detagroup', 'رابط انستغرام', 'text'),
  ('years_experience', '15', 'سنوات الخبرة', 'number'),
  ('employees_count', '200', 'عدد الموظفين', 'number'),
  ('export_countries', '12', 'عدد دول التصدير', 'number'),
  ('hero_badge', 'رائدون في تصدير المحاصيل السودانية', 'شارة الواجهة الرئيسية', 'text'),
  ('footer_about', 'مجموعة ديتا للصادرات الزراعية شركة سودانية رائدة في تصدير المحاصيل عالية الجودة إلى الأسواق العالمية. نلتزم بأعلى معايير الجودة والاستدامة لبناء شراكات طويلة الأمد مع عملائنا حول العالم.', 'نبذة قصيرة عن الشركة في التذييل', 'text')
ON CONFLICT (key) DO NOTHING;

-- -------------------------------------------------------------
-- 2) ترجمات الإعدادات (site_setting_translations)
-- الأعمدة: setting_key, language_code, value
-- عربي + إنجليزي للمفاتيح: company_tagline, footer_about, hero_badge, address, working_hours
-- -------------------------------------------------------------
INSERT INTO site_setting_translations (setting_key, language_code, value) VALUES
  -- الشعار الرئيسي
  ('company_tagline', 'ar', 'من الحقول السودانية إلى الأسواق العالمية'),
  ('company_tagline', 'en', 'From Sudan''s Fields to Global Markets'),
  -- نبذة التذييل
  ('footer_about', 'ar', 'مجموعة ديتا للصادرات الزراعية شركة سودانية رائدة في تصدير المحاصيل عالية الجودة إلى الأسواق العالمية. نلتزم بأعلى معايير الجودة والاستدامة لبناء شراكات طويلة الأمد مع عملائنا حول العالم.'),
  ('footer_about', 'en', 'Deta Group for Agricultural Exports is a leading Sudanese company exporting high-quality crops to global markets. We uphold the highest standards of quality and sustainability to build long-lasting partnerships with our clients worldwide.'),
  -- شارة الواجهة
  ('hero_badge', 'ar', 'رائدون في تصدير المحاصيل السودانية'),
  ('hero_badge', 'en', 'Leaders in Exporting Sudanese Crops'),
  -- العنوان
  ('address', 'ar', 'الخرطوم، السودان - شارع النيل'),
  ('address', 'en', 'Khartoum, Sudan - Nile Street'),
  -- ساعات العمل
  ('working_hours', 'ar', 'الأحد - الخميس: 8ص - 5م'),
  ('working_hours', 'en', 'Sunday - Thursday: 8 AM - 5 PM')
ON CONFLICT (setting_key, language_code) DO NOTHING;

-- -------------------------------------------------------------
-- 3) صور الخلفية (background_images)
-- الأعمدة: title, description, url, file_path, is_active, display_order
-- الصور: hero/slide-1..6.jpg في باكت background-images
-- الحماية: WHERE NOT EXISTS
-- -------------------------------------------------------------

-- الشريحة 1: حقول السمسم في القضارف
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'حقول السمسم في القضارف', 'حقول السمسم الخضراء الممتدة في ولاية القضارف شرق السودان.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-1.jpg', NULL, true, 1
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-1.jpg');

-- الشريحة 2: الصمغ العربي من كردفان
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'الصمغ العربي من كردفان', 'أشجار الهشاب المنتجة لأجود أنواع الصمغ العربي في كردفان.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-2.jpg', NULL, true, 2
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-2.jpg');

-- الشريحة 3: خط عصر الزيوت
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'خط عصر الزيوت', 'خطوط العصر البارد الحديثة لإنتاج زيت السمسم النقي.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-3.jpg', NULL, true, 3
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-3.jpg');

-- الشريحة 4: ميناء بورتسودان للتصدير
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'ميناء بورتسودان للتصدير', 'عمليات الشحن والحاويات الجاهزة للتصدير من ميناء بورتسودان.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-4.jpg', NULL, true, 4
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-4.jpg');

-- الشريحة 5: الكركديه السوداني
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'الكركديه السوداني', 'زهرات الكركديه السوداني الفاخر المجفف بعناية للتصدير.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-5.jpg', NULL, true, 5
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-5.jpg');

-- الشريحة 6: فريق ديتا للتقنية
INSERT INTO background_images (title, description, url, file_path, is_active, display_order)
SELECT 'فريق ديتا للتقنية', 'فريق ديتا يجمع بين الخبرة الزراعية والحلول التقنية الحديثة.', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-6.jpg', NULL, true, 6
WHERE NOT EXISTS (SELECT 1 FROM background_images WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-6.jpg');

-- -------------------------------------------------------------
-- 4) الوسائط (media)
-- الأعمدة: name, url, type, size_bytes, uploaded_by
-- النوع: image/jpeg - الرفع: seed
-- القاعدة الأساسية للمنتجات والمقالات: https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/
-- صور الواجهة في باكت background-images
-- الحماية: WHERE NOT EXISTS (SELECT 1 FROM media WHERE url='<url>')
-- -------------------------------------------------------------

-- منتجات (12): صور المنتجات الزراعية
INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sesame-natural-gadaref.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-natural-gadaref.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-natural-gadaref.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sesame-hulled-premium.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-premium.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-premium.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sesame-hulled-standard.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-standard.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-standard.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'gum-hashab-handpicked.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-hashab-handpicked.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-hashab-handpicked.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'gum-talha.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-talha.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-talha.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'gum-powder-spray-dried.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-powder-spray-dried.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-powder-spray-dried.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'peanut-kernels-8090.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-kernels-8090.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-kernels-8090.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'peanut-inshell.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-inshell.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-inshell.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'hibiscus-whole.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/hibiscus-whole.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/hibiscus-whole.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sorghum-feterita.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sorghum-feterita.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sorghum-feterita.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'watermelon-seeds.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/watermelon-seeds.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/watermelon-seeds.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sesame-oil-cold-pressed.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-oil-cold-pressed.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-oil-cold-pressed.jpg');

-- مقالات (10): صور المقالات حسب السلاق
INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sesame-harvest-2026.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sesame-harvest-2026.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sesame-harvest-2026.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'gum-arabic-grades-guide.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/gum-arabic-grades-guide.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/gum-arabic-grades-guide.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'sudan-export-documents-guide.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sudan-export-documents-guide.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sudan-export-documents-guide.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'port-sudan-logistics.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/port-sudan-logistics.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/port-sudan-logistics.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'hibiscus-quality-standards.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/hibiscus-quality-standards.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/hibiscus-quality-standards.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'cold-pressed-sesame-oil-line.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/cold-pressed-sesame-oil-line.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/cold-pressed-sesame-oil-line.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'china-groundnut-market-2025.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/china-groundnut-market-2025.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/china-groundnut-market-2025.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'eco-friendly-export-packaging.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/eco-friendly-export-packaging.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/eco-friendly-export-packaging.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'deta-customs-tracking-software.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-customs-tracking-software.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-customs-tracking-software.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'deta-vision-partnerships.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-vision-partnerships.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-vision-partnerships.jpg');

-- صور الواجهة (6): نفس روابط background-images في باكت background-images
INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-1.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-1.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-1.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-2.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-2.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-2.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-3.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-3.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-3.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-4.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-4.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-4.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-5.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-5.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-5.jpg');

INSERT INTO media (name, url, type, size_bytes, uploaded_by)
SELECT 'slide-6.jpg', 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-6.jpg', 'image/jpeg', NULL, 'seed'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/background-images/hero/slide-6.jpg');
