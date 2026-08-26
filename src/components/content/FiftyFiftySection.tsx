import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CATEGORIES = [
  {
    title: "Parfums Homme",
    text: "Fragrances puissantes, chaudes et raffinées.",
    href: "/collection/homme",
    src: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop",
    fallbackSrc: "/products/g87MYErZ4y721NboX4dgUZheBrJKrMQamehWpORN_md.jpg",
    alt: "Parfums Homme — TABAT",
    tag: "Masculin",
  },
  {
    title: "Parfums Femme",
    text: "Sillages envoûtants, floraux et sophistiqués.",
    href: "/collection/femme",
    src: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
    fallbackSrc: "/products/lynd0GeO8jp8IAPSLqd5NIbsyvS6etaIniWkVsMv_md.jpg",
    alt: "Parfums Femme — TABAT",
    tag: "Féminin",
  },
  {
    title: "Déodorants Stick",
    text: "Protection fraîcheur intense et protection 48h.",
    href: "/collection/deodorants-stick",
    src: "/products/kaGqhOEfyMLMuT81ymdfkblWvtk1Bf7rtiQtJrju_md.jpg",
    fallbackSrc: "/products/kaGqhOEfyMLMuT81ymdfkblWvtk1Bf7rtiQtJrju_md.jpg",
    alt: "Déodorants Stick — TABAT",
    tag: "Soin & Fraîcheur",
  },
  {
    title: "LES PACKS",
    text: "Packs exclusifs et duos d'exception à prix doux.",
    href: "/collection/packs",
    src: "/products/Klva1NBIVrAWITRlToAdkhN4pDMvlkXTrjHZXzCP_md.jpg",
    fallbackSrc: "/products/Klva1NBIVrAWITRlToAdkhN4pDMvlkXTrjHZXzCP_md.jpg",
    alt: "LES PACKS — TABAT",
    tag: "Offres Exclusives",
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
  isGold,
}: {
  title: string;
  text: string;
  href: string;
  src: string;
  fallbackSrc: string;
  alt: string;
  tag: string;
  isGold?: boolean;
}) => (
  <div className="group flex flex-col justify-between h-full bg-card/40 border border-border/70 rounded-2xl p-3 sm:p-4 hover:border-primary/50 transition-all duration-500 hover:shadow-lg">
    <div>
      <Link to={href} className="block overflow-hidden rounded-xl mb-3 relative aspect-square bg-muted">
        <img
          src={src}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackSrc;
          }}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
        <span
          className={`absolute top-2.5 left-2.5 text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-semibold shadow-md backdrop-blur-md ${
            isGold
              ? "bg-primary text-primary-foreground font-bold"
              : "bg-black/70 text-white border border-white/20"
          }`}
        >
          {tag}
        </span>
      </Link>

      <h3 className={`font-serif text-base sm:text-xl mb-1 font-medium truncate ${isGold ? "text-primary" : "text-foreground"}`}>
        {title}
      </h3>
      <p className="text-xs sm:text-sm font-light text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
        {text}
      </p>
    </div>

    <Link
      to={href}
      className={`inline-flex items-center justify-between w-full pt-3 border-t border-border/50 text-[11px] sm:text-xs uppercase tracking-widest transition-all font-semibold ${
        isGold ? "text-primary hover:text-primary-hover" : "text-foreground hover:text-primary"
      }`}
    >
      <span>Explorer</span>
      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  </div>
);

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-12 sm:mb-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
          <span>Haute Parfumerie</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl text-foreground font-medium tracking-tight">
          Explorez Nos Collections
        </h2>
        <div className="w-10 h-0.5 bg-primary/40 mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        {CATEGORIES.map((cat, i) => (
          <Card key={i} {...cat} />
        ))}
      </div>
    </section>
  );
};

export default FiftyFiftySection;
