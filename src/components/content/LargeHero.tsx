import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Star, Award } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const heroBadges = [
  { icon: ShieldCheck, text: "100% Authentiques" },
  { icon: Truck, text: "Livraison 24–48h Maroc" },
  { icon: Award, text: "Décantation Artisanale" },
  { icon: Star, text: "4.9/5 Satisfaction Client" },
];

const LargeHero = () => {
  return (
    <section className="w-full mb-12 sm:mb-20 px-3 sm:px-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-primary/20 shadow-xl group">
        {/* Hero Background Image */}
        <img
          src={heroImage}
          alt="Flacon de parfum de luxe sur marbre - TABAT"
          width={1920}
          height={1080}
          className="w-full h-[480px] sm:h-[600px] md:h-[680px] object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Multi-layer Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

        {/* Hero Content Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-6 sm:py-10 z-10">
          
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-primary/40 text-primary text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase mb-4 shadow-lg">
            <Sparkles className="w-3 h-3 text-primary animate-pulse shrink-0" />
            <span className="truncate">Haute Parfumerie & Décantation</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight max-w-4xl leading-[1.15] drop-shadow-2xl">
            L'Essence du <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A96E] via-[#F3E5C8] to-[#C9A96E] italic font-serif">Prestige</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-5 text-xs sm:text-base md:text-lg font-light text-white/90 max-w-lg leading-relaxed drop-shadow-md px-2">
            Des fragrances d'exception sélectionnées par TABAT. Décants et flacons scellés livrés partout au Maroc.
          </p>

          {/* Compact Luxury Buttons (Fit naturally, not overly wide) */}
          <div className="mt-6 sm:mt-8 flex flex-row flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary-hover uppercase tracking-wider text-[11px] sm:text-xs h-10 sm:h-11 px-5 sm:px-7 shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300 gap-1.5 font-medium"
            >
              <Link to="/collection/all">
                Découvrir <ArrowRight size={14} />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full bg-black/40 backdrop-blur-md border-white/30 text-white hover:bg-white/10 hover:border-primary/60 uppercase tracking-wider text-[11px] sm:text-xs h-10 sm:h-11 px-5 sm:px-7 transition-all duration-300 font-medium"
            >
              <Link to="/collection/packs">
                Les Packs
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Trust Badges Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-md border-t border-white/10 py-2.5 sm:py-3.5 px-3 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 max-w-6xl mx-auto text-center">
            {heroBadges.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="flex items-center justify-center gap-1.5 text-white/90 text-[10px] sm:text-xs font-light tracking-wide truncate">
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
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
