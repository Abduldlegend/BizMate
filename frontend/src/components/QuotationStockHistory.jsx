

import React, { useEffect, useState } from 'react'
import api from '../api'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react'

/*
  QuotationStockHistory.jsx

  - Fetches both quotations and stocklists for the logged-in user
  - Groups them by month (YYYY-MM) and displays expandable month sections
  - Each entry shows date, type (Quotation / Stock List), and three actions: View, Edit, Delete
  - Uses api (axios wrapper) to call backend endpoints:
      GET /api/quotations
      GET /api/stocklists
      DELETE /api/quotations/:id
      DELETE /api/stocklists/:id
  - Responsive & mobile-first using TailwindCSS
  - Requires: api.js in src (already present), framer-motion & lucide-react

  Usage:
    import QuotationStockHistory from '../components/QuotationStockHistory'
    <QuotationStockHistory />

  Notes:
  - "View" opens a simple modal with the item table and grand total.
  - "Edit" navigates to /quotation or /stocklist with state (uses location state) — you can adapt to your edit flow.
  - "Delete" asks for confirmation and removes the item from DB and UI.
*/

export default function QuotationStockHistory({ onEditNavigate }) {
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState([]) // [{ key: '2025-09', label: 'Sep 2025', items: [...] , open: true }]
  const [viewing, setViewing] = useState(null) // { type, doc }
  const [deleting, setDeleting] = useState(null) // { id, type }
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const [qRes, sRes] = await Promise.all([api.get('/api/quotations'), api.get('/api/stocklists')])
        const q = (qRes.data || []).map(d => ({ ...d, __type: 'Quotation' }))
        const s = (sRes.data || []).map(d => ({ ...d, __type: 'Stock List' }))
        const all = [...q, ...s].sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))

        const map = new Map()
        all.forEach(doc => {
          const dt = new Date(doc.createdAt || doc.updatedAt || Date.now())
          const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`
          const label = format(dt, 'MMMM yyyy')
          if (!map.has(key)) map.set(key, { key, label, items: [] })
          map.get(key).items.push(doc)
        })

        const arr = Array.from(map.values()).map(g => ({ ...g, open: true }))
        if (mounted) setGroups(arr)
      } catch (e) {
        console.error('Failed to load history', e)
        if (mounted) setError('Failed to load history')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  async function handleDelete(doc) {
    if (!confirm('Delete this item permanently?')) return
    try {
      const endpoint = doc.__type === 'Quotation' ? `/api/quotations/${doc._id}` : `/api/stocklists/${doc._id}`
      await api.delete(endpoint)
      // remove from groups
      setGroups(prev => prev.map(g => ({ ...g, items: g.items.filter(i=> i._id !== doc._id) })).filter(g=> g.items.length))
    } catch (e) {
      console.error('Delete failed', e)
      alert('Delete failed')
    }
  }

  function toggleGroup(key){
    setGroups(prev => prev.map(g => g.key === key ? { ...g, open: !g.open } : g))
  }

  function handleView(doc){
    setViewing(doc)
  }

  function handleEdit(doc){
    // If caller provided onEditNavigate, call it; otherwise use window.location/History
    if (onEditNavigate && typeof onEditNavigate === 'function') return onEditNavigate(doc)
    // default: navigate to respective route with state
    const path = doc.__type === 'Quotation' ? '/quotation' : '/stocklist'
    // we rely on react-router navigation via location state — consumer should implement
    window.location.href = `${path}?edit=${doc._id}`
  }

  return (

    <div className="p-4">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold">Your Documents</h2>
  </div>

  {/* Loading / Error / Empty States */}
  {loading && <div className="text-sm text-gray-500">Loading...</div>}
  {error && <div className="text-sm text-red-600">{error}</div>}
  {!loading && groups.length === 0 && (
    <div className="text-gray-500 italic">No quotations or stock lists yet.</div>
  )}

  {/* Document Groups */}
  <div className="space-y-4">
    {groups.map(group => (
      <div
        key={group.key}
        className="bg-white rounded-xl shadow-sm border overflow-hidden"
      >
        {/* Group Header */}
        <button
          onClick={() => toggleGroup(group.key)}
          className="w-full flex items-center justify-between px-4 py-3 md:px-6 md:py-4 hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm md:text-base font-semibold">
              {group.label}
            </span>
            <span className="text-xs text-gray-500">
              {group.items.length} item{group.items.length > 1 ? "s" : ""}
            </span>
          </div>
          <div>
            {group.open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
        </button>

        {/* Group Content */}
        <AnimatePresence>
          {group.open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-3 md:px-6 md:py-4 border-t bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map(doc => (
                    <div
                      key={doc._id}
                      className="flex items-start gap-3 p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition"
                    >
                      {/* Document Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold">
                              {doc.businessName || "—"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {doc.__type} •{" "}
                              {format(
                                new Date(doc.createdAt || doc.updatedAt),
                                "dd MMM yyyy, hh:mm a"
                              )}
                            </div>
                          </div>
                          <div className="text-sm font-bold text-gray-800">
                            {doc.grandTotal
                              ? `₦${Number(doc.grandTotal).toFixed(2)}`
                              : "-"}
                          </div>
                        </div>

                        {/* Items Preview */}
                        <div className="mt-3 text-sm text-gray-700 max-h-24 overflow-auto">
                          {doc.items && doc.items.length ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {doc.items.slice(0, 4).map((it, i) => (
                                <li key={i} className="text-sm">
                                  {it.itemName} — {it.quantity} {it.unit}{" "}
                                  {it.price ? `@ ₦${it.price}` : ""}
                                </li>
                              ))}
                              {doc.items.length > 4 && (
                                <li className="text-xs text-gray-500">
                                  and {doc.items.length - 4} more...
                                </li>
                              )}
                            </ul>
                          ) : (
                            <div className="text-xs text-gray-500 italic">
                              No items
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-center gap-2 ml-2">
                        <button
                          onClick={() => handleView(doc)}
                          className="p-2 rounded-md bg-white border hover:shadow-sm"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(doc)}
                          className="p-2 rounded-md bg-white border hover:shadow-sm"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="p-2 rounded-md bg-white border hover:shadow-sm text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ))}
  </div>

  {/* VIEW MODAL */}
  <AnimatePresence>
    {viewing && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          exit={{ y: 20 }}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between border-b pb-3">
            <div>
              <h3 className="text-lg font-bold">
                {viewing.businessName || "BizMate"}
              </h3>
              <p className="text-sm text-gray-500">
                {viewing.__type} •{" "}
                {format(
                  new Date(viewing.createdAt || viewing.updatedAt),
                  "dd MMM yyyy, hh:mm a"
                )}
              </p>
            </div>
            <button
              onClick={() => setViewing(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          {/* Modal Body */}
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Item</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Unit</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(viewing.items || []).map((it, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">{it.itemName}</td>
                      <td className="p-2">{it.quantity}</td>
                      <td className="p-2">{it.unit}</td>
                      <td className="p-2">
                        {it.price ? `₦${it.price}` : "-"}
                      </td>
                      <td className="p-2">
                        {it.total ? `₦${it.total}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grand Total */}
            <div className="mt-4 text-right font-bold text-lg text-gray-800">
              Grand Total:{" "}
              {viewing.grandTotal
                ? `₦${Number(viewing.grandTotal).toFixed(2)}`
                : "-"}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

  )
}
