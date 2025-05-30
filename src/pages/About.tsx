
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, Users, Globe, Lightbulb } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Award className="w-8 h-8 text-deta-gold" />,
      title: "الجودة",
      description: "نلتزم بأعلى معايير الجودة في جميع منتجاتنا وخدماتنا"
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-deta-gold" />,
      title: "الابتكار",
      description: "نسعى دائماً للتطوير والابتكار في حلولنا وخدماتنا"
    },
    {
      icon: <Users className="w-8 h-8 text-deta-gold" />,
      title: "العمل الجماعي",
      description: "نؤمن بقوة العمل الجماعي والتعاون لتحقيق النجاح"
    },
    {
      icon: <Globe className="w-8 h-8 text-deta-gold" />,
      title: "الاستدامة",
      description: "نحرص على تطبيق مبادئ التنمية المستدامة في جميع أنشطتنا"
    }
  ];

  const timeline = [
    { year: "2008", event: "تأسيس مجموعة ديتا" },
    { year: "2012", event: "بدء أنشطة الزراعة المستدامة" },
    { year: "2015", event: "إطلاق قسم تصنيع الأغذية" },
    { year: "2018", event: "دخول مجال تطوير البرمجيات" },
    { year: "2020", event: "توسع الأنشطة إقليمياً" },
    { year: "2024", event: "إطلاق مبادرات الاستدامة الجديدة" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-deta-gradient py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">من نحن</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            مجموعة ديتا - رحلة من الرؤية إلى الواقع، نبني مستقبلاً مستداماً ومزدهراً للجميع
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-deta-green mb-6 arabic-heading">قصتنا</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  بدأت رحلة مجموعة ديتا في عام 2008 برؤية واضحة: أن نكون الرائدين في تقديم حلول متكاملة 
                  ومستدامة في مجالات الزراعة وتصنيع الأغذية وتطوير البرمجيات في السودان.
                </p>
                <p>
                  منذ التأسيس، حرصنا على بناء شركة تجمع بين الخبرة التقليدية والتقنيات الحديثة، 
                  مما مكننا من تحقيق نمو مستدام وتقديم قيمة حقيقية لعملائنا وشركائنا.
                </p>
                <p>
                  اليوم، نفتخر بكوننا مجموعة متنوعة تضم أكثر من 10 شركات فرعية متخصصة، 
                  ونخدم عملاء في جميع أنحاء السودان والمنطقة.
                </p>
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

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Target className="w-12 h-12 text-deta-green" />
                  <h3 className="text-3xl font-bold text-deta-green arabic-heading">رسالتنا</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  نسعى لتوفير حلول متكاملة ومبتكرة في مجالات الزراعة وتصنيع الأغذية وتطوير البرمجيات، 
                  مع الالتزام بأعلى معايير الجودة والاستدامة، لخدمة مجتمعنا وتحقيق التنمية الاقتصادية المستدامة.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Eye className="w-12 h-12 text-deta-gold" />
                  <h3 className="text-3xl font-bold text-deta-green arabic-heading">رؤيتنا</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  أن نكون المجموعة الرائدة في المنطقة في تقديم حلول متكاملة ومستدامة، ونساهم في بناء مستقبل 
                  أفضل من خلال الابتكار والتميز في جميع مجالات عملنا.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">قيمنا الأساسية</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              القيم التي توجه عملنا وتحدد طريقة تفاعلنا مع عملائنا وشركائنا ومجتمعنا
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover-scale">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-deta-green mb-3 arabic-heading">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-deta-light-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">رحلتنا عبر السنوات</h2>
            <p className="text-xl text-gray-600">معالم مهمة في تاريخ مجموعة ديتا</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-center gap-8">
                  <div className="w-24 h-24 bg-deta-green rounded-full flex items-center justify-center text-white font-bold text-lg arabic-heading flex-shrink-0">
                    {item.year}
                  </div>
                  <Card className="flex-1 border-none shadow-lg">
                    <CardContent className="p-6">
                      <p className="text-lg text-gray-700">{item.event}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
