import { Pencil, Trash2 } from "lucide-react";
import type { AdminParfum } from "@/store/useProductStore";

type Props = {
  products: AdminParfum[];
  onEdit: (p: AdminParfum) => void;
  onDelete: (p: AdminParfum) => void;
};

const fmt = (n: number) => `${n.toLocaleString("fr-FR")}`;

const ProductTable = ({ products, onEdit, onDelete }: Props) => (
  <>
    {/* Desktop table */}
    <div className="hidden md:block bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F9FA] dark:bg-[#0F0F0F] text-[#6B7280] dark:text-[#9CA3AF] text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Nom</th>
              <th className="text-left px-4 py-3">Maison</th>
              <th className="text-left px-4 py-3">Genre</th>
              <th className="text-right px-4 py-3">Prix 5ml</th>
              <th className="text-right px-4 py-3">Prix 10ml</th>
              <th className="text-right px-4 py-3">Stock 5ml</th>
              <th className="text-right px-4 py-3">Stock 10ml</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const isFull = (p.sale_mode ?? "decant") === "full_bottle";
              const s5 = p.stock_5ml ?? 0;
              const s10 = p.stock_10ml ?? 0;
              const sFull = p.full_bottle_stock ?? 0;
              const stockTotal = isFull ? sFull : s5 + s10;
              const inStock = (p.active ?? true) && stockTotal > 0;
              return (
                <tr key={p.id} className="border-t border-[#E5E7EB] dark:border-[#2A2A2A] hover:bg-[#F8F9FA]/50 dark:hover:bg-white/5">
                  <td className="px-4 py-3 text-[#6B7280] dark:text-[#9CA3AF]">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-[#111827] dark:text-[#F9FAFB]">
                    <div className="flex items-center gap-2">
                      <span>{p.name}</span>
                      {isFull && (
                        <span className="inline-block text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#C9A96E]/15 text-[#C9A96E] border border-[#C9A96E]/30">
                          Complet {p.full_bottle_volume_ml ?? ""}ml
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] dark:text-[#9CA3AF]">{p.maison}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block text-xs px-2 py-0.5 rounded bg-[#F8F9FA] dark:bg-[#0F0F0F] border border-[#E5E7EB] dark:border-[#2A2A2A]">
                      {p.gender}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{isFull ? "—" : fmt(p.prices["5ml"])}</td>
                  <td className="px-4 py-3 text-right">
                    {isFull ? fmt(p.full_bottle_price ?? 0) : fmt(p.prices["10ml"])}
                  </td>
                  <td className={`px-4 py-3 text-right ${!isFull && s5 === 0 ? "text-[#EF4444]" : ""}`}>{isFull ? "—" : s5}</td>
                  <td className={`px-4 py-3 text-right ${(isFull ? sFull : s10) === 0 ? "text-[#EF4444]" : ""}`}>
                    {isFull ? sFull : s10}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${inStock ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>
                      {inStock ? "Actif" : "Rupture"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onEdit(p)} className="p-1.5 rounded hover:bg-[#F8F9FA] dark:hover:bg-white/5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]" aria-label="Modifier">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(p)} className="p-1.5 rounded hover:bg-[#EF4444]/10 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#EF4444]" aria-label="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">Aucun produit trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Mobile cards */}
    <div className="md:hidden space-y-3">
      {products.length === 0 && (
        <p className="text-center text-sm text-[#6B7280] dark:text-[#9CA3AF] py-10">Aucun produit trouvé.</p>
      )}
      {products.map((p) => {
        const isFull = (p.sale_mode ?? "decant") === "full_bottle";
        const s5 = p.stock_5ml ?? 0;
        const s10 = p.stock_10ml ?? 0;
        const sFull = p.full_bottle_stock ?? 0;
        const stockTotal = isFull ? sFull : s5 + s10;
        const inStock = (p.active ?? true) && stockTotal > 0;
        return (
          <div key={p.id} className="bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-[#111827] dark:text-[#F9FAFB] truncate">{p.name}</div>
                <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] truncate">{p.maison}</div>
                {isFull && (
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#C9A96E]/15 text-[#C9A96E] border border-[#C9A96E]/30">
                    Complet {p.full_bottle_volume_ml ?? ""}ml
                  </span>
                )}
              </div>
              <span className={`shrink-0 inline-block text-xs px-2 py-0.5 rounded-full ${inStock ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>
                {inStock ? "Actif" : "Rupture"}
              </span>
            </div>
            {isFull ? (
              <div className="bg-[#F8F9FA] dark:bg-[#0F0F0F] rounded p-2 text-xs">
                <div className="text-[#6B7280] dark:text-[#9CA3AF]">Bouteille complète</div>
                <div className="text-[#111827] dark:text-[#F9FAFB] font-medium">
                  {fmt(p.full_bottle_price ?? 0)} · <span className={sFull === 0 ? "text-[#EF4444]" : ""}>stock {sFull}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#F8F9FA] dark:bg-[#0F0F0F] rounded p-2">
                  <div className="text-[#6B7280] dark:text-[#9CA3AF]">5ml</div>
                  <div className="text-[#111827] dark:text-[#F9FAFB] font-medium">{fmt(p.prices["5ml"])} · <span className={s5 === 0 ? "text-[#EF4444]" : ""}>stock {s5}</span></div>
                </div>
                <div className="bg-[#F8F9FA] dark:bg-[#0F0F0F] rounded p-2">
                  <div className="text-[#6B7280] dark:text-[#9CA3AF]">10ml</div>
                  <div className="text-[#111827] dark:text-[#F9FAFB] font-medium">{fmt(p.prices["10ml"])} · <span className={s10 === 0 ? "text-[#EF4444]" : ""}>stock {s10}</span></div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-[#E5E7EB] dark:border-[#2A2A2A] pt-2">
              <span className="inline-block text-xs px-2 py-0.5 rounded bg-[#F8F9FA] dark:bg-[#0F0F0F] border border-[#E5E7EB] dark:border-[#2A2A2A]">{p.gender}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => onEdit(p)} className="p-1.5 rounded hover:bg-[#F8F9FA] dark:hover:bg-white/5 text-[#6B7280] dark:text-[#9CA3AF]" aria-label="Modifier">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(p)} className="p-1.5 rounded hover:bg-[#EF4444]/10 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#EF4444]" aria-label="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </>
);

export default ProductTable;
