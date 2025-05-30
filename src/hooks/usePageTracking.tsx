
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await supabase.from('page_views').insert({
          page_path: location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          session_id: sessionStorage.getItem('session_id') || crypto.randomUUID()
        });
        
        if (!sessionStorage.getItem('session_id')) {
          sessionStorage.setItem('session_id', crypto.randomUUID());
        }
      } catch (error) {
        console.error('خطأ في تتبع الصفحة:', error);
      }
    };

    trackPageView();
  }, [location]);
};
