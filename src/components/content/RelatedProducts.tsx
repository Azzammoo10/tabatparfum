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
    <section className="w-full mt-16 sm:mt-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-end justify-between mb-6 sm:mb-8 border-b border-border/60 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-1 font-medium">
            Trouvez tout ce que vous voulez {maison ? `• ${maison}` : ""}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-foreground">
            Produits apparentés
          </h2>
        </div>
        <Link
          to="/collection/all"
          className="text-[11px] sm:text-xs uppercase tracking-widest text-primary hover:text-primary-hover border-b border-primary/40 pb-0.5"
        >
          Voir la collection
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="aspect-[4/5] bg-muted rounded-xl" />
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {related.map((p) => (
            <Link
              key={p.id}
              to={`/parfum/${p.id}`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group block bg-card/40 border border-border/60 rounded-2xl p-3 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <ProductImage
                src={p.image_url}
                alt={p.name}
                label={p.image_label}
                aspect="aspect-[4/5]"
                fitMode="contain"
                className="max-h-48 sm:max-h-56 mx-auto mb-2"
              />
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                {p.maison}
              </p>
              <h3 className="font-serif text-xs sm:text-sm text-foreground font-medium truncate mt-0.5">
                {p.name}
              </h3>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                <span className="text-xs font-semibold text-primary font-mono">
                  À partir de {formatMAD(p.price_5ml)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border/50">
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

export default RelatedProducts;
