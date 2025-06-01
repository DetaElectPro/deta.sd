
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Leaf, 
  Package, 
  Code, 
  Users, 
  Target, 
  Award,
  ArrowLeft,
  CheckCircle 
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: <Leaf className="w-16 h-16 text-deta-gold" />,
      title: t('services.agriculture'),
      description: t('services.agriculture_desc'),
      features: [
        t('services.agriculture_features.modern_farming'),
        t('services.agriculture_features.organic_production'),
        t('services.agriculture_features.irrigation_systems'),
        t('services.agriculture_features.crop_consulting')
      ]
    },
    {
      icon: <Package className="w-16 h-16 text-deta-gold" />,
      title: t('services.food_manufacturing'),
      description: t('services.food_manufacturing_desc'),
      features: [
        t('services.food_features.quality_control'),
        t('services.food_features.packaging'),
        t('services.food_features.distribution'),
        t('services.food_features.certifications')
      ]
    },
    {
      icon: <Code className="w-16 h-16 text-deta-gold" />,
      title: t('services.software_development'),
      description: t('services.software_development_desc'),
      features: [
        t('services.software_features.web_development'),
        t('services.software_features.mobile_apps'),
        t('services.software_features.erp_systems'),
        t('services.software_features.consulting')
      ]
    }
  ];

  const processSteps = [
    {
      icon: <Users className="w-12 h-12 text-deta-gold" />,
      title: t('process.consultation'),
      description: t('process.consultation_desc')
    },
    {
      icon: <Target className="w-12 h-12 text-deta-gold" />,
      title: t('process.planning'),
      description: t('process.planning_desc')
    },
    {
      icon: <Award className="w-12 h-12 text-deta-gold" />,
      title: t('process.execution'),
      description: t('process.execution_desc')
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-deta-gradient py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">{t('site.services')}</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {t('sections.services_description')}
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">
              {t('sections.our_services')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('services.detailed_description')}
            </p>
          </div>
          
          <div className="space-y-20">
            {services.map((service, index) => (
              <Card key={index} className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                    <div className={`p-12 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                      <div className="flex items-center gap-4 mb-6">
                        {service.icon}
                        <h3 className="text-3xl font-bold text-deta-green arabic-heading">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        {service.description}
                      </p>
                      
                      <div className="space-y-4 mb-8">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-deta-gold" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button asChild className="bg-deta-green hover:bg-deta-green/90">
                        <Link to="/contact">
                          {t('buttons.request_service')}
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </Link>
                      </Button>
                    </div>
                    
                    <div className={`bg-deta-light-gradient ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                      <div className="h-full min-h-[400px] bg-gradient-to-br from-deta-green/10 to-deta-gold/10 flex items-center justify-center">
                        <div className="text-center p-8">
                          {service.icon}
                          <h4 className="text-2xl font-bold text-deta-green mt-4 arabic-heading">
                            {service.title}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">
              {t('process.our_process')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('process.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover-scale">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-deta-green rounded-full flex items-center justify-center mx-auto mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-deta-green mb-4 arabic-heading">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
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
            {t('cta.ready_to_start')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <Button asChild size="lg" className="bg-white text-deta-green hover:bg-gray-100">
            <Link to="/contact">
              {t('cta.start_project')}
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
