import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      <div class="py-10 h-screen bg-[#000000] px-2 ">
        <div class="max-w-md mx-auto bg-transparent shadow-lg rounded-lg   md:max-w-lg">
          <div class="md:flex">
            <div class="w-full p-4">

              <div class="relative text-white hover:text-black"> <input type="text" class="border w-full h-12 rounded-md bg-transparent   border-[#FAFAFA] focus:border-white outline-none  hover:bg-white pl-6 " placeholder="Search..." />  <FontAwesomeIcon className=' absolute right-3 top-4' icon={faSearch} /> </div>
              <div className='overflow-y-auto max-h-screen hidescroll'>

                <ul className=''>

                  <li class="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded cursor-pointer transition">
                    <div class="flex ml-2"> <img src="https://i.imgur.com/aq39RMA.jpg" width="40" height="40" class="rounded-full" />
                      <div class="flex flex-col ml-2"> <span class="font-medium text-black">Jessica Koel</span> <span class="text-sm text-gray-400 truncate w-32">Hey, Joel, I here to help you out please tell me</span> </div>
                    </div>
                    <div class="flex flex-col items-center"> <span class="text-gray-300">11:26</span> <i class="fa fa-star text-green-400"></i> </div>
                  </li>
                  <li class="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded cursor-pointer transition">
                    <div class="flex ml-2"> <img src="https://i.imgur.com/eMaYwXn.jpg" width="40" height="40" class="rounded-full" />
                      <div class="flex flex-col ml-2"> <span class="font-medium text-black">Komeial Bolger</span> <span class="text-sm text-gray-400 truncate w-32">I will send you all documents as soon as possible</span> </div>
                    </div>
                    <div class="flex flex-col items-center"> <span class="text-gray-300">12:26</span> <i class="fa fa-star text-green-400"></i> </div>
                  </li>
                  
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default Home