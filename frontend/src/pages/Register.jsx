import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import Input from '../components/ui/input.jsx'
import Label from '../components/ui/label.jsx'
import Button from '../components/ui/button.jsx'

export default function Register(){
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('Sole Proprietorship')
  const [motto, setMotto] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const nav = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    setError(''); setOk('Registering.....')
    try{
      await api.post('/api/auth/register', { businessName, businessType, motto, email, password })
      setOk('Registered! You can now log in.')
      setTimeout(()=>nav('/login'), 800)
    }catch(e){
      setOk('')
      setError(e?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gray-50'>
      <form onSubmit={onSubmit} className='bg-white p-6 rounded-2xl shadow w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-4'>Register</h1>
        {error && <div className='mb-3 text-red-600 text-sm'>{error}</div>}
        {ok && <div className='mb-3 text-green-600 text-lg'>{ok}</div>}
        <Label>Business Name</Label>
        <Input value={businessName} onChange={e=>setBusinessName(e.target.value)} required className='mb-3' />
        <Label>Business Type</Label>
        <select value={businessType} onChange={e=>setBusinessType(e.target.value)} className='mb-3 w-full rounded-2xl border px-3 py-2'>
          <option>Sole Proprietorship</option>
          <option>Partnership</option>
          <option>Limited Liability</option>
          <option>Enterprise</option>
        </select>
        <Label>Motto (optional)</Label>
        <Input value={motto} onChange={e=>setMotto(e.target.value)} className='mb-3' />
        <Label>Email</Label>
        <Input type='email' value={email} onChange={e=>setEmail(e.target.value)} required className='mb-3' />
        <Label>Password</Label>
        <Input type='password' value={password} onChange={e=>setPassword(e.target.value)} required className='mb-4' />
        <Button className='bg-googleGreen text-white w-full'>Create Account</Button>
        <p className='text-sm mt-3 text-center'>Have an account? <Link className='text-googleBlue' to='/login'>Login</Link></p>
      </form>
    </div>
  )
}
