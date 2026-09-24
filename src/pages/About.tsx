import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target, Sprout, ShieldCheck, Lightbulb } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { usePageTracking } from "@/hooks/usePageTracking";
import SEO from "@/components/SEO";

const About = () => {
  usePageTracking();
  const { t } = useLanguage();

  const stats = [
    { number: "10+", label: t('about.years_experience') },
    { number: "50+", label: t('about.projects_completed') },
    { number: "20+", label: t('about.team_members') },
  ];

  const values = [
    {
      title: t('about.integrity'),
      description: t('about.integrity_desc'),
      icon: ShieldCheck,
    },
    {
      title: t('about.innovation'),
      description: t('about.innovation_desc'),
      icon: Lightbulb,
    },
    {
      title: t('about.quality'),
      description: t('about.quality_desc'),
      icon: Eye,
    },
  ];

  const team = [
    {
      name: "Ahmed Ali",
      position: t('about.ceo'),
      bio: t('about.ceo_bio'),
    },
    {
      name: "Fatima Ahmed",
      position: t('about.cto'),
      bio: t('about.cto_bio'),
    },
    {
      name: "Yousef Mohamed",
      position: t('about.marketing_manager'),
      bio: t('about.marketing_bio'),
    },
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      <SEO
        title="Deta Group - مجموعة ديتا | من نحن"
        description="تعرف على مجموعة ديتا: قصتنا وقيمنا وفريقنا في الزراعة وتصنيع الأغذية والبرمجيات بالسودان."
        keywords="مجموعة ديتا, من نحن, شركة سودانية, الزراعة, تصنيع الأغذية, البرمجيات"
        url="https://deta.sd/about"
        canonical="https://deta.sd/about"
      />
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-palm-950 py-14 sm:py-20">
        <div className="absolute -top-24 end-0 h-72 w-72 rounded-full bg-deta-gold/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 start-0 h-72 w-72 rounded-full bg-deta-green-light/20 blur-3xl" aria-hidden="true" />
        <div className="container relative mx-auto px-4 text-center text-white">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-deta-gold-light ring-1 ring-white/15 sm:text-sm" aria-hidden="true">
            <Sprout className="h-4 w-4" />
          </span>
          <h1 className="mx-auto mb-5 max-w-3xl text-3xl font-extrabold leading-tight arabic-heading sm:text-4xl lg:text-5xl">
            {t('about.title')}
          </h1>
          <div className="mx-auto mb-5 h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/80 sm:text-xl">
            {t('about.description')}
          </p>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="bg-white py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="mb-5 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl">
                {t('about.our_story')}
              </h2>
              <p className="mb-8 text-base leading-relaxed text-stone-500 sm:text-lg">
                {t('about.story_text')}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat, index) => (
                  <div key={index} className="rounded-2xl bg-sand-50 p-5 text-center ring-1 ring-deta-green/10">
                    <div className="text-2xl font-extrabold text-deta-green sm:text-3xl" dir="ltr">{stat.number}</div>
                    <div className="mt-1 text-xs text-stone-500 sm:text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-5 -end-5 h-24 w-24 rounded-3xl bg-deta-gold/25 blur-xl" aria-hidden="true" />
              <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-4xl bg-gradient-to-br from-deta-green via-palm-800 to-palm-950 shadow-lift sm:h-96">
                <div className="absolute inset-0 opacity-20" aria-hidden="true">
                  <div className="absolute top-8 start-8 h-20 w-20 rounded-full border-2 border-deta-gold" />
                  <div className="absolute bottom-10 end-10 h-28 w-28 rounded-full border-2 border-white/60" />
                </div>
                <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/25 backdrop-blur sm:h-24 sm:w-24">
                  <Sprout className="h-10 w-10 text-deta-gold sm:h-12 sm:w-12" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-sand-100 py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <h2 className="mb-3 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl">
              {t('about.our_values')}
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {values.map((value, index) => (
              <Card key={index} className="rounded-3xl border border-deta-green/10 bg-white text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <CardContent className="p-6 sm:p-8">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-deta-gold to-deta-gold-light shadow-soft">
                    <value.icon className="h-8 w-8 text-palm-950" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-deta-green arabic-heading sm:text-xl">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-500 sm:text-base">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <h2 className="mb-3 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl">
              {t('about.our_team')}
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden rounded-3xl border border-deta-green/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <CardContent className="p-0">
                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-deta-green via-palm-800 to-palm-950 sm:h-64">
                    <div className="absolute top-6 start-6 h-16 w-16 rounded-full border-2 border-deta-gold/50" aria-hidden="true" />
                    <div className="absolute bottom-6 end-6 h-24 w-24 rounded-full border-2 border-white/20" aria-hidden="true" />
                    <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-deta-gold text-2xl font-extrabold text-palm-950 shadow-lift">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="mb-1.5 text-lg font-bold text-deta-green arabic-heading sm:text-xl">
                      {member.name}
                    </h3>
                    <p className="mb-3 inline-block rounded-full bg-deta-gold/15 px-3 py-1 text-xs font-bold text-deta-brown sm:text-sm">
                      {member.position}
                    </p>
                    <p className="text-sm leading-relaxed text-stone-500">
                      {member.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="bg-sand-100 py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <Card className="overflow-hidden rounded-3xl border-none bg-gradient-to-br from-deta-green to-palm-900 shadow-lift">
              <CardContent className="p-6 text-white sm:p-8">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <Eye className="h-7 w-7 text-deta-gold" />
                </span>
                <h3 className="mb-3 text-xl font-bold arabic-heading sm:text-2xl">
                  {t('about.our_vision')}
                </h3>
                <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                  {t('about.vision_text')}
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden rounded-3xl border border-deta-gold/30 bg-gradient-to-br from-palm-950 to-palm-800 shadow-lift">
              <CardContent className="p-6 text-white sm:p-8">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-deta-gold/15 ring-1 ring-deta-gold/40">
                  <Target className="h-7 w-7 text-deta-gold" />
                </span>
                <h3 className="mb-3 text-xl font-bold arabic-heading sm:text-2xl">
                  {t('about.our_mission')}
                </h3>
                <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                  {t('about.mission_text')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
