import React from 'react'
import Home from '../../Pages/Home/Home'
import { Route, Routes } from 'react-router-dom'
import UserProtected from '../Protected/UserProtected'
import ChatPage from '../../Pages/ChatPage/ChatPage'

function UserRoutes() {
    return (
        <div>
            <Routes>
                <Route element={<UserProtected />}>
                    <Route element={<Home />} path='/' />
                    <Route element={<ChatPage />} path='/chat' />
                </Route>
            </Routes>
        </div>
    )
}

export default UserRoutes