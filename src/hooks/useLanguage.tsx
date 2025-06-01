
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  ar: {
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.products': 'المنتجات',
    'nav.services': 'الخدمات',
    'nav.news': 'الأخبار',
    'nav.contact': 'اتصل بنا',
    'products.title': 'منتجاتنا',
    'products.description': 'نقدم أجود المحاصيل السودانية الطبيعية للتصدير حول العالم',
    'products.all_categories': 'جميع الفئات',
    'products.no_products': 'لا توجد منتجات متاحة',
    'products.new': 'جديد',
    'products.interested': 'مهتم بمنتجاتنا؟',
    'products.contact_text': 'تواصل معنا للحصول على عروض أسعار خاصة وتفاصيل التصدير',
    'buttons.view_details': 'عرض التفاصيل',
    'buttons.contact_us': 'تواصل معنا',
    'hero.title': 'شركة ديتا للصادرات الزراعية',
    'hero.subtitle': 'رائدون في تصدير أجود المحاصيل السودانية إلى العالم',
    'hero.cta': 'استكشف منتجاتنا',
    'about.title': 'من نحن',
    'about.description': 'شركة رائدة في مجال تصدير المحاصيل الزراعية السودانية',
    'services.title': 'خدماتنا',
    'services.description': 'نقدم حلولاً متكاملة للتصدير والشحن',
    'news.title': 'الأخبار والمقالات',
    'news.description': 'آخر الأخبار والتطورات في مجال الزراعة والتصدير',
    'contact.title': 'تواصل معنا',
    'contact.description': 'نحن هنا لخدمتك ومساعدتك',
    'footer.description': 'شركة رائدة في تصدير المحاصيل الزراعية السودانية عالية الجودة',
    'footer.quick_links': 'روابط سريعة',
    'footer.contact_info': 'معلومات التواصل',
    'footer.follow_us': 'تابعنا',
    'footer.rights': 'جميع الحقوق محفوظة'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.products': 'Products',
    'nav.services': 'Services',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'products.title': 'Our Products',
    'products.description': 'We offer the finest natural Sudanese crops for export worldwide',
    'products.all_categories': 'All Categories',
    'products.no_products': 'No products available',
    'products.new': 'New',
    'products.interested': 'Interested in our products?',
    'products.contact_text': 'Contact us for special quotes and export details',
    'buttons.view_details': 'View Details',
    'buttons.contact_us': 'Contact Us',
    'hero.title': 'Deta Agricultural Exports Company',
    'hero.subtitle': 'Leading in exporting the finest Sudanese crops to the world',
    'hero.cta': 'Explore Our Products',
    'about.title': 'About Us',
    'about.description': 'A leading company in exporting Sudanese agricultural crops',
    'services.title': 'Our Services',
    'services.description': 'We provide comprehensive solutions for export and shipping',
    'news.title': 'News & Articles',
    'news.description': 'Latest news and developments in agriculture and export',
    'contact.title': 'Contact Us',
    'contact.description': 'We are here to serve and help you',
    'footer.description': 'A leading company in exporting high-quality Sudanese agricultural crops',
    'footer.quick_links': 'Quick Links',
    'footer.contact_info': 'Contact Information',
    'footer.follow_us': 'Follow Us',
    'footer.rights': 'All rights reserved'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'ar';
    setCurrentLanguage(savedLanguage);
    
    // Set document direction and language
    document.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.lang = savedLanguage;
  }, []);

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.lang = lang;
  };

  const t = (key: string): string => {
    const langTranslations = translations[currentLanguage as keyof typeof translations] || translations.ar;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  const isRTL = currentLanguage === 'ar';

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, isRTL }}>
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
