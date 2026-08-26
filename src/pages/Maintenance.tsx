import { Instagram, MessageCircle, Wrench } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";

const Maintenance = () => {
  const { settings } = useAppSettings();

  const waPhone = settings.whatsapp_phone.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${waPhone}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6 py-12">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto">
          <Wrench className="w-9 h-9 animate-pulse" />
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide">
            Mode Maintenance
          </h1>
          <p className="text-foreground/70 text-base md:text-lg font-light leading-relaxed max-w-md mx-auto">
            {settings.maintenance_message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Instagram className="w-4 h-4" />
            Visiter Instagram
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-border bg-background hover:bg-accent transition-colors text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            Contactez-nous sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
