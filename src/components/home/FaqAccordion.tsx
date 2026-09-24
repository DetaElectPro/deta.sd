import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/hooks/useLanguage";
import { useReveal } from "@/hooks/useReveal";

const FaqAccordion = () => {
  const { t } = useLanguage();
  const ref = useReveal<HTMLDivElement>();

  const items = [1, 2, 3, 4, 5, 6].map((n) => ({
    q: t(`home.faq.q${n}`),
    a: t(`home.faq.a${n}`),
  }));

  return (
    <section className="bg-sand-50 py-14 sm:py-20">
      <div ref={ref} className="reveal container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2 className="mb-3 text-2xl font-extrabold text-deta-green arabic-heading sm:text-3xl lg:text-4xl">
            {t("home.faq.title")}
          </h2>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-deta-gold" aria-hidden="true" />
          <p className="text-base text-stone-500 sm:text-lg lg:text-xl">
            {t("home.faq.description")}
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mx-auto max-w-3xl rounded-3xl border border-deta-green/10 bg-white px-5 shadow-soft sm:px-7"
        >
          {items.map((item, index) => (
            <AccordionItem key={index} value={`faq-${index + 1}`}>
              <AccordionTrigger className="py-4 text-start text-base font-bold text-deta-green arabic-heading sm:py-5 sm:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-stone-500 sm:text-base">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqAccordion;
