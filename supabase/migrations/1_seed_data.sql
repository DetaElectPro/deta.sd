-- ===================================================================
-- SEED: real company data (all tables) - assembled from _parts/
-- Run AFTER 0_bootstrap_schema.sql in Dashboard > SQL Editor.
-- Image URLs assume files uploaded to Storage (see plan).
-- Idempotent: safe to re-run.
-- ===================================================================
-- ============================================
-- 01_lookups.sql — بيانات الأساس: وحدات، طرق التسليم، دول، مدن، موانئ، فئات
-- جداول lookups + categories — آمن للتكرار (idempotent)
-- يفترض أن bootstrap أنشأ الجداول الـ 21 + RLS مسبقاً
-- الترتيب: units → delivery_methods → countries → cities → ports → categories → category_translations
-- ============================================

-- ---------- 1) units: وحدات القياس (5) ----------
-- إدخال الوحدات حسب الكود — تجاهل الموجود
INSERT INTO units (code, name_ar, name_en) VALUES
  ('MT', 'طن', 'Metric Ton'),
  ('KG', 'كيلوغرام', 'Kilogram'),
  ('BAG25', 'شوال 25 كغ', '25kg Bag'),
  ('BAG50', 'شوال 50 كغ', '50kg Bag'),
  ('CTN20', 'حاوية 20 قدم', '20ft Container')
ON CONFLICT (code) DO NOTHING;

-- ---------- 2) delivery_methods: طرق التسليم (5) ----------
-- إدخال طرق التسليم حسب الكود — تجاهل الموجود
INSERT INTO delivery_methods (code, name_ar, name_en) VALUES
  ('EXW', 'تسليم مصنع', 'Ex-Works'),
  ('FOB', 'تسليم ظهر السفينة', 'Free on Board'),
  ('CFR', 'التكلفة والشحن', 'Cost and Freight'),
  ('CIF', 'التكلفة والتأمين والشحن', 'Cost Insurance Freight'),
  ('AIR', 'شحن جوي', 'Air Freight')
ON CONFLICT (code) DO NOTHING;

-- ---------- 3) countries: الدول (9) ----------
-- السودان دولة محلية is_local=true — تجاهل الموجود حسب الكود
INSERT INTO countries (code, name_ar, name_en, is_local) VALUES
  ('SD', 'السودان', 'Sudan', true),
  ('EG', 'مصر', 'Egypt', false),
  ('SA', 'السعودية', 'Saudi Arabia', false),
  ('AE', 'الإمارات', 'UAE', false),
  ('CN', 'الصين', 'China', false),
  ('TR', 'تركيا', 'Turkey', false),
  ('IN', 'الهند', 'India', false),
  ('JO', 'الأردن', 'Jordan', false),
  ('DE', 'ألمانيا', 'Germany', false)
ON CONFLICT (code) DO NOTHING;

-- ---------- 4) cities: المدن (12) ----------
-- إدخال جماعي — لا يدخل شيئاً إذا كان الجدول غير فارغ
INSERT INTO cities (country_id, name_ar, name_en, state_ar, state_en, is_capital)
SELECT * FROM (VALUES
  ((SELECT id FROM countries WHERE code = 'SD'), 'الخرطوم', 'Khartoum', 'ولاية الخرطوم', 'Khartoum State', true),
  ((SELECT id FROM countries WHERE code = 'SD'), 'أم درمان', 'Omdurman', 'ولاية الخرطوم', 'Khartoum State', false),
  ((SELECT id FROM countries WHERE code = 'SD'), 'بورتسودان', 'Port Sudan', 'البحر الأحمر', 'Red Sea', false),
  ((SELECT id FROM countries WHERE code = 'SD'), 'الأبيض', 'El Obeid', 'شمال كردفان', 'North Kordofan', false),
  ((SELECT id FROM countries WHERE code = 'SD'), 'ود مدني', 'Wad Medani', 'الجزيرة', 'Gezira', false),
  ((SELECT id FROM countries WHERE code = 'SD'), 'القضارف', 'Gedaref', 'القضارف', 'Gedaref', false),
  ((SELECT id FROM countries WHERE code = 'EG'), 'القاهرة', 'Cairo', 'القاهرة', 'Cairo', false),
  ((SELECT id FROM countries WHERE code = 'SA'), 'جدة', 'Jeddah', 'مكة', 'Makkah', false),
  ((SELECT id FROM countries WHERE code = 'AE'), 'دبي', 'Dubai', 'دبي', 'Dubai', false),
  ((SELECT id FROM countries WHERE code = 'CN'), 'قوانغتشو', 'Guangzhou', 'قوانغدونغ', 'Guangdong', false),
  ((SELECT id FROM countries WHERE code = 'TR'), 'إسطنبول', 'Istanbul', 'إسطنبول', 'Istanbul', false),
  ((SELECT id FROM countries WHERE code = 'IN'), 'مومباي', 'Mumbai', 'ماهاراشترا', 'Maharashtra', false)
) AS s(country_id, name_ar, name_en, state_ar, state_en, is_capital)
WHERE NOT EXISTS (SELECT 1 FROM cities);

-- ---------- 5) ports: الموانئ (5) ----------
-- إدخال الموانئ حسب الكود — تجاهل الموجود
INSERT INTO ports (country_id, code, name_ar, name_en, port_type, is_active) VALUES
  ((SELECT id FROM countries WHERE code = 'SD'), 'PZU', 'ميناء بورتسودان', 'Port Sudan', 'sea', true),
  ((SELECT id FROM countries WHERE code = 'SD'), 'SWK', 'ميناء سواكن', 'Suakin Seaport', 'sea', true),
  ((SELECT id FROM countries WHERE code = 'SD'), 'KRT', 'الميناء الجاف بالخرطوم', 'Khartoum Dry Port', 'dry', true),
  ((SELECT id FROM countries WHERE code = 'AE'), 'JEA', 'ميناء جبل علي', 'Jebel Ali Port', 'sea', true),
  ((SELECT id FROM countries WHERE code = 'SA'), 'JED', 'ميناء جدة الإسلامي', 'Jeddah Islamic Port', 'sea', true)
ON CONFLICT (code) DO NOTHING;

-- ---------- 6) categories: الفئات (4) بمعرفات ثابتة ----------
-- إدخال الفئة: oil-seeds — الحبوب الزيتية
INSERT INTO categories (id, slug, name, description, color)
SELECT '10000000-0000-4000-8000-000000000001', 'oil-seeds', 'الحبوب الزيتية', 'حبوب زيتية سودانية فاخرة مثل السمسم والفول السوداني بمواصفات تصديرية معتمدة.', '#2D5016'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = '10000000-0000-4000-8000-000000000001');

-- إدخال الفئة: gums — الصمغ العربي
INSERT INTO categories (id, slug, name, description, color)
SELECT '10000000-0000-4000-8000-000000000002', 'gums', 'الصمغ العربي', 'صمغ عربي سوداني أصيل من كردفان بأنواع الهشاب والطلح بجودة عالمية للصناعات الغذائية والدوائية.', '#D4AF37'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = '10000000-0000-4000-8000-000000000002');

-- إدخال الفئة: oils — الزيوت الغذائية
INSERT INTO categories (id, slug, name, description, color)
SELECT '10000000-0000-4000-8000-000000000003', 'oils', 'الزيوت الغذائية', 'زيوت غذائية نقية معصورة من الحبوب السودانية بجودة عالية ومناسبة للاستهلاك والتصدير.', '#4A7C59'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = '10000000-0000-4000-8000-000000000003');

-- إدخال الفئة: grains — الحبوب والبقوليات
INSERT INTO categories (id, slug, name, description, color)
SELECT '10000000-0000-4000-8000-000000000004', 'grains', 'الحبوب والبقوليات', 'حبوب وبقوليات سودانية متنوعة بجودة تصديرية موثوقة ومناسبة للأسواق العالمية.', '#8B4513'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = '10000000-0000-4000-8000-000000000004');

-- ---------- 7) category_translations: ترجمات الفئات (8 = 4 × عربي+إنجليزي) ----------
-- ترجمات الفئات عربي + إنجليزي — تجاهل الموجود حسب (category_id, language_code)
INSERT INTO category_translations (category_id, language_code, name, slug, description) VALUES
  ('10000000-0000-4000-8000-000000000001', 'ar', 'الحبوب الزيتية', 'oil-seeds', 'حبوب زيتية سودانية فاخرة مثل السمسم والفول السوداني وزهرة الشمس، بمواصفات تصديرية معتمدة ونقاوة عالية.'),
  ('10000000-0000-4000-8000-000000000001', 'en', 'Oil Seeds', 'oil-seeds', 'Premium Sudanese oil seeds such as sesame, groundnuts and sunflower, with certified export specifications and high purity.'),
  ('10000000-0000-4000-8000-000000000002', 'ar', 'الصمغ العربي', 'gums', 'صمغ عربي سوداني أصيل من كردفان بأنواع الهشاب والطلح، منقى بعناية وذو ذوبانية ممتازة للصناعات الغذائية والدوائية.'),
  ('10000000-0000-4000-8000-000000000002', 'en', 'Gum Arabic', 'gums', 'Authentic Sudanese gum arabic from Kordofan, Hashab and Talha grades, carefully cleaned with excellent solubility for food and pharmaceutical industries.'),
  ('10000000-0000-4000-8000-000000000003', 'ar', 'الزيوت الغذائية', 'oils', 'زيوت غذائية نقية معصورة من الحبوب السودانية بجودة عالية، مناسبة للاستهلاك المحلي والتصدير للأسواق العالمية.'),
  ('10000000-0000-4000-8000-000000000003', 'en', 'Edible Oils', 'oils', 'Pure edible oils pressed from Sudanese seeds with high quality, suitable for consumption and export to global markets.'),
  ('10000000-0000-4000-8000-000000000004', 'ar', 'الحبوب والبقوليات', 'grains', 'حبوب وبقوليات سودانية متنوعة بجودة تصديرية موثوقة، مناسبة للمطاحن ومصانع الأغذية والأسواق العالمية.'),
  ('10000000-0000-4000-8000-000000000004', 'en', 'Grains & Legumes', 'grains', 'Diverse Sudanese grains and legumes with reliable export quality, suitable for mills, food factories and global markets.')
ON CONFLICT (category_id, language_code) DO NOTHING;
 -- ============================================
-- 02_products_a.sql — منتجات الزيوت والصمغ (6 منتجات)
-- جدول products + product_translations — آمن للتكرار (idempotent)
-- الأسعار بالدولار للطن المتري FOB ميناء بورتسودان
-- ============================================

-- ---------- 1) سمسم طبيعي فاخر (القضارف) ----------
-- إدخال المنتج: sesame-natural-gadaref
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-natural-gadaref.jpg',
  1620, 1620, 19, true, true, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000001');

-- ترجمات المنتج: عربي + إنجليزي
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000001', 'ar', 'سمسم طبيعي فاخر (القضارف)', 'سمسم طبيعي فاخر من القضارف، السودان، بدرجة نقاوة 99/1 ورطوبة أقل من 6% ونسبة زيت عالية، مثالي للعصر وإنتاج الطحينة. معبأ في أكياس PP بوزن 25/50 كغ، ومناسب للتصدير بكميات الحاويات. السعر بالدولار للطن المتري FOB ميناء بورتسودان - سعر استرشادي يثبت بعرض رسمي.', 'sesame-natural-gadaref'),
('20000000-0000-4000-8000-000000000001', 'en', 'Premium Natural Sesame (Gedaref)', 'Premium natural sesame from Gedaref, Sudan, with 99/1 purity, below 6% moisture and high oil content, ideal for pressing and tahini production. Packed in 25/50kg PP bags, suitable for container export. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'sesame-natural-gadaref')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- ---------- 2) سمسم مقشور ممتاز ----------
-- إدخال المنتج: sesame-hulled-premium
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000001',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-premium.jpg',
  1150, 1150, 19, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000002');

-- ترجمات المنتج: عربي + إنجليزي
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000002', 'ar', 'سمسم مقشور ممتاز 99.95%', 'سمسم مقشور ممتاز من السودان بنسبة نقاوة 99.95% ورطوبة أقل من 5%، مثالي لصناعة الطحينة والحلاوة والمخابز. معبأ في أكياس PP غذائية بوزن 25/50 كغ بجودة تصديرية. السعر بالدولار للطن المتري FOB ميناء بورتسودان - سعر استرشادي يثبت بعرض رسمي.', 'sesame-hulled-premium'),
('20000000-0000-4000-8000-000000000002', 'en', 'Premium Hulled Sesame 99.95%', 'Premium hulled sesame from Sudan with 99.95% purity and below 5% moisture, ideal for tahini, halawa and bakery. Packed in food-grade 25/50kg PP bags with export quality. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'sesame-hulled-premium')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- ---------- 3) سمسم مقشور قياسي ----------
-- إدخال المنتج: sesame-hulled-standard
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000003',
  '10000000-0000-4000-8000-000000000001',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-hulled-standard.jpg',
  930, 930, 19, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000003');

-- ترجمات المنتج: عربي + إنجليزي
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000003', 'ar', 'سمسم مقشور قياسي', 'سمسم مقشور قياسي من السودان بمواصفات تصديرية مستقرة ورطوبة منخفضة، مناسب للمطاحن ومصانع الأغذية. معبأ في أكياس PP بوزن 25/50 كغ. السعر بالدولار للطن المتري FOB ميناء بورتسودان - سعر استرشادي يثبت بعرض رسمي.', 'sesame-hulled-standard'),
('20000000-0000-4000-8000-000000000003', 'en', 'Standard Hulled Sesame', 'Standard hulled sesame from Sudan with stable export specs and low moisture, suitable for mills and food factories. Packed in 25/50kg PP bags. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'sesame-hulled-standard')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- ---------- 4) صمغ هشاب منقى يدوياً ----------
-- إدخال المنتج: gum-hashab-handpicked
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000002',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-hashab-handpicked.jpg',
  3200, 3200, 19, true, true, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000004');

-- ترجمات المنتج: عربي + إنجليزي
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000004', 'ar', 'صمغ هشاب منقى يدوياً', 'صمغ هشاب (أكاسيا سنغال) من كردفان، السودان، منقى يدوياً بدرجة نقاوة عالية وذوبانية ممتازة للصناعات الغذائية والدوائية. معبأ في أكياس PP بوزن 25/50 كغ. السعر بالدولار للطن المتري FOB ميناء بورتسودان - سعر استرشادي يثبت بعرض رسمي.', 'gum-hashab-handpicked'),
('20000000-0000-4000-8000-000000000004', 'en', 'Hand-Picked Hashab Gum Arabic', 'Hand-picked Hashab gum arabic (Acacia Senegal) from Kordofan, Sudan, with high purity and excellent solubility for food and pharmaceutical industries. Packed in 25/50kg PP bags. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'gum-hashab-handpicked')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- ---------- 5) صمغ طلح سوداني ----------
-- إدخال المنتج: gum-talha
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000005',
  '10000000-0000-4000-8000-000000000002',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-talha.jpg',
  2600, 2600, 19, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000005');

-- ترجمات المنتج: عربي + إنجليزي
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000005', 'ar', 'صمغ طلح سوداني', 'صمغ طلح سوداني (أكاسيا سيال) من السودان، مناسب لتطبيقات الأغذية والأعلاف والصناعات الكيميائية بمواصفات تصديرية موثوقة. معبأ في أكياس PP بوزن 25/50 كغ. السعر بالدولار للطن المتري FOB ميناء بورتسودان - سعر استرشادي يثبت بعرض رسمي.', 'gum-talha'),
('20000000-0000-4000-8000-000000000005', 'en', 'Talha Gum Arabic', 'Sudanese Talha gum arabic (Acacia Seyal) from Sudan, suitable for food, feed and industrial applications with reliable export specs. Packed in 25/50kg PP bags. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'gum-talha')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- ---------- 6) صمغ عربي بودرة مجففة بالرذاذ ----------
-- إدخال المنتج: gum-powder-spray-dried
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT
  '20000000-0000-4000-8000-000000000006',
  '10000000-0000-4000-8000-000000000002',
  (SELECT id FROM units WHERE code = 'MT'),
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/gum-powder-spray-dried.jpg',
  4200, 4200, 5, true, false, true, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '20000000-0000-4000-8000-000000000006');

-- ترجمات المنتج: عربي + إنجليزي
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000006', 'ar', 'صمغ عربي بودرة مجففة بالرذاذ', 'بودرة صمغ عربي مجففة بالرذاذ من السودان بدرجة mesh ناعمة وذوبانية فورية، مخصصة للمشروبات والحلويات ومنتجات الألبان. معبأة في أكياس 25 كغ مع بطانة غذائية. السعر بالدولار للطن المتري FOB ميناء بورتسودان - سعر استرشادي يثبت بعرض رسمي.', 'gum-powder-spray-dried'),
('20000000-0000-4000-8000-000000000006', 'en', 'Spray-Dried Gum Arabic Powder', 'Spray-dried gum arabic powder from Sudan with fine mesh and instant solubility, for beverages, confectionery and dairy. Packed in 25kg bags with food-grade liner. USD per metric ton FOB Port Sudan - indicative price, confirmed by official quotation.', 'gum-powder-spray-dried')
ON CONFLICT (product_id, language_code) DO NOTHING;
 -- 03_products_b.sql
-- الجزء الثاني من المنتجات (6 منتجات: 7..12) — آمن لإعادة التشغيل
-- العملة: دولار أمريكي للطن المتري FOB ميناء بورتسودان
-- الوحدة: MT — الفئات والوحدات ثابتة مسبقا

-- 7) فول سوداني حب 80/90 — بذور زيتية
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-kernels-8090.jpg', 1350, 1350, 19, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000007');

-- 8) فول سوداني بقشره — بذور زيتية
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/peanut-inshell.jpg', 980, 980, 19, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000008');

-- 9) كركديه سوداني مجفف — حبوب
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000004', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/hibiscus-whole.jpg', 2200, 2200, 10, true, true, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000009');

-- 10) ذرة فتريتة سودانية — حبوب
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000004', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sorghum-feterita.jpg', 430, 430, 20, true, false, false, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000010');

-- 11) حب بطيخ (لب) — حبوب
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000004', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/watermelon-seeds.jpg', 2400, 2400, 10, true, false, true, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000011');

-- 12) زيت سمسم معصور على البارد — زيوت
INSERT INTO products (id, category_id, unit_id, image_url, price, price_per_unit, min_order_quantity, is_available, is_featured, is_new, export_only)
SELECT '20000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000003', (SELECT id FROM units WHERE code='MT'), 'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/products/sesame-oil-cold-pressed.jpg', 3400, 3400, 5, true, true, true, false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id='20000000-0000-4000-8000-000000000012');

