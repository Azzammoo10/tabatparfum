import { Pencil, Trash2, Eye, Gift, Sparkles, Wine, Droplet } from "lucide-react";
import type { AdminParfum } from "@/store/useProductStore";

type Props = {
  products: AdminParfum[];
  onEdit: (p: AdminParfum) => void;
  onDelete: (p: AdminParfum) => void;
};

const fmt = (n: number) => `${n.toLocaleString("fr-FR")} MAD`;

const ProductTable = ({ products, onEdit, onDelete }: Props) => (
  <>
    {/* Desktop table */}
    <div className="hidden md:block bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F9FA] dark:bg-[#0F0F0F] text-[#6B7280] dark:text-[#9CA3AF] text-xs uppercase tracking-wide border-b border-[#E5E7EB] dark:border-[#2A2A2A]">
            <tr>
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Produit</th>
              <th className="text-left px-4 py-3">Maison</th>
              <th className="text-left px-4 py-3">Catégorie</th>
              <th className="text-right px-4 py-3">Prix Vente</th>
              <th className="text-right px-4 py-3">Stock Total</th>
              <th className="text-center px-4 py-3">Statut</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const isPack = p.category === "packs" || p.id.startsWith("pack-") || p.name.toLowerCase().includes("pack");
              const isDeo = p.category === "deodorants-stick" || p.id.includes("deodorant") || p.id.includes("old-spice");
              const isFull = (p.sale_mode ?? "decant") === "full_bottle" || isPack || isDeo;
              const s5 = p.stock_5ml ?? 0;
              const s10 = p.stock_10ml ?? 0;
              const sFull = p.full_bottle_stock ?? 0;
              const stockTotal = isFull ? sFull : s5 + s10;
              const inStock = (p.active ?? true) && stockTotal > 0;

              return (
                <tr key={p.id} className="border-t border-[#E5E7EB] dark:border-[#2A2A2A] hover:bg-[#F8F9FA]/60 dark:hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3.5 text-[#6B7280] dark:text-[#9CA3AF] font-mono text-xs">{i + 1}</td>
                  <td className="px-4 py-3.5 font-medium text-[#111827] dark:text-[#F9FAFB]">
                    <div className="flex items-center gap-2.5">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded-lg object-cover bg-muted border border-border shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                          {p.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm leading-snug">{p.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isPack && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                              <Gift className="w-3 h-3" /> Pack & Coffret
                            </span>
                          )}
                          {isDeo && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                              <Sparkles className="w-3 h-3" /> Déodorant Stick
                            </span>
                          )}
                          {isFull && !isPack && !isDeo && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#C9A96E]/15 text-[#C9A96E] border border-[#C9A96E]/30">
                              <Wine className="w-3 h-3" /> Flacon {p.full_bottle_volume_ml ?? 100}ml
                            </span>
                          )}
                          {!isFull && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <Droplet className="w-3 h-3" /> Décants
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[#6B7280] dark:text-[#9CA3AF] text-xs font-medium">{p.maison}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-[#F8F9FA] dark:bg-[#0F0F0F] border border-[#E5E7EB] dark:border-[#2A2A2A] text-foreground font-medium">
                      {p.gender}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-foreground">
                    {isFull ? (
                      <span>{fmt(p.full_bottle_price ?? p.prices["5ml"] ?? 0)}</span>
                    ) : (
                      <div className="text-xs">
                        <div>5ml : {fmt(p.prices["5ml"])}</div>
                        <div className="text-muted-foreground text-[11px]">10ml : {fmt(p.prices["10ml"])}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`font-semibold text-xs ${stockTotal === 0 ? "text-[#EF4444]" : "text-foreground"}`}>
                      {stockTotal} {isFull ? "unités" : "flacons"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${inStock ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-[#10B981]" : "bg-[#EF4444]"}`} />
                      {inStock ? "Actif" : "Rupture"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/parfum/${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        title="Voir la fiche produit"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                  Aucun produit trouvé dans cette sélection.
                </td>
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
        const isPack = p.category === "packs" || p.id.startsWith("pack-") || p.name.toLowerCase().includes("pack");
        const isDeo = p.category === "deodorants-stick" || p.id.includes("deodorant") || p.id.includes("old-spice");
        const isFull = (p.sale_mode ?? "decant") === "full_bottle" || isPack || isDeo;
        const s5 = p.stock_5ml ?? 0;
        const s10 = p.stock_10ml ?? 0;
        const sFull = p.full_bottle_stock ?? 0;
        const stockTotal = isFull ? sFull : s5 + s10;
        const inStock = (p.active ?? true) && stockTotal > 0;

        return (
          <div key={p.id} className="bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl p-4 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-serif font-bold text-[#111827] dark:text-[#F9FAFB] truncate">{p.name}</div>
                <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] truncate">{p.maison}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  {isPack && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400">
                      <Gift className="w-3 h-3" /> Pack & Coffret
                    </span>
                  )}
                  {isDeo && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-600 dark:text-sky-400">
                      <Sparkles className="w-3 h-3" /> Déodorant Stick
                    </span>
                  )}
                  {isFull && !isPack && !isDeo && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#C9A96E]/15 text-[#C9A96E]">
                      <Wine className="w-3 h-3" /> Flacon {p.full_bottle_volume_ml ?? 100}ml
                    </span>
                  )}
                </div>
              </div>
              <span className={`shrink-0 inline-block text-xs px-2.5 py-0.5 rounded-full font-semibold ${inStock ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>
                {inStock ? "Actif" : "Rupture"}
              </span>
            </div>

            <div className="bg-[#F8F9FA] dark:bg-[#0F0F0F] rounded-lg p-2.5 text-xs flex items-center justify-between">
              <div>
                <span className="text-[#6B7280] dark:text-[#9CA3AF]">Prix : </span>
                <span className="font-semibold text-foreground">
                  {isFull ? fmt(p.full_bottle_price ?? p.prices["5ml"] ?? 0) : `${fmt(p.prices["5ml"])} (5ml)`}
                </span>
              </div>
              <div>
                <span className="text-[#6B7280] dark:text-[#9CA3AF]">Stock : </span>
                <span className={`font-semibold ${stockTotal === 0 ? "text-[#EF4444]" : "text-foreground"}`}>
                  {stockTotal}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#E5E7EB] dark:border-[#2A2A2A] pt-2">
              <span className="inline-block text-xs px-2 py-0.5 rounded bg-[#F8F9FA] dark:bg-[#0F0F0F] border border-[#E5E7EB] dark:border-[#2A2A2A]">{p.gender}</span>
              <div className="flex items-center gap-1">
                <a
                  href={`/parfum/${p.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-[#F8F9FA] dark:hover:bg-white/5 text-[#6B7280] dark:text-[#9CA3AF]"
                  title="Voir"
                >
                  <Eye className="w-4 h-4" />
                </a>
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
