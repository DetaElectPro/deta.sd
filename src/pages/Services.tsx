import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { usePageTracking } from "@/hooks/usePageTracking";
import SEO from "@/components/SEO";
import { Wheat, Factory, Code, Users, ShieldCheck, Lightbulb, TrendingUp, PackageCheck } from 'lucide-react';

const Services = () => {
  usePageTracking();
  const { t } = useLanguage();

  const mainServices = [
    {
      title: t('services.agriculture'),
      description: t('services.agriculture_description'),
      icon: Wheat,
      features: [
        t('services.agriculture_feature1'),
        t('services.agriculture_feature2'),
        t('services.agriculture_feature3'),
      ],
    },
    {
      title: t('services.food_manufacturing'),
      description: t('services.food_manufacturing_description'),
      icon: Factory,
      features: [
        t('services.food_manufacturing_feature1'),
        t('services.food_manufacturing_feature2'),
        t('services.food_manufacturing_feature3'),
      ],
    },
    {
      title: t('services.software_development'),
      description: t('services.software_development_description'),
      icon: Code,
      features: [
        t('services.software_development_feature1'),
        t('services.software_development_feature2'),
        t('services.software_development_feature3'),
      ],
    },
    {
      title: t('services.consulting'),
      description: t('services.consulting_description'),
      icon: Users,
      features: [
        t('services.consulting_feature1'),
        t('services.consulting_feature2'),
        t('services.consulting_feature3'),
      ],
    },
  ];

  const whyChooseUs = [
    {
      title: t('services.quality_assurance'),
      description: t('services.quality_assurance_description'),
      icon: ShieldCheck,
    },
    {
      title: t('services.expert_team'),
      description: t('services.expert_team_description'),
      icon: Users,
    },
    {
      title: t('services.innovative_solutions'),
      description: t('services.innovative_solutions_description'),
      icon: Lightbulb,
    },
    {
      title: t('services.proven_track_record'),
      description: t('services.proven_track_record_description'),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      <SEO
        title="Deta Group - مجموعة ديتا | خدماتنا"
        description="خدمات مجموعة ديتا: زراعة حديثة وتصنيع أغذية وتطوير برمجيات واستشارات لدعم نمو أعمالك."
        keywords="خدمات ديتا, زراعة حديثة, تصنيع أغذية, تطوير برمجيات, استشارات, السودان"
        url="https://deta.sd/services"
        canonical="https://deta.sd/services"
      />
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-palm-950 py-14 sm:py-20">
        <div className="absolute -top-24 end-0 h-72 w-72 rounded-full bg-deta-gold/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 start-0 h-72 w-72 rounded-full bg-deta-green-light/20 blur-3xl" aria-hidden="true" />
        <div className="container relative mx-auto px-4 text-center text-white">
          <span className="mb-4 inline-flex items-center justify-center rounded-2xl bg-white/10 p-3 ring-1 ring-white/15" aria-hidden="true">
            <PackageCheck className="h-6 w-6 text-deta-gold" />
          </span>
          <h1 className="mx-auto mb-5 max-w-3xl text-3xl font-extrabold leading-tight arabic-heading sm:text-4xl lg:text-5xl">
            {t('services.title')}
          </h1>
          <div className="mx-auto mb-5 h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/80 sm:text-xl">
            {t('services.description')}
          </p>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="bg-white py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <h2 className="mb-3 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl">
              {t('services.main_services')}
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 lg:gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="group overflow-hidden rounded-3xl border border-deta-green/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="h-1.5 bg-gradient-to-b from-deta-green to-deta-green-light" aria-hidden="true" />
                <CardContent className="p-6">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-deta-green to-palm-800 shadow-soft transition-transform duration-300 group-hover:scale-105">
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2.5 text-lg font-bold text-deta-green arabic-heading sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-stone-500">
                    {service.description}
                  </p>
                  <ul className="space-y-2.5 border-t border-sand-200 pt-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-stone-600 sm:text-sm">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-deta-gold" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-sand-100 py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <h2 className="mb-3 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl">
              {t('services.why_choose_us')}
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="rounded-3xl border border-deta-green/10 bg-white text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-deta-gold to-deta-gold-light shadow-soft">
                    <item.icon className="h-6 w-6 text-palm-950" />
                  </div>
                  <h3 className="mb-2.5 text-base font-bold text-deta-green arabic-heading sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-stone-500 sm:text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden rounded-4xl border-none bg-gradient-to-br from-deta-green via-palm-800 to-palm-950 shadow-lift">
            <div className="absolute -top-16 end-10 h-48 w-48 rounded-full bg-deta-gold/20 blur-3xl" aria-hidden="true" />
            <CardContent className="relative p-8 text-center text-white sm:p-12">
              <h2 className="mx-auto mb-4 max-w-2xl text-2xl font-extrabold arabic-heading sm:text-3xl">
                {t('services.ready_to_start')}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-base text-white/80 sm:text-lg">
                {t('services.contact_us_today')}
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                <Button size="lg" variant="outline" className="rounded-full border-white bg-white font-bold text-deta-green hover:bg-sand-100">
                  {t('buttons.contact_us')}
                </Button>
                <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white hover:text-deta-green">
                  {t('buttons.view_portfolio')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
