import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEllipsisVertical, faSearch } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { listUserHome, previousChatList, searchUsers } from '../../Services/UserApi';
import { chatList, baseURL } from '../../Constants/Constants';
import { Turn as Hamburger } from 'hamburger-react';
import { Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react';
import { timeAgo } from './TimeManage';
function ChatPage() {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const user = jwtDecode(token);
    const location = useLocation()
    const [usersList, setUsersList] = useState([])
    const [searchValues, setSearchValues] = useState('')
    const [isOpen, setOpen] = useState(false);
    let recipient = location.state || []
    const [clientstate, setClientState] = useState('');
    const [senderdetails, setSenderDetails] = useState(user);
    const [messageText, setMessageText] = useState('')
    const [messages, setMessages] = useState([]);
    const [ChatList, setChatList] = useState([]);
    const [recipientDetails, setrecipientDetails] = useState(recipient || [])


    console.log(recipientDetails, 'lotaaaaaaaaaaaaaaa=======>>>>>');


    useEffect(() => {
        let timeoutId;

        if (searchValues !== '') {
            const throttledSearchHandle = async () => {
                const searchData = await searchUsers(searchValues);
                setUsersList(searchData.data)
            };

            clearTimeout(timeoutId);
            timeoutId = setTimeout(throttledSearchHandle, 500);
        }
        else {
            const listChatUsers = async () => {
                const data = await listUserHome(user.user_id)
                setUsersList(data.data.connections)
            }
            listChatUsers();
        }
        return () => clearTimeout(timeoutId);


    }, [searchValues]);

    const handleChat = async (event) => {
        setrecipientDetails(event)
        const prevChat = await previousChatList(user.user_id, event.id)
        setMessages(prevChat.data);
        console.log(prevChat.data, '================>>>>>>>>>check chat');
    }
    const closeMenu = () => {
        setOpen(false);
    };

    const setUpChat = async () => {
        // setUpChat()


        // await axios.get(`${Previos_Chat}${senderdetails.id}/${recipientDetails.id}/`).then(
        //     (response) => {
        //         if (response.status == 200) {
        //         }
        //     }
        // );



        // const client = new W3CWebSocket(
        //     `${WebSocket}${senderdetails.id}/?${recipientDetails.id}`
        // );
        // setClientState(client);
        // client.onopen = () => {
        //     console.log("WebSocket Client Connected");
        // };

        // client.onmessage = (message) => {
        //     const dataFromServer = JSON.parse(message.data);

        //     if (dataFromServer) {
        //         setMessages((prevMessages) => [
        //             ...prevMessages,
        //             {
        //                 message: dataFromServer.message,
        //                 sender_email: dataFromServer.senderUsername,
        //             },
        //         ]);
        //     }
        // };

        // client.onclose = () => {
        //     console.log("Websocket disconnected");
        // };

    }


    return (
        <div className='2xl:grid 2xl:grid-cols-4 xl:grid xl:grid-cols-4 '>

            <div className='2xl:col-span-1 xl:col-span-2 hidden 2xl:block'>
                <div className="py-10 h-screen bg-[#000000] px-2 ">
                    <div className="max-w-md mx-auto bg-transparent shadow-lg rounded-lg 2xl:text-sm  xl:text-xs  md:max-w-lg">
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
                                                </div>
                                            </li> : ''
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='2xl:col-span-3 xl:col-span-2 hidden 2xl:block'>
                <div className='h-screen grid grid-rows-[auto,1fr]'>
                    <div className='bg-black h-20 border-l-[1px] shadow-lg shadow-[#6b6b6b] '>
                        <div className='flex gap-8 pt-3 pl-10 '>
                            {recipientDetails.profile_image ?
                                <img src={baseURL + recipientDetails.profile_image} alt="Profile" className="col-span- rounded-full w-14 h-14 " /> :
                                <div className="bg-[#ffffff] rounded-full w-14 h-14 flex items-center text-xl justify-center text-black uppercase font-bold">
                                    {recipientDetails.username[0]}
                                </div>}
                            <div className='flex flex-col justify-start'>
                                <h1 className=" text-white text-xl uppercase  pt-1  ">{recipientDetails.username}</h1>
                                <h1 className=" text-white text-sm    ">{recipientDetails.email}</h1>
                            </div>

                            <div className="col-span- text-center pt-4 ">
                                <Menu>
                                    <MenuHandler>
                                        <span className=" absolute right-12 top-4 text-white text-2xl "> <Hamburger toggled={isOpen} toggle={setOpen} /></span>
                                    </MenuHandler>
                                    <MenuList className="max-h-72 text-black font-prompt text-md">
                                        <MenuItem onClick={closeMenu}>Block</MenuItem>
                                        <MenuItem onClick={closeMenu}>ClearChat</MenuItem>
                                        <MenuItem onClick={closeMenu}>Report</MenuItem>
                                    </MenuList>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className='max-h-screen overflow-y-auto hidescroll'>
                        <div className="grid grid-cols-1">
                            {messages.map((chatMessage, index) => (

                                <div key={index}>
                                    {(chatMessage.sender === user.user_id ? <div className='flex justify-end'>
                                        <div className='flex justify-end'>
                                            <div className='flex flex-col items-end'> 
                                                <h1 className='bg-white shadow-md shadow-[#989898] font-prompt p-2 text-black text-center w-fit rounded-lg mt-2 mr-3'>{chatMessage.message}</h1>
                                                <h1 className='mt-1 mr-4 text-[#7b7b7b] text-[12px]'>{timeAgo(chatMessage.timestamp)}</h1>
                                            </div>
                                        </div>
                                    </div> :
                                        <div className='flex justify-start'>
                                            <div>
                                                <h1 className='bg-[#000000] bgcolors-text shadow-md shadow-[#989898] font-prompt p-2 text-white text-center w-fit rounded-lg mt-2 ml-3'>{chatMessage.message}</h1>
                                                <h1 className='ml-4 mt-1 text-[#7b7b7b] text-[12px]'>{timeAgo(chatMessage.timestamp)}</h1>
                                            </div>
                                        </div>)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            <div className='w-screen 2xl:hidden '>
                <div className='bg-black h-20 border-l-[1px]'>

                </div>
            </div>

            <Toaster />
        </div>
    )
}

export default ChatPage