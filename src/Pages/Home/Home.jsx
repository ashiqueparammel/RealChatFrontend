import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { listUserHome, searchUsers } from '../../Services/UserApi';

function Home() {

  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token);
  const user = decoded
  const [usersList, setUsersList] = useState([])
  const [searchValues, setSearchValues] = useState('')


  useEffect(() => {
    const listChatUsers = async () => {
      const data = await listUserHome(user.user_id)
      console.log(data.data, '=============>>>>>>>>>');
      setUsersList(data.data.connections)
    }
    listChatUsers();

  }, [])

  useEffect(() => {
    let timeoutId;

    if (searchValues !== '') {
      const throttledSearchHandle = async () => {
        const searchData = await searchUsers(searchValues);
        console.log(searchData.data, '======================>>');
      };

      clearTimeout(timeoutId);
      timeoutId = setTimeout(throttledSearchHandle, 500);
    }
    return () => clearTimeout(timeoutId);

  }, [searchValues]);



  return (
    <div>
      <div className="py-10 h-screen bg-[#000000] px-2 ">
        <div className="max-w-md mx-auto bg-transparent shadow-lg rounded-lg   md:max-w-lg">
          <div className="md:flex">
            <div className="w-full p-4">

              <div className="relative text-white hover:text-black"> <input onChange={(e) => setSearchValues(e.target.value)} value={searchValues} type="text" className="border w-full h-12 rounded-md bg-transparent   border-[#FAFAFA] focus:border-white outline-none  hover:bg-white pl-6 " placeholder="Search..." />  <FontAwesomeIcon className=' absolute right-3 top-4' icon={faSearch} /> </div>
              <div className='overflow-y-auto max-h-screen hidescroll'>

                <ul className=''>
                  {usersList.map((chatuser) => (<li className="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded-md cursor-pointer transition">
                    <div className="flex ml-2">
                      {(chatuser.profile_image?
                      <img src={chatuser.profile_image} width="40" height="40" className="rounded-full" />:
                      <div width="40" height="40" className="bg-[#000000] rounded-full pl-4 pr-4 pt-1 pb-1 flex text-white text-lg font-prompt text-center items-center"><h1>{chatuser.username[0]}</h1></div>)}
                      <div className="flex flex-col ml-2"> <span className="font-medium text-black">{chatuser.username}</span> <span className="text-sm text-gray-400 truncate w-32">Hey, Joel, I here to help you out please tell me</span> </div>
                    </div>
                    <div className="flex flex-col items-center"> <span className="text-gray-300">11:26</span> <i className="fa fa-star text-green-400"></i> </div>
                  </li>))}
                  {/* <li className="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded cursor-pointer transition">
                    <div className="flex ml-2"> <img src="https://i.imgur.com/eMaYwXn.jpg" width="40" height="40" className="rounded-full" />
                      <div className="flex flex-col ml-2"> <span className="font-medium text-black">Komeial Bolger</span> <span className="text-sm text-gray-400 truncate w-32">I will send you all documents as soon as possible</span> </div>
                    </div>
                    <div className="flex flex-col items-center"> <span className="text-gray-300">12:26</span> <i className="fa fa-star text-green-400"></i> </div>
                  </li> */}

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