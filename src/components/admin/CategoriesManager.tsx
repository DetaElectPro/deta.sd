
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Edit, Trash2, Plus, Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  created_at: string;
}

export const CategoriesManager = () => {
  const { toast } = useToast();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6B7280'
  });

  const { data: categories, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Category[];
    }
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color
    });
  };

  const handleSave = async () => {
    try {
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description,
            color: formData.color,
            slug
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast({ title: "تم تحديث الفئة بنجاح" });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            description: formData.description,
            color: formData.color,
            slug
          });

        if (error) throw error;
        toast({ title: "تم إنشاء الفئة بنجاح" });
      }

      handleCancel();
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ في حفظ الفئة",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "تم حذف الفئة بنجاح" });
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ في حذف الفئة",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData({
      name: '',
      description: '',
      color: '#6B7280'
    });
  };

  if (editingCategory || isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold arabic-heading">
            {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
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
            <div>
              <Label htmlFor="name">اسم الفئة</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="أدخل اسم الفئة"
              />
            </div>

            <div>
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="أدخل وصف الفئة"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="color">اللون</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  placeholder="#6B7280"
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 arabic-heading">إدارة الفئات</h1>
        <Button onClick={() => setIsCreating(true)} className="bg-deta-green hover:bg-deta-green/90">
          <Plus className="h-4 w-4 ml-2" />
          إضافة فئة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {category.description && (
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
              )}
              
              <div className="text-xs text-gray-500">
                تم الإنشاء: {new Date(category.created_at).toLocaleDateString('ar-SA')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!categories?.length && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد فئات</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
