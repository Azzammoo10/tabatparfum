import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type AppSettings = {
  maintenance_mode: boolean;
  maintenance_message: string;
  instagram_url: string;
  whatsapp_phone: string;
  bot_enabled: boolean;
  bot_name: string;
  bot_welcome: string;
  store_name: string;
  store_email: string;
  store_phone: string;
  store_address: string;
};

const DEFAULTS: AppSettings = {
  maintenance_mode: false,
  maintenance_message: "Nous améliorons votre expérience. Revenez très bientôt.",
  instagram_url: "https://instagram.com/tabatperfume",
  whatsapp_phone: "212663848099",
  bot_enabled: true,
  bot_name: "Assistante TABAT",
  bot_welcome: "Bonjour 👋 Bienvenue chez TABAT. Comment puis-je vous aider aujourd'hui ?",
  store_name: "TABAT",
  store_email: "contact@tabatperfume.com",
  store_phone: "+212 6 63 84 80 99",
  store_address: "Casablanca, Maroc",
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("app_settings")
          .select("*")
          .eq("id", true)
          .maybeSingle();

        if (error) {
          console.warn("Fetch app_settings error:", error);
        }

        if (active && data) {
          setSettings({ ...DEFAULTS, ...(data as Partial<AppSettings>) });
        }
      } catch (err) {
        console.warn("Exception fetching app_settings:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSettings();

    const channel = supabase
      .channel(`app_settings_changes_${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_settings" },
        (payload) => {
          if (payload.new && active) {
            setSettings((prev) => ({ ...prev, ...(payload.new as Partial<AppSettings>) }));
          }
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const update = async (patch: Partial<AppSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));

    // Use upsert to guarantee creation if row id=true does not exist yet
    const { error } = await supabase
      .from("app_settings")
      .upsert({ id: true, ...patch });

    if (error) {
      console.error("Erreur mise a jour maintenance/settings:", error);
    }
    return { error };
  };

  return { settings, loading, update };
};
