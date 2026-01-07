import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

function safe(v, fallback = "N/D") {
  if (v === null || v === undefined || v === "") return fallback;
  return String(v);
}

function formatDate(v) {
  if (!v) return "N/D";
  const d = dayjs(v);
  return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : String(v);
}

function money(v) {
  if (v === null || v === undefined || v === "") return "N/D";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

function toList(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return [v];
}

// Intenta “adivinar” campos típicos de obligaciones/pagos (porque vienen de un servicio externo)
function mapObligacion(o) {
  return {
    institucion: o?.institucion ?? o?.otorgante ?? o?.acreedor ?? o?.nombreOtorgante ?? "N/D",
    tipo: o?.tipo ?? o?.tipoCredito ?? o?.producto ?? o?.descripcion ?? "N/D",
    saldo: o?.saldo ?? o?.monto ?? o?.importe ?? o?.saldoActual ?? "N/D",
    estado: o?.estado ?? o?.estatus ?? o?.situacion ?? o?.status ?? "N/D",
    apertura: o?.fechaApertura ?? o?.apertura ?? o?.fechaInicio ?? null,
  };
}

function mapPago(p) {
  return {
    obligacionId: p?.obligacionId ?? p?.idObligacion ?? p?.creditoId ?? "N/D",
    fecha: p?.fechaPago ?? p?.fecha ?? p?.periodo ?? null,
    monto: p?.monto ?? p?.importe ?? p?.pago ?? "N/D",
    estado: p?.estado ?? p?.estatus ?? p?.situacion ?? "N/D",
  };
}

export function generarPdfReporteCredito(model) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  const C = {
    primary: [15, 23, 42],
    secondary: [51, 65, 85],
    muted: [100, 116, 139],
    light: [241, 245, 249],
    border: [226, 232, 240],
  };

  const entidad = model?.historialCompleto?.entidad
    ?? model?.ultimoScoring?.entidad
    ?? model?.historialScore?.entidad
    ?? {};

  const scoringActual = model?.ultimoScoring?.scoring ?? {};
  const historialScoring = model?.historialScore?.historial ?? [];

  const resumenCrediticio = model?.historialCompleto?.resumenCrediticio;
  const obligacionesRaw = toList(model?.historialCompleto?.obligaciones);
  const pagosRaw = toList(model?.historialCompleto?.pagos);

  // Header
  doc.setFillColor(...C.primary);
  doc.rect(0, 0, pageWidth, 92, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Reporte de crédito", 48, 52);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Crédito Seguro", 48, 72);

  // Caja de identificación
  const yBox = 115;
  doc.setFillColor(...C.light);
  doc.rect(48, yBox, pageWidth - 96, 78, "F");
  doc.setDrawColor(...C.border);
  doc.rect(48, yBox, pageWidth - 96, 78);

  doc.setTextColor(...C.secondary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text("Titular:", 60, yBox + 24);
  doc.text("RFC:", 60, yBox + 44);
  doc.text("Tipo:", 60, yBox + 64);

  doc.setFont("helvetica", "normal");
  doc.text(safe(entidad?.nombreLegal), 130, yBox + 24);
  doc.text(safe(entidad?.rfc ?? model?.rfc), 130, yBox + 44);
  doc.text(safe(entidad?.tipoEntidad), 130, yBox + 64);

  // Meta derecha
  doc.setFont("helvetica", "bold");
  doc.text("Generado:", pageWidth - 240, yBox + 24);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(model?.generadoEn), pageWidth - 165, yBox + 24);

  const consultasRest = model?.historialCompleto?.consultasRestantes;
  doc.setFont("helvetica", "bold");
  doc.text("Consultas restantes:", pageWidth - 240, yBox + 44);
  doc.setFont("helvetica", "normal");
  doc.text(safe(consultasRest), pageWidth - 125, yBox + 44);

  // Título sección
  const sectionTitle = (title, y) => {
    doc.setTextColor(...C.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, 48, y);
    doc.setDrawColor(...C.border);
    doc.line(48, y + 10, pageWidth - 48, y + 10);
  };

  let y = 230;

  // Sección: Scoring actual
  sectionTitle("Scoring actual", y);

  autoTable(doc, {
    startY: y + 18,
    theme: "grid",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 6, lineColor: C.border, lineWidth: 0.6 },
    headStyles: { fillColor: C.primary, textColor: 255, fontStyle: "bold" },
    bodyStyles: { textColor: C.secondary },
    margin: { left: 48, right: 48 },
    head: [["Campo", "Valor"]],
    body: [
      ["Puntaje (puntajeScore)", safe(scoringActual?.puntajeScore)],
      ["Nivel de riesgo", safe(scoringActual?.nivelRiesgo)],
      ["Fecha de cálculo", formatDate(scoringActual?.fechaCalculo)],
    ],
  });

  // Factores (positivos/negativos) como listas
  const pos = toList(scoringActual?.factoresPositivos).slice(0, 10);
  const neg = toList(scoringActual?.factoresNegativos).slice(0, 10);

  y = doc.lastAutoTable.finalY + 18;
  if (y > 720) { doc.addPage(); y = 70; }

  sectionTitle("Factores del scoring", y);

  autoTable(doc, {
    startY: y + 18,
    theme: "striped",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: C.primary, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: C.light },
    bodyStyles: { textColor: C.secondary },
    margin: { left: 48, right: 48 },
    head: [["Factores positivos", "Factores negativos"]],
    body: [[
      pos.length ? pos.map((x) => `• ${safe(x)}`).join("\n") : "N/D",
      neg.length ? neg.map((x) => `• ${safe(x)}`).join("\n") : "N/D",
    ]],
  });

  // Sección: Historial de scoring (12)
  y = doc.lastAutoTable.finalY + 18;
  if (y > 720) { doc.addPage(); y = 70; }

  sectionTitle("Historial de scoring (últimos 12)", y);

  const histRows = (historialScoring || []).map((h) => ([
    formatDate(h?.fechaCalculo),
    safe(h?.puntajeScore),
    safe(h?.nivelRiesgo),
  ]));

  autoTable(doc, {
    startY: y + 18,
    theme: "striped",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: C.primary, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: C.light },
    bodyStyles: { textColor: C.secondary },
    margin: { left: 48, right: 48 },
    head: [["Fecha cálculo", "Puntaje", "Riesgo"]],
    body: histRows.length ? histRows : [["N/D", "N/D", "N/D"]],
  });

