
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-deta-green text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deta-gold rounded-lg flex items-center justify-center">
                <span className="text-deta-green font-bold">D</span>
              </div>
              <h3 className="text-xl font-bold arabic-heading">{t('site.company_name')}</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('site.company_description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 arabic-heading">{t('footer.quick_links')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-deta-gold transition-colors">{t('site.home')}</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-deta-gold transition-colors">{t('site.about')}</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-deta-gold transition-colors">{t('site.services')}</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-deta-gold transition-colors">{t('site.products')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 arabic-heading">{t('site.services')}</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">{t('services.agriculture')}</li>
              <li className="text-gray-300">{t('services.food_manufacturing')}</li>
              <li className="text-gray-300">{t('services.software_development')}</li>
              <li className="text-gray-300">{t('services.consulting')}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 arabic-heading">{t('footer.contact_us')}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-deta-gold" />
                <span className="text-gray-300">+249 123 456 789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-deta-gold" />
                <span className="text-gray-300">info@detagroup.sd</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-deta-gold" />
                <span className="text-gray-300">{t('site.location')}</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-8 h-8 bg-deta-gold rounded-full flex items-center justify-center hover:bg-deta-gold-light transition-colors">
                <Facebook className="w-4 h-4 text-deta-green" />
              </a>
              <a href="#" className="w-8 h-8 bg-deta-gold rounded-full flex items-center justify-center hover:bg-deta-gold-light transition-colors">
                <Twitter className="w-4 h-4 text-deta-green" />
              </a>
              <a href="#" className="w-8 h-8 bg-deta-gold rounded-full flex items-center justify-center hover:bg-deta-gold-light transition-colors">
                <Instagram className="w-4 h-4 text-deta-green" />
              </a>
              <a href="#" className="w-8 h-8 bg-deta-gold rounded-full flex items-center justify-center hover:bg-deta-gold-light transition-colors">
                <Linkedin className="w-4 h-4 text-deta-green" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-deta-green-light mt-8 pt-8 text-center">
          <p className="text-gray-300">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
