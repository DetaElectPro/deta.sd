
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Edit, Trash2, Search, Users, Shield, User } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export const UsersManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    role: ''
  });

  const { data: users, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserProfile[];
    }
  });

  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || '',
      role: user.role
    });
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          role: formData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);

      if (error) throw error;
      toast({ title: "تم تحديث المستخدم بنجاح" });
      setEditingUser(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث المستخدم",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "تم حذف المستخدم بنجاح" });
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ في حذف المستخدم",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'مدير', color: 'bg-red-100 text-red-800' },
      editor: { label: 'محرر', color: 'bg-blue-100 text-blue-800' },
      user: { label: 'مستخدم', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (editingUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold arabic-heading">تعديل المستخدم</h2>
          <div className="space-x-2">
            <Button onClick={handleSave} className="bg-deta-green hover:bg-deta-green/90">
              حفظ
            </Button>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              إلغاء
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                value={editingUser.email}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="full_name">الاسم الكامل</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            <div>
              <Label htmlFor="role">الدور</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="user">مستخدم</option>
                <option value="editor">محرر</option>
                <option value="admin">مدير</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 arabic-heading">إدارة المستخدمين</h1>
      </div>

      {/* أدوات البحث */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث عن المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات المستخدمين */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold">{users?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">المديرين</p>
                <p className="text-2xl font-bold">
                  {users?.filter(u => u.role === 'admin').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">المستخدمين العاديين</p>
                <p className="text-2xl font-bold">
                  {users?.filter(u => u.role === 'user').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة المستخدمين */}
      <div className="grid gap-4">
        {filteredUsers?.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user.full_name || 'غير محدد'}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleBadge(user.role)}
                      <span className="text-sm text-gray-500">
                        انضم في {new Date(user.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
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

      {!filteredUsers?.length && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد نتائج</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
