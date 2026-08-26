import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { OrderItem } from "@/types/database";

type Kpis = {
  revenueThisMonth: number;
  revenueLastMonth: number;
  ordersThisMonth: number;
  ordersInProgress: number;
  activeParfums: number;
  rupture: number;
  customers: number;
  customersThisMonth: number;
};

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export const useDashboardKPIs = () => {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const thisStart = startOfMonth(now).toISOString();
        const lastStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1)).toISOString();
        const lastEnd = thisStart;

        const [activeRes, ruptureRes, ordersThisRes, ordersLastRes, inProgressRes, customersRes, customersMonthRes] =
          await Promise.all([
            supabase.from("parfums").select("id", { count: "exact", head: true }).eq("is_active", true),
            supabase.from("parfums").select("id", { count: "exact", head: true }).eq("stock_status", "rupture"),
            supabase.from("orders").select("total_amount, created_at").gte("created_at", thisStart),
            supabase.from("orders").select("total_amount").gte("created_at", lastStart).lt("created_at", lastEnd),
            supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "en_attente"),
            supabase.from("customers").select("id", { count: "exact", head: true }),
            supabase.from("customers").select("id", { count: "exact", head: true }).gte("created_at", thisStart),
          ]);

        const sum = (rows: { total_amount: number }[] | null) =>
          (rows ?? []).reduce((acc, r) => acc + Number(r.total_amount ?? 0), 0);

        if (!alive) return;
        setKpis({
          activeParfums: activeRes.count ?? 0,
          rupture: ruptureRes.count ?? 0,
          revenueThisMonth: sum(ordersThisRes.data as { total_amount: number }[] | null),
          revenueLastMonth: sum(ordersLastRes.data as { total_amount: number }[] | null),
          ordersThisMonth: (ordersThisRes.data ?? []).length,
          ordersInProgress: inProgressRes.count ?? 0,
          customers: customersRes.count ?? 0,
          customersThisMonth: customersMonthRes.count ?? 0,
        });
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { kpis, loading, error };
};

export type RevenuePoint = { month: string; revenue: number };

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

export const useRevenueChart = () => {
  const [data, setData] = useState<RevenuePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      const now = new Date();
      const start = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 5, 1));
      const { data: rows, error: err } = await supabase
        .from("orders")
        .select("total_amount, created_at")
        .gte("created_at", start.toISOString());
      if (!alive) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      const buckets = new Map<string, number>();
      for (let i = 0; i < 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        buckets.set(`${d.getFullYear()}-${d.getMonth()}`, 0);
      }
      (rows ?? []).forEach((r) => {
        const d = new Date(r.created_at);
        const k = `${d.getFullYear()}-${d.getMonth()}`;
        buckets.set(k, (buckets.get(k) ?? 0) + Number(r.total_amount));
      });
      const points: RevenuePoint[] = Array.from(buckets.entries()).map(([k, v]) => {
        const [, m] = k.split("-").map(Number);
        return { month: MONTHS_FR[m], revenue: v };
      });
      setData(points);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
};

export type TopProduct = { parfum_name: string; size: string; qty: number; revenue: number };

export const useTopProducts = () => {
  const [data, setData] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      const { data: rows, error: err } = await supabase.from("orders").select("items");
      if (!alive) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      const agg = new Map<string, TopProduct>();
      (rows ?? []).forEach((r) => {
        const items = (r.items ?? []) as OrderItem[];
        items.forEach((it) => {
          const key = `${it.parfum_id}|${it.size}`;
          const cur = agg.get(key);
          if (cur) {
            cur.qty += it.quantity;
            cur.revenue += it.subtotal;
          } else {
            agg.set(key, {
              parfum_name: it.parfum_name,
              size: it.size,
              qty: it.quantity,
              revenue: it.subtotal,
            });
          }
        });
      });
      setData(Array.from(agg.values()).sort((a, b) => b.qty - a.qty).slice(0, 5));
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
};
