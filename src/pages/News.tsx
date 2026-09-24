
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Newspaper } from "lucide-react";
import { useMultilingualArticles } from "@/hooks/useMultilingualArticles";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useLanguage } from "@/hooks/useLanguage";
import SEO from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";

const News = () => {
  usePageTracking();
  const { t, currentLanguage } = useLanguage();
  const { data: articles, isLoading } = useMultilingualArticles();
  const { data: settings } = useSiteSettings();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "الزراعة": 
      case "Agriculture": return "bg-deta-green text-white hover:bg-deta-green";
      case "التصنيع": 
      case "Manufacturing": return "bg-deta-gold text-white hover:bg-deta-gold";
      case "التكنولوجيا": 
      case "Technology": return "bg-blue-600 text-white hover:bg-blue-700";
      case "الشراكات": 
      case "Partnerships": return "bg-purple-600 text-white hover:bg-purple-700";
      case "المعارض": 
      case "Exhibitions": return "bg-orange-600 text-white hover:bg-orange-700";
      case "الجودة": 
      case "Quality": return "bg-red-600 text-white hover:bg-red-700";
      default: return "bg-slate-600 text-white hover:bg-slate-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (currentLanguage === 'ar') {
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const featuredNews = articles?.find(article => article.is_featured);
  const regularNews = articles?.filter(article => !article.is_featured) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <section className="bg-gradient-to-bl from-emerald-950 via-deta-green to-deta-green-light py-14 sm:py-20">
          <div className="container mx-auto px-4 text-center text-white">
            <Skeleton className="h-10 sm:h-12 w-64 sm:w-96 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-5 sm:h-6 w-full max-w-[600px] mx-auto bg-white/20" />
          </div>
        </section>
        <section className="py-14 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
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
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Deta Group - مجموعة ديتا | الأخبار"
        description="آخر أخبار مجموعة ديتا: مشاريع وشراكات وفعاليات في الزراعة والتصنيع والتكنولوجيا."
        keywords="أخبار ديتا, أخبار الزراعة, فعاليات, شراكات, مشاريع السودان"
        url="https://deta.sd/news"
        canonical="https://deta.sd/news"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "أخبار مجموعة ديتا",
          url: "https://deta.sd/news",
          description: "آخر أخبار مجموعة ديتا في الزراعة والتصنيع والتكنولوجيا.",
        }}
      />
      <Header />
      
      {/* Hero Section - Fixed gradient background with proper text contrast */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-emerald-950 via-deta-green to-deta-green-light py-14 sm:py-20">
        <div aria-hidden="true" className="absolute -top-24 -start-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-28 -end-16 h-80 w-80 rounded-full bg-deta-gold/20 blur-3xl" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium sm:text-sm">
            <Newspaper className="h-4 w-4" />
            {t('news.featured')}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 arabic-heading">
            {t('news.title')}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed text-white/90">
            {t('news.description')}
          </p>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews && (
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-deta-green mb-6 sm:mb-8 arabic-heading">
              {t('news.featured')}
            </h2>
            <Card className="border border-slate-100 shadow-lg overflow-hidden rounded-3xl bg-white">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="h-56 sm:h-64 lg:h-auto bg-gradient-to-br from-deta-green to-deta-green-light overflow-hidden">
                    {featuredNews.image_url && (
                      <img 
                        src={featuredNews.image_url} 
                        alt={featuredNews.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                      <Badge className={getCategoryColor(featuredNews.category)}>
                        {featuredNews.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{formatDate(featuredNews.published_at)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-deta-green mb-3 sm:mb-4 arabic-heading leading-tight">
                      {featuredNews.title}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                      {featuredNews.excerpt}
                    </p>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm">
                        <User className="w-4 h-4 shrink-0" />
                        <span className="line-clamp-1">{featuredNews.author}</span>
                      </div>
                      <Button className="bg-deta-green hover:bg-deta-green/90 rounded-full">
                        {t('buttons.read_more')}
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
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
      <section className="py-12 sm:py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-deta-green mb-8 sm:mb-12 arabic-heading">
            {t('news.all_news')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {regularNews.map((article) => (
              <Card key={article.id} className="border border-slate-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden rounded-2xl bg-white">
                <CardContent className="p-0">
                  <div className="aspect-[16/9] bg-gradient-to-br from-deta-green-light to-deta-green overflow-hidden">
                    {article.image_url && (
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-deta-green mb-2 sm:mb-3 arabic-heading leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <User className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">{article.author}</span>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full border-deta-green text-deta-green hover:bg-deta-green hover:text-white shrink-0">
                        {t('buttons.read_more')}
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
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <Card className="border border-slate-100 shadow-lg bg-gradient-to-bl from-emerald-950 via-deta-green to-deta-green-light rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center text-white">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 arabic-heading">
                {t('news.newsletter_title')}
              </h2>
              <p className="text-base sm:text-lg text-white/90 mb-8">
                {t('news.newsletter_description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder={t('news.email_placeholder')}
                  className="flex-1 px-4 py-3 border border-white/30 bg-white text-slate-900 rounded-full focus:outline-none focus:ring-2 focus:ring-deta-gold text-sm sm:text-base"
                />
                <Button className="bg-deta-gold hover:bg-deta-gold/90 text-emerald-950 font-semibold px-8 rounded-full">
                  {t('news.subscribe')}
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
