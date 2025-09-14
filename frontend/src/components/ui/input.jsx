export default function Input({ className='', ...props }) {
  return (
    <input
      className={`w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-googleBlue ${className}`}
      {...props}
    />
  )
}
