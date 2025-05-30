
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wheat, Apple, Coffee, Package } from "lucide-react";

const Products = () => {
  const productCategories = [
    {
      icon: <Wheat className="w-12 h-12 text-deta-gold" />,
      title: "الحبوب والبقوليات",
      description: "منتجات عالية الجودة من الحبوب والبقوليات المزروعة محلياً",
      products: [
        { name: "القمح", quality: "ممتاز", origin: "السودان" },
        { name: "الذرة", quality: "عالي", origin: "السودان" },
        { name: "الدخن", quality: "ممتاز", origin: "السودان" },
        { name: "السمسم", quality: "فاخر", origin: "السودان" },
        { name: "الفول السوداني", quality: "عالي", origin: "السودان" },
        { name: "اللوبيا", quality: "ممتاز", origin: "السودان" }
      ]
    },
    {
      icon: <Apple className="w-12 h-12 text-deta-gold" />,
      title: "الفواكه والخضروات",
      description: "فواكه وخضروات طازجة ومعالجة بأحدث التقنيات",
      products: [
        { name: "التمر", quality: "فاخر", origin: "السودان" },
        { name: "المانجو", quality: "ممتاز", origin: "السودان" },
        { name: "الجوافة", quality: "عالي", origin: "السودان" },
        { name: "البطاطس", quality: "ممتاز", origin: "السودان" },
        { name: "البصل", quality: "عالي", origin: "السودان" },
        { name: "الطماطم", quality: "ممتاز", origin: "السودان" }
      ]
    },
    {
      icon: <Coffee className="w-12 h-12 text-deta-gold" />,
      title: "المشروبات والتوابل",
      description: "مجموعة متنوعة من المشروبات الطبيعية والتوابل العطرية",
      products: [
        { name: "الكركديه", quality: "فاخر", origin: "السودان" },
        { name: "العنب", quality: "ممتاز", origin: "السودان" },
        { name: "الكمون", quality: "عالي", origin: "السودان" },
        { name: "الكزبرة", quality: "ممتاز", origin: "السودان" },
        { name: "الحلبة", quality: "عالي", origin: "السودان" },
        { name: "القرفة", quality: "فاخر", origin: "السودان" }
      ]
    },
    {
      icon: <Package className="w-12 h-12 text-deta-gold" />,
      title: "المنتجات المصنعة",
      description: "منتجات غذائية مصنعة ومعبأة وفق أعلى معايير الجودة",
      products: [
        { name: "دقيق القمح", quality: "ممتاز", origin: "السودان" },
        { name: "زيت السمسم", quality: "فاخر", origin: "السودان" },
        { name: "زبدة الفول السوداني", quality: "عالي", origin: "السودان" },
        { name: "عجينة التمر", quality: "ممتاز", origin: "السودان" },
        { name: "التوابل المطحونة", quality: "عالي", origin: "السودان" },
        { name: "الحبوب المنظفة", quality: "ممتاز", origin: "السودان" }
      ]
    }
  ];

  const certifications = [
    "ISO 22000 - إدارة سلامة الغذاء",
    "HACCP - تحليل المخاطر ونقاط التحكم الحرجة",
    "الشهادة العضوية المعتمدة",
    "شهادة الجودة السودانية",
    "شهادة التصدير الدولية"
  ];

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "فاخر": return "bg-deta-gold text-white";
      case "ممتاز": return "bg-deta-green text-white";
      case "عالي": return "bg-deta-green-light text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-deta-gradient py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">منتجاتنا</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            نفتخر بتقديم مجموعة واسعة من المنتجات الزراعية والغذائية عالية الجودة من السودان إلى العالم
          </p>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">فئات المنتجات</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نقدم منتجات متنوعة تلبي احتياجات السوق المحلي والدولي
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
                              <p className="text-sm text-gray-600">المنشأ: {product.origin}</p>
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
              <h2 className="text-4xl font-bold text-deta-green mb-6 arabic-heading">معايير الجودة</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                نحن ملتزمون بأعلى معايير الجودة والسلامة في جميع منتجاتنا. 
                نحصل على أفضل الشهادات العالمية والمحلية لضمان جودة منتجاتنا.
              </p>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-deta-green arabic-heading">شهاداتنا</h3>
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
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">أسواق التصدير</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نصدر منتجاتنا إلى العديد من البلدان في المنطقة والعالم
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "دول الخليج العربي",
              "شمال أفريقيا",
              "شرق أفريقيا",
              "أوروبا وآسيا"
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
            مهتمون بمنتجاتنا؟
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            تواصلوا معنا للحصول على كتالوج شامل بمنتجاتنا أو لمناقشة احتياجاتكم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-deta-green hover:bg-gray-100">
              تحميل الكتالوج
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-deta-green">
              طلب عرض سعر
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
