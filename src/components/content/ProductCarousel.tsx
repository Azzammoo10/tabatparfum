import { Link } from "react-router-dom";
import ProductImage from "@/components/ui/ProductImage";
import { useParfums } from "@/hooks/useParfums";
import { formatMAD } from "@/lib/sizes";

const ProductCarousel = () => {
  const { data: rawFeatured, loading } = useParfums({ isBestseller: true });
  const featured = rawFeatured.slice(0, 4);

  return (
    <section className="w-full mb-16 sm:mb-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-1 font-medium">Incontournables</p>
          <h2 className="font-serif text-2xl sm:text-4xl text-foreground">Nos Meilleures Ventes</h2>
        </div>
        <Link
          to="/collection/all"
          className="text-[11px] sm:text-xs uppercase tracking-widest text-primary hover:text-primary-hover border-b border-primary/40 pb-0.5"
        >
          Voir tout
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted mb-3 rounded-md" />
              <div className="h-3 w-20 bg-muted mb-2 rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featured.map((p) => (
            <Link key={p.id} to={`/parfum/${p.id}`} className="block group">
              <ProductImage src={p.image_url} alt={p.name} label={p.image_label} className="mb-2.5 sm:mb-3 group-hover:opacity-90 transition-opacity" />
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                {p.maison}
              </p>
              <h3 className="font-serif text-sm sm:text-lg text-foreground mt-0.5 sm:mt-1 truncate font-medium">{p.name}</h3>
              <div className="flex items-center justify-between mt-2 pt-1 border-t sm:border-t-0 border-border/30">
                <span className="text-xs sm:text-sm font-serif font-semibold text-primary">
                  À partir de {formatMAD(p.price_5ml)}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-primary border border-primary/40 px-1.5 sm:px-2 py-0.5 rounded-sm">
                  {p.gender}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductCarousel;
