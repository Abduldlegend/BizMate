import Sidebar from '../components/Sidebar.jsx'
import { useMe } from '../hooks/useAuth.js'
import QuotationStockHistory from '../components/QuotationStockHistory.jsx'
import Weather from '../components/Weather.jsx'
import FeatureCards from '../components/FeatureCard.jsx'

export default function Dashboard(){
  const { me } = useMe()
  return (

    <div className="flex flex-col md:flex-row min-h-screen">
  {/* Sidebar */}
  <aside className="w-full md:w-64 border-r bg-white">
    <Sidebar />
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-6">
    <header className="mb-6">
      <h1 className="text-2xl font-bold">
        Welcome{me?.businessName ? `, ${me.businessName}` : ""} 👋
      </h1>
      <p className="text-gray-600">
        Use the sidebar to create a Quotation or Stock List.
      </p>
    </header>

    <FeatureCards />

    {/* Weather Component */}
    <section className="mb-8">
      <Weather />
    </section>

    {/* Document History */}
    <section>
      <QuotationStockHistory />
    </section>
  </main>
</div>

  )
}
