
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useArticles } from '@/hooks/useArticles';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Users, Eye, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: articles } = useArticles();

  const { data: analytics } = useQuery({
    queryKey: ['admin_analytics'],
    queryFn: async () => {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const [pageViewsResult, profilesResult] = await Promise.all([
        supabase
          .from('page_views')
          .select('*')
          .gte('created_at', lastWeek.toISOString()),
        supabase
          .from('profiles')
          .select('id')
      ]);

      return {
        totalPageViews: pageViewsResult.data?.length || 0,
        totalUsers: profilesResult.data?.length || 0,
        weeklyViews: pageViewsResult.data?.length || 0
      };
    }
  });

  const stats = [
    {
      title: 'إجمالي المقالات',
      value: articles?.length || 0,
      icon: FileText,
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'المستخدمين المسجلين',
      value: analytics?.totalUsers || 0,
      icon: Users,
      change: '+3%',
      changeType: 'increase'
    },
    {
      title: 'مشاهدات الأسبوع',
      value: analytics?.weeklyViews || 0,
      icon: Eye,
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'معدل النمو',
      value: '15.3%',
      icon: TrendingUp,
      change: '+2.1%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 arabic-heading">لوحة التحكم</h1>
        <p className="text-gray-600 mt-2">مرحباً بك في نظام إدارة المحتوى</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
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
          );
        })}
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="arabic-heading">آخر المقالات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles?.slice(0, 5).map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.category} • {article.author}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(article.published_at).toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
