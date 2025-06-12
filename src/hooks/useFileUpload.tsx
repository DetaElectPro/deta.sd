import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadOptions {
  bucket: string;
  folder?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

interface UploadResult {
  url: string;
  path: string;
  fullPath: string;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    options: UploadOptions
  ): Promise<UploadResult> => {
    const {
      bucket,
      folder = '',
      maxSizeInMB = 10,
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    } = options;

    try {
      setUploading(true);
      setProgress(0);

      // التحقق من نوع الملف
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`نوع الملف غير مدعوم. الأنواع المدعومة: ${allowedTypes.join(', ')}`);
      }

      // التحقق من حجم الملف
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        throw new Error(`حجم الملف كبير جداً. الحد الأقصى: ${maxSizeInMB}MB`);
      }

      // إنشاء اسم فريد للملف
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      setProgress(25);

      // رفع الملف إلى Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      setProgress(75);

      // الحصول على الرابط العام للملف
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setProgress(100);

      const result: UploadResult = {
        url: urlData.publicUrl,
        path: filePath,
        fullPath: data.path
      };

      toast({
        title: "تم رفع الملف بنجاح",
        description: `تم رفع ${file.name} بنجاح`,
      });

      return result;

    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "خطأ في رفع الملف",
        description: error.message || "حدث خطأ أثناء رفع الملف",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (bucket: string, path: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw error;
      }

      toast({
        title: "تم حذف الملف",
        description: "تم حذف الملف من التخزين بنجاح",
      });

    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast({
        title: "خطأ في حذف الملف",
        description: error.message || "حدث خطأ أثناء حذف الملف",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getFileUrl = (bucket: string, path: string): string => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  };

  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    uploading,
    progress
  };
};
