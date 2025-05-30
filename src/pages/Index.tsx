
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, Package, Code, Users, Award, Globe } from "lucide-react";

const Index = () => {
  const services = [
    {
      icon: <Leaf className="w-12 h-12 text-deta-gold" />,
      title: "الزراعة المستدامة",
      description: "إنتاج زراعي عالي الجودة باستخدام أحدث التقنيات والممارسات المستدامة",
      link: "/services"
    },
    {
      icon: <Package className="w-12 h-12 text-deta-gold" />,
      title: "تصنيع الأغذية",
      description: "معالجة وتصنيع المنتجات الغذائية بأعلى معايير الجودة والسلامة",
      link: "/services"
    },
    {
      icon: <Code className="w-12 h-12 text-deta-gold" />,
      title: "تطوير البرمجيات",
      description: "حلول تقنية متطورة ومنصات رقمية لتطوير الأعمال والقطاعات المختلفة",
      link: "/services"
    }
  ];

  const stats = [
    { number: "15+", label: "سنة من الخبرة" },
    { number: "200+", label: "موظف متخصص" },
    { number: "50+", label: "مشروع ناجح" },
    { number: "10+", label: "شركة فرعية" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-deta-gradient min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 arabic-heading leading-tight">
                مرحباً بكم في
                <span className="block text-deta-gold">مجموعة ديتا</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed opacity-90">
                رائدة في مجالات الزراعة وتصنيع الأغذية وتطوير البرمجيات في السودان، نسعى لتحقيق التميز والابتكار في كل ما نقدمه.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-deta-gold hover:bg-deta-gold-light text-deta-green font-semibold">
                  <Link to="/about">تعرف علينا أكثر</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-deta-green">
                  <Link to="/contact">تواصل معنا</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="w-full h-96 bg-gradient-to-br from-deta-gold/20 to-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <Globe className="w-24 h-24 mx-auto mb-4 text-deta-gold" />
                  <h3 className="text-2xl font-bold mb-2">رؤيتنا للمستقبل</h3>
                  <p className="text-lg opacity-90">بناء مستقبل مستدام ومزدهر</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">مجالات عملنا</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نقدم خدمات متنوعة ومتكاملة في ثلاث مجالات رئيسية تخدم احتياجات السوق المحلي والإقليمي
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover-scale border-none shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-deta-green mb-4 arabic-heading">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Button asChild variant="outline" className="border-deta-green text-deta-green hover:bg-deta-green hover:text-white">
                    <Link to={service.link}>
                      اقرأ المزيد
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-deta-green">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 arabic-heading">إنجازاتنا بالأرقام</h2>
            <p className="text-xl text-gray-300">نفتخر بما حققناه على مدار السنوات الماضية</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-deta-gold mb-2 arabic-heading">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-deta-green mb-6 arabic-heading">من نحن</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                مجموعة ديتا هي شركة رائدة في السودان تعمل في مجالات متعددة تشمل الزراعة وتصنيع الأغذية وتطوير البرمجيات. 
                نحن نؤمن بالتطوير المستدام والابتكار لتقديم أفضل الحلول لعملائنا.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-deta-gold" />
                  <span className="text-gray-700">معتمدون من أفضل المؤسسات العالمية</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-deta-gold" />
                  <span className="text-gray-700">فريق عمل متخصص وذو خبرة عالية</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-deta-gold" />
                  <span className="text-gray-700">حضور محلي وإقليمي قوي</span>
                </div>
              </div>
              <Button asChild size="lg" className="bg-deta-green hover:bg-deta-green/90">
                <Link to="/about">
                  تعرف على قصتنا
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Link>
              </Button>
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

      {/* CTA Section */}
      <section className="py-20 bg-deta-light-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-deta-green mb-6 arabic-heading">
            جاهزون لبدء مشروعكم القادم؟
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            تواصلوا معنا اليوم لمناقشة كيف يمكننا مساعدتكم في تحقيق أهدافكم وتطوير أعمالكم
          </p>
          <Button asChild size="lg" className="bg-deta-green hover:bg-deta-green/90">
            <Link to="/contact">
              ابدأ مشروعك معنا
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
