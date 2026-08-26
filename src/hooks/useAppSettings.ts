import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppSettings = {
  maintenance_mode: boolean;
  maintenance_message: string;
  instagram_url: string;
  whatsapp_phone: string;
  bot_enabled: boolean;
  bot_name: string;
  bot_welcome: string;
};

const DEFAULTS: AppSettings = {
  maintenance_mode: false,
  maintenance_message: "Nous améliorons votre expérience. Revenez très bientôt.",
  instagram_url: "https://instagram.com/",
  whatsapp_phone: "212600000000",
  bot_enabled: true,
  bot_name: "Assistante TABAT",
  bot_welcome: "Bonjour 👋 Bienvenue chez TABAT. Comment puis-je vous aider aujourd'hui ?",
};


export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("maintenance_mode, maintenance_message, instagram_url, whatsapp_phone, bot_enabled, bot_name, bot_welcome")
        .eq("id", true)
        .maybeSingle();
      if (active && data) setSettings({ ...DEFAULTS, ...(data as Partial<AppSettings>) });

      if (active) setLoading(false);
    };
    fetchSettings();

    const channel = supabase
      .channel(`app_settings_changes_${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_settings" },
        (payload) => {
          if (payload.new) setSettings(payload.new as AppSettings);
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
    const { error } = await supabase
      .from("app_settings")
      .update(patch)
      .eq("id", true);
    return { error };
  };

  return { settings, loading, update };
};
