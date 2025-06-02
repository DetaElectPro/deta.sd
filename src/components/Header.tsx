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
      
      {/* Top Bar - Hidden after significant scroll */}
      <div className={`bg-deta-green text-white transition-all duration-500 ${isScrolled ? 'h-0 py-0 overflow-hidden opacity-0' : 'py-2 opacity-100'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+249 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@detagroup.sd</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{t('site.location')}</span>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Always sticky */}
      <div className={`bg-white shadow-lg transition-all duration-500 ${isScrolled ? 'fixed top-0 left-0 right-0 z-50' : 'relative'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-deta-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-deta-green arabic-heading">{t('site.company_name')}</h1>
                <p className="text-sm text-gray-600">Deta Group</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors hover:text-deta-green relative ${
                    isActive(item.href) 
                      ? "text-deta-green after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-deta-gold after:bottom-[-4px] after:left-0" 
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="pb-4 border-b">
                    <LanguageSelector />
                  </div>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors ${
                        isActive(item.href) ? "text-deta-green" : "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
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
