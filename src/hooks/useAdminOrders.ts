import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Order, OrderStatus } from "@/types/database";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setOrders((data ?? []) as unknown as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const { error: err } = await supabase.from("orders").update({ status }).eq("id", id);
    if (err) return { error: err.message };
    await load();
    return { ok: true };
  };

  return { orders, loading, error, refetch: load, updateOrderStatus };
};