-- الترجمات (عربي + إنجليزي لكل منتج) — تجاهل الموجود مسبقا

-- 7) peanut-kernels-8090
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000007', 'ar', 'فول سوداني حب 80/90', 'فول سوداني حب سوداني المنشأ بعيار 80/90 حبة بالأونصة، مجفف ومفرز بعناية لنسبة كسر منخفضة وجودة تصدير عالية. متوفر للتصدير بتعبئة 25/50 كجم، بسعر استرشادي 1350 دولار للطن FOB ميناء بورتسودان، سعر استرشادي يثبت بعرض رسمي.', 'peanut-kernels-8090'),
('20000000-0000-4000-8000-000000000007', 'en', 'Groundnut Kernels 80/90', 'Sudanese-origin groundnut kernels, count 80/90 per ounce, carefully dried and sorted for low breakage and high export quality. Available for export in 25/50 kg bags at an indicative price of USD 1350 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'peanut-kernels-8090')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- 8) peanut-inshell
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000008', 'ar', 'فول سوداني بقشره', 'فول سوداني سوداني بقشره بجودة تصدير، حبات ممتلئة ومجففة جيدا مع فرز دقيق للأحجام. متوفر للتصدير بتعبئة شائعة 30 كجم، بسعر استرشادي 980 دولار للطن FOB ميناء بورتسودان، سعر استرشادي يثبت بعرض رسمي.', 'peanut-inshell'),
('20000000-0000-4000-8000-000000000008', 'en', 'In-Shell Groundnuts', 'Sudanese in-shell groundnuts of export quality, well-dried full pods with careful size grading. Available for export in standard 30 kg packing at an indicative price of USD 980 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'peanut-inshell')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- 9) hibiscus-whole
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000009', 'ar', 'كركديه سوداني مجفف', 'كركديه سوداني مجفف كامل عالي الجودة بلون أحمر غامق وحموضة طبيعية مميزة، منظف ومفرز للتصدير الغذائي. متوفر للتصدير بتعبئة 25/50 كجم، بسعر استرشادي 2200 دولار للطن FOB ميناء بورتسودان، سعر استرشادي يثبت بعرض رسمي.', 'hibiscus-whole'),
('20000000-0000-4000-8000-000000000009', 'en', 'Dried Sudanese Hibiscus', 'Whole dried Sudanese hibiscus of premium quality with deep red color and distinctive natural acidity, cleaned and sorted for food export. Available for export in 25/50 kg bags at an indicative price of USD 2200 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'hibiscus-whole')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- 10) sorghum-feterita
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000010', 'ar', 'ذرة فتريتة سودانية', 'ذرة فتريتة سودانية بجودة تصدير للأعلاف والاستهلاك الغذائي، نظيفة وجافة برطوبة مناسبة للشحن الطويل. متوفرة للتصدير سائب أو بتعبئة 50 كجم، بسعر استرشادي 430 دولار للطن FOB ميناء بورتسودان، سعر استرشادي يثبت بعرض رسمي.', 'sorghum-feterita'),
('20000000-0000-4000-8000-000000000010', 'en', 'Sudanese Feterita Sorghum', 'Sudanese Feterita sorghum of export quality for feed and food use, cleaned and dried to safe moisture for long shipment. Available for export in bulk or 50 kg bags at an indicative price of USD 430 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'sorghum-feterita')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- 11) watermelon-seeds
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000011', 'ar', 'حب بطيخ (لب)', 'لب حب بطيخ سوداني مجفف عالي الجودة للتسالي والتحميص، حبات كبيرة ونظيفة بفرز دقيق. متوفر للتصدير بتعبئة 25/50 كجم، بسعر استرشادي 2400 دولار للطن FOB ميناء بورتسودان، سعر استرشادي يثبت بعرض رسمي.', 'watermelon-seeds'),
('20000000-0000-4000-8000-000000000011', 'en', 'Watermelon Seeds', 'High-quality dried Sudanese watermelon seeds for snacking and roasting, large clean kernels with precise sorting. Available for export in 25/50 kg bags at an indicative price of USD 2400 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'watermelon-seeds')
ON CONFLICT (product_id, language_code) DO NOTHING;

-- 12) sesame-oil-cold-pressed
INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES
('20000000-0000-4000-8000-000000000012', 'ar', 'زيت سمسم معصور على البارد', 'زيت سمسم سوداني معصور على البارد من سمسم أبيض فاخر، بنكهة طبيعية غنية مناسب للأسواق الغذائية والتجزئة. متوفر للتصدير بتعبئة غذائية متنوعة، بسعر استرشادي 3400 دولار للطن FOB ميناء بورتسودان، سعر استرشادي يثبت بعرض رسمي.', 'sesame-oil-cold-pressed'),
('20000000-0000-4000-8000-000000000012', 'en', 'Cold-Pressed Sesame Oil', 'Sudanese cold-pressed sesame oil from premium white sesame, rich natural flavor suitable for food and retail markets. Available for export in assorted food-grade packing at an indicative price of USD 3400 per MT FOB Port Sudan, indicative price, confirmed by official quotation.', 'sesame-oil-cold-pressed')
ON CONFLICT (product_id, language_code) DO NOTHING;
 -- =============================================================
-- الجزء 04 (أ): المقالات — الدفعة الأولى (5 مقالات)
-- الملف: supabase/migrations/_parts/04_articles_a.sql
-- الوصف: إدخال 5 مقالات بمعرفات UUID ثابتة + ترجمتين (ar/en) لكل مقال
-- ملاحظات:
-- - الملف آمن للتكرار (idempotent): المقالات محمية بشرط NOT EXISTS
--   والترجمات محمية بشرط ON CONFLICT DO NOTHING
-- - عنوان الجدول الأساسي (articles.title) باللغة العربية
-- - اللغتان ar و en موجودتان مسبقاً في جدول اللغات
-- - مسار الصور: bucket عام (media) تحت articles/<slug>.jpg
-- =============================================================

-- -------------------------------------------------------------
-- المقال 1: موسم حصاد السمسم في القضارف 2026
-- -------------------------------------------------------------
INSERT INTO articles (id, title, slug, excerpt, content, author, category, image_url, image_path, is_featured, published_at, created_at, updated_at)
SELECT
  '30000000-0000-4000-8000-000000000001'::uuid,
  'موسم حصاد السمسم في القضارف 2026: جودة عالية وجاهزية للتصدير',
  'sesame-harvest-2026',
  'انطلق موسم حصاد السمسم في القضارف بمحصول وفير وجودة استثنائية، مع جاهزية كاملة للتنظيف والفرز والتعبئة والتصدير إلى الأسواق العالمية.',
  'بدأ مزارعو القضارف حصاد السمسم الأبيض والأحمر وسط مؤشرات إيجابية على الإنتاجية والجودة، بفضل الأمطار المنتظمة والمتابعة الحقلية الجيدة خلال الموسم الزراعي.

تخضع المحاصيل بعد الحصاد لعمليات التجفيف والتنظيف والفرز الآلي لضمان نقاء عال يصل إلى 99/1، مع فحص دقيق لنسبة الرطوبة والشوائب قبل التخزين في مخازن مجهزة وجيدة التهوية.

جهزت مجموعة ديتا دفعات تصديرية بمواصفات تناسب أسواق الخليج وآسيا، مع خيارات تعبئة متنوعة من أكياس البولي بروبلين إلى التعبئة المخصصة حسب طلب المشتري، وفحص جودة معتمد قبل الشحن.

ننصح المشترين بتثبيت احتياجاتهم مبكرا خلال ذروة الموسم للحصول على أفضل الأسعار وضمان استمرارية الإمداد حتى نهاية العام.',
  'م. محمد الفاتح عبد الله',
  'حصاد ومحاصيل',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sesame-harvest-2026.jpg',
  'articles/sesame-harvest-2026.jpg',
  true,
  '2026-09-10 08:00:00+00'::timestamptz,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE id = '30000000-0000-4000-8000-000000000001'::uuid);

-- ترجمة المقال 1: العربية (مطابقة للسجل الأساسي)
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000001'::uuid,
  'ar',
  'موسم حصاد السمسم في القضارف 2026: جودة عالية وجاهزية للتصدير',
  'انطلق موسم حصاد السمسم في القضارف بمحصول وفير وجودة استثنائية، مع جاهزية كاملة للتنظيف والفرز والتعبئة والتصدير إلى الأسواق العالمية.',
  'بدأ مزارعو القضارف حصاد السمسم الأبيض والأحمر وسط مؤشرات إيجابية على الإنتاجية والجودة، بفضل الأمطار المنتظمة والمتابعة الحقلية الجيدة خلال الموسم الزراعي.

تخضع المحاصيل بعد الحصاد لعمليات التجفيف والتنظيف والفرز الآلي لضمان نقاء عال يصل إلى 99/1، مع فحص دقيق لنسبة الرطوبة والشوائب قبل التخزين في مخازن مجهزة وجيدة التهوية.

جهزت مجموعة ديتا دفعات تصديرية بمواصفات تناسب أسواق الخليج وآسيا، مع خيارات تعبئة متنوعة من أكياس البولي بروبلين إلى التعبئة المخصصة حسب طلب المشتري، وفحص جودة معتمد قبل الشحن.

ننصح المشترين بتثبيت احتياجاتهم مبكرا خلال ذروة الموسم للحصول على أفضل الأسعار وضمان استمرارية الإمداد حتى نهاية العام.',
  'sesame-harvest-2026'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ترجمة المقال 1: الإنجليزية
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000001'::uuid,
  'en',
  'Gedaref Sesame Harvest 2026: Premium Quality and Export Readiness',
  'The sesame harvest is under way in Gedaref with abundant volumes and exceptional quality, fully prepared for cleaning, sorting, packing, and export to global markets.',
  'Farmers across Gedaref have started harvesting white and red sesame amid strong indicators for yield and quality, supported by well-distributed rainfall and sound field management throughout the growing season.

After harvest, the crop goes through drying, mechanical cleaning, and color sorting to ensure high purity of up to 99/1, with careful checks on moisture content and admixture before storage in well-ventilated warehouses.

Deta Group has prepared export-ready lots tailored to Gulf and Asian market specifications, with flexible packing options from polypropylene bags to buyer-specific private packing, and certified quality inspection before shipment.

We advise buyers to confirm their requirements early in the peak season to secure the best prices and guarantee continuous supply through the end of the year.',
  'sesame-harvest-2026'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- -------------------------------------------------------------
-- المقال 2: دليل درجات الصمغ العربي
-- -------------------------------------------------------------
INSERT INTO articles (id, title, slug, excerpt, content, author, category, image_url, image_path, is_featured, published_at, created_at, updated_at)
SELECT
  '30000000-0000-4000-8000-000000000002'::uuid,
  'دليل درجات الصمغ العربي: الهشاب مقابل الطلحة — المواصفات والاستخدامات',
  'gum-arabic-grades-guide',
  'تعرف على الفرق بين صمغ الهشاب وصمغ الطلحة من حيث المواصفات والذوبانية والاستخدامات الصناعية، وكيف تختار الدرجة المناسبة لاحتياجك.',
  'يعد الصمغ العربي السوداني من أجود أنواع الصمغ في العالم، وينقسم إلى نوعين رئيسيين: صمغ الهشاب عالي الجودة وصمغ الطلحة متعدد الاستخدامات، ويختلف كل منهما في الخصائص والسعر ومجالات الاستخدام.

يتميز صمغ الهشاب بلونه الفاتح وذوبانيته العالية ونقائه، لذلك يستخدم في الصناعات الغذائية والدوائية ومستحضرات التجميل، بينما يستخدم صمغ الطلحة في التطبيقات الصناعية مثل الأحبار والمنسوجات والدهانات والمواد اللاصقة.

تشمل معايير الجودة اللون والحجم والنقاء ونسبة الرطوبة وخلو المنتج من الشوائب واللحاء، مع فرز يدوي وآلي واختبارات جودة دقيقة قبل التعبئة لضمان مطابقة المواصفات المتفق عليها.

نوفر في مجموعة ديتا درجات كاملة ومغربلة ومطحونة حسب الطلب، مع شهادات جودة وتحليل مخبري لكل شحنة تصديرية، ونساعد المشترين على اختيار الدرجة الأنسب لتطبيقهم الصناعي وميزانيتهم.',
  'د. سارة أحمد الحسن',
  'أدلة الجودة',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/gum-arabic-grades-guide.jpg',
  'articles/gum-arabic-grades-guide.jpg',
  false,
  '2026-08-22 08:00:00+00'::timestamptz,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE id = '30000000-0000-4000-8000-000000000002'::uuid);

-- ترجمة المقال 2: العربية (مطابقة للسجل الأساسي)
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000002'::uuid,
  'ar',
  'دليل درجات الصمغ العربي: الهشاب مقابل الطلحة — المواصفات والاستخدامات',
  'تعرف على الفرق بين صمغ الهشاب وصمغ الطلحة من حيث المواصفات والذوبانية والاستخدامات الصناعية، وكيف تختار الدرجة المناسبة لاحتياجك.',
  'يعد الصمغ العربي السوداني من أجود أنواع الصمغ في العالم، وينقسم إلى نوعين رئيسيين: صمغ الهشاب عالي الجودة وصمغ الطلحة متعدد الاستخدامات، ويختلف كل منهما في الخصائص والسعر ومجالات الاستخدام.

يتميز صمغ الهشاب بلونه الفاتح وذوبانيته العالية ونقائه، لذلك يستخدم في الصناعات الغذائية والدوائية ومستحضرات التجميل، بينما يستخدم صمغ الطلحة في التطبيقات الصناعية مثل الأحبار والمنسوجات والدهانات والمواد اللاصقة.

تشمل معايير الجودة اللون والحجم والنقاء ونسبة الرطوبة وخلو المنتج من الشوائب واللحاء، مع فرز يدوي وآلي واختبارات جودة دقيقة قبل التعبئة لضمان مطابقة المواصفات المتفق عليها.

نوفر في مجموعة ديتا درجات كاملة ومغربلة ومطحونة حسب الطلب، مع شهادات جودة وتحليل مخبري لكل شحنة تصديرية، ونساعد المشترين على اختيار الدرجة الأنسب لتطبيقهم الصناعي وميزانيتهم.',
  'gum-arabic-grades-guide'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ترجمة المقال 2: الإنجليزية
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000002'::uuid,
  'en',
  'Gum Arabic Grades Guide: Hashab vs Talha — Specifications and Uses',
  'Learn the difference between Hashab and Talha gum arabic in solubility, specifications, and industrial uses, and how to choose the right grade for your needs.',
  'Sudanese gum arabic is regarded among the finest in the world. It is divided into two main types: premium Hashab gum and versatile Talha gum, each differing in properties, price, and end use.

Hashab gum is prized for its light color, high solubility, and purity, making it ideal for food, pharmaceutical, and cosmetic applications, while Talha gum serves industrial uses such as inks, textiles, paints, and adhesives.

Key quality criteria include color, nodule size, purity, moisture content, and freedom from bark and foreign matter, verified through combined hand and mechanical sorting plus laboratory testing before packing.

Deta Group supplies whole, sifted, and powdered grades on request, with quality certificates and lab analysis for every export shipment, and our team helps buyers select the most suitable and cost-effective grade for their application.',
  'gum-arabic-grades-guide'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- -------------------------------------------------------------
-- المقال 3: دليل مستندات التصدير من السودان
-- -------------------------------------------------------------
INSERT INTO articles (id, title, slug, excerpt, content, author, category, image_url, image_path, is_featured, published_at, created_at, updated_at)
SELECT
  '30000000-0000-4000-8000-000000000003'::uuid,
  'دليل مستندات التصدير من السودان خطوة بخطوة',
  'sudan-export-documents-guide',
  'دليلك العملي لمستندات التصدير من السودان: شهادة المنشأ والشهادة الصحية وشهادة التبخير وبوليصة الشحن، مع نصائح عملية لتفادي التأخير في الموانئ.',
  'تتطلب عملية تصدير المحاصيل من السودان تجهيز مجموعة من المستندات الأساسية، وأي نقص فيها قد يسبب تأخيرا مكلفا في الميناء أو عند التخليص في بلد الوصول، لذلك من المهم فهم كل مستند ودوره.

تشمل المستندات الرئيسية الفاتورة التجارية وقائمة التعبئة وشهادة المنشأ والشهادة الصحية النباتية وشهادة التبخير وبوليصة الشحن، إضافة إلى شهادة الجودة أو التحليل المخبري حسب متطلبات المشتري.

تبدأ الخطوات بتجهيز العقد والفاتورة، ثم استخراج شهادة المنشأ والشهادات الصحية، وبعدها تنفيذ التبخير المعتمد للحاويات، وأخيرا إصدار بوليصة الشحن بعد تحميل البضاعة ومغادرة السفينة.

في مجموعة ديتا نجهز كامل الحزمة المستندية نيابة عن المشتري، ونتأكد من تطابق الأسماء والأوزان والأرقام في جميع المستندات، مع إرسال نسخ إلكترونية مسبقة لتسريع التخليص الجمركي.',
  'م. محمد الفاتح عبد الله',
  'أدلة التصدير',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/sudan-export-documents-guide.jpg',
  'articles/sudan-export-documents-guide.jpg',
  false,
  '2026-07-15 08:00:00+00'::timestamptz,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE id = '30000000-0000-4000-8000-000000000003'::uuid);

-- ترجمة المقال 3: العربية (مطابقة للسجل الأساسي)
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000003'::uuid,
  'ar',
  'دليل مستندات التصدير من السودان خطوة بخطوة',
  'دليلك العملي لمستندات التصدير من السودان: شهادة المنشأ والشهادة الصحية وشهادة التبخير وبوليصة الشحن، مع نصائح عملية لتفادي التأخير في الموانئ.',
  'تتطلب عملية تصدير المحاصيل من السودان تجهيز مجموعة من المستندات الأساسية، وأي نقص فيها قد يسبب تأخيرا مكلفا في الميناء أو عند التخليص في بلد الوصول، لذلك من المهم فهم كل مستند ودوره.

تشمل المستندات الرئيسية الفاتورة التجارية وقائمة التعبئة وشهادة المنشأ والشهادة الصحية النباتية وشهادة التبخير وبوليصة الشحن، إضافة إلى شهادة الجودة أو التحليل المخبري حسب متطلبات المشتري.

تبدأ الخطوات بتجهيز العقد والفاتورة، ثم استخراج شهادة المنشأ والشهادات الصحية، وبعدها تنفيذ التبخير المعتمد للحاويات، وأخيرا إصدار بوليصة الشحن بعد تحميل البضاعة ومغادرة السفينة.

في مجموعة ديتا نجهز كامل الحزمة المستندية نيابة عن المشتري، ونتأكد من تطابق الأسماء والأوزان والأرقام في جميع المستندات، مع إرسال نسخ إلكترونية مسبقة لتسريع التخليص الجمركي.',
  'sudan-export-documents-guide'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ترجمة المقال 3: الإنجليزية
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000003'::uuid,
  'en',
  'Sudan Export Documents Guide: Step-by-Step Paperwork',
  'Your practical guide to export paperwork from Sudan: certificate of origin, phytosanitary certificate, fumigation certificate, and bill of lading, with tips to avoid port delays.',
  'Exporting crops from Sudan requires a complete set of core documents, and any missing paper can cause costly delays at the port or during clearance at destination, so it is essential to understand each document and its purpose.

The main documents include the commercial invoice, packing list, certificate of origin, phytosanitary certificate, fumigation certificate, and bill of lading, plus a quality or laboratory analysis certificate depending on buyer requirements.

The process starts with the contract and invoice, followed by issuance of the certificate of origin and health certificates, then certified container fumigation, and finally release of the bill of lading after loading and vessel departure.

At Deta Group we prepare the full documentary package on behalf of the buyer, verify that names, weights, and numbers match across all documents, and share advance electronic copies to speed up customs clearance.',
  'sudan-export-documents-guide'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- -------------------------------------------------------------
-- المقال 4: الشحن عبر ميناء بورتسودان
-- -------------------------------------------------------------
INSERT INTO articles (id, title, slug, excerpt, content, author, category, image_url, image_path, is_featured, published_at, created_at, updated_at)
SELECT
  '30000000-0000-4000-8000-000000000004'::uuid,
  'الشحن عبر ميناء بورتسودان: FOB وCIF وتجهيز الحاويات ومدد الوصول',
  'port-sudan-logistics',
  'كل ما تحتاج معرفته عن الشحن عبر ميناء بورتسودان: الفرق بين FOB وCIF، وتجهيز الحاويات، ومدد العبور إلى جدة وجبل علي والموانئ العالمية.',
  'يعد ميناء بورتسودان البوابة الرئيسية لصادرات السودان الزراعية، ومن خلاله تخرج شحنات السمسم والصمغ العربي والكركديه والفول السوداني إلى موانئ البحر الأحمر والخليج وآسيا.

يتاح الشحن بشروط FOB حيث يستلم المشتري البضاعة على ظهر السفينة في بورتسودان، أو بشروط CIF حيث نتحمل الشحن والتأمين حتى ميناء الوصول، ويعتمد الاختيار على خبرة المشتري في الشحن ورغبته في إدارة التكاليف.

تشمل عملية تجهيز الحاويات الوزن الدقيق ووضع البالتات أو التحميل السائب حسب المنتج، مع التبخير المعتمد ووضع أكياس التجفيف عند الحاجة لحماية البضاعة من الرطوبة أثناء الرحلة البحرية.

تستغرق الرحلة من بورتسودان إلى جدة أياما قليلة، وإلى جبل علي نحو أسبوع تقريبا حسب الخط الملاحي، مع إمكانية الشحن إلى موانئ أخرى عبر الترانزيت، ونوفر لعملائنا جدولا واضحا ومتابعة لحظية حتى وصول الحاوية.',
  'م. خالد مصطفى الأمين',
  'لوجستيات',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/port-sudan-logistics.jpg',
  'articles/port-sudan-logistics.jpg',
  false,
  '2026-06-30 08:00:00+00'::timestamptz,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE id = '30000000-0000-4000-8000-000000000004'::uuid);

