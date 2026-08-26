import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Seo from "@/components/Seo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Truck, CreditCard, Headphones, HeartHandshake, ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const whyUsFeatures = [
  {
    icon: ShieldCheck,
    title: "Qualité Sélectionnée",
    desc: "Nous sélectionnons nos produits avec le plus grand soin afin de garantir une expérience à la hauteur de vos attentes.",
  },
  {
    icon: Truck,
    title: "Livraison Rapide",
    desc: "Nous livrons partout au Maroc sous 24 à 48 heures pour que vous puissiez profiter rapidement de vos produits préférés.",
  },
  {
    icon: CreditCard,
    title: "Paiement à la Livraison",
    desc: "Commandez en toute confiance grâce au paiement en espèces à la réception de votre colis.",
  },
  {
    icon: Headphones,
    title: "Service Client Dédié",
    desc: "Notre équipe reste disponible pour répondre à vos questions et vous accompagner à chaque étape.",
  },
];

const selectionItems = [
  "Parfums Homme d'exception",
  "Parfums Femme raffinés",
  "Déodorants Stick Premium",
  "Meilleures Ventes plébiscitées",
];

const AboutTabat = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="À Propos de TABAT | L'élégance au quotidien, le parfum comme signature"
        description="Chez Tabat, nous croyons qu'un parfum est une signature personnelle. Découvrir notre histoire, notre vision et nos engagements de qualité au Maroc."
        path="/about"
      />
      <Header />

      <main className="flex-1 pt-4 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase">
              <Sparkles className="w-3 h-3 text-primary animate-pulse shrink-0" />
              <span>L'Univers TABAT</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-foreground font-medium tracking-tight">
              À Propos de <span className="text-primary italic font-serif">TABAT</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
              Chez Tabat, nous croyons qu'un parfum est bien plus qu'une simple fragrance. C'est une signature personnelle, une émotion, un souvenir et une expression de votre identité.
            </p>

            <div className="w-12 h-0.5 bg-primary/40 mx-auto pt-1" />
          </div>

          {/* Intro Quote Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-card/60 backdrop-blur-md p-6 sm:p-10 text-center shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
            <blockquote className="relative z-10 font-serif text-lg sm:text-2xl text-foreground italic font-light max-w-3xl mx-auto leading-relaxed">
              « Née d'une passion pour l'élégance, le raffinement et le bien-être, Tabat a été créée pour offrir aux femmes et aux hommes au Maroc une sélection de produits qui allient qualité, sophistication et plaisir au quotidien. »
            </blockquote>
          </div>

          {/* Vision & Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Card 1: Notre Vision */}
            <div className="bg-card/50 border border-border/70 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground font-medium">
                  Notre Vision
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                  Notre ambition est de devenir une référence marocaine dans l'univers des parfums et des soins personnels premium. Nous souhaitons proposer des produits soigneusement sélectionnés qui permettent à chacun de se sentir confiant, élégant et unique.
                </p>
              </div>

              <div className="pt-3 border-t border-border/40 text-[10px] uppercase tracking-widest text-primary font-semibold">
                Excellence & Sophistication
              </div>
            </div>

            {/* Card 2: Notre Sélection */}
            <div className="bg-card/50 border border-border/70 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground font-medium">
                  Notre Sélection
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                  Chaque produit disponible chez Tabat est choisi avec attention afin de répondre à nos exigences de qualité et de performance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {selectionItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground bg-background/60 p-2 rounded-xl border border-border/50">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 text-[10px] uppercase tracking-widest text-primary font-semibold">
                Expérience Sensorielle Unique
              </div>
            </div>
          </div>

          {/* Pourquoi Choisir Tabat ? */}
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-1.5">
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
                Nos Valeurs
              </p>
              <h2 className="font-serif text-2xl sm:text-4xl text-foreground font-medium">
                Pourquoi Choisir Tabat ?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {whyUsFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="bg-card/40 border border-border/70 rounded-2xl p-5 text-center space-y-3 hover:border-primary/50 hover:bg-card/70 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      {f.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notre Engagement & Conclusion Banner */}
          <div className="bg-card border border-primary/30 rounded-2xl p-6 sm:p-10 text-center space-y-6 shadow-md">
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-medium">
                Notre Engagement
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                Chez Tabat, la satisfaction de nos clients est au cœur de nos priorités. Nous nous engageons à offrir une expérience d'achat simple, sécurisée et agréable, depuis votre première visite jusqu'à la réception de votre commande.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6">
              <p className="font-serif text-base sm:text-lg text-primary italic font-semibold">
                « Tabat — L'élégance au quotidien, le parfum comme signature. »
              </p>
              <p className="text-xs text-muted-foreground font-light mt-1">
                Merci de faire partie de l'univers Tabat.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  asChild
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary-hover uppercase tracking-wider text-xs h-11 px-7 shadow-md gap-2"
                >
                  <Link to="/collection/all">
                    Découvrir la Collection <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-border hover:border-primary uppercase tracking-wider text-xs h-11 px-7"
                >
                  <Link to="/about/service-client">
                    Service Client & Contact
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutTabat;
