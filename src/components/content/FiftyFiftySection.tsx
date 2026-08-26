import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Flame } from "lucide-react";

const CATEGORIES = [
  {
    title: "Parfums Homme",
    text: "Fragrances puissantes, boisées et ambrées.",
    href: "/collection/homme",
    src: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop",
    fallbackSrc: "/products/g87MYErZ4y721NboX4dgUZheBrJKrMQamehWpORN_md.jpg",
    alt: "Parfums Homme — TABAT",
    tag: "Masculin",
    highlight: "Best-sellers Niche",
  },
  {
    title: "Parfums Femme",
    text: "Sillages envoûtants, floraux et gourmands.",
    href: "/collection/femme",
    src: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
    fallbackSrc: "/products/lynd0GeO8jp8IAPSLqd5NIbsyvS6etaIniWkVsMv_md.jpg",
    alt: "Parfums Femme — TABAT",
    tag: "Féminin",
    highlight: "Sillages Rares",
  },
  {
    title: "Déodorants Stick",
    text: "Fraîcheur intense et protection longue durée 48h.",
    href: "/collection/deodorants-stick",
    src: "/products/kaGqhOEfyMLMuT81ymdfkblWvtk1Bf7rtiQtJrju_md.jpg",
    fallbackSrc: "/products/kaGqhOEfyMLMuT81ymdfkblWvtk1Bf7rtiQtJrju_md.jpg",
    alt: "Déodorants Stick — TABAT",
    tag: "Soin & Fraîcheur",
    highlight: "Protection 48h",
  },
  {
    title: "LES PACKS & COFFRETS",
    text: "Duos d'exception et coffrets découverte sur-mesure.",
    href: "/collection/packs",
    src: "/products/Klva1NBIVrAWITRlToAdkhN4pDMvlkXTrjHZXzCP_md.jpg",
    fallbackSrc: "/products/Klva1NBIVrAWITRlToAdkhN4pDMvlkXTrjHZXzCP_md.jpg",
    alt: "LES PACKS — TABAT",
    tag: "Offres Privilèges",
    highlight: "Économie & Cadeaux",
    isGold: true,
  },
];

const Card = ({
  title,
  text,
  href,
  src,
  fallbackSrc,
  alt,
  tag,
  highlight,
  isGold,
}: {
  title: string;
  text: string;
  href: string;
  src: string;
  fallbackSrc: string;
  alt: string;
  tag: string;
  highlight?: string;
  isGold?: boolean;
}) => (
  <div className={`group flex flex-col justify-between h-full bg-card/60 backdrop-blur-md border rounded-3xl p-3.5 sm:p-5 transition-all duration-500 hover:shadow-xl ${
    isGold ? "border-primary/40 hover:border-primary bg-primary/[0.03]" : "border-border/80 hover:border-primary/50"
  }`}>
    <div>
      <Link to={href} className="block overflow-hidden rounded-2xl mb-3.5 relative aspect-square bg-muted/60">
        <img
          src={src}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackSrc;
          }}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <span
          className={`absolute top-3 left-3 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold shadow-md backdrop-blur-md ${
            isGold
              ? "bg-primary text-primary-foreground font-bold shadow-primary/20"
              : "bg-black/75 text-white border border-white/20"
          }`}
        >
          {tag}
        </span>

        {highlight && (
          <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-wider text-white/90 font-mono font-medium backdrop-blur-md bg-black/50 px-2 py-0.5 rounded-md border border-white/10">
            {highlight}
          </span>
        )}
      </Link>

      <h3 className={`font-serif text-base sm:text-xl mb-1 font-bold truncate ${isGold ? "text-primary" : "text-foreground"}`}>
        {title}
      </h3>
      <p className="text-xs sm:text-sm font-light text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
        {text}
      </p>
    </div>

    <Link
      to={href}
      className={`inline-flex items-center justify-between w-full pt-3.5 border-t text-xs uppercase tracking-widest transition-all font-bold ${
        isGold
          ? "border-primary/30 text-primary hover:text-primary/90"
          : "border-border/60 text-foreground group-hover:text-primary"
      }`}
    >
      <span>Explorer la sélection</span>
      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
    </Link>
  </div>
);

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-14 sm:mb-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-2.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span>Haute Parfumerie</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl text-foreground font-bold tracking-tight">
          Explorez Nos Univers Olfactifs
        </h2>
        <div className="w-12 h-0.5 bg-primary/50 mx-auto mt-2.5 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.map((cat, i) => (
          <Card key={i} {...cat} />
        ))}
      </div>
    </section>
  );
};

export default FiftyFiftySection;
