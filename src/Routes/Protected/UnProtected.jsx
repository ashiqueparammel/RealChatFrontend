import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';

function UnProtected() {
    const navigate = useNavigate()
    const token = localStorage.getItem('token');
  
    useEffect(() => {
      if (token) {
        navigate('/')
      }
    }, []) 
    if (!token) {
        return <Outlet />
    }

}

export default UnProtected