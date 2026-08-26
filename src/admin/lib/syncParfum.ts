import { supabase } from "@/integrations/supabase/client";
import type { AdminParfum } from "@/store/useProductStore";

const BUCKET = "product-images";
// 10 years
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export const uploadProductImage = async (productId: string, file: File): Promise<string> => {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${productId}/${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || undefined });
  if (upErr) throw upErr;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
  if (error || !data?.signedUrl) throw error ?? new Error("Signed URL failed");
  return data.signedUrl;
};

export const upsertParfumToSupabase = async (p: AdminParfum, imageUrl: string | null) => {
  const fullStock = p.full_bottle_stock ?? 0;
  const decantStock = (p.stock_5ml ?? 0) + (p.stock_10ml ?? 0);
  const isFull = (p.sale_mode ?? "decant") === "full_bottle";
  const row = {
    id: p.id,
    name: p.name,
    maison: p.maison,
    gender: p.gender,
    description: p.description,
    notes_tete: p.notes.tete,
    notes_coeur: p.notes.coeur,
    notes_fond: p.notes.fond,
    price_5ml: p.prices["5ml"],
    price_10ml: p.prices["10ml"],
    price_20ml: p.prices["20ml"],
    image_label: p.imageLabel,
    image_url: imageUrl,
    is_active: p.active ?? true,
    is_new: !!p.isNew,
    is_bestseller: !!p.isBestseller,
    sale_mode: p.sale_mode ?? "decant",
    full_bottle_volume_ml: p.full_bottle_volume_ml ?? null,
    full_bottle_price: p.full_bottle_price ?? null,
    full_bottle_stock: fullStock,
    full_bottle_limited: !!p.full_bottle_limited,
    stock_status: ((isFull ? fullStock : decantStock) > 0 ? "actif" : "rupture") as "actif" | "rupture",
  };
  const { error } = await supabase.from("parfums").upsert(row as never, { onConflict: "id" });
  if (error) throw error;
};

export const deleteParfumFromSupabase = async (id: string) => {
  await supabase.from("parfums").delete().eq("id", id);
  // best effort cleanup of any images under this product folder
  const { data: list } = await supabase.storage.from(BUCKET).list(id);
  if (list?.length) {
    await supabase.storage.from(BUCKET).remove(list.map((f) => `${id}/${f.name}`));
  }
};
