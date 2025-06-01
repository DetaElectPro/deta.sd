
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from './useLanguage';

interface ProductTranslation {
  id: string;
  product_id: string;
  language_code: string;
  name: string;
  description?: string;
  slug: string;
}

interface ProductTranslationInput {
  name: string;
  description?: string;
  slug: string;
}

interface Product {
  id: string;
  category_id?: string;
  image_url?: string;
  price?: number;
  is_new: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  name?: string;
  description?: string;
  slug?: string;
}

export const useMultilingualProducts = () => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['multilingual_products', currentLanguage],
    queryFn: async () => {
      console.log('Fetching products for language:', currentLanguage);
      
      const { data: products, error } = await supabase
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
        .eq('product_translations.language_code', currentLanguage)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Fetched products:', products);
      
      return products?.map(product => ({
        ...product,
        name: product.product_translations?.[0]?.name || '',
        description: product.product_translations?.[0]?.description || '',
        slug: product.product_translations?.[0]?.slug || ''
      })) || [];
    },
    enabled: !!currentLanguage
  });
};

export const useCreateMultilingualProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productData, translations }: { 
      productData: any; 
      translations: Record<string, ProductTranslationInput> 
    }) => {
      console.log('Creating product with data:', productData, translations);
      
      // إنشاء المنتج الأساسي
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (productError) {
        console.error('Error creating product:', productError);
        throw productError;
      }
      
      console.log('Created product:', product);
      
      // إنشاء الترجمات
      const translationPromises = Object.entries(translations).map(([langCode, translation]) => {
        if (translation.name) {
          return supabase
            .from('product_translations')
            .insert({
              product_id: product.id,
              language_code: langCode,
              name: translation.name,
              description: translation.description || '',
              slug: translation.slug || translation.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            });
        }
        return null;
      }).filter(Boolean);
      
      const results = await Promise.all(translationPromises);
      console.log('Translation results:', results);
      
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multilingual_products'] });
    }
  });
};

export const useUpdateMultilingualProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      productId, 
      productData, 
      translations 
    }: { 
      productId: string; 
      productData: any; 
      translations: Record<string, ProductTranslationInput> 
    }) => {
      console.log('Updating product:', productId, productData, translations);
      
      // تحديث المنتج الأساسي
      const { error: productError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId);
      
      if (productError) {
        console.error('Error updating product:', productError);
        throw productError;
      }
      
      // تحديث الترجمات
      const translationPromises = Object.entries(translations).map(([langCode, translation]) => {
        if (translation.name) {
          return supabase
            .from('product_translations')
            .upsert({
              product_id: productId,
              language_code: langCode,
              name: translation.name,
              description: translation.description || '',
              slug: translation.slug || translation.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'product_id,language_code'
            });
        }
        return null;
      }).filter(Boolean);
      
      await Promise.all(translationPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multilingual_products'] });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multilingual_products'] });
    }
  });
};

export type { ProductTranslationInput };
