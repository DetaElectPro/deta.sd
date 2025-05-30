
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SecureContactForm from "@/components/SecureContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-deta-gold" />,
      title: "هاتف",
      details: ["+249 123 456 789", "+249 987 654 321"],
      description: "متاحون للرد على استفساراتكم"
    },
    {
      icon: <Mail className="w-6 h-6 text-deta-gold" />,
      title: "البريد الإلكتروني",
      details: ["info@detagroup.sd", "sales@detagroup.sd"],
      description: "راسلونا وسنرد عليكم في أقرب وقت"
    },
    {
      icon: <MapPin className="w-6 h-6 text-deta-gold" />,
      title: "العنوان",
      details: ["شارع النيل، الخرطوم", "جمهورية السودان"],
      description: "مرحبون بزيارتكم في أي وقت"
    },
    {
      icon: <Clock className="w-6 h-6 text-deta-gold" />,
      title: "ساعات العمل",
      details: ["السبت - الخميس: 8:00 ص - 6:00 م", "الجمعة: مغلق"],
      description: "نحن هنا لخدمتكم في هذه الأوقات"
    }
  ];

  const offices = [
    {
      name: "المكتب الرئيسي",
      address: "الخرطوم، السودان",
      phone: "+249 123 456 789",
      email: "info@detagroup.sd"
    },
    {
      name: "فرع بورتسودان",
      address: "بورتسودان، البحر الأحمر",
      phone: "+249 123 456 790",
      email: "portsudan@detagroup.sd"
    },
    {
      name: "فرع نيالا",
      address: "نيالا، جنوب دارفور",
      phone: "+249 123 456 791",
      email: "nyala@detagroup.sd"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-deta-gradient py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">تواصل معنا</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في تحقيق أهدافكم
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">معلومات التواصل</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              يمكنكم التواصل معنا عبر الطرق التالية
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover-scale">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-bold text-deta-green mb-3 arabic-heading">
                    {info.title}
                  </h3>
                  <div className="space-y-1 mb-3">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 font-medium">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Secure Form */}
            <SecureContactForm />

            {/* Map and Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <Card className="border-none shadow-lg">
                <CardContent className="p-0">
                  <div className="h-64 bg-gradient-to-br from-deta-green to-deta-green-light rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <MapPin className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-xl font-bold">موقعنا على الخريطة</h3>
                      <p>الخرطوم، السودان</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Offices */}
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-deta-green mb-6 arabic-heading">
                    فروعنا
                  </h3>
                  <div className="space-y-6">
                    {offices.map((office, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <h4 className="font-semibold text-deta-green mb-2">{office.name}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {office.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {office.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {office.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">أسئلة شائعة</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "ما هي مجالات عمل مجموعة ديتا؟",
                answer: "نعمل في ثلاث مجالات رئيسية: الزراعة المستدامة، تصنيع الأغذية، وتطوير البرمجيات."
              },
              {
                question: "هل تقدمون خدمات الاستشارات الزراعية؟",
                answer: "نعم، نقدم خدمات استشارية متخصصة في جميع مجالات الزراعة والإنتاج الزراعي."
              },
              {
                question: "كيف يمكنني الحصول على منتجاتكم؟",
                answer: "يمكنكم التواصل معنا مباشرة أو زيارة أحد فروعنا للحصول على منتجاتنا."
              },
              {
                question: "هل تقدمون خدمات التصدير؟",
                answer: "نعم، نصدر منتجاتنا إلى العديد من البلدان في المنطقة والعالم."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-deta-green mb-3 arabic-heading">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
