import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Order, OrderItem } from "@/types/database";

/* ------------------------------------------------------------------ */
/* Noiressence brand palette (print-friendly variants)                */
/* ------------------------------------------------------------------ */
const BRAND = {
  cream:      [251, 247, 241] as [number, number, number], // paper
  creamSoft:  [245, 236, 222] as [number, number, number], // row tint
  ink:        [26,  18,  14 ] as [number, number, number], // #1A120E
  inkSoft:    [58,  42,  34 ] as [number, number, number], // #3A2A22
  gold:       [188, 157, 69 ] as [number, number, number], // #BC9D45
  goldDeep:   [148, 122, 50 ] as [number, number, number],
  muted:      [120, 104, 90 ] as [number, number, number],
  rule:       [205, 188, 158] as [number, number, number],
};

const BRAND_NAME = "TABAT";
const BRAND_TAGLINE = "Parfums & Déodorants Premium au Maroc";
const BRAND_CONTACT = "tabatperfume.com  ·  contact@tabatperfume.com";

const STATUS_LABEL: Record<string, string> = {
  en_attente: "En attente",
  confirmee:  "Confirmée",
  livree:     "Livrée",
  annulee:    "Annulée",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

const money = (n: number) => {
  // Use plain ASCII space (Helvetica in jsPDF mis-renders U+202F narrow nbsp)
  const formatted = Number(n)
    .toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .replace(/[\u00A0\u202F\s]/g, " ");
  return `${formatted} MAD`;
};

/* ------------------------------------------------------------------ */
/* PDF builder                                                         */
/* ------------------------------------------------------------------ */
export function buildInvoicePdf(order: Order): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 48;

  /* Cream paper background */
  doc.setFillColor(...BRAND.cream);
  doc.rect(0, 0, pageW, pageH, "F");

  /* Gold top bar */
  doc.setFillColor(...BRAND.gold);
  doc.rect(0, 0, pageW, 6, "F");

  /* ---------------- Header ---------------- */
  // Wordmark — tracked-out serif caps
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...BRAND.ink);
  doc.setCharSpace(6);
  doc.text(BRAND_NAME, M, 70);
  doc.setCharSpace(0);

  // Tagline
  doc.setFont("times", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(...BRAND.muted);
  doc.text(BRAND_TAGLINE, M, 88);

  // Right side — "FACTURE" gold caps
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.gold);
  doc.setCharSpace(4);
  doc.text("FACTURE", pageW - M, 60, { align: "right" });
  doc.setCharSpace(0);

  // Invoice meta (right column) — labels left-aligned, values right-aligned
  const metaRight = pageW - M;
  const metaLeft = metaRight - 200;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...BRAND.muted);
  doc.text("N° DE FACTURE", metaLeft, 76);
  doc.text("DATE D'ÉMISSION", metaLeft, 92);
  doc.text("STATUT", metaLeft, 108);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BRAND.ink);
  doc.text(order.order_number, metaRight, 76, { align: "right" });
  doc.text(formatDate(order.created_at), metaRight, 92, { align: "right" });
  doc.text(STATUS_LABEL[order.status] || order.status, metaRight, 108, { align: "right" });

  /* Hairline gold divider */
  doc.setDrawColor(...BRAND.gold);
  doc.setLineWidth(0.6);
  doc.line(M, 128, pageW - M, 128);

  /* ---------------- Billed To ---------------- */
  let y = 158;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.gold);
  doc.setCharSpace(2);
  doc.text("FACTURÉ À", M, y);
  doc.setCharSpace(0);

  y += 18;
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BRAND.ink);
  doc.text(order.customer_name, M, y);

  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...BRAND.inkSoft);
  doc.text(order.customer_email, M, y);
  if (order.customer_phone) { y += 13; doc.text(order.customer_phone, M, y); }
  if (order.customer_address) {
    y += 13;
    const lines = doc.splitTextToSize(order.customer_address, 260);
    doc.text(lines, M, y);
    y += lines.length * 12;
  }

  /* ---------------- Items table ---------------- */
  const rows = order.items.map((it: OrderItem) => [
    { content: it.parfum_name, styles: { fontStyle: "bold" as const, textColor: BRAND.ink } },
    it.maison ?? "—",
    it.size,
    String(it.quantity),
    money(it.unit_price),
    money(it.subtotal),
  ]);

  autoTable(doc, {
    startY: Math.max(y + 28, 252),
    head: [["Produit", "Maison", "Format", "Qté", "Prix unitaire", "Sous-total"]],
    body: rows,
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 9.5,
      cellPadding: { top: 10, right: 8, bottom: 10, left: 8 },
      textColor: BRAND.inkSoft,
      lineColor: BRAND.rule,
      lineWidth: 0,
    },
    headStyles: {
      fillColor: BRAND.ink,
      textColor: BRAND.gold,
      fontStyle: "bold",
      fontSize: 8.5,
      cellPadding: { top: 10, right: 8, bottom: 10, left: 8 },
    },
    alternateRowStyles: { fillColor: BRAND.creamSoft },
    columnStyles: {
      0: { cellWidth: 150 },
      1: { textColor: BRAND.muted, fontStyle: "italic" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "right" },
      5: { halign: "right", fontStyle: "bold", textColor: BRAND.ink },
    },
    margin: { left: M, right: M },
    didDrawCell: (data) => {
      // Bottom hairline rule under each body row
      if (data.section === "body") {
        const { x, y, width, height } = data.cell;
        doc.setDrawColor(...BRAND.rule);
        doc.setLineWidth(0.3);
        doc.line(x, y + height, x + width, y + height);
      }
    },
  });

  // @ts-expect-error lastAutoTable is injected by jspdf-autotable
  const tableEndY: number = doc.lastAutoTable.finalY;

  /* ---------------- Totals block ---------------- */
  const totalsX = pageW - M;
  const labelX = totalsX - 160;
  let ty = tableEndY + 28;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...BRAND.muted);
  doc.text("Sous-total", labelX, ty);
  doc.setTextColor(...BRAND.ink);
  doc.text(money(order.total_amount), totalsX, ty, { align: "right" });

  ty += 16;
  doc.setTextColor(...BRAND.muted);
  doc.text("Livraison", labelX, ty);
  doc.setTextColor(...BRAND.ink);
  doc.text("Offerte", totalsX, ty, { align: "right" });

  // Gold rule above total
  ty += 14;
  doc.setDrawColor(...BRAND.gold);
  doc.setLineWidth(0.8);
  doc.line(labelX, ty, totalsX, ty);

  ty += 22;
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BRAND.ink);
  doc.setCharSpace(2);
  doc.text("TOTAL", labelX, ty);
  doc.setCharSpace(0);
  doc.setTextColor(...BRAND.goldDeep);
  doc.setFontSize(15);
  doc.text(money(order.total_amount), totalsX, ty, { align: "right" });

  /* ---------------- Notes ---------------- */
  if (order.notes) {
    const ny = ty + 36;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...BRAND.gold);
    doc.setCharSpace(2);
    doc.text("NOTES", M, ny);
    doc.setCharSpace(0);
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...BRAND.inkSoft);
    const notes = doc.splitTextToSize(order.notes, pageW - 2 * M);
    doc.text(notes, M, ny + 16);
  }

  /* ---------------- Footer ---------------- */
  const fy = pageH - 56;
  doc.setDrawColor(...BRAND.gold);
  doc.setLineWidth(0.4);
  doc.line(M, fy, pageW - M, fy);

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.setTextColor(...BRAND.ink);
  doc.text("Merci pour votre confiance.", pageW / 2, fy + 18, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.setCharSpace(1.5);
  doc.text(BRAND_CONTACT, pageW / 2, fy + 32, { align: "center" });
  doc.setCharSpace(0);

  // Gold bottom bar
  doc.setFillColor(...BRAND.gold);
  doc.rect(0, pageH - 4, pageW, 4, "F");

  return doc;
}

export function downloadInvoice(order: Order) {
  const doc = buildInvoicePdf(order);
  doc.save(`Myaura-Facture-${order.order_number}.pdf`);
}

/** Normalize phone for wa.me: digits only, default to Morocco (+212) if local. */
export function normalizeWhatsappNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let p = raw.replace(/\D/g, "");
  if (!p) return null;
  if (p.startsWith("00")) p = p.slice(2);
  if (p.startsWith("0")) p = "212" + p.slice(1);
  return p;
}

export function sendInvoiceViaWhatsapp(order: Order) {
  downloadInvoice(order);

  const phone = normalizeWhatsappNumber(order.customer_phone);
  const message =
    `Bonjour ${order.customer_name},\n\n` +
    `Voici votre facture Myaura n° ${order.order_number} ` +
    `d'un montant de ${money(order.total_amount)}.\n\n` +
    `Le PDF de la facture vient d'être téléchargé — merci de le joindre à ce message.\n\n` +
    `À très vite,\nMyaura`;

  const url = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}
