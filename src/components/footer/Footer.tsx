import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Mail, Sparkles, MessageSquare, Instagram } from "lucide-react";

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.884 0-3.649-.508-5.176-1.393l-.371-.215-3.847 1.009 1.026-3.748-.236-.375c-.97-1.545-1.482-3.344-1.482-5.187 0-5.385 4.381-9.766 9.766-9.766 5.384 0 9.765 4.381 9.765 9.766 0 5.384-4.381 9.765-9.765 9.765m0-21.5c-6.48 0-11.754 5.274-11.754 11.754 0 2.07.539 4.095 1.562 5.88l-1.658 6.059 6.2-1.626c1.716.936 3.659 1.44 5.65 1.44 6.479 0 11.754-5.274 11.754-11.754s-5.275-11.753-11.754-11.753" />
  </svg>
);

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
            <div className="pt-1">
              <a
                href="https://www.instagram.com/tabatperfumes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram TABAT"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 bg-background/50 hover:border-primary hover:text-primary text-xs font-medium transition-all duration-200"
              >
                <Instagram className="w-3.5 h-3.5 text-primary" />
                <span>@tabatperfumes</span>
              </a>
            </div>
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

              <a
                href="https://wa.me/212752850156?text=Bonjour%20TABAT%2C%20je%20souhaite%20avoir%20des%20informations%20sur%20vos%20parfums%20et%20passer%20commande."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-emerald-500 transition-colors group cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-foreground text-xs uppercase tracking-wider group-hover:text-emerald-500 transition-colors">WhatsApp Direct</p>
                  <p className="text-xs">+212 752-850156</p>
                </div>
              </a>

              <a
                href="https://www.instagram.com/tabatperfumes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-primary transition-colors group cursor-pointer"
              >
                <Instagram className="w-4 h-4 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-foreground text-xs uppercase tracking-wider group-hover:text-primary transition-colors">Instagram</p>
                  <p className="text-xs">@tabatperfumes</p>
                </div>
              </a>

              <div className="flex items-start gap-2.5">
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
          <div className="flex items-center gap-4 text-xs font-light text-muted-foreground/80">
            <a
              href="https://wa.me/212752850156?text=Bonjour%20TABAT%2C%20je%20souhaite%20avoir%20des%20informations%20sur%20vos%20parfums%20et%20passer%20commande."
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-500 flex items-center gap-1.5 transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>WhatsApp</span>
            </a>
            <span>•</span>
            <a
              href="https://www.instagram.com/tabatperfumes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center gap-1.5 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-primary" />
              <span>Instagram</span>
            </a>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Haute Parfumerie au Maroc</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
