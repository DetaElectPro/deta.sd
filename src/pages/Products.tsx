
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
import { Loader2 } from "lucide-react";

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
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">حدث خطأ في تحميل المنتجات</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-deta-green to-deta-green-light py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">
            {isRTL ? 'منتجاتنا' : 'Our Products'}
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {isRTL ? 'اكتشف مجموعة واسعة من المنتجات عالية الجودة' : 'Discover our wide range of high-quality products'}
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={`${
                  selectedCategory === null 
                    ? "bg-deta-green text-white" 
                    : "border-deta-green text-deta-green hover:bg-deta-green hover:text-white"
                }`}
              >
                {isRTL ? 'جميع الفئات' : 'All Categories'}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`${
                    selectedCategory === category.id 
                      ? "bg-deta-green text-white" 
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{isRTL ? 'لا توجد منتجات' : 'No products found'}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="border-none shadow-lg hover-scale overflow-hidden">
                  <CardContent className="p-0">
                    <Link to={`/products/${product.id}`}>
                      <div className="h-48 bg-gradient-to-br from-deta-green-light to-deta-green">
                        {product.image_url && (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        {product.categories && (
                          <Badge className="bg-deta-gold text-white">
                            {product.categories.name}
                          </Badge>
                        )}
                        {product.is_new && (
                          <Badge className="bg-green-500 text-white">
                            {isRTL ? 'جديد' : 'New'}
                          </Badge>
                        )}
                      </div>
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-lg font-bold text-deta-green mb-3 arabic-heading hover:underline">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        {product.price && (
                          <span className="text-lg font-bold text-deta-green">
                            ${product.price}
                          </span>
                        )}
                        <Link to={`/products/${product.id}`}>
                          <Button size="sm" className="bg-deta-green hover:bg-deta-green/90">
                            {isRTL ? 'عرض التفاصيل' : 'View Details'}
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-none shadow-lg bg-gradient-to-r from-deta-green to-deta-green-light">
            <CardContent className="p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4 arabic-heading">
                {isRTL ? 'مهتم بمنتجاتنا؟' : 'Interested in our products?'}
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {isRTL ? 'تواصل معنا للحصول على عرض أسعار مخصص' : 'Contact us for a custom quote'}
              </p>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white text-deta-green border-white hover:bg-gray-100">
                  {isRTL ? 'تواصل معنا' : 'Contact Us'}
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
