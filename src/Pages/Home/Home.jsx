import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { listUserHome, searchUsers, userLogout } from "../../Services/UserApi";
import { baseURL } from "../../Constants/Constants";
import LogoSpinner from "../../Helpers/LogoSpinner";
import { Button } from "@material-tailwind/react";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const user = decoded;
  const [usersList, setUsersList] = useState([]);
  const [searchValues, setSearchValues] = useState("");
  const [LoadingManage, setLoadingManage] = useState(false);
  const [chats, setChats] = useState({ pinned_chats: [], other_chats: [] });
  useEffect(() => {
    let timeoutId;

    if (searchValues !== "") {
      setLoadingManage(true);
      const throttledSearchHandle = async () => {
        const searchData = await searchUsers(searchValues);
        setUsersList(searchData.data);
        setLoadingManage(false);
      };

      clearTimeout(timeoutId);
      timeoutId = setTimeout(throttledSearchHandle, 500);
    } else {
      setLoadingManage(true);
      const listChatUsers = async () => {
        const response = await listUserHome();
        console.log(response, "data");
        // Ensure `results` exists before setting state
        if (response?.data?.results) {
          setChats(response.data.results);
        }
        // setUsersList(data.data.connections);
        setLoadingManage(false);
      };
      listChatUsers();
    }
    return () => clearTimeout(timeoutId);
  }, [searchValues]);

  const handleChat = (event) => {
    console.log(event, "event");
    console.log(
      event.receiver,
      "receiver",
      event.last_message.sender,
      "sender"
    );

    // Use the correct state for navigation
    // if (event.last_message?.sender?.id === user.id) {
    //   console.log(true);
    //   navigate("/chat", { state: event.last_message?.sender }); // Pass sender as state
    // } else {
    //   console.log(false);
    navigate("/chat", { state: event.receiver }); // Pass receiver as state
    // }
  };

  const logout = async () => {
    const data = await userLogout();
    if (data.status === 200) {
      toast.success("Logout successfully!");
      localStorage.removeItem("token");
      navigate("/");
    } else {
      toast.error("network error!");
    }
  };
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket only if the user exists and WebSocket is not already connected
    if (user && !socketRef.current) {
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const accessToken = tokenData ? tokenData.access : null;

      // WebSocket URL
      const socketUrl = `ws://127.0.0.1:8000/user-activity/?token=${accessToken}`;

      // Initialize WebSocket
      socketRef.current = new WebSocket(socketUrl);

      // Handle WebSocket events
      socketRef.current.onopen = () => {
        console.log("WebSocket connected");
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data);
        // Handle incoming WebSocket messages here
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        // Optionally, add logic to reconnect here if desired
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        // Optionally, handle error and decide whether to reconnect or not
      };

      // Cleanup function to close the WebSocket on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.onclose = () => {
            console.log("WebSocket disconnected, attempting to reconnect...");
            setTimeout(() => {
              const tokenData = JSON.parse(localStorage.getItem("token"));
              const accessToken = tokenData ? tokenData.access : null;
              const socketUrl = `ws://127.0.0.1:8000/user-activity/?token=${accessToken}`;
              socketRef.current = new WebSocket(socketUrl);
            }, 1000); // Attempt reconnect after 1 second
          };
        }
      };
    }
  }, [user]); // Re-run effect when 'user' changes

  return (
    <div>
      <>
        {LoadingManage ? (
          <div className="bg-opacity-50 items-center ">
            <LogoSpinner />
          </div>
        ) : (
          ""
        )}
      </>
      <div className="py-10 h-svh bg-[#000000] px-2 ">
        <div className="max-w-md mx-auto bg-transparent shadow-lg rounded-lg   md:max-w-lg">
          <div className="">
            <div className="w-full p-4">
              <div className="pb-3 ml-[78%]  ">
                <Button
                  onClick={logout}
                  className="bg-white font-prompt-normal bg-transparent h-12 text-white shadow-white shadow-none   border-[#FAFAFA] border-[1px] hover:border-[1px]"
                >
                  LogOut
                </Button>{" "}
              </div>
              <div className="relative text-white hover:text-black ">
                {" "}
                <input
                  onChange={(e) => setSearchValues(e.target.value)}
                  value={searchValues}
                  type="text"
                  className="border w-full h-12 rounded-md bg-transparent   border-[#FAFAFA] focus:border-white outline-none  hover:bg-white pl-6 "
                  placeholder="Search..."
                />{" "}
                <FontAwesomeIcon
                  className=" absolute right-3 top-4 hover:text-white"
                  icon={faSearch}
                />{" "}
              </div>
              <div className="overflow-y-auto max-h-screen hidescroll">
                <ul className="">
                  {chats.pinned_chats.length > 0 && (
                    <div>
                      <h3>Pinned Chats</h3>
                      {chats.pinned_chats.map((chat, index) => (
                        <li
                          key={`pinned-${index}`}
                          onClick={() => handleChat(chat)}
                          className="flex justify-between items-center bg-gray-100 mt-2 p-2 hover:shadow-lg rounded-md cursor-pointer transition"
                        >
                          <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-1">
                              {chat.receiver?.profile_image ? (
                                <img
                                  src={`${baseURL}${chat.receiver.profile_image}`}
                                  alt="Profile"
                                  className="rounded-full w-10 h-10"
                                />
                              ) : (
                                <div className="bg-[#000000] rounded-full w-10 h-10 flex items-center justify-center text-white uppercase font-bold">
                                  {chat.receiver?.username[0]}
                                </div>
                              )}
                            </div>
                            <div className="col-span-4 flex flex-col justify-center">
                              <span className="font-medium">
                                {chat.receiver?.username}
                              </span>
                              <span className="text-sm text-gray-400 truncate">
                                {chat.last_message?.message_text ||
                                  "No recent messages"}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </div>
                  )}

                  {/* Other Chats */}
                  {chats.other_chats.length > 0 && (
                    <div>
                      <h3>Other Chats</h3>
                      {chats.other_chats.map((chat, index) => (
                        <li
                          key={`other-${index}`}
                          onClick={() => handleChat(chat)}
                          className="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded-md cursor-pointer transition"
                        >
                          <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-1">
                              {chat.chat_type === "group" &&
                              chat.group?.profile_image ? (
                                <img
                                  src={`${baseURL}${chat.group.profile_image}`}
                                  alt="Group Profile"
                                  className="rounded-full w-10 h-10"
                                />
                              ) : chat.receiver?.profile_image ? (
                                <img
                                  src={`${baseURL}${chat.receiver.profile_image}`}
                                  alt="Profile"
                                  className="rounded-full w-10 h-10"
                                />
                              ) : (
                                <div className="bg-[#000000] rounded-full w-10 h-10 flex items-center justify-center text-white uppercase font-bold">
                                  {chat.chat_type === "group"
                                    ? chat.group?.name[0]
                                    : chat.receiver.username[0]}
                                </div>
                              )}
                            </div>
                            <div className="col-span-4 flex flex-col justify-center">
                              <span className="font-medium">
                                {chat.chat_type === "group"
                                  ? chat.group?.name
                                  : chat.receiver.username}
                              </span>
                              <span className="text-sm text-gray-400 truncate">
                                {chat.last_message?.message_text ||
                                  "No recent messages"}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </div>
                  )}

                  {/* {usersList.map((chatuser, index) => (chatuser.id !== user.user_id ?
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
                  ))} */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Home;
