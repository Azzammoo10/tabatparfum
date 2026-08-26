import { useState } from "react";
import { Minus, Plus, CheckCircle2, User, Phone, MapPin, Sparkles, ArrowLeft } from "lucide-react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/cart";
import { SIZE_META } from "@/lib/sizes";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formatMAD = (n: number) => `${n.toLocaleString("fr-FR")} MAD`;
const WHATSAPP_NUMBER = "212663848099";

const Checkout = () => {
  const { items, subtotal, updateQuantity, clear } = useCart();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const shippingCost = 0; // Free delivery offer
  const total = subtotal + shippingCost;

  const isFormValid = fullName.trim() !== "" && phone.trim() !== "" && address.trim() !== "";

  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push("*NOUVELLE COMMANDE TABAT*");
    lines.push("═══════════════════════");
    lines.push("");
    lines.push("*ARTICLES COMMANDÉS*");
    items.forEach((item) => {
      lines.push(
        `• ${item.maison} — ${item.name} (${SIZE_META[item.size].label}) ×${item.quantity} — ${formatMAD(
          item.price * item.quantity
        )}`
      );
    });
    lines.push("");
    lines.push("*INFORMATIONS DE LIVRAISON*");
    lines.push(`• *Nom & Prénom* : ${fullName.trim()}`);
    lines.push(`• *Téléphone* : ${phone.trim()}`);
    lines.push(`• *Adresse* : ${address.trim()} (${city})`);
    lines.push("");
    lines.push("*RÉCAPITULATIF FINANCIER*");
    lines.push(`• *Sous-total* : ${formatMAD(subtotal)}`);
    lines.push(`• *Livraison Express* : Gratuite`);
    lines.push(`• *Total à Payer* : ${formatMAD(total)}`);
    lines.push("");
    lines.push("*PAIEMENT*");
    lines.push("• Espèces à la livraison (COD)");
    lines.push("═══════════════════════");
    lines.push("Merci de confirmer ma commande TABAT !");
    return encodeURIComponent(lines.join("\n"));
  };

  const handleWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!isFormValid) {
      toast.error("Veuillez remplir votre Nom, Téléphone et Adresse.");
      return;
    }

    setSubmitting(true);
    const fullAddressText = `${address.trim()}, ${city}, Maroc`;

    // Direct Supabase table insert for /admin/commandes
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `TAB-${randomSuffix}`;
    const cleanEmail = `${fullName.trim().toLowerCase().replace(/[^a-z0-9]/g, "") || "client"}@client.tabat.ma`;

    try {
      await supabase.from("orders").insert([
        {
          order_number: orderNumber,
          customer_name: fullName.trim(),
          customer_email: cleanEmail,
          customer_phone: phone.trim(),
          customer_address: fullAddressText,
          total_amount: total,
          status: "en_attente",
          items: items.map((item) => ({
            name: `${item.maison} — ${item.name}`,
            size: SIZE_META[item.size].label,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      ]);
    } catch (err) {
      console.warn("Supabase order recording error", err);
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`;
    window.open(url, "_blank");
    setComplete(true);
    clear();
    setSubmitting(false);
    toast.success("Commande transmise sur WhatsApp !");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo title="Finaliser la Commande | TABAT" description="Paiement à la livraison partout au Maroc." path="/checkout" />
      <Header />

      <main className="flex-1 pt-4 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {items.length === 0 && !complete ? (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-medium">Votre panier est vide</h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-light">
                Découvrez nos collections de parfums d'exception pour commencer vos achats.
              </p>
              <Button asChild className="rounded-full bg-primary text-primary-foreground uppercase tracking-widest text-xs h-11 px-8">
                <Link to="/collection/all">Explorer la Collection</Link>
              </Button>
            </div>
          ) : complete ? (
            <div className="py-16 text-center space-y-5 max-w-md mx-auto bg-card/60 border border-primary/30 rounded-2xl p-6 shadow-lg">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="font-serif text-2xl text-foreground font-medium">Merci pour votre commande !</h1>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                Votre commande a été transmise avec succès sur WhatsApp. Notre équipe va préparer votre colis dans les plus brefs délais.
              </p>
              <Button asChild className="rounded-full bg-primary text-primary-foreground uppercase tracking-widest text-xs h-11 px-8">
                <Link to="/">Retour à l'Accueil</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Order Form (Left Column) */}
              <div className="lg:col-span-7 space-y-6">
                <form
                  onSubmit={handleWhatsAppOrder}
                  className="bg-card/70 border border-border/80 rounded-2xl p-5 sm:p-8 space-y-5 shadow-sm"
                >
                  <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-xl text-foreground font-medium">Informations Client</h2>
                      <p className="text-xs text-muted-foreground font-light mt-0.5">
                        Saisissez vos coordonnées pour valider votre livraison.
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      Paiement à la livraison
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Field 1: Nom et Prénom */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-primary" /> Prénom et Nom *
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        required
                        placeholder="Ex: Mohamed Alami"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-11 text-xs rounded-xl bg-background border-border/80"
                      />
                    </div>

                    {/* Field 2: Téléphone */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-primary" /> Numéro de Téléphone *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="06 12 34 56 78"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 text-xs rounded-xl bg-background border-border/80"
                      />
                    </div>

                    {/* Field 3: Adresse & Ville */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="address" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> Adresse de Livraison *
                        </Label>
                        <Input
                          id="address"
                          type="text"
                          required
                          placeholder="Ex: N° 12, Rue Atlas, Quartier Palmier"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="h-11 text-xs rounded-xl bg-background border-border/80"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="city" className="text-xs font-semibold text-foreground">
                          Ville *
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          required
                          placeholder="Ex: Casablanca"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="h-11 text-xs rounded-xl bg-background border-border/80"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GREEN WHATSAPP ORDER BUTTON */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="relative overflow-hidden group w-full h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 gap-2.5 mt-2"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current shrink-0 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true">
                      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.5 0 .2 5.3.2 11.83c0 2.08.55 4.12 1.6 5.92L0 24l6.42-1.68a11.83 11.83 0 0 0 5.6 1.43h.01c6.52 0 11.82-5.3 11.82-11.83 0-3.16-1.23-6.13-3.33-8.44ZM12.03 21.7h-.01a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.81 1 1.02-3.71-.24-.38a9.83 9.83 0 0 1-1.51-5.19c0-5.43 4.42-9.85 9.85-9.85 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.88 6.96c0 5.43-4.42 9.87-9.76 9.87Zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01a1.08 1.08 0 0 0-.78.36c-.27.3-1.03 1.01-1.03 2.46 0 1.45 1.06 2.86 1.21 3.06.15.2 2.08 3.17 5.03 4.45.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.12.56-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
                    </svg>
                    <span>Commander via WhatsApp</span>
                  </Button>
                </form>
              </div>

              {/* Order Summary (Right Column with Product Images) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card/70 border border-border/80 rounded-2xl p-5 sm:p-6 shadow-sm sticky top-24">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                    <h2 className="font-serif text-lg text-foreground font-medium">Récapitulatif de Commande</h2>
                    <span className="text-xs font-mono text-muted-foreground">{items.length} produit{items.length > 1 ? "s" : ""}</span>
                  </div>

                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 bg-background/60 p-2.5 rounded-xl border border-border/50">
                        {/* PRODUCT IMAGE DISPLAY */}
                        <div className="w-14 h-14 bg-card border border-border/70 rounded-lg p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-multiply"
                            />
                          ) : (
                            <span className="text-[8px] font-mono text-primary/70 text-center px-1 break-all">
                              {item.imageLabel}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground truncate">
                            {item.maison}
                          </p>
                          <h3 className="text-xs font-serif text-foreground font-medium truncate">{item.name}</h3>
                          <p className="text-[11px] text-primary font-semibold">{SIZE_META[item.size].label}</p>

                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="h-5 w-5 flex items-center justify-center border border-border rounded-md hover:border-primary text-foreground"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="h-5 w-5 flex items-center justify-center border border-border rounded-md hover:border-primary text-foreground"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>

                        <span className="text-xs font-serif font-bold text-primary shrink-0">
                          {formatMAD(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border/60 mt-4 pt-3 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Sous-total</span>
                      <span className="font-semibold text-foreground">{formatMAD(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Livraison Express</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Gratuite</span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t border-border/60 pt-3 mt-2">
                      <span className="text-foreground">Total à Payer</span>
                      <span className="text-primary font-serif">{formatMAD(total)}</span>
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
