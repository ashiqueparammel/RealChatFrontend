import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Home() {
  // const token = localStorage.getItem('token')
  // const navigate = useNavigate()
  // useEffect(() => {
  //   if (!token) {
  //     navigate('/login')
  //   }
  // }, [token])
  
  return (
    <div>

      Home
      <h1 className='font-medium text-red-50 font-roboto-mono  bg-black'> hello</h1>
      <Toaster />
    </div>
  )
}

export default Home