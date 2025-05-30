
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Eye, MousePointer } from 'lucide-react';

export const AnalyticsView = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics_dashboard'],
    queryFn: async () => {
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // إحصائيات الزيارات
      const [pageViewsResult, usersResult, weeklyViewsResult] = await Promise.all([
        supabase
          .from('page_views')
          .select('*')
          .gte('created_at', lastMonth.toISOString()),
        supabase
          .from('profiles')
          .select('id, created_at'),
        supabase
          .from('page_views')
          .select('page_path, created_at')
          .gte('created_at', lastWeek.toISOString())
      ]);

      // تجميع البيانات بحسب اليوم
      const dailyViews = weeklyViewsResult.data?.reduce((acc: any, view) => {
        const date = new Date(view.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(dailyViews || {}).map(([date, views]) => ({
        date: new Date(date).toLocaleDateString('ar-SA'),
        views
      }));

      // الصفحات الأكثر زيارة
      const topPages = weeklyViewsResult.data?.reduce((acc: any, view) => {
        const page = view.page_path;
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      }, {});

      const topPagesData = Object.entries(topPages || {})
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([page, views]) => ({ page, views }));

      return {
        totalPageViews: pageViewsResult.data?.length || 0,
        totalUsers: usersResult.data?.length || 0,
        weeklyViews: weeklyViewsResult.data?.length || 0,
        uniqueVisitors: new Set(pageViewsResult.data?.map(v => v.session_id)).size,
        chartData,
        topPages: topPagesData
      };
    }
  });

  if (isLoading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  const stats = [
    {
      title: 'إجمالي الزيارات',
      value: analytics?.totalPageViews || 0,
      icon: Eye,
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
      title: 'زيارات الأسبوع',
      value: analytics?.weeklyViews || 0,
      icon: TrendingUp,
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'الزوار الفريدون',
      value: analytics?.uniqueVisitors || 0,
      icon: MousePointer,
      change: '+5%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 arabic-heading">التحليلات</h1>
        <p className="text-gray-600 mt-2">إحصائيات الموقع وسلوك المستخدمين</p>
      </div>

      {/* بطاقات الإحصائيات */}
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

      {/* مخطط الزيارات اليومية */}
      <Card>
        <CardHeader>
          <CardTitle>الزيارات اليومية (آخر أسبوع)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#2D5016" 
                  strokeWidth={2}
                  dot={{ fill: '#2D5016' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* الصفحات الأكثر زيارة */}
      <Card>
        <CardHeader>
          <CardTitle>الصفحات الأكثر زيارة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.topPages || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* نصائح التحسين */}
      <Card>
        <CardHeader>
          <CardTitle>نصائح لتحسين الأداء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">تحسين المحتوى</h3>
              <p className="text-sm text-blue-700">
                ركز على إنشاء محتوى عالي الجودة يجذب المزيد من الزوار ويزيد من وقت البقاء على الموقع.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">تحسين SEO</h3>
              <p className="text-sm text-green-700">
                استخدم الكلمات المفتاحية المناسبة وحسن من عناوين الصفحات لزيادة الظهور في محركات البحث.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
