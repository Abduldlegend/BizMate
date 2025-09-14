import { useEffect, useState } from 'react'
import api from '../api'

export function useMe(){
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function run(){
      try{
        const { data } = await api.get('/api/users/me')
        setMe(data)
      }catch(e){ /* not logged in */ }
      setLoading(false)
    }
    run()
  }, [])
  return { me, loading, setMe }
}
