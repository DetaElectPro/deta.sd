import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBackgroundImages = () => {
  return useQuery({
    queryKey: ['background_images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('background_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useAllBackgroundImages = () => {
  return useQuery({
    queryKey: ['all_background_images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('background_images')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateBackgroundImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageData: any) => {
      // الحصول على أعلى ترتيب موجود
      const { data: maxOrderData } = await supabase
        .from('background_images')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);

      const nextOrder = maxOrderData && maxOrderData.length > 0
        ? maxOrderData[0].display_order + 1
        : 1;

      const { error } = await supabase
        .from('background_images')
        .insert({
          ...imageData,
          display_order: nextOrder,
          is_active: imageData.is_active ?? true
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['background_images'] });
      queryClient.invalidateQueries({ queryKey: ['all_background_images'] });
    }
  });
};

export const useUpdateBackgroundImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase
        .from('background_images')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['background_images'] });
      queryClient.invalidateQueries({ queryKey: ['all_background_images'] });
    }
  });
};

export const useDeleteBackgroundImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // حذف السجل من قاعدة البيانات (سيتم حذف الملف تلقائياً بواسطة trigger)
      const { error } = await supabase
        .from('background_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['background_images'] });
      queryClient.invalidateQueries({ queryKey: ['all_background_images'] });
    }
  });
};

export const useReorderBackgroundImages = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (images: { id: string; display_order: number }[]) => {
      const updates = images.map(img => 
        supabase
          .from('background_images')
          .update({ display_order: img.display_order })
          .eq('id', img.id)
      );
      
      const results = await Promise.all(updates);
      
      // التحقق من وجود أخطاء
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('فشل في إعادة ترتيب بعض الصور');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['background_images'] });
      queryClient.invalidateQueries({ queryKey: ['all_background_images'] });
    }
  });
};
