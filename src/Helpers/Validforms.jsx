import React from 'react'
import toast, { Toaster } from 'react-hot-toast';

function Validforms(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(data.email)

    if (data.email.trim() === "") {
        toast.error(' Email field cannot empty!');
        return false;
    }
    else if (!isValidEmail) {
        toast.error('Please Enter Valid email!');
        return false;

    }
    else if (data.password.trim() === "") {
        toast.error('Password field cannot empty!');
        return false;
    }
    else if (data.password.length<8) {
        toast.error('password should be minimum 8 digits !');
        return false;

    }
    return true
}

export default Validforms