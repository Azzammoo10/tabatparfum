import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { addProduct, updateProduct, type AdminParfum, type SaleMode } from "@/store/useProductStore";
import { uploadProductImage, upsertParfumToSupabase } from "@/admin/lib/syncParfum";
import type { Gender } from "@/data/parfums";
import { toast } from "sonner";
import { Upload, X, Loader2, Droplet, Wine } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: AdminParfum | null;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyForm = {
  name: "",
  maison: "",
  gender: "Homme" as Gender,
  description: "",
  tete: "",
  coeur: "",
  fond: "",
  saleMode: "decant" as SaleMode,
  p5: "",
  p10: "",
  stock5: "20",
  stock10: "20",
  fbVolume: "100",
  fbPrice: "",
  fbStock: "5",
  fbLimited: false,
  imageLabel: "",
  imageUrl: "" as string,
  active: true,
  isNew: false,
  isBestseller: false,
};

const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

const labelCls = "block text-xs font-medium text-[#111827] dark:text-[#F9FAFB] mb-1";
const inputCls =
  "w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A96E] text-[#111827] dark:text-[#F9FAFB]";

const ProductModal = ({ open, onOpenChange, initial }: Props) => {
  const [f, setF] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (initial) {
        setF({
          name: initial.name,
          maison: initial.maison,
          gender: initial.gender,
          description: initial.description,
          tete: initial.notes.tete.join(", "),
          coeur: initial.notes.coeur.join(", "),
          fond: initial.notes.fond.join(", "),
          saleMode: (initial.sale_mode ?? "decant") as SaleMode,
          p5: String(initial.prices["5ml"]),
          p10: String(initial.prices["10ml"]),
          stock5: String(initial.stock_5ml ?? 20),
          stock10: String(initial.stock_10ml ?? 20),
          fbVolume: String(initial.full_bottle_volume_ml ?? 100),
          fbPrice: initial.full_bottle_price != null ? String(initial.full_bottle_price) : "",
          fbStock: String(initial.full_bottle_stock ?? 5),
          fbLimited: !!initial.full_bottle_limited,
          imageLabel: initial.imageLabel,
          imageUrl: initial.image_url ?? "",
          active: initial.active ?? true,
          isNew: !!initial.isNew,
          isBestseller: !!initial.isBestseller,
        });
      } else {
        setF(emptyForm);
      }
      setErrors({});
    }
  }, [open, initial]);

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Fichier image requis");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image trop lourde (max 5MB)");
      return;
    }
    try {
      setUploading(true);
      const id = initial?.id && isUuid(initial.id) ? initial.id : crypto.randomUUID();
      const url = await uploadProductImage(id, file);
      set("imageUrl", url);
      toast.success("Image téléchargée");
    } catch (err) {
      console.error(err);
      toast.error("Échec de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.name.trim()) errs.name = "Nom requis";
    if (!f.maison.trim()) errs.maison = "Maison requise";

    const isFull = f.saleMode === "full_bottle";
    const p5 = Number(f.p5);
    const p10 = Number(f.p10);
    const fbPrice = Number(f.fbPrice);
    const fbVolume = Number(f.fbVolume);

    if (isFull) {
      if (!fbVolume || fbVolume <= 0) errs.fbVolume = "Volume requis";
      if (!fbPrice || fbPrice <= 0) errs.fbPrice = "Prix requis";
    } else {
      if (!p5 || p5 <= 0) errs.p5 = "Prix invalide";
      if (!p10 || p10 <= p5) errs.p10 = "Doit être > prix 5ml";
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const parseNotes = (s: string) =>
      s.split(",").map((x) => x.trim()).filter(Boolean);

    const stock5 = Math.max(0, Number(f.stock5) || 0);
    const stock10 = Math.max(0, Number(f.stock10) || 0);
    const fbStock = Math.max(0, Number(f.fbStock) || 0);

    const id =
      initial?.id && isUuid(initial.id)
        ? initial.id
        : initial?.id ?? crypto.randomUUID();

    const safeP5 = isFull ? (initial?.prices["5ml"] ?? fbPrice) : p5;
    const safeP10 = isFull ? (initial?.prices["10ml"] ?? fbPrice) : p10;

    const payload: AdminParfum = {
      id,
      name: f.name.trim(),
      maison: f.maison.trim(),
      gender: f.gender,
      description: f.description.trim(),
      notes: { tete: parseNotes(f.tete), coeur: parseNotes(f.coeur), fond: parseNotes(f.fond) },
      prices: { "5ml": safeP5, "10ml": safeP10, "20ml": initial?.prices["20ml"] ?? safeP10 * 2 },
      imageLabel: f.imageLabel.trim() || slugify(f.name) || "produit",
      image_url: f.imageUrl || null,
      isNew: f.isNew,
      isBestseller: f.isBestseller,
      active: f.active,
      stock: isFull ? fbStock : stock5 + stock10,
      stock_5ml: stock5,
      stock_10ml: stock10,
      sale_mode: f.saleMode,
      full_bottle_volume_ml: isFull ? fbVolume : null,
      full_bottle_price: isFull ? fbPrice : null,
      full_bottle_stock: fbStock,
      full_bottle_limited: isFull ? f.fbLimited : false,
    };

    try {
      setSaving(true);
      if (isUuid(id)) {
        await upsertParfumToSupabase(payload, f.imageUrl || null);
      }
      if (initial) {
        updateProduct(initial.id, payload);
        toast.success("Produit mis à jour");
      } else {
        addProduct(payload);
        toast.success("Produit ajouté");
      }
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Erreur d'enregistrement côté serveur");
    } finally {
      setSaving(false);
    }
  };

  const isFull = f.saleMode === "full_bottle";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#FFFFFF] dark:bg-[#1A1A1A] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#111827] dark:text-[#F9FAFB]">
            {initial ? "Modifier le produit" : "Ajouter un produit"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-6 mt-2">
          {/* Sale mode selector */}
          <section>
            <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Mode de vente</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => set("saleMode", "decant")}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  !isFull
                    ? "border-[#C9A96E] bg-[#C9A96E]/5"
                    : "border-[#E5E7EB] dark:border-[#2A2A2A] hover:border-[#C9A96E]/40"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Droplet className="w-4 h-4 text-[#C9A96E]" />
                  <span className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">Décants</span>
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">Vente par formats 5 ml et 10 ml.</p>
              </button>
              <button
                type="button"
                onClick={() => set("saleMode", "full_bottle")}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  isFull
                    ? "border-[#C9A96E] bg-[#C9A96E]/5"
                    : "border-[#E5E7EB] dark:border-[#2A2A2A] hover:border-[#C9A96E]/40"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Wine className="w-4 h-4 text-[#C9A96E]" />
                  <span className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">Bouteille complète</span>
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">Flacon scellé, un seul format.</p>
              </button>
            </div>
          </section>

          {/* General */}
          <section>
            <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Informations générales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Nom du parfum *</label>
                <input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} />
                {errors.name && <p className="text-xs text-[#EF4444] mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className={labelCls}>Maison / Marque *</label>
                <input className={inputCls} value={f.maison} onChange={(e) => set("maison", e.target.value)} />
                {errors.maison && <p className="text-xs text-[#EF4444] mt-1">{errors.maison}</p>}
              </div>
              <div>
                <label className={labelCls}>Genre</label>
                <select
                  className={inputCls}
                  value={f.gender}
                  onChange={(e) => set("gender", e.target.value as Gender)}
                >
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Mixte">Mixte</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  Description courte
                  <span className="float-right text-[#6B7280] dark:text-[#9CA3AF]">{f.description.length}/200</span>
                </label>
                <textarea
                  className={inputCls + " min-h-[80px] resize-none"}
                  maxLength={200}
                  value={f.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Notes olfactives</h3>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Notes de tête (séparées par virgules)</label>
                <input className={inputCls} value={f.tete} onChange={(e) => set("tete", e.target.value)} placeholder="Bergamote, Citron" />
              </div>
              <div>
                <label className={labelCls}>Notes de cœur</label>
                <input className={inputCls} value={f.coeur} onChange={(e) => set("coeur", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Notes de fond</label>
                <input className={inputCls} value={f.fond} onChange={(e) => set("fond", e.target.value)} />
              </div>
            </div>
          </section>

          {!isFull ? (
            <>
              {/* Pricing - decant */}
              <section>
                <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Tarification (MAD)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Prix 5ml *</label>
                    <input type="number" className={inputCls} value={f.p5} onChange={(e) => set("p5", e.target.value)} />
                    {errors.p5 && <p className="text-xs text-[#EF4444] mt-1">{errors.p5}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Prix 10ml *</label>
                    <input type="number" className={inputCls} value={f.p10} onChange={(e) => set("p10", e.target.value)} />
                    {errors.p10 && <p className="text-xs text-[#EF4444] mt-1">{errors.p10}</p>}
                  </div>
                </div>
              </section>

              {/* Stock - decant */}
              <section>
                <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Stock (bouteilles)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Bouteilles 5ml</label>
                    <input type="number" min={0} className={inputCls} value={f.stock5} onChange={(e) => set("stock5", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Bouteilles 10ml</label>
                    <input type="number" min={0} className={inputCls} value={f.stock10} onChange={(e) => set("stock10", e.target.value)} />
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Full bottle */}
              <section>
                <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Bouteille complète</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Volume (ml) *</label>
                    <input type="number" min={1} className={inputCls} value={f.fbVolume} onChange={(e) => set("fbVolume", e.target.value)} placeholder="100" />
                    {errors.fbVolume && <p className="text-xs text-[#EF4444] mt-1">{errors.fbVolume}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Prix (MAD) *</label>
                    <input type="number" min={0} className={inputCls} value={f.fbPrice} onChange={(e) => set("fbPrice", e.target.value)} placeholder="1800" />
                    {errors.fbPrice && <p className="text-xs text-[#EF4444] mt-1">{errors.fbPrice}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Stock</label>
                    <input type="number" min={0} className={inputCls} value={f.fbStock} onChange={(e) => set("fbStock", e.target.value)} />
                  </div>
                </div>
                <label className="flex items-center justify-between text-sm mt-4 p-3 rounded-md border border-[#E5E7EB] dark:border-[#2A2A2A] bg-[#F8F9FA] dark:bg-[#0F0F0F]">
                  <span className="text-[#111827] dark:text-[#F9FAFB]">Édition limitée (badge doré)</span>
                  <Switch checked={f.fbLimited} onCheckedChange={(v) => set("fbLimited", v)} />
                </label>
              </section>
            </>
          )}

          {/* Image */}
          <section>
            <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Image du produit</h3>

            <div className="flex items-start gap-4">
              <div className="w-28 h-28 shrink-0 rounded-md border border-[#E5E7EB] dark:border-[#2A2A2A] bg-[#F8F9FA] dark:bg-[#0F0F0F] overflow-hidden flex items-center justify-center">
                {f.imageUrl ? (
                  <img src={f.imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] uppercase tracking-widest text-[#9CA3AF]">Aucune</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-md border border-[#E5E7EB] dark:border-[#2A2A2A] hover:bg-[#F8F9FA] dark:hover:bg-white/5 disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {uploading ? "Téléchargement..." : f.imageUrl ? "Remplacer l'image" : "Téléverser une image"}
                  </button>
                  {f.imageUrl && (
                    <button
                      type="button"
                      onClick={() => set("imageUrl", "")}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs rounded-md border border-[#E5E7EB] dark:border-[#2A2A2A] text-[#EF4444] hover:bg-[#EF4444]/10"
                    >
                      <X className="w-3.5 h-3.5" /> Retirer
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">JPG / PNG / WEBP — 5 MB max. L'image s'affichera côté client.</p>
              </div>
            </div>

            <div className="mt-4">
              <label className={labelCls}>Label image (texte de repli)</label>
              <input
                className={inputCls}
                value={f.imageLabel}
                onChange={(e) => set("imageLabel", e.target.value)}
                placeholder="baccarat-rouge"
              />
            </div>
          </section>


          {/* Status */}
          <section>
            <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Statut</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm">
                <span>Produit actif</span>
                <Switch checked={f.active} onCheckedChange={(v) => set("active", v)} />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span>Nouveau produit (badge "New")</span>
                <Switch checked={f.isNew} onCheckedChange={(v) => set("isNew", v)} />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span>Bestseller (carrousel accueil)</span>
                <Switch checked={f.isBestseller} onCheckedChange={(v) => set("isBestseller", v)} />
              </label>
            </div>
          </section>

          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm rounded-md border border-[#E5E7EB] dark:border-[#2A2A2A] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F8F9FA] dark:hover:bg-white/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-[#111827] dark:bg-[#C9A96E] text-white dark:text-[#111827] hover:bg-[#1F2937] dark:hover:bg-[#C9A96E] dark:hover:text-[#111827] disabled:opacity-60"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Enregistrer
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
