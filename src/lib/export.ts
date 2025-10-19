import jsPDF from "jspdf";

export function exportCSV(filename: string, rows: Array<Record<string, any>>) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(",")]
    .concat(
      rows.map((row) => headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportPDF(filename: string, title: string, rows: Array<Record<string, any>>) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFontSize(16);
  doc.text(title, 40, 40);
  doc.setFontSize(10);
  const headers = rows.length ? Object.keys(rows[0]) : [];
  let y = 70;
  doc.text(headers.join("  |  "), 40, y);
  y += 20;
  rows.forEach((row) => {
    const line = headers.map((h) => String(row[h] ?? "")).join("  |  ");
    doc.text(line, 40, y);
    y += 16;
    if (y > 780) {
      doc.addPage();
      y = 40;
    }
  });
  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
