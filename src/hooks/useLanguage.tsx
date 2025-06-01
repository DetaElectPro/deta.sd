
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Language {
  code: string;
  name: string;
  native_name: string;
  is_default: boolean;
  is_rtl: boolean;
}

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  setCurrentLanguage: (lang: string) => void;
  languages: Language[];
  t: (key: string) => string;
  isRTL: boolean;
  isLoading: boolean;
}

const translations = {
  ar: {
    // Site Info
    'site.company_name': 'مجموعة ديتا للصادرات الزراعية',
    'site.company_description': 'شركة رائدة في تصدير أجود المحاصيل السودانية إلى العالم',
    'site.home': 'الرئيسية',
    'site.about': 'من نحن',
    'site.services': 'خدماتنا',
    'site.products': 'منتجاتنا',
    'site.news': 'الأخبار',
    'site.contact': 'اتصل بنا',
    'site.location': 'الخرطوم، السودان',

    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.products': 'المنتجات',
    'nav.services': 'الخدمات',
    'nav.news': 'الأخبار',
    'nav.contact': 'اتصل بنا',

    // Hero Section
    'hero.welcome': 'مرحباً بكم في',
    'hero.title': 'شركة ديتا للصادرات الزراعية',
    'hero.subtitle': 'رائدون في تصدير أجود المحاصيل السودانية إلى العالم',
    'hero.description': 'نحن مجموعة ديتا، شركة رائدة تعمل في ثلاث مجالات متكاملة: الزراعة المستدامة، تصنيع الأغذية، وتطوير البرمجيات. نسعى لتقديم حلول مبتكرة تساهم في التنمية الاقتصادية والاجتماعية في السودان والمنطقة.',
    'hero.cta': 'استكشف منتجاتنا',
    'hero.learn_more': 'اعرف المزيد',
    'hero.contact_us': 'تواصل معنا',
    'hero.vision_title': 'رؤيتنا العالمية',
    'hero.vision_subtitle': 'نحو مستقبل أفضل',

    // Sections
    'sections.our_services': 'خدماتنا',
    'sections.services_description': 'نقدم حلولاً متكاملة في مجالات الزراعة وتصنيع الأغذية وتطوير البرمجيات',
    'sections.achievements': 'إنجازاتنا',
    'sections.achievements_description': 'أرقام تحكي قصة نجاحنا',
    'sections.who_we_are': 'من نحن',
    'sections.about_description': 'مجموعة ديتا هي شركة رائدة تأسست بهدف تطوير القطاعات الاقتصادية الحيوية في السودان. نعمل بشغف لتقديم أفضل المنتجات والخدمات في مجالات الزراعة وتصنيع الأغذية وتطوير البرمجيات.',

    // Services
    'services.agriculture': 'الزراعة المستدامة',
    'services.agriculture_desc': 'نطور تقنيات زراعية متقدمة لإنتاج أجود المحاصيل',
    'services.agriculture_description': 'نقدم حلولاً زراعية متطورة ومستدامة تهدف إلى تحسين الإنتاجية وجودة المحاصيل',
    'services.agriculture_feature1': 'زراعة عضوية معتمدة',
    'services.agriculture_feature2': 'تقنيات ري حديثة',
    'services.agriculture_feature3': 'مراقبة جودة المحاصيل',
    'services.food_manufacturing': 'تصنيع الأغذية',
    'services.food_manufacturing_desc': 'نصنع منتجات غذائية عالية الجودة باستخدام أحدث التقنيات',
    'services.food_manufacturing_description': 'نختص في تصنيع وتجهيز المنتجات الغذائية وفقاً لأعلى معايير الجودة والسلامة الغذائية',
    'services.food_manufacturing_feature1': 'معايير جودة عالمية',
    'services.food_manufacturing_feature2': 'تقنيات حفظ متطورة',
    'services.food_manufacturing_feature3': 'تغليف صديق للبيئة',
    'services.software_development': 'تطوير البرمجيات',
    'services.software_development_desc': 'نبني حلولاً تقنية مبتكرة لتطوير الأعمال',
    'services.software_development_description': 'نطور حلولاً برمجية مخصصة لتلبية احتياجات الشركات والمؤسسات في عصر التحول الرقمي',
    'services.software_development_feature1': 'تطبيقات ويب متقدمة',
    'services.software_development_feature2': 'أنظمة إدارة مخصصة',
    'services.software_development_feature3': 'حلول الذكاء الاصطناعي',
    'services.consulting': 'الاستشارات',
    'services.consulting_description': 'نقدم استشارات متخصصة لتطوير الأعمال والاستراتيجيات',
    'services.consulting_feature1': 'دراسات جدوى اقتصادية',
    'services.consulting_feature2': 'استشارات إدارية',
    'services.consulting_feature3': 'تخطيط استراتيجي',
    'services.title': 'خدماتنا',
    'services.description': 'نقدم مجموعة شاملة من الخدمات المتميزة في مجالات الزراعة وتصنيع الأغذية وتطوير البرمجيات',
    'services.main_services': 'خدماتنا الرئيسية',
    'services.why_choose_us': 'لماذا تختارنا',
    'services.quality_assurance': 'ضمان الجودة',
    'services.quality_assurance_description': 'نلتزم بأعلى معايير الجودة في جميع منتجاتنا وخدماتنا',
    'services.expert_team': 'فريق خبراء',
    'services.expert_team_description': 'فريق من المتخصصين ذوي الخبرة العالية في مجالاتهم',
    'services.innovative_solutions': 'حلول مبتكرة',
    'services.innovative_solutions_description': 'نقدم حلولاً مبتكرة تواكب أحدث التطورات التقنية',
    'services.proven_track_record': 'سجل حافل بالنجاحات',
    'services.proven_track_record_description': 'تاريخ طويل من المشاريع الناجحة والعملاء الراضين',
    'services.ready_to_start': 'مستعد للبدء؟',
    'services.contact_us_today': 'تواصل معنا اليوم ودعنا نساعدك في تحقيق أهدافك',

    // About
    'about.title': 'من نحن',
    'about.description': 'مجموعة ديتا للصادرات الزراعية - شركة رائدة في تصدير أجود المحاصيل السودانية',
    'about.our_story': 'قصتنا',
    'about.story_text': 'تأسست مجموعة ديتا بحلم كبير لتكون جسراً يربط بين الثروات الزراعية السودانية والأسواق العالمية. منذ انطلاقتنا، ونحن نعمل بجد واجتهاد لتحقيق التميز في كل ما نقوم به.',
    'about.years_experience': 'سنوات من الخبرة',
    'about.projects_completed': 'مشروع مكتمل',
    'about.team_members': 'عضو في الفريق',
    'about.our_values': 'قيمنا',
    'about.integrity': 'النزاهة',
    'about.integrity_desc': 'نلتزم بأعلى معايير النزاهة والشفافية في جميع تعاملاتنا',
    'about.innovation': 'الابتكار',
    'about.innovation_desc': 'نسعى دائماً للابتكار وتطوير حلول جديدة تلبي احتياجات عملائنا',
    'about.quality': 'الجودة',
    'about.quality_desc': 'الجودة هي أساس كل ما نقوم به، من المنتجات إلى الخدمات',
    'about.our_team': 'فريقنا',
    'about.ceo': 'الرئيس التنفيذي',
    'about.ceo_bio': 'خبرة واسعة في مجال الإدارة والتجارة الدولية',
    'about.cto': 'مدير التقنية',
    'about.cto_bio': 'متخصص في تطوير الحلول التقنية المبتكرة',
    'about.marketing_manager': 'مدير التسويق',
    'about.marketing_bio': 'خبير في استراتيجيات التسويق والتواصل',
    'about.our_vision': 'رؤيتنا',
    'about.vision_text': 'أن نكون الشركة الرائدة في تصدير المنتجات الزراعية السودانية عالمياً، مع المساهمة في التنمية المستدامة للقطاع الزراعي في السودان.',
    'about.our_mission': 'مهمتنا',
    'about.mission_text': 'نسعى لتقديم أجود المنتجات الزراعية السودانية للأسواق العالمية، مع الحفاظ على أعلى معايير الجودة والاستدامة البيئية.',

    // Products
    'products.title': 'منتجاتنا',
    'products.description': 'نقدم أجود المحاصيل السودانية الطبيعية للتصدير حول العالم',
    'products.all_categories': 'جميع الفئات',
    'products.no_products': 'لا توجد منتجات متاحة',
    'products.new': 'جديد',
    'products.interested': 'مهتم بمنتجاتنا؟',
    'products.contact_text': 'تواصل معنا للحصول على عروض أسعار خاصة وتفاصيل التصدير',

    // Stats
    'stats.years_experience': 'سنوات من الخبرة',
    'stats.employees': 'موظف',
    'stats.projects': 'مشروع مكتمل',
    'stats.subsidiaries': 'شركة تابعة',

    // Features
    'features.certified': 'معتمد دولياً',
    'features.expert_team': 'فريق خبراء',
    'features.strong_presence': 'حضور قوي إقليمياً',

    // CTA
    'cta.ready_to_start': 'مستعد لبدء مشروعك؟',
    'cta.description': 'تواصل معنا اليوم ودعنا نساعدك في تحقيق أهدافك من خلال حلولنا المتميزة',
    'cta.start_project': 'ابدأ مشروعك',

    // Buttons
    'buttons.view_details': 'عرض التفاصيل',
    'buttons.contact_us': 'تواصل معنا',
    'buttons.read_more': 'اقرأ المزيد',
    'buttons.learn_our_story': 'تعرف على قصتنا',
    'buttons.view_portfolio': 'عرض أعمالنا',

    // Footer
    'footer.description': 'شركة رائدة في تصدير المحاصيل الزراعية السودانية عالية الجودة',
    'footer.quick_links': 'روابط سريعة',
    'footer.contact_info': 'معلومات التواصل',
    'footer.contact_us': 'تواصل معنا',
    'footer.follow_us': 'تابعنا',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.copyright': '© 2024 مجموعة ديتا للصادرات الزراعية. جميع الحقوق محفوظة.',

    // Language
    'language.switch': 'تغيير اللغة',

    // Admin
    'admin.content': 'إدارة المحتوى',
    'content.edit_article': 'تعديل المقال',
    'content.add_article': 'إضافة مقال جديد',
    'content.save': 'حفظ',
    'content.cancel': 'إلغاء',
    'content.author': 'الكاتب',
    'content.category': 'الفئة',
    'content.title': 'العنوان',
    'content.excerpt': 'المقطع التعريفي',
    'content.content': 'المحتوى',
    'content.add_new': 'إضافة جديد'
  },
  en: {
    // Site Info
    'site.company_name': 'Deta Agricultural Exports Group',
    'site.company_description': 'Leading company in exporting the finest Sudanese crops to the world',
    'site.home': 'Home',
    'site.about': 'About',
    'site.services': 'Services',
    'site.products': 'Products',
    'site.news': 'News',
    'site.contact': 'Contact',
    'site.location': 'Khartoum, Sudan',

    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.products': 'Products',
    'nav.services': 'Services',
    'nav.news': 'News',
    'nav.contact': 'Contact',

    // Hero Section
    'hero.welcome': 'Welcome to',
    'hero.title': 'Deta Agricultural Exports Company',
    'hero.subtitle': 'Leading in exporting the finest Sudanese crops to the world',
    'hero.description': 'We are Deta Group, a leading company operating in three integrated fields: sustainable agriculture, food manufacturing, and software development. We strive to provide innovative solutions that contribute to economic and social development in Sudan and the region.',
    'hero.cta': 'Explore Our Products',
    'hero.learn_more': 'Learn More',
    'hero.contact_us': 'Contact Us',
    'hero.vision_title': 'Our Global Vision',
    'hero.vision_subtitle': 'Towards a Better Future',

    // Sections
    'sections.our_services': 'Our Services',
    'sections.services_description': 'We provide integrated solutions in agriculture, food manufacturing, and software development',
    'sections.achievements': 'Our Achievements',
    'sections.achievements_description': 'Numbers that tell our success story',
    'sections.who_we_are': 'Who We Are',
    'sections.about_description': 'Deta Group is a leading company established with the aim of developing vital economic sectors in Sudan. We work passionately to provide the best products and services in agriculture, food manufacturing, and software development.',

    // Services
    'services.agriculture': 'Sustainable Agriculture',
    'services.agriculture_desc': 'We develop advanced agricultural techniques to produce the finest crops',
    'services.agriculture_description': 'We provide advanced and sustainable agricultural solutions aimed at improving productivity and crop quality',
    'services.agriculture_feature1': 'Certified organic farming',
    'services.agriculture_feature2': 'Modern irrigation techniques',
    'services.agriculture_feature3': 'Crop quality monitoring',
    'services.food_manufacturing': 'Food Manufacturing',
    'services.food_manufacturing_desc': 'We manufacture high-quality food products using the latest technologies',
    'services.food_manufacturing_description': 'We specialize in manufacturing and processing food products according to the highest quality and food safety standards',
    'services.food_manufacturing_feature1': 'International quality standards',
    'services.food_manufacturing_feature2': 'Advanced preservation techniques',
    'services.food_manufacturing_feature3': 'Eco-friendly packaging',
    'services.software_development': 'Software Development',
    'services.software_development_desc': 'We build innovative technical solutions for business development',
    'services.software_development_description': 'We develop custom software solutions to meet the needs of companies and institutions in the era of digital transformation',
    'services.software_development_feature1': 'Advanced web applications',
    'services.software_development_feature2': 'Custom management systems',
    'services.software_development_feature3': 'AI solutions',
    'services.consulting': 'Consulting',
    'services.consulting_description': 'We provide specialized consulting for business development and strategies',
    'services.consulting_feature1': 'Economic feasibility studies',
    'services.consulting_feature2': 'Management consulting',
    'services.consulting_feature3': 'Strategic planning',
    'services.title': 'Our Services',
    'services.description': 'We provide a comprehensive range of distinguished services in agriculture, food manufacturing, and software development',
    'services.main_services': 'Our Main Services',
    'services.why_choose_us': 'Why Choose Us',
    'services.quality_assurance': 'Quality Assurance',
    'services.quality_assurance_description': 'We commit to the highest quality standards in all our products and services',
    'services.expert_team': 'Expert Team',
    'services.expert_team_description': 'A team of highly experienced specialists in their fields',
    'services.innovative_solutions': 'Innovative Solutions',
    'services.innovative_solutions_description': 'We provide innovative solutions that keep pace with the latest technological developments',
    'services.proven_track_record': 'Proven Track Record',
    'services.proven_track_record_description': 'A long history of successful projects and satisfied clients',
    'services.ready_to_start': 'Ready to Start?',
    'services.contact_us_today': 'Contact us today and let us help you achieve your goals',

    // About
    'about.title': 'About Us',
    'about.description': 'Deta Agricultural Exports Group - A leading company in exporting the finest Sudanese crops',
    'about.our_story': 'Our Story',
    'about.story_text': 'Deta Group was founded with a big dream to be a bridge connecting Sudanese agricultural wealth with global markets. Since our launch, we have been working hard and diligently to achieve excellence in everything we do.',
    'about.years_experience': 'Years of Experience',
    'about.projects_completed': 'Completed Projects',
    'about.team_members': 'Team Members',
    'about.our_values': 'Our Values',
    'about.integrity': 'Integrity',
    'about.integrity_desc': 'We commit to the highest standards of integrity and transparency in all our dealings',
    'about.innovation': 'Innovation',
    'about.innovation_desc': 'We always strive for innovation and developing new solutions that meet our clients\' needs',
    'about.quality': 'Quality',
    'about.quality_desc': 'Quality is the foundation of everything we do, from products to services',
    'about.our_team': 'Our Team',
    'about.ceo': 'Chief Executive Officer',
    'about.ceo_bio': 'Extensive experience in management and international trade',
    'about.cto': 'Chief Technology Officer',
    'about.cto_bio': 'Specialist in developing innovative technical solutions',
    'about.marketing_manager': 'Marketing Manager',
    'about.marketing_bio': 'Expert in marketing strategies and communication',
    'about.our_vision': 'Our Vision',
    'about.vision_text': 'To be the leading company in exporting Sudanese agricultural products globally, while contributing to the sustainable development of the agricultural sector in Sudan.',
    'about.our_mission': 'Our Mission',
    'about.mission_text': 'We strive to provide the finest Sudanese agricultural products to global markets, while maintaining the highest standards of quality and environmental sustainability.',

    // Products
    'products.title': 'Our Products',
    'products.description': 'We offer the finest natural Sudanese crops for export worldwide',
    'products.all_categories': 'All Categories',
    'products.no_products': 'No products available',
    'products.new': 'New',
    'products.interested': 'Interested in our products?',
    'products.contact_text': 'Contact us for special quotes and export details',

    // Stats
    'stats.years_experience': 'Years of Experience',
    'stats.employees': 'Employees',
    'stats.projects': 'Completed Projects',
    'stats.subsidiaries': 'Subsidiaries',

    // Features
    'features.certified': 'Internationally Certified',
    'features.expert_team': 'Expert Team',
    'features.strong_presence': 'Strong Regional Presence',

    // CTA
    'cta.ready_to_start': 'Ready to Start Your Project?',
    'cta.description': 'Contact us today and let us help you achieve your goals through our distinguished solutions',
    'cta.start_project': 'Start Your Project',

    // Buttons
    'buttons.view_details': 'View Details',
    'buttons.contact_us': 'Contact Us',
    'buttons.read_more': 'Read More',
    'buttons.learn_our_story': 'Learn Our Story',
    'buttons.view_portfolio': 'View Portfolio',

    // Footer
    'footer.description': 'A leading company in exporting high-quality Sudanese agricultural crops',
    'footer.quick_links': 'Quick Links',
    'footer.contact_info': 'Contact Information',
    'footer.contact_us': 'Contact Us',
    'footer.follow_us': 'Follow Us',
    'footer.rights': 'All rights reserved',
    'footer.copyright': '© 2024 Deta Agricultural Exports Group. All rights reserved.',

    // Language
    'language.switch': 'Switch Language',

    // Admin
    'admin.content': 'Content Management',
    'content.edit_article': 'Edit Article',
    'content.add_article': 'Add New Article',
    'content.save': 'Save',
    'content.cancel': 'Cancel',
    'content.author': 'Author',
    'content.category': 'Category',
    'content.title': 'Title',
    'content.excerpt': 'Excerpt',
    'content.content': 'Content',
    'content.add_new': 'Add New'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('ar');

  // Fetch languages from database
  const { data: languages = [], isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('is_default', { ascending: false });
      
      if (error) {
        console.error('Error fetching languages:', error);
        return [];
      }
      
      return data || [];
    }
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'ar';
    setCurrentLanguage(savedLanguage);
    
    // Set document direction and language - fix: use documentElement.lang
    document.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLanguage;
  }, []);

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    const langTranslations = translations[currentLanguage as keyof typeof translations] || translations.ar;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  const isRTL = currentLanguage === 'ar';

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      setCurrentLanguage: setLanguage,
      languages,
      t, 
      isRTL,
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