-- ترجمة المقال 4: العربية (مطابقة للسجل الأساسي)
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000004'::uuid,
  'ar',
  'الشحن عبر ميناء بورتسودان: FOB وCIF وتجهيز الحاويات ومدد الوصول',
  'كل ما تحتاج معرفته عن الشحن عبر ميناء بورتسودان: الفرق بين FOB وCIF، وتجهيز الحاويات، ومدد العبور إلى جدة وجبل علي والموانئ العالمية.',
  'يعد ميناء بورتسودان البوابة الرئيسية لصادرات السودان الزراعية، ومن خلاله تخرج شحنات السمسم والصمغ العربي والكركديه والفول السوداني إلى موانئ البحر الأحمر والخليج وآسيا.

يتاح الشحن بشروط FOB حيث يستلم المشتري البضاعة على ظهر السفينة في بورتسودان، أو بشروط CIF حيث نتحمل الشحن والتأمين حتى ميناء الوصول، ويعتمد الاختيار على خبرة المشتري في الشحن ورغبته في إدارة التكاليف.

تشمل عملية تجهيز الحاويات الوزن الدقيق ووضع البالتات أو التحميل السائب حسب المنتج، مع التبخير المعتمد ووضع أكياس التجفيف عند الحاجة لحماية البضاعة من الرطوبة أثناء الرحلة البحرية.

