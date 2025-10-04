import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../components/Logo.jsx'
import Weather from '../components/Weather.jsx'
import { useState, useEffect } from "react";
import { Menu, X, UserPlus, LogIn, Info, Star, Target } from "lucide-react";
import ExchangeRates from '../components/ExchangeRates .jsx'


const MobileNavLink = ({ to, icon: Icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 rounded-xl px-3 py-2 font-medium hover:bg-gray-100"
  >
    <Icon size={18} /> {label}
  </Link>
);

function LandingHeader() {
  const [open, setOpen] = useState(false);

  // Close sidebar automatically on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="px-4 md:px-6 py-4 flex items-center justify-between bg-white shadow relative">
      {/* Logo */}
      <div className="flex items-center gap-2 md:gap-3">
        <Logo />
        <div className="text-xl md:text-2xl font-extrabold">
          <span className="text-googleBlue">Biz</span>
          <span className="text-googleGreen">Mate</span>
        </div>
      </div>

      {/* Desktop Nav */}
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

      {/* Mobile Hamburger */}
      <div className="sm:hidden">
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay (mobile only) */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity sm:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Sidebar Menu */}
      <aside
        className={`fixed inset-y-0 right-0 w-64 p-4 border-l bg-white z-40 transform transition-transform duration-300 ease-in-out sm:hidden
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 font-extrabold text-xl">
            <Logo />
            <span className="text-googleBlue">Biz</span>
            <span className="text-googleGreen">Mate</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-2">
          <MobileNavLink to="/about" icon={Info} label="About Us" onClick={() => setOpen(false)} />
          <MobileNavLink to="/features" icon={Star} label="Features" onClick={() => setOpen(false)} />
          <MobileNavLink to="/login" icon={LogIn} label="Login" onClick={() => setOpen(false)} />
          <MobileNavLink to="/register" icon={UserPlus} label="Register" onClick={() => setOpen(false)} />
          <MobileNavLink to="/mission" icon={Target} label="Our Mission" onClick={() => setOpen(false)} />
        </nav>
      </aside>
    </header>
  );
}


export default function Landing(){
  return (
    <div className="min-h-screen flex flex-col">
  {/* Header */}

    <LandingHeader />

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
        Simplify Record-Keeping for Your Business.
      </motion.h1>
      <p className="text-gray-600 max-w-2xl mx-auto md:mx-0 text-sm sm:text-base">
        Say goodbye to manual records. With BizMate, you can manage stock, create quotations, and issue invoices instantly, giving SMEs more time to focus on growth.
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
          <li>Inventory management</li>
          <li>Qoutation generation</li>
          <li>Stock List creation</li>
          <li>Invoice generation</li>
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
