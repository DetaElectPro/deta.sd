import { Microscope, Files, PackageCheck, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useReveal } from "@/hooks/useReveal";

const QualityCards = () => {
  const { t } = useLanguage();
  const ref = useReveal<HTMLDivElement>();

  const items = [
    { icon: Microscope, title: t("home.quality.item1_title"), desc: t("home.quality.item1_desc") },
    { icon: Files, title: t("home.quality.item2_title"), desc: t("home.quality.item2_desc") },
    { icon: PackageCheck, title: t("home.quality.item3_title"), desc: t("home.quality.item3_desc") },
    { icon: Timer, title: t("home.quality.item4_title"), desc: t("home.quality.item4_desc") },
  ];

  return (
    <section className="bg-sand-50 py-14 sm:py-20">
      <div ref={ref} className="reveal container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2 className="mb-3 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl lg:text-4xl">
            {t("home.quality.title")}
          </h2>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          <p className="text-base text-stone-500 sm:text-lg lg:text-xl">
            {t("home.quality.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {items.map((item, index) => (
            <Card
              key={index}
              className="group overflow-hidden rounded-3xl border border-deta-green/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <div className="h-1.5 bg-deta-gradient" aria-hidden="true" />
              <CardContent className="p-6 text-center sm:p-7">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-deta-green/10 transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16">
                  <item.icon className="h-7 w-7 text-deta-green sm:h-8 sm:w-8" />
                </span>
                <h3 className="mb-2 text-lg font-bold text-deta-green arabic-heading sm:text-xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-500 sm:text-base">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QualityCards;
