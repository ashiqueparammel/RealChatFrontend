import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { listUserHome, searchUsers } from '../../Services/UserApi';
import { baseURL } from '../../Constants/Constants';
import LogoSpinner from '../../Helpers/LogoSpinner';

function Home() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token);
  const user = decoded
  const [usersList, setUsersList] = useState([])
  const [searchValues, setSearchValues] = useState('')
  const [LoadingManage, setLoadingManage] = useState(false)


  useEffect(() => {
    let timeoutId;

    if (searchValues !== '') {
      setLoadingManage(true)
      const throttledSearchHandle = async () => {
        const searchData = await searchUsers(searchValues);
        setUsersList(searchData.data)
        setLoadingManage(false)
      };

      clearTimeout(timeoutId);
      timeoutId = setTimeout(throttledSearchHandle, 500);
    }
    else {
      setLoadingManage(true)
      const listChatUsers = async () => {
        const data = await listUserHome(user.user_id)
        setUsersList(data.data.connections)
        setLoadingManage(false)
      }
      listChatUsers();
    }
    return () => clearTimeout(timeoutId);


  }, [searchValues]);

  const handleChat = (event) => {
    navigate('/chat', { state: event })
  }

  return (
    <div>
      <>
        {(LoadingManage ? <div className='bg-opacity-50 items-center '><LogoSpinner /></div> : '')}
      </>
      <div className="py-10 h-svh bg-[#000000] px-2 ">
        <div className="max-w-md mx-auto bg-transparent shadow-lg rounded-lg   md:max-w-lg">
          <div className="md:flex">
            <div className="w-full p-4">

              <div className="relative text-white hover:text-black "> <input onChange={(e) => setSearchValues(e.target.value)} value={searchValues} type="text" className="border w-full h-12 rounded-md bg-transparent   border-[#FAFAFA] focus:border-white outline-none  hover:bg-white pl-6 " placeholder="Search..." />  <FontAwesomeIcon className=' absolute right-3 top-4' icon={faSearch} /> </div>
              <div className='overflow-y-auto max-h-screen hidescroll'>

                <ul className=''>
                  {usersList.map((chatuser, index) => (chatuser.id !== user.user_id ?
                    <li key={index} onClick={() => handleChat(chatuser)} className="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded-md cursor-pointer transition">
                      <div className="grid grid-cols-5 gap-4">
                        <div className="col-span-1">
                          {chatuser.profile_image ?
                            <img src={baseURL + chatuser.profile_image} alt="Profile" className="rounded-full w-10 h-10" /> :
                            <div className="bg-[#000000] rounded-full w-10 h-10 flex items-center justify-center text-white uppercase font-bold">
                              {chatuser.username[0]}
                            </div>
                          }
                        </div>
                        <div className="col-span-4 flex flex-col justify-center">
                          <span className="font-medium">{chatuser.username}</span>
                          <span className="text-sm text-gray-400 truncate">{chatuser.message}</span>
                        </div>
                      </div></li> : ''
                  ))}
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