
import { useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export const GoogleAnalytics = () => {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (settings?.google_analytics_id && settings.google_analytics_id.trim()) {
      // تحميل سكريبت Google Analytics
      const script1 = document.createElement('script');
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`;
      script1.async = true;
      document.head.appendChild(script1);

      // إعداد Google Analytics
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.google_analytics_id}');
      `;
      document.head.appendChild(script2);

      // تنظيف الذاكرة
      return () => {
        document.head.removeChild(script1);
        document.head.removeChild(script2);
      };
    }
  }, [settings?.google_analytics_id]);

  return null;
};
