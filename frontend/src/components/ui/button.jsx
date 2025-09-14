export default function Button({ className='', children, ...props }) {
  return (
    <button
      className={`rounded-2xl px-4 py-2 font-semibold shadow hover:shadow-md transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
