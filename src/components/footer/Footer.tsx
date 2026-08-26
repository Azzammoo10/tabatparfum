import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Mail, Sparkles, MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-card/60 border-t border-border text-foreground pt-12 md:pt-16 pb-8 px-4 sm:px-6 mt-16 md:mt-28">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-14">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <img
                src="/logo.png"
                alt="TABAT"
                className="h-10 md:h-12 w-auto object-contain dark:invert"
              />
            </Link>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
              Haute Parfumerie & Décantation
            </p>
            <p className="text-xs sm:text-sm font-light text-muted-foreground leading-relaxed max-w-sm">
              Sélection rigoureuse des plus grandes maisons de parfum. Flacons originaux et échantillons décantés de 5ml à 20ml livrés partout au Maroc.
            </p>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-4">
              Nos Collections
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-muted-foreground">
              <li>
                <Link to="/collection/homme" className="hover:text-primary transition-colors">
                  Parfums Homme
                </Link>
              </li>
              <li>
                <Link to="/collection/femme" className="hover:text-primary transition-colors">
                  Parfums Femme
                </Link>
              </li>
              <li>
                <Link to="/collection/deodorants-stick" className="hover:text-primary transition-colors">
                  Déodorants Stick
                </Link>
              </li>
              <li>
                <Link to="/collection/packs" className="hover:text-primary transition-colors font-medium text-primary">
                  LES PACKS
                </Link>
              </li>
              <li>
                <Link to="/collection/all" className="hover:text-primary transition-colors">
                  Toute la Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Service Client & Engagements */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-4">
              Assistance & Engagements
            </h4>
            <div className="space-y-3.5 text-xs sm:text-sm font-light text-muted-foreground">
              <div className="flex flex-col gap-1.5 mb-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary-hover transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> À Propos de TABAT
                </Link>
                <Link
                  to="/about/service-client"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary-hover transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Service Client & Contact
                </Link>
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <Truck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-xs uppercase tracking-wider">Livraison Express</p>
                  <p className="text-xs">24–48h partout au Maroc</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-xs uppercase tracking-wider">Paiement Sécurisé</p>
                  <p className="text-xs">Règlement à la livraison</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-xs uppercase tracking-wider">Email</p>
                  <p className="text-xs">contact@tabatperfume.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs font-light text-muted-foreground/80">
            © {new Date().getFullYear()} TABAT. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-xs font-light text-muted-foreground/80">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Haute Parfumerie au Maroc</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
