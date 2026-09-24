
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();

  const socials = [
    { icon: Facebook, label: "Facebook" },
    { icon: Twitter, label: "Twitter" },
    { icon: Instagram, label: "Instagram" },
    { icon: Linkedin, label: "LinkedIn" },
  ];

  return (
    <footer className="bg-palm-950 text-white">
      <div className="h-1 bg-deta-gold" aria-hidden="true" />
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Company Info */}
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-deta-gold to-deta-gold-light shadow-soft">
                <span className="font-extrabold text-palm-950">D</span>
              </div>
              <h3 className="text-lg font-bold leading-snug arabic-heading sm:text-xl">{t('site.company_name')}</h3>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              {t('site.company_description')}
            </p>
            <div className="mt-5 flex h-1 w-16 items-center rounded-full bg-deta-gold/70" aria-hidden="true" />
          </div>

          {/* Quick Links */}
          <div className="lg:ps-4">
            <h4 className="mb-1 text-base font-bold arabic-heading sm:text-lg">{t('footer.quick_links')}</h4>
            <div className="mb-4 h-0.5 w-10 rounded-full bg-deta-gold" aria-hidden="true" />
            <ul className="space-y-1">
              <li><Link to="/" className="inline-block rounded-lg px-2 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-deta-gold">{t('site.home')}</Link></li>
              <li><Link to="/about" className="inline-block rounded-lg px-2 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-deta-gold">{t('site.about')}</Link></li>
              <li><Link to="/services" className="inline-block rounded-lg px-2 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-deta-gold">{t('site.services')}</Link></li>
              <li><Link to="/products" className="inline-block rounded-lg px-2 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-deta-gold">{t('site.products')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-1 text-base font-bold arabic-heading sm:text-lg">{t('site.services')}</h4>
            <div className="mb-4 h-0.5 w-10 rounded-full bg-deta-gold" aria-hidden="true" />
            <ul className="space-y-2.5 text-sm text-white/70">
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-deta-gold" aria-hidden="true" />
                {t('services.agriculture')}
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-deta-gold" aria-hidden="true" />
                {t('services.food_manufacturing')}
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-deta-gold" aria-hidden="true" />
                {t('services.software_development')}
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-deta-gold" aria-hidden="true" />
                {t('services.consulting')}
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <h4 className="mb-1 text-base font-bold arabic-heading sm:text-lg">{t('footer.contact_us')}</h4>
            <div className="mb-4 h-0.5 w-10 rounded-full bg-deta-gold" aria-hidden="true" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-deta-gold/15">
                  <Phone className="h-4 w-4 text-deta-gold" />
                </span>
                <span className="text-white/75" dir="ltr">+249 123 456 789</span>
              </div>
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-deta-gold/15">
                  <Mail className="h-4 w-4 text-deta-gold" />
                </span>
                <span className="truncate text-white/75" dir="ltr">info@detagroup.sd</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-deta-gold/15">
                  <MapPin className="h-4 w-4 text-deta-gold" />
                </span>
                <span className="text-white/75">{t('site.location')}</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 transition-all hover:bg-deta-gold"
                >
                  <social.icon className="h-4 w-4 text-deta-gold transition-colors hover:text-palm-950" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center sm:mt-12 sm:pt-8">
          <p className="text-xs text-white/60 sm:text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
