
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { usePageTracking } from "@/hooks/usePageTracking";
import { Skeleton } from "@/components/ui/skeleton";

const News = () => {
  usePageTracking();
  const { data: articles, isLoading } = useArticles();
  const { data: settings } = useSiteSettings();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "الزراعة": return "bg-deta-green text-white";
      case "التصنيع": return "bg-deta-gold text-white";
      case "التكنولوجيا": return "bg-blue-600 text-white";
      case "الشراكات": return "bg-purple-600 text-white";
      case "المعارض": return "bg-orange-600 text-white";
      case "الجودة": return "bg-red-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredNews = articles?.find(article => article.is_featured);
  const regularNews = articles?.filter(article => !article.is_featured) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <section className="bg-deta-gradient py-20">
          <div className="container mx-auto px-4 text-center text-white">
            <Skeleton className="h-12 w-96 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-6 w-[600px] mx-auto bg-white/20" />
          </div>
        </section>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-none shadow-lg">
                  <CardContent className="p-0">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-deta-gradient py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">
            {settings?.site_title ? `أخبار ${settings.site_title}` : 'الأخبار والمستجدات'}
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            تابعوا آخر أخبار مجموعة ديتا وإنجازاتها في مختلف المجالات
          </p>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-deta-green mb-8 arabic-heading">الخبر المميز</h2>
            <Card className="border-none shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="h-64 lg:h-auto bg-gradient-to-br from-deta-green to-deta-green-light">
                    {featuredNews.image_url && (
                      <img 
                        src={featuredNews.image_url} 
                        alt={featuredNews.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={getCategoryColor(featuredNews.category)}>
                        {featuredNews.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(featuredNews.published_at)}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-deta-green mb-4 arabic-heading leading-tight">
                      {featuredNews.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {featuredNews.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <User className="w-4 h-4" />
                        <span>{featuredNews.author}</span>
                      </div>
                      <Button className="bg-deta-green hover:bg-deta-green/90">
                        اقرأ المزيد
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Regular News */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-deta-green mb-12 arabic-heading">جميع الأخبار</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularNews.map((article) => (
              <Card key={article.id} className="border-none shadow-lg hover-scale overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-48 bg-gradient-to-br from-deta-green-light to-deta-green">
                    {article.image_url && (
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-deta-green mb-3 arabic-heading leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <Button variant="outline" size="sm" className="border-deta-green text-deta-green hover:bg-deta-green hover:text-white">
                        اقرأ المزيد
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-none shadow-lg bg-deta-light-gradient">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-deta-green mb-4 arabic-heading">
                اشترك في نشرتنا الإخبارية
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                احصل على آخر الأخبار والمستجدات من مجموعة ديتا مباشرة في بريدك الإلكتروني
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="أدخل بريدك الإلكتروني"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deta-green"
                />
                <Button className="bg-deta-green hover:bg-deta-green/90 px-8">
                  اشترك
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;
