
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Image, FileText, Video, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const MediaManager = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: '',
    url: '',
    type: 'image'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: media, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createMedia = useMutation({
    mutationFn: async (mediaData: any) => {
      const { error } = await supabase
        .from('media')
        .insert(mediaData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast({
        title: "تم الرفع بنجاح",
        description: "تم رفع الملف بنجاح",
      });
      setIsUploadOpen(false);
      setUploadData({ name: '', url: '', type: 'image' });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفع الملف",
        variant: "destructive",
      });
    }
  });

  const deleteMedia = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف الملف بنجاح",
      });
    }
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMedia.mutateAsync(uploadData);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-8 w-8" />;
      case 'video':
        return <Video className="h-8 w-8" />;
      default:
        return <FileText className="h-8 w-8" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'غير محدد';
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 arabic-heading">إدارة الوسائط</h1>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 ml-2" />
              رفع ملف
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>رفع ملف جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="name">اسم الملف</Label>
                <Input
                  id="name"
                  value={uploadData.name}
                  onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="url">رابط الملف</Label>
                <Input
                  id="url"
                  type="url"
                  value={uploadData.url}
                  onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
                  placeholder="https://example.com/file.jpg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">نوع الملف</Label>
                <select
                  id="type"
                  value={uploadData.type}
                  onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="image">صورة</option>
                  <option value="video">فيديو</option>
                  <option value="document">مستند</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={createMedia.isPending}>
                  رفع
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {media?.map((file) => (
          <Card key={file.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.type)}
                  <div>
                    <CardTitle className="text-sm font-medium truncate">
                      {file.name}
                    </CardTitle>
                    <p className="text-xs text-gray-500">
                      {file.type} • {formatFileSize(file.size_bytes)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMedia.mutate(file.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {file.type === 'image' && (
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
              {file.type === 'video' && (
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <video
                    src={file.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>
              )}
              {file.type === 'document' && (
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="mt-2">
                <p className="text-xs text-gray-500 truncate">
                  {file.url}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(file.created_at).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!media || media.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد ملفات</h3>
            <p className="text-gray-500 text-center mb-4">
              ابدأ برفع الملفات الأولى لإدارة وسائط موقعك
            </p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Upload className="h-4 w-4 ml-2" />
              رفع ملف جديد
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
