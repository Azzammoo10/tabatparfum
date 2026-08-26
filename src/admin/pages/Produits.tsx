import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import DeleteDialog from "../components/DeleteDialog";
import { deleteProduct, useProducts, type AdminParfum } from "@/store/useProductStore";
import { deleteParfumFromSupabase } from "@/admin/lib/syncParfum";
import { toast } from "sonner";

const FILTERS = ["Tous", "Homme", "Femme", "Mixte"] as const;
type Filter = (typeof FILTERS)[number];

const Produits = () => {
  const products = useProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Tous");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminParfum | null>(null);
  const [deleting, setDeleting] = useState<AdminParfum | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filter !== "Tous" && p.gender !== filter) return false;
      if (q && !(p.name.toLowerCase().includes(q) || p.maison.toLowerCase().includes(q))) return false;
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
          <div className="flex gap-1.5 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition-colors ${
                  filter === f
                    ? "bg-[#111827] dark:bg-[#C9A96E] text-white dark:text-[#111827] border-[#111827]"
                    : "bg-[#FFFFFF] dark:bg-[#1A1A1A] text-[#6B7280] dark:text-[#9CA3AF] border-[#E5E7EB] dark:border-[#2A2A2A] hover:text-[#111827] dark:text-[#F9FAFB]"
                }`}
              >
                {f}
              </button>
            ))}
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
