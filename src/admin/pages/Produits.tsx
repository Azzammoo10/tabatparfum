import { useMemo, useState } from "react";
import { Plus, Search, Layers, User, Users, Gift, Sparkles, Wine } from "lucide-react";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import DeleteDialog from "../components/DeleteDialog";
import { deleteProduct, useProducts, type AdminParfum } from "@/store/useProductStore";
import { deleteParfumFromSupabase } from "@/admin/lib/syncParfum";
import { toast } from "sonner";

type FilterId = "Tous" | "Homme" | "Femme" | "Mixte" | "packs" | "deodorants-stick" | "full_bottle";

const FILTER_OPTIONS = [
  { id: "Tous" as FilterId, label: "Tous", icon: Layers },
  { id: "Homme" as FilterId, label: "Homme", icon: User },
  { id: "Femme" as FilterId, label: "Femme", icon: User },
  { id: "Mixte" as FilterId, label: "Mixte", icon: Users },
  { id: "packs" as FilterId, label: "Packs & Coffrets", icon: Gift },
  { id: "deodorants-stick" as FilterId, label: "Déodorants Stick", icon: Sparkles },
  { id: "full_bottle" as FilterId, label: "Flacons Complets", icon: Wine },
];

const Produits = () => {
  const products = useProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterId>("Tous");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminParfum | null>(null);
  const [deleting, setDeleting] = useState<AdminParfum | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filter === "Homme" && p.gender !== "Homme") return false;
      if (filter === "Femme" && p.gender !== "Femme") return false;
      if (filter === "Mixte" && p.gender !== "Mixte") return false;
      if (filter === "packs" && p.category !== "packs" && !p.id.startsWith("pack-") && !p.name.toLowerCase().includes("pack")) return false;
      if (filter === "deodorants-stick" && p.category !== "deodorants-stick" && !p.id.includes("deodorant") && !p.id.includes("old-spice")) return false;
      if (filter === "full_bottle" && (p.sale_mode !== "full_bottle" && p.category !== "deodorants-stick" && p.category !== "packs")) return false;

      if (q) {
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesMaison = p.maison.toLowerCase().includes(q);
        const matchesCat = p.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesMaison && !matchesCat) return false;
      }
      return true;
    });
  }, [products, search, filter]);

  const onAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const onEdit = (p: AdminParfum) => {
    setEditing(p);
    setModalOpen(true);
  };
  const confirmDelete = async () => {
    if (deleting) {
      const id = deleting.id;
      deleteProduct(id);
      try {
        await deleteParfumFromSupabase(id);
      } catch (e) {
        console.error(e);
      }
      toast.success(`${deleting.name} supprimé`);
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un nom ou une maison..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {FILTER_OPTIONS.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all cursor-pointer ${
                    filter === f.id
                      ? "bg-[#111827] dark:bg-[#C9A96E] text-white dark:text-[#111827] border-[#111827] dark:border-[#C9A96E] shadow-xs font-semibold"
                      : "bg-[#FFFFFF] dark:bg-[#1A1A1A] text-[#6B7280] dark:text-[#9CA3AF] border-[#E5E7EB] dark:border-[#2A2A2A] hover:border-[#C9A96E]/50 hover:text-[#111827] dark:hover:text-[#F9FAFB]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#111827] hover:bg-[#1F2937] dark:bg-[#C9A96E] dark:hover:bg-[#B8985F] dark:text-[#111827] text-white text-sm rounded-md whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Ajouter un produit
        </button>
      </div>

      <ProductTable products={filtered} onEdit={onEdit} onDelete={(p) => setDeleting(p)} />

      <ProductModal open={modalOpen} onOpenChange={setModalOpen} initial={editing} />
      <DeleteDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        onConfirm={confirmDelete}
        productName={deleting?.name}
      />
    </div>
  );
};

export default Produits;
