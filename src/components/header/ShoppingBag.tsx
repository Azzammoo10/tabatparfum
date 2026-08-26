import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/store/cart";
import { SIZE_META } from "@/lib/sizes";

interface ShoppingBagProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatMAD = (n: number) => `${n.toLocaleString("fr-FR")} MAD`;

const ShoppingBag = ({ isOpen, onClose }: ShoppingBagProps) => {
  const { items, subtotal, updateQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-screen">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="absolute right-0 top-0 h-screen w-full sm:w-96 bg-background border-l border-border animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-xl text-foreground tracking-wide">Mon Panier</h2>
          <button
            onClick={onClose}
            className="p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col p-6">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-sm text-center font-light">
                Votre panier est vide.<br />
                Découvrez nos collections pour commencer.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-6 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-card border border-border/80 rounded-xl p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-multiply"
                        />
                      ) : (
                        <span className="text-[9px] font-mono text-primary/70 text-center px-1 break-all">
                          {item.imageLabel}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <div className="min-w-0">
                          <p className="text-[11px] tracking-widest uppercase text-muted-foreground truncate">
                            {item.maison}
                          </p>
                          <h3 className="text-sm font-serif text-foreground truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-primary mt-0.5">
                            {SIZE_META[item.size].label} — {SIZE_META[item.size].sub}
                          </p>
                        </div>
                        <p className="text-sm font-serif font-bold text-foreground whitespace-nowrap">
                          {formatMAD(item.price * item.quantity)}
                        </p>
                      </div>
                      <div className="flex items-center mt-3 border border-border w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="p-2 hover:text-primary transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-sm font-light min-w-[32px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-2 hover:text-primary transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-foreground">Sous-total</span>
                  <span className="text-base font-serif font-bold text-primary">{formatMAD(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground font-light">
                  Livraison calculée à l'étape suivante.
                </p>
                <Button
                  asChild
                  className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary-hover uppercase tracking-widest text-xs h-12"
                  onClick={onClose}
                >
                  <Link to="/checkout">Procéder au Paiement</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-none border-border hover:border-primary hover:text-primary text-xs uppercase tracking-widest h-12"
                  onClick={onClose}
                  asChild
                >
                  <Link to="/collection/all">Continuer mes achats</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingBag;
