
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name_ar');
      
      if (error) {
        console.error('Error fetching countries:', error);
        throw error;
      }
      
      return data;
    },
  });
};

export const usePorts = (countryId?: string, portType?: string) => {
  return useQuery({
    queryKey: ['ports', countryId, portType],
    queryFn: async () => {
      let query = supabase
        .from('ports')
        .select(`
          *,
          countries (
            name_ar,
            name_en,
            code
          )
        `)
        .eq('is_active', true)
        .order('name_ar');

      if (countryId) {
        query = query.eq('country_id', countryId);
      }

      if (portType) {
        query = query.eq('port_type', portType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ports:', error);
        throw error;
      }

      return data;
    },
    enabled: true,
  });
};

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name_ar');

      if (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }

      return data;
    },
  });
};

export const useCitiesByCountry = (countryId?: string) => {
  return useQuery({
    queryKey: ['cities-by-country', countryId],
    queryFn: async () => {
      let query = supabase
        .from('cities')
        .select(`
          *,
          countries (
            name_ar,
            name_en,
            code
          )
        `)
        .order('name_ar');

      if (countryId) {
        query = query.eq('country_id', countryId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }

      return data;
    },
    enabled: true,
  });
};

export const useDeliveryMethods = () => {
  return useQuery({
    queryKey: ['delivery-methods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_methods')
        .select('*')
        .order('name_ar');
      
      if (error) {
        console.error('Error fetching delivery methods:', error);
        throw error;
      }
      
      return data;
    },
  });
};

export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .order('name_ar');
      
      if (error) {
        console.error('Error fetching units:', error);
        throw error;
      }
      
      return data;
    },
  });
};
