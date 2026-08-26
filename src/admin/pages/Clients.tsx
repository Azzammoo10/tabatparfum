import { useAdminCustomers } from "@/hooks/useAdminCustomers";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

const Clients = () => {
  const { customers, loading, error } = useAdminCustomers();

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Nom</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Téléphone</th>
                <th className="text-right px-4 py-3">Commandes</th>
                <th className="text-right px-4 py-3">Total dépensé</th>
                <th className="text-left px-4 py-3">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {loading && (<tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Chargement…</td></tr>)}
              {error && !loading && (<tr><td colSpan={6} className="px-4 py-10 text-center text-destructive">{error}</td></tr>)}
              {!loading && !error && customers.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Aucun client pour le moment.</td></tr>
              )}
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-right">{c.total_orders}</td>
                  <td className="px-4 py-3 text-right">{Number(c.total_spent).toLocaleString("fr-FR")} MAD</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading && <p className="text-center text-sm text-muted-foreground py-10">Chargement…</p>}
        {error && !loading && <p className="text-center text-sm text-destructive py-10">{error}</p>}
        {!loading && !error && customers.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">Aucun client pour le moment.</p>
        )}
        {customers.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-foreground text-sm truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.email}</div>
                {c.phone && <div className="text-xs text-muted-foreground">{c.phone}</div>}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(c.created_at)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
              <span className="text-xs text-muted-foreground">{c.total_orders} commande(s)</span>
              <span className="font-medium text-foreground">{Number(c.total_spent).toLocaleString("fr-FR")} MAD</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Clients;
