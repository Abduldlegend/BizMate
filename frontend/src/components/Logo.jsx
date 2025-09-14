export default function Logo({ size=36 }){
  // Minimal SVG: stylized document + check
  return (
    <svg width={size} height={size} viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'>
      <rect x='10' y='8' width='36' height='48' rx='6' fill='#4285F4'/>
      <rect x='14' y='14' width='28' height='4' fill='#FBBC05'/>
      <rect x='14' y='22' width='24' height='4' fill='#EA4335'/>
      <rect x='14' y='30' width='20' height='4' fill='#34A853'/>
      <path d='M50 40 l6 6 l10 -12' stroke='#34A853' strokeWidth='6' fill='none' />
    </svg>
  )
}
