import { Link } from "react-router-dom";
import ProductImage from "@/components/ui/ProductImage";
import { useParfums } from "@/hooks/useParfums";
import { formatMAD } from "@/lib/sizes";

interface RelatedProductsProps {
  currentParfumId?: string;
  maison?: string;
  gender?: string;
}

const RelatedProducts = ({ currentParfumId, maison, gender }: RelatedProductsProps) => {
  const { data: allParfums, loading } = useParfums();

  // 1. Filter products from the SAME maison/provider (excluding current product)
  const sameMaison = allParfums.filter(
    (p) =>
      p.id !== currentParfumId &&
      maison &&
      p.maison.trim().toLowerCase() === maison.trim().toLowerCase()
  );

  // 2. Fallback products if same maison has fewer than 4 items
  const otherParfums = allParfums.filter(
    (p) =>
      p.id !== currentParfumId &&
      (!maison || p.maison.trim().toLowerCase() !== maison.trim().toLowerCase())
  );

  // Combine: Prioritize same provider first
  const related = [...sameMaison, ...otherParfums].slice(0, 4);

  return (
    <section className="w-full mt-20 sm:mt-32 pt-10 border-t border-border/40 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 sm:mb-8 pb-3 border-b border-border/40">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-1">
            {maison ? `Maison ${maison}` : "Haute Parfumerie"}
          </p>
          <h2 className="font-serif text-xl sm:text-3xl text-foreground font-medium">
            Produits Apparentés
          </h2>
        </div>
        <Link
          to="/collection/all"
          className="text-[10px] sm:text-xs uppercase tracking-wider text-primary hover:text-primary-hover font-semibold border-b border-primary/40 pb-0.5"
        >
          Voir Tout
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="aspect-[4/5] bg-muted rounded-2xl" />
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {related.map((p) => {
            const isFull = p.sale_mode === "full_bottle";
            const outOfStock =
              !p.is_active ||
              p.stock_status === "rupture" ||
              (isFull && typeof p.full_bottle_stock === "number" && p.full_bottle_stock <= 0) ||
              (!isFull && typeof p.stock_5ml === "number" && typeof p.stock_10ml === "number" && p.stock_5ml <= 0 && p.stock_10ml <= 0);

            return (
              <Link
                key={p.id}
                to={`/parfum/${p.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`group block rounded-2xl p-2 sm:p-3 transition-all hover:bg-card/40 relative text-left ${
                  outOfStock ? "opacity-75" : ""
                }`}
              >
                <div className="relative mb-2 overflow-hidden rounded-xl bg-muted/40">
                  <ProductImage
                    src={p.image_url}
                    alt={p.name}
                    label={p.image_label}
                    aspect="aspect-[4/5]"
                    fitMode="contain"
                    className={`max-h-48 sm:max-h-56 mx-auto transition-all duration-300 ${
                      outOfStock ? "grayscale opacity-50 contrast-75" : "group-hover:scale-105"
                    }`}
                  />
                  {outOfStock && (
                    <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest bg-zinc-900/90 dark:bg-zinc-800/90 text-zinc-200 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold border border-zinc-700/60 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span>Rupture</span>
                    </span>
                  )}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                  {p.maison}
                </p>
                <h3 className={`font-serif text-xs sm:text-sm font-medium truncate mt-0.5 ${
                  outOfStock ? "text-muted-foreground" : "text-foreground"
                }`}>
                  {p.name}
                </h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                  <span className={`text-xs font-serif font-bold ${
                    outOfStock ? "text-muted-foreground line-through opacity-70" : "text-primary"
                  }`}>
                    {outOfStock
                      ? "Rupture de stock"
                      : isFull
                      ? formatMAD(p.full_bottle_price ?? 0)
                      : `À partir de ${formatMAD(p.price_5ml)}`}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border/50">
                    {p.gender}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RelatedProducts;
