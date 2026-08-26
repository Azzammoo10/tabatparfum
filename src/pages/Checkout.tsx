import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import CheckoutHeader from "../components/header/CheckoutHeader";
import Footer from "../components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/store/cart";
import { SIZE_META } from "@/data/parfums";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


const formatMAD = (n: number) => `${n.toLocaleString("fr-FR")} MAD`;

const WHATSAPP_NUMBER = "212752850156";

const Checkout = () => {
  const { items, subtotal, updateQuantity, clear } = useCart();
  const [customer, setCustomer] = useState({ email: "", firstName: "", lastName: "", phone: "" });
  const [shipping, setShipping] = useState({ address: "", city: "", postalCode: "", country: "Maroc" });
  const [shippingOption, setShippingOption] = useState("standard");
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getShipping = () => (shippingOption === "express" ? 60 : shippingOption === "overnight" ? 120 : 0);

  const shippingCost = getShipping();
  const total = subtotal + shippingCost;

  const shippingLabel =
    shippingOption === "express"
      ? "Express (1-2 jours)"
      : shippingOption === "overnight"
      ? "Livraison du lendemain (J+1)"
      : "Standard (3-5 jours)";

  const isFormValid =
    customer.email &&
    customer.firstName &&
    customer.lastName &&
    customer.phone &&
    shipping.address &&
    shipping.city &&
    shipping.postalCode &&
    shipping.country;

  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push("*Nouvelle Commande TABAT*");
    lines.push("");
    lines.push("*Client*");
    lines.push(`Nom : ${customer.firstName} ${customer.lastName}`);
    lines.push(`Email : ${customer.email}`);
    lines.push(`Téléphone : ${customer.phone}`);
    lines.push("");
    lines.push("*Adresse de livraison*");
    lines.push(`${shipping.address}`);
    lines.push(`${shipping.postalCode} ${shipping.city}`);
    lines.push(`${shipping.country}`);
    lines.push("");
    lines.push("*Articles*");
    items.forEach((item) => {
      lines.push(
        `• ${item.maison} — ${item.name} (${SIZE_META[item.size].label}) ×${item.quantity} — ${formatMAD(
          item.price * item.quantity
        )}`
      );
    });
    lines.push("");
    lines.push(`*Livraison* : ${shippingLabel} — ${shippingCost === 0 ? "Offerte" : formatMAD(shippingCost)}`);
    lines.push(`*Sous-total* : ${formatMAD(subtotal)}`);
    lines.push(`*Total* : ${formatMAD(total)}`);
    return encodeURIComponent(lines.join("\n"));
  };

  const handleWhatsApp = async () => {
    if (submitting) return;
    if (items.length === 0 || !isFormValid) return;

    setSubmitting(true);
    const fullName = `${customer.firstName} ${customer.lastName}`.trim();
    const fullAddress = `${shipping.address}, ${shipping.postalCode} ${shipping.city}, ${shipping.country}`;

    // Server-side: validates items, looks up authoritative prices, calculates total, inserts order
    const { data, error } = await supabase.functions.invoke("create-order", {
      body: {
        customer_name: fullName,
        customer_email: customer.email.trim().toLowerCase(),
        customer_phone: customer.phone.trim(),
        customer_address: fullAddress,
        shipping_option: shippingOption,
        items: items.map((item) => ({
          parfum_id: item.id,
          size: item.size,
          quantity: item.quantity,
        })),
      },
    });

    if (error || !data?.ok) {
      console.error("Order insert failed", error || data);
      toast.error("Impossible d'enregistrer la commande. Réessayez avant d'ouvrir WhatsApp.");
      setSubmitting(false);
      return;
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`;
    window.open(url, "_blank");
    setComplete(true);
    clear();
    setSubmitting(false);
  };


  return (
    <div className="min-h-screen bg-background">
      <CheckoutHeader />

      <main className="pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {items.length === 0 && !complete ? (
            <div className="py-24 text-center">
              <h1 className="font-serif text-3xl mb-4">Votre panier est vide</h1>
              <Button asChild className="rounded-none bg-primary text-primary-foreground uppercase tracking-widest text-xs h-12 px-8">
                <Link to="/collection/all">Découvrir la collection</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Summary */}
              <div className="lg:col-span-1 lg:order-2">
                <div className="bg-secondary p-6 sticky top-6 border border-border">
                  <h2 className="font-serif text-xl text-foreground mb-6">Récapitulatif</h2>

                  <div className="space-y-5 max-h-[420px] overflow-y-auto pr-2">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-3">
                        <div className="w-16 h-16 bg-muted border border-border flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-mono text-primary/70 text-center px-1 break-all">
                            {item.imageLabel}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                            {item.maison}
                          </p>
                          <h3 className="text-sm font-serif text-foreground truncate">{item.name}</h3>
                          <p className="text-xs text-primary">{SIZE_META[item.size].label}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="h-7 w-7 flex items-center justify-center border border-border hover:border-primary hover:text-primary"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm min-w-[2ch] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="h-7 w-7 flex items-center justify-center border border-border hover:border-primary hover:text-primary"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-foreground whitespace-nowrap">
                          {formatMAD(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border mt-6 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="text-foreground">{formatMAD(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="text-foreground">
                        {shippingCost === 0 ? "Offerte" : formatMAD(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-border pt-3 mt-3">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary text-lg">{formatMAD(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forms */}
              <div className="lg:col-span-2 lg:order-1 space-y-8">
                <div className="bg-secondary p-6 md:p-8 border border-border">
                  <h2 className="font-serif text-xl text-foreground mb-6">Informations Client</h2>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="email" className="text-xs uppercase tracking-widest text-foreground/80">Adresse email *</Label>
                      <Input
                        id="email" type="email" value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="mt-2 rounded-none bg-background border-border"
                        placeholder="vous@exemple.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-xs uppercase tracking-widest text-foreground/80">Prénom *</Label>
                        <Input
                          id="firstName" value={customer.firstName}
                          onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                          className="mt-2 rounded-none bg-background border-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-xs uppercase tracking-widest text-foreground/80">Nom *</Label>
                        <Input
                          id="lastName" value={customer.lastName}
                          onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                          className="mt-2 rounded-none bg-background border-border"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-xs uppercase tracking-widest text-foreground/80">Téléphone *</Label>
                      <Input
                        id="phone" type="tel" value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="mt-2 rounded-none bg-background border-border"
                        placeholder="+212 6 00 00 00 00"
                      />
                    </div>

                    <div className="border-t border-border pt-6 mt-2">
                      <h3 className="font-serif text-lg text-foreground mb-4">Adresse de livraison</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="address" className="text-xs uppercase tracking-widest text-foreground/80">Adresse *</Label>
                          <Input
                            id="address" value={shipping.address}
                            onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                            className="mt-2 rounded-none bg-background border-border"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city" className="text-xs uppercase tracking-widest text-foreground/80">Ville *</Label>
                            <Input
                              id="city" value={shipping.city}
                              onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                              className="mt-2 rounded-none bg-background border-border"
                            />
                          </div>
                          <div>
                            <Label htmlFor="postal" className="text-xs uppercase tracking-widest text-foreground/80">Code postal *</Label>
                            <Input
                              id="postal" value={shipping.postalCode}
                              onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                              className="mt-2 rounded-none bg-background border-border"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="country" className="text-xs uppercase tracking-widest text-foreground/80">Pays *</Label>
                          <Input
                            id="country" value={shipping.country}
                            onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                            className="mt-2 rounded-none bg-background border-border"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary p-6 md:p-8 border border-border">
                  <h2 className="font-serif text-xl text-foreground mb-6">Mode de Livraison</h2>
                  <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-3">
                    <label className="flex items-center justify-between p-4 border border-border cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <span className="text-sm font-light text-foreground">Livraison Standard</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Offerte • 3-5 jours</span>
                    </label>
                    <label className="flex items-center justify-between p-4 border border-border cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="express" id="express" />
                        <span className="text-sm font-light text-foreground">Express</span>
                      </div>
                      <span className="text-sm text-muted-foreground">60 MAD • 1-2 jours</span>
                    </label>
                    <label className="flex items-center justify-between p-4 border border-border cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="overnight" id="overnight" />
                        <span className="text-sm font-light text-foreground">Livraison du lendemain</span>
                      </div>
                      <span className="text-sm text-muted-foreground">120 MAD • J+1</span>
                    </label>
                  </RadioGroup>
                </div>

                <div className="bg-secondary p-6 md:p-8 border border-border">
                  <h2 className="font-serif text-xl text-foreground mb-2">Finaliser la commande</h2>
                  <p className="text-sm text-muted-foreground font-light mb-6">
                    Confirmez votre commande via WhatsApp. Nous vous répondrons rapidement pour valider les détails et organiser la livraison.
                  </p>

                  {!complete ? (
                    <Button
                      onClick={handleWhatsApp}
                      disabled={!isFormValid || submitting}
                      className="w-full rounded-full h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white uppercase tracking-[0.2em] text-xs font-semibold shadow-md hover:shadow-lg transition-all gap-3"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.5 0 .2 5.3.2 11.83c0 2.08.55 4.12 1.6 5.92L0 24l6.42-1.68a11.83 11.83 0 0 0 5.6 1.43h.01c6.52 0 11.82-5.3 11.82-11.83 0-3.16-1.23-6.13-3.33-8.44ZM12.03 21.7h-.01a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.81 1 1.02-3.71-.24-.38a9.83 9.83 0 0 1-1.51-5.19c0-5.43 4.42-9.85 9.85-9.85 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.88 6.96c0 5.43-4.42 9.87-9.76 9.87Zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01a1.08 1.08 0 0 0-.78.36c-.27.3-1.03 1.01-1.03 2.46 0 1.45 1.06 2.86 1.21 3.06.15.2 2.08 3.17 5.03 4.45.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.12.56-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
                      </svg>
                      {submitting ? "Enregistrement…" : `Commander via WhatsApp • ${formatMAD(total)}`}
                    </Button>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mb-6">
                        <Check className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-serif text-2xl text-foreground mb-2">Commande envoyée</h3>
                      <p className="text-muted-foreground font-light">
                        Votre commande a été transmise sur WhatsApp. Nous vous contacterons rapidement pour la confirmer.
                      </p>
                    </div>
                  )}
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
