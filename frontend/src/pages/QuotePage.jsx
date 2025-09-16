import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Button from '../components/ui/button.jsx'
import Input from '../components/ui/input.jsx'
import { generatePDF } from '../utils/pdf.js'
import api from '../api'
import { useMe } from '../hooks/useAuth'
import jsPDF from "jspdf";
import "jspdf-autotable";  // this adds the autoTable function


const EMPTY_ROW = { itemName:'', quantity:1, unit:'pcs', price:0, total:0 }

export default function QuotePage(){
  const { me } = useMe()
  const [items, setItems] = useState([ {...EMPTY_ROW} ])
  const [preview, setPreview] = useState(false)

  useEffect(()=>{
    setItems(prev => prev.map(r => ({...r, total: (Number(r.quantity)||0) * (Number(r.price)||0) })))
  }, [])

  function update(idx, key, val){
    setItems(arr => arr.map((r,i)=> i===idx? {...r, [key]: val, total: key==='quantity'||key==='price' ? (key==='quantity'? Number(val):Number(r.quantity)) * (key==='price'? Number(val): Number(r.price)) : r.total } : r))
  }
  function addRow(){ setItems(arr => [...arr, {...EMPTY_ROW}]) }
  function delRow(i){ setItems(arr => arr.filter((_,idx)=> idx!==i)) }

  const grand = items.reduce((s,r)=> s + (Number(r.total)||0), 0)

  async function save(){
    const payload = { businessName: me?.businessName, motto: me?.motto, items, grandTotal: grand }
    await api.post('/api/quotations', payload)
    alert('Quotation saved!')
  }

  function download(){
    console.log("Generating PDF with:", { items, grandTotal: grand });
    generatePDF({
    items,
    businessName: me?.businessName,
    motto: me?.motto,
    type: "Quotation",
    grandTotal: grand,
  });
  }


  return (
    <div className="flex min-h-screen flex-col md:flex-row">
  {/* ✅ Sidebar top on mobile, side on desktop */}
  <Sidebar />

  <main className="p-6 flex-1">
    <h1 className="text-2xl font-bold mb-4">Create Quotation</h1>

    {/* ✅ Desktop / Tablet Table */}
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full bg-white rounded-2xl shadow min-w-[700px]">
        <thead className="bg-googleBlue text-white">
          <tr>
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-left">Qty</th>
            <th className="p-2 text-left">Unit</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((r, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">
                <Input
                  value={r.itemName}
                  onChange={(e) => update(i, "itemName", e.target.value)}
                />
              </td>
              <td className="p-2">
                <Input
                  type="number"
                  value={r.quantity}
                  onChange={(e) => update(i, "quantity", e.target.value)}
                />
              </td>
              <td className="p-2">
                <select
                  value={r.unit}
                  onChange={(e) => update(i, "unit", e.target.value)}
                  className="w-full rounded-2xl border px-3 py-2"
                >
                  <option>pcs</option>
                  <option>kg</option>
                  <option>box</option>
                  <option>litre</option>
                </select>
              </td>
              <td className="p-2">
                <Input
                  type="number"
                  value={r.price}
                  onChange={(e) => update(i, "price", e.target.value)}
                />
              </td>
              <td className="p-2 font-semibold">
                {Number(r.total).toFixed(2)}
              </td>
              <td className="p-2">
                <button
                  onClick={() => delRow(i)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ✅ Mobile Card View */}
    <div className="md:hidden space-y-3">
      {items.map((r, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow p-4 space-y-3 border"
        >
          <div>
            <label className="text-sm font-medium">Item</label>
            <Input
              value={r.itemName}
              onChange={(e) => update(i, "itemName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              value={r.quantity}
              onChange={(e) => update(i, "quantity", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Unit</label>
            <select
              value={r.unit}
              onChange={(e) => update(i, "unit", e.target.value)}
              className="w-full rounded-2xl border px-3 py-2"
            >
              <option>pcs</option>
              <option>kg</option>
              <option>box</option>
              <option>litre</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              value={r.price}
              onChange={(e) => update(i, "price", e.target.value)}
            />
          </div>
          <div className="font-semibold">
            {`Total: ${Number(r.total).toFixed(2)}`}
          </div>
          <button
            onClick={() => delRow(i)}
            className="text-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>

    {/* ✅ Actions */}
    <div className="flex flex-wrap gap-3 mt-4 items-center">
      <Button onClick={addRow} className="bg-googleYellow">
        Add Row
      </Button>
      <Button
        onClick={() => setPreview((p) => !p)}
        className="bg-white border"
      >
        Preview
      </Button>
      <Button onClick={save} className="bg-googleGreen text-white">
        Save
      </Button>
      <Button onClick={download} className="bg-googleBlue text-white">
        Generate PDF
      </Button>
      <div className="ml-auto font-bold">
        Grand Total: {grand.toFixed(2)}
      </div>
    </div>

    {/* ✅ Preview */}
    {preview && (
      <div className="mt-6 bg-white rounded-2xl shadow p-4">
        <h2 className="font-bold mb-2">Preview</h2>
        <ul className="space-y-1">
          {items.map((r, i) => (
            <li key={i} className="text-sm">
              {r.itemName} — {r.quantity} {r.unit} @ {r.price} ={" "}
              <b>{Number(r.total).toFixed(2)}</b>
            </li>
          ))}
        </ul>
        <div className="mt-2 font-bold">Grand: {grand.toFixed(2)}</div>
      </div>
    )}
  </main>
</div>

  )
}
