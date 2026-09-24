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
