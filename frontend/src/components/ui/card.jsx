export function Card({ className='', children }) {
  return <div className={`bg-white rounded-2xl shadow p-4 ${className}`}>{children}</div>
}
export function CardHeader({ children }) { return <div className='mb-3'>{children}</div> }
export function CardTitle({ children }) { return <h3 className='text-lg font-bold'>{children}</h3> }
export function CardContent({ children }) { return <div>{children}</div> }
