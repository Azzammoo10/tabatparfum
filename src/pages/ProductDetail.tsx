import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductImage from "@/components/ui/ProductImage";
import RelatedProducts from "@/components/content/RelatedProducts";
import ExpressOrderForm from "@/components/content/ExpressOrderForm";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShieldCheck, Truck, ArrowLeft, ShoppingBag, Check, Sparkles } from "lucide-react";
import { useParfum } from "@/hooks/useParfums";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { SIZES, SIZE_META, formatMAD, priceFor } from "@/lib/sizes";
const AVAILABLE_SIZES = SIZES.filter((s) => s !== "20ml" && s !== "full");
import type { Size } from "@/types/database";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ParfumDetail = () => {
  const { parfumId } = useParams();
  const navigate = useNavigate();
  const { data: parfum, loading, error } = useParfum(parfumId);

  const [size, setSize] = useState<Size>("10ml");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-4 px-4 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-pulse">
            <div className="md:col-span-5 h-56 bg-muted rounded-2xl max-w-xs mx-auto w-full" />
            <div className="md:col-span-7 space-y-4">
              <div className="h-3 w-28 bg-muted rounded" />
              <div className="h-7 w-3/4 bg-muted rounded" />
              <div className="h-16 bg-muted rounded-xl" />
              <div className="h-12 bg-muted rounded-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !parfum) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
          <h1 className="font-serif text-2xl mb-3">Parfum introuvable</h1>
          {error && <p className="text-xs text-destructive mb-6">{error}</p>}
          <Button
            onClick={() => navigate("/collection/all")}
            className="rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-wider px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voir la collection
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const isFullBottle = parfum.sale_mode === "full_bottle";
  const effectiveSize: Size = isFullBottle ? "full" : size;
  const unitPrice = priceFor(parfum, effectiveSize);
  const total = unitPrice * quantity;
  const fullStock = parfum.full_bottle_stock ?? 0;
  const outOfStock =
    !parfum.is_active ||
    parfum.stock_status === "rupture" ||
    (isFullBottle && fullStock <= 0);

  const handleAddToCart = () => {
    addItem({
      id: parfum.id,
      name: parfum.name,
      maison: parfum.maison,
      size: effectiveSize,
      quantity,
      price: unitPrice,
      imageLabel: parfum.image_label,
    });
    toast.success("Ajouté au panier", {
      description: `${parfum.name} — ${SIZE_META[effectiveSize].label} × ${quantity}`,
    });
  };

  const seoTitle = `${parfum.name} — ${parfum.maison} | TABAT`.slice(0, 70);
  const seoDescription = (
    parfum.description?.trim() ||
    `Produit authentique ${parfum.maison} ${parfum.name}, disponible chez TABAT au Maroc.`
  ).slice(0, 160);
  const canonical = `/parfum/${parfum.id}`;
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: parfum.name,
    brand: { "@type": "Brand", name: parfum.maison },
    description: parfum.description || undefined,
    image: parfum.image_url || undefined,
    category: parfum.gender,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "MAD",
      lowPrice: parfum.price_5ml,
      highPrice: parfum.price_10ml,
      availability: outOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={canonical}
        ogType="product"
        jsonLd={productLd}
      />
      <Header />

      <main className="flex-1 pt-2 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-2 sm:mb-4">
            <Breadcrumb>
              <BreadcrumbList className="text-[10px] sm:text-xs">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="text-muted-foreground hover:text-primary">
                      Accueil
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to={`/collection/${parfum.gender.toLowerCase()}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {parfum.gender}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium truncate max-w-[130px] sm:max-w-xs">
                    {parfum.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Product Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-8 items-start">
            {/* LEFT COLUMN: Main Image + Animated Flacon Size Badge */}
            <div className="md:col-span-5 w-full md:sticky md:top-24">
              <div className="relative max-w-[220px] sm:max-w-[260px] md:max-w-none mx-auto group">
                <ProductImage
                  src={parfum.image_url}
                  alt={parfum.name}
                  label={parfum.image_label}
                  aspect="aspect-[4/5]"
                  fitMode="contain"
                  className="max-h-[220px] sm:max-h-[300px] md:max-h-[360px] mx-auto"
                />

                {/* ANIMATED REALISTIC FLACON BADGE ON THE RIGHT */}
                {!isFullBottle && (
                  <div
                    key={size}
                    className="absolute top-2 right-0 sm:-right-2 z-20 bg-background/95 dark:bg-black/90 backdrop-blur-md border border-primary/50 rounded-2xl p-3 shadow-xl animate-in zoom-in-95 fade-in slide-in-from-right-3 duration-300 flex flex-col items-center gap-2 min-w-[76px]"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                        {size}
                      </span>
                      <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    </div>

                    {/* Glass Spray Bottle Illustration */}
                    <div className="flex flex-col items-center py-1">
                      {/* Capuchon Spray Noir */}
                      <div
                        className="rounded-t-[3px] shadow-sm relative"
                        style={{
                          width: "18px",
                          height: size === "10ml" ? "24px" : "18px",
                          background: "linear-gradient(180deg, #111111 0%, #333333 40%, #0a0a0a 100%)",
                        }}
                      >
                        <div className="absolute inset-x-0.5 top-0.5 bottom-0.5 flex flex-col justify-between opacity-40">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-px bg-white/60" />
                          ))}
                        </div>
                      </div>

                      {/* Corps en Verre Transparent avec Tube Spray */}
                      <div
                        className="border-x-2 border-b-2 border-primary/80 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/15 rounded-b-[4px] relative shadow-inner"
                        style={{
                          width: "16px",
                          height: size === "10ml" ? "96px" : "60px",
                        }}
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-[92%] bg-foreground/50" />
                        <div className="absolute top-1 left-0.5 w-0.5 h-[75%] bg-white/70 blur-[0.5px]" />
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-[9px] text-muted-foreground font-mono font-semibold">
                        {size === "10ml" ? "120 mm × 14 mm" : "75 mm × 14 mm"}
                      </p>
                      <p className="text-[8px] text-primary font-bold mt-0.5">
                        {size === "10ml" ? "≈ 130 pulvérisations" : "≈ 65 pulvérisations"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Trust Badges */}
              <div className="hidden sm:grid grid-cols-2 gap-2 mt-3 text-[10px] text-muted-foreground text-center">
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-card border border-border/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>100% Authentique</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-card border border-border/60">
                  <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Livraison 24–48h Maroc</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Controls */}
            <div className="md:col-span-7 space-y-3 sm:space-y-4">
              {/* Header Info */}
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold block">
                  {parfum.maison}
                </span>
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-foreground font-medium leading-tight">
                    {parfum.name}
                  </h1>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border/60 font-medium">
                    {parfum.gender}
                  </span>
                  {parfum.is_new && (
                    <span className="text-[9px] uppercase tracking-wider text-primary-foreground bg-primary px-2 py-0.5 rounded-full font-medium">
                      Nouveau
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {parfum.description && (
                <p className="text-xs font-light text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {parfum.description}
                </p>
              )}

              {/* Size Selector Cards */}
              {isFullBottle ? (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Présentation
                  </span>
                  <div className="border border-primary/30 bg-primary/5 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-serif text-sm text-primary font-semibold">Flacon d'origine scellé</p>
                      <p className="text-[11px] text-muted-foreground">{parfum.full_bottle_volume_ml ?? "—"} ml</p>
                    </div>
                    <p className="text-lg font-serif font-bold text-foreground">{formatMAD(unitPrice)}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Format de Décant
                    </span>
                    <span className="text-[10px] text-primary font-semibold">
                      {size === "5ml" ? "≈ 65 pulvérisations" : "≈ 130 pulvérisations"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_SIZES.map((s) => {
                      const meta = SIZE_META[s];
                      const selected = size === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.98] ${
                            selected
                              ? "border-primary bg-primary/10 text-primary shadow-xs font-medium"
                              : "border-border/80 bg-card hover:border-primary/40 text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {selected && (
                                <span className="w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5" />
                                </span>
                              )}
                              <span className={`font-serif text-sm font-semibold truncate ${selected ? "text-primary" : "text-foreground"}`}>
                                {meta.label}
                              </span>
                            </div>
                            <span className={`text-xs font-bold font-mono shrink-0 ${selected ? "text-primary" : "text-foreground"}`}>
                              {formatMAD(priceFor(parfum, s))}
                            </span>
                          </div>
                          <span className="text-[9px] text-muted-foreground block mt-1">
                            {meta.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Price Box */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/80">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                    Quantité
                  </p>
                  <div className="flex items-center border border-border rounded-full bg-background px-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-6 w-6 flex items-center justify-center text-foreground hover:text-primary"
                      aria-label="Diminuer"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-6 text-center text-xs font-semibold text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="h-6 w-6 flex items-center justify-center text-foreground hover:text-primary"
                      aria-label="Augmenter"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                    Prix Total
                  </p>
                  <p className="text-xl font-serif font-bold text-primary">
                    {formatMAD(total)}
                  </p>
                </div>
              </div>

              {/* Main Add to Cart Button */}
              {outOfStock ? (
                <Button
                  disabled
                  className="w-full h-11 rounded-full bg-muted text-muted-foreground uppercase tracking-widest text-xs font-medium cursor-not-allowed"
                >
                  Rupture de Stock
                </Button>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover uppercase tracking-[0.2em] text-xs font-semibold shadow-md hover:scale-[1.01] transition-all gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Ajouter au Panier
                </Button>
              )}

              {/* Express WhatsApp Order Form */}
              {!outOfStock && (
                <ExpressOrderForm
                  parfumName={parfum.name}
                  maison={parfum.maison}
                  sizeLabel={SIZE_META[effectiveSize].label}
                  quantity={quantity}
                  totalPrice={total}
                />
              )}

              {/* Accordion Olfactory Info */}
              <Accordion type="single" collapsible className="w-full border-t border-border/60 pt-1">
                <AccordionItem value="notes" className="border-border/60">
                  <AccordionTrigger className="text-xs uppercase tracking-wider font-semibold hover:no-underline hover:text-primary py-2">
                    Notes Olfactives
                  </AccordionTrigger>
                  <AccordionContent className="space-y-1.5 text-xs font-light text-muted-foreground">
                    <div>
                      <span className="text-primary text-[10px] uppercase tracking-wider font-semibold block mb-0.5">Tête</span>
                      <p>{parfum.notes_tete?.join(", ") || "—"}</p>
                    </div>
                    <div>
                      <span className="text-primary text-[10px] uppercase tracking-wider font-semibold block mb-0.5">Cœur</span>
                      <p>{parfum.notes_coeur?.join(", ") || "—"}</p>
                    </div>
                    <div>
                      <span className="text-primary text-[10px] uppercase tracking-wider font-semibold block mb-0.5">Fond</span>
                      <p>{parfum.notes_fond?.join(", ") || "—"}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Related Products Section */}
          <RelatedProducts currentParfumId={parfum.id} maison={parfum.maison} gender={parfum.gender} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ParfumDetail;
