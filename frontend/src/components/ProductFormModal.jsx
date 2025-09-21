// frontend/src/components/ProductFormModal.jsx
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function ProductFormModal({ open, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    subCategory: "",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    reorderLevel: 5,
    supplier: ""
  });

  useEffect(()=>{
    if(editing) setForm(editing);
    else setForm({ name:"", sku:"", category:"", subCategory:"", quantity:0, costPrice:0, sellingPrice:0, reorderLevel:5, supplier:"" });
  }, [editing, open]);

  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-4 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-bold mb-3">{editing ? "Edit Product" : "Add Product"}</h3>
        <div className="space-y-2">
          <Input value={form.name} placeholder="Name" onChange={e=>setForm({...form, name:e.target.value})} />
          <Input value={form.sku} placeholder="SKU" onChange={e=>setForm({...form, sku:e.target.value})} />
          <Input value={form.category} placeholder="Category" onChange={e=>setForm({...form, category:e.target.value})} />
          <Input value={form.subCategory} placeholder="Subcategory" onChange={e=>setForm({...form, subCategory:e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" value={form.quantity} placeholder="Quantity" onChange={e=>setForm({...form, quantity:Number(e.target.value)})} />
            <Input type="number" value={form.reorderLevel} placeholder="Reorder Level" onChange={e=>setForm({...form, reorderLevel:Number(e.target.value)})} />
            <Input type="number" value={form.costPrice} placeholder="Cost Price" onChange={e=>setForm({...form, costPrice:Number(e.target.value)})} />
            <Input type="number" value={form.sellingPrice} placeholder="Selling Price" onChange={e=>setForm({...form, sellingPrice:Number(e.target.value)})} />
          </div>
          <Input value={form.supplier} placeholder="Supplier" onChange={e=>setForm({...form, supplier:e.target.value})} />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button className="bg-gray-200" onClick={onClose}>Cancel</Button>
          <Button className="bg-googleGreen text-white" onClick={()=>onSave(form)}>{editing ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}
