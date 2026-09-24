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
