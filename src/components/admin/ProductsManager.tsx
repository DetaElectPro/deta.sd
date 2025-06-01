
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Save, X } from "lucide-react";
import { useMultilingualProducts, useCreateMultilingualProduct, useUpdateMultilingualProduct, useDeleteProduct } from "@/hooks/useMultilingualProducts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const ProductsManager = () => {
  const { toast } = useToast();
  const { data: products = [], isLoading } = useMultilingualProducts();
  const createProduct = useCreateMultilingualProduct();
  const updateProduct = useUpdateMultilingualProduct();
  const deleteProduct = useDeleteProduct();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    image_url: '',
    price: '',
    is_new: false,
    is_featured: false,
    translations: {
      ar: { name: '', description: '', slug: '' },
      en: { name: '', description: '', slug: '' }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        category_id: formData.category_id || null,
        image_url: formData.image_url || null,
        price: formData.price ? parseFloat(formData.price) : null,
        is_new: formData.is_new,
        is_featured: formData.is_featured
      };

      const translations = {
        ar: {
          ...formData.translations.ar,
          slug: formData.translations.ar.slug || formData.translations.ar.name.toLowerCase().replace(/\s+/g, '-')
        },
        en: {
          ...formData.translations.en,
          slug: formData.translations.en.slug || formData.translations.en.name.toLowerCase().replace(/\s+/g, '-')
        }
      };

      if (editingId) {
        await updateProduct.mutateAsync({
          productId: editingId,
          productData,
          translations
        });
        toast({
          title: "تم التحديث",
          description: "تم تحديث المنتج بنجاح"
        });
        setEditingId(null);
      } else {
        await createProduct.mutateAsync({
          productData,
          translations
        });
        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء المنتج بنجاح"
        });
        setIsCreating(false);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ المنتج",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      price: product.price?.toString() || '',
      is_new: product.is_new || false,
      is_featured: product.is_featured || false,
      translations: {
        ar: { 
          name: product.name || '', 
          description: product.description || '', 
          slug: product.slug || '' 
        },
        en: { 
          name: '', 
          description: '', 
          slug: '' 
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await deleteProduct.mutateAsync(id);
        toast({
          title: "تم الحذف",
          description: "تم حذف المنتج بنجاح"
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ في حذف المنتج",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: '',
      image_url: '',
      price: '',
      is_new: false,
      is_featured: false,
      translations: {
        ar: { name: '', description: '', slug: '' },
        en: { name: '', description: '', slug: '' }
      }
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
        <Button onClick={() => setIsCreating(true)} className="bg-deta-green hover:bg-deta-green/90">
          <Plus className="h-4 w-4 ml-2" />
          إضافة منتج جديد
        </Button>
      </div>

      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">رابط الصورة</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => setFormData({...formData, is_new: checked})}
                  />
                  <Label htmlFor="is_new">منتج جديد</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                  />
                  <Label htmlFor="is_featured">منتج مميز</Label>
                </div>
              </div>

              {/* الترجمة العربية */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">الترجمة العربية</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="ar_name">اسم المنتج (عربي)</Label>
                    <Input
                      id="ar_name"
                      value={formData.translations.ar.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          ar: { ...formData.translations.ar, name: e.target.value }
                        }
                      })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ar_description">الوصف (عربي)</Label>
                    <Textarea
                      id="ar_description"
                      value={formData.translations.ar.description}
                      onChange={(e) => setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          ar: { ...formData.translations.ar, description: e.target.value }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* الترجمة الإنجليزية */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">English Translation</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="en_name">Product Name (English)</Label>
                    <Input
                      id="en_name"
                      value={formData.translations.en.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          en: { ...formData.translations.en, name: e.target.value }
                        }
                      })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="en_description">Description (English)</Label>
                    <Textarea
                      id="en_description"
                      value={formData.translations.en.description}
                      onChange={(e) => setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          en: { ...formData.translations.en, description: e.target.value }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 ml-2" />
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    {product.is_new && <Badge className="bg-green-500">جديد</Badge>}
                    {product.is_featured && <Badge className="bg-blue-500">مميز</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  {product.price && (
                    <p className="text-lg font-bold text-deta-green">${product.price}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsManager;
