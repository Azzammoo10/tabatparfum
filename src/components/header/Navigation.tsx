import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag as BagIcon, Menu, X, Sparkles, ChevronRight, ShieldCheck } from "lucide-react";
import ShoppingBag from "./ShoppingBag";
import { useCart } from "@/store/cart";
import ThemeToggle from "@/components/ThemeToggle";
import { useParfums } from "@/hooks/useParfums";
import { formatMAD } from "@/lib/sizes";

const desktopNavLeft = [
  { name: "Homme", href: "/collection/homme" },
  { name: "Femme", href: "/collection/femme" },
];

const desktopNavRight = [
  { name: "Déodorants Stick", href: "/collection/deodorants-stick" },
  { name: "Les Packs", href: "/collection/packs", isGold: true },
];

const mobileNavLinks = [
  { name: "Toute la Collection", href: "/collection/all", sub: "Toutes nos fragrances d'exception", isGold: true },
  { name: "Parfums Homme", href: "/collection/homme", sub: "Fragrances masculines & élégantes" },
  { name: "Parfums Femme", href: "/collection/femme", sub: "Sillages féminins & envoûtants" },
  { name: "Déodorants Stick", href: "/collection/deodorants-stick", sub: "Protection fraîcheur 48h" },
];

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { totalItems } = useCart();
  const { data: allParfums } = useParfums();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const filteredParfums = searchQuery.trim()
    ? allParfums
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.maison.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSelectProduct = (id: string) => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setSearchQuery("");
    navigate(`/parfum/${id}`);
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    navigate(href);
  };

  return (
    <nav className="relative bg-background border-b border-border z-[100]">
      <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Left Mobile Menu Trigger & Desktop Links */}
        <div className="flex items-center flex-1">
          <button
            className="md:hidden p-2 -ml-1 text-foreground hover:text-primary transition-colors rounded-lg active:scale-95 flex items-center gap-1.5"
            onClick={() => {
              setIsSearchOpen(false);
              setIsMobileMenuOpen((v) => !v);
            }}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X size={20} className="text-primary" />
            ) : (
              <Menu size={20} className="text-foreground" />
            )}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
              Menu
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-6">
            {desktopNavLeft.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="group relative text-xs uppercase tracking-[0.2em] font-medium text-foreground hover:text-primary transition-colors py-2"
              >
                <span>{item.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* Center Logo */}
        <Link
          to="/"
          className="flex items-center justify-center py-1 transition-transform duration-300 hover:scale-105"
        >
          <img
            src="/logo.png"
            alt="TABAT"
            className="h-8 sm:h-10 md:h-11 w-auto object-contain dark:invert"
          />
        </Link>

        {/* Right Desktop Links & Actions */}
        <div className="flex items-center justify-end flex-1 gap-1 sm:gap-2">
          <div className="hidden md:flex items-center space-x-6 mr-3">
            {desktopNavRight.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative text-xs uppercase tracking-[0.2em] font-medium transition-colors py-2 ${
                  item.isGold
                    ? "text-primary font-semibold"
                    : "text-foreground hover:text-primary"
                }`}
              >
                <span>{item.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <ThemeToggle />

          {/* Search Trigger */}
          <button
            className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-primary/5 active:scale-95"
            aria-label="Recherche"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSearchOpen((v) => !v);
            }}
          >
            <Search size={18} strokeWidth={1.75} />
          </button>

          {/* Cart Trigger */}
          <button
            className="p-2 text-foreground/80 hover:text-primary transition-colors relative rounded-full hover:bg-primary/5 active:scale-95"
            aria-label="Panier"
            onClick={() => setIsBagOpen(true)}
          >
            <BagIcon size={18} strokeWidth={1.75} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Page Dimming Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-24 bg-black/60 z-40 animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* REFINED COMPACT MOBILE DROPDOWN MENU (NO EMOJIS - LUXURY STYLING) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background text-foreground border-b-2 border-primary/30 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
                Collections TABAT
              </p>
              <span className="text-[10px] font-brand text-primary">Haute Parfumerie</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {mobileNavLinks.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleNavClick(cat.href)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left border transition-all active:scale-[0.98] ${
                    cat.isGold
                      ? "bg-primary/10 border-primary/40 text-primary font-medium shadow-xs"
                      : "bg-card border-border/80 text-foreground hover:border-primary/40"
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <span>{cat.name}</span>
                      {cat.isGold && <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-light mt-0.5">
                      {cat.sub}
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-primary/70" />
                </button>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-border/60 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-medium">
                Livraison 24-48h partout au Maroc • Paiement à la livraison
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-background text-foreground border-b-2 border-primary/30 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="p-4 max-w-xl mx-auto space-y-3">
            <div className="flex items-center bg-card border border-border rounded-xl px-3.5 py-2">
              <Search size={16} className="text-primary mr-2 shrink-0" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un parfum, une maison..."
                className="w-full bg-transparent text-sm text-foreground outline-none font-light placeholder:text-muted-foreground"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X size={16} />
              </button>
            </div>

            {searchQuery.trim() !== "" && (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {filteredParfums.length > 0 ? (
                  filteredParfums.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors text-left"
                    >
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded border border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                          {product.maison}
                        </p>
                        <h4 className="font-serif text-xs font-medium text-foreground truncate">
                          {product.name}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-primary shrink-0">
                        {formatMAD(product.price_5ml)}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    Aucun résultat trouvé
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <ShoppingBag isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />
    </nav>
  );
};

export default Navigation;
