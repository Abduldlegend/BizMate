import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function AddProductModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    unit: "",
    supplier: "",
    costPrice: "",
    sellingPrice: "",
    quantity: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="name" placeholder="Item Name" onChange={handleChange} />
          <Input name="sku" placeholder="SKU / Code" onChange={handleChange} />
          <Input name="category" placeholder="Category" onChange={handleChange} />
          <Input name="unit" placeholder="Unit (pcs, kg, box...)" onChange={handleChange} />
          <Input name="supplier" placeholder="Supplier" onChange={handleChange} />
          <Input type="number" name="costPrice" placeholder="Cost Price" onChange={handleChange} />
          <Input type="number" name="sellingPrice" placeholder="Selling Price" onChange={handleChange} />
          <Input type="number" name="quantity" placeholder="Stock Quantity" onChange={handleChange} />

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" onClick={onClose} className="bg-gray-200">Cancel</Button>
            <Button type="submit" className="bg-googleGreen text-white">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
