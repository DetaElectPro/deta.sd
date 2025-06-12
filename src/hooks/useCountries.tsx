import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Country {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  is_local: boolean;
}

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name_ar', { ascending: true });
      
      if (error) throw error;
      return data as Country[];
    }
  });
};
