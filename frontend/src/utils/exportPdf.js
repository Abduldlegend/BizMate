// frontend/src/utils/exportPdf.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function exportProductsToPdf(products = []){
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text("Products", 14, 16);
  autoTable(doc, {
    head: [["Name","SKU","Category","Qty","Cost","Sell"]],
    body: products.map(p=> [p.name, p.sku, p.category, p.quantity, p.costPrice, p.sellingPrice]),
    startY: 22
  });
  doc.save("products.pdf");
}
