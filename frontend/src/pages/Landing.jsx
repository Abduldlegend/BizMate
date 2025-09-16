import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../components/Logo.jsx'
import Weather from '../components/Weather.jsx'
import ExchangeRates from '../components/ExchangeRates .jsx'

export default function Landing(){
  return (
    <div className="min-h-screen flex flex-col">
  {/* Header */}
  <header className="px-4 md:px-6 py-4 flex items-center justify-between bg-white shadow">
    <div className="flex items-center gap-2 md:gap-3">
      <Logo />
      <div className="text-xl md:text-2xl font-extrabold">
        <span className="text-googleBlue">Biz</span>
        <span className="text-googleGreen">Mate</span>
      </div>
    </div>
    <div className="hidden sm:flex gap-2 md:gap-3">
      <Link
        to="/register"
        className="px-3 md:px-4 py-2 rounded-2xl bg-googleBlue text-white font-semibold text-sm md:text-base"
      >
        Register
      </Link>
      <Link
        to="/login"
        className="px-3 md:px-4 py-2 rounded-2xl bg-white border font-semibold text-sm md:text-base"
      >
        Login
      </Link>
    </div>
  </header>

  {/* Main */}
  <main className="flex-1">
    {/* Hero Section */}
    <section className="px-4 md:px-6 py-12 md:py-16 bg-gradient-to-r from-googleBlue/10 via-googleYellow/10 to-googleGreen/10 text-center md:text-left">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4"
      >
        Generate Quotations & Stock Lists in Minutes
      </motion.h1>
      <p className="text-gray-600 max-w-2xl mx-auto md:mx-0 text-sm sm:text-base">
        BizMate helps workers and traders create professional, branded PDFs with auto-calculated totals.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
        <Link
          to="/register"
          className="px-5 py-3 rounded-2xl bg-googleGreen text-white font-bold text-sm sm:text-base"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="px-5 py-3 rounded-2xl bg-white border font-bold text-sm sm:text-base"
        >
          Login
        </Link>
      </div>
    </section>

    {/* Weather */}
    <div className="px-4 md:px-6">
      <Weather />
      {/* <ExchangeRates /> */}
    </div>

    {/* About Us */}
    <section id="about" className="px-4 md:px-6 py-10 md:py-14 max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">About Us</h2>
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
        BizMate is built to make your paperwork painless—fast creation, clean design, and reliable storage.
        At BizMate, we believe that small businesses, artisans, and traders deserve the same smart tools that big companies use. 
        Many workers spend hours struggling with handwritten quotations or manual stock records, leading to delays, errors, and missed opportunities.
        BizMate was built to solve this problem. Our platform helps workers generate professional quotations in seconds, and enables traders to prepare ready-made stock lists for smooth restocking. 
        With a clean, intuitive design and a focus on simplicity, BizMate is your trusted business companion — helping you save time, reduce mistakes, and focus on what truly matters: growing your business.
      </p>
    </section>

    {/* Features */}
    <section id="features" className="px-4 md:px-6 py-10 md:py-14 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Features</h2>
        <ul className="grid sm:grid-cols-2 gap-4 list-disc pl-5 sm:pl-6 text-sm sm:text-base">
          <li>Auto-total calculations</li>
          <li>Styled PDF exports (Google colors)</li>
          <li>JWT-secured API</li>
          <li>Mobile-first responsive UI</li>
        </ul>
      </div>
    </section>

    {/* Contact */}
    <section id="contact" className="px-4 md:px-6 py-10 md:py-14 max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Contact Us</h2>
      <p className="text-gray-700 text-sm sm:text-base">
        Questions or feedback? Email: support@bizmate.example
      </p>
    </section>
  </main>

  {/* Footer */}
  <footer className="px-4 md:px-6 py-6 text-center text-xs sm:text-sm text-gray-600 bg-white border-t">
    © {new Date().getFullYear()} BizMate. All rights reserved.
  </footer>
</div>

  )
}
