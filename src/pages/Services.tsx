
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Leaf, Package, Code, Sprout, Shield, Zap, Database, Globe, ArrowLeft } from "lucide-react";

const Services = () => {
  const mainServices = [
    {
      icon: <Leaf className="w-16 h-16 text-deta-gold" />,
      title: "الزراعة المستدامة",
      description: "نقدم حلولاً زراعية متطورة ومستدامة تشمل الإنتاج النباتي والحيواني باستخدام أحدث التقنيات الزراعية والممارسات البيئية المسؤولة.",
      features: [
        "إنتاج المحاصيل الاستراتيجية",
        "الزراعة العضوية المعتمدة",
        "أنظمة الري الذكية",
        "مكافحة الآفات البيولوجية",
        "استشارات زراعية متخصصة"
      ],
      image: "agriculture"
    },
    {
      icon: <Package className="w-16 h-16 text-deta-gold" />,
      title: "تصنيع الأغذية",
      description: "نتخصص في معالجة وتصنيع المنتجات الغذائية بأعلى معايير الجودة والسلامة، من المواد الخام إلى المنتج النهائي الجاهز للاستهلاك.",
      features: [
        "معالجة الحبوب والبقوليات",
        "تصنيع المنتجات الغذائية",
        "التعبئة والتغليف المتطور",
        "ضمان الجودة والسلامة",
        "التوزيع والخدمات اللوجستية"
      ],
      image: "food"
    },
    {
      icon: <Code className="w-16 h-16 text-deta-gold" />,
      title: "تطوير البرمجيات",
      description: "نطور حلولاً برمجية مبتكرة ومنصات رقمية متطورة تخدم احتياجات الأعمال المختلفة وتساهم في التحول الرقمي.",
      features: [
        "تطوير المواقع والتطبيقات",
        "أنظمة إدارة المؤسسات",
        "حلول الزراعة الذكية",
        "منصات التجارة الإلكترونية",
        "استشارات تقنية متخصصة"
      ],
      image: "software"
    }
  ];

  const additionalServices = [
    {
      icon: <Sprout className="w-8 h-8 text-deta-green" />,
      title: "الاستشارات الزراعية",
      description: "خدمات استشارية متخصصة في جميع مجالات الزراعة"
    },
    {
      icon: <Shield className="w-8 h-8 text-deta-green" />,
      title: "ضمان الجودة",
      description: "أنظمة متطورة لضمان جودة المنتجات والخدمات"
    },
    {
      icon: <Zap className="w-8 h-8 text-deta-green" />,
      title: "الطاقة المتجددة",
      description: "حلول الطاقة الشمسية والمتجددة للمشاريع الزراعية"
    },
    {
      icon: <Database className="w-8 h-8 text-deta-green" />,
      title: "إدارة البيانات",
      description: "أنظمة متطورة لجمع وتحليل البيانات الزراعية"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-deta-gradient py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">خدماتنا</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة شاملة من الخدمات المتخصصة في الزراعة وتصنيع الأغذية وتطوير البرمجيات
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {mainServices.map((service, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    {service.icon}
                    <h2 className="text-4xl font-bold text-deta-green arabic-heading">{service.title}</h2>
                  </div>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-deta-gold rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="bg-deta-green hover:bg-deta-green/90">
                    <Link to="/contact">
                      احصل على استشارة
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="h-96 bg-gradient-to-br from-deta-green to-deta-green-light rounded-2xl shadow-lg flex items-center justify-center">
                    <Globe className="w-32 h-32 text-white/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">خدمات إضافية</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              مجموعة من الخدمات المساندة التي تكمل عروضنا الرئيسية
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="border-none shadow-lg hover-scale">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-deta-green mb-3 arabic-heading">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">كيف نعمل</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نتبع منهجية علمية ومدروسة في تقديم خدماتنا
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "الاستشارة", description: "نبدأ بفهم احتياجاتكم ومتطلباتكم" },
              { step: "2", title: "التخطيط", description: "نضع خطة مفصلة ومدروسة للمشروع" },
              { step: "3", title: "التنفيذ", description: "ننفذ المشروع بأعلى معايير الجودة" },
              { step: "4", title: "المتابعة", description: "نقدم الدعم والمتابعة المستمرة" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-deta-green rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 arabic-heading">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-deta-green mb-2 arabic-heading">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-deta-gradient">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6 arabic-heading">
            هل تحتاجون لخدماتنا؟
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            تواصلوا معنا اليوم للحصول على استشارة مجانية ومناقشة كيف يمكننا مساعدتكم
          </p>
          <Button asChild size="lg" className="bg-white text-deta-green hover:bg-gray-100">
            <Link to="/contact">
              احصل على استشارة مجانية
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
