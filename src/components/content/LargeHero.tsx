import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  Compass,
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const heroBadges = [
  { icon: ShieldCheck, title: "100% Authentiques", desc: "Flacons d'origine certifiés" },
  { icon: Truck, title: "Livraison 24–48h", desc: "Partout au Maroc" },
  { icon: Award, title: "Décants de Précision", desc: "Formats nomades 5ml & 10ml" },
  { icon: Star, title: "Paiement à la Livraison", desc: "En espèces à la réception" },
];

const SLIDES = [
  {
    id: 1,
    tag: "TABAT • Haute Parfumerie",
    titlePrefix: "L'Essence du ",
    titleHighlight: "Prestige",
    subtitle: "Découvrez les plus grandes créations olfactives au monde en décants authentiques 5ml & 10ml.",
    btnText: "Découvrir la Collection",
    btnLink: "/collection/all",
    secondaryBtnText: "Parfums Homme",
    secondaryBtnLink: "/collection/homme",
    bgImage: heroImage,
  },
  {
    id: 2,
    tag: "Artisans Décanteurs",
    titlePrefix: "L'Art du ",
    titleHighlight: "Décant Sur-Mesure",
    subtitle: "Flacons en verre noble avec pulvérisateur en aluminium. Plus de 130 pulvérisations généreuses.",
    btnText: "Explorer les Décants",
    btnLink: "/collection/all",
    secondaryBtnText: "Parfums Femme",
    secondaryBtnLink: "/collection/femme",
    bgImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    tag: "Packs & Nouveautés",
    titlePrefix: "Le Sillage de la ",
    titleHighlight: "Distinction",
    subtitle: "Packs exclusifs, déodorants stick haut de gamme et fragrances rares livrés directement chez vous.",
    btnText: "Voir les Packs",
    btnLink: "/collection/packs",
    secondaryBtnText: "Déodorants Stick",
    secondaryBtnLink: "/collection/deodorants-stick",
    bgImage: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2000&auto=format&fit=crop",
  },
];

const LargeHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="w-full mb-10 sm:mb-16 px-3 sm:px-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-2xl group min-h-[460px] sm:min-h-[520px] md:min-h-[550px] lg:min-h-[580px] bg-black">
        {/* Base Fallback Image */}
        <img
          src={heroImage}
          alt="Base Background - TABAT"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        {/* Slide Images Layer */}
        {SLIDES.map((s, index) => (
          <img
            key={s.id}
            src={s.bgImage}
            onError={(e) => {
              (e.target as HTMLImageElement).src = heroImage;
            }}
            alt={`Hero Background ${s.titleHighlight} - TABAT`}
            className={`absolute inset-0 w-full h-full object-cover object-center z-0 transition-all duration-1000 ease-in-out ${
              currentSlide === index
                ? "opacity-100 scale-100 filter-none"
                : "opacity-0 scale-105 pointer-events-none"
            }`}
          />
        ))}

        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 z-1 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-1 pointer-events-none" />

        {/* FLOATING GLASS SPRAY BOTTLE BADGE */}
        <div className="absolute top-5 right-5 md:top-7 md:right-7 z-20 hidden xs:flex flex-col items-center bg-black/80 backdrop-blur-xl border border-primary/40 rounded-2xl p-3 shadow-2xl animate-float-slow pointer-events-none">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Édition Spéciale</span>
          </div>
          <div className="flex flex-col items-center py-1">
            <div className="w-4 h-3.5 bg-gradient-to-b from-[#111] to-[#333] rounded-t-[2px]" />
            <div className="w-3.5 h-11 border-x border-b border-primary/70 bg-primary/30 rounded-b-[2px] relative shadow-inner">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-[90%] bg-white/40" />
            </div>
          </div>
          <span className="text-[9px] text-white/90 font-serif font-bold mt-1.5">Décant 10ml</span>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
          className="absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white hover:text-primary-foreground border border-white/20 hover:border-primary items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer"
          aria-label="Slide précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white hover:text-primary-foreground border border-white/20 hover:border-primary items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer"
          aria-label="Slide suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Main Hero Content */}
        <div className="relative min-h-[460px] sm:min-h-[520px] md:min-h-[550px] lg:min-h-[580px] flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 py-10 z-10">
          {/* Eyebrow Pill */}
          <div
            key={`tag-${slide.id}`}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/70 backdrop-blur-xl border border-primary/40 text-primary text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-3 shadow-lg animate-in zoom-in-95 fade-in duration-500"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse shrink-0" />
            <span>{slide.tag}</span>
          </div>

          {/* Title */}
          <h1
            key={`title-${slide.id}`}
            className="font-serif text-3.5xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight max-w-3xl leading-[1.1] drop-shadow-2xl animate-in fade-in duration-500"
          >
            {slide.titlePrefix}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C368] via-[#FFF3D6] to-[#C9A96E] font-serif font-bold italic">
              {slide.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            key={`sub-${slide.id}`}
            className="mt-3 sm:mt-4 md:mt-5 text-xs sm:text-base md:text-lg font-light text-white/90 max-w-lg md:max-w-xl leading-relaxed drop-shadow-md px-2 animate-in fade-in duration-500"
          >
            {slide.subtitle}
          </p>

          {/* Double Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 sm:mt-8 z-20">
            <Button
              asChild
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-xs font-bold h-11 sm:h-12 px-8 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 gap-2 cursor-pointer border-0"
            >
              <Link to={slide.btnLink}>
                <span>{slide.btnText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            {slide.secondaryBtnLink && (
              <Button
                asChild
                variant="outline"
                className="rounded-full bg-black/40 hover:bg-black/60 text-white border-white/30 hover:border-primary uppercase tracking-wider text-xs font-semibold h-11 sm:h-12 px-7 backdrop-blur-md transition-all duration-300 cursor-pointer"
              >
                <Link to={slide.secondaryBtnLink}>
                  <span>{slide.secondaryBtnText}</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2 mt-6 sm:mt-8 z-20">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  currentSlide === index
                    ? "w-8 bg-primary shadow-sm"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Aller à la slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Trust Badges Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-black/85 backdrop-blur-xl border-t border-white/10 py-3 px-3 sm:px-6 md:px-8 z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto text-center">
            {heroBadges.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 text-white/90 text-xs sm:text-sm tracking-wide"
                >
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <div className="text-left leading-tight hidden xs:block">
                    <span className="font-semibold block text-[11px] sm:text-xs text-white">{b.title}</span>
                    <span className="text-[9px] sm:text-[10px] text-white/70 font-light">{b.desc}</span>
                  </div>
                  <span className="xs:hidden text-[10px] font-semibold">{b.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LargeHero;
