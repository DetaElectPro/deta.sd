import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, Package, Code, Users, Award, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import AnimatedCounter from "@/components/AnimatedCounter";

const Index = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: <Leaf className="h-7 w-7 text-white sm:h-8 sm:w-8" />,
      title: t('services.agriculture'),
      description: t('services.agriculture_desc'),
      link: "/services"
    },
    {
      icon: <Package className="h-7 w-7 text-white sm:h-8 sm:w-8" />,
      title: t('services.food_manufacturing'),
      description: t('services.food_manufacturing_desc'),
      link: "/services"
    },
    {
      icon: <Code className="h-7 w-7 text-white sm:h-8 sm:w-8" />,
      title: t('services.software_development'),
      description: t('services.software_development_desc'),
      link: "/services"
    }
  ];

  const stats = [
    { number: 15, suffix: "+", label: t('stats.years_experience') },
    { number: 200, suffix: "+", label: t('stats.employees') },
    { number: 50, suffix: "+", label: t('stats.projects') },
    { number: 10, suffix: "+", label: t('stats.subsidiaries') }
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      <SEO
        title="Deta Group - مجموعة ديتا | الصفحة الرئيسية"
        description="مجموعة ديتا - الشركة الرائدة في السودان للزراعة الحديثة، تصنيع الأغذية عالية الجودة، وتطوير حلول البرمجيات المبتكرة. أكثر من 15 عام من الخبرة و200+ موظف متخصص."
        keywords="ديتا, مجموعة ديتا, الزراعة السودان, تصنيع الأغذية, البرمجيات السودان, الخرطوم, شركة رائدة, زراعة حديثة, أغذية عضوية, تطوير برمجيات"
        url="https://deta.sd/"
        type="website"
      />
      <Header />

      {/* Hero Section with Animated Background */}
      <section className="relative flex min-h-[92svh] items-center overflow-hidden py-16 sm:py-20">
        <AnimatedBackground />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="text-white animate-fade-in">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-deta-gold-light ring-1 ring-white/20 backdrop-blur sm:text-sm" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-deta-gold" />
                <span className="h-px w-6 bg-deta-gold/60" />
              </div>
              <h1 className="mb-5 text-3xl font-extrabold leading-tight arabic-heading sm:text-5xl lg:text-6xl">
                {t('hero.welcome')}
                <span className="mt-2 block text-deta-gold">{t('site.company_name')}</span>
              </h1>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-white/85 sm:text-xl">
                {t('hero.description')}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button asChild size="lg" className="rounded-full bg-deta-gold px-7 font-bold text-palm-950 shadow-lift hover:bg-deta-gold-light">
                  <Link to="/about">{t('hero.learn_more')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-deta-green">
                  <Link to="/contact">{t('hero.contact_us')}</Link>
                </Button>
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="absolute -top-6 -end-6 h-28 w-28 rounded-full bg-deta-gold/25 blur-2xl" aria-hidden="true" />
              <div className="relative flex min-h-72 w-full items-center justify-center rounded-4xl border border-white/20 bg-white/10 p-8 shadow-lift backdrop-blur-md sm:min-h-96">
                <div className="text-center text-white">
                  <span className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-deta-gold/20 ring-1 ring-deta-gold/40 sm:h-24 sm:w-24">
                    <Globe className="h-10 w-10 text-deta-gold sm:h-12 sm:w-12" />
                  </span>
                  <h3 className="mb-2 text-xl font-bold sm:text-2xl">{t('hero.vision_title')}</h3>
                  <p className="text-base text-white/85 sm:text-lg">{t('hero.vision_subtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-sand-50 py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <p className="mb-3 inline-block rounded-full bg-deta-green/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-deta-green sm:text-sm" aria-hidden="true">
              <span className="h-px w-6 bg-deta-green/40" />
            </p>
            <h2 className="mb-4 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl lg:text-4xl">{t('sections.our_services')}</h2>
            <p className="text-base text-stone-500 sm:text-xl">
              {t('sections.services_description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group overflow-hidden rounded-3xl border border-deta-green/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="h-1.5 bg-gradient-to-b from-deta-gold to-deta-gold-light" aria-hidden="true" />
                <CardContent className="p-6 text-center sm:p-8">
                  <div className="mb-6 flex justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-deta-green to-palm-800 shadow-soft transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
                      {service.icon}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-deta-green arabic-heading sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-stone-500 sm:text-base">
                    {service.description}
                  </p>
                  <Button asChild variant="outline" className="rounded-full border-deta-green/30 text-deta-green hover:bg-deta-green hover:text-white">
                    <Link to={service.link}>
                      {t('buttons.read_more')}
                      <ArrowLeft className="h-4 w-4 ms-2 rtl:rotate-180" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-deta-gold/20 bg-palm-950 py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <h2 className="mb-3 text-2xl font-extrabold text-white arabic-heading sm:text-3xl lg:text-4xl">{t('sections.achievements')}</h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
            <p className="text-base text-white/70 sm:text-xl">{t('sections.achievements_description')}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-3xl bg-white/5 p-6 text-center ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-white/10 sm:p-8">
                <AnimatedCounter
                  end={stat.number}
                  suffix={stat.suffix}
                  duration={2500 + (index * 200)}
                  className="mb-2 block text-3xl font-extrabold text-deta-gold arabic-heading sm:text-4xl lg:text-5xl"
                />
                <div className="text-sm text-white/75 sm:text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="bg-white py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="mb-5 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl lg:text-4xl">{t('sections.who_we_are')}</h2>
              <p className="mb-6 text-base leading-relaxed text-stone-500 sm:text-lg">
                {t('sections.about_description')}
              </p>
              <div className="mb-8 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-sand-50 p-3 ring-1 ring-deta-green/10">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-deta-green/10">
                    <Award className="h-5 w-5 text-deta-green" />
                  </span>
                  <span className="text-sm font-medium text-stone-700 sm:text-base">{t('features.certified')}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-sand-50 p-3 ring-1 ring-deta-green/10">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-deta-green/10">
                    <Users className="h-5 w-5 text-deta-green" />
                  </span>
                  <span className="text-sm font-medium text-stone-700 sm:text-base">{t('features.expert_team')}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-sand-50 p-3 ring-1 ring-deta-green/10">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-deta-green/10">
                    <Globe className="h-5 w-5 text-deta-green" />
                  </span>
                  <span className="text-sm font-medium text-stone-700 sm:text-base">{t('features.strong_presence')}</span>
                </div>
              </div>
              <Button asChild size="lg" className="rounded-full bg-deta-green px-7 hover:bg-palm-800">
                <Link to="/about">
                  {t('buttons.learn_our_story')}
                  <ArrowLeft className="h-4 w-4 ms-2 rtl:rotate-180" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-44 rounded-3xl bg-gradient-to-br from-deta-green to-palm-800 shadow-soft sm:h-48"></div>
                <div className="h-28 rounded-3xl bg-gradient-to-br from-deta-gold to-deta-gold-light shadow-soft sm:h-32"></div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="h-28 rounded-3xl bg-gradient-to-br from-deta-brown to-deta-brown-light shadow-soft sm:h-32"></div>
                <div className="h-44 rounded-3xl bg-gradient-to-br from-deta-green-light to-deta-green shadow-soft sm:h-48"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-sand-100 py-14 sm:py-20">
        <div className="absolute -top-20 start-1/4 h-56 w-56 rounded-full bg-deta-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 end-1/4 h-56 w-56 rounded-full bg-deta-green/15 blur-3xl" aria-hidden="true" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mx-auto mb-5 max-w-2xl text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl lg:text-4xl">
            {t('cta.ready_to_start')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-stone-500 sm:text-xl">
            {t('cta.description')}
          </p>
          <Button asChild size="lg" className="rounded-full bg-deta-green px-8 shadow-lift hover:bg-palm-800">
            <Link to="/contact">
              {t('cta.start_project')}
              <ArrowLeft className="h-4 w-4 ms-2 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
