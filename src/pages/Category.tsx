import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductImage from "@/components/ui/ProductImage";
import Seo from "@/components/Seo";
import { useParfums } from "@/hooks/useParfums";
import { formatMAD } from "@/lib/sizes";
import {
  Sparkles,
  Flame,
  Flower2,
  ShieldCheck,
  Package,
  Grid,
  ChevronDown,
  Check,
  ArrowUpDown,
  Search,
  Truck,
  Shield,
  Award,
  Crown,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type FilterKey = "Toutes" | "Homme" | "Femme" | "Déodorants Stick" | "Les Packs";
type SortOption = "featured" | "price_asc" | "price_desc" | "newest" | "name_asc";

interface FilterOption {
  key: FilterKey;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  isGold?: boolean;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: "Toutes", label: "Toutes les Collections", shortLabel: "Toutes", icon: Grid },
  { key: "Homme", label: "Parfums Homme", shortLabel: "Homme", icon: Flame },
  { key: "Femme", label: "Parfums Femme", shortLabel: "Femme", icon: Flower2 },
  { key: "Déodorants Stick", label: "Déodorants Stick", shortLabel: "Déodorants", icon: ShieldCheck },
  { key: "Les Packs", label: "Les Packs Premium", shortLabel: "Les Packs", icon: Crown, isGold: true },
];

