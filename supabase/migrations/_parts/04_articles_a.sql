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
