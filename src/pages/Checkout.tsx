import { useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  Sparkles,
  ArrowLeft,
  Truck,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  FileText,
  Clock,
  Send,
  Building2,
  ShoppingBag,
} from "lucide-react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/store/cart";
import { SIZE_META, formatMAD } from "@/lib/sizes";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/useAppSettings";

const TOP_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Fès",
  "Agadir",
  "Meknès",
  "Kénitra",
  "Mohammedia",
  "Salé",
];

const Checkout = () => {
  const { items, totalItems, subtotal, updateQuantity, removeItem, clear } = useCart();
  const { settings } = useAppSettings();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [notes, setNotes] = useState("");
  const [completeOrder, setCompleteOrder] = useState<{
    orderNumber: string;
    total: number;
    name: string;
    address: string;
    phone: string;
    items: typeof items;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const shippingCost = 0; // Free express delivery throughout Morocco
  const total = subtotal + shippingCost;

  const isFormValid = fullName.trim() !== "" && phone.trim() !== "" && address.trim() !== "";

  const waRaw = settings.whatsapp_phone || "212752850156";
  const waNumber = waRaw.replace(/[^0-9]/g, "");

  const buildWhatsAppMessage = (orderNum: string) => {
    const lines: string[] = [];
    lines.push(`*COMMANDE TABAT : ${orderNum}*`);
    lines.push("═════════════════════════");
    lines.push("");
    lines.push("*ARTICLES SÉLECTIONNÉS :*");
    items.forEach((item) => {
      lines.push(
        `• ${item.maison} — ${item.name} (${SIZE_META[item.size]?.label || item.size}) ×${item.quantity} = ${formatMAD(
          item.price * item.quantity
        )}`
      );
    });
    lines.push("");
    lines.push("*COORDONNÉES CLIENT :*");
    lines.push(`• *Nom & Prénom* : ${fullName.trim()}`);
    lines.push(`• *Téléphone* : ${phone.trim()}`);
    lines.push(`• *Adresse* : ${address.trim()}, ${city}`);
    if (notes.trim()) {
      lines.push(`• *Note* : ${notes.trim()}`);
    }
    lines.push("");
    lines.push("*TOTAL & LIVRAISON :*");
    lines.push(`• *Total à Payer* : *${formatMAD(total)}*`);
    lines.push(`• *Livraison* : Gratuite partout au Maroc (24–48h)`);
    lines.push(`• *Paiement* : Espèces à la livraison (COD)`);
    lines.push("═════════════════════════");
    lines.push("Merci de me confirmer la préparation et l'expédition de mon colis.");
    return encodeURIComponent(lines.join("\n"));
  };

  const processOrderSubmission = async (viaWhatsApp = false) => {
    if (submitting) return;

    if (!isFormValid) {
      toast.error("Veuillez renseigner votre Nom, Téléphone et Adresse de livraison.");
      return;
    }

    setSubmitting(true);
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `TAB-${randomSuffix}`;
    const fullAddressText = `${address.trim()}, ${city}, Maroc`;
    const cleanEmail = `client_${Date.now()}@tabat.ma`;

    const orderPayload = {
      order_number: orderNumber,
      customer_name: fullName.trim(),
      customer_email: cleanEmail,
      customer_phone: phone.trim(),
      customer_address: fullAddressText,
      total_amount: total,
      status: "en_attente",
      items: items.map((item) => ({
        name: `${item.maison} — ${item.name}`,
        size: SIZE_META[item.size]?.label || item.size,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      await supabase.from("orders").insert([orderPayload]);
    } catch (err) {
      console.warn("Supabase order recording note:", err);
    }

    const completedState = {
      orderNumber,
      total,
      name: fullName.trim(),
      address: fullAddressText,
      phone: phone.trim(),
      items: [...items],
    };

    if (viaWhatsApp) {
      const url = `https://wa.me/${waNumber}?text=${buildWhatsAppMessage(orderNumber)}`;
      window.open(url, "_blank");
      toast.success("Commande enregistrée et transmise sur WhatsApp !");
    } else {
      toast.success(`Commande n° ${orderNumber} validée avec succès !`);
    }

    setCompleteOrder(completedState);
    clear();
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <Seo
        title="Finaliser ma Commande | TABAT"
        description="Paiement à la livraison partout au Maroc sous 24-48h. Parfums 100% originaux."
        path="/checkout"
      />
      <Header />

      <main className="flex-1 pt-6 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Empty cart state */}
          {items.length === 0 && !completeOrder ? (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-card/50 border border-border/80 rounded-3xl p-8 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <ShoppingBag size={28} />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-bold">
                Votre panier est vide
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                Vous n'avez pas encore d'article dans votre panier pour finaliser une commande.
              </p>
              <Button
                asChild
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-xs font-semibold h-11 px-8 shadow-md"
              >
                <Link to="/collection/all">Explorer la Collection</Link>
              </Button>
            </div>
          ) : completeOrder ? (
            /* Luxury Order Success Screen */
            <div className="max-w-2xl mx-auto py-8 sm:py-12 space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-card border border-primary/30 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-primary/10 blur-2xl rounded-full" />

                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-primary font-bold">
                    Commande Validée
                  </span>
                  <h1 className="font-serif text-2xl sm:text-4xl text-foreground font-bold">
                    Merci pour votre confiance, {completeOrder.name} !
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
                    Votre commande a été enregistrée sous la référence{" "}
                    <span className="font-serif font-bold text-primary">{completeOrder.orderNumber}</span>. Notre équipe prépare votre colis pour expédition sous 24 à 48 heures.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-background/80 border border-border/80 rounded-2xl p-4 sm:p-6 text-left space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border/60 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Numéro de commande</span>
                      <span className="font-serif font-bold text-foreground">{completeOrder.orderNumber}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground block text-[10px]">Total à régler</span>
                      <span className="font-serif font-bold text-primary text-sm">{formatMAD(completeOrder.total)}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{completeOrder.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{completeOrder.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Paiement en espèces à la livraison</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    asChild
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-wider font-semibold h-11 px-8 shadow-md cursor-pointer"
                  >
                    <Link to="/">Retour à l'Accueil</Link>
                  </Button>

                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                      `Bonjour TABAT, je souhaite suivre ma commande n° ${completeOrder.orderNumber}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Assistance WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Checkout Form & Order Summary Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Client Delivery Details Form */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-card/80 border border-border/80 rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
                  <div className="border-b border-border/60 pb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl text-foreground font-bold">
                        Détails de Livraison
                      </h2>
                      <p className="text-xs text-muted-foreground font-light mt-0.5">
                        Renseignez vos coordonnées pour l'expédition de votre colis.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                      <CreditCard className="w-3 h-3" />
                      <span>Paiement à la livraison</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-primary" /> Prénom et Nom complet *
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        required
                        placeholder="Ex: Yassine Bennani"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-11 text-xs sm:text-sm rounded-xl bg-background border-border/80 focus:border-primary"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-primary" /> Numéro de Téléphone (WhatsApp) *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="06 12 34 56 78"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 text-xs sm:text-sm rounded-xl bg-background border-border/80 focus:border-primary"
                      />
                    </div>

                    {/* City Quick Pills & Input */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-primary" /> Ville de Destination *
                      </Label>

                      <div className="flex flex-wrap gap-1.5">
                        {TOP_CITIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCity(c)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              city.toLowerCase() === c.toLowerCase()
                                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                : "bg-secondary/70 text-muted-foreground hover:text-foreground border border-border/60"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>

                      <Input
                        id="city"
                        type="text"
                        required
                        placeholder="Ou saisissez votre ville..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-11 text-xs sm:text-sm rounded-xl bg-background border-border/80 focus:border-primary mt-1"
                      />
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> Adresse de Livraison Précise *
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        required
                        placeholder="Quartier, N° Immeuble, Rue ou Résidence..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="h-11 text-xs sm:text-sm rounded-xl bg-background border-border/80 focus:border-primary"
                      />
                    </div>

                    {/* Delivery Notes */}
                    <div className="space-y-1.5">
                      <Label htmlFor="notes" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Instructions particulières (Optionnel)
                      </Label>
                      <Textarea
                        id="notes"
                        rows={2}
                        placeholder="Ex: Appeler avant le passage, laisser chez le concierge..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="text-xs sm:text-sm rounded-xl bg-background border-border/80 focus:border-primary resize-none"
                      />
                    </div>
                  </div>

                  {/* Submission Action Buttons */}
                  <div className="pt-2 space-y-3">
                    {/* PRIMARY ACTION: WhatsApp Order */}
                    <Button
                      type="button"
                      disabled={submitting}
                      onClick={() => processOrderSubmission(true)}
                      className="w-full h-12 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 gap-2 cursor-pointer border-0"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Valider & Commander sur WhatsApp</span>
                    </Button>

                    {/* SECONDARY ACTION: Direct Web Order */}
                    <Button
                      type="button"
                      disabled={submitting}
                      onClick={() => processOrderSubmission(false)}
                      variant="outline"
                      className="w-full h-11 rounded-2xl border-border hover:border-primary text-foreground font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>Valider la commande sur le site</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary & Item Rows */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card/80 border border-border/80 rounded-3xl p-5 sm:p-6 shadow-sm sticky top-24 space-y-5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h2 className="font-serif text-lg text-foreground font-bold">
                      Récapitulatif de Commande
                    </h2>
                    <span className="text-xs font-serif font-bold text-primary">
                      {totalItems} article{totalItems > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Cart items listing */}
                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 divide-y divide-border/40">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="pt-3 first:pt-0 flex items-center gap-3"
                      >
                        {/* Item image */}
                        <div className="w-14 h-14 bg-card border border-border/70 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[8px] font-serif text-primary/80 text-center px-1 break-all">
                              {item.imageLabel}
                            </span>
                          )}
                        </div>

                        {/* Item details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] uppercase tracking-widest font-semibold text-primary/80 truncate">
                            {item.maison}
                          </p>
                          <h3 className="text-xs font-serif font-bold text-foreground truncate">
                            {item.name}
                          </h3>
                          <span className="inline-block text-[10px] text-muted-foreground bg-secondary/80 px-1.5 py-0.2 rounded border border-border/50 mt-0.5">
                            {SIZE_META[item.size]?.label || item.size}
                          </span>

                          {/* Stepper */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center bg-card border border-border/70 rounded-md overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                className="w-5 h-5 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                aria-label="Diminuer"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="px-1.5 text-[11px] font-bold select-none">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                className="w-5 h-5 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                aria-label="Augmenter"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id, item.size)}
                              className="text-muted-foreground hover:text-destructive p-0.5 cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <span className="text-xs font-serif font-bold text-primary shrink-0">
                          {formatMAD(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing details */}
                  <div className="border-t border-border/60 pt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-muted-foreground font-light">
                      <span>Sous-total</span>
                      <span className="font-serif font-medium text-foreground">{formatMAD(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-muted-foreground font-light">
                      <span>Livraison Express Maroc</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Gratuite</span>
                    </div>

                    <div className="flex justify-between text-base font-bold border-t border-border/60 pt-3 mt-2">
                      <span className="text-foreground">Total à Payer</span>
                      <span className="text-primary font-serif">{formatMAD(total)}</span>
                    </div>
                  </div>

                  {/* Reassurance items */}
                  <div className="bg-background/80 border border-border/60 rounded-2xl p-3 space-y-2 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                      <span>Parfums 100% Authentiques d'origine</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary shrink-0" />
                      <span>Livraison 24–48h avec suivi par téléphone</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary shrink-0" />
                      <span>Paiement en espèces à la livraison</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
