import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { usePageTracking } from "@/hooks/usePageTracking";
import { Wheat, Factory, Code, Users, ShieldCheck, Lightbulb, TrendingUp } from 'lucide-react';

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
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section - Fixed gradient background */}
      <section className="bg-gradient-to-r from-deta-green to-deta-green-light py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">
            {t('services.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {t('services.description')}
          </p>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-deta-green mb-12 text-center arabic-heading">
            {t('services.main_services')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="border-none shadow-lg hover-scale overflow-hidden">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-deta-green to-deta-green-light rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-deta-green mb-3 arabic-heading">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-deta-gold rounded-full"></div>
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-deta-green mb-12 text-center arabic-heading">
            {t('services.why_choose_us')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="border-none shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-deta-gold to-deta-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-deta-green mb-3 arabic-heading">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-none shadow-lg bg-gradient-to-r from-deta-green to-deta-green-light">
            <CardContent className="p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4 arabic-heading">
                {t('services.ready_to_start')}
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {t('services.contact_us_today')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" className="bg-white text-deta-green border-white hover:bg-gray-100">
                  {t('buttons.contact_us')}
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-deta-green">
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
