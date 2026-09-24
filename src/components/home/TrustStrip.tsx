import AnimatedCounter from "@/components/AnimatedCounter";
import { useLanguage } from "@/hooks/useLanguage";
import { useReveal } from "@/hooks/useReveal";

const TrustStrip = () => {
  const { t } = useLanguage();
  const ref = useReveal<HTMLDivElement>();

  const items = [
    { end: 15, suffix: "+", label: t("stats.years_experience") },
    { end: 20, suffix: "+", label: t("home.trust.countries_label") },
    { end: 24, suffix: "h", label: t("home.trust.response_label") },
    { end: 100, suffix: "%", label: t("home.trust.quality_label") },
  ];

  return (
    <section id="trust" className="border-b border-deta-green/10 bg-white py-10 sm:py-14">
      <div ref={ref} className="reveal container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-sand-50 p-5 text-center ring-1 ring-deta-green/10 sm:p-6"
            >
              <AnimatedCounter
                end={item.end}
                suffix={item.suffix}
                duration={2000 + index * 200}
                className="mb-1 block text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl lg:text-4xl"
              />
              <p className="text-xs text-stone-500 sm:text-sm lg:text-base">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
