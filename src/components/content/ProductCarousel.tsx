import { Link } from "react-router-dom";
import ProductImage from "@/components/ui/ProductImage";
import { useParfums } from "@/hooks/useParfums";
import { formatMAD } from "@/lib/sizes";
import { Sparkles, ArrowRight, Flame } from "lucide-react";

const ProductCarousel = () => {
  const { data: rawFeatured, loading } = useParfums({ isBestseller: true });
  const featured = rawFeatured.slice(0, 4);

  return (
    <section className="w-full mb-16 sm:mb-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8 sm:mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span>Sélection Privilège</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-foreground font-bold tracking-tight">
            Nos Meilleures Ventes
          </h2>
        </div>
        <Link
          to="/collection/all"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:text-primary/80 font-bold border-b border-primary/40 pb-0.5 transition-colors group"
        >
          <span>Voir toute la collection</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-card/40 rounded-3xl p-4 border border-border/40">
              <div className="aspect-square bg-muted/60 mb-3 rounded-2xl" />
              <div className="h-3 w-20 bg-muted/60 mb-2 rounded" />
              <div className="h-4 w-32 bg-muted/60 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((p) => {
            const isFull = p.sale_mode === "full_bottle";
            const decantStock = (p.stock_5ml ?? 0) + (p.stock_10ml ?? 0);
            const outOfStock =
              !p.is_active ||
              p.stock_status === "rupture" ||
              (isFull ? (p.full_bottle_stock ?? 0) <= 0 : decantStock <= 0);

            return (
              <Link
                key={p.id}
                to={`/parfum/${p.id}`}
                className={`group block bg-card/60 backdrop-blur-md border border-border/80 rounded-3xl p-3.5 sm:p-4 hover:border-primary/50 transition-all duration-500 hover:shadow-xl ${
                  outOfStock ? "opacity-75" : ""
                }`}
              >
                <div className="relative mb-3 overflow-hidden rounded-2xl bg-muted/30 aspect-square">
                  <ProductImage
                    src={p.image_url}
                    alt={p.name}
                    label={p.image_label}
                    fitMode="cover"
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      outOfStock ? "grayscale opacity-50 contrast-75" : "group-hover:scale-106"
                    }`}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    {outOfStock ? (
                      <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest bg-black/80 text-destructive-foreground backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold border border-destructive/40 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>Rupture</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest bg-primary text-primary-foreground font-bold px-2.5 py-0.5 rounded-full shadow-md">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Bestseller</span>
                      </span>
                    )}

                    <span className="text-[9px] uppercase tracking-widest text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 font-medium">
                      {p.gender}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate font-semibold">
                  {p.maison}
                </p>
                <h3 className={`font-serif text-sm sm:text-base mt-0.5 truncate font-bold ${
                  outOfStock ? "text-muted-foreground" : "text-foreground group-hover:text-primary transition-colors"
                }`}>
                  {p.name}
                </h3>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/50">
                  <span className={`text-xs sm:text-sm font-serif font-bold ${
                    outOfStock ? "text-muted-foreground line-through opacity-70" : "text-primary"
                  }`}>
                    {outOfStock
                      ? "Rupture"
                      : isFull
                      ? formatMAD(p.full_bottle_price ?? 0)
                      : `Dès ${formatMAD(p.price_5ml)}`}
                  </span>

                  <span className="text-[10px] text-muted-foreground font-mono">
                    {isFull ? "Flacon" : "5ml / 10ml"}
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

export default ProductCarousel;