تستغرق الرحلة من بورتسودان إلى جدة أياما قليلة، وإلى جبل علي نحو أسبوع تقريبا حسب الخط الملاحي، مع إمكانية الشحن إلى موانئ أخرى عبر الترانزيت، ونوفر لعملائنا جدولا واضحا ومتابعة لحظية حتى وصول الحاوية.',
  'port-sudan-logistics'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ترجمة المقال 4: الإنجليزية
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000004'::uuid,
  'en',
  'Shipping via Port Sudan: FOB/CIF, Container Stuffing, and Transit Times',
  'Everything you need to know about shipping via Port Sudan: FOB vs CIF, container stuffing, and transit times to Jeddah, Jebel Ali, and global ports.',
  'Port Sudan is the main gateway for Sudanese agricultural exports, handling shipments of sesame, gum arabic, hibiscus, and groundnuts to Red Sea, Gulf, and Asian ports.

Shipments are available on FOB terms, where the buyer takes over the goods on board the vessel at Port Sudan, or on CIF terms, where we cover freight and insurance to the destination port. The choice depends on the buyer''s shipping experience and cost-management preferences.

Container stuffing covers accurate weighing, palletized or bulk loading depending on the product, certified fumigation, and desiccant bags where needed to protect the cargo from moisture during the sea voyage.

The voyage from Port Sudan to Jeddah takes only a few days, and to Jebel Ali around one week depending on the shipping line, with onward transshipment options to other ports. We provide our clients with a clear schedule and live tracking until the container arrives.',
  'port-sudan-logistics'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- -------------------------------------------------------------
-- المقال 5: معايير جودة الكركديه السوداني
-- -------------------------------------------------------------
INSERT INTO articles (id, title, slug, excerpt, content, author, category, image_url, image_path, is_featured, published_at, created_at, updated_at)
SELECT
  '30000000-0000-4000-8000-000000000005'::uuid,
  'معايير جودة الكركديه السوداني للمشترين الأوروبيين',
  'hibiscus-quality-standards',
  'معايير الكركديه السوداني للسوق الأوروبية: الرطوبة واللون والفرق بين الدرجات الكاملة والمغربلة، وكيف نضمن مطابقة صارمة للمواصفات.',
  'يشتهر الكركديه السوداني بلونه الأحمر الداكن وحموضته الطبيعية ونكهته الغنية، وهو مطلوب بقوة في أوروبا للشاي والمشروبات والصناعات الغذائية، لكن دخول السوق الأوروبية يتطلب التزاما صارما بمعايير الجودة.

تشمل أهم المعايير نسبة الرطوبة المنخفضة واللون الموحد وخلو المنتج من الأتربة والسيقان والمواد الغريبة، مع تحليل مخبري يثبت سلامة المنتج من الميكروبات وبقايا المبيدات.

يتوفر الكركديه بدرجتين رئيسيتين: الزهرة الكاملة للأسواق التي تفضل المظهر الطبيعي، والمغربلة النظيفة لمصانع التعبئة التي تحتاج سرعة الذوبان وسهولة الاستخدام، وكل درجة لها سعرها واستخدامها.

نطبق في مجموعة ديتا فرزا دقيقا وتجفيفا مضبوطا وتعبئة محكمة تحفظ اللون والنكهة، مع شهادات تحليل لكل دفعة تصديرية لضمان رضا المشترين الأوروبيين واستمرارية التعامل.',
  'د. سارة أحمد الحسن',
  'أدلة الجودة',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/hibiscus-quality-standards.jpg',
  'articles/hibiscus-quality-standards.jpg',
  false,
  '2026-05-18 08:00:00+00'::timestamptz,
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE id = '30000000-0000-4000-8000-000000000005'::uuid);

-- ترجمة المقال 5: العربية (مطابقة للسجل الأساسي)
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000005'::uuid,
  'ar',
  'معايير جودة الكركديه السوداني للمشترين الأوروبيين',
  'معايير الكركديه السوداني للسوق الأوروبية: الرطوبة واللون والفرق بين الدرجات الكاملة والمغربلة، وكيف نضمن مطابقة صارمة للمواصفات.',
  'يشتهر الكركديه السوداني بلونه الأحمر الداكن وحموضته الطبيعية ونكهته الغنية، وهو مطلوب بقوة في أوروبا للشاي والمشروبات والصناعات الغذائية، لكن دخول السوق الأوروبية يتطلب التزاما صارما بمعايير الجودة.

