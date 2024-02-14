import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Login from '../../Pages/Login/Login';

function UserProtected() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token === null) {
      navigate('/login')
    }
  }, [])
  if (token) {
    const decoded = jwtDecode(token);
    if (decoded.is_active && !decoded.is_superuser) {
      return <Outlet />
    }

  } else {
    return <Login />
  }


}

export default UserProtected