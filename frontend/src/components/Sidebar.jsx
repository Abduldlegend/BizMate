import { Link, useLocation } from 'react-router-dom'
import { LayoutList, ListOrdered, User, LogOut } from 'lucide-react'

const NavLink = ({ to, icon:Icon, label }) => {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 font-medium hover:bg-gray-100 ${active ? 'bg-gray-100' : ''}`}
    >
      <Icon size={18} /> {label}
    </Link>
  )
}

export default function Sidebar() {
  return (
    <aside className='w-56 p-4 border-r bg-white h-screen sticky top-0'>
      <div className='text-2xl font-extrabold mb-6'>
        <span className='text-googleBlue'>Biz</span><span className='text-googleGreen'>Mate</span>
      </div>
      <nav className='flex flex-col gap-2'>
        <NavLink to='/dashboard' icon={LayoutList} label='Dashboard' />
        <NavLink to='/quotation' icon={ListOrdered} label='Create Quotation' />
        <NavLink to='/stocklist' icon={ListOrdered} label='Create Stock List' />
        <NavLink to='/profile' icon={User} label='Profile' />
        <a href='/' onClick={()=>{ localStorage.removeItem('token'); }} className='flex items-center gap-3 rounded-xl px-3 py-2 font-medium hover:bg-gray-100'><LogOut size={18}/> Logout</a>
      </nav>
    </aside>
  )
}
