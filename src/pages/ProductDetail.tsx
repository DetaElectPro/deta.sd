
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMultilingualProducts } from '@/hooks/useMultilingualProducts';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const { data: products = [], isLoading } = useMultilingualProducts();
  
  const product = products.find(p => p.id === id);
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

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

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              {isRTL ? 'المنتج غير موجود' : 'Product Not Found'}
            </h2>
            <Link to="/products">
              <Button className="bg-deta-green hover:bg-deta-green/90">
                {isRTL ? 'العودة للمنتجات' : 'Back to Products'}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-deta-green">
              {isRTL ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-deta-green">
              {isRTL ? 'المنتجات' : 'Products'}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link to="/products">
            <Button variant="outline" className="mb-4">
              <ArrowIcon className="h-4 w-4 mr-2" />
              {isRTL ? 'العودة للمنتجات' : 'Back to Products'}
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-deta-green-light to-deta-green">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-lg">
                    {isRTL ? 'لا توجد صورة' : 'No Image'}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
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
                {product.is_featured && (
                  <Badge className="bg-blue-500 text-white">
                    {isRTL ? 'مميز' : 'Featured'}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-deta-green mb-4 arabic-heading">
                {product.name}
              </h1>
              
              {product.price && (
                <div className="text-2xl font-bold text-deta-green mb-4">
                  ${product.price}
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {isRTL ? 'الوصف' : 'Description'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                {isRTL ? 'المواصفات' : 'Specifications'}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isRTL ? 'متوفر' : 'Available'}:
                  </span>
                  <span className="font-medium text-green-600">
                    {isRTL ? 'نعم' : 'Yes'}
                  </span>
                </div>
                {product.categories && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {isRTL ? 'الفئة' : 'Category'}:
                    </span>
                    <span className="font-medium">
                      {product.categories.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Button */}
            <div className="border-t pt-6">
              <Link to={`/order?product=${product.id}`}>
                <Button 
                  size="lg" 
                  className="w-full bg-deta-green hover:bg-deta-green/90 text-lg py-3"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isRTL ? 'اطلب الآن' : 'Order Now'}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center arabic-heading">
            {isRTL ? 'منتجات ذات صلة' : 'Related Products'}
          </h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.id !== product.id && p.category_id === product.category_id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Card key={relatedProduct.id} className="border-none shadow-lg hover-scale overflow-hidden">
                  <CardContent className="p-0">
                    <Link to={`/products/${relatedProduct.id}`}>
                      <div className="h-32 bg-gradient-to-br from-deta-green-light to-deta-green">
                        {relatedProduct.image_url && (
                          <img 
                            src={relatedProduct.image_url} 
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-deta-green mb-2 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        {relatedProduct.price && (
                          <span className="text-sm font-bold text-deta-green">
                            ${relatedProduct.price}
                          </span>
                        )}
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
