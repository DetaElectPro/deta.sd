
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
    
    // Sections
    'sections.our_services': 'مجالات عملنا',
    'sections.services_description': 'نقدم خدمات متنوعة ومتكاملة في ثلاث مجالات رئيسية تخدم احتياجات السوق المحلي والإقليمي',
    'sections.achievements': 'إنجازاتنا بالأرقام',
    'sections.achievements_description': 'نفتخر بما حققناه على مدار السنوات الماضية',
    'sections.who_we_are': 'من نحن',
    'sections.about_description': 'مجموعة ديتا هي شركة رائدة في السودان تعمل في مجالات متعددة تشمل الزراعة وتصنيع الأغذية وتطوير البرمجيات. نحن نؤمن بالتطوير المستدام والابتكار لتقديم أفضل الحلول لعملائنا.',
    
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
    
    // Sections
    'sections.our_services': 'Our Services',
    'sections.services_description': 'We offer diverse and integrated services in three main areas serving local and regional market needs',
    'sections.achievements': 'Our Achievements in Numbers',
    'sections.achievements_description': 'We take pride in what we have achieved over the years',
    'sections.who_we_are': 'Who We Are',
    'sections.about_description': 'Deta Group is a leading company in Sudan operating in multiple fields including agriculture, food manufacturing, and software development. We believe in sustainable development and innovation to provide the best solutions for our clients.',
    
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
