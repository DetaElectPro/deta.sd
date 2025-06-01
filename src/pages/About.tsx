
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  Globe, 
  Target,
  Eye,
  Heart,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: <Award className="w-12 h-12 text-deta-gold" />,
      title: t('values.excellence'),
      description: t('values.excellence_desc')
    },
    {
      icon: <Heart className="w-12 h-12 text-deta-gold" />,
      title: t('values.integrity'),
      description: t('values.integrity_desc')
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-deta-gold" />,
      title: t('values.innovation'),
      description: t('values.innovation_desc')
    },
    {
      icon: <Globe className="w-12 h-12 text-deta-gold" />,
      title: t('values.sustainability'),
      description: t('values.sustainability_desc')
    }
  ];

  const milestones = [
    { year: "2008", event: t('milestones.founded') },
    { year: "2012", event: t('milestones.first_expansion') },
    { year: "2016", event: t('milestones.software_division') },
    { year: "2020", event: t('milestones.international_expansion') },
    { year: "2024", event: t('milestones.digital_transformation') }
  ];

  const leadership = [
    {
      name: t('leadership.ceo_name'),
      position: t('leadership.ceo_position'),
      description: t('leadership.ceo_desc')
    },
    {
      name: t('leadership.cto_name'),
      position: t('leadership.cto_position'),
      description: t('leadership.cto_desc')
    },
    {
      name: t('leadership.operations_name'),
      position: t('leadership.operations_position'),
      description: t('leadership.operations_desc')
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-deta-gradient py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">{t('site.about')}</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {t('about.hero_description')}
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-deta-green mb-6 arabic-heading">
                {t('about.our_story')}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('about.story_description')}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-deta-gold" />
                  <span className="text-gray-700">{t('about.story_point_1')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-deta-gold" />
                  <span className="text-gray-700">{t('about.story_point_2')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-deta-gold" />
                  <span className="text-gray-700">{t('about.story_point_3')}</span>
                </div>
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
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 text-deta-gold mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-deta-green mb-4 arabic-heading">
                  {t('about.mission')}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('about.mission_description')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardContent className="p-8 text-center">
                <Eye className="w-16 h-16 text-deta-gold mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-deta-green mb-4 arabic-heading">
                  {t('about.vision')}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('about.vision_description')}
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
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">
              {t('about.our_values')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.values_description')}
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
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-deta-green">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 arabic-heading">
              {t('about.our_journey')}
            </h2>
            <p className="text-xl text-gray-300">
              {t('about.journey_description')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-8">
                  <Badge className="bg-deta-gold text-deta-green text-lg px-4 py-2 font-bold min-w-[80px]">
                    {milestone.year}
                  </Badge>
                  <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <p className="text-white text-lg">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deta-green mb-4 arabic-heading">
              {t('about.leadership')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.leadership_description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover-scale">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-deta-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-deta-green mb-2 arabic-heading">
                    {leader.name}
                  </h3>
                  <Badge className="bg-deta-gold text-white mb-4">
                    {leader.position}
                  </Badge>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {leader.description}
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

export default About;
