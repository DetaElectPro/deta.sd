import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OrderFormData } from '@/lib/validationSchemas';

export interface OrderSubmissionData extends OrderFormData {
  languageCode?: string;
}

export const useOrderSubmission = () => {
  return useMutation({
    mutationFn: async (orderData: OrderSubmissionData) => {
      // First, create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
          country_id: orderData.countryId,
          city_id: orderData.cityId,
          port_id: orderData.portId || null,
          company_name: orderData.companyName || null,
          notes: orderData.notes || null,
          language_code: orderData.languageCode || 'ar',
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Then, create the order item; on failure, roll back the created order
      const { data: orderItem, error: orderItemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: orderData.productId,
          quantity: 1, // Default quantity, you can make this configurable if needed
        })
        .select()
        .single();

      if (orderItemError) {
        await supabase.from('orders').delete().eq('id', order.id);
        throw new Error('فشل حفظ بنود الطلب - Order items failed, order rolled back');
      }

      return order;
    }
  });
};
