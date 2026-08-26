import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Card = ({
  title,
  text,
  href,
  src,
  alt,
}: {
  title: string;
  text: string;
  href: string;
  src: string;
  alt: string;
}) => (
  <div className="group flex flex-col justify-between h-full">
    <div>
      <Link to={href} className="block overflow-hidden rounded-md mb-3 sm:mb-4 bg-muted">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          width={1200}
          height={1200}
          className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <h3 className="font-serif text-base sm:text-2xl text-foreground mb-1 font-medium truncate">{title}</h3>
      <p className="text-xs sm:text-sm font-light text-muted-foreground mb-3 line-clamp-2">{text}</p>
    </div>
    <Link
      to={href}
      className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-widest text-primary hover:gap-2.5 transition-all font-medium"
    >
      Explorer <ArrowRight size={13} />
    </Link>
  </div>
);

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-16 sm:mb-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-1.5 font-medium">Nos Catégories</p>
        <h2 className="font-serif text-2xl sm:text-4xl text-foreground">Explorez Nos Collections</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        <Card
          title="Parfums Homme"
          text="Fragrances puissantes et raffinées."
          href="/collection/homme"
          src="/products/g87MYErZ4y721NboX4dgUZheBrJKrMQamehWpORN_md.jpg"
          alt="Parfums Homme — TABAT"
        />
        <Card
          title="Parfums Femme"
          text="Sillages envoûtants et élégants."
          href="/collection/femme"
          src="/products/lynd0GeO8jp8IAPSLqd5NIbsyvS6etaIniWkVsMv_md.jpg"
          alt="Parfums Femme — TABAT"
        />
        <Card
          title="Déodorants Stick"
          text="Fraîcheur intense et protection 48h."
          href="/collection/deodorants-stick"
          src="/products/kaGqhOEfyMLMuT81ymdfkblWvtk1Bf7rtiQtJrju_md.jpg"
          alt="Déodorants Stick — TABAT"
        />
        <Card
          title="LES PACKS"
          text="Packs exclusifs et duos d'exception."
          href="/collection/packs"
          src="/products/Klva1NBIVrAWITRlToAdkhN4pDMvlkXTrjHZXzCP_md.jpg"
          alt="LES PACKS — TABAT"
        />
      </div>
    </section>
  );
};

export default FiftyFiftySection;
