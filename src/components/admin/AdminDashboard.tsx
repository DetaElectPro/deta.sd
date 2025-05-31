
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  FileText, 
  Users, 
  Tag, 
  BarChart3,
  Globe,
  Image
} from 'lucide-react';

export const AdminDashboard = () => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('admin.content'),
      value: '0',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: t('admin.categories'), 
      value: '0',
      icon: Tag,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: t('admin.users'),
      value: '1',
      icon: Users,
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100'
    },
    {
      title: t('admin.languages'),
      value: '2',
      icon: Globe,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 arabic-heading">
          {t('admin.dashboard')}
        </h1>
        <p className="text-gray-600 mt-2">
          مرحباً بك في لوحة التحكم
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* بطاقات الإجراءات السريعة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('admin.content')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              إدارة المقالات والمحتوى متعدد اللغات
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">• إضافة مقالات جديدة</p>
              <p className="text-sm text-gray-500">• ترجمة المحتوى</p>
              <p className="text-sm text-gray-500">• إدارة الفئات</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('admin.languages')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              إدارة اللغات والترجمات
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">• العربية (افتراضية)</p>
              <p className="text-sm text-gray-500">• الإنجليزية</p>
              <p className="text-sm text-gray-500">• دعم RTL/LTR</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
