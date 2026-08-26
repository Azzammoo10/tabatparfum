import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductImage from "@/components/ui/ProductImage";
import RelatedProducts from "@/components/content/RelatedProducts";
import ExpressOrderForm from "@/components/content/ExpressOrderForm";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShieldCheck, Truck, ArrowLeft, Check, Sparkles, Droplets } from "lucide-react";
import { useParfum } from "@/hooks/useParfums";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { SIZES, SIZE_META, formatMAD, priceFor } from "@/lib/sizes";
import type { Size } from "@/types/database";
import type { OrderSelectionItem } from "@/components/content/ExpressOrderForm";
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
  const { addItem } = useCart();

  // State des quantités initialisé pour chaque format
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!parfum) return;
    const isFull = parfum.sale_mode === "full_bottle";
    const sizes: Size[] = isFull
      ? ["full"]
      : (["5ml", "10ml", "20ml"] as Size[]).filter((s) => {
          const p = priceFor(parfum, s);
          return typeof p === "number" && !isNaN(p) && p > 0;
        });

    const initial: Record<string, number> = {};
    sizes.forEach((s, idx) => {
      initial[s] = idx === 0 ? 1 : 0;
    });
    setQuantities(initial);
  }, [parfum?.id, parfum?.sale_mode, parfum?.price_5ml, parfum?.price_10ml, parfum?.price_20ml]);

  const updateSizeQty = (s: Size, delta: number) => {
    setQuantities((prev) => {
      const current = prev[s] ?? 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [s]: next };
    });
  };

  const setDirectSizeQty = (s: Size, qty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [s]: Math.max(0, qty),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-6 px-4 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-pulse">
            <div className="md:col-span-5 h-72 bg-muted rounded-2xl max-w-xs mx-auto w-full" />
            <div className="md:col-span-7 space-y-4">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-8 w-3/4 bg-muted rounded" />
              <div className="h-24 bg-muted rounded-xl" />
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
          <h1 className="font-serif text-xl sm:text-2xl mb-3">Parfum introuvable</h1>
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

  // STRICTEMENT n'afficher que les formats ayant un prix > 0 configuré en base de données
  const availableSizes: Size[] = isFullBottle
    ? ["full"]
    : (["5ml", "10ml", "20ml"] as Size[]).filter((s) => {
        const p = priceFor(parfum, s);
        return typeof p === "number" && !isNaN(p) && p > 0;
      });

  const fullStock = parfum.full_bottle_stock ?? 0;
  const outOfStock =
    !parfum.is_active ||
    parfum.stock_status === "rupture" ||
    (isFullBottle && fullStock <= 0);

  // Selected items with quantity > 0
  const selectedItems: OrderSelectionItem[] = availableSizes
    .filter((s) => (quantities[s] ?? 0) > 0)
    .map((s) => {
      const qty = quantities[s] ?? 0;
      const unitPrice = priceFor(parfum, s);
      return {
        size: s,
        sizeLabel:
          s === "full"
            ? parfum.full_bottle_volume_ml
              ? `${parfum.full_bottle_volume_ml} ml`
              : "Flacon Complet"
            : SIZE_META[s]?.label ?? s,
        quantity: qty,
        unitPrice,
        subtotal: unitPrice * qty,
      };
    });

  const totalQuantity = selectedItems.reduce((acc, it) => acc + it.quantity, 0);
  const totalPrice = selectedItems.reduce((acc, it) => acc + it.subtotal, 0);

  const handleAddToCart = () => {
    if (selectedItems.length === 0) {
      toast.error("Veuillez choisir une quantité pour au moins un format");
      return;
    }

    selectedItems.forEach((item) => {
      addItem({
        id: parfum.id,
        name: parfum.name,
        maison: parfum.maison,
        size: item.size as Size,
        quantity: item.quantity,
        price: item.unitPrice,
        imageLabel: parfum.image_label,
        imageUrl: parfum.image_url,
      });
    });

    const summary = selectedItems.map((i) => `${i.sizeLabel} × ${i.quantity}`).join(", ");
    toast.success("Ajouté au panier", {
      description: `${parfum.name} (${summary})`,
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
    offers: {
      "@type": "Offer",
      priceCurrency: "MAD",
      price: priceFor(parfum, isFullBottle ? "full" : "10ml"),
      availability: parfum.is_active
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
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

      <main className="flex-1 pt-3 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Breadcrumb Navigation */}
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
                <BreadcrumbPage className="text-foreground font-medium truncate max-w-[150px] sm:max-w-xs">
                  {parfum.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* MAIN PRODUCT CLEAN & AIRY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* LEFT COLUMN: Crystal Clear Product Image + Flacon Preview */}
            <div className="md:col-span-5 w-full space-y-3 md:sticky md:top-24">
              <div className="relative group">
                <ProductImage
                  src={parfum.image_url}
                  alt={parfum.name}
                  label={parfum.image_label}
                  aspect="aspect-[4/5]"
                  fitMode="cover"
                  className="max-h-[260px] sm:max-h-[380px] md:max-h-[440px] w-full mx-auto"
                />

                {/* Glass Spray Bottle Badge Preview */}
                {!isFullBottle && (
                  <div
                    className="absolute top-3 right-3 z-20 bg-background/95 dark:bg-black/90 backdrop-blur-md border border-primary/50 rounded-2xl p-2.5 shadow-xl animate-in zoom-in-95 fade-in duration-300 flex flex-col items-center gap-1 min-w-[68px]"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                        {quantities["10ml"] > 0 ? "10ml" : quantities["5ml"] > 0 ? "5ml" : "Decant"}
                      </span>
                      <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    </div>

                    <div className="flex flex-col items-center py-0.5">
                      <div
                        className="rounded-t-[3px] shadow-sm relative"
                        style={{
                          width: "14px",
                          height: quantities["10ml"] > 0 ? "18px" : "14px",
                          background: "linear-gradient(180deg, #111111 0%, #333333 40%, #0a0a0a 100%)",
                        }}
                      />
                      <div
                        className="border-x-2 border-b-2 border-primary/80 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/15 rounded-b-[4px] relative shadow-inner"
                        style={{
                          width: "12px",
                          height: quantities["10ml"] > 0 ? "65px" : "42px",
                        }}
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-[90%] bg-foreground/50" />
                      </div>
                    </div>

                    <p className="text-[7.5px] text-primary font-bold text-center">
                      {totalQuantity > 0 ? `${totalQuantity} flacon${totalQuantity > 1 ? "s" : ""}` : "Flacons Verre"}
                    </p>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground text-center">
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-card/40 border border-border/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>100% Authentique</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-card/40 border border-border/60">
                  <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Livraison 24–48h</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Information & Order Actions */}
            <div className="md:col-span-7 space-y-4">
              {/* Header Info Block */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold block">
                  {parfum.maison}
                </span>

                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-medium leading-tight">
                    {parfum.name}
                  </h1>

                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border/60 font-medium">
                    {parfum.gender}
                  </span>

                  {parfum.is_new && (
                    <span className="text-[10px] uppercase tracking-wider text-primary-foreground bg-primary px-2.5 py-0.5 rounded-full font-medium shadow-xs animate-badge-glow">
                      Nouveau
                    </span>
                  )}
                </div>
              </div>

              {/* Multi-Format / Size Selection Cards with Independent Quantities */}
              <div className="space-y-2.5 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider font-semibold text-foreground flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-primary" /> Choix des Formats & Quantités
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Sélectionnez la quantité souhaitée par format
                  </span>
                </div>

                <div className="space-y-2.5">
                  {availableSizes.map((s) => {
                    const formatLabel =
                      s === "full"
                        ? parfum.full_bottle_volume_ml
                          ? `${parfum.full_bottle_volume_ml} ml`
                          : "Flacon Complet"
                        : SIZE_META[s]?.label ?? s;

                    const formatSub =
                      s === "full"
                        ? parfum.category === "deodorants-stick"
                          ? "Stick Corporel"
                          : "Flacon Scellé Original"
                        : SIZE_META[s]?.sub ?? "Décantation";

                    const qty = quantities[s] ?? 0;
                    const isSelected = qty > 0;
                    const unitPrice = priceFor(parfum, s);

                    return (
                      <div
                        key={s}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border/80 bg-card/40 hover:border-primary/40"
                        }`}
                      >
                        {/* Format Info */}
                        <div
                          className="flex-1 cursor-pointer select-none"
                          onClick={() => {
                            if (qty === 0) setDirectSizeQty(s, 1);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-base font-bold text-foreground">
                              {formatLabel}
                            </span>
                            <span className="text-[10px] text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border/50">
                              {formatSub}
                            </span>
                          </div>
                          <div className="text-xs font-serif font-bold text-primary mt-0.5">
                            {formatMAD(unitPrice)} <span className="text-[10px] font-normal text-muted-foreground">/ unité</span>
                          </div>
                        </div>

                        {/* Individual Quantity Stepper */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center border border-border rounded-full bg-background px-1.5 py-0.5 shadow-xs">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateSizeQty(s, -1);
                              }}
                              className="h-7 w-7 flex items-center justify-center rounded-full text-foreground hover:text-primary hover:bg-muted/50 transition-colors disabled:opacity-30"
                              disabled={qty === 0}
                              aria-label={`Diminuer ${formatLabel}`}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-foreground">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateSizeQty(s, 1);
                              }}
                              className="h-7 w-7 flex items-center justify-center rounded-full text-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                              aria-label={`Augmenter ${formatLabel}`}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STATIC ORDER FORM (ALWAYS VISIBLE DIRECTLY UNDER FORMATS & QUANTITIES) */}
              <ExpressOrderForm
                parfumName={parfum.name}
                maison={parfum.maison}
                items={selectedItems}
                totalPrice={totalPrice}
                onAddToCart={handleAddToCart}
                outOfStock={outOfStock}
              />
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
