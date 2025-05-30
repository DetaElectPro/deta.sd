
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
    'language.switch': 'تغيير اللغة'
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
    'language.switch': 'Switch Language'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ar');

  const { data: languages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      return data as Language[];
    }
  });

  useEffect(() => {
    const defaultLang = languages.find(lang => lang.is_default);
    if (defaultLang) {
      setCurrentLanguage(defaultLang.code);
    }
  }, [languages]);

  const currentLangData = languages.find(lang => lang.code === currentLanguage);
  const isRTL = currentLangData?.is_rtl || false;

  const t = (key: string): string => {
    return translations[currentLanguage as keyof typeof translations]?.[key] || key;
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRTL]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setCurrentLanguage,
      languages,
      isRTL,
      t
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
