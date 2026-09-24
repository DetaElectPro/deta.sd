import { Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useMultilingualArticles } from "@/hooks/useMultilingualArticles";
import { useReveal } from "@/hooks/useReveal";
import { formatDate } from "@/lib/format";

const NewsPreview = () => {
  const { t, currentLanguage } = useLanguage();
  const { data: articles, isLoading } = useMultilingualArticles();
  const ref = useReveal<HTMLDivElement>();

  if (isLoading) return null;

  const latest = (articles ?? []).slice(0, 3);
  if (latest.length === 0) return null;

  const lang = currentLanguage === "ar" ? "ar" : "en";

  return (
    <section className="bg-white py-14 sm:py-20">
      <div ref={ref} className="reveal container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2 className="mb-3 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl lg:text-4xl">
            {t("home.news.title")}
          </h2>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          <p className="text-base text-stone-500 sm:text-lg lg:text-xl">
            {t("home.news.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 lg:gap-8">
          {latest.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden rounded-3xl border border-deta-green/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <CardContent className="p-0">
                {article.image_url && (
                  <div className="aspect-[16/9] overflow-hidden bg-sand-100">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5 sm:p-6">
                  <div className="mb-3 flex items-center gap-2 text-xs text-stone-500 sm:text-sm">
                    <Calendar className="h-4 w-4 shrink-0 text-deta-gold" />
                    <span>{formatDate(article.published_at, lang)}</span>
                  </div>
                  <h3 className="line-clamp-2 text-lg font-bold leading-snug text-deta-green arabic-heading sm:text-xl">
                    <Link to="/news" className="transition-colors hover:text-palm-800">
                      {article.title}
                    </Link>
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center sm:mt-10">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-deta-green/30 text-deta-green hover:bg-deta-green hover:text-white"
          >
            <Link to="/news">
              {t("home.news.view_all")}
              <ArrowLeft className="h-4 w-4 ms-2 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;
