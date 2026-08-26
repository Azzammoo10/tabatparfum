import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Star, Award, ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const heroBadges = [
  { icon: ShieldCheck, text: "100% Authentiques" },
  { icon: Truck, text: "Livraison 24–48h Maroc" },
  { icon: Award, text: "Décantation Artisanale" },
  { icon: Star, text: "4.9/5 Avis Clients" },
];

const SLIDES = [
  {
    id: 1,
    tag: "TABAT • Haute Parfumerie",
    titlePrefix: "L'Essence du ",
    titleHighlight: "Prestige",
    subtitle: "Parfums d'exception 100% authentiques en format décant 5ml & 10ml.",
    btnText: "Découvrir la Collection",
    btnLink: "/collection/all",
    bgImage: heroImage,
  },
  {
    id: 2,
    tag: "Décantage Artisanale",
    titlePrefix: "L'Art du ",
    titleHighlight: "Décant",
    subtitle: "Flacon en verre spray de précision. Plus de 130 pulvérisations.",
    btnText: "Découvrir la Collection",
    btnLink: "/collection/all",
    bgImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    tag: "Livraison Express Maroc",
    titlePrefix: "L'Élégance à ",
    titleHighlight: "Chaque Commande",
    subtitle: "Expédition rapide sous 24 à 48h avec paiement à la livraison.",
    btnText: "Commander en Ligne",
    btnLink: "/collection/all",
    bgImage: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2000&auto=format&fit=crop",
  },
];

const LargeHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="w-full mb-8 sm:mb-14 px-3 sm:px-6 max-w-5xl lg:max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-primary/30 shadow-2xl group min-h-[440px] sm:min-h-[500px] md:min-h-[520px] lg:min-h-[550px] bg-black">
        {/* Guaranteed Base Fallback Image */}
        <img
          src={heroImage}
          alt="Base Background - TABAT"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        {/* Slide Images Layer with Full Image Clarity */}
        {SLIDES.map((s, index) => (
          <img
            key={s.id}
            src={s.bgImage}
            onError={(e) => {
              (e.target as HTMLImageElement).src = heroImage;
            }}
            alt={`Hero Background ${s.titleHighlight} - TABAT`}
            className={`absolute inset-0 w-full h-full object-cover object-center z-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          />
        ))}

        {/* Light Minimalist Gradient Overlay - Clean & Vibrant */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 z-1 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 z-1 pointer-events-none" />

        {/* FLOATING GLASS SPRAY BOTTLE BADGE */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 hidden xs:flex flex-col items-center bg-black/75 backdrop-blur-md border border-primary/40 rounded-2xl p-2.5 md:p-3 shadow-xl animate-float-slow pointer-events-none">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary animate-pulse" />
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary font-bold">TABAT</span>
          </div>
          <div className="flex flex-col items-center py-1">
            <div className="w-3.5 h-3 md:w-4 md:h-3.5 bg-gradient-to-b from-[#111] to-[#333] rounded-t-[2px]" />
            <div className="w-3 h-9 md:w-3.5 md:h-10 border-x border-b border-primary/70 bg-primary/30 rounded-b-[2px] relative shadow-inner">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-[90%] bg-white/40" />
            </div>
          </div>
          <span className="text-[8px] md:text-[9px] text-white/90 font-mono font-medium mt-1">10ml Spray</span>
        </div>

        {/* Left & Right Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
          className="absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-black/40 hover:bg-primary text-white hover:text-primary-foreground border border-white/20 hover:border-primary items-center justify-center transition-all duration-300 backdrop-blur-sm"
          aria-label="Slide précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-black/40 hover:bg-primary text-white hover:text-primary-foreground border border-white/20 hover:border-primary items-center justify-center transition-all duration-300 backdrop-blur-sm"
          aria-label="Slide suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Main Hero Content Center */}
        <div className="relative min-h-[440px] sm:min-h-[500px] md:min-h-[520px] lg:min-h-[550px] flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 py-8 z-10">
          {/* Minimal Eyebrow Tag */}
          <div
            key={`tag-${slide.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-0.5 md:px-3.5 md:py-1 rounded-full bg-black/60 backdrop-blur-md border border-primary/40 text-primary text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase mb-2.5 md:mb-3.5 shadow-md animate-in zoom-in-95 fade-in duration-500"
          >
            <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary animate-pulse shrink-0" />
            <span>{slide.tag}</span>
          </div>

          {/* Clean Airy Title */}
          <h1
            key={`title-${slide.id}`}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight max-w-3xl leading-tight drop-shadow-xl animate-in fade-in duration-500"
          >
            {slide.titlePrefix}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8E7] to-[#C9A96E] font-serif font-bold italic">
              {slide.titleHighlight}
            </span>
          </h1>

          {/* Concise Subtitle */}
          <p
            key={`sub-${slide.id}`}
            className="mt-2.5 sm:mt-3.5 md:mt-4 text-xs sm:text-base md:text-base font-light text-white/90 max-w-md md:max-w-lg leading-relaxed drop-shadow-md px-2 animate-in fade-in duration-500"
          >
            {slide.subtitle}
          </p>

          {/* Single Clean Primary Action Button */}
          <div className="mt-4 sm:mt-6 md:mt-7 z-20">
            <Button
              asChild
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary-hover uppercase tracking-wider text-[11px] sm:text-xs md:text-xs h-10 sm:h-11 md:h-11 px-7 md:px-8 shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-300 gap-2 font-semibold"
            >
              <Link to={slide.btnLink}>
                {slide.btnText} <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </Button>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2 md:gap-2.5 mt-5 md:mt-7 z-20">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 md:h-1.5 rounded-full transition-all duration-500 ${
                  currentSlide === index
                    ? "w-7 md:w-8 bg-primary shadow-xs"
                    : "w-2 md:w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Aller à la slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Trust Badges Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-md border-t border-white/10 py-2.5 md:py-3.5 px-3 sm:px-6 md:px-8 z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-5xl mx-auto text-center">
            {heroBadges.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="flex items-center justify-center gap-1.5 md:gap-2 text-white/90 text-[10px] sm:text-xs md:text-sm font-light tracking-wide truncate"
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
                  <span className="truncate">{b.text}</span>
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
