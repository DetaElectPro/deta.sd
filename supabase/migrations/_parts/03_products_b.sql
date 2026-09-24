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
