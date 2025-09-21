// frontend/src/components/TransactionModal.jsx
import React, { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function TransactionModal({ open, onClose, onSubmit, product, type }) {
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(type === "restock" ? (product?.costPrice || 0) : (product?.sellingPrice || 0));
  const [supplier, setSupplier] = useState(product?.supplier || "");
  if(!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-4 w-full max-w-sm shadow-lg">
        <h3 className="text-lg font-bold mb-2">{type === "restock" ? "Restock Product" : "Record Sale"}</h3>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">{product?.name} ({product?.sku})</div>
          <Input type="number" value={qty} placeholder="Quantity" onChange={e=>setQty(Number(e.target.value))} />
          <Input type="number" value={price} placeholder="Unit Price" onChange={e=>setPrice(Number(e.target.value))} />
          {type === "restock" && <Input placeholder="Supplier" value={supplier} onChange={e=>setSupplier(e.target.value)} />}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button className="bg-gray-200" onClick={onClose}>Cancel</Button>
          <Button className="bg-googleBlue text-white" onClick={()=> onSubmit({
            productId: product._id, quantity: qty, ...(type==="restock"?{costPrice:price,supplier}:{sellingPrice:price})
          })}>{type === "restock" ? "Restock" : "Record Sale"}</Button>
        </div>
      </div>
    </div>
  );
}
