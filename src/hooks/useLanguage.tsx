
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
    'admin.dashboard': 'لوحة التحكم',
    'admin.content': 'إدارة المحتوى',
    'admin.categories': 'إدارة الفئات',
    'admin.users': 'إدارة المستخدمين',
    'admin.languages': 'إدارة اللغات',
    'admin.media': 'الوسائط',
    'admin.settings': 'إعدادات الموقع',
    'admin.analytics': 'التحليلات',
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
    'language.switch': 'تغيير اللغة',
    'site.title': 'الموقع الإلكتروني',
    'site.home': 'الرئيسية',
    'site.about': 'عن الشركة',
    'site.products': 'المنتجات',
    'site.services': 'الخدمات',
    'site.news': 'الأخبار',
    'site.contact': 'اتصل بنا'
  },
  en: {
    'admin.dashboard': 'Dashboard',
    'admin.content': 'Content Management',
    'admin.categories': 'Categories Management',
    'admin.users': 'Users Management',
    'admin.languages': 'Languages Management',
    'admin.media': 'Media',
    'admin.settings': 'Site Settings',
    'admin.analytics': 'Analytics',
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
    'language.switch': 'Switch Language',
    'site.title': 'Website',
    'site.home': 'Home',
    'site.about': 'About',
    'site.products': 'Products',
    'site.services': 'Services',
    'site.news': 'News',
    'site.contact': 'Contact'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ar');

  const { data: languages = [], isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
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
      return data as Language[];
    }
  });

  useEffect(() => {
    if (languages.length > 0 && !currentLanguage) {
      const defaultLang = languages.find(lang => lang.is_default) || languages[0];
      setCurrentLanguage(defaultLang.code);
    }
  }, [languages, currentLanguage]);

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
