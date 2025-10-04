// frontend/src/pages/InvoicesPage.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "@/api";
import Button from "@/components/ui/button";
import InvoiceModal from "@/components/InvoiceModal";
import { generateInvoicePDF } from "@/utils/exportInvoicePdf"; // below
import Input from "@/components/ui/input";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");

  async function load() {
    try {
      const r = await api.get(`/api/invoices?q=${encodeURIComponent(q)}`);
      setInvoices(r.data.invoices || r.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{ load(); }, [q]);

  const handleView = (inv) => {
    // open PDF or view modal — here we generate PDF
    generateInvoicePDF(inv);
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete invoice?")) return;
    await api.delete(`/api/invoices/${id}`);
    load();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <div className="text-sm text-gray-600">Create and manage invoices</div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-googleGreen text-white" onClick={()=>{ setEditing(null); setShowModal(true); }}>➕ Create Invoice</Button>
          </div>
        </div>

        <div className="mb-3 flex gap-2">
          <Input placeholder="Search invoice or customer..." value={q} onChange={e=>setQ(e.target.value)} />
          <Button onClick={()=>load()}>Search</Button>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Invoice #</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Date</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv=>(
                <tr key={inv._id} className="border-b">
                  <td className="p-2">{inv.invoiceNumber}</td>
                  <td className="p-2">{inv.customer?.name}</td>
                  <td className="p-2">{new Date(inv.createdAt).toLocaleString()}</td>
                  <td className="p-2">₦{Number(inv.totalAmount).toFixed(2)}</td>
                  <td className="p-2">{inv.status}</td>
                  <td className="p-2 flex gap-2">
                    <Button className="bg-white border" onClick={()=> handleView(inv)}>📄 View</Button>
                    <Button className="bg-yellow-400" onClick={()=> { setEditing(inv); setShowModal(true); }}>✏️ Edit</Button>
                    <Button className="bg-red-500 text-white" onClick={()=> handleDelete(inv._id)}>❌ Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InvoiceModal open={showModal} onClose={()=>{ setShowModal(false); setEditing(null); load(); }} onSaved={()=> load()} editing={editing} />
      </main>
    </div>
  );
}
