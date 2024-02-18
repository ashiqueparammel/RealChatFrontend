import React from 'react';
import logo from '../assets/RealChat.png';

const LogoSpinner = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-opacity-50  bg-gray-200'>

      <img src={logo} alt="Your Logo" className='w-14 h-14 p-2 spin-animation ' />
    </div>
  );
};

export default LogoSpinner;
