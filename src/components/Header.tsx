import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSelector } from "@/components/admin/LanguageSelector";
import TickerTape from "@/components/TickerTape";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navigation = [
    { name: t('site.home'), href: "/" },
    { name: t('site.about'), href: "/about" },
    { name: t('site.services'), href: "/services" },
    { name: t('site.products'), href: "/products" },
    { name: t('site.news'), href: "/news" },
    { name: t('site.contact'), href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="relative">
      {/* Ticker Tape - Hidden after significant scroll */}
      <div className={`transition-all duration-500 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'}`}>
        <TickerTape />
      </div>

      {/* Top Bar - Hidden after significant scroll, phone-safe */}
      <div className={`bg-palm-950 text-white transition-all duration-500 ${isScrolled ? 'h-0 py-0 overflow-hidden opacity-0' : 'opacity-100'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 py-2 text-xs sm:text-sm">
            <div className="flex min-w-0 items-center gap-3 sm:gap-5">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-deta-gold/15">
                  <Phone className="h-3.5 w-3.5 text-deta-gold" />
                </span>
                <span className="truncate" dir="ltr">+249 123 456 789</span>
              </div>
              <div className="hidden min-w-0 items-center gap-2 sm:flex">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-deta-gold/15">
                  <Mail className="h-3.5 w-3.5 text-deta-gold" />
                </span>
                <span className="truncate" dir="ltr">info@detagroup.sd</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden items-center gap-2 text-white/80 lg:flex">
                <MapPin className="h-3.5 w-3.5 text-deta-gold" />
                <span className="max-w-44 truncate">{t('site.location')}</span>
              </div>
              <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden="true" />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Always sticky */}
      <div className={`border-b transition-all duration-500 ${isScrolled ? 'fixed top-0 start-0 end-0 z-50 border-deta-gold/25 bg-white/90 shadow-lift backdrop-blur-xl' : 'relative border-transparent bg-white/95 shadow-soft backdrop-blur'}`}>
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-deta-green via-deta-green to-palm-800 shadow-soft ring-1 ring-deta-gold/50 sm:h-12 sm:w-12">
                <span className="text-xl font-extrabold text-white">D</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xl font-extrabold tracking-tight text-deta-green arabic-heading sm:text-2xl">{t('site.company_name')}</p>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-deta-green/60" dir="ltr">Deta Group</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isActive(item.href)
                      ? "bg-deta-green text-white shadow-soft"
                      : "text-stone-600 hover:bg-sand-100 hover:text-deta-green"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="ms-2 rounded-full bg-deta-gold px-5 py-2 text-sm font-bold text-palm-950 shadow-soft transition-all hover:bg-deta-gold-light"
              >
                {t('site.contact')}
              </Link>
            </nav>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon" className="shrink-0 rounded-xl border-deta-green/20" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 max-w-[85vw] border-s border-deta-green/10 bg-sand-50">
                <div className="mt-8 flex flex-col gap-2">
                  <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-deta-green to-palm-800">
                      <span className="font-extrabold text-white">D</span>
                    </div>
                    <p className="text-base font-bold text-deta-green arabic-heading">{t('site.company_name')}</p>
                  </div>
                  <div className="border-b border-deta-green/10 py-3">
                    <LanguageSelector />
                  </div>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                        isActive(item.href)
                          ? "bg-deta-green text-white shadow-soft"
                          : "text-stone-700 hover:bg-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="mt-2 flex items-center gap-2 rounded-xl bg-palm-950 p-4 text-xs text-white/80">
                    <Phone className="h-4 w-4 shrink-0 text-deta-gold" />
                    <span dir="ltr">+249 123 456 789</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
