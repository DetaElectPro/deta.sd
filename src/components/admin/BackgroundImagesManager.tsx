import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BackgroundImagePreview } from './BackgroundImagePreview';
import { BackgroundImagesStats } from './BackgroundImagesStats';
import { ImageUploader } from './ImageUploader';
import {
  useAllBackgroundImages,
  useCreateBackgroundImage,
  useUpdateBackgroundImage,
  useDeleteBackgroundImage,
  useReorderBackgroundImages
} from '@/hooks/useBackgroundImages';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackgroundImage {
  id: string;
  title: string;
  description: string | null;
  url: string;
  file_path: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string | null;
}

export const BackgroundImagesManager = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<BackgroundImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    file_path: '',
    is_active: true
  });

  const { toast } = useToast();
  const { data: images, isLoading } = useAllBackgroundImages();
  const createImage = useCreateBackgroundImage();
  const updateImage = useUpdateBackgroundImage();
  const deleteImage = useDeleteBackgroundImage();
  const reorderImages = useReorderBackgroundImages();

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      file_path: '',
      is_active: true
    });
    setEditingImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingImage) {
        await updateImage.mutateAsync({
          id: editingImage.id,
          ...formData
        });
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث صورة الخلفية بنجاح",
        });
      } else {
        await createImage.mutateAsync(formData);
        toast({
          title: "تم الإنشاء بنجاح",
          description: "تم إضافة صورة خلفية جديدة بنجاح",
        });
      }
      
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (url: string, path: string) => {
    setFormData(prev => ({
      ...prev,
      url,
      file_path: path
    }));
  };

  const handleEdit = (image: BackgroundImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || '',
      url: image.url,
      file_path: image.file_path || '',
      is_active: image.is_active
    });
    setIsCreateOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      try {
        await deleteImage.mutateAsync(id);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف صورة الخلفية بنجاح",
        });
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حذف الصورة",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleActive = async (image: BackgroundImage) => {
    try {
      await updateImage.mutateAsync({
        id: image.id,
        is_active: !image.is_active
      });
      toast({
        title: "تم التحديث",
        description: `تم ${!image.is_active ? 'تفعيل' : 'إلغاء تفعيل'} الصورة`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الصورة",
        variant: "destructive",
      });
    }
  };

  const handleReorder = async (imageId: string, direction: 'up' | 'down') => {
    if (!images) return;
    
    const currentIndex = images.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    
    const reorderedImages = [...images];
    [reorderedImages[currentIndex], reorderedImages[newIndex]] = 
    [reorderedImages[newIndex], reorderedImages[currentIndex]];
    
    const updates = reorderedImages.map((img, index) => ({
      id: img.id,
      display_order: index + 1
    }));
    
    try {
      await reorderImages.mutateAsync(updates);
      toast({
        title: "تم إعادة الترتيب",
        description: "تم تحديث ترتيب الصور بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إعادة ترتيب الصور",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 arabic-heading">إدارة صور الخلفية المتحركة</h1>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة صورة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'تعديل صورة الخلفية' : 'إضافة صورة خلفية جديدة'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الصورة</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: زراعة حديثة"
                  required
                />
              </div>

              {/* رفع الصورة */}
              <ImageUploader
                onUploadComplete={handleImageUpload}
                currentImageUrl={formData.url}
                bucket="background-images"
                folder="uploads"
                maxSizeInMB={10}
              />

              {/* رابط الصورة (للعرض أو الإدخال اليدوي) */}
              <div>
                <Label htmlFor="url">رابط الصورة (اختياري - للإدخال اليدوي)</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/image.jpg أو ارفع صورة أعلاه"
                />
              </div>

              <div>
                <Label htmlFor="description">وصف الصورة (اختياري)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف مختصر للصورة..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">تفعيل الصورة</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateOpen(false);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4 ml-1" />
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={createImage.isPending || updateImage.isPending}
                >
                  <Save className="h-4 w-4 ml-1" />
                  {editingImage ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* إحصائيات صور الخلفية */}
      <BackgroundImagesStats />

      {/* معاينة صور الخلفية */}
      <BackgroundImagePreview />

      <div className="grid gap-4">
        {images?.map((image, index) => (
          <Card key={image.id} className={`overflow-hidden ${!image.is_active ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{image.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-400">
                      الترتيب: {image.display_order} •
                      {image.is_active ? ' مفعلة' : ' غير مفعلة'}
                    </p>
                    {image.file_path && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                        مرفوعة
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReorder(image.id, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReorder(image.id, 'down')}
                    disabled={index === (images?.length || 0) - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(image)}
                  >
                    {image.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(image)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!images || images.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد صور خلفية</h3>
            <p className="text-gray-500 text-center mb-4">
              ابدأ بإضافة صور الخلفية المتحركة لموقعك
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة صورة جديدة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
