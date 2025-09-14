import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Button from '../components/ui/button.jsx'
import Input from '../components/ui/input.jsx'
import { generatePDF } from '../utils/pdf.js'
import api from '../api'
import { useMe } from '../hooks/useAuth'

const EMPTY_ROW = { itemName:'', quantity:1, unit:'pcs', price:'', total:'' }

export default function StockListPage(){
  const { me } = useMe()
  const [items, setItems] = useState([ {...EMPTY_ROW} ])
  const [preview, setPreview] = useState(false)

  function update(idx, key, val){
    setItems(arr => arr.map((r,i)=> i===idx? {...r, [key]: val, total: (r.price && r.quantity)? Number(key==='price'? val: r.price) * Number(key==='quantity'? val: r.quantity) : '' } : r))
  }
  function addRow(){ setItems(arr => [...arr, {...EMPTY_ROW}]) }
  function delRow(i){ setItems(arr => arr.filter((_,idx)=> idx!==i)) }

  const grand = items.reduce((s,r)=> s + (Number(r.total)||0), 0)

  async function save(){
    const payload = { businessName: me?.businessName, motto: me?.motto, items, grandTotal: grand || undefined }
    await api.post('/api/stocklists', payload)
    alert('Stock List saved!')
  }

  function download(){
    const calcItems = items.map(it => ({
      ...it,
      total: it.total === '' ? 0 : Number(it.total)||0,
      price: it.price === '' ? 0 : Number(it.price)||0,
    }))
    generatePDF({ items: calcItems, businessName: me?.businessName, motto: me?.motto, type:'Stock List', grandTotal: grand, })
  }

  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <main className='p-6 flex-1'>
        <h1 className='text-2xl font-bold mb-4'>Create Stock List</h1>

        <div className='overflow-x-auto'>
          <table className='w-full bg-white rounded-2xl shadow'>
            <thead className='bg-googleBlue text-white'>
              <tr>
                <th className='p-2 text-left'>Item</th>
                <th className='p-2 text-left'>Qty</th>
                <th className='p-2 text-left'>Unit</th>
                <th className='p-2 text-left'>Price (optional)</th>
                <th className='p-2 text-left'>Total</th>
                <th className='p-2'></th>
              </tr>
            </thead>
            <tbody>
              {items.map((r, i)=>(
                <tr key={i} className='border-b'>
                  <td className='p-2'><Input value={r.itemName} onChange={e=>update(i,'itemName', e.target.value)} /></td>
                  <td className='p-2'><Input type='number' value={r.quantity} onChange={e=>update(i,'quantity', e.target.value)} /></td>
                  <td className='p-2'>
                    <select value={r.unit} onChange={e=>update(i,'unit', e.target.value)} className='w-full rounded-2xl border px-3 py-2'>
                      <option>pcs</option><option>kg</option><option>box</option><option>litre</option>
                    </select>
                  </td>
                  <td className='p-2'><Input type='number' value={r.price} onChange={e=>update(i,'price', e.target.value)} placeholder='optional' /></td>
                  <td className='p-2 font-semibold'>{r.total === '' ? '' : Number(r.total).toFixed(2)}</td>
                  <td className='p-2'><button onClick={()=>delRow(i)} className='text-red-600'>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex gap-3 mt-4'>
          <Button onClick={addRow} className='bg-googleYellow'>Add Row</Button>
          <Button onClick={()=>setPreview(p=>!p)} className='bg-white border'>Preview</Button>
          <Button onClick={save} className='bg-googleGreen text-white'>Save</Button>
          <Button onClick={download} className='bg-googleBlue text-white'>Generate PDF</Button>
          <div className='ml-auto font-bold'>Grand Total: {grand ? grand.toFixed(2) : '-'}</div>
        </div>

        {preview && (
          <div className='mt-6 bg-white rounded-2xl shadow p-4'>
            <h2 className='font-bold mb-2'>Preview</h2>
            <ul className='space-y-1'>
              {items.map((r,i)=>( <li key={i} className='text-sm'>{r.itemName} — {r.quantity} {r.unit} {r.price? `@ ${r.price}`:''} {r.total? `= ${Number(r.total).toFixed(2)}`:''}</li> ))}
            </ul>
            {grand ? <div className='mt-2 font-bold'>Grand: {grand.toFixed(2)}</div> : null}
          </div>
        )}
      </main>
    </div>
  )
}
