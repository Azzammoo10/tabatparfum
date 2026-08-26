import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Gender, Parfum } from "@/types/database";
import { parfums as staticParfums } from "@/data/parfums";

export type ParfumFilter = {
  gender?: Gender;
  isNew?: boolean;
  isBestseller?: boolean;
  isActive?: boolean;
  category?: string;
};

// Convert static data format to Database Parfum format
const formatStaticParfums = (): Parfum[] => {
  return staticParfums.map((p) => ({
    id: p.id,
    name: p.name,
    maison: p.maison,
    gender: p.gender,
    category: p.category,
    description: p.description,
    notes_tete: p.notes?.tete ?? [],
    notes_coeur: p.notes?.coeur ?? [],
    notes_fond: p.notes?.fond ?? [],
    price_5ml: p.prices['5ml'],
    price_10ml: p.prices['10ml'],
    price_20ml: p.prices['20ml'],
    image_label: p.imageLabel,
    image_url: p.image_url ?? null,
    is_active: true,
    is_new: !!p.isNew,
    is_bestseller: !!p.isBestseller,
    stock_status: 'actif',
    sale_mode: p.sale_mode ?? 'decant',
    full_bottle_price: p.full_bottle_price ?? null,
    full_bottle_volume_ml: p.sale_mode === 'full_bottle' ? 50 : null,
    full_bottle_stock: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
};

const getActiveBestsellerIds = (): string[] => {
  try {
    const saved = localStorage.getItem("tabat_bestseller_ids");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return [
    '9-pm-night-out-afnan',
    'le-beau-le-parfum',
    'valentino-born-in-roma-intense',
    'stronger-with-you-intensely',
  ];
};

export const useParfums = (filter?: ParfumFilter) => {
  const [data, setData] = useState<Parfum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(filter ?? {});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const bestsellerIds = getActiveBestsellerIds();

    try {
      let q = supabase.from("parfums").select("*").order("created_at", { ascending: false });
      if (filter?.gender) q = q.eq("gender", filter.gender);
      if (filter?.isNew !== undefined) q = q.eq("is_new", filter.isNew);
      if (filter?.isActive !== undefined) q = q.eq("is_active", filter.isActive);
      const { data: rows, error: err } = await q;

      let result: Parfum[] = [];

      if (!err && rows && rows.length > 0) {
        result = rows as unknown as Parfum[];
      } else if (!err && rows && rows.length === 0) {
        result = [];
      } else {
        result = formatStaticParfums();
      }

      if (filter?.gender) result = result.filter((p) => p.gender === filter.gender);
      if (filter?.isNew !== undefined) result = result.filter((p) => p.is_new === filter.isNew);
      if (filter?.isActive !== undefined) result = result.filter((p) => p.is_active === filter.isActive);
      if (filter?.category) result = result.filter((p) => p.category === filter.category);

      if (filter?.isBestseller) {
        // Filter to the configured Best Sellers and sort by rank
        result = result
          .filter((p) => bestsellerIds.includes(p.id))
          .sort((a, b) => bestsellerIds.indexOf(a.id) - bestsellerIds.indexOf(b.id));
      }

      setData(result);
    } catch {
      setData(formatStaticParfums());
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    const handleUpdate = () => load();
    window.addEventListener("tabat_bestsellers_updated", handleUpdate);
    return () => window.removeEventListener("tabat_bestsellers_updated", handleUpdate);
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
};

export const useParfum = (id?: string) => {
  const [data, setData] = useState<Parfum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      if (!id) {
        setData(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data: row, error: err } = await supabase
          .from("parfums")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (!alive) return;
        if (!err && row) {
          setData(row as unknown as Parfum);
        } else if (!err && !row) {
          setData(null);
        } else {
          const statics = formatStaticParfums();
          const found = statics.find((p) => p.id === id) ?? null;
          setData(found);
        }
      } catch {
        if (!alive) return;
        const statics = formatStaticParfums();
        const found = statics.find((p) => p.id === id) ?? null;
        setData(found);
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [id]);

  return { data, loading, error };
};

/** Synchronous helper: fetch parfums by id list at once (for cart display). */
export const fetchParfumsByIds = async (ids: string[]): Promise<Parfum[]> => {
  if (!ids.length) return [];
  try {
    const { data, error } = await supabase.from("parfums").select("*").in("id", ids);
    if (!error && data && data.length > 0) return data as unknown as Parfum[];
  } catch {
    // fallback
  }
  const statics = formatStaticParfums();
  return statics.filter((p) => ids.includes(p.id));
};
