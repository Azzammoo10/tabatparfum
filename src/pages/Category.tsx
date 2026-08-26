import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductImage from "@/components/ui/ProductImage";
import Seo from "@/components/Seo";
import { useParfums } from "@/hooks/useParfums";
import { formatMAD } from "@/lib/sizes";
import { Sparkles, User, Heart, ShieldCheck, Package, Flame, Grid, ChevronDown, Check } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type FilterKey = "Toutes" | "Homme" | "Femme" | "Déodorants Stick" | "Les Packs" | "Nouveautés";

interface FilterOption {
  key: FilterKey;
  label: string;
  shortLabel: string;
  icon: any;
  isGold?: boolean;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: "Toutes", label: "Toutes les Collections", shortLabel: "Toutes", icon: Grid },
  { key: "Homme", label: "Parfums Homme", shortLabel: "Homme", icon: User },
  { key: "Femme", label: "Parfums Femme", shortLabel: "Femme", icon: Heart },
  { key: "Déodorants Stick", label: "Déodorants Stick", shortLabel: "Déodorants", icon: ShieldCheck },
  { key: "Les Packs", label: "Les Packs Premium", shortLabel: "Les Packs", icon: Package, isGold: true },
];

const slugToFilter = (slug: string | undefined): FilterKey => {
  if (!slug) return "Toutes";
  const s = slug.toLowerCase();
  if (s === "homme" || s === "parfums-homme") return "Homme";
  if (s === "femme" || s === "parfums-femme") return "Femme";
  if (s.includes("deodorant") || s.includes("déodorant")) return "Déodorants Stick";
  if (s.includes("pack")) return "Les Packs";
  if (s === "nouveautes" || s === "nouveautés") return "Nouveautés";
  return "Toutes";
};

const filterToSlug = (key: FilterKey): string => {
  switch (key) {
    case "Homme": return "homme";
    case "Femme": return "femme";
    case "Déodorants Stick": return "deodorants-stick";
    case "Les Packs": return "packs";
    default: return "all";
  }
};

const collectionTitle = (filter: FilterKey) => {
  switch (filter) {
    case "Homme": return "Parfums Homme";
    case "Femme": return "Parfums Femme";
    case "Déodorants Stick": return "Déodorants Stick";
    case "Les Packs": return "LES PACKS";
    default: return "Toutes les Collections";
  }
};

const Collection = () => {
  const { collection } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>(slugToFilter(collection));
  const [isMobileSelectOpen, setIsMobileSelectOpen] = useState(false);
  const { data: parfums, loading, error } = useParfums();

  useEffect(() => {
    setFilter(slugToFilter(collection));
  }, [collection]);

  const handleFilterClick = (key: FilterKey) => {
    setFilter(key);
    setIsMobileSelectOpen(false);
    navigate(`/collection/${filterToSlug(key)}`);
  };

  const filtered = useMemo(() => {
    return parfums.filter((p) => {
      if (filter === "Toutes") return true;
      if (filter === "Homme") return p.category === "homme";
      if (filter === "Femme") return p.category === "femme";
      if (filter === "Déodorants Stick") return p.category === "deodorants-stick" || p.id.includes("old-spice");
      if (filter === "Les Packs") return p.category === "packs" || p.id.includes("pack");
      return true;
    });
  }, [filter, parfums]);

  // Compute counts for each filter
  const counts = useMemo(() => {
    const map: Record<FilterKey, number> = {
      Toutes: parfums.length,
      Homme: parfums.filter((p) => p.category === "homme").length,
      Femme: parfums.filter((p) => p.category === "femme").length,
      "Déodorants Stick": parfums.filter((p) => p.category === "deodorants-stick" || p.id.includes("old-spice")).length,
      "Les Packs": parfums.filter((p) => p.category === "packs" || p.id.includes("pack")).length,
      "Nouveautés": parfums.filter((p) => p.is_new).length,
    };
    return map;
  }, [parfums]);

  const currentOption = FILTER_OPTIONS.find((o) => o.key === filter) || FILTER_OPTIONS[0];
  const CurrentIcon = currentOption.icon;

  const title = `${collectionTitle(filter)} — TABAT`;
  const description = `Découvrez la collection ${collectionTitle(filter)} chez TABAT. Produits 100% originaux, livraison 24-48h partout au Maroc.`;
  const canonical = `/collection/${(collection ?? "all").toLowerCase()}`;
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collectionTitle(filter),
    url: canonical,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: filtered.length,
      itemListElement: filtered.slice(0, 20).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `/parfum/${p.id}`,
        name: `${p.maison} — ${p.name}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo title={title} description={description} path={canonical} jsonLd={itemListLd} />
      <Header />

      <main className="flex-1 pt-3 pb-16">
        {/* Header Breadcrumb & Title */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-3 sm:mb-6">
          <Breadcrumb>
            <BreadcrumbList className="text-[10px] sm:text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-muted-foreground hover:text-primary">Accueil</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground font-medium">{collectionTitle(filter)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-primary font-bold block">
                Collection TABAT
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-foreground font-medium tracking-tight mt-0.5">
                {collectionTitle(filter)}
              </h1>
            </div>
            {!loading && (
              <span className="text-xs sm:text-sm font-mono text-muted-foreground bg-card border border-border/80 px-3 py-1 rounded-full">
                {filtered.length} produit{filtered.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </section>

        {/* ULTRA-COMPACT LUXURY FILTER CONTAINER */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-10">
          {/* MOBILE PHONE DESIGN: 1-LINE LUXURY DROPDOWN (Zero Wasted Vertical Space) */}
          <div className="md:hidden relative">
            <button
              type="button"
              onClick={() => setIsMobileSelectOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card border border-primary/40 text-foreground shadow-sm active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CurrentIcon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs uppercase tracking-wider font-semibold text-foreground truncate">
                  {currentOption.label}
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">
                  ({counts[filter] ?? 0})
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-primary font-medium uppercase tracking-wider">
                <span>Filtrer</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isMobileSelectOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            {/* Mobile Dropdown Menu Overlay */}
            {isMobileSelectOpen && (
              <>
                {/* Background Dimming Backdrop */}
                <div
                  className="fixed inset-0 bg-black/40 z-40"
                  onClick={() => setIsMobileSelectOpen(false)}
                />

                <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-primary/40 rounded-xl shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-200">
                  {FILTER_OPTIONS.map((item) => {
                    const active = item.key === filter;
                    const Icon = item.icon;
                    const count = counts[item.key] ?? 0;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleFilterClick(item.key)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                            : item.isGold
                            ? "text-primary hover:bg-primary/10"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${active ? "text-primary-foreground" : "text-primary"}`} />
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono opacity-80">({count})</span>
                          {active && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* DESKTOP DESIGN: LUXURY GLASS PILL BAR (Tablet & Desktop) */}
          <div className="hidden md:block bg-card/70 border border-border/80 rounded-2xl p-2 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {FILTER_OPTIONS.map((item) => {
                const active = item.key === filter;
                const Icon = item.icon;
                const count = counts[item.key] ?? 0;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleFilterClick(item.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 active:scale-[0.97] cursor-pointer ${
                      active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                        : item.isGold
                        ? "bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20"
                        : "bg-background/60 border border-border/60 text-foreground/80 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-primary-foreground" : "text-primary"}`} />
                    <span>{item.label}</span>
                    {count > 0 && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          active
                            ? "bg-black/20 text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-16">
          {error ? (
            <div className="text-center py-20 bg-card/40 border border-border rounded-2xl">
              <p className="text-sm text-destructive">Une erreur est survenue lors du chargement.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-xs uppercase tracking-widest text-primary border border-primary/40 px-5 py-2.5 rounded-full hover:bg-primary/10"
              >
                Réessayer
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="aspect-[4/5] bg-muted rounded-2xl" />
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <h2 className="sr-only">Liste des parfums</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {filtered.map((p) => {
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
                      className={`group block rounded-2xl p-2 sm:p-3 transition-all hover:bg-card/50 hover:shadow-sm relative text-left ${
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
                            outOfStock ? "grayscale opacity-50 contrast-75" : "group-hover:scale-105 group-hover:opacity-90"
                          }`}
                        />
                        {outOfStock && (
                          <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest bg-zinc-900/90 dark:bg-zinc-800/90 text-zinc-200 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold border border-zinc-700/60 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>Rupture</span>
                          </span>
                        )}
                        {p.is_new && !outOfStock && (
                          <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full font-semibold shadow-xs animate-badge-glow">
                            Nouveau
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

              {filtered.length === 0 && (
                <div className="text-center py-20 bg-card/40 border border-border rounded-2xl">
                  <p className="text-sm font-light text-muted-foreground">
                    Aucun parfum trouvé dans cette catégorie pour le moment.
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Collection;
