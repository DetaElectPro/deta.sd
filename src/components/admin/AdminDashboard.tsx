
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useArticles } from '@/hooks/useArticles';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Users, Eye, TrendingUp, Tag, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const AdminDashboard = () => {
  const { data: articles } = useArticles();

  const { data: analytics } = useQuery({
    queryKey: ['admin_analytics'],
    queryFn: async () => {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const [pageViewsResult, profilesResult, categoriesResult] = await Promise.all([
        supabase
          .from('page_views')
          .select('*')
          .gte('created_at', lastWeek.toISOString()),
        supabase
          .from('profiles')
          .select('id'),
        supabase
          .from('categories')
          .select('id')
      ]);

      return {
        totalPageViews: pageViewsResult.data?.length || 0,
        totalUsers: profilesResult.data?.length || 0,
        weeklyViews: pageViewsResult.data?.length || 0,
        totalCategories: categoriesResult.data?.length || 0
      };
    }
  });

  const stats = [
    {
      title: 'إجمالي المقالات',
      value: articles?.length || 0,
      icon: FileText,
      change: '+12%',
      changeType: 'increase',
      link: '/admin/content'
    },
    {
      title: 'المستخدمين المسجلين',
      value: analytics?.totalUsers || 0,
      icon: Users,
      change: '+3%',
      changeType: 'increase',
      link: '/admin/users'
    },
    {
      title: 'مشاهدات الأسبوع',
      value: analytics?.weeklyViews || 0,
      icon: Eye,
      change: '+8%',
      changeType: 'increase',
      link: '/admin/analytics'
    },
    {
      title: 'إجمالي الفئات',
      value: analytics?.totalCategories || 0,
      icon: Tag,
      change: '+2%',
      changeType: 'increase',
      link: '/admin/categories'
    }
  ];

  const quickActions = [
    { title: 'إضافة مقال جديد', icon: FileText, link: '/admin/content', color: 'bg-blue-500' },
    { title: 'إدارة الفئات', icon: Tag, link: '/admin/categories', color: 'bg-green-500' },
    { title: 'إدارة المستخدمين', icon: Users, link: '/admin/users', color: 'bg-purple-500' },
    { title: 'إعدادات الموقع', icon: Settings, link: '/admin/settings', color: 'bg-gray-500' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 arabic-heading">لوحة التحكم</h1>
        <p className="text-gray-600 mt-2">مرحباً بك في نظام إدارة المحتوى - مجموعة ديتا</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-600 mt-1">
                    <span className={`${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    {' من الشهر الماضي'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="arabic-heading">الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.link}>
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col items-center gap-2 hover:bg-gray-50"
                  >
                    <div className={`p-2 rounded-full ${action.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm">{action.title}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Articles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="arabic-heading">آخر المقالات</CardTitle>
          <Link to="/admin/content">
            <Button variant="outline" size="sm">عرض الكل</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles?.slice(0, 5).map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.category} • {article.author}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(article.published_at).toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))}
            {!articles?.length && (
              <div className="text-center text-gray-500 py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد مقالات بعد</p>
                <Link to="/admin/content">
                  <Button className="mt-4 bg-deta-green hover:bg-deta-green/90">
                    إضافة مقال جديد
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
