import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { usePageTracking } from "@/hooks/usePageTracking";

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
      icon: Eye,
    },
    {
      title: t('about.innovation'),
      description: t('about.innovation_desc'),
      icon: Target,
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
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section - Fixed gradient background */}
      <section className="bg-gradient-to-r from-deta-green to-deta-green-light py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">
            {t('about.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {t('about.description')}
          </p>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-deta-green mb-6 arabic-heading">
                {t('about.our_story')}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('about.story_text')}
              </p>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-deta-green">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-deta-green-light to-deta-green rounded-lg h-96"></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-deta-green mb-12 text-center arabic-heading">
            {t('about.our_values')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-none shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-deta-gold to-deta-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-deta-green mb-4 arabic-heading">
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

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-deta-green mb-12 text-center arabic-heading">
            {t('about.our_team')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-64 bg-gradient-to-br from-deta-green-light to-deta-green"></div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-deta-green mb-2 arabic-heading">
                      {member.name}
                    </h3>
                    <p className="text-deta-gold font-medium mb-3">
                      {member.position}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-none shadow-lg bg-gradient-to-r from-deta-green to-deta-green-light">
              <CardContent className="p-8 text-white">
                <Eye className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4 arabic-heading">
                  {t('about.our_vision')}
                </h3>
                <p className="leading-relaxed">
                  {t('about.vision_text')}
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-gradient-to-r from-deta-gold to-deta-gold-light">
              <CardContent className="p-8 text-white">
                <Target className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4 arabic-heading">
                  {t('about.our_mission')}
                </h3>
                <p className="leading-relaxed">
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
