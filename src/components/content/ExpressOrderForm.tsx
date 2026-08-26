import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatMAD } from "@/lib/sizes";
import { toast } from "sonner";
import { User, Phone, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

interface ExpressOrderFormProps {
  parfumName: string;
  maison: string;
  sizeLabel: string;
  quantity: number;
  totalPrice: number;
}

const TABAT_WHATSAPP = "212752850156";

const ExpressOrderForm = ({
  parfumName,
  maison,
  sizeLabel,
  quantity,
  totalPrice,
}: ExpressOrderFormProps) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleWhatsAppOrder = (e: React.FormEvent) => {
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

    const message = [
      "*Nouvelle Commande TABAT*",
      "",
      `*Produit* : ${maison} — ${parfumName}`,
      `*Format* : ${sizeLabel}`,
      `*Quantité* : ${quantity}`,
      `*Total* : ${formatMAD(totalPrice)}`,
      "",
      "*Informations Client*",
      `• *Nom & Prénom* : ${fullName.trim()}`,
      `• *Téléphone* : ${phone.trim()}`,
      `• *Adresse de Livraison* : ${address.trim()}`,
      "",
      "Paiement en espèces à la livraison. Merci !",
    ].join("\n");

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${TABAT_WHATSAPP}?text=${encoded}`;

    window.open(whatsappUrl, "_blank");
    toast.success("Redirection vers WhatsApp pour valider votre commande !");
  };

  return (
    <form
      onSubmit={handleWhatsAppOrder}
      className="relative overflow-hidden bg-card/90 backdrop-blur-md border border-primary/30 dark:border-primary/20 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl transition-all duration-300 hover:border-primary/50 mt-4 animate-fade-in"
    >
      {/* Glow highlight background ornament */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-foreground tracking-wide">
              Commande Express
            </h3>
            <p className="text-[10px] text-muted-foreground font-light">
              Validation directe via WhatsApp
            </p>
          </div>
        </div>

        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 shrink-0" />
          <span>Paiement à la livraison</span>
        </span>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        {/* Field 1: Nom et Prénom */}
        <div className="space-y-1">
          <Label
            htmlFor="fullName"
            className="text-[11px] font-medium text-foreground/90 flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Nom et Prénom</span>
          </Label>
          <div className="relative">
            <Input
              id="fullName"
              type="text"
              required
              placeholder="Ex: Mohamed Alami"
              value={fullName}
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setFullName(e.target.value)}
              className={`h-10 text-xs rounded-xl bg-background/80 border-border/80 transition-all duration-300 ${
                focusedField === "fullName"
                  ? "border-primary ring-2 ring-primary/20 shadow-xs"
                  : "hover:border-primary/40"
              }`}
            />
          </div>
        </div>

        {/* Field 2: Numéro de Téléphone */}
        <div className="space-y-1">
          <Label
            htmlFor="phone"
            className="text-[11px] font-medium text-foreground/90 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Numéro de Téléphone</span>
            </span>
            <span className="text-[9px] text-muted-foreground font-mono">
              06 XX XX XX XX
            </span>
          </Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              required
              placeholder="06 12 34 56 78"
              value={phone}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setPhone(e.target.value)}
              className={`h-10 text-xs rounded-xl bg-background/80 border-border/80 transition-all duration-300 ${
                focusedField === "phone"
                  ? "border-primary ring-2 ring-primary/20 shadow-xs"
                  : "hover:border-primary/40"
              }`}
            />
          </div>
        </div>

        {/* Field 3: Adresse de Livraison */}
        <div className="space-y-1">
          <Label
            htmlFor="address"
            className="text-[11px] font-medium text-foreground/90 flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Adresse de Livraison</span>
          </Label>
          <div className="relative">
            <Input
              id="address"
              type="text"
              required
              placeholder="Ex: N° 12, Rue Atlas, Casablanca"
              value={address}
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setAddress(e.target.value)}
              className={`h-10 text-xs rounded-xl bg-background/80 border-border/80 transition-all duration-300 ${
                focusedField === "address"
                  ? "border-primary ring-2 ring-primary/20 shadow-xs"
                  : "hover:border-primary/40"
              }`}
            />
          </div>
        </div>
      </div>

      {/* ANIMATED GREEN WHATSAPP BUTTON */}
      <Button
        type="submit"
        className="relative overflow-hidden group w-full h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 gap-2.5 mt-2"
      >
        {/* Subtle shine highlight effect */}
        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />

        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current shrink-0 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.5 0 .2 5.3.2 11.83c0 2.08.55 4.12 1.6 5.92L0 24l6.42-1.68a11.83 11.83 0 0 0 5.6 1.43h.01c6.52 0 11.82-5.3 11.82-11.83 0-3.16-1.23-6.13-3.33-8.44ZM12.03 21.7h-.01a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.81 1 1.02-3.71-.24-.38a9.83 9.83 0 0 1-1.51-5.19c0-5.43 4.42-9.85 9.85-9.85 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.88 6.96c0 5.43-4.42 9.87-9.76 9.87Zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01a1.08 1.08 0 0 0-.78.36c-.27.3-1.03 1.01-1.03 2.46 0 1.45 1.06 2.86 1.21 3.06.15.2 2.08 3.17 5.03 4.45.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.12.56-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
        </svg>

        <span>Commander via WhatsApp</span>
      </Button>
    </form>
  );
};

export default ExpressOrderForm;
