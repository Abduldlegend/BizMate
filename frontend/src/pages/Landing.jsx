import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../components/Logo.jsx'
import Weather from '../components/Weather.jsx'
import ExchangeRates from '../components/ExchangeRates .jsx'

export default function Landing(){
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='px-6 py-4 flex items-center justify-between bg-white shadow'>
        <div className='flex items-center gap-3'>
          <Logo />
          <div className='text-2xl font-extrabold'>
            <span className='text-googleBlue'>Biz</span>
            <span className='text-googleGreen'>Mate</span>
          </div>
        </div>
        <div className='flex gap-3'>
          <Link to='/register' className='px-4 py-2 rounded-2xl bg-googleBlue text-white font-semibold'>Register</Link>
          <Link to='/login' className='px-4 py-2 rounded-2xl bg-white border font-semibold'>Login</Link>
        </div>
      </header>

      <main className='flex-1'>
        <section className='px-6 py-16 bg-gradient-to-r from-googleBlue/10 via-googleYellow/10 to-googleGreen/10'>
          <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.6}} className='text-4xl md:text-6xl font-extrabold mb-4'>
            Generate Quotations & Stock Lists in Minutes
          </motion.h1>
          <p className='text-gray-600 max-w-2xl'>
            BizMate helps workers and traders create professional, branded PDFs with auto-calculated totals.
          </p>
          <div className='mt-6 flex gap-3'>
            <Link to='/register' className='px-6 py-3 rounded-2xl bg-googleGreen text-white font-bold'>Get Started</Link>
            <Link to='/login' className='px-6 py-3 rounded-2xl bg-white border font-bold'>Login</Link>
          </div>
        </section>

        <Weather />

        {/* <ExchangeRates /> */}


        <section id='about' className='px-6 py-14 max-w-5xl mx-auto'>
          <h2 className='text-3xl font-bold mb-4'>About Us</h2>
          <p className='text-gray-700'>BizMate is built to make your paperwork painless—fast creation, clean design, and reliable storage.
                                          At BizMate, we believe that small businesses, artisans, and traders deserve the same smart tools that big companies use. Many workers spend hours struggling with handwritten quotations or manual stock records, leading to delays, errors, and missed opportunities.
                                          BizMate was built to solve this problem. Our platform helps workers generate professional quotations in seconds, and enables traders to prepare ready-made stock lists for smooth restocking. With a clean, intuitive design and a focus on simplicity, BizMate is your trusted business companion — helping you save time, reduce mistakes, and focus on what truly matters: growing your business.

          </p>
        </section>

        <section id='features' className='px-6 py-14 bg-white'>
          <div className='max-w-5xl mx-auto'>
            <h2 className='text-3xl font-bold mb-6'>Features</h2>
            <ul className='grid md:grid-cols-2 gap-4 list-disc pl-6'>
              <li>Auto-total calculations</li>
              <li>Styled PDF exports (Google colors)</li>
              <li>JWT-secured API</li>
              <li>Mobile-first responsive UI</li>
            </ul>
          </div>
        </section>

        <section id='contact' className='px-6 py-14 max-w-5xl mx-auto'>
          <h2 className='text-3xl font-bold mb-4'>Contact Us</h2>
          <p className='text-gray-700'>Questions or feedback? Email: support@bizmate.example</p>
        </section>
      </main>

      <footer className='px-6 py-6 text-center text-sm text-gray-600 bg-white border-t'>
        © {new Date().getFullYear()} BizMate. All rights reserved.
      </footer>
    </div>
  )
}
