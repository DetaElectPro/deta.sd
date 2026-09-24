import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from './useLanguage';

export const useProductById = (id: string | undefined) => {
  const { currentLanguage } = useLanguage();

  return useQuery({
    queryKey: ['product', id, currentLanguage],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          id,
          category_id,
          image_url,
          price,
          is_new,
          is_featured,
          created_at,
          updated_at,
          product_translations!inner(
            id,
            name,
            description,
            slug,
            language_code
          ),
          categories(
            id,
            name,
            slug
          )
        `)
        .eq('id', id as string)
        .eq('product_translations.language_code', currentLanguage)
        .single();

      if (error) {
        throw error;
      }

      if (!product) {
        return null;
      }

      return {
        ...product,
        name: (product.product_translations as any)?.[0]?.name || '',
        description: (product.product_translations as any)?.[0]?.description || '',
        slug: (product.product_translations as any)?.[0]?.slug || '',
      };
    },
    enabled: !!id && !!currentLanguage,
  });
};
