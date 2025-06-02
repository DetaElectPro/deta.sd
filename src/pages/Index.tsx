
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, Package, Code, Users, Award, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect, useState } from "react";

const Index = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: <Leaf className="w-12 h-12 text-deta-gold" />,
      title: t('services.agriculture'),
      description: t('services.agriculture_desc'),
      link: "/services"
    },
    {
      icon: <Package className="w-12 h-12 text-deta-gold" />,
      title: t('services.food_manufacturing'),
      description: t('services.food_manufacturing_desc'),
      link: "/services"
    },
    {
      icon: <Code className="w-12 h-12 text-deta-gold" />,
      title: t('services.software_development'),
      description: t('services.software_development_desc'),
      link: "/services"
    }
  ];

  const stats = [
    { number: "15+", label: t('stats.years_experience') },
    { number: "200+", label: t('stats.employees') },
    { number: "50+", label: t('stats.projects') },
    { number: "10+", label: t('stats.subsidiaries') }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Parallax Effect */}
      <section className="relative bg-deta-gradient min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-black/20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        ></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 left-10 w-20 h-20 bg-deta-gold/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: '0s', transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div 
            className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: '1s', transform: `translateY(${scrollY * 0.2}px)` }}
          ></div>
          <div 
            className="absolute bottom-20 left-1/4 w-16 h-16 bg-deta-gold/30 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: '2s', transform: `translateY(${scrollY * 0.4}px)` }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 arabic-heading leading-tight">
                {t('hero.welcome')}
                <span className="block text-deta-gold">{t('site.company_name')}</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed opacity-90">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-deta-gold hover:bg-deta-gold-light text-deta-green font-semibold">
                  <Link to="/about">{t('hero.learn_more')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-deta-green">
                  <Link to="/contact">{t('hero.contact_us')}</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-deta-gold/20 to-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <Globe className="w-24 h-24 mx-auto mb-4 text-deta-gold" />
                  <h3 className="text-2xl font-bold mb-2">{t('hero.vision_title')}</h3>
                  <p className="text-lg opacity-90">{t('hero.vision_subtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-deta-green via-transparent to-deta-gold"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">{t('sections.our_services')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('sections.services_description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow duration-300 border-none shadow-lg"
              >
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
                      {t('buttons.read_more')}
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
      <section className="py-20 bg-deta-green relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-deta-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 arabic-heading">{t('sections.achievements')}</h2>
            <p className="text-xl text-gray-300">{t('sections.achievements_description')}</p>
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
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-deta-green mb-6 arabic-heading">{t('sections.who_we_are')}</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('sections.about_description')}
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-deta-gold" />
                  <span className="text-gray-700">{t('features.certified')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-deta-gold" />
                  <span className="text-gray-700">{t('features.expert_team')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-deta-gold" />
                  <span className="text-gray-700">{t('features.strong_presence')}</span>
                </div>
              </div>
              <Button asChild size="lg" className="bg-deta-green hover:bg-deta-green/90">
                <Link to="/about">
                  {t('buttons.learn_our_story')}
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div 
                  className="h-48 bg-gradient-to-br from-deta-green to-deta-green-light rounded-lg"
                  style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                ></div>
                <div 
                  className="h-32 bg-gradient-to-br from-deta-gold to-deta-gold-light rounded-lg"
                  style={{ transform: `translateY(${scrollY * 0.15}px)` }}
                ></div>
              </div>
              <div className="space-y-4 mt-8">
                <div 
                  className="h-32 bg-gradient-to-br from-deta-brown to-deta-brown-light rounded-lg"
                  style={{ transform: `translateY(${scrollY * 0.12}px)` }}
                ></div>
                <div 
                  className="h-48 bg-gradient-to-br from-deta-green-light to-deta-green rounded-lg"
                  style={{ transform: `translateY(${scrollY * 0.08}px)` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-deta-light-gradient relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-deta-green mb-6 arabic-heading">
            {t('cta.ready_to_start')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <Button asChild size="lg" className="bg-deta-green hover:bg-deta-green/90">
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

export default Index;
