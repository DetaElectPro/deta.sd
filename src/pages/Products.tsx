
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wheat, Apple, Coffee, Package } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Products = () => {
  const { t } = useLanguage();

  const productCategories = [
    {
      icon: <Wheat className="w-12 h-12 text-deta-gold" />,
      title: t('products.grains_legumes'),
      description: t('products.grains_legumes_desc'),
      products: [
        { name: t('products.wheat'), quality: t('quality.excellent'), origin: t('origin.sudan') },
        { name: t('products.corn'), quality: t('quality.high'), origin: t('origin.sudan') },
        { name: t('products.millet'), quality: t('quality.excellent'), origin: t('origin.sudan') },
        { name: t('products.sesame'), quality: t('quality.premium'), origin: t('origin.sudan') },
        { name: t('products.peanuts'), quality: t('quality.high'), origin: t('origin.sudan') },
        { name: t('products.cowpeas'), quality: t('quality.excellent'), origin: t('origin.sudan') }
      ]
    },
    {
      icon: <Apple className="w-12 h-12 text-deta-gold" />,
      title: t('products.fruits_vegetables'),
      description: t('products.fruits_vegetables_desc'),
      products: [
        { name: t('products.dates'), quality: t('quality.premium'), origin: t('origin.sudan') },
        { name: t('products.mango'), quality: t('quality.excellent'), origin: t('origin.sudan') },
        { name: t('products.guava'), quality: t('quality.high'), origin: t('origin.sudan') },
        { name: t('products.potatoes'), quality: t('quality.excellent'), origin: t('origin.sudan') },
        { name: t('products.onions'), quality: t('quality.high'), origin: t('origin.sudan') },
        { name: t('products.tomatoes'), quality: t('quality.excellent'), origin: t('origin.sudan') }
      ]
    },
    {
      icon: <Coffee className="w-12 h-12 text-deta-gold" />,
      title: t('products.beverages_spices'),
      description: t('products.beverages_spices_desc'),
      products: [
        { name: t('products.hibiscus'), quality: t('quality.premium'), origin: t('origin.sudan') },
        { name: t('products.grapes'), quality: t('quality.excellent'), origin: t('origin.sudan') },
        { name: t('products.cumin'), quality: t('quality.high'), origin: t('origin.sudan') },
        { name: t('products.coriander'), quality: t('quality.excellent'), origin: t('origin.sudan') },
        { name: t('products.fenugreek'), quality: t('quality.high'), origin: t('origin.sudan') },
        { name: t('products.cinnamon'), quality: t('quality.premium'), origin: t('origin.sudan') }
      ]
    },
    {
      icon: <Package className="w-12 h-12 text-deta-gold" />,
      title: t('products.processed_products'),
      description: t('products.processed_products_desc'),
      products: [
        { name: t('products.wheat_flour'), quality: t('quality.excellent'), origin: t('origin.sudan') },
        { name: t('products.sesame_oil'), quality: t('quality.premium'), origin: t('origin.sudan') },
        { name: t('products.peanut_butter'), quality: t('quality.high'), origin: t('origin.sudan') },
        { name: t('products.date_paste'), quality: t('quality.excellent'), origin: t('origin.sudan') },
        { name: t('products.ground_spices'), quality: t('quality.high'), origin: t('origin.sudan') },
        { name: t('products.cleaned_grains'), quality: t('quality.excellent'), origin: t('origin.sudan') }
      ]
    }
  ];

  const certifications = [
    t('certifications.iso_22000'),
    t('certifications.haccp'),
    t('certifications.organic'),
    t('certifications.sudanese_quality'),
    t('certifications.export')
  ];

  const getQualityColor = (quality: string) => {
    if (quality === t('quality.premium')) return "bg-deta-gold text-white";
    if (quality === t('quality.excellent')) return "bg-deta-green text-white";
    if (quality === t('quality.high')) return "bg-deta-green-light text-white";
    return "bg-gray-500 text-white";
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-deta-gradient py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">{t('site.products')}</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {t('products.hero_description')}
          </p>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">
              {t('products.categories')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('products.categories_description')}
            </p>
          </div>
          
          <div className="space-y-16">
            {productCategories.map((category, index) => (
              <Card key={index} className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-3 gap-0">
                    {/* Category Info */}
                    <div className="lg:col-span-1 bg-deta-light-gradient p-8">
                      <div className="flex items-center gap-4 mb-6">
                        {category.icon}
                        <h3 className="text-2xl font-bold text-deta-green arabic-heading">
                          {category.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    
                    {/* Products Grid */}
                    <div className="lg:col-span-2 p-8">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.products.map((product, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-deta-green mb-2">{product.name}</h4>
                            <div className="space-y-2">
                              <Badge className={getQualityColor(product.quality)}>
                                {product.quality}
                              </Badge>
                              <p className="text-sm text-gray-600">{t('products.origin')}: {product.origin}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-deta-green mb-6 arabic-heading">
                {t('products.quality_standards')}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t('products.quality_description')}
              </p>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-deta-green arabic-heading">
                  {t('products.our_certifications')}
                </h3>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-deta-gold rounded-full"></div>
                      <span className="text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-48 bg-gradient-to-br from-deta-green to-deta-green-light rounded-lg"></div>
                <div className="h-32 bg-gradient-to-br from-deta-gold to-deta-gold-light rounded-lg"></div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="h-32 bg-gradient-to-br from-deta-brown to-deta-brown-light rounded-lg"></div>
                <div className="h-48 bg-gradient-to-br from-deta-green-light to-deta-green rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Export Markets */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">
              {t('products.export_markets')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('products.export_description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              t('markets.gulf_countries'),
              t('markets.north_africa'),
              t('markets.east_africa'),
              t('markets.europe_asia')
            ].map((market, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover-scale">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-deta-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-deta-green arabic-heading">
                    {market}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-deta-gradient">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6 arabic-heading">
            {t('products.interested_cta')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('products.cta_description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-deta-green hover:bg-gray-100">
              {t('products.download_catalog')}
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-deta-green">
              {t('products.request_quote')}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
