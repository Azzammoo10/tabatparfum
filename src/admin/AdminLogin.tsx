import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (err) {
        console.error("Supabase Auth error:", err);
        setError(err.message === "Invalid login credentials" ? "Email ou mot de passe Supabase incorrect." : err.message);
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      navigate("/admin", { replace: true });
    } catch (err) {
      setSubmitting(false);
      const msg = err instanceof Error ? err.message : "Erreur lors de la connexion.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#0F0F0F] font-sans px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-lg border border-[#E5E7EB] dark:border-[#2A2A2A] shadow-sm p-8 space-y-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/logo.png" alt="TABAT Logo" className="h-12 w-auto object-contain dark:invert mb-1" />
          <h1 className="text-2xl font-medium text-[#111827] dark:text-[#F9FAFB]">Admin · TABAT</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Connectez-vous pour accéder au panneau.
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm">
            <span className="text-[#111827] dark:text-[#F9FAFB]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="mt-1 w-full px-3 py-2 border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A96E] bg-[#FFFFFF] dark:bg-[#1A1A1A] text-[#111827] dark:text-[#F9FAFB]"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="text-[#111827] dark:text-[#F9FAFB]">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1 w-full px-3 py-2 border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A96E] bg-[#FFFFFF] dark:bg-[#1A1A1A] text-[#111827] dark:text-[#F9FAFB]"
              required
            />
          </label>
          {error && <p className="text-sm text-[#EF4444]">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#111827] hover:bg-[#1F2937] dark:bg-[#C9A96E] dark:hover:bg-[#B8985F] dark:text-[#111827] text-white py-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          {submitting ? "Connexion…" : "Se connecter"}
        </button>

        <p className="text-xs text-center text-[#6B7280] dark:text-[#9CA3AF]">
          Accès réservé · TABAT © 2026
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
