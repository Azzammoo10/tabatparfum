import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Order, OrderItem } from "@/types/database";

/* ------------------------------------------------------------------ */
/* TABAT luxury brand palette (print-friendly)                        */
/* ------------------------------------------------------------------ */
const BRAND = {
  paper:      [253, 251, 248] as [number, number, number],
  cardBg:     [246, 241, 234] as [number, number, number],
  ink:        [20,  14,  10  ] as [number, number, number], // #140E0A deep obsidian
  inkSoft:    [60,  45,  35  ] as [number, number, number],
  gold:       [216, 176, 67  ] as [number, number, number], // #D8B043 luxury gold
  goldDeep:   [170, 135, 45  ] as [number, number, number],
  muted:      [130, 115, 100 ] as [number, number, number],
  rule:       [220, 205, 185] as [number, number, number],
};

const BRAND_NAME = "TABAT";
const BRAND_TAGLINE = "Maison de Haute Parfumerie & Décantation au Maroc";
const BRAND_CONTACT = "www.tabatperfume.com  ·  +212 6 63 84 80 99";

const STATUS_LABEL: Record<string, string> = {
  en_attente: "En attente",
  confirmee:  "Confirmée",
  livree:     "Livrée",
  annulee:    "Annulée",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

const money = (n: number) => {
  const formatted = Number(n || 0)
    .toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .replace(/[\u00A0\u202F\s]/g, " ");
  return `${formatted} MAD`;
};

/** Utility to convert image URL to PNG base64 for jsPDF rendering */
async function loadImageAsBase64(url: string): Promise<string | null> {
  if (!url) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 200;
        canvas.height = img.naturalHeight || 200;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
          return;
        }
      } catch (e) {
        console.warn("Canvas conversion warning:", e);
      }
      resolve(null);
    };
    img.onerror = () => resolve(null);
  });
}