تشمل أهم المعايير نسبة الرطوبة المنخفضة واللون الموحد وخلو المنتج من الأتربة والسيقان والمواد الغريبة، مع تحليل مخبري يثبت سلامة المنتج من الميكروبات وبقايا المبيدات.

يتوفر الكركديه بدرجتين رئيسيتين: الزهرة الكاملة للأسواق التي تفضل المظهر الطبيعي، والمغربلة النظيفة لمصانع التعبئة التي تحتاج سرعة الذوبان وسهولة الاستخدام، وكل درجة لها سعرها واستخدامها.

نطبق في مجموعة ديتا فرزا دقيقا وتجفيفا مضبوطا وتعبئة محكمة تحفظ اللون والنكهة، مع شهادات تحليل لكل دفعة تصديرية لضمان رضا المشترين الأوروبيين واستمرارية التعامل.',
  'hibiscus-quality-standards'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ترجمة المقال 5: الإنجليزية
INSERT INTO article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES (
  '30000000-0000-4000-8000-000000000005'::uuid,
  'en',
  'Sudanese Hibiscus Quality Standards for European Buyers',
  'Sudanese hibiscus standards for the European market: moisture, color, and whole vs sifted grades, and how we ensure strict specification compliance.',
  'Sudanese hibiscus, known as Karkadeh, is famous for its deep red color, natural acidity, and rich flavor. It is in strong demand across Europe for teas, beverages, and food manufacturing, yet entering the EU market requires strict compliance with quality standards.

The most important criteria are low moisture content, uniform color, and freedom from dust, stalks, and foreign matter, supported by laboratory analysis confirming the product is free from microbial contamination and pesticide residues.

Hibiscus is offered in two main grades: whole flowers for markets that prefer a natural appearance, and clean sifted cuts for packing factories that need fast infusion and ease of use. Each grade has its own price point and application.

At Deta Group we apply precise sorting, controlled drying, and airtight packing that preserves color and flavor, with a certificate of analysis for every export lot to ensure European buyer satisfaction and long-term partnership.',
  'hibiscus-quality-standards'
)
ON CONFLICT (article_id, language_code) DO NOTHING;
 -- =============================================
-- الملف: supabase/migrations/_parts/05_articles_b.sql
-- الوصف: إدخال 5 مقالات (6..10) مع ترجمات ar+en — آمن وقابل لإعادة التشغيل
-- الجداول: public.articles + public.article_translations
-- ملاحظة: كل إدخال محمي بشرط NOT EXISTS على UUID الثابت، والترجمات محمية بـ ON CONFLICT
-- الترميز: UTF-8
-- =============================================

-- ---------------------------------------------
-- 6) تدشين خط زيت السمسم المعصور على البارد — مقال مميز
-- ---------------------------------------------
INSERT INTO public.articles (id, title, slug, excerpt, content, author, category, image_url, is_featured, published_at)
SELECT
  '30000000-0000-4000-8000-000000000006',
  'ديتا تدشن خط عصر زيت السمسم على البارد بمعايير سلامة الغذاء',
  'cold-pressed-sesame-oil-line',
  'أعلنت مجموعة ديتا عن تدشين خط جديد لعصر زيت السمسم على البارد ضمن منظومة التصنيع الغذائي، بطاقة إنتاجية عالية ومعايير صارمة لسلامة الغذاء والجودة.',
  'دشنت مجموعة ديتا خط إنتاج جديدا لزيت السمسم المعصور على البارد، في خطوة توسع حضورها في التصنيع الغذائي إلى جانب أنشطة التجارة والخدمات اللوجستية. ويعتمد الخط تقنية العصر البارد للحفاظ على النكهة الطبيعية والقيمة الغذائية للسمسم السوداني الفاخر.

يخضع الإنتاج لفحوص مخبرية دقيقة تشمل الحموضة والرطوبة ونسبة الشوائب، مع الالتزام الصارم باشتراطات النظافة والتعبئة الغذائية. كما تم تجهيز وحدة ترشيح وتعبئة حديثة تضمن ثبات الجودة من الدفعة الأولى حتى التسليم النهائي.

يستهدف الإنتاج الجديد السوق المحلي وأسواق الخليج وشرق آسيا، مع إتاحة التعبئة بكميات الجملة والتجزئة حسب طلب العملاء. وتوفر ديتا عينات معتمدة وشهادات تحليل لكل شحنة صادرة.

يمثل هذا الخط امتدادا لاستراتيجية ديتا في تعظيم القيمة المضافة للمحاصيل السودانية، وفتح قنوات تصديرية جديدة لزيت سمسم عالي الجودة بعلامة سودانية موثوقة.',
  'أ. عائشة عبد الرحمن',
  'أخبار الشركة',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/cold-pressed-sesame-oil-line.jpg',
  true,
  '2026-08-05 10:00:00+00'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE id = '30000000-0000-4000-8000-000000000006');

-- ترجمات المقال 6 (عربي مطابق + إنجليزي كامل)
INSERT INTO public.article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES
(
  '30000000-0000-4000-8000-000000000006',
  'ar',
  'ديتا تدشن خط عصر زيت السمسم على البارد بمعايير سلامة الغذاء',
  'أعلنت مجموعة ديتا عن تدشين خط جديد لعصر زيت السمسم على البارد ضمن منظومة التصنيع الغذائي، بطاقة إنتاجية عالية ومعايير صارمة لسلامة الغذاء والجودة.',
  'دشنت مجموعة ديتا خط إنتاج جديدا لزيت السمسم المعصور على البارد، في خطوة توسع حضورها في التصنيع الغذائي إلى جانب أنشطة التجارة والخدمات اللوجستية. ويعتمد الخط تقنية العصر البارد للحفاظ على النكهة الطبيعية والقيمة الغذائية للسمسم السوداني الفاخر.

يخضع الإنتاج لفحوص مخبرية دقيقة تشمل الحموضة والرطوبة ونسبة الشوائب، مع الالتزام الصارم باشتراطات النظافة والتعبئة الغذائية. كما تم تجهيز وحدة ترشيح وتعبئة حديثة تضمن ثبات الجودة من الدفعة الأولى حتى التسليم النهائي.

يستهدف الإنتاج الجديد السوق المحلي وأسواق الخليج وشرق آسيا، مع إتاحة التعبئة بكميات الجملة والتجزئة حسب طلب العملاء. وتوفر ديتا عينات معتمدة وشهادات تحليل لكل شحنة صادرة.

يمثل هذا الخط امتدادا لاستراتيجية ديتا في تعظيم القيمة المضافة للمحاصيل السودانية، وفتح قنوات تصديرية جديدة لزيت سمسم عالي الجودة بعلامة سودانية موثوقة.',
  'cold-pressed-sesame-oil-line'
),
(
  '30000000-0000-4000-8000-000000000006',
  'en',
  'Deta Launches Cold-Pressed Sesame Oil Line to Food-Safety Standards',
  'Deta Group has launched a new cold-pressed sesame oil line within its food-manufacturing division, with high production capacity and strict food-safety and quality standards.',
  'Deta Group has commissioned a new cold-pressed sesame oil line, expanding its food-manufacturing footprint alongside trade and logistics services. The line uses cold-press technology to preserve the natural flavor and nutritional value of premium Sudanese sesame.

Every batch undergoes rigorous laboratory testing for acidity, moisture, and impurity levels, under strict hygiene and food-grade packing controls. A modern filtration and filling unit ensures consistent quality from the first batch to final delivery.

The new output targets the domestic market as well as Gulf and East Asian buyers, with bulk and retail packing available to order. Deta provides approved samples and a certificate of analysis for every outbound shipment.

The line extends Deta strategy of adding value to Sudanese crops and opening new export channels for high-quality sesame oil under a trusted Sudanese brand.',
  'cold-pressed-sesame-oil-line'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ---------------------------------------------
-- 7) تحليل الطلب الصيني على الفول السوداني المقشور
-- ---------------------------------------------
INSERT INTO public.articles (id, title, slug, excerpt, content, author, category, image_url, is_featured, published_at)
SELECT
  '30000000-0000-4000-8000-000000000007',
  'الطلب الصيني على الفول السوداني المقشور في 2025: ميزة الحبوب السودانية',
  'china-groundnut-market-2025',
  'تحليل لاتجاهات الطلب الصيني على الفول السوداني المقشور في 2025، ولماذا تتفوق الحبوب السودانية بالجودة والحجم عبر ممر الدبة اللوجستي.',
  'يواصل السوق الصيني إظهار طلب قوي على الفول السوداني المقشور في 2025، مدفوعا بصناعات الزيوت والحلويات والوجبات الخفيفة. وتبحث المصانع الصينية عن إمدادات مستقرة بمواصفات تحجيم واضحة ونسبة كسر منخفضة.

تتميز الحبوب السودانية بحجمها الجيد ونكهتها وقدرتها التنافسية السعرية، مع تحسن ملحوظ في عمليات الفرز والتدريج والتعبئة. وتمنح هذه المزايا المصدرين السودانيين أفضلية في عقود التوريد طويلة الأجل مقارنة بمناشئ أخرى.

