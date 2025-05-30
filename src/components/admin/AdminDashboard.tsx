
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useArticles } from '@/hooks/useArticles';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Users, Eye, TrendingUp, Tag, Settings, Plus } from 'lucide-react';
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
      link: '/admin/content',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'المستخدمين المسجلين',
      value: analytics?.totalUsers || 0,
      icon: Users,
      change: '+3%',
      changeType: 'increase',
      link: '/admin/users',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'مشاهدات الأسبوع',
      value: analytics?.weeklyViews || 0,
      icon: Eye,
      change: '+8%',
      changeType: 'increase',
      link: '/admin/analytics',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'إجمالي الفئات',
      value: analytics?.totalCategories || 0,
      icon: Tag,
      change: '+2%',
      changeType: 'increase',
      link: '/admin/categories',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const quickActions = [
    { title: 'إضافة مقال جديد', icon: Plus, link: '/admin/content', color: 'bg-blue-500 hover:bg-blue-600' },
    { title: 'إدارة الفئات', icon: Tag, link: '/admin/categories', color: 'bg-green-500 hover:bg-green-600' },
    { title: 'إدارة المستخدمين', icon: Users, link: '/admin/users', color: 'bg-purple-500 hover:bg-purple-600' },
    { title: 'إعدادات الموقع', icon: Settings, link: '/admin/settings', color: 'bg-gray-500 hover:bg-gray-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-right">
        <h1 className="text-4xl font-bold text-gray-900 arabic-heading mb-2">لوحة التحكم</h1>
        <p className="text-gray-600 text-lg">مرحباً بك في نظام إدارة المحتوى - مجموعة ديتا</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <p className="text-xs text-gray-600">
                    <span className={`font-semibold ${
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
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-deta-green to-green-600 text-white">
          <CardTitle className="arabic-heading text-xl">الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.link}>
                  <Button 
                    variant="outline" 
                    className="w-full h-24 flex flex-col items-center gap-3 hover:shadow-lg transition-all duration-300 border-2 hover:border-deta-green group"
                  >
                    <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.title}</span>
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
          <CardTitle className="arabic-heading text-xl">آخر المقالات</CardTitle>
          <Link to="/admin/content">
            <Button variant="outline" size="sm" className="hover:bg-deta-green hover:text-white">
              عرض الكل
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles?.slice(0, 5).map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.category} • {article.author}</p>
                </div>
                <div className="text-sm text-gray-500 text-left">
                  {new Date(article.published_at).toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))}
            {!articles?.length && (
              <div className="text-center text-gray-500 py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-4">لا توجد مقالات بعد</p>
                <Link to="/admin/content">
                  <Button className="bg-deta-green hover:bg-deta-green/90">
                    <Plus className="h-4 w-4 ml-2" />
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
