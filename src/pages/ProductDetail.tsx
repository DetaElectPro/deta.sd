
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProductById } from '@/hooks/useProductById';
import { useMultilingualProducts } from '@/hooks/useMultilingualProducts';
import { useLanguage } from '@/hooks/useLanguage';
import SEO from '@/components/SEO';
import { ArrowLeft, ArrowRight, ShoppingCart, AlertTriangle, RotateCcw, ShieldCheck, Globe2, PackageCheck } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const { data: product, isLoading, error, refetch } = useProductById(id);
  const { data: allProducts = [] } = useMultilingualProducts();

  const relatedProducts = product
    ? (allProducts ?? [])
        .filter((p) => p.id !== product.id && p.category_id === product.category_id)
        .slice(0, 4)
    : [];

  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

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
          <div className="text-center max-w-md">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertTriangle className="h-7 w-7" />
            </span>
            <p className="text-lg font-semibold text-slate-800 mb-2">{t('common.error')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <Button onClick={() => refetch()} className="bg-deta-green hover:bg-deta-green/90 rounded-full w-full sm:w-auto">
                <RotateCcw className="h-4 w-4" />
                {t('common.retry')}
              </Button>
              <Link to="/products" className="w-full sm:w-auto">
                <Button variant="outline" className="rounded-full w-full">
                  {isRTL ? 'العودة للمنتجات' : 'Back to Products'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px] px-4">
          <div className="text-center">
            <p className="text-2xl font-bold mb-4 text-slate-800">
              {isRTL ? 'المنتج غير موجود' : 'Product Not Found'}
            </p>
            <Link to="/products">
              <Button className="bg-deta-green hover:bg-deta-green/90 rounded-full">
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
    <div className={`min-h-screen bg-slate-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <SEO
        title={product ? `${product.name} | مجموعة ديتا` : 'Deta Group - مجموعة ديتا | تفاصيل المنتج'}
        description={product?.description ? String(product.description).slice(0, 155) : 'تفاصيل منتجات مجموعة ديتا الزراعية والغذائية عالية الجودة المصنوعة في السودان.'}
        keywords="مجموعة ديتا, تفاصيل المنتج, منتجات زراعية, أغذية سودانية"
        url={`https://deta.sd/products/${id}`}
        canonical={`https://deta.sd/products/${id}`}
        type="product"
        image={product?.image_url || 'https://deta.sd/og-image.jpg'}
        jsonLd={product ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: product.image_url || 'https://deta.sd/og-image.jpg',
          description: product.description ? String(product.description).slice(0, 155) : product.name,
          offers: {
            '@type': 'Offer',
            price: (product as { price?: number }).price ?? 0,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        } : undefined}
      />
      <Header />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-5 sm:mb-6">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-deta-green transition-colors">
              {t('nav.home')}
            </Link>
            <span aria-hidden="true">/</span>
            <Link to="/products" className="hover:text-deta-green transition-colors">
              {t('nav.products')}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link to="/products">
            <Button variant="outline" className="rounded-full bg-white">
              <ArrowIcon className="h-4 w-4 me-2" />
              {isRTL ? 'العودة للمنتجات' : 'Back to Products'}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
              <div className="aspect-[4/3] sm:h-96 bg-gradient-to-br from-deta-green-light to-deta-green">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: isRTL ? 'جودة معتمدة' : 'Certified Quality' },
                { icon: Globe2, label: isRTL ? 'تصدير عالمي' : 'Global Export' },
                { icon: PackageCheck, label: isRTL ? 'تغليف آمن' : 'Safe Packaging' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 shadow-sm">
                  <Icon className="h-4 w-4 shrink-0 text-deta-green" />
                  <span className="line-clamp-1">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 rounded-3xl border border-slate-100 bg-white p-5 sm:p-8 shadow-sm h-fit">
            <div>
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
                {product.is_featured && (
                  <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                    {isRTL ? 'مميز' : 'Featured'}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-deta-green mb-4 arabic-heading">
                {product.name}
              </h1>
              
              {product.price && (
                <div className="inline-flex items-baseline gap-2 rounded-2xl bg-deta-green/5 px-4 py-2.5 text-2xl font-bold text-deta-green mb-2">
                  ${product.price}
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-slate-900">
                  {isRTL ? 'الوصف' : 'Description'}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Features */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-slate-900">
                {isRTL ? 'المواصفات' : 'Specifications'}
              </h3>
              <div className="space-y-2 rounded-2xl bg-slate-50 p-4">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500 text-sm">
                    {isRTL ? 'متوفر' : 'Available'}:
                  </span>
                  <span className="font-medium text-emerald-600 text-sm">
                    {isRTL ? 'نعم' : 'Yes'}
                  </span>
                </div>
                {product.categories && (
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 text-sm">
                      {isRTL ? 'الفئة' : 'Category'}:
                    </span>
                    <span className="font-medium text-sm text-slate-800 text-end">
                      {product.categories.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Button */}
            <div className="border-t border-slate-100 pt-6">
              <Link to={`/order?product=${product.id}`}>
                <Button 
                  size="lg" 
                  className="w-full bg-deta-green hover:bg-deta-green/90 text-base sm:text-lg py-3 rounded-full shadow-md"
                >
                  <ShoppingCart className="h-5 w-5 me-2" />
                  {isRTL ? 'اطلب الآن' : 'Order Now'}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-deta-green arabic-heading">
              {isRTL ? 'منتجات ذات صلة' : 'Related Products'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="border border-slate-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden rounded-2xl bg-white">
                  <CardContent className="p-0">
                    <Link to={`/products/${relatedProduct.id}`}>
                      <div className="aspect-[16/9] bg-gradient-to-br from-deta-green-light to-deta-green overflow-hidden">
                        {relatedProduct.image_url && (
                          <img 
                            src={relatedProduct.image_url} 
                            alt={relatedProduct.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-deta-green mb-2 line-clamp-2 text-sm sm:text-base">
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
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
