import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const WhatsAppFloat = () => {
  const { t } = useLanguage();
  const { data: settings } = useSiteSettings();

  const raw = settings?.phone ?? settings?.contact_phone ?? settings?.whatsapp ?? "";
  const digits = String(raw ?? "").replace(/\D/g, "");

  if (!digits) return null;

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("home.hero.whatsapp_label")}
      className="fixed bottom-4 start-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lift transition-transform hover:scale-105 sm:hidden"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};

export default WhatsAppFloat;
