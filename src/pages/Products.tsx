
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useLanguage } from "@/hooks/useLanguage";
import { useMultilingualProducts } from "@/hooks/useMultilingualProducts";
import SEO from "@/components/SEO";
import { Loader2, ArrowRight, PackageSearch, Boxes } from "lucide-react";

const Products = () => {
  usePageTracking();
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: products = [], isLoading, error } = useMultilingualProducts();

  // استخراج الفئات الفريدة من المنتجات
  const categories = Array.from(
    new Map(
      products
        .filter(product => product.categories)
        .map(product => [
          product.categories.id,
          {
            id: product.categories.id,
            name: product.categories.name || product.categories.slug
          }
        ])
    ).values()
  );

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === selectedCategory)
    : products;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-deta-green" />
          <span className="sr-only">{t('common.loading')}</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px] px-4">
          <div className="text-center">
            <PackageSearch className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-red-500">{t('common.error')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <SEO
        title="Deta Group - مجموعة ديتا | منتجاتنا"
        description="اكتشف منتجات مجموعة ديتا الزراعية والغذائية عالية الجودة المصنوعة في السودان بمعايير عالمية."
        keywords="منتجات ديتا, منتجات زراعية, أغذية سودانية, منتجات عضوية, تسوق"
        url="https://deta.sd/products"
        canonical="https://deta.sd/products"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-emerald-950 via-deta-green to-deta-green-light py-14 sm:py-20">
        <div aria-hidden="true" className="absolute -top-24 -start-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-28 -end-16 h-80 w-80 rounded-full bg-deta-gold/20 blur-3xl" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium sm:text-sm">
            <Boxes className="h-4 w-4" />
            {t('products.all_categories')}
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl arabic-heading">
            {t('products.title')}
          </h1>
          <p className="mt-4 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed text-white/90">
            {t('products.description')}
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <section className="py-8 sm:py-10 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full text-sm ${
                  selectedCategory === null 
                    ? "bg-deta-green text-white shadow-md" 
                    : "border-deta-green text-deta-green hover:bg-deta-green hover:text-white"
                }`}
              >
                {t('products.all_categories')}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full text-sm ${
                    selectedCategory === category.id 
                      ? "bg-deta-green text-white shadow-md" 
                      : "border-deta-green text-deta-green hover:bg-deta-green hover:text-white"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <PackageSearch className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-base sm:text-lg">{t('products.no_products')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-2xl bg-white">
                  <CardContent className="p-0">
                    <Link to={`/products/${product.id}`} className="block">
                      <div className="aspect-[4/3] bg-gradient-to-br from-deta-green-light to-deta-green overflow-hidden">
                        {product.image_url && (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        {product.categories && (
                          <Badge className="bg-deta-gold/15 text-deta-gold border border-deta-gold/30 hover:bg-deta-gold/25">
                            {product.categories.name}
                          </Badge>
                        )}
                        {product.is_new && (
                          <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
                            {t('products.new')}
                          </Badge>
                        )}
                      </div>
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-base sm:text-lg font-bold text-deta-green mb-2 arabic-heading hover:underline line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        {product.price ? (
                          <span className="text-lg font-bold text-deta-green">
                            ${product.price}
                          </span>
                        ) : (
                          <span />
                        )}
                        <Link to={`/products/${product.id}`}>
                          <Button size="sm" className="bg-deta-green hover:bg-deta-green/90 rounded-full">
                            {t('buttons.view_details')}
                            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-14 sm:pb-20">
        <div className="container mx-auto px-4">
          <Card className="border-none shadow-lg bg-gradient-to-bl from-emerald-950 via-deta-green to-deta-green-light rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 arabic-heading">
                {t('products.interested')}
              </h2>
              <p className="text-base sm:text-lg mb-8 max-w-2xl mx-auto text-white/90">
                {t('products.contact_text')}
              </p>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="rounded-full bg-white text-deta-green border-white hover:bg-slate-100">
                  {t('buttons.contact_us')}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
