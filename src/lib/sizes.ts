import type { Size } from "@/types/database";

export const SIZES: Size[] = ["5ml", "10ml", "20ml", "full"];

export const SIZE_META: Record<Size, { label: string; sub: string }> = {
  "5ml": { label: "5 ml", sub: "Découverte" },
  "10ml": { label: "10 ml", sub: "Voyage" },
  "20ml": { label: "20 ml", sub: "Signature" },
  full: { label: "Bouteille complète", sub: "Flacon scellé" },
};

type PriceSource = {
  price_5ml: number;
  price_10ml: number;
  price_20ml: number;
  full_bottle_price?: number | null;
};

export const priceFor = (prices: PriceSource, size: Size): number => {
  switch (size) {
    case "5ml":
      return Number(prices.price_5ml);
    case "10ml":
      return Number(prices.price_10ml);
    case "20ml":
      return Number(prices.price_20ml);
    case "full":
      return Number(prices.full_bottle_price ?? 0);
  }
};

export const formatMAD = (n: number) => `${Number(n).toLocaleString("fr-FR")} MAD`;
