import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Input from '../components/ui/input.jsx'
import Label from '../components/ui/label.jsx'
import Button from '../components/ui/button.jsx'
import api from '../api'

export default function Profile(){
  const [form, setForm] = useState({ businessName:'', businessType:'', motto:'' })
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    (async ()=>{
      const { data } = await api.get('/api/users/me')
      setForm({ businessName: data.businessName||'', businessType: data.businessType||'', motto: data.motto||'' })
    })()
  }, [])

  async function save(e){
    e.preventDefault()
    await api.put('/api/users/me', form)
    setMsg('Profile updated.')
    setTimeout(()=>setMsg(''), 1200)
  }

  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <main className='p-6 flex-1 max-w-xl'>
        <h1 className='text-2xl font-bold mb-4'>Profile</h1>
        {msg && <div className='text-green-600 mb-3 text-sm'>{msg}</div>}
        <form onSubmit={save}>
          <Label>Business Name</Label>
          <Input value={form.businessName} onChange={e=>setForm(f=>({...f, businessName:e.target.value}))} className='mb-3' />
          <Label>Business Type</Label>
          <Input value={form.businessType} onChange={e=>setForm(f=>({...f, businessType:e.target.value}))} className='mb-3' />
          <Label>Motto</Label>
          <Input value={form.motto} onChange={e=>setForm(f=>({...f, motto:e.target.value}))} className='mb-4' />
          <Button className='bg-googleBlue text-white'>Save</Button>
        </form>
      </main>
    </div>
  )
}
