import { Globe } from "lucide-react";
import { useCountries } from "@/hooks/useCountries";
import { useLanguage } from "@/hooks/useLanguage";
import { useReveal } from "@/hooks/useReveal";

const MarketsStrip = () => {
  const { t, currentLanguage } = useLanguage();
  const { data: countries } = useCountries();
  const ref = useReveal<HTMLDivElement>();

  if (!countries || countries.length === 0) return null;

  const names = countries.map((c) => (currentLanguage === "ar" ? c.name_ar : c.name_en));

  return (
    <section className="border-y border-deta-gold/20 bg-palm-950 py-14 sm:py-20">
      <div ref={ref} className="reveal container mx-auto px-4">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <h2 className="mb-3 text-2xl font-extrabold text-white arabic-heading sm:text-3xl lg:text-4xl">
            {t("home.markets.title")}
          </h2>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          <p className="text-base text-white/70 sm:text-lg lg:text-xl">
            {t("home.markets.description")}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {names.map((name, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs text-white/85 ring-1 ring-white/15 sm:text-sm"
            >
              <Globe className="h-3.5 w-3.5 shrink-0 text-deta-gold" />
              {name}
            </span>
          ))}
        </div>

        <div className="overflow-hidden" aria-hidden="true">
          <div className="marquee-track">
            {[...names, ...names].map((name, index) => (
              <span
                key={index}
                className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-deta-gold/70 sm:text-base"
              >
                {name} •
              </span>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-white/50 sm:text-sm">
          {t("home.markets.note")}
        </p>
      </div>
    </section>
  );
};

export default MarketsStrip;
