import { Sprout, FlaskConical, FileCheck, Ship } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useReveal } from "@/hooks/useReveal";

const ProcessTimeline = () => {
  const { t } = useLanguage();
  const ref = useReveal<HTMLDivElement>();

  const steps = [
    { icon: Sprout, title: t("home.process.step1_title"), desc: t("home.process.step1_desc") },
    { icon: FlaskConical, title: t("home.process.step2_title"), desc: t("home.process.step2_desc") },
    { icon: FileCheck, title: t("home.process.step3_title"), desc: t("home.process.step3_desc") },
    { icon: Ship, title: t("home.process.step4_title"), desc: t("home.process.step4_desc") },
  ];

  return (
    <section className="bg-white py-14 sm:py-20">
      <div ref={ref} className="reveal container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2 className="mb-3 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl lg:text-4xl">
            {t("home.process.title")}
          </h2>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          <p className="text-base text-stone-500 sm:text-lg lg:text-xl">
            {t("home.process.description")}
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => (
            <li
              key={index}
              className="relative rounded-3xl border border-deta-green/10 bg-sand-50 p-6 text-center shadow-soft sm:p-7"
            >
              <span
                className="absolute top-4 end-4 flex h-7 w-7 items-center justify-center rounded-full bg-deta-gold/15 text-sm font-extrabold text-deta-brown"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-deta-green text-white shadow-soft sm:h-16 sm:w-16">
                <step.icon className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <h3 className="mb-2 text-lg font-bold text-deta-green arabic-heading sm:text-xl">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-stone-500 sm:text-base">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProcessTimeline;
