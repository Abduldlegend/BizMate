import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import api from "@/api"; // your axios instance

export default function InvoiceModal({ open, onClose, onSaved, editing }) {
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [items, setItems] = useState([]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryMatches, setInventoryMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    if (editing) {
      setCustomer(editing.customer || { name:"" });
      setItems(editing.items || []);
      setTax(editing.tax || 0);
      setDiscount(editing.discount || 0);
      setDueDate(editing.dueDate ? editing.dueDate.slice(0,10) : "");
    } else {
      setCustomer({ name: "", email: "", phone: "", address: "" });
      setItems([]);
      setTax(0);
      setDiscount(0);
      setDueDate("");
    }
  }, [editing, open]);

  useEffect(() => {
    if (!searchTerm) return setInventoryMatches([]);
    let canceled = false;
    setLoadingMatches(true);
    api.get(`/api/inventory/products?q=${encodeURIComponent(searchTerm)}`).then(r=>{
      if(!canceled) setInventoryMatches(r.data.products || r.data || []);
    }).catch(()=>{}).finally(()=>{ if(!canceled) setLoadingMatches(false) });
    return ()=> canceled = true;
  }, [searchTerm]);

  function addItemManual() {
    setItems(prev => [...prev, { name: "", description: "", quantity: 1, price: 0, total: 0 }]);
  }

  function addProductFromInventory(prod) {
    setItems(prev => [...prev, {
      productId: prod._id,
      name: prod.name,
      description: prod.description || "",
      quantity: 1,
      price: prod.sellingPrice || 0,
      total: Number(prod.sellingPrice || 0)
    }]);
    setSearchTerm("");
    setInventoryMatches([]);
  }

  function updateItem(idx, key, val) {
    setItems(prev => prev.map((it, i) => i===idx ? ({ ...it, [key]: key === "quantity" || key === "price" ? Number(val) : val, total: (key === "quantity" || key === "price") ? ((key === "quantity" ? Number(val) : it.quantity) * (key === "price"? Number(val) : it.price)) : it.total }) : it));
  }

  const subtotal = items.reduce((s, it) => s + (Number(it.total || 0)), 0);
  const totalAmount = subtotal + Number(tax || 0) - Number(discount || 0);

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      customer,
      items,
      tax,
      discount,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: "Pending"
    };
    try {
      if (editing) {
        await api.put(`/api/invoices/${editing._id}`, payload); // optional: implement full update route if needed
        onSaved();
        onClose();
        return;
      }
      const res = await api.post("/api/invoices", payload);
      onSaved(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || "Failed to save invoice");
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-4">
        <h3 className="text-lg font-bold mb-3">{editing ? "Edit Invoice" : "Create Invoice"}</h3>

        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input placeholder="Customer name" value={customer.name} onChange={e=>setCustomer({...customer, name:e.target.value})} required />
            <Input placeholder="Customer email" value={customer.email} onChange={e=>setCustomer({...customer, email:e.target.value})} />
            <Input placeholder="Phone" value={customer.phone} onChange={e=>setCustomer({...customer, phone:e.target.value})} />
            <Input placeholder="Address" value={customer.address} onChange={e=>setCustomer({...customer, address:e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Add product from inventory</label>
            <div className="flex gap-2">
              <Input placeholder="Search inventory..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
              <Button type="button" onClick={addItemManual} className="bg-googleYellow">Add manual</Button>
            </div>
            { loadingMatches && <div className="text-sm text-gray-500 mt-2">Searching...</div> }
            { inventoryMatches.length > 0 && (
              <div className="mt-2 bg-white border rounded max-h-40 overflow-auto p-2">
                {inventoryMatches.map(p => (
                  <div key={p._id} className="p-2 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.sku} • {p.category}</div>
                    </div>
                    <button type="button" onClick={()=>addProductFromInventory(p)} className="text-sm px-3 py-1 bg-googleGreen text-white rounded">Add</button>
                  </div>
                ))}
              </div>
            ) }
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Rate</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{idx+1}</td>
                    <td className="p-2">
                      <Input value={it.name} onChange={e=>updateItem(idx, "name", e.target.value)} />
                    </td>
                    <td className="p-2"><Input type="number" value={it.quantity} onChange={e=>updateItem(idx, "quantity", e.target.value)} /></td>
                    <td className="p-2"><Input type="number" value={it.price} onChange={e=>updateItem(idx, "price", e.target.value)} /></td>
                    <td className="p-2">{Number(it.total || (it.quantity*it.price)).toFixed(2)}</td>
                    <td className="p-2"><button type="button" className="text-red-500" onClick={()=> setItems(prev => prev.filter((_,i)=>i!==idx))}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div></div>
            <div></div>
            <div>
              <label className="text-sm">Tax</label>
              <Input type="number" value={tax} onChange={e=>setTax(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm">Discount</label>
              <Input type="number" value={discount} onChange={e=>setDiscount(Number(e.target.value))} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm">Due Date</label>
              <Input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
            </div>
            <div className="text-right">
              <div>Subtotal: ₦{subtotal.toFixed(2)}</div>
              <div>Tax: ₦{Number(tax).toFixed(2)}</div>
              <div>Discount: ₦{Number(discount).toFixed(2)}</div>
              <div className="font-bold">Total: ₦{totalAmount.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" className="bg-gray-200" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-googleGreen text-white">Save Invoice</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