// Sección: Resumen crediticio (formato legible)
y = doc.lastAutoTable.finalY + 18;
if (y > 720) { doc.addPage(); y = 70; }

sectionTitle("Resumen crediticio", y);

// Normaliza: a veces viene {error, mensaje, datos}, otras veces directo
const resumen = resumenCrediticio?.datos ?? resumenCrediticio ?? null;

const resumenPairs = (obj, keys) =>
  keys
    .filter(k => obj?.[k] !== undefined && obj?.[k] !== null && obj?.[k] !== "")
    .map(k => [k, String(obj[k])]);

const fecha = (v) => {
  if (!v) return "N/D";
  const d = dayjs(v);
  return d.isValid() ? d.format("DD/MM/YYYY") : String(v);
};

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const asMoney = (v) => {
  const n = asNumber(v);
  if (n === null) return safe(v);
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
};

if (!resumen) {
  autoTable(doc, {
    startY: y + 18,
    theme: "grid",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 8, lineColor: C.border, lineWidth: 0.6 },
    headStyles: { fillColor: C.primary, textColor: 255, fontStyle: "bold" },
    bodyStyles: { textColor: C.secondary },
    margin: { left: 48, right: 48 },
    head: [["Información"]],
    body: [["N/D"]],
  });
} else {
  // 1) Datos del titular
  autoTable(doc, {
    startY: y + 18,
    theme: "grid",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 6, lineColor: C.border, lineWidth: 0.6 },
    headStyles: { fillColor: C.primary, textColor: 255, fontStyle: "bold" },
    bodyStyles: { textColor: C.secondary },
    margin: { left: 48, right: 48 },
    head: [["Datos del titular", "Valor"]],
    body: [
      ["RFC", safe(resumen.rfc)],
      ["Tipo persona", safe(resumen.tipo_persona)],
      ["Estatus", safe(resumen.estatus_persona)],
      ["Email", safe(resumen.email)],
      ["Teléfono", safe(resumen.telefono)],
      ["Fecha registro", fecha(resumen.fecha_registro)],
    ],
  });

  // 2) Resumen de obligaciones
  let y2 = doc.lastAutoTable.finalY + 14;
  if (y2 > 720) { doc.addPage(); y2 = 70; }

  autoTable(doc, {
    startY: y2,
    theme: "striped",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: C.primary, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: C.light },
    bodyStyles: { textColor: C.secondary },
    margin: { left: 48, right: 48 },
    head: [["Resumen de obligaciones", "Cantidad"]],
    body: [
      ["Total obligaciones", safe(resumen.total_obligaciones)],
      ["Vigentes", safe(resumen.obligaciones_vigentes)],
      ["Vencidas", safe(resumen.obligaciones_vencidas)],
      ["Cerradas", safe(resumen.obligaciones_cerradas)],
      ["Canceladas", safe(resumen.obligaciones_canceladas)],
      ["Cartera vencida", safe(resumen.obligaciones_cartera_vencida)],
      ["Reestructuradas", safe(resumen.obligaciones_reestructuradas)],
    ],
  });

  // 3) Montos globales
  let y3 = doc.lastAutoTable.finalY + 14;
  if (y3 > 720) { doc.addPage(); y3 = 70; }

  autoTable(doc, {
    startY: y3,
    theme: "striped",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: C.primary, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: C.light },
    bodyStyles: { textColor: C.secondary },
    margin: { left: 48, right: 48 },
    head: [["Montos globales", "Valor"]],
    body: [
      ["Monto total original", asMoney(resumen.monto_total_original)],
      ["Saldo total actual", asMoney(resumen.saldo_total_actual)],
      ["Monto total vencido", asMoney(resumen.monto_total_vencido)],
      ["Límite de crédito total", asMoney(resumen.limite_credito_total)],
    ],
  });

  // 4) Comportamiento e historial
  let y4 = doc.lastAutoTable.finalY + 14;
  if (y4 > 720) { doc.addPage(); y4 = 70; }

  autoTable(doc, {
    startY: y4,
    theme: "striped",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: C.primary, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: C.light },
    bodyStyles: { textColor: C.secondary },
    margin: { left: 48, right: 48 },
    head: [["Historial y comportamiento", "Valor"]],
    body: [
      ["Máx. días de atraso", safe(resumen.max_dias_atraso)],
      ["Total pagos atrasados", safe(resumen.total_pagos_atrasados)],
      ["Crédito más antiguo", fecha(resumen.fecha_credito_mas_antiguo)],
      ["Crédito más reciente", fecha(resumen.fecha_credito_mas_reciente)],
      ["Meses de historial crediticio", safe(resumen.meses_historial_crediticio)],
    ],
  });
}


  // Sección: Obligaciones (tabla)
  y = doc.lastAutoTable.finalY + 18;
  if (y > 720) { doc.addPage(); y = 70; }

  sectionTitle("Obligaciones", y);

  const obligRows = obligacionesRaw.slice(0, 12).map((o) => {
    const m = mapObligacion(o);
    return [
      safe(m.institucion),
      safe(m.tipo),
      money(m.saldo),
      safe(m.estado),
      m.apertura ? formatDate(m.apertura) : "N/D",
    ];
  });

  autoTable(doc, {
    startY: y + 18,
    theme: "striped",
    styles: { font: "helvetica", fontSize: 9.5, cellPadding: 6 },
    headStyles: { fillColor: C.primary, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: C.light },
    bodyStyles: { textColor: C.secondary },
    margin: { left: 48, right: 48 },
    head: [["Institución", "Tipo", "Saldo/Monto", "Estado", "Apertura"]],
    body: obligRows.length ? obligRows : [["N/D", "N/D", "N/D", "N/D", "N/D"]],
  });

  // Sección: Pagos (tabla)
  y = doc.lastAutoTable.finalY + 18;
  if (y > 720) { doc.addPage(); y = 70; }

  sectionTitle("Pagos", y);

  const pagoRows = pagosRaw.slice(0, 15).map((p) => {
    const m = mapPago(p);
    return [
      safe(m.obligacionId),
      m.fecha ? formatDate(m.fecha) : "N/D",
      money(m.monto),
      safe(m.estado),
    ];
  });

  autoTable(doc, {
    startY: y + 18,
    theme: "striped",
    styles: { font: "helvetica", fontSize: 9.5, cellPadding: 6 },
    headStyles: { fillColor: C.primary, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: C.light },
    bodyStyles: { textColor: C.secondary },
    margin: { left: 48, right: 48 },
    head: [["Obligación", "Fecha", "Monto", "Estado"]],
    body: pagoRows.length ? pagoRows : [["N/D", "N/D", "N/D", "N/D"]],
  });

  // Footer en cada página
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...C.border);
    doc.line(48, 800, pageWidth - 48, 800);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...C.muted);
    doc.text("Crédito Seguro • Reporte generado por el sistema", 48, 820);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 120, 820);
  }

  return doc;
}

export function descargarPdf(doc, filename) {
  doc.save(filename);
}
