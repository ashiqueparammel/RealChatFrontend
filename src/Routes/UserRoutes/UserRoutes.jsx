import React from 'react'
import Home from '../../Pages/Home/Home'
import { Route, Routes } from 'react-router-dom'
import UserProtected from '../Protected/UserProtected'

function UserRoutes() {
    return (
        <div>
            <Routes>
                <Route element={<UserProtected />}>
                    <Route element={<Home />} path='/' />
                </Route>
            </Routes>
        </div>
    )
}

export default UserRoutes