import { useEffect, useState } from "react";
import { Truck, ShieldCheck, Sparkles } from "lucide-react";

const StatusBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const usps = [
    { text: "Livraison Rapide 24–48h partout au Maroc", icon: Truck },
    { text: "Paiement à la Livraison — Achetez en toute confiance", icon: ShieldCheck },
    { text: "100% Parfums Authentiques & Décantation Artisanale", icon: Sparkles },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % usps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [usps.length]);

  const CurrentIcon = usps[currentIndex].icon;

  return (
    <div className="bg-[#111827] text-[#C9A96E] dark:bg-[#C9A96E] dark:text-[#111827] py-1.5 px-4 text-center border-b border-primary/20 transition-colors">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <CurrentIcon className="w-3.5 h-3.5 shrink-0 animate-pulse" />
        <p
          key={currentIndex}
          className="text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-500 ease-in-out animate-fade-in truncate"
        >
          {usps[currentIndex].text}
        </p>
      </div>
    </div>
  );
};

export default StatusBar;