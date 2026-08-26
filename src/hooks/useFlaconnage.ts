import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { OrderItem, Size } from "@/types/database";

export type FlaconRow = {
  size: Size;
  stock: number;
  low_threshold: number;
  updated_at: string;
};

export type FlaconStats = {
  size: Size;
  label: string;
  stock: number;
  used: number;
  low_threshold: number;
  isLow: boolean;
};

const LABELS: Record<Size, string> = {
  "5ml": "Flacons 5ml",
  "10ml": "Flacons 10ml",
  "20ml": "Flacons 20ml",
  full: "Bouteilles complètes",
};

export const useFlaconnage = () => {
  const [rows, setRows] = useState<FlaconRow[]>([]);
  const [used, setUsed] = useState<Record<Size, number>>({ "5ml": 0, "10ml": 0, "20ml": 0, full: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [flaconRes, ordersRes] = await Promise.all([
        supabase.from("flaconnage").select("*").order("size"),
        supabase.from("orders").select("items, status").neq("status", "annulee"),
      ]);
      if (flaconRes.error) throw flaconRes.error;
      if (ordersRes.error) throw ordersRes.error;

      const acc: Record<Size, number> = { "5ml": 0, "10ml": 0, "20ml": 0, full: 0 };
      (ordersRes.data ?? []).forEach((o) => {
        const items = (o.items ?? []) as OrderItem[];
        items.forEach((it) => {
          if (it.size in acc) acc[it.size] += it.quantity;
        });
      });
      setRows((flaconRes.data ?? []) as FlaconRow[]);
      setUsed(acc);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (size: Size, patch: Partial<Pick<FlaconRow, "stock" | "low_threshold">>) => {
    const { error: err } = await supabase.from("flaconnage").update(patch).eq("size", size);
    if (err) return { error: err.message };
    await load();
    return { ok: true };
  };

  const stats: FlaconStats[] = rows.map((r) => ({
    size: r.size,
    label: LABELS[r.size] ?? r.size,
    stock: r.stock,
    used: used[r.size] ?? 0,
    low_threshold: r.low_threshold,
    isLow: r.stock <= r.low_threshold,
  }));

  return { stats, loading, error, refetch: load, update };
};
