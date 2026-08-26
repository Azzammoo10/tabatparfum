import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatMAD } from "@/lib/sizes";
import { toast } from "sonner";
import { User, Phone, MapPin, Sparkles, CheckCircle2, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ExpressOrderFormProps {
  parfumName: string;
  maison: string;
  sizeLabel: string;
  quantity: number;
  totalPrice: number;
  onAddToCart?: () => void;
  outOfStock?: boolean;
}

const TABAT_WHATSAPP = "212663848099";

const ExpressOrderForm = ({
  parfumName,
  maison,
  sizeLabel,
  quantity,
  totalPrice,
  onAddToCart,
  outOfStock,
}: ExpressOrderFormProps) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Veuillez saisir votre Nom & Prénom");
      return;
    }
    if (!phone.trim()) {
      toast.error("Veuillez saisir votre numéro de téléphone");
      return;
    }
    if (!address.trim()) {
      toast.error("Veuillez saisir votre adresse de livraison");
      return;
    }

    setIsSubmitting(true);

    // Generate unique order number TAB-XXXXXX
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `TAB-${randomSuffix}`;
    const cleanEmail = `${fullName.trim().toLowerCase().replace(/[^a-z0-9]/g, "") || "client"}@client.tabat.ma`;

    // Save order record directly to Supabase database for /admin/commandes visibility
    try {
      const { data, error: dbError } = await supabase.from("orders").insert([
        {
          order_number: orderNumber,
          customer_name: fullName.trim(),
          customer_email: cleanEmail,
          customer_phone: phone.trim(),
          customer_address: address.trim(),
          total_amount: totalPrice,
          status: "en_attente",
          items: [
            {
              name: `${maison} — ${parfumName}`,
              size: sizeLabel,
              quantity: quantity,
              price: totalPrice / quantity,
            },
          ],
        },
      ]);

      if (dbError) {
        console.error("Erreur enregistrement commande Supabase:", dbError);
      } else {
        console.log("Commande enregistrée avec succès dans Supabase Admin:", data);
      }
    } catch (err) {
      console.warn("Exception lors de l'enregistrement de la commande:", err);
    }

    // Build personalized luxury WhatsApp message
    const message = [
      `*NOUVELLE COMMANDE TABAT (#${orderNumber})*`,
      "═══════════════════════",
      "",
      "*DÉTAILS DE LA COMMANDE*",
      `• *Maison* : ${maison}`,
      `• *Parfum* : ${parfumName}`,
      `• *Format* : ${sizeLabel}`,
      `• *Quantité* : ${quantity}`,
      `• *Total à Payer* : ${formatMAD(totalPrice)}`,
      "",
      "*INFORMATIONS DE LIVRAISON*",
      `• *Nom & Prénom* : ${fullName.trim()}`,
      `• *Téléphone* : ${phone.trim()}`,
      `• *Adresse* : ${address.trim()}`,
      "",
      "*PAIEMENT*",
      "• Espèces à la livraison (COD)",
      "═══════════════════════",
      "Merci de confirmer ma commande TABAT !",
    ].join("\n");

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${TABAT_WHATSAPP}?text=${encoded}`;

    window.open(whatsappUrl, "_blank");
    setIsSubmitting(false);
    toast.success("Commande enregistrée dans l'Admin et redirigée vers WhatsApp !");
  };

  return (
    <form
      onSubmit={handleWhatsAppOrder}
      className="relative overflow-hidden bg-card/90 backdrop-blur-md border-2 border-primary/40 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl transition-all duration-300 hover:border-primary animate-in fade-in zoom-in-95"
    >
      {/* Glow highlight background ornament */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/15 rounded-full blur-2xl pointer-events-none" />

      {/* DYNAMICALLY UPDATED FORMAT & PRICE SUMMARY BANNER */}
      <div
        key={`${sizeLabel}-${quantity}`}
        className="bg-primary/10 border border-primary/40 rounded-xl p-3 flex items-center justify-between animate-in fade-in duration-300"
      >
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-bold text-primary">
              {sizeLabel} × {quantity}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground font-light mt-0.5">
            {maison} — {parfumName}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block">
            Prix Total
          </span>
          <span className="text-base sm:text-lg font-serif font-bold text-primary">
            {formatMAD(totalPrice)}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <h3 className="font-serif text-xs sm:text-sm font-semibold text-foreground tracking-wide">
          Informations de Livraison
        </h3>

        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
          <span>Paiement à la livraison</span>
        </span>
      </div>

      {/* Form Fields */}
      <div className="space-y-2.5">
        {/* Field 1: Nom et Prénom */}
        <div className="space-y-1">
          <Label
            htmlFor="fullName"
            className="text-[10px] sm:text-[11px] font-medium text-foreground/90 flex items-center gap-1"
          >
            <User className="w-3 h-3 text-primary shrink-0" />
            <span>Prénom et Nom</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            required
            placeholder="Ex: Mohamed Alami"
            value={fullName}
            onFocus={() => setFocusedField("fullName")}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => setFullName(e.target.value)}
            className={`h-9.5 text-xs rounded-xl bg-background/80 border-border/80 transition-all ${
              focusedField === "fullName" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
          />
        </div>

        {/* Field 2: Numéro de Téléphone */}
        <div className="space-y-1">
          <Label
            htmlFor="phone"
            className="text-[10px] sm:text-[11px] font-medium text-foreground/90 flex items-center justify-between"
          >
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-primary shrink-0" />
              <span>Numéro de Téléphone</span>
            </span>
            <span className="text-[8.5px] text-muted-foreground font-mono">06 XX XX XX XX</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            required
            placeholder="0663848099"
            value={phone}
            onFocus={() => setFocusedField("phone")}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => setPhone(e.target.value)}
            className={`h-9.5 text-xs rounded-xl bg-background/80 border-border/80 transition-all ${
              focusedField === "phone" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
          />
        </div>

        {/* Field 3: Adresse de Livraison */}
        <div className="space-y-1">
          <Label
            htmlFor="address"
            className="text-[10px] sm:text-[11px] font-medium text-foreground/90 flex items-center gap-1"
          >
            <MapPin className="w-3 h-3 text-primary shrink-0" />
            <span>Adresse de Livraison</span>
          </Label>
          <Input
            id="address"
            type="text"
            required
            placeholder="Ex: N° 12, Rue Atlas, Casablanca"
            value={address}
            onFocus={() => setFocusedField("address")}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => setAddress(e.target.value)}
            className={`h-9.5 text-xs rounded-xl bg-background/80 border-border/80 transition-all ${
              focusedField === "address" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
          />
        </div>
      </div>

      {/* ACTION BUTTONS (Ajouter au Panier + WhatsApp) */}
      <div className="space-y-2 pt-1">
        {onAddToCart && (
          <Button
            type="button"
            disabled={outOfStock}
            onClick={onAddToCart}
            className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover uppercase tracking-[0.18em] text-[11px] font-bold shadow-md hover:scale-[1.01] transition-all gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Ajouter au Panier
          </Button>
        )}

        <Button
          type="submit"
          disabled={outOfStock || isSubmitting}
          className="relative overflow-hidden group w-full h-11 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 gap-2"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current shrink-0 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true">
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.5 0 .2 5.3.2 11.83c0 2.08.55 4.12 1.6 5.92L0 24l6.42-1.68a11.83 11.83 0 0 0 5.6 1.43h.01c6.52 0 11.82-5.3 11.82-11.83 0-3.16-1.23-6.13-3.33-8.44ZM12.03 21.7h-.01a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.81 1 1.02-3.71-.24-.38a9.83 9.83 0 0 1-1.51-5.19c0-5.43 4.42-9.85 9.85-9.85 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.88 6.96c0 5.43-4.42 9.87-9.76 9.87Zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01a1.08 1.08 0 0 0-.78.36c-.27.3-1.03 1.01-1.03 2.46 0 1.45 1.06 2.86 1.21 3.06.15.2 2.08 3.17 5.03 4.45.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.12.56-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
          </svg>
          <span>Commander via WhatsApp</span>
        </Button>
      </div>
    </form>
  );
};

export default ExpressOrderForm;
