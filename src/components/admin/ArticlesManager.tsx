
import { useState } from 'react';
import { useArticles, useCreateArticle, useUpdateArticle } from '@/hooks/useArticles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Pencil, Plus, Image as ImageIcon, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ArticlesManager = () => {
  const { data: articles, isLoading } = useArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [imageUploadMethod, setImageUploadMethod] = useState<'upload' | 'url'>('upload');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    slug: '',
    is_featured: false,
    image_url: '',
    image_path: ''
  });

  const categories = ['الزراعة', 'التصنيع', 'التكنولوجيا', 'الشراكات', 'المعارض', 'الجودة'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await updateArticle.mutateAsync({
          id: editingArticle.id,
          ...formData
        });
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث المقال بنجاح",
        });
      } else {
        await createArticle.mutateAsync(formData);
        toast({
          title: "تم الإنشاء بنجاح",
          description: "تم إنشاء المقال بنجاح",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المقال",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      author: '',
      slug: '',
      is_featured: false,
      image_url: '',
      image_path: ''
    });
    setEditingArticle(null);
    setImageUploadMethod('upload');
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || '',
      author: article.author || '',
      slug: article.slug || '',
      is_featured: article.is_featured || false,
      image_url: article.image_url || '',
      image_path: article.image_path || ''
    });
    // Set upload method based on whether we have an image_url
    setImageUploadMethod(article.image_url && !article.image_path ? 'url' : 'upload');
    setIsDialogOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleImageUpload = (url: string, path: string) => {
    setFormData({
      ...formData,
      image_url: url,
      image_path: path
    });
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({
      ...formData,
      image_url: url,
      image_path: '' // Clear path when manually entering URL
    });
  };

  if (isLoading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 arabic-heading">إدارة المقالات</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 ml-2" />
              مقال جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? 'تعديل المقال' : 'إنشاء مقال جديد'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">العنوان</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: generateSlug(title)
                    });
                  }}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="slug">الرابط المختصر</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">المقدمة</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">المحتوى</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">التصنيف</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="author">الكاتب</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>صورة المقال</Label>
                <Tabs value={imageUploadMethod} onValueChange={(value) => setImageUploadMethod(value as 'upload' | 'url')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      رفع صورة
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      رابط خارجي
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <ImageUploader
                      onUploadComplete={handleImageUpload}
                      currentImageUrl={formData.image_url}
                      bucket="media"
                      folder="articles"
                      maxSizeInMB={10}
                      disabled={createArticle.isPending || updateArticle.isPending}
                    />
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4">
                    <div>
                      <Label htmlFor="image_url">رابط الصورة</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    {formData.image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.image_url}
                          alt="معاينة الصورة"
                          className="max-w-full h-32 object-cover rounded-md border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">مقال مميز</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={createArticle.isPending || updateArticle.isPending}>
                  {editingArticle ? 'تحديث' : 'إنشاء'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {articles?.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {article.category} • {article.author} •
                    {new Date(article.published_at).toLocaleDateString('ar-SA')}
                  </p>
                  {article.is_featured && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                      مميز
                    </span>
                  )}
                </div>
                {article.image_url && (
                  <div className="flex-shrink-0">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-16 h-16 object-cover rounded-md border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 line-clamp-2">{article.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
