import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Port {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  port_type: string;
  country_id: string;
  is_active: boolean;
}

export const usePorts = (countryId?: string) => {
  return useQuery({
    queryKey: ['ports', countryId],
    queryFn: async () => {
      if (!countryId) return [];
      
      const { data, error } = await supabase
        .from('ports')
        .select('*')
        .eq('country_id', countryId)
        .eq('is_active', true)
        .order('name_ar', { ascending: true });
      
      if (error) throw error;
      return data as Port[];
    },
    enabled: !!countryId
  });
};
