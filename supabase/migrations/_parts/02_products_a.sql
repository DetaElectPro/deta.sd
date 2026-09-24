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
