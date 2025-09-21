// frontend/src/utils/exportExcel.js
// import * as XLSX from "xlsx";
// import * as XLSX from "xlsx/xlsx.mjs";
import { saveAs } from "file-saver";

export function exportProductsToExcel(products = []){
  const data = products.map(p=>({
    Name: p.name, SKU: p.sku, Category: p.category, Subcategory: p.subCategory || "", Qty: p.quantity,
    Cost: p.costPrice, Sell: p.sellingPrice, Supplier: p.supplier
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), "products.xlsx");
}
