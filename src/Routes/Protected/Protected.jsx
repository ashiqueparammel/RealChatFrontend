import React from 'react'
import UserRoutes from '../UserRoutes/UserRoutes';
import Login from '../../Pages/Login/Login';
import { jwtDecode } from 'jwt-decode';

function Protected() {

    const token = localStorage.getItem('token');

    if (token) {
        const decoded = jwtDecode(token);
        if (decoded.is_active) {
            return <UserRoutes />
        }
        // else {
        //     if (decoded.is_superuser) {
        //         return <CompanyRoutes />
        //     }
        //     else {
        //         return <UserRoutes />
        //     }
        // }
    } else {
        return <Login />
    }
}

export default Protected