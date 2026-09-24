
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SecureContactForm from "@/components/SecureContactForm";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-palm-950" />,
      title: "هاتف",
      details: ["+249 123 456 789", "+249 987 654 321"],
      description: "متاحون للرد على استفساراتكم"
    },
    {
      icon: <Mail className="h-6 w-6 text-palm-950" />,
      title: "البريد الإلكتروني",
      details: ["info@detagroup.sd", "sales@detagroup.sd"],
      description: "راسلونا وسنرد عليكم في أقرب وقت"
    },
    {
      icon: <MapPin className="h-6 w-6 text-palm-950" />,
      title: "العنوان",
      details: ["شارع النيل، الخرطوم", "جمهورية السودان"],
      description: "مرحبون بزيارتكم في أي وقت"
    },
    {
      icon: <Clock className="h-6 w-6 text-palm-950" />,
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
    <div className="min-h-screen bg-sand-50">
      <SEO
        title="Deta Group - مجموعة ديتا | تواصل معنا"
        description="تواصل مع مجموعة ديتا في الخرطوم: هواتف وبريد وعناوين فروعنا، نرد على استفساراتكم بسرعة."
        keywords="تواصل معنا, مجموعة ديتا, الخرطوم, السودان, اتصل بنا, عناوين الفروع"
        url="https://deta.sd/contact"
        canonical="https://deta.sd/contact"
      />
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-palm-950 py-14 sm:py-20">
        <div className="absolute -top-24 end-0 h-72 w-72 rounded-full bg-deta-gold/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 start-0 h-72 w-72 rounded-full bg-deta-green-light/20 blur-3xl" aria-hidden="true" />
        <div className="container relative mx-auto px-4 text-center text-white">
          <span className="mb-4 inline-flex items-center justify-center rounded-2xl bg-white/10 p-3 ring-1 ring-white/15" aria-hidden="true">
            <MessageCircle className="h-6 w-6 text-deta-gold" />
          </span>
          <h1 className="mx-auto mb-5 max-w-3xl text-3xl font-extrabold leading-tight arabic-heading sm:text-4xl lg:text-5xl">تواصل معنا</h1>
          <div className="mx-auto mb-5 h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/80 sm:text-xl">
            نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في تحقيق أهدافكم
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
            <h2 className="mb-3 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl lg:text-4xl">معلومات التواصل</h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
            <p className="text-base text-stone-500 sm:text-xl">
              يمكنكم التواصل معنا عبر الطرق التالية
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="rounded-3xl border border-deta-green/10 bg-white text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-deta-gold to-deta-gold-light shadow-soft">
                      {info.icon}
                    </span>
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-deta-green arabic-heading sm:text-xl">
                    {info.title}
                  </h3>
                  <div className="mb-3 space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm font-semibold text-stone-700 sm:text-base">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-stone-500 sm:text-sm">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-sand-100 py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Secure Form */}
            <SecureContactForm />

            {/* Map and Additional Info */}
            <div className="space-y-6 sm:space-y-8">
              {/* Map Placeholder */}
              <Card className="overflow-hidden rounded-3xl border border-deta-green/10 shadow-soft">
                <CardContent className="p-0">
                  <div className="relative flex h-60 items-center justify-center overflow-hidden bg-gradient-to-br from-deta-green via-palm-800 to-palm-950 sm:h-64">
                    <div className="absolute top-6 start-6 h-16 w-16 rounded-full border-2 border-deta-gold/40" aria-hidden="true" />
                    <div className="absolute bottom-6 end-6 h-24 w-24 rounded-full border-2 border-white/15" aria-hidden="true" />
                    <div className="relative text-center text-white">
                      <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/25">
                        <MapPin className="h-7 w-7 text-deta-gold" />
                      </span>
                      <h3 className="text-lg font-bold sm:text-xl">موقعنا على الخريطة</h3>
                      <p className="text-sm text-white/75">الخرطوم، السودان</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Offices */}
              <Card className="rounded-3xl border border-deta-green/10 bg-white shadow-soft">
                <CardContent className="p-6">
                  <h3 className="mb-1.5 text-xl font-bold text-deta-green arabic-heading sm:text-2xl">
                    فروعنا
                  </h3>
                  <div className="mb-5 h-1 w-12 rounded-full bg-deta-gold" aria-hidden="true" />
                  <div className="space-y-5">
                    {offices.map((office, index) => (
                      <div key={index} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-deta-green/10">
                        <h4 className="mb-2.5 font-bold text-deta-green">{office.name}</h4>
                        <div className="space-y-1.5 text-xs text-stone-500 sm:text-sm">
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 shrink-0 text-deta-gold" />
                            {office.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 shrink-0 text-deta-gold" />
                            <span dir="ltr">{office.phone}</span>
                          </p>
                          <p className="flex min-w-0 items-center gap-2">
                            <Mail className="h-4 w-4 shrink-0 text-deta-gold" />
                            <span className="truncate" dir="ltr">{office.email}</span>
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
      <section className="bg-white py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
            <h2 className="mb-3 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl lg:text-4xl">أسئلة شائعة</h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
            <p className="text-base text-stone-500 sm:text-xl">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
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
              <Card key={index} className="rounded-3xl border border-deta-green/10 bg-sand-50 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-deta-green text-sm font-extrabold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-bold leading-snug text-deta-green arabic-heading sm:text-lg">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-stone-500">
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
