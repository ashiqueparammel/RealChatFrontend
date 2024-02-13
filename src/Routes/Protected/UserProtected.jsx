import React from 'react'
import { Outlet } from 'react-router-dom'

function UserProtected() {
  return (
    <Outlet />
  )
}

export default UserProtected