import { useAdminOrders } from "@/hooks/useAdminOrders";
import { ORDER_STATUS_LABEL, type OrderStatus, type OrderItem, type Order } from "@/types/database";
import { toast } from "sonner";
import { FileDown, MessageCircle } from "lucide-react";
import { downloadInvoice, sendInvoiceViaWhatsapp } from "@/admin/lib/invoice";

const STATUS_STYLE: Record<OrderStatus, string> = {
  en_attente: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
  confirmee: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30",
  livree: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30",
  annulee: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
};

const STATUSES: OrderStatus[] = ["en_attente", "confirmee", "livree", "annulee"];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const summarizeItems = (items: OrderItem[]) =>
  items.map((it) => `${it.parfum_name || (it as OrderItem & { name?: string }).name || "Produit"} (${it.size}) × ${it.quantity}`).join(", ");

const Commandes = () => {
  const { orders, loading, error, updateOrderStatus } = useAdminOrders();

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    const res = await updateOrderStatus(id, status);
    if (res.error) toast.error("Erreur: " + res.error);
    else toast.success("Statut mis à jour");
  };

  const StatusSelect = ({ id, status }: { id: string; status: OrderStatus }) => (
    <select
      value={status}
      onChange={(e) => handleStatusChange(id, e.target.value as OrderStatus)}
      className={`text-xs px-2 py-1 rounded-full border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary ${STATUS_STYLE[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-card text-foreground">
          {ORDER_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );

  const handlePdf = (o: Order) => {
    try { downloadInvoice(o); toast.success("Facture PDF téléchargée"); }
    catch (e) { toast.error("Erreur PDF: " + (e as Error).message); }
  };

  const handleWhatsapp = (o: Order) => {
    if (!o.customer_phone) {
      toast.warning("Aucun numéro client — WhatsApp ouvert sans destinataire");
    }
    try {
      sendInvoiceViaWhatsapp(o);
      toast.success("PDF téléchargé · WhatsApp ouvert");
    } catch (e) { toast.error("Erreur: " + (e as Error).message); }
  };

  const Actions = ({ o }: { o: Order }) => (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => handlePdf(o)}
        title="Télécharger la facture PDF"
        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <FileDown className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => handleWhatsapp(o)}
        title="Envoyer la facture via WhatsApp"
        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3"># Commande</th>
                <th className="text-left px-4 py-3">Client</th>
                <th className="text-left px-4 py-3">Produits</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Statut</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Chargement…</td></tr>
              )}
              {error && !loading && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-destructive">{error}</td></tr>
              )}
              {!loading && !error && orders.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Aucune commande pour le moment.</td></tr>
              )}
              {orders.map((o) => {
                const hasRealEmail = o.customer_email && o.customer_email.includes("@") && !o.customer_email.endsWith("@client.tabat.ma") && !o.customer_email.endsWith("@tabat.ma");
                return (
                  <tr key={o.id} className="border-t border-border align-top">
                    <td className="px-4 py-3 font-medium text-foreground">{o.order_number}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{o.customer_name}</div>
                      {hasRealEmail && <div className="text-xs text-muted-foreground">{o.customer_email}</div>}
                      {o.customer_phone && <div className="text-xs text-muted-foreground">{o.customer_phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[280px]">{summarizeItems(o.items)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{Number(o.total_amount).toLocaleString("fr-FR")} MAD</td>
                    <td className="px-4 py-3"><StatusSelect id={o.id} status={o.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(o.created_at)}</td>
                    <td className="px-4 py-3"><div className="flex justify-end"><Actions o={o} /></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading && <p className="text-center text-sm text-muted-foreground py-10">Chargement…</p>}
        {error && !loading && <p className="text-center text-sm text-destructive py-10">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">Aucune commande pour le moment.</p>
        )}
        {orders.map((o) => {
          const hasRealEmail = o.customer_email && o.customer_email.includes("@") && !o.customer_email.endsWith("@client.tabat.ma") && !o.customer_email.endsWith("@tabat.ma");
          return (
            <div key={o.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-foreground text-sm">{o.order_number}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(o.created_at)}</div>
                </div>
                <StatusSelect id={o.id} status={o.status} />
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground truncate">{o.customer_name}</div>
                {hasRealEmail && <div className="text-xs text-muted-foreground truncate">{o.customer_email}</div>}
                {o.customer_phone && <div className="text-xs text-muted-foreground">{o.customer_phone}</div>}
              </div>
            <div className="text-xs text-muted-foreground border-t border-border pt-2">
              {summarizeItems(o.items)}
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="font-medium text-foreground">{Number(o.total_amount).toLocaleString("fr-FR")} MAD</span>
            </div>
            <div className="flex justify-end pt-1 border-t border-border"><Actions o={o} /></div>
          </div>
          );
        })}
      </div>
    </>
  );
};

export default Commandes;
