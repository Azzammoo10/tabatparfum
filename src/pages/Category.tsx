import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductImage from "@/components/ui/ProductImage";
import Seo from "@/components/Seo";
import { useParfums } from "@/hooks/useParfums";
import { formatMAD } from "@/lib/sizes";
import type { Gender } from "@/types/database";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type FilterKey = "Toutes" | "Homme" | "Femme" | "Déodorants Stick" | "Les Packs" | "Nouveautés";
const FILTERS: FilterKey[] = ["Toutes", "Homme", "Femme", "Déodorants Stick", "Les Packs", "Nouveautés"];

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

const collectionTitle = (filter: FilterKey) => {
  switch (filter) {
    case "Homme": return "Parfums Homme";
    case "Femme": return "Parfums Femme";
    case "Déodorants Stick": return "Déodorants Stick";
    case "Les Packs": return "LES PACKS";
    case "Nouveautés": return "Nouveautés";
    default: return "Toutes les Collections";
  }
};

const Collection = () => {
  const { collection } = useParams();
  const [filter, setFilter] = useState<FilterKey>(slugToFilter(collection));
  const { data: parfums, loading, error } = useParfums();

  useEffect(() => {
    setFilter(slugToFilter(collection));
  }, [collection]);

  const filtered = useMemo(() => {
    return parfums.filter((p) => {
      if (filter === "Toutes") return true;
      if (filter === "Nouveautés") return p.is_new;
      if (filter === "Homme") return p.category === "homme";
      if (filter === "Femme") return p.category === "femme";
      if (filter === "Déodorants Stick") return p.category === "deodorants-stick" || p.id.includes("old-spice");
      if (filter === "Les Packs") return p.category === "packs" || p.id.includes("pack");
      return true;
    });
  }, [filter, parfums]);

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
    <div className="min-h-screen bg-background">
      <Seo title={title} description={description} path={canonical} jsonLd={itemListLd} />
      <Header />

      <main className="pt-6">
        <section className="w-full px-6 mb-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-muted-foreground hover:text-primary">Accueil</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">{collectionTitle(filter)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="font-serif text-4xl md:text-5xl text-foreground mt-6">
            {collectionTitle(filter)}
          </h1>
          {!loading && (
            <p className="text-sm font-light text-muted-foreground mt-2">
              {filtered.length} parfum{filtered.length > 1 ? "s" : ""}
            </p>
          )}
        </section>

        <section className="w-full px-6 mb-10">
          <div className="flex flex-wrap gap-3 border-b border-border pb-6">
            {FILTERS.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest border transition-all ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground/70 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </section>

        <section className="w-full px-6 mb-16">
          {error ? (
            <div className="text-center py-20">
              <p className="text-sm text-destructive">Une erreur est survenue lors du chargement.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-xs uppercase tracking-widest text-primary border border-primary/40 px-4 py-2 hover:bg-primary/10"
              >
                Réessayer
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted mb-4" />
                  <div className="h-3 w-24 bg-muted mb-2" />
                  <div className="h-5 w-40 bg-muted mb-2" />
                  <div className="h-3 w-28 bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <h2 className="sr-only">Liste des parfums</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {filtered.map((p) => {
                  const outOfStock = !p.is_active || p.stock_status === "rupture";
                  const isFull = p.sale_mode === "full_bottle";
                  return (
                    <Link key={p.id} to={`/parfum/${p.id}`} className="group block relative">
                      <div className="relative">
                        <ProductImage
                          src={p.image_url}
                          alt={p.name}
                          label={p.image_label}
                          className={`mb-4 transition-opacity ${outOfStock ? "opacity-40" : "group-hover:opacity-90"}`}
                        />
                        {outOfStock && (
                          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-destructive text-destructive-foreground px-2 py-1 rounded-sm">
                            Rupture de stock
                          </span>
                        )}
                        {p.is_new && !outOfStock && (
                          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1 rounded-sm">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                            {p.maison}
                          </p>
                          <h3 className="font-serif text-lg text-foreground mt-1 truncate">{p.name}</h3>
                          <p className="text-sm font-light text-foreground/70 mt-1">
                            {outOfStock
                              ? "Indisponible"
                              : isFull
                              ? formatMAD(p.full_bottle_price ?? 0)
                              : `À partir de ${formatMAD(p.price_5ml)}`}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-primary border border-primary/40 px-2 py-0.5 rounded-sm shrink-0">
                          {p.gender}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <p className="text-center text-sm font-light text-muted-foreground py-20">
                  Aucun parfum trouvé dans cette catégorie pour le moment.
                </p>
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
