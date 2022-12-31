import React, { useEffect } from 'react'
import { useRouter } from 'next/router'


interface Prop {
  to: string
}

const Redirect = ({to}:Prop) => {

  const router = useRouter()
  useEffect(()=>{
    router.push(`${to}`)
  },[])
    
  return (
    <div></div>
  )
}

export default Redirect
