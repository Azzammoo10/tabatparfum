import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const checkSession = async () => {
      const localAdmin = localStorage.getItem("tabat_admin_session");
      if (localAdmin) {
        try {
          const parsed = JSON.parse(localAdmin);
          setSession({ user: { email: parsed.user?.email || "admin@tabatperfume.com" } } as unknown as Session);
          return;
        } catch {
          // ignore
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
      } else {
        setSession(null);
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) {
        setSession(s);
      } else {
        const localAdmin = localStorage.getItem("tabat_admin_session");
        if (localAdmin) {
          setSession({ user: { email: "admin@tabatperfume.com" } } as unknown as Session);
        } else {
          setSession(null);
        }
      }
    });

    checkSession();

    return () => sub.subscription.unsubscribe();
  }, []);

  return session;
};
