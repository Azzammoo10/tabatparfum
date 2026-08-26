import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  RotateCcw,
  Plus,
  Trash2,
  PiggyBank,
  ShoppingBag,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useAdminFinances, EXPENSE_CATEGORIES } from "@/hooks/useAdminFinances";
import FlaconnageSection from "@/admin/components/FlaconnageSection";

const fmtMad = (n: number) =>
  `${Math.round(n).toLocaleString("fr-FR")} MAD`;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const StatCard = ({
  title,
  value,
  sub,
  icon: Icon,
  tone = "neutral",
}: {
  title: string;
  value: string;
  sub?: string;
  icon: typeof Wallet;
  tone?: "neutral" | "positive" | "negative" | "primary";
}) => {
  const toneClasses: Record<string, string> = {
    neutral: "bg-secondary text-foreground",
    positive: "bg-emerald-500/10 text-emerald-500",
    negative: "bg-rose-500/10 text-rose-500",
    primary: "bg-primary/10 text-primary",
  };
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className={`w-9 h-9 rounded-md flex items-center justify-center ${toneClasses[tone]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-serif text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
};

const Finances = () => {
  const { kpis, monthly, byCategory, expenses, loading, error, addExpense, deleteExpense } =
    useAdminFinances();
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const grid = isDark ? "#2A2A2A" : "#E5E7EB";
  const axis = isDark ? "#9CA3AF" : "#6B7280";
  const tooltipBg = isDark ? "#1A1A1A" : "#FFFFFF";
  const tooltipBorder = isDark ? "#2A2A2A" : "#E5E7EB";
  const tooltipText = isDark ? "#F9FAFB" : "#111827";

  const [form, setForm] = useState({
    occurred_on: new Date().toISOString().slice(0, 10),
    category: EXPENSE_CATEGORIES[0] as string,
    label: "",
    amount: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim() || !form.amount) {
      toast.error("Libellé et montant requis");
      return;
    }
    setSubmitting(true);
    const res = await addExpense({
      occurred_on: form.occurred_on,
      category: form.category,
      label: form.label.trim(),
      amount: Number(form.amount),
      notes: form.notes.trim() || null,
    });
    setSubmitting(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Dépense ajoutée");
      setForm((f) => ({ ...f, label: "", amount: "", notes: "" }));
    }
  };

  const remove = async (id: string) => {
    const res = await deleteExpense(id);
    if (res.error) toast.error(res.error);
    else toast.success("Dépense supprimée");
  };

  return (
    <div className="space-y-6">
      {/* Hero / net profit */}
      <div className="bg-gradient-to-br from-primary/15 via-card to-card border border-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Trésorerie nette</p>
            <p className="text-4xl md:text-5xl font-serif text-foreground mt-2">
              {loading ? "…" : fmtMad(kpis?.netProfit ?? 0)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Ce mois : <span className="text-foreground">{fmtMad(kpis?.netProfitThisMonth ?? 0)}</span>
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Recettes</p>
              <p className="text-lg font-medium text-emerald-500">{fmtMad(kpis?.revenueTotal ?? 0)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Retours</p>
              <p className="text-lg font-medium text-rose-500">−{fmtMad(kpis?.refundsTotal ?? 0)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dépenses</p>
              <p className="text-lg font-medium text-rose-500">−{fmtMad(kpis?.expensesTotal ?? 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Recettes ce mois"
          value={fmtMad(kpis?.revenueThisMonth ?? 0)}
          sub={`Mois dernier : ${fmtMad(kpis?.revenueLastMonth ?? 0)}`}
          icon={TrendingUp}
          tone="positive"
        />
        <StatCard
          title="Dépenses ce mois"
          value={fmtMad(kpis?.expensesThisMonth ?? 0)}
          sub={`Total : ${fmtMad(kpis?.expensesTotal ?? 0)}`}
          icon={TrendingDown}
          tone="negative"
        />
        <StatCard
          title="Retours / annulés"
          value={fmtMad(kpis?.refundsTotal ?? 0)}
          sub={`${kpis?.ordersCancelled ?? 0} commande(s) annulée(s)`}
          icon={RotateCcw}
          tone="negative"
        />
        <StatCard
          title="Panier moyen"
          value={fmtMad(kpis?.avgOrderValue ?? 0)}
          sub={`${kpis?.itemsSold ?? 0} articles vendus`}
          icon={ShoppingBag}
          tone="primary"
        />
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Recettes vs Dépenses · 6 mois</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                <XAxis dataKey="month" stroke={axis} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke={axis}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
                />
                <Tooltip
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: 6,
                    fontSize: 12,
                    color: tooltipText,
                  }}
                  labelStyle={{ color: tooltipText }}
                  formatter={(v: number, name: string) => [fmtMad(v), name]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" name="Recettes" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="expenses" name="Dépenses" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="net" name="Net" stroke="#C9A96E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Répartition des dépenses</h3>
          {byCategory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              Aucune dépense enregistrée.
            </p>
          ) : (
            <div className="space-y-3">
              {byCategory.map((c) => (
                <div key={c.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{c.category}</span>
                    <span className="text-muted-foreground">{fmtMad(c.amount)} · {c.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add expense + list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form
          onSubmit={submit}
          className="bg-card border border-border rounded-lg p-5 space-y-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">Nouvelle dépense</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-muted-foreground">Date</span>
              <input
                type="date"
                value={form.occurred_on}
                onChange={(e) => setForm((f) => ({ ...f, occurred_on: e.target.value }))}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs text-muted-foreground">Catégorie</span>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-muted-foreground">Libellé</span>
            <input
              type="text"
              placeholder="Ex. Achat 5 décants Baccarat"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Montant (MAD)</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Notes (optionnel)</span>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {submitting ? "Enregistrement…" : "Ajouter la dépense"}
          </button>
        </form>

        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Dépenses récentes</h3>
            </div>
            <span className="text-xs text-muted-foreground">{expenses.length} entrée(s)</span>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-10">Chargement…</p>
          ) : expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              Aucune dépense enregistrée. Commencez à suivre vos achats, frais de livraison et marketing.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Catégorie</th>
                    <th className="text-left py-2">Libellé</th>
                    <th className="text-right py-2">Montant</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 20).map((e) => (
                    <tr key={e.id} className="border-t border-border">
                      <td className="py-2.5 text-muted-foreground whitespace-nowrap">{fmtDate(e.occurred_on)}</td>
                      <td className="py-2.5">
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">
                          {e.category}
                        </span>
                      </td>
                      <td className="py-2.5 text-foreground">
                        <div className="font-medium">{e.label}</div>
                        {e.notes && <div className="text-xs text-muted-foreground">{e.notes}</div>}
                      </td>
                      <td className="py-2.5 text-right whitespace-nowrap text-rose-500">−{fmtMad(e.amount)}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => remove(e.id)}
                          className="text-muted-foreground hover:text-destructive p-1"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <FlaconnageSection />
    </div>
  );
};

export default Finances;