const slugToFilter = (slug: string | undefined): FilterKey => {
  if (!slug) return "Toutes";
  const s = slug.toLowerCase();
  if (s === "homme" || s === "parfums-homme") return "Homme";
  if (s === "femme" || s === "parfums-femme") return "Femme";
  if (s.includes("deodorant") || s.includes("déodorant")) return "Déodorants Stick";
  if (s.includes("pack")) return "Les Packs";
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

const collectionHeroInfo = (filter: FilterKey) => {
  switch (filter) {
    case "Homme":
      return {
        title: "Parfums Homme",
        subtitle: "Haute Parfumerie Masculine",
        description:
          "Une sélection d'exception de fragrances masculines : sillages boisés, ambrés, cuirés et orientaux des plus grandes maisons, décantés artisanalement en flacons stérilisés.",
        badge: "Sélection Pour Homme",
      };
    case "Femme":
      return {
        title: "Parfums Femme",
        subtitle: "Haute Parfumerie Féminine",
        description:
          "Des créations olfactives envoûtantes aux accords floraux, gourmands et poudrés pour révéler votre signature avec élégance et distinction.",
        badge: "Sélection Pour Femme",
      };
    case "Déodorants Stick":
      return {
        title: "Déodorants Stick",
        subtitle: "Soin & Fraîcheur Longue Durée",
        description:
          "La sélection officielle des déodorants en stick haute efficacité, apportant confort et fraîcheur absolue tout au long de la journée.",
        badge: "Protection 48h",
      };
    case "Les Packs":
      return {
        title: "Les Packs & Coffrets",
        subtitle: "Offres Signatures Exclusives",
        description:
          "Découvrez nos coffrets thématiques et nos duos/trios d'exception pour explorer plusieurs univers olfactifs à prix privilégié.",
        badge: "Offres Limitées",
      };
    default:
      return {
        title: "Toutes les Collections",
        subtitle: "Maison de Haute Parfumerie",
        description:
          "Explorez l'ensemble de notre catalogue de parfums rares, décants d'exception et soins d'hygiène de luxe livrés chez vous au Maroc.",
        badge: "Catalogue Officiel",
      };
  }
};

const Collection = () => {
  const { collection } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>(slugToFilter(collection));
  const [isMobileSelectOpen, setIsMobileSelectOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [localSearch, setLocalSearch] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);

  const { data: parfums, loading, error } = useParfums();

  useEffect(() => {
    setFilter(slugToFilter(collection));
  }, [collection]);

  const handleFilterClick = (key: FilterKey) => {
    setFilter(key);
    setIsMobileSelectOpen(false);
    navigate(`/collection/${filterToSlug(key)}`);
  };

  const hero = collectionHeroInfo(filter);

  // Filter and sort products
  const filteredAndSorted = useMemo(() => {
    let list = parfums.filter((p) => {
      // Category filter
      if (filter === "Homme" && p.category !== "homme") return false;
      if (filter === "Femme" && p.category !== "femme") return false;
      if (filter === "Déodorants Stick" && p.category !== "deodorants-stick" && !p.id.includes("old-spice")) return false;
      if (filter === "Les Packs" && p.category !== "packs" && !p.id.includes("pack")) return false;

      // In stock filter
      if (onlyInStock) {
        const isFull = p.sale_mode === "full_bottle";
        const decantStock = (p.stock_5ml ?? 0) + (p.stock_10ml ?? 0);
        const outOfStock =
          !p.is_active ||
          p.stock_status === "rupture" ||
          (isFull ? (p.full_bottle_stock ?? 0) <= 0 : decantStock <= 0);
        if (outOfStock) return false;
      }

      // Local search query
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchMaison = p.maison.toLowerCase().includes(q);
        if (!matchName && !matchMaison) return false;
      }

      return true;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      const priceA = a.sale_mode === "full_bottle" ? (a.full_bottle_price ?? 0) : a.price_5ml;
      const priceB = b.sale_mode === "full_bottle" ? (b.full_bottle_price ?? 0) : b.price_5ml;

      if (sortBy === "price_asc") return priceA - priceB;
      if (sortBy === "price_desc") return priceB - priceA;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "newest") return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
      // default "featured": bestsellers and active first
      return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0);
    });

    return list;
  }, [filter, parfums, onlyInStock, localSearch, sortBy]);

  // Compute counts for each filter
  const counts = useMemo(() => {
    const map: Record<FilterKey, number> = {
      Toutes: parfums.length,
      Homme: parfums.filter((p) => p.category === "homme").length,
      Femme: parfums.filter((p) => p.category === "femme").length,
      "Déodorants Stick": parfums.filter((p) => p.category === "deodorants-stick" || p.id.includes("old-spice")).length,
      "Les Packs": parfums.filter((p) => p.category === "packs" || p.id.includes("pack")).length,
    };
    return map;
  }, [parfums]);

  const currentOption = FILTER_OPTIONS.find((o) => o.key === filter) || FILTER_OPTIONS[0];
  const CurrentIcon = currentOption.icon;

  const title = `${hero.title} — TABAT`;
  const description = `${hero.description} Produits 100% originaux, livraison 24-48h partout au Maroc.`;
  const canonical = `/collection/${(collection ?? "all").toLowerCase()}`;

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <Seo title={title} description={description} path={canonical} />
      <Header />

      <main className="flex-1 pb-16">
        {/* Luxury Category Hero Section */}
        <section className="relative w-full border-b border-border/70 bg-gradient-to-b from-card/60 via-card/30 to-background pt-4 pb-8 sm:pb-12 px-4 sm:px-6 overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 space-y-4">
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList className="text-[10px] sm:text-xs">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Accueil</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium">{hero.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header Content */}
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>{hero.badge}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground font-bold tracking-tight">
                {hero.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light pt-1">
                {hero.description}
              </p>
            </div>

            {/* Trust Reassurance Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card/60 border border-border/60 text-xs">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[11px] font-medium text-foreground">100% Originaux</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card/60 border border-border/60 text-xs">
                <Award className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[11px] font-medium text-foreground">Décants 5ml / 10ml</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card/60 border border-border/60 text-xs">
                <Truck className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[11px] font-medium text-foreground">Livraison 24–48h Maroc</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card/60 border border-border/60 text-xs">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[11px] font-medium text-foreground">Paiement à la réception</span>
              </div>
            </div>
          </div>
        </section>

        {/* Collection Selector & Filter Navigation */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 mb-4 sm:mb-6">
          {/* Mobile Collection Dropdown */}
          <div className="md:hidden relative mb-3">
            <button
              type="button"
              onClick={() => setIsMobileSelectOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-card border border-border shadow-xs text-foreground active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CurrentIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs uppercase tracking-wider font-semibold text-foreground truncate">
                  {currentOption.label}
                </span>
                <span className="text-xs font-serif font-bold text-primary">
                  ({counts[filter] ?? 0})
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                <span>Changer</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileSelectOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            {isMobileSelectOpen && (
              <>
                <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsMobileSelectOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {FILTER_OPTIONS.map((item) => {
                    const active = item.key === filter;
                    const Icon = item.icon;
                    const count = counts[item.key] ?? 0;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleFilterClick(item.key)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer ${
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
                          <span className="text-xs font-serif font-bold opacity-90">({count})</span>
                          {active && <Check className="w-4 h-4 text-primary-foreground" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Desktop Collection Pills Bar */}
          <div className="hidden md:flex items-center justify-center gap-2 p-1.5 rounded-full bg-card/80 border border-border/80 backdrop-blur-md shadow-xs max-w-fit mx-auto mb-6">
            {FILTER_OPTIONS.map((item) => {
              const active = item.key === filter;
              const Icon = item.icon;
              const count = counts[item.key] ?? 0;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleFilterClick(item.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                      : item.isGold
                      ? "text-primary hover:bg-primary/10"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-primary-foreground" : "text-primary"}`} />
                  <span>{item.label}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-serif font-bold px-1.5 py-0.2 rounded-full ${
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

          {/* Search, Filter Bar & Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/60 border border-border rounded-2xl p-3 shadow-xs">
            {/* Quick in-page search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={`Rechercher dans ${hero.title}...`}
                className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Sort & In Stock Filters */}
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background border border-border text-foreground cursor-pointer select-none text-[11px]">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                />
                <span>En stock uniquement</span>
              </label>

              <div className="flex items-center gap-1 bg-background border border-border rounded-xl px-2.5 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-primary shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-[11px] font-medium text-foreground outline-none cursor-pointer pr-1"
                >
                  <option value="featured" className="bg-card text-foreground">Recommandés</option>
                  <option value="price_asc" className="bg-card text-foreground">Prix croissant</option>
                  <option value="price_desc" className="bg-card text-foreground">Prix décroissant</option>
                  <option value="newest" className="bg-card text-foreground">Nouveautés</option>
                  <option value="name_asc" className="bg-card text-foreground">Nom (A–Z)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-2">
          {error ? (
            <div className="text-center py-20 bg-card/40 border border-border rounded-3xl p-6">
              <p className="text-sm text-destructive">Une erreur est survenue lors du chargement des parfums.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-xs uppercase tracking-widest text-primary border border-primary/40 px-5 py-2.5 rounded-full hover:bg-primary/10 cursor-pointer"
              >
                Réessayer
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-3 bg-card/40 border border-border/60 rounded-2xl p-3">
                  <div className="aspect-[4/5] bg-muted/60 rounded-xl" />
                  <div className="h-3 w-20 bg-muted/80 rounded" />
                  <div className="h-4 w-32 bg-muted/80 rounded" />
                  <div className="h-4 w-16 bg-muted/80 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pb-3">
                <span>{filteredAndSorted.length} référence{filteredAndSorted.length > 1 ? "s" : ""} disponible{filteredAndSorted.length > 1 ? "s" : ""}</span>
                {localSearch && (
                  <button onClick={() => setLocalSearch("")} className="text-primary hover:underline text-[11px]">
                    Effacer la recherche
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredAndSorted.map((p) => {
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
                      className={`group block rounded-2xl bg-card/70 border border-border/80 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 p-3 transition-all duration-300 relative text-left ${
                        outOfStock ? "opacity-75" : ""
                      }`}
                    >
                      {/* Product Visual Container */}
                      <div className="relative mb-3 overflow-hidden rounded-xl aspect-square w-full bg-card/20">
                        <ProductImage
                          src={p.image_url}
                          alt={p.name}
                          label={p.image_label}
                          aspect="aspect-square"
                          fitMode="cover"
                          className={`w-full h-full transition-all duration-500 ${
                            outOfStock ? "grayscale opacity-50 contrast-75" : "group-hover:scale-108 group-hover:opacity-95"
                          }`}
                        />

                        {/* Status Badges */}
                        {outOfStock && (
                          <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest bg-zinc-950/90 text-zinc-200 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold border border-zinc-700/60 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>Rupture</span>
                          </span>
                        )}
                        {p.is_bestseller && !outOfStock && (
                          <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                            Bestseller
                          </span>
                        )}
                        {p.is_new && !p.is_bestseller && !outOfStock && (
                          <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                            Nouveau
                          </span>
                        )}

                        {/* Format badges preview */}
                        {!isFull && !outOfStock && (
                          <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                            <span className="text-[8px] font-bold uppercase tracking-wider bg-background/90 backdrop-blur-md text-foreground px-1.5 py-0.5 rounded border border-border/60 shadow-xs">
                              5ml
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-wider bg-background/90 backdrop-blur-md text-foreground px-1.5 py-0.5 rounded border border-border/60 shadow-xs">
                              10ml
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Maison & Name */}
                      <p className="text-[10px] uppercase tracking-widest font-semibold text-primary/90 truncate">
                        {p.maison}
                      </p>
                      <h3 className={`font-serif text-xs sm:text-sm font-bold truncate mt-0.5 transition-colors ${
                        outOfStock ? "text-muted-foreground" : "text-foreground group-hover:text-primary"
                      }`}>
                        {p.name}
                      </h3>

                      {/* Olfactory notes quick preview if exists */}
                      {p.notes_tete && p.notes_tete.length > 0 && (
                        <p className="text-[10px] text-muted-foreground/80 truncate mt-0.5 font-light">
                          {p.notes_tete.join(" · ")}
                        </p>
                      )}

                      {/* Price & Action */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/50">
                        <div>
                          <span className="text-[9px] text-muted-foreground uppercase block">
                            {isFull ? "Flacon entier" : "À partir de"}
                          </span>
                          <span className={`text-sm font-serif font-bold block ${
                            outOfStock ? "text-muted-foreground line-through opacity-70" : "text-primary"
                          }`}>
                            {outOfStock
                              ? "Épuisé"
                              : isFull
                              ? formatMAD(p.full_bottle_price ?? 0)
                              : formatMAD(p.price_5ml)}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground group-hover:text-primary transition-colors bg-secondary/80 group-hover:bg-primary/10 px-2.5 py-1 rounded-lg border border-border/60">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Découvrir</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {filteredAndSorted.length === 0 && (
                <div className="text-center py-20 bg-card/40 border border-border rounded-3xl p-8 max-w-md mx-auto space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Aucun parfum trouvé pour vos critères de recherche.
                  </p>
                  <button
                    onClick={() => {
                      setLocalSearch("");
                      setOnlyInStock(false);
                    }}
                    className="text-xs uppercase tracking-wider font-semibold text-primary border border-primary/30 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
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
