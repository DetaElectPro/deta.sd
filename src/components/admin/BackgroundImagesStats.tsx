import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllBackgroundImages } from '@/hooks/useBackgroundImages';
import { Image, Eye, EyeOff, Calendar } from 'lucide-react';

export const BackgroundImagesStats = () => {
  const { data: images, isLoading } = useAllBackgroundImages();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalImages = images?.length || 0;
  const activeImages = images?.filter(img => img.is_active).length || 0;
  const inactiveImages = totalImages - activeImages;
  const recentImages = images?.filter(img => {
    const createdDate = new Date(img.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate > weekAgo;
  }).length || 0;

  const stats = [
    {
      title: 'إجمالي الصور',
      value: totalImages,
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'الصور النشطة',
      value: activeImages,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'الصور غير النشطة',
      value: inactiveImages,
      icon: EyeOff,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'مضافة هذا الأسبوع',
      value: recentImages,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              {stat.title === 'الصور النشطة' && totalImages > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((activeImages / totalImages) * 100)}% من إجمالي الصور
                </p>
              )}
              {stat.title === 'مضافة هذا الأسبوع' && (
                <p className="text-xs text-gray-500 mt-1">
                  آخر 7 أيام
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
