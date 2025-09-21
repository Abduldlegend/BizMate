import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import Input from '../components/ui/input.jsx'
import Label from '../components/ui/label.jsx'
import Button from '../components/ui/button.jsx'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [log, setLog] = useState('')
  const nav = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    try{
      setLog(e?.response?.data?.message || 'Logging in....')
      const { data } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      nav('/dashboard')
    }catch(e){
      setLog('')
      setError(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gray-50'>
      <form onSubmit={onSubmit} className='bg-white p-6 rounded-2xl shadow w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-4'>Login</h1>
        {error && <div className='mb-3 text-red-600 text-sm'>{error}</div>}
        {log && <div className='mb-3 text-black-600 text-lg'>{log}</div>}
        <Label>Email</Label>
        <Input type='email' value={email} onChange={e=>setEmail(e.target.value)} required className='mb-3' />
        <Label>Password</Label>
        <Input type='password' value={password} onChange={e=>setPassword(e.target.value)} required className='mb-4' />
        <Button className='bg-googleBlue text-white w-full'>Login</Button>
        <p className='text-sm mt-3 text-center'>No account? <Link className='text-googleBlue' to='/register'>Register</Link></p>
      </form>
    </div>
  )
}
