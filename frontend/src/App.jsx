import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import QuotePage from './pages/QuotePage.jsx'
import StockListPage from './pages/StockListPage.jsx'
import InventoryPage from './pages/InventoryPage.jsx'
import Profile from './pages/Profile.jsx'
import ProductsPage from './pages/Products.jsx'
import InvoicesPage from './pages/InvoicesPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'


export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route element={<ProtectedRoute />}>
        {/* <Route path="/inventory" element={<InventoryPage />} /> */}
        <Route path="/inventory" element={<ProductsPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/quotation' element={<QuotePage />} />
        <Route path='/stocklist' element={<StockListPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path='/profile' element={<Profile />} />
      </Route>

      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}
