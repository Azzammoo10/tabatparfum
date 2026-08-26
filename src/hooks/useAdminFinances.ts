import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { OrderItem } from "@/types/database";

export type Expense = {
  id: string;
  occurred_on: string;
  category: string;
  label: string;
  amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const EXPENSE_CATEGORIES = [
  "Achat stock",
  "Flaconnage",
  "Livraison",
  "Marketing",
  "Frais bancaires",
  "Salaires",
  "Loyer",
  "Autre",
] as const;

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export type FinanceKpis = {
  revenueTotal: number;            // confirmee + livree all-time
  revenueThisMonth: number;
  revenueLastMonth: number;
  refundsTotal: number;            // annulee all-time
  refundsThisMonth: number;
  expensesTotal: number;
  expensesThisMonth: number;
  netProfit: number;               // revenueTotal - refundsTotal - expensesTotal
  netProfitThisMonth: number;
  ordersCount: number;
  ordersConfirmed: number;
  ordersDelivered: number;
  ordersPending: number;
  ordersCancelled: number;
  avgOrderValue: number;
  itemsSold: number;
};

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

export type MonthlyPoint = {
  month: string;
  revenue: number;
  expenses: number;
  net: number;
};

export type CategoryBreakdown = { category: string; amount: number; pct: number };

export const useAdminFinances = () => {
  const [kpis, setKpis] = useState<FinanceKpis | null>(null);
  const [monthly, setMonthly] = useState<MonthlyPoint[]>([]);
  const [byCategory, setByCategory] = useState<CategoryBreakdown[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const thisStart = startOfMonth(now);
      const lastStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      const sixStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 5, 1));

      const [ordersRes, expensesRes] = await Promise.all([
        supabase.from("orders").select("total_amount, status, items, created_at"),
        supabase.from("expenses").select("*").order("occurred_on", { ascending: false }),
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (expensesRes.error) throw expensesRes.error;

      const orders = (ordersRes.data ?? []) as Array<{
        total_amount: number;
        status: string;
        items: OrderItem[] | null;
        created_at: string;
      }>;
      const exp = (expensesRes.data ?? []) as Expense[];

      const isRevenue = (s: string) => s === "confirmee" || s === "livree";
      const isRefund = (s: string) => s === "annulee";

      let revenueTotal = 0,
        revenueThisMonth = 0,
        revenueLastMonth = 0,
        refundsTotal = 0,
        refundsThisMonth = 0,
        ordersConfirmed = 0,
        ordersDelivered = 0,
        ordersPending = 0,
        ordersCancelled = 0,
        itemsSold = 0;

      orders.forEach((o) => {
        const d = new Date(o.created_at);
        const amt = Number(o.total_amount ?? 0);
        if (o.status === "confirmee") ordersConfirmed++;
        else if (o.status === "livree") ordersDelivered++;
        else if (o.status === "en_attente") ordersPending++;
        else if (o.status === "annulee") ordersCancelled++;

        if (isRevenue(o.status)) {
          revenueTotal += amt;
          if (d >= thisStart) revenueThisMonth += amt;
          else if (d >= lastStart && d < thisStart) revenueLastMonth += amt;
          (o.items ?? []).forEach((it) => (itemsSold += it.quantity));
        }
        if (isRefund(o.status)) {
          refundsTotal += amt;
          if (d >= thisStart) refundsThisMonth += amt;
        }
      });

      let expensesTotal = 0;
      let expensesThisMonth = 0;
      const catMap = new Map<string, number>();
      exp.forEach((e) => {
        const amt = Number(e.amount);
        expensesTotal += amt;
        const d = new Date(e.occurred_on);
        if (d >= thisStart) expensesThisMonth += amt;
        catMap.set(e.category, (catMap.get(e.category) ?? 0) + amt);
      });

      const breakdown: CategoryBreakdown[] = Array.from(catMap.entries())
        .map(([category, amount]) => ({
          category,
          amount,
          pct: expensesTotal > 0 ? Math.round((amount / expensesTotal) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

      // monthly buckets last 6 months
      const buckets = new Map<string, MonthlyPoint>();
      for (let i = 0; i < 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        buckets.set(`${d.getFullYear()}-${d.getMonth()}`, {
          month: MONTHS_FR[d.getMonth()],
          revenue: 0,
          expenses: 0,
          net: 0,
        });
      }
      orders.forEach((o) => {
        if (!isRevenue(o.status)) return;
        const d = new Date(o.created_at);
        if (d < sixStart) return;
        const k = `${d.getFullYear()}-${d.getMonth()}`;
        const b = buckets.get(k);
        if (b) b.revenue += Number(o.total_amount);
      });
      exp.forEach((e) => {
        const d = new Date(e.occurred_on);
        if (d < sixStart) return;
        const k = `${d.getFullYear()}-${d.getMonth()}`;
        const b = buckets.get(k);
        if (b) b.expenses += Number(e.amount);
      });
      const points = Array.from(buckets.values()).map((b) => ({ ...b, net: b.revenue - b.expenses }));

      const ordersForRevenue = ordersConfirmed + ordersDelivered;
      const computedKpis: FinanceKpis = {
        revenueTotal,
        revenueThisMonth,
        revenueLastMonth,
        refundsTotal,
        refundsThisMonth,
        expensesTotal,
        expensesThisMonth,
        netProfit: revenueTotal - refundsTotal - expensesTotal,
        netProfitThisMonth: revenueThisMonth - refundsThisMonth - expensesThisMonth,
        ordersCount: orders.length,
        ordersConfirmed,
        ordersDelivered,
        ordersPending,
        ordersCancelled,
        avgOrderValue: ordersForRevenue > 0 ? revenueTotal / ordersForRevenue : 0,
        itemsSold,
      };

      setKpis(computedKpis);
      setMonthly(points);
      setByCategory(breakdown);
      setExpenses(exp);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addExpense = async (payload: Omit<Expense, "id" | "created_at" | "updated_at">) => {
    const { error: err } = await supabase.from("expenses").insert(payload);
    if (err) return { error: err.message };
    await load();
    return { ok: true };
  };

  const deleteExpense = async (id: string) => {
    const { error: err } = await supabase.from("expenses").delete().eq("id", id);
    if (err) return { error: err.message };
    await load();
    return { ok: true };
  };

  return { kpis, monthly, byCategory, expenses, loading, error, refetch: load, addExpense, deleteExpense };
};