/* ------------------------------------------------------------------ */
/* Professional Luxury TABAT Invoice Builder                          */
/* ------------------------------------------------------------------ */
export async function buildInvoicePdf(order: Order): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 45;

  // Pre-load TABAT logo and product item images
  const logoBase64 = await loadImageAsBase64("/logo.svg");

  /* Paper background */
  doc.setFillColor(...BRAND.paper);
  doc.rect(0, 0, pageW, pageH, "F");

  /* Luxury Gold top bar */
  doc.setFillColor(...BRAND.gold);
  doc.rect(0, 0, pageW, 6, "F");

  /* ---------------- HEADER SECTION ---------------- */
  const headerY = 40;

  // Render TABAT Logo if available
  if (logoBase64) {
    try {
      doc.setFillColor(...BRAND.ink);
      doc.roundedRect(M, headerY, 44, 44, 8, 8, "F");
      doc.addImage(logoBase64, "PNG", M + 6, headerY + 6, 32, 32);
    } catch {
      // Fallback
    }
  }

  const titleX = logoBase64 ? M + 56 : M;
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...BRAND.ink);
  doc.text(BRAND_NAME, titleX, headerY + 22);

  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.muted);
  doc.text(BRAND_TAGLINE, titleX, headerY + 36);

  // Right Header: FACTURE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...BRAND.gold);
  doc.text("FACTURE", pageW - M, headerY + 20, { align: "right" });

  // Invoice metadata
  const metaRight = pageW - M;
  const metaLeft = metaRight - 180;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...BRAND.muted);
  doc.text("N° de Facture :", metaLeft, headerY + 36);
  doc.text("Date :", metaLeft, headerY + 50);
  doc.text("Statut :", metaLeft, headerY + 64);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.ink);
  doc.text(order.order_number, metaRight, headerY + 36, { align: "right" });
  doc.text(formatDate(order.created_at), metaRight, headerY + 50, { align: "right" });
  doc.text(STATUS_LABEL[order.status] || order.status, metaRight, headerY + 64, { align: "right" });

  /* Gold Divider Line */
  const lineY = headerY + 78;
  doc.setDrawColor(...BRAND.gold);
  doc.setLineWidth(0.8);
  doc.line(M, lineY, pageW - M, lineY);

  /* ---------------- CLIENT INFO SECTION ---------------- */
  let clientY = lineY + 24;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.gold);
  doc.text("INFORMATIONS CLIENT", M, clientY);

  clientY += 16;
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...BRAND.ink);
  doc.text(order.customer_name, M, clientY);

  if (order.customer_phone) {
    clientY += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.inkSoft);
    doc.text(`Tél : ${order.customer_phone}`, M, clientY);
  }

  if (order.customer_address) {
    clientY += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.inkSoft);
    const addrLines = doc.splitTextToSize(`Adresse : ${order.customer_address}`, 320);
    doc.text(addrLines, M, clientY);
    clientY += (addrLines.length - 1) * 12;
  }

  // Only display email if a REAL non-dummy email was provided
  if (
    order.customer_email &&
    order.customer_email.includes("@") &&
    !order.customer_email.endsWith("@client.tabat.ma") &&
    !order.customer_email.endsWith("@tabat.ma")
  ) {
    clientY += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.inkSoft);
    doc.text(`Email : ${order.customer_email}`, M, clientY);
  }

  /* ---------------- ITEMS TABLE SECTION ---------------- */
  const rows = (order.items || []).map((it: OrderItem) => {
    const rawName = it.parfum_name || it.name || "Parfum TABAT";
    const maisonStr = it.maison ? ` (${it.maison})` : "";
    const fullName = `${rawName}${maisonStr}`;
    const unitPrice = it.unit_price || it.price || 0;
    const lineTotal = it.subtotal || (it.price ? it.price * it.quantity : 0);

    return [
      fullName,
      it.size || "10ml",
      String(it.quantity),
      money(unitPrice),
      money(lineTotal),
    ];
  });

  const tableStartY = Math.max(clientY + 24, 230);

  autoTable(doc, {
    startY: tableStartY,
    head: [["Produit", "Format", "Qté", "Prix Unit.", "Total"]],
    body: rows,
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: { top: 9, right: 8, bottom: 9, left: 8 },
      textColor: BRAND.inkSoft,
      lineColor: BRAND.rule,
      lineWidth: 0,
    },
    headStyles: {
      fillColor: BRAND.ink,
      textColor: BRAND.gold,
      fontStyle: "bold",
      fontSize: 8.5,
      cellPadding: { top: 9, right: 8, bottom: 9, left: 8 },
    },
    alternateRowStyles: { fillColor: BRAND.cardBg },
    columnStyles: {
      0: { cellWidth: 230, fontStyle: "bold", textColor: BRAND.ink },
      1: { halign: "center", cellWidth: 65 },
      2: { halign: "center", cellWidth: 45 },
      3: { halign: "right", cellWidth: 80 },
      4: { halign: "right", cellWidth: 85, fontStyle: "bold", textColor: BRAND.ink },
    },
    margin: { left: M, right: M },
    didDrawCell: (data) => {
      if (data.section === "body") {
        const { x, y, width, height } = data.cell;
        doc.setDrawColor(...BRAND.rule);
        doc.setLineWidth(0.3);
        doc.line(x, y + height, x + width, y + height);
      }
    },
  });

  // @ts-expect-error lastAutoTable is injected by jspdf-autotable
  const tableEndY: number = doc.lastAutoTable.finalY || tableStartY + 60;

  /* ---------------- TOTALS SUMMARY BOX (CLEANLY ALIGNED) ---------------- */
  const boxW = 240;
  const boxX = pageW - M - boxW;
  const ty = tableEndY + 20;

  // Background Box
  doc.setFillColor(...BRAND.cardBg);
  doc.roundedRect(boxX, ty, boxW, 76, 6, 6, "F");
  doc.setDrawColor(...BRAND.gold);
  doc.setLineWidth(0.8);
  doc.roundedRect(boxX, ty, boxW, 76, 6, 6, "S");

  // Row 1: Sous-total
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.muted);
  doc.text("Sous-total :", boxX + 14, ty + 20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BRAND.ink);
  doc.text(money(order.total_amount), boxX + boxW - 14, ty + 20, { align: "right" });

  // Row 2: Livraison
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.muted);
  doc.text("Livraison Express Maroc :", boxX + 14, ty + 36);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BRAND.ink);
  doc.text("Gratuite", boxX + boxW - 14, ty + 36, { align: "right" });

  // Divider line
  doc.setDrawColor(...BRAND.rule);
  doc.setLineWidth(0.5);
  doc.line(boxX + 10, ty + 46, boxX + boxW - 10, ty + 46);

  // Row 3: Total à Payer
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.ink);
  doc.text("TOTAL À PAYER", boxX + 14, ty + 62);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BRAND.goldDeep);
  doc.text(money(order.total_amount), boxX + boxW - 14, ty + 62, { align: "right" });

  /* ---------------- FOOTER SECTION ---------------- */
  const fy = pageH - 50;
  doc.setDrawColor(...BRAND.gold);
  doc.setLineWidth(0.5);
  doc.line(M, fy, pageW - M, fy);

  doc.setFont("times", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(...BRAND.ink);
  doc.text("Merci pour votre confiance en la Maison TABAT.", pageW / 2, fy + 16, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...BRAND.muted);
  doc.text(BRAND_CONTACT, pageW / 2, fy + 30, { align: "center" });

  /* Bottom Gold Line */
  doc.setFillColor(...BRAND.gold);
  doc.rect(0, pageH - 4, pageW, 4, "F");

  return doc;
}

export async function downloadInvoice(order: Order) {
  const doc = await buildInvoicePdf(order);
  doc.save(`TABAT-Facture-${order.order_number}.pdf`);
}

/** Normalize phone for wa.me */
export function normalizeWhatsappNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let p = raw.replace(/\D/g, "");
  if (!p) return null;
  if (p.startsWith("00")) p = p.slice(2);
  if (p.startsWith("0")) p = "212" + p.slice(1);
  return p;
}

export async function sendInvoiceViaWhatsapp(order: Order) {
  await downloadInvoice(order);

  const phone = normalizeWhatsappNumber(order.customer_phone);
  const message =
    `Bonjour ${order.customer_name},\n\n` +
    `Voici votre facture TABAT n° ${order.order_number} ` +
    `d'un montant de ${money(order.total_amount)}.\n\n` +
    `Le PDF de la facture vient d'être téléchargé sur votre appareil.\n\n` +
    `À très bientôt,\nL'équipe TABAT`;

  const url = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}
