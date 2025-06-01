
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string;
  is_rtl: boolean;
  is_default: boolean;
}

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (code: string) => void;
  languages: Language[];
  isRTL: boolean;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// الترجمات الأساسية
const translations = {
  ar: {
    // Admin translations
    'admin.dashboard': 'لوحة التحكم',
    'admin.content': 'إدارة المحتوى',
    'admin.categories': 'إدارة الفئات',
    'admin.users': 'إدارة المستخدمين',
    'admin.languages': 'إدارة اللغات',
    'admin.media': 'الوسائط',
    'admin.settings': 'إعدادات الموقع',
    'admin.analytics': 'التحليلات',
    
    // Content translations
    'content.title': 'العنوان',
    'content.excerpt': 'المقطع التعريفي',
    'content.content': 'المحتوى',
    'content.author': 'الكاتب',
    'content.category': 'الفئة',
    'content.save': 'حفظ',
    'content.cancel': 'إلغاء',
    'content.edit': 'تعديل',
    'content.delete': 'حذف',
    'content.add_new': 'إضافة جديد',
    'content.edit_article': 'تعديل المقال',
    'content.add_article': 'إضافة مقال جديد',
    
    // Language translations
    'language.switch': 'تغيير اللغة',
    
    // Site translations
    'site.title': 'الموقع الإلكتروني',
    'site.home': 'الرئيسية',
    'site.about': 'عن الشركة',
    'site.products': 'المنتجات',
    'site.services': 'الخدمات',
    'site.news': 'الأخبار',
    'site.contact': 'اتصل بنا',
    'site.location': 'الخرطوم، السودان',
    'site.company_name': 'مجموعة ديتا',
    'site.company_description': 'رائدة في مجالات الزراعة وتصنيع الأغذية وتطوير البرمجيات في السودان، ملتزمون بتقديم أفضل الخدمات والمنتجات.',
    
    // Hero section
    'hero.welcome': 'مرحباً بكم في',
    'hero.description': 'رائدة في مجالات الزراعة وتصنيع الأغذية وتطوير البرمجيات في السودان، نسعى لتحقيق التميز والابتكار في كل ما نقدمه.',
    'hero.learn_more': 'تعرف علينا أكثر',
    'hero.contact_us': 'تواصل معنا',
    'hero.vision_title': 'رؤيتنا للمستقبل',
    'hero.vision_subtitle': 'بناء مستقبل مستدام ومزدهر',
    
    // Services
    'services.agriculture': 'الزراعة المستدامة',
    'services.agriculture_desc': 'إنتاج زراعي عالي الجودة باستخدام أحدث التقنيات والممارسات المستدامة',
    'services.food_manufacturing': 'تصنيع الأغذية',
    'services.food_manufacturing_desc': 'معالجة وتصنيع المنتجات الغذائية بأعلى معايير الجودة والسلامة',
    'services.software_development': 'تطوير البرمجيات',
    'services.software_development_desc': 'حلول تقنية متطورة ومنصات رقمية لتطوير الأعمال والقطاعات المختلفة',
    'services.consulting': 'الاستشارات الزراعية',
    'services.detailed_description': 'نقدم خدمات شاملة ومتطورة في مجالاتنا الثلاث الرئيسية، مع التركيز على الجودة والابتكار',
    
    // Service features
    'services.agriculture_features.modern_farming': 'تقنيات الزراعة الحديثة',
    'services.agriculture_features.organic_production': 'الإنتاج العضوي المعتمد',
    'services.agriculture_features.irrigation_systems': 'أنظمة الري المتطورة',
    'services.agriculture_features.crop_consulting': 'استشارات المحاصيل',
    'services.food_features.quality_control': 'مراقبة الجودة الصارمة',
    'services.food_features.packaging': 'التعبئة والتغليف المتقدم',
    'services.food_features.distribution': 'شبكة التوزيع الواسعة',
    'services.food_features.certifications': 'الشهادات الدولية',
    'services.software_features.web_development': 'تطوير المواقع الإلكترونية',
    'services.software_features.mobile_apps': 'تطبيقات الهاتف المحمول',
    'services.software_features.erp_systems': 'أنظمة تخطيط الموارد',
    'services.software_features.consulting': 'الاستشارات التقنية',
    
    // Process
    'process.our_process': 'منهجية عملنا',
    'process.description': 'نتبع منهجية مدروسة لضمان تقديم أفضل الخدمات لعملائنا',
    'process.consultation': 'الاستشارة',
    'process.consultation_desc': 'نبدأ بفهم احتياجاتكم ومتطلباتكم بشكل دقيق',
    'process.planning': 'التخطيط',
    'process.planning_desc': 'نضع خطة شاملة ومفصلة لتحقيق أهدافكم',
    'process.execution': 'التنفيذ',
    'process.execution_desc': 'ننفذ المشروع بأعلى معايير الجودة والكفاءة',
    
    // Sections
    'sections.our_services': 'مجالات عملنا',
    'sections.services_description': 'نقدم خدمات متنوعة ومتكاملة في ثلاث مجالات رئيسية تخدم احتياجات السوق المحلي والإقليمي',
    'sections.achievements': 'إنجازاتنا بالأرقام',
    'sections.achievements_description': 'نفتخر بما حققناه على مدار السنوات الماضية',
    'sections.who_we_are': 'من نحن',
    'sections.about_description': 'مجموعة ديتا هي شركة رائدة في السودان تعمل في مجالات متعددة تشمل الزراعة وتصنيع الأغذية وتطوير البرمجيات. نحن نؤمن بالتطوير المستدام والابتكار لتقديم أفضل الحلول لعملائنا.',
    
    // About page
    'about.hero_description': 'تعرف على قصة مجموعة ديتا ورحلتنا في بناء مستقبل مستدام ومزدهر',
    'about.our_story': 'قصتنا',
    'about.story_description': 'بدأت مجموعة ديتا رحلتها في عام 2008 برؤية طموحة لتطوير القطاع الزراعي في السودان وتوسعت لتشمل تصنيع الأغذية وتطوير البرمجيات.',
    'about.story_point_1': 'أكثر من 15 عاماً من الخبرة والتطوير المستمر',
    'about.story_point_2': 'شراكات استراتيجية مع أفضل المؤسسات العالمية',
    'about.story_point_3': 'التزام راسخ بالجودة والابتكار والاستدامة',
    'about.mission': 'رسالتنا',
    'about.mission_description': 'نسعى لتقديم منتجات وخدمات عالية الجودة تساهم في التنمية المستدامة وتلبي احتياجات عملائنا وتحقق توقعاتهم.',
    'about.vision': 'رؤيتنا',
    'about.vision_description': 'أن نكون الشركة الرائدة في المنطقة في مجالات الزراعة وتصنيع الأغذية وتطوير البرمجيات بحلول عام 2030.',
    'about.our_values': 'قيمنا',
    'about.values_description': 'نؤمن بمجموعة من القيم الأساسية التي توجه عملنا وتحدد هويتنا',
    'about.our_journey': 'رحلتنا عبر السنين',
    'about.journey_description': 'أهم المحطات والإنجازات في مسيرة مجموعة ديتا',
    'about.leadership': 'قيادتنا',
    'about.leadership_description': 'فريق قيادي متميز يقود الشركة نحو تحقيق رؤيتها وأهدافها',
    
    // Values
    'values.excellence': 'التميز',
    'values.excellence_desc': 'نسعى للتميز في كل ما نقدمه من منتجات وخدمات',
    'values.integrity': 'النزاهة',
    'values.integrity_desc': 'نتعامل بشفافية ونزاهة مع جميع شركائنا',
    'values.innovation': 'الابتكار',
    'values.innovation_desc': 'نبتكر حلولاً متطورة لمواجهة تحديات المستقبل',
    'values.sustainability': 'الاستدامة',
    'values.sustainability_desc': 'نلتزم بالممارسات المستدامة في جميع أنشطتنا',
    
    // Milestones
    'milestones.founded': 'تأسيس الشركة وبداية النشاط الزراعي',
    'milestones.first_expansion': 'التوسع الأول وإطلاق قسم تصنيع الأغذية',
    'milestones.software_division': 'إنشاء قسم تطوير البرمجيات',
    'milestones.international_expansion': 'التوسع الدولي ودخول أسواق جديدة',
    'milestones.digital_transformation': 'التحول الرقمي وتطوير المنصات الذكية',
    
    // Leadership
    'leadership.ceo_name': 'أحمد محمد علي',
    'leadership.ceo_position': 'الرئيس التنفيذي',
    'leadership.ceo_desc': 'خبرة أكثر من 20 عاماً في إدارة الشركات والتطوير الاستراتيجي',
    'leadership.cto_name': 'سارة أحمد محمد',
    'leadership.cto_position': 'مديرة التقنية',
    'leadership.cto_desc': 'متخصصة في تطوير البرمجيات والتحول الرقمي',
    'leadership.operations_name': 'محمد علي أحمد',
    'leadership.operations_position': 'مدير العمليات',
    'leadership.operations_desc': 'خبير في إدارة العمليات والجودة والإنتاج',
    
    // Products
    'products.hero_description': 'نفتخر بتقديم مجموعة واسعة من المنتجات الزراعية والغذائية عالية الجودة من السودان إلى العالم',
    'products.categories': 'فئات المنتجات',
    'products.categories_description': 'نقدم منتجات متنوعة تلبي احتياجات السوق المحلي والدولي',
    'products.grains_legumes': 'الحبوب والبقوليات',
    'products.grains_legumes_desc': 'منتجات عالية الجودة من الحبوب والبقوليات المزروعة محلياً',
    'products.fruits_vegetables': 'الفواكه والخضروات',
    'products.fruits_vegetables_desc': 'فواكه وخضروات طازجة ومعالجة بأحدث التقنيات',
    'products.beverages_spices': 'المشروبات والتوابل',
    'products.beverages_spices_desc': 'مجموعة متنوعة من المشروبات الطبيعية والتوابل العطرية',
    'products.processed_products': 'المنتجات المصنعة',
    'products.processed_products_desc': 'منتجات غذائية مصنعة ومعبأة وفق أعلى معايير الجودة',
    'products.quality_standards': 'معايير الجودة',
    'products.quality_description': 'نحن ملتزمون بأعلى معايير الجودة والسلامة في جميع منتجاتنا. نحصل على أفضل الشهادات العالمية والمحلية لضمان جودة منتجاتنا.',
    'products.our_certifications': 'شهاداتنا',
    'products.export_markets': 'أسواق التصدير',
    'products.export_description': 'نصدر منتجاتنا إلى العديد من البلدان في المنطقة والعالم',
    'products.interested_cta': 'مهتمون بمنتجاتنا؟',
    'products.cta_description': 'تواصلوا معنا للحصول على كتالوج شامل بمنتجاتنا أو لمناقشة احتياجاتكم',
    'products.download_catalog': 'تحميل الكتالوج',
    'products.request_quote': 'طلب عرض سعر',
    'products.origin': 'المنشأ',
    
    // Product names
    'products.wheat': 'القمح',
    'products.corn': 'الذرة',
    'products.millet': 'الدخن',
    'products.sesame': 'السمسم',
    'products.peanuts': 'الفول السوداني',
    'products.cowpeas': 'اللوبيا',
    'products.dates': 'التمر',
    'products.mango': 'المانجو',
    'products.guava': 'الجوافة',
    'products.potatoes': 'البطاطس',
    'products.onions': 'البصل',
    'products.tomatoes': 'الطماطم',
    'products.hibiscus': 'الكركديه',
    'products.grapes': 'العنب',
    'products.cumin': 'الكمون',
    'products.coriander': 'الكزبرة',
    'products.fenugreek': 'الحلبة',
    'products.cinnamon': 'القرفة',
    'products.wheat_flour': 'دقيق القمح',
    'products.sesame_oil': 'زيت السمسم',
    'products.peanut_butter': 'زبدة الفول السوداني',
    'products.date_paste': 'عجينة التمر',
    'products.ground_spices': 'التوابل المطحونة',
    'products.cleaned_grains': 'الحبوب المنظفة',
    
    // Quality levels
    'quality.premium': 'فاخر',
    'quality.excellent': 'ممتاز',
    'quality.high': 'عالي',
    
    // Origin
    'origin.sudan': 'السودان',
    
    // Certifications
    'certifications.iso_22000': 'ISO 22000 - إدارة سلامة الغذاء',
    'certifications.haccp': 'HACCP - تحليل المخاطر ونقاط التحكم الحرجة',
    'certifications.organic': 'الشهادة العضوية المعتمدة',
    'certifications.sudanese_quality': 'شهادة الجودة السودانية',
    'certifications.export': 'شهادة التصدير الدولية',
    
    // Markets
    'markets.gulf_countries': 'دول الخليج العربي',
    'markets.north_africa': 'شمال أفريقيا',
    'markets.east_africa': 'شرق أفريقيا',
    'markets.europe_asia': 'أوروبا وآسيا',
    
    // Stats
    'stats.years_experience': 'سنة من الخبرة',
    'stats.employees': 'موظف متخصص',
    'stats.projects': 'مشروع ناجح',
    'stats.subsidiaries': 'شركة فرعية',
    
    // Features
    'features.certified': 'معتمدون من أفضل المؤسسات العالمية',
    'features.expert_team': 'فريق عمل متخصص وذو خبرة عالية',
    'features.strong_presence': 'حضور محلي وإقليمي قوي',
    
    // Buttons
    'buttons.read_more': 'اقرأ المزيد',
    'buttons.learn_our_story': 'تعرف على قصتنا',
    'buttons.start_project': 'ابدأ مشروعك معنا',
    'buttons.request_service': 'اطلب الخدمة',
    
    // CTA
    'cta.ready_to_start': 'جاهزون لبدء مشروعكم القادم؟',
    'cta.description': 'تواصلوا معنا اليوم لمناقشة كيف يمكننا مساعدتكم في تحقيق أهدافكم وتطوير أعمالكم',
    'cta.start_project': 'ابدأ مشروعك معنا',
    
    // Footer
    'footer.quick_links': 'روابط سريعة',
    'footer.contact_us': 'تواصل معنا',
    'footer.copyright': '© 2024 مجموعة ديتا. جميع الحقوق محفوظة.'
  },
  en: {
    // Admin translations
    'admin.dashboard': 'Dashboard',
    'admin.content': 'Content Management',
    'admin.categories': 'Categories Management',
    'admin.users': 'Users Management',
    'admin.languages': 'Languages Management',
    'admin.media': 'Media',
    'admin.settings': 'Site Settings',
    'admin.analytics': 'Analytics',
    
    // Content translations
    'content.title': 'Title',
    'content.excerpt': 'Excerpt',
    'content.content': 'Content',
    'content.author': 'Author',
    'content.category': 'Category',
    'content.save': 'Save',
    'content.cancel': 'Cancel',
    'content.edit': 'Edit',
    'content.delete': 'Delete',
    'content.add_new': 'Add New',
    'content.edit_article': 'Edit Article',
    'content.add_article': 'Add New Article',
    
    // Language translations
    'language.switch': 'Switch Language',
    
    // Site translations
    'site.title': 'Website',
    'site.home': 'Home',
    'site.about': 'About',
    'site.products': 'Products',
    'site.services': 'Services',
    'site.news': 'News',
    'site.contact': 'Contact',
    'site.location': 'Khartoum, Sudan',
    'site.company_name': 'Deta Group',
    'site.company_description': 'Leading company in agriculture, food manufacturing, and software development in Sudan, committed to delivering the best services and products.',
    
    // Hero section
    'hero.welcome': 'Welcome to',
    'hero.description': 'Leading in agriculture, food manufacturing, and software development in Sudan, we strive for excellence and innovation in everything we do.',
    'hero.learn_more': 'Learn More About Us',
    'hero.contact_us': 'Contact Us',
    'hero.vision_title': 'Our Vision for the Future',
    'hero.vision_subtitle': 'Building a sustainable and prosperous future',
    
    // Services
    'services.agriculture': 'Sustainable Agriculture',
    'services.agriculture_desc': 'High-quality agricultural production using the latest technologies and sustainable practices',
    'services.food_manufacturing': 'Food Manufacturing',
    'services.food_manufacturing_desc': 'Processing and manufacturing food products with the highest quality and safety standards',
    'services.software_development': 'Software Development',
    'services.software_development_desc': 'Advanced technical solutions and digital platforms for business and sector development',
    'services.consulting': 'Agricultural Consulting',
    'services.detailed_description': 'We provide comprehensive and advanced services in our three main areas, focusing on quality and innovation',
    
    // Service features
    'services.agriculture_features.modern_farming': 'Modern Farming Techniques',
    'services.agriculture_features.organic_production': 'Certified Organic Production',
    'services.agriculture_features.irrigation_systems': 'Advanced Irrigation Systems',
    'services.agriculture_features.crop_consulting': 'Crop Consulting',
    'services.food_features.quality_control': 'Strict Quality Control',
    'services.food_features.packaging': 'Advanced Packaging',
    'services.food_features.distribution': 'Wide Distribution Network',
    'services.food_features.certifications': 'International Certifications',
    'services.software_features.web_development': 'Web Development',
    'services.software_features.mobile_apps': 'Mobile Applications',
    'services.software_features.erp_systems': 'ERP Systems',
    'services.software_features.consulting': 'Technical Consulting',
    
    // Process
    'process.our_process': 'Our Process',
    'process.description': 'We follow a well-studied methodology to ensure providing the best services to our clients',
    'process.consultation': 'Consultation',
    'process.consultation_desc': 'We begin by understanding your needs and requirements precisely',
    'process.planning': 'Planning',
    'process.planning_desc': 'We create a comprehensive and detailed plan to achieve your goals',
    'process.execution': 'Execution',
    'process.execution_desc': 'We execute the project with the highest standards of quality and efficiency',
    
    // Sections
    'sections.our_services': 'Our Services',
    'sections.services_description': 'We offer diverse and integrated services in three main areas serving local and regional market needs',
    'sections.achievements': 'Our Achievements in Numbers',
    'sections.achievements_description': 'We take pride in what we have achieved over the years',
    'sections.who_we_are': 'Who We Are',
    'sections.about_description': 'Deta Group is a leading company in Sudan operating in multiple fields including agriculture, food manufacturing, and software development. We believe in sustainable development and innovation to provide the best solutions for our clients.',
    
    // About page
    'about.hero_description': 'Learn about Deta Group\'s story and our journey in building a sustainable and prosperous future',
    'about.our_story': 'Our Story',
    'about.story_description': 'Deta Group began its journey in 2008 with an ambitious vision to develop the agricultural sector in Sudan and expanded to include food manufacturing and software development.',
    'about.story_point_1': 'More than 15 years of experience and continuous development',
    'about.story_point_2': 'Strategic partnerships with the best global institutions',
    'about.story_point_3': 'Firm commitment to quality, innovation, and sustainability',
    'about.mission': 'Our Mission',
    'about.mission_description': 'We strive to provide high-quality products and services that contribute to sustainable development and meet our clients\' needs and expectations.',
    'about.vision': 'Our Vision',
    'about.vision_description': 'To be the leading company in the region in agriculture, food manufacturing, and software development by 2030.',
    'about.our_values': 'Our Values',
    'about.values_description': 'We believe in a set of core values that guide our work and define our identity',
    'about.our_journey': 'Our Journey Through the Years',
    'about.journey_description': 'Key milestones and achievements in Deta Group\'s journey',
    'about.leadership': 'Our Leadership',
    'about.leadership_description': 'A distinguished leadership team guiding the company towards achieving its vision and goals',
    
    // Values
    'values.excellence': 'Excellence',
    'values.excellence_desc': 'We strive for excellence in everything we offer',
    'values.integrity': 'Integrity',
    'values.integrity_desc': 'We deal with transparency and integrity with all our partners',
    'values.innovation': 'Innovation',
    'values.innovation_desc': 'We innovate advanced solutions to face future challenges',
    'values.sustainability': 'Sustainability',
    'values.sustainability_desc': 'We are committed to sustainable practices in all our activities',
    
    // Milestones
    'milestones.founded': 'Company establishment and beginning of agricultural activity',
    'milestones.first_expansion': 'First expansion and launch of food manufacturing division',
    'milestones.software_division': 'Establishment of software development division',
    'milestones.international_expansion': 'International expansion and entry into new markets',
    'milestones.digital_transformation': 'Digital transformation and smart platform development',
    
    // Leadership
    'leadership.ceo_name': 'Ahmed Mohamed Ali',
    'leadership.ceo_position': 'Chief Executive Officer',
    'leadership.ceo_desc': 'More than 20 years of experience in corporate management and strategic development',
    'leadership.cto_name': 'Sara Ahmed Mohamed',
    'leadership.cto_position': 'Chief Technology Officer',
    'leadership.cto_desc': 'Specialist in software development and digital transformation',
    'leadership.operations_name': 'Mohamed Ali Ahmed',
    'leadership.operations_position': 'Operations Manager',
    'leadership.operations_desc': 'Expert in operations management, quality, and production',
    
    // Products
    'products.hero_description': 'We take pride in offering a wide range of high-quality agricultural and food products from Sudan to the world',
    'products.categories': 'Product Categories',
    'products.categories_description': 'We offer diverse products that meet local and international market needs',
    'products.grains_legumes': 'Grains & Legumes',
    'products.grains_legumes_desc': 'High-quality grains and legumes grown locally',
    'products.fruits_vegetables': 'Fruits & Vegetables',
    'products.fruits_vegetables_desc': 'Fresh fruits and vegetables processed with the latest technologies',
    'products.beverages_spices': 'Beverages & Spices',
    'products.beverages_spices_desc': 'A variety of natural beverages and aromatic spices',
    'products.processed_products': 'Processed Products',
    'products.processed_products_desc': 'Food products processed and packaged according to the highest quality standards',
    'products.quality_standards': 'Quality Standards',
    'products.quality_description': 'We are committed to the highest quality and safety standards in all our products. We obtain the best international and local certifications to ensure product quality.',
    'products.our_certifications': 'Our Certifications',
    'products.export_markets': 'Export Markets',
    'products.export_description': 'We export our products to many countries in the region and the world',
    'products.interested_cta': 'Interested in Our Products?',
    'products.cta_description': 'Contact us to get a comprehensive catalog of our products or to discuss your needs',
    'products.download_catalog': 'Download Catalog',
    'products.request_quote': 'Request Quote',
    'products.origin': 'Origin',
    
    // Product names
    'products.wheat': 'Wheat',
    'products.corn': 'Corn',
    'products.millet': 'Millet',
    'products.sesame': 'Sesame',
    'products.peanuts': 'Peanuts',
    'products.cowpeas': 'Cowpeas',
    'products.dates': 'Dates',
    'products.mango': 'Mango',
    'products.guava': 'Guava',
    'products.potatoes': 'Potatoes',
    'products.onions': 'Onions',
    'products.tomatoes': 'Tomatoes',
    'products.hibiscus': 'Hibiscus',
    'products.grapes': 'Grapes',
    'products.cumin': 'Cumin',
    'products.coriander': 'Coriander',
    'products.fenugreek': 'Fenugreek',
    'products.cinnamon': 'Cinnamon',
    'products.wheat_flour': 'Wheat Flour',
    'products.sesame_oil': 'Sesame Oil',
    'products.peanut_butter': 'Peanut Butter',
    'products.date_paste': 'Date Paste',
    'products.ground_spices': 'Ground Spices',
    'products.cleaned_grains': 'Cleaned Grains',
    
    // Quality levels
    'quality.premium': 'Premium',
    'quality.excellent': 'Excellent',
    'quality.high': 'High',
    
    // Origin
    'origin.sudan': 'Sudan',
    
    // Certifications
    'certifications.iso_22000': 'ISO 22000 - Food Safety Management',
    'certifications.haccp': 'HACCP - Hazard Analysis Critical Control Points',
    'certifications.organic': 'Certified Organic Certificate',
    'certifications.sudanese_quality': 'Sudanese Quality Certificate',
    'certifications.export': 'International Export Certificate',
    
    // Markets
    'markets.gulf_countries': 'Gulf Countries',
    'markets.north_africa': 'North Africa',
    'markets.east_africa': 'East Africa',
    'markets.europe_asia': 'Europe & Asia',
    
    // Stats
    'stats.years_experience': 'Years of Experience',
    'stats.employees': 'Specialized Employees',
    'stats.projects': 'Successful Projects',
    'stats.subsidiaries': 'Subsidiaries',
    
    // Features
    'features.certified': 'Certified by the best international institutions',
    'features.expert_team': 'Specialized and highly experienced team',
    'features.strong_presence': 'Strong local and regional presence',
    
    // Buttons
    'buttons.read_more': 'Read More',
    'buttons.learn_our_story': 'Learn Our Story',
    'buttons.start_project': 'Start Your Project With Us',
    'buttons.request_service': 'Request Service',
    
    // CTA
    'cta.ready_to_start': 'Ready to Start Your Next Project?',
    'cta.description': 'Contact us today to discuss how we can help you achieve your goals and develop your business',
    'cta.start_project': 'Start Your Project With Us',
    
    // Footer
    'footer.quick_links': 'Quick Links',
    'footer.contact_us': 'Contact Us',
    'footer.copyright': '© 2024 Deta Group. All rights reserved.'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ar');

  const { data: languages = [], isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching languages from database...');
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('is_default', { ascending: false });
      
      if (error) {
        console.error('Error fetching languages:', error);
        // إذا فشل تحميل اللغات، ارجع لقائمة افتراضية
        return [
          { id: '1', code: 'ar', name: 'Arabic', native_name: 'العربية', is_rtl: true, is_default: true },
          { id: '2', code: 'en', name: 'English', native_name: 'English', is_rtl: false, is_default: false }
        ];
      }
      console.log('Languages loaded:', data);
      return data as Language[];
    }
  });

  useEffect(() => {
    if (languages.length > 0) {
      const defaultLang = languages.find(lang => lang.is_default) || languages[0];
      if (!currentLanguage || currentLanguage !== defaultLang.code) {
        console.log('Setting default language:', defaultLang.code);
        setCurrentLanguage(defaultLang.code);
      }
    }
  }, [languages]);

  const currentLangData = languages.find(lang => lang.code === currentLanguage);
  const isRTL = currentLangData?.is_rtl || currentLanguage === 'ar';

  const t = (key: string): string => {
    const langTranslations = translations[currentLanguage as keyof typeof translations];
    return langTranslations?.[key as keyof typeof langTranslations] || key;
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // إضافة كلاس CSS للغة
    document.documentElement.className = isRTL ? 'rtl' : 'ltr';
  }, [currentLanguage, isRTL]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setCurrentLanguage,
      languages,
      isRTL,
      t,
      isLoading
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
