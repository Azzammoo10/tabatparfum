import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Sparkles, Instagram } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings } from "@/hooks/useAppSettings";

type QA = { id: string; question: string; answer: string };
type Msg = { id: string; from: "bot" | "user"; text: string };

const uid = () => Math.random().toString(36).slice(2);

const WhatsAppIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.884 0-3.649-.508-5.176-1.393l-.371-.215-3.847 1.009 1.026-3.748-.236-.375c-.97-1.545-1.482-3.344-1.482-5.187 0-5.385 4.381-9.766 9.766-9.766 5.384 0 9.765 4.381 9.765 9.766 0 5.384-4.381 9.765-9.765 9.765m0-21.5c-6.48 0-11.754 5.274-11.754 11.754 0 2.07.539 4.095 1.562 5.88l-1.658 6.059 6.2-1.626c1.716.936 3.659 1.44 5.65 1.44 6.479 0 11.754-5.274 11.754-11.754s-5.275-11.753-11.754-11.753" />
  </svg>
);

const DEFAULT_QAS: QA[] = [
  {
    id: "qa-1",
    question: "🚚 Quels sont vos délais de livraison au Maroc ?",
    answer: "La livraison est rapide et express partout au Maroc sous 24h à 48h. Le paiement s'effectue en espèces à la livraison.",
  },
  {
    id: "qa-2",
    question: "✨ Vos parfums sont-ils 100% authentiques ?",
    answer: "Garantie 100% Authenticité. Tous nos jus sont prélevés directement des flacons officiels scellés des plus grandes maisons de parfumerie.",
  },
  {
    id: "qa-3",
    question: "📏 Comment choisir le format (5ml, 10ml, 20ml) ?",
    answer: "• 5ml (~75 sprays) : Parfait pour tester et voyager.\n• 10ml (~150 sprays) : 3 à 4 semaines d'utilisation quotidienne.\n• 20ml (~300 sprays) : Format économique pour vos parfums favoris.",
  },
  {
    id: "qa-4",
    question: "🔥 Quels sont les Best-Sellers du moment ?",
    answer: "Pour Homme : Jean Paul Gaultier Le Beau, YSL Y EDP & Afnan 9PM.\nPour Femme : Valentino Born In Roma Intense, Prada Paradoxe & Baccarat Rouge 540.",
  },
  {
    id: "qa-5",
    question: "💵 Quel est le mode de paiement ?",
    answer: "Paiement à la livraison (Cash on Delivery). Vous ne payez qu'à la réception de votre colis auprès du livreur.",
  },
  {
    id: "qa-6",
    question: "🎁 Avez-vous des packs découverte ?",
    answer: "Oui ! Découvrez nos Packs Découverte dans l'onglet Collection Packs avec des tarifs avantageux et des combinaisons exclusives.",
  },
];

const ChatBot = () => {
  const { settings } = useAppSettings();
  const [open, setOpen] = useState(false);
  const [qas, setQas] = useState<QA[]>(DEFAULT_QAS);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!settings.bot_enabled) return;
    supabase
      .from("bot_qa")
      .select("id, question, answer")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setQas(data as QA[]);
      });
  }, [settings.bot_enabled]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: uid(), from: "bot", text: settings.bot_welcome }]);
    }
  }, [open, settings.bot_welcome, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const ask = (qa: QA) => {
    setMessages((m) => [...m, { id: uid(), from: "user", text: qa.question }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { id: uid(), from: "bot", text: qa.answer }]);
      setTyping(false);
    }, 700);
  };

  const contactWhatsapp = () => {
    window.open("https://wa.me/212752850156", "_blank");
  };

  return (
    <>
      {/* Floating Instagram Launcher Button (Positioned above WhatsApp & ChatBot) */}
      <a
        href="https://www.instagram.com/tabatperfumes"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Suivez-nous sur Instagram"
        className="fixed bottom-[9.25rem] right-5 z-[60] w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        title="Suivez-nous sur Instagram (@tabatperfumes)"
      >
        <span className="absolute inset-0 rounded-full bg-[#dc2743]/30 animate-pulse" />
        <Instagram className="w-7 h-7 relative" />
      </a>

      {/* Floating WhatsApp Launcher Button (Positioned directly above ChatBot) */}
      <a
        href="https://wa.me/212752850156"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discuter sur WhatsApp"
        className="fixed bottom-22 right-5 z-[60] w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        title="Discuter sur WhatsApp (07 52 85 01 56)"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
        <WhatsAppIcon className="w-7 h-7 relative" />
      </a>

      {/* Floating ChatBot launcher button */}
      {settings.bot_enabled && (
        <button
          type="button"
          aria-label={open ? "Fermer le chat" : "Ouvrir le chat"}
          onClick={() => setOpen((v) => !v)}
          className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-[#C9A96E] to-[#a0824b] text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <span className={`absolute inset-0 rounded-full bg-[#C9A96E]/40 ${open ? "" : "animate-ping"}`} />
          <span className="relative">
            {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </span>
        </button>
      )}

      {/* Chat window */}
      {settings.bot_enabled && open && (
        <div
          className="fixed bottom-20 right-3 z-[60] w-[min(340px,calc(100vw-1.5rem))] h-[min(460px,calc(100vh-7rem))] bg-white dark:bg-[#0F0F0F] rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 flex flex-col overflow-hidden origin-bottom-right"
          style={{ animation: "chatbot-in 280ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-br from-[#111827] to-[#1F2937] dark:from-[#1A1A1A] dark:to-[#0F0F0F] text-white flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-[#C9A96E] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#111827]" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#111827]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{settings.bot_name}</div>
              <div className="text-xs text-white/60">En ligne · Réponse instantanée</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md hover:bg-white/10"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F8F9FA] dark:bg-[#0F0F0F]"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                style={{ animation: "chatbot-msg 260ms ease-out" }}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    m.from === "user"
                      ? "bg-[#111827] text-white dark:bg-[#C9A96E] dark:text-[#111827] rounded-br-sm"
                      : "bg-white dark:bg-[#1A1A1A] text-[#111827] dark:text-[#F9FAFB] border border-black/5 dark:border-white/10 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start" style={{ animation: "chatbot-msg 260ms ease-out" }}>
                <div className="bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/10 px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#C9A96E]" style={{ animation: "chatbot-dot 1.2s infinite", animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#C9A96E]" style={{ animation: "chatbot-dot 1.2s infinite", animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#C9A96E]" style={{ animation: "chatbot-dot 1.2s infinite", animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick questions */}
          <div className="border-t border-black/5 dark:border-white/10 bg-white dark:bg-[#0F0F0F] px-3 py-3 space-y-2">
            <div className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] px-1">
              Questions fréquentes
            </div>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
              {qas.length === 0 && (
                <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] px-1">
                  Aucune question configurée.
                </div>
              )}
              {qas.map((qa) => (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => ask(qa)}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#F8F9FA] dark:bg-[#1A1A1A] hover:bg-[#C9A96E] hover:text-[#111827] dark:hover:bg-[#C9A96E] border border-black/5 dark:border-white/10 text-[#111827] dark:text-[#F9FAFB] transition-colors"
                >
                  {qa.question}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={contactWhatsapp}
              className="w-full mt-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" /> Discuter sur WhatsApp
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatbot-in {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatbot-msg {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatbot-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ChatBot;