يلعب ممر الدبة دورا محوريا في تسريع حركة الشحنات من مناطق الإنتاج إلى موانئ التصدير، مما يخفض زمن التسليم وتكاليف المناولة. وتستفيد ديتا من شبكة موردين ومخازن مجهزة للفحص وإعادة الفرز قبل الشحن.

توصي ديتا المشترين بتثبيت المواصفات مبكرا، وطلب عينات معتمدة وشهادات تحليل، وجدولة الشحنات خارج ذروة الموسم لضمان أفضل الأسعار وتوافر الأحجام المطلوبة.',
  'م. محمد الفاتح عبد الله',
  'رؤى السوق',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/china-groundnut-market-2025.jpg',
  false,
  '2026-04-12 10:00:00+00'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE id = '30000000-0000-4000-8000-000000000007');

-- ترجمات المقال 7 (عربي مطابق + إنجليزي كامل)
INSERT INTO public.article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES
(
  '30000000-0000-4000-8000-000000000007',
  'ar',
  'الطلب الصيني على الفول السوداني المقشور في 2025: ميزة الحبوب السودانية',
  'تحليل لاتجاهات الطلب الصيني على الفول السوداني المقشور في 2025، ولماذا تتفوق الحبوب السودانية بالجودة والحجم عبر ممر الدبة اللوجستي.',
  'يواصل السوق الصيني إظهار طلب قوي على الفول السوداني المقشور في 2025، مدفوعا بصناعات الزيوت والحلويات والوجبات الخفيفة. وتبحث المصانع الصينية عن إمدادات مستقرة بمواصفات تحجيم واضحة ونسبة كسر منخفضة.

تتميز الحبوب السودانية بحجمها الجيد ونكهتها وقدرتها التنافسية السعرية، مع تحسن ملحوظ في عمليات الفرز والتدريج والتعبئة. وتمنح هذه المزايا المصدرين السودانيين أفضلية في عقود التوريد طويلة الأجل مقارنة بمناشئ أخرى.

يلعب ممر الدبة دورا محوريا في تسريع حركة الشحنات من مناطق الإنتاج إلى موانئ التصدير، مما يخفض زمن التسليم وتكاليف المناولة. وتستفيد ديتا من شبكة موردين ومخازن مجهزة للفحص وإعادة الفرز قبل الشحن.

توصي ديتا المشترين بتثبيت المواصفات مبكرا، وطلب عينات معتمدة وشهادات تحليل، وجدولة الشحنات خارج ذروة الموسم لضمان أفضل الأسعار وتوافر الأحجام المطلوبة.',
  'china-groundnut-market-2025'
),
(
  '30000000-0000-4000-8000-000000000007',
  'en',
  'Chinese Shelled Groundnut Demand in 2025: The Sudanese Kernel Advantage',
  'An analysis of Chinese demand trends for shelled groundnuts in 2025, and why Sudanese kernels stand out on quality and sizing through the Al-Dabba logistics corridor.',
  'The Chinese market continues to show strong demand for shelled groundnuts in 2025, driven by the oil, confectionery, and snack industries. Chinese processors are seeking stable supply with clear count sizes and low broken rates.

Sudanese kernels stand out for good size, flavor, and competitive pricing, with marked improvement in sorting, grading, and packing operations. These strengths give Sudanese exporters an edge in long-term supply contracts against other origins.

The Al-Dabba corridor plays a central role in speeding cargo from production zones to export ports, cutting lead times and handling costs. Deta leverages a network of suppliers and equipped warehouses for inspection and re-sorting before shipment.

Deta advises buyers to lock specifications early, request approved samples and analysis certificates, and schedule shipments outside peak season to secure the best prices and availability of required counts.',
  'china-groundnut-market-2025'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ---------------------------------------------
-- 8) تغليف صادرات صديق للبيئة بمعايير الغذاء
-- ---------------------------------------------
INSERT INTO public.articles (id, title, slug, excerpt, content, author, category, image_url, is_featured, published_at)
SELECT
  '30000000-0000-4000-8000-000000000008',
  'تغليف صادرات صديق للبيئة: أكياس 25 و50 كيلو بمعايير الغذاء العالمية',
  'eco-friendly-export-packaging',
  'تعتمد ديتا أكياس PP بوزن 25 و50 كيلو مع بطانات غذائية وتغليف قابل لإعادة التدوير يلبي اشتراطات مشتري الاتحاد الأوروبي والخليج.',
  'أصبح التغليف المستدام شرطا أساسيا لدخول أسواق الاتحاد الأوروبي والخليج، لا مجرد ميزة إضافية. ولهذا تعتمد ديتا أكياس PP بوزن 25 و50 كيلو مدعومة ببطانات غذائية تحمي من الرطوبة والتلوث.

صممت منظومة التغليف للحفاظ على جودة السمسم والفول السوداني والكركديه طوال رحلة الشحن والتخزين. وتشمل المواصفات خياطة محكمة وبطاقات تتبع واضحة وخيارات تغليف مزدوج للشحنات الحساسة.

تلتزم ديتا بخامات قابلة لإعادة التدوير وتقليل البلاستيك أحادي الاستخدام حيثما أمكن، دون المساس بسلامة الغذاء. كما توفر طباعة مخصصة بشعار العميل وبيانات المنشأ والوزن بعدة لغات.

تتيح هذه المنظومة للمستوردين استلاما أسرع وفحصا أسهل وتوافقا أعلى مع أنظمة الجودة الأوروبية والخليجية، مما يعزز ثقة العملاء ويخفض نسب المرفوضات.',
  'د. سارة أحمد الحسن',
  'استدامة',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/eco-friendly-export-packaging.jpg',
  false,
  '2026-03-20 10:00:00+00'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE id = '30000000-0000-4000-8000-000000000008');

-- ترجمات المقال 8 (عربي مطابق + إنجليزي كامل)
INSERT INTO public.article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES
(
  '30000000-0000-4000-8000-000000000008',
  'ar',
  'تغليف صادرات صديق للبيئة: أكياس 25 و50 كيلو بمعايير الغذاء العالمية',
  'تعتمد ديتا أكياس PP بوزن 25 و50 كيلو مع بطانات غذائية وتغليف قابل لإعادة التدوير يلبي اشتراطات مشتري الاتحاد الأوروبي والخليج.',
  'أصبح التغليف المستدام شرطا أساسيا لدخول أسواق الاتحاد الأوروبي والخليج، لا مجرد ميزة إضافية. ولهذا تعتمد ديتا أكياس PP بوزن 25 و50 كيلو مدعومة ببطانات غذائية تحمي من الرطوبة والتلوث.

صممت منظومة التغليف للحفاظ على جودة السمسم والفول السوداني والكركديه طوال رحلة الشحن والتخزين. وتشمل المواصفات خياطة محكمة وبطاقات تتبع واضحة وخيارات تغليف مزدوج للشحنات الحساسة.

تلتزم ديتا بخامات قابلة لإعادة التدوير وتقليل البلاستيك أحادي الاستخدام حيثما أمكن، دون المساس بسلامة الغذاء. كما توفر طباعة مخصصة بشعار العميل وبيانات المنشأ والوزن بعدة لغات.

تتيح هذه المنظومة للمستوردين استلاما أسرع وفحصا أسهل وتوافقا أعلى مع أنظمة الجودة الأوروبية والخليجية، مما يعزز ثقة العملاء ويخفض نسب المرفوضات.',
  'eco-friendly-export-packaging'
),
(
  '30000000-0000-4000-8000-000000000008',
  'en',
  'Eco-Friendly Export Packaging: 25 and 50kg Bags to Global Food Standards',
  'Deta uses 25 and 50kg PP bags with food-grade liners and recyclable packaging that meets the requirements of EU and GCC buyers.',
  'Sustainable packaging is now a core requirement for entering EU and GCC markets, not just an added bonus. Deta therefore uses 25 and 50kg PP bags reinforced with food-grade liners that protect against moisture and contamination.

The system is designed to preserve the quality of sesame, groundnuts, and hibiscus throughout shipping and storage. Specifications include secure stitching, clear traceability labels, and double-bag options for sensitive cargo.

Deta commits to recyclable materials and to reducing single-use plastics wherever possible, without compromising food safety. Custom printing with buyer logo, origin data, and weights is available in several languages.

The setup gives importers faster receiving, easier inspection, and stronger alignment with European and Gulf quality systems, building buyer confidence and reducing rejection rates.',
  'eco-friendly-export-packaging'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ---------------------------------------------
-- 9) نظام ديتا لتتبع الطلبات ووثائق التصدير
-- ---------------------------------------------
INSERT INTO public.articles (id, title, slug, excerpt, content, author, category, image_url, is_featured, published_at)
SELECT
  '30000000-0000-4000-8000-000000000009',
  'ذراع ديتا البرمجية تطلق نظام تتبع الطلبات ووثائق التصدير للعملاء',
  'deta-customs-tracking-software',
  'أطلقت ذراع ديتا البرمجية نظاما موحدا لتتبع الطلبات وإدارة وثائق التصدير، يمنح العملاء رؤية لحظية من التعاقد حتى التسليم.',
  'أعلنت ذراع ديتا البرمجية عن إطلاق نظام متكامل لتتبع الطلبات وإدارة وثائق التصدير، يربط فرق المبيعات والتخليص والمخازن والعملاء في منصة واحدة. ويهدف النظام إلى تقليل الاعتماد على المراسلات المشتتة ورفع دقة البيانات.

يوفر النظام للعميل لوحة متابعة لحظية تعرض حالة الطلب ومراحل الفحص والتعبئة والشحن، مع تنبيهات تلقائية عند كل تحديث. كما يتيح تحميل الفواتير وشهادات المنشأ والتحليل وبوالص الشحن بصيغ رقمية منظمة.

يعتمد النظام على صلاحيات دقيقة للأدوار وسجل تدقيق كامل لكل إجراء، مما يعزز الشفافية ويقلل الأخطاء في المستندات الجمركية. ويدعم التكامل مع البريد وأنظمة التخزين السحابي لتسريع تبادل الملفات.

تمثل هذه الخطوة امتدادا طبيعيا لخبرة ديتا في التخليص الجمركي والخدمات اللوجستية، وتضع التقنية في خدمة المصدر والمستورد عبر تجربة رقمية موحدة وموثوقة.',
  'م. خالد مصطفى الأمين',
  'تقنية',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-customs-tracking-software.jpg',
  false,
  '2026-02-28 10:00:00+00'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE id = '30000000-0000-4000-8000-000000000009');

-- ترجمات المقال 9 (عربي مطابق + إنجليزي كامل)
INSERT INTO public.article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES
(
  '30000000-0000-4000-8000-000000000009',
  'ar',
  'ذراع ديتا البرمجية تطلق نظام تتبع الطلبات ووثائق التصدير للعملاء',
  'أطلقت ذراع ديتا البرمجية نظاما موحدا لتتبع الطلبات وإدارة وثائق التصدير، يمنح العملاء رؤية لحظية من التعاقد حتى التسليم.',
  'أعلنت ذراع ديتا البرمجية عن إطلاق نظام متكامل لتتبع الطلبات وإدارة وثائق التصدير، يربط فرق المبيعات والتخليص والمخازن والعملاء في منصة واحدة. ويهدف النظام إلى تقليل الاعتماد على المراسلات المشتتة ورفع دقة البيانات.

يوفر النظام للعميل لوحة متابعة لحظية تعرض حالة الطلب ومراحل الفحص والتعبئة والشحن، مع تنبيهات تلقائية عند كل تحديث. كما يتيح تحميل الفواتير وشهادات المنشأ والتحليل وبوالص الشحن بصيغ رقمية منظمة.

يعتمد النظام على صلاحيات دقيقة للأدوار وسجل تدقيق كامل لكل إجراء، مما يعزز الشفافية ويقلل الأخطاء في المستندات الجمركية. ويدعم التكامل مع البريد وأنظمة التخزين السحابي لتسريع تبادل الملفات.

تمثل هذه الخطوة امتدادا طبيعيا لخبرة ديتا في التخليص الجمركي والخدمات اللوجستية، وتضع التقنية في خدمة المصدر والمستورد عبر تجربة رقمية موحدة وموثوقة.',
  'deta-customs-tracking-software'
),
(
  '30000000-0000-4000-8000-000000000009',
  'en',
  'Deta Software Arm Launches Order-Tracking and Export Documentation System',
  'The Deta software arm has released a unified order-tracking and export documentation system, giving clients live visibility from contracting to delivery.',
  'The Deta software arm has launched an integrated order-tracking and export documentation platform connecting sales, clearance, warehouse, and client teams in one place. The system reduces reliance on scattered correspondence and improves data accuracy.

Clients receive a live dashboard showing order status across inspection, packing, and shipping stages, with automatic alerts at every update. Invoices, certificates of origin and analysis, and bills of lading are available in organized digital formats.

The platform uses precise role-based permissions and a full audit log for every action, strengthening transparency and cutting errors in customs paperwork. It also integrates with email and cloud storage to speed file exchange.

The launch is a natural extension of Deta expertise in customs clearance and logistics, putting technology at the service of exporters and importers through one unified and reliable digital experience.',
  'deta-customs-tracking-software'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- ---------------------------------------------
-- 10) رؤية ديتا: خبرة وشراكات عبر المنطقة والعالم
-- ---------------------------------------------
INSERT INTO public.articles (id, title, slug, excerpt, content, author, category, image_url, is_featured, published_at)
SELECT
  '30000000-0000-4000-8000-000000000010',
  'رؤية ديتا: أكثر من 15 عاما و200 مختص وشراكات عبر المنطقة والعالم',
  'deta-vision-partnerships',
  'تستعرض هذه المقالة رؤية مجموعة ديتا بخبرة تتجاوز 15 عاما وفريق يضم أكثر من 200 مختص وشراكات ممتدة في الشرق الأوسط وآسيا وأوروبا.',
  'تقوم رؤية مجموعة ديتا على بناء جسور تجارية موثوقة بين السودان والأسواق العالمية، بخبرة تتجاوز 15 عاما في التخليص الجمركي والتجارة والخدمات اللوجستية والتصنيع الغذائي. وتجمع المجموعة عدة أذرع متكاملة تعمل كمنظومة واحدة.

يضم فريق ديتا أكثر من 200 مختص في المبيعات والتخليص والمخازن والجودة والتقنية، يعملون وفق إجراءات موحدة ومعايير سلامة غذاء صارمة. ومكن هذا التكامل المجموعة من خدمة عملاء في الخليج وشمال أفريقيا وآسيا وأوروبا بموثوقية عالية.

تبني ديتا شراكات طويلة الأجل مع الموردين والمشترين ووكلاء الشحن، قائمة على الشفافية والالتزام بالمواصفات ومواعيد التسليم. وتوفر لشركائها عينات معتمدة ووثائق رقمية منظمة وتواصلا مباشرا عبر أنظمتها التقنية.

تواصل المجموعة الاستثمار في التصنيع الغذائي والتغليف المستدام والتحول الرقمي، لتبقى الشريك السوداني الأول للمستوردين الباحثين عن جودة ثابتة وتوريد مستقر وتجربة تعامل احترافية.',
  'أ. عائشة عبد الرحمن',
  'أخبار الشركة',
  'https://dnnhupnkzbixkgqgcrnc.supabase.co/storage/v1/object/public/media/articles/deta-vision-partnerships.jpg',
  false,
  '2026-01-15 10:00:00+00'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE id = '30000000-0000-4000-8000-000000000010');

-- ترجمات المقال 10 (عربي مطابق + إنجليزي كامل)
INSERT INTO public.article_translations (article_id, language_code, title, excerpt, content, slug)
VALUES
(
  '30000000-0000-4000-8000-000000000010',
  'ar',
  'رؤية ديتا: أكثر من 15 عاما و200 مختص وشراكات عبر المنطقة والعالم',
  'تستعرض هذه المقالة رؤية مجموعة ديتا بخبرة تتجاوز 15 عاما وفريق يضم أكثر من 200 مختص وشراكات ممتدة في الشرق الأوسط وآسيا وأوروبا.',
  'تقوم رؤية مجموعة ديتا على بناء جسور تجارية موثوقة بين السودان والأسواق العالمية، بخبرة تتجاوز 15 عاما في التخليص الجمركي والتجارة والخدمات اللوجستية والتصنيع الغذائي. وتجمع المجموعة عدة أذرع متكاملة تعمل كمنظومة واحدة.

يضم فريق ديتا أكثر من 200 مختص في المبيعات والتخليص والمخازن والجودة والتقنية، يعملون وفق إجراءات موحدة ومعايير سلامة غذاء صارمة. ومكن هذا التكامل المجموعة من خدمة عملاء في الخليج وشمال أفريقيا وآسيا وأوروبا بموثوقية عالية.

تبني ديتا شراكات طويلة الأجل مع الموردين والمشترين ووكلاء الشحن، قائمة على الشفافية والالتزام بالمواصفات ومواعيد التسليم. وتوفر لشركائها عينات معتمدة ووثائق رقمية منظمة وتواصلا مباشرا عبر أنظمتها التقنية.

تواصل المجموعة الاستثمار في التصنيع الغذائي والتغليف المستدام والتحول الرقمي، لتبقى الشريك السوداني الأول للمستوردين الباحثين عن جودة ثابتة وتوريد مستقر وتجربة تعامل احترافية.',
  'deta-vision-partnerships'
),
(
  '30000000-0000-4000-8000-000000000010',
  'en',
  'Deta Group Vision: 15 Plus Years, 200 Plus Specialists, and Global Partnerships',
  'This article presents the Deta Group vision, with more than 15 years of experience, a team of over 200 specialists, and partnerships across MENA, Asia, and Europe.',
  'The Deta Group vision is built on trusted trade bridges between Sudan and world markets, with more than 15 years of experience in customs clearance, trade, logistics, and food manufacturing. Its integrated divisions operate as one system.

The Deta team includes more than 200 specialists in sales, clearance, warehousing, quality, and technology, working to unified procedures and strict food-safety standards. This integration allows the group to serve clients across the Gulf, North Africa, Asia, and Europe with high reliability.

Deta builds long-term partnerships with suppliers, buyers, and freight agents, grounded in transparency, specification compliance, and on-time delivery. Partners receive approved samples, organized digital documents, and direct communication through its technical systems.

The group continues to invest in food manufacturing, sustainable packaging, and digital transformation, remaining the first Sudanese partner of choice for importers seeking consistent quality, stable supply, and a professional working experience.',
  'deta-vision-partnerships'
)
ON CONFLICT (article_id, language_code) DO NOTHING;

-- نهاية الملف: 5 مقالات + 10 ترجمات (ar+en لكل مقال)
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

