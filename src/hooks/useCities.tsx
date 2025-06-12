import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface City {
  id: string;
  name_ar: string;
  name_en: string;
  state_ar: string;
  state_en: string;
  country_id: string;
  is_capital: boolean;
}

export const useCities = (countryId?: string) => {
  return useQuery({
    queryKey: ['cities', countryId],
    queryFn: async () => {
      if (!countryId) return [];
      
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('country_id', countryId)
        .order('name_ar', { ascending: true });
      
      if (error) throw error;
      return data as City[];
    },
    enabled: !!countryId
  });
};
