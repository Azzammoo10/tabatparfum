import { Instagram, MessageCircle, Clock, Phone } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";

const cleanDisplayPhone = (p?: string) => {
  if (!p || p.includes("6 63") || p.includes("663848099") || p.includes("600000000")) {
    return "+212 752-850156";
  }
  return p;
};

const cleanWhatsAppNumber = (p?: string) => {
  if (!p || p.includes("663848099") || p.includes("600000000")) {
    return "212752850156";
  }
  const digits = p.replace(/[^0-9]/g, "");
  return digits.length > 5 ? digits : "212752850156";
};

const Maintenance = () => {
  const { settings } = useAppSettings();

  const displayPhone = cleanDisplayPhone(settings.store_phone);
  const waPhone = cleanWhatsAppNumber(settings.whatsapp_phone || settings.store_phone);
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent("Bonjour TABAT, je souhaite me renseigner sur vos parfums.")}`;

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background text-foreground px-4 py-12 overflow-hidden selection:bg-primary/20">
      {/* Background ambient luxury glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-7">
        {/* Brand Logo */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src="/logo.png"
              alt="TABAT"
              className="h-16 md:h-20 w-auto object-contain dark:invert mx-auto transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary mt-2">
            Haute Parfumerie & Décants
          </span>
        </div>

        {/* Central Luxury Card */}
        <div className="bg-card/80 backdrop-blur-md border border-border/80 rounded-2xl p-7 md:p-9 shadow-xl space-y-5">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <Clock className="w-3.5 h-3.5" />
            <span>Mise à niveau en cours</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Boutique temporairement en maintenance
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {settings.maintenance_message || "Nous préparons de nouvelles collections d'exception. Notre boutique sera de nouveau disponible dans quelques instants."}
            </p>
          </div>

          <div className="border-t border-border/60 pt-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Une commande urgente ou une question ? Notre équipe reste à votre écoute :
            </p>

            {/* Direct Contact CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white transition-all text-xs font-semibold shadow-sm hover:shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Direct</span>
              </a>

              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white transition-all text-xs font-semibold shadow-sm hover:shadow-md cursor-pointer"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Suivre sur Instagram</span>
                </a>
              )}
            </div>

            {/* Additional Contact Infos */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
              <a
                href={`tel:${displayPhone.replace(/\s+/g, "")}`}
                className="hover:text-primary transition-colors flex items-center gap-1.5 font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>{displayPhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-xs text-muted-foreground/80">
          © {new Date().getFullYear()} TABAT Perfumes · Tous droits réservés
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
