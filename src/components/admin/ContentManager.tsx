
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useArticles } from '@/hooks/useArticles';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Calendar,
  User
} from 'lucide-react';

export const ContentManager = () => {
  const { data: articles, refetch } = useArticles();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    author: '',
    image_url: '',
    is_featured: false
  });

  const filteredArticles = articles?.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(articles?.map(article => article.category) || [])];

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content || '',
      excerpt: article.excerpt || '',
      category: article.category,
      author: article.author,
      image_url: article.image_url || '',
      is_featured: article.is_featured || false
    });
  };

  const handleSave = async () => {
    try {
      const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update({
            ...formData,
            slug,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingArticle.id);

        if (error) throw error;
        toast({ title: "تم تحديث المقال بنجاح" });
      } else {
        const { error } = await supabase
          .from('articles')
          .insert({
            ...formData,
            slug,
            published_at: new Date().toISOString()
          });

        if (error) throw error;
        toast({ title: "تم إنشاء المقال بنجاح" });
      }

      setEditingArticle(null);
      setIsCreating(false);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        author: '',
        image_url: '',
        is_featured: false
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ في حفظ المقال",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "تم حذف المقال بنجاح" });
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ في حذف المقال",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditingArticle(null);
    setIsCreating(false);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      author: '',
      image_url: '',
      is_featured: false
    });
  };

  if (editingArticle || isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold arabic-heading">
            {editingArticle ? 'تعديل المقال' : 'إضافة مقال جديد'}
          </h2>
          <div className="space-x-2">
            <Button onClick={handleSave} className="bg-deta-green hover:bg-deta-green/90">
              حفظ
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              إلغاء
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">عنوان المقال</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="أدخل عنوان المقال"
                />
              </div>
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="أدخل فئة المقال"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">الكاتب</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  placeholder="أدخل اسم الكاتب"
                />
              </div>
              <div>
                <Label htmlFor="image_url">رابط الصورة</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="أدخل رابط الصورة"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">المقطع التعريفي</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                placeholder="أدخل مقطع تعريفي قصير"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content">محتوى المقال</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="أدخل محتوى المقال"
                rows={10}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="is_featured">مقال مميز</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 arabic-heading">إدارة المحتوى</h1>
        <Button onClick={() => setIsCreating(true)} className="bg-deta-green hover:bg-deta-green/90">
          <Plus className="h-4 w-4 ml-2" />
          إضافة مقال جديد
        </Button>
      </div>

      {/* أدوات البحث والفلترة */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في المقالات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">جميع الفئات</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المقالات */}
      <div className="grid gap-4">
        {filteredArticles?.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{article.title}</h3>
                    {article.is_featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        مميز
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.published_at).toLocaleDateString('ar-SA')}
                    </div>
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(article)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!filteredArticles?.length && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد مقالات</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
