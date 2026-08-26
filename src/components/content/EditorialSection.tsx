import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

const kpis = [
  {
    number: "01",
    icon: Truck,
    title: "Livraison Rapide",
    description: "24–48h partout au Maroc.",
    detail: "Expédition express sécurisée",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Paiement à la Livraison",
    description: "Achetez en toute confiance",
    detail: "Règlement à la réception",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Qualité Premium",
    description: "Produits soigneusement sélectionnés",
    detail: "100% Produits Authentiques",
  },
];

const EditorialSection = () => {
  return (
    <section className="w-full mb-16 sm:mb-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium mb-2.5">
          L'Engagement TABAT
        </p>
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-foreground tracking-tight mb-3">
          Pourquoi Choisir <span className="text-primary italic font-serif">TABAT</span> ?
        </h2>
        <div className="w-12 h-[1px] bg-primary/40 mx-auto" />
      </div>

      {/* 3 KPI Luxury Banner / Grid */}
      <div className="relative rounded-xl sm:rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-md p-4 sm:p-10 shadow-sm overflow-hidden">
        {/* Subtle background glow pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary/15 relative z-10 gap-6 md:gap-0">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="group relative px-2 sm:px-8 py-5 sm:py-6 transition-all duration-500 hover:bg-primary/[0.03] flex flex-col justify-between"
              >
                {/* Number & Icon Row */}
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/25 bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-md group-hover:shadow-primary/20 transition-all duration-500">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <span className="font-serif text-xl sm:text-2xl font-light text-primary/40 group-hover:text-primary transition-colors duration-500">
                      {kpi.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-2xl text-foreground mb-1.5 sm:mb-2 group-hover:text-primary transition-colors duration-300">
                    {kpi.title}
                  </h3>

                  {/* Main Description */}
                  <p className="text-xs sm:text-sm font-light text-foreground/80 leading-relaxed mb-3 sm:mb-4">
                    {kpi.description}
                  </p>
                </div>

                {/* Footer Tag */}
                <div className="pt-3 border-t border-primary/10 flex items-center justify-between text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  <span>{kpi.detail}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-125 transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Link */}
      <div className="mt-8 sm:mt-10 text-center">
        <Link
          to="/about/service-client"
          className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary hover:text-primary-hover hover:gap-3 transition-all font-medium py-2.5 px-6 rounded-full border border-primary/25 hover:border-primary/50 hover:bg-primary/5"
        >
          Service Client & Contact <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};

export default EditorialSection;
