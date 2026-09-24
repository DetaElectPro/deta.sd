
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import { Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <SEO
        title="صفحة غير موجودة | مجموعة ديتا"
        description="الصفحة المطلوبة غير موجودة، عودوا للصفحة الرئيسية لمجموعة ديتا."
        url="https://deta.sd/404"
        canonical="https://deta.sd/404"
        noindex
      />
      <div className="text-center max-w-md w-full rounded-3xl border border-slate-100 bg-white shadow-lg p-8 sm:p-12">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-deta-green/10 text-deta-green">
          <Compass className="h-7 w-7" />
        </span>
        <h1 className="text-5xl sm:text-6xl font-bold mb-3 text-deta-green">404</h1>
        <p className="text-lg sm:text-xl text-slate-600 mb-6">Oops! Page not found</p>
        <a href="/" className="inline-flex items-center justify-center rounded-full bg-deta-green px-8 py-3 text-sm sm:text-base font-medium text-white hover:bg-deta-green/90 transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
