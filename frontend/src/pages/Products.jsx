// frontend/src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";
// import socket from "../services/socket";
import ProductFormModal from "../components/ProductFormModal";
import TransactionModal from "../components/TransactionModal";
import AlertsList from "../components/AlertsList";
import StatsCards from "../components/StatsCards";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
// import { exportProductsToExcel } from "../utils/exportExcel";
import { exportProductsToPdf } from "../utils/exportPdf";

export default function ProductsPage(){
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [showProduct, setShowProduct] = useState(false);
  const [editing, setEditing] = useState(null);
  const [txnOpen, setTxnOpen] = useState(false);
  const [txnType, setTxnType] = useState("sale");
  const [txnProduct, setTxnProduct] = useState(null);
  const [alerts, setAlerts] = useState([]);

  async function load(){
    const r = await api.get("/api/inventory/products");
    setProducts(r.data.products || r.data);
    const s = await api.get("/api/inventory/reports/summary");
    setStats(s.data);
    const a = await api.get("/api/inventory/alerts");
    setAlerts(a.data.alerts || a.data);
  }

//   useEffect(()=>{
//     load();
//     // socket subscriptions
//     socket.on("inventory:update", (p)=> {
//       setProducts(prev => {
//         const idx = prev.findIndex(x=>x._id===p._id);
//         if(idx>=0) { const cp=[...prev]; cp[idx]=p; return cp; }
//         return [p, ...prev];
//       });
//     });
//     socket.on("transactions:new", (tx)=> { /* optional: update stats */ load(); });
//     socket.on("alerts:new", ()=> load());
//     return ()=> {
//       socket.off("inventory:update");
//       socket.off("transactions:new");
//       socket.off("alerts:new");
//     };
//   }, []);

  const handleCreate = async (form) => {
    const r = await api.post("/api/inventory/products", form);
    setProducts(p=>[r.data, ...p]);
    setShowProduct(false);
  };

  const handleEdit = async (form) => {
    const r = await api.put(`/api/inventory/products${form._id}`, form);
    setProducts(p => p.map(x => x._id===r.data._id ? r.data : x));
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete product?")) return;
    await api.delete(`/api/inventory/products/${id}`);
    setProducts(p => p.filter(x=>x._id!==id));
  };

  const openSale = (product) => { setTxnType("sale"); setTxnProduct(product); setTxnOpen(true); };
  const openRestock = (product) => { setTxnType("restock"); setTxnProduct(product); setTxnOpen(true); };

  const handleTxnSubmit = async (payload) => {
    if(txnType === "sale"){
      await api.post("/api/inventory/transactions/sale", payload);
    } else {
      await api.post("/api/inventory/transactions/restock", payload);
    }
    setTxnOpen(false);
    load();
  };

  const resolveAlert = async (id) => {
    await api.patch(`/api/inventory/alerts/${id}/resolve`);
    load();
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Inventory</h1>
            <div className="text-sm text-gray-600">Manage products, stock, and transactions</div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-googleGreen text-white" onClick={()=>setShowProduct(true)}>➕ Add Product</Button>
            {/* <Button className="bg-googleBlue text-white" onClick={()=>exportProductsToExcel(products)}>Export Excel</Button> */}
            {/* <Button
              className="bg-googleBlue text-white"
              onClick={async () => await exportProductsToExcel(products)}
              >
                Export Excel
            </Button> */}

            <Button className="bg-white border" onClick={()=>exportProductsToPdf(products)}>Export PDF</Button>
          </div>
        </div>

        <StatsCards stats={stats?.data || stats} />

        <div className="mb-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="Search name or SKU..." value={search} onChange={e=>setSearch(e.target.value)} className="flex-1" />
            <Button onClick={()=> load() }>Refresh</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="overflow-x-auto bg-white rounded-2xl shadow">
              <table className="w-full min-w-[640px]">
                <thead className="bg-googleBlue text-white">
                  <tr>
                    <th className="p-2 text-left">Item</th>
                    <th className="p-2">SKU</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Stock</th>
                    <th className="p-2">Cost</th>
                    <th className="p-2">Sell</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p=>(
                    <tr key={p._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{p.sku}</td>
                      <td className="p-2">{p.category}{p.subCategory?` / ${p.subCategory}`:""}</td>
                      <td className="p-2">{p.quantity}</td>
                      <td className="p-2">₦{p.costPrice}</td>
                      <td className="p-2">₦{p.sellingPrice}</td>
                      <td className="p-2 flex gap-2">
                        <Button className="bg-yellow-500" onClick={()=>{ setEditing(p); setShowProduct(true); }}>Edit</Button>
                        <Button className="bg-googleBlue text-white" onClick={()=>openRestock(p)}>Restock</Button>
                        <Button className="bg-red-500" onClick={()=>handleDelete(p._id)}>Delete</Button>
                        <Button className="bg-googleGreen text-white" onClick={()=>openSale(p)}>Sold</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl p-3 shadow">
              <h4 className="font-semibold mb-2">Alerts</h4>
              <AlertsList alerts={alerts} onResolve={resolveAlert} />
            </div>
            <div className="bg-white rounded-2xl p-3 shadow">
              <h4 className="font-semibold mb-2">Quick Actions</h4>
              <div className="flex flex-col gap-2">
                <Button onClick={()=>setShowProduct(true)} className="bg-googleGreen text-white">Add Product</Button>
                <Button onClick={()=>setTxnOpen(true)} className="bg-googleBlue text-white">Record Transaction</Button>
                <Button onClick={()=>load()} className="bg-white border">Refresh</Button>
              </div>
            </div>
          </aside>
        </div>

        <ProductFormModal open={showProduct} onClose={()=>{ setShowProduct(false); setEditing(null); }} onSave={ async (f)=> {
          if(editing){ await handleEdit({...editing, ...f}); } else { await handleCreate(f); }
          load();
        }} editing={editing} />

        <TransactionModal open={txnOpen} onClose={()=>setTxnOpen(false)} onSubmit={handleTxnSubmit} product={txnProduct || products[0]} type={txnType} />

      </main>
    </div>
  );
}
