import Sidebar from '../components/Sidebar.jsx'
import { useMe } from '../hooks/useAuth.js'
import QuotationStockHistory from '../components/QuotationStockHistory.jsx'
import Weather from '../components/Weather.jsx'

export default function Dashboard(){
  const { me } = useMe()
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <main className='p-6 flex-1'>
        <h1 className='text-2xl font-bold mb-2'>Welcome{me?.businessName ? `, ${me.businessName}` : ''} 👋</h1>
        <p className='text-gray-600'>Use the sidebar to create a Quotation or Stock List.</p>

      <Weather />
      </main>

      <QuotationStockHistory />
    </div>
  )
}
