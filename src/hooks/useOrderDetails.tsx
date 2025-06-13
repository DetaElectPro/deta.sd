import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from './useLanguage';

export interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: {
    id: string;
    image_url: string;
    price: number;
    name: string;
    description: string;
    slug: string;
  };
  unit: {
    id: string;
    name_ar: string;
    name_en: string;
    code: string;
  };
}

export interface OrderDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name?: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  language_code: string;
  notes?: string;
  countries?: { name_ar: string; name_en: string };
  delivery_methods?: { name_ar: string; name_en: string };
  ports?: { name_ar: string; name_en: string };
  cities?: { name_ar: string; name_en: string };
  order_items: OrderItem[];
}

export const useOrderDetails = (orderId?: string) => {
  const { currentLanguage } = useLanguage();

  return useQuery({
    queryKey: ['order-details', orderId, currentLanguage],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          countries(name_ar, name_en),
          delivery_methods(name_ar, name_en),
          ports(name_ar, name_en),
          cities!city_id(name_ar, name_en),
          order_items(
            id,
            quantity,
            unit_price,
            total_price,
            products(
              id,
              image_url,
              price,
              product_translations!inner(
                name,
                description,
                slug
              )
            ),
            units(
              id,
              name_ar,
              name_en,
              code
            )
          )
        `)
        .eq('order_items.products.product_translations.language_code', currentLanguage)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: OrderDetails = {
        ...data,
        order_items: data.order_items?.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          product: {
            id: item.products.id,
            image_url: item.products.image_url,
            price: item.products.price,
            name: item.products.product_translations[0]?.name || '',
            description: item.products.product_translations[0]?.description || '',
            slug: item.products.product_translations[0]?.slug || ''
          },
          unit: item.units
        })) || []
      };

      return transformedData;
    },
    enabled: !!orderId
  });
};
