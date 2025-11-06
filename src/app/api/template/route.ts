import * as XLSX from "xlsx";

export const runtime = "nodejs";

export async function GET() {
  // Cria um workbook com cabeçalhos e duas linhas exemplo
  const wb = XLSX.utils.book_new();
  const data = [
    ["domanda_it", "domanda_pt", "risposta_it", "risposta_pt"],
    [
      "Quanti anni hai?",
      "Quantos anos você tem?",
      "Ho venti anni.",
      "Eu tenho vinte anos.",
    ],
    [
      "Dove abiti?",
      "Onde você mora?",
      "Abito a Milano.",
      "Eu moro em Milão.",
    ],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "modelo");

  // Use ArrayBuffer/Blob em vez de Buffer para compatibilidade com Web Response
  const ab = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  const blob = new Blob([ab], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return new Response(blob, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=modelo.xlsx",
      "Cache-Control": "no-store",
    },
  });
}