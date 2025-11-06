export const runtime = "nodejs";

export async function GET() {
  // Servir um modelo simples em CSV para evitar dependências e garantir build
  const csvLines = [
    "domanda_it,domanda_pt,risposta_it,risposta_pt",
    '"Quanti anni hai?","Quantos anos você tem?","Ho venti anni.","Eu tenho vinte anos."',
    '"Dove abiti?","Onde você mora?","Abito a Milano.","Eu moro em Milão."',
  ];
  const csv = csvLines.join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=modelo.csv",
      "Cache-Control": "no-store",
    },
  });
}

// Export default vazio para garantir que o arquivo seja tratado como módulo pelo TypeScript
export default {};