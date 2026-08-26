import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Customer } from "@/types/database";

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from("customers")
        .select("*")
        .order("total_spent", { ascending: false });
      if (!alive) return;
      if (err) setError(err.message);
      else setCustomers((data ?? []) as unknown as Customer[]);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { customers, loading, error };
};
