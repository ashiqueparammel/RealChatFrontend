import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEllipsisVertical,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearChatHistory,
  listUserHome,
  messageDeleteForEveryOne,
  messageDeleteForMe,
  previousChatList,
  searchUsers,
} from "../../Services/UserApi";
import { chatList, baseURL, webSocket } from "../../Constants/Constants";
import { Turn as Hamburger } from "hamburger-react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { timeAgo } from "../../Helpers/TimeManage";
import LogoSpinner from "../../Helpers/LogoSpinner";
function ChatPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);
  const location = useLocation();

  const [LoadingManage, setLoadingManage] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [searchValues, setSearchValues] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isOpens, setOpens] = useState(false);
  const [clientState, setClientState] = useState(null);
  const [senderDetails, setSenderDetails] = useState(user);
  const [recipientDetails, setRecipientDetails] = useState(
    location.state || []
  );
  const [activeStatus, setActiveStatus] = useState([]);
  const [attachments, setAttachments] = useState({});
  // console.log(location.state, "location", recipientDetails, "receiver");

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [managePage, setManagePage] = useState(false);
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const base64String = reader.result.split(",")[1]; // Base64 data
  //       setAttachments((prev) => ({
  //         ...prev,
  //         [file.name]: base64String, // Store file name and encoded data
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments({
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result, // Base64 data
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChat = async () => {
    const prevChat = await previousChatList(recipientDetails.id, user.user_id);
    console.log(prevChat, "response");
    setActiveStatus(prevChat.data?.opposite_user_status);
    if (prevChat && prevChat.data && prevChat.data.results) {
      setMessages(prevChat.data.results);
      setSenderDetails(prevChat.data.sender);
      setRecipientDetails(prevChat.data.receiver); // Update recipientDetails if needed
    }

    const client = new W3CWebSocket(
      `ws://127.0.0.1:8000/chatpersonal/${recipientDetails.id}/?${user.id}`
    );
    console.log(client, "client here");
    setClientState(client);

    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    client.onmessage = (message) => {
      console.log(message.data, "consumer message");

      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer) {
        console.log(dataFromServer, "server");

        console.log(dataFromServer.message.sender, "sender from server");
        console.log(dataFromServer.message.receiver, "receiver from server");
        if (dataFromServer && dataFromServer.message) {
          const newMessage = {
            id: dataFromServer.message.id,
            sender: dataFromServer.message.sender, // Sender's details
            receiver: dataFromServer.message.receiver, // Receiver's details
            message_text: dataFromServer.message.message_text, // Message text
            message_type: dataFromServer.message.message_type, // Type of message
            created_at: dataFromServer.message.created_at, // Timestamp
            attachments: dataFromServer.message.attachments || {}, // Attachments (if any)
          };

          console.log(newMessage, "New Message from server");

          // Update state with new message
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          console.log(message, "all messages from if condition");
        }

        // if (dataFromServer.deleteMessageId) {
        //   // If the message is marked for deletion, remove it from the state
        //   setMessages((prevMessages) =>
        //     prevMessages.filter(
        //       (msg) => msg.id !== dataFromServer.message.deleteMessageId
        //     )
        //   );
        // } else {
        // const newMessage = {
        //   id: dataFromServer.message.id,
        //   sender: dataFromServer.message.sender, // Sender's email
        //   receiver: dataFromServer.message.receiver, // Receiver's email
        //   message_text: dataFromServer.message.message_text,
        //   message_type: dataFromServer.message.message_type,
        //   created_at: dataFromServer.message.created_at,
        //   attachments: dataFromServer.message.attachments || {}, // Handle attachments (if any)
        // };
        // console.log(newMessage, "====================>>>>>>basjj");

        // Add the new message to the message list
        // setMessages(() => [...messages, newMessage]);
      }
      // }
    };

    client.onclose = () => {
      console.log("WebSocket disconnected");
    };
  };
  const sendMessage = () => {
    if (messageText.trim() === "") {
      return; // Don't send an empty message
    } else {
      const messageData = {
        action: "send_message", // Action type
        sender: senderDetails.email, // Sender's email
        receiver: recipientDetails.email, // Receiver's email
        message_text: messageText, // The actual message text
        attachments: attachments, // Can be updated with attachments if necessary
        message_type: attachments.length > 0 ? "media" : "text", // Message type (text in this case)
      };
      console.log(messageData, "message data");

      // // Optimistically render the message in the UI before WebSocket confirmation
      // const optimisticMessage = {
      //   message: messageText,
      //   sender: senderDetails,
      //   created_at: new Date().toISOString(), // Add timestamp for the new message
      //   message_type: "text", // Add message type (for consistency)
      // };

      // setMessages(() => [...messages, optimisticMessage]);

      // Clear the input field immediately
      setMessageText("");

      // Send the message over the WebSocket connection
      if (clientState) {
        clientState.send(JSON.stringify(messageData));
      }
    }
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const handleAddDocument = () => {
    setOpens(!isOpens);
  };

  useEffect(() => {
    if (recipientDetails?.id && senderDetails.user_id) {
      handleChat(); // Call only when both details are available
    }
  }, [recipientDetails, senderDetails]);

  const deleteChatForMeHandle = async (event) => {
    // const data = {
    //   user_id: senderDetails.user_id,
    //   message_id: event,
    // };
    console.log(event, "--");

    const data = {
      action: "delete_message",
      message_id: event,
      delete_for_everyone: false,
    };
    if (clientState) {
      clientState.send(JSON.stringify(data));
    }
    // const deleteMessage = await messageDeleteForMe(data);
    // if (deleteMessage.status === 200) {
    //   toast.success("Message deleted!");
    //   setManagePage(true);
    // } else {
    //   toast.error("network error!");
    // }
  };

  const clearChat = async () => {
    const data = {
      requested_user: senderDetails.user_id,
      second_user: recipientDetails.id,
    };
    const clearHistoryChat = await clearChatHistory(data);
    if (clearHistoryChat.status === 200) {
      toast.success("All History Cleared!");
      closeMenu();
      setManagePage(true);
    } else {
      toast.error("network error!");
    }
  };

  const deleteChatForEveryOneHandle = async (event) => {
    const data = {
      user_id: senderDetails.user_id,
      message_id: event,
    };
    const deleteMessage = await messageDeleteForEveryOne(data);
    if (deleteMessage.status === 200) {
      toast.success("Message deleted for Everyone!");
      if (clientState) {
        clientState.send(
          JSON.stringify({
            deleteMessageId: event,
          })
        );
      }
      setManagePage(true);
    } else {
      toast.error("network error!");
    }
  };

  return (
    <div className="2xl:grid 2xl:grid-cols-4 xl:grid xl:grid-cols-4 ">
      <>
        {LoadingManage ? (
          <div className="bg-opacity-50 items-center ">
            <LogoSpinner />
          </div>
        ) : (
          ""
        )}
      </>
      <div className="2xl:col-span-1 xl:col-span-2 hidden 2xl:block">
        <div className="py-10 h-screen bg-[#000000] px-2 ">
          <div className="max-w-md mx-auto bg-transparent shadow-lg rounded-lg 2xl:text-sm  xl:text-xs  md:max-w-lg">
            <div className="md:flex">
              <div className="w-full p-4">
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
                    className=" absolute right-3 top-4"
                    icon={faSearch}
                  />{" "}
                </div>
                <div className="overflow-y-auto max-h-screen hidescroll">
                  <ul className="">
                    {/* {usersList.map((chatuser, index) =>
                      chatuser.id !== user.user_id ? (
                        <li
                          key={index}
                          onClick={() => startChat(chatuser)}
                          className="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded-md cursor-pointer transition"
                        >
                          <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-1">
                              {chatuser.profile_image ? (
                                <img
                                  src={baseURL + chatuser.profile_image}
                                  alt="Profile"
                                  className="rounded-full w-10 h-10"
                                />
                              ) : (
                                <div className="bg-[#000000] rounded-full w-10 h-10 flex items-center justify-center text-white uppercase font-bold">
                                  {chatuser.username[0]}
                                </div>
                              )}
                            </div>
                            <div className="col-span-4 flex flex-col justify-center">
                              <span className="font-medium">
                                {chatuser.username}
                              </span>
                              <span className="text-sm text-gray-400 truncate">
                                {chatuser.message}
                              </span>
                            </div>
                          </div>
                        </li>
                      ) : (
                        ""
                      )
                    )} */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="2xl:col-span-3 xl:col-span-2 hidden 2xl:block">
        <div className="h-screen grid grid-rows-[auto,1fr]">
          <div className="bg-black h-20 border-l-[1px] shadow-lg shadow-[#6b6b6b] ">
            <div className="flex gap-8 pt-3 pl-10 ">
              {recipientDetails?.profile_image ? (
                <img
                  src={baseURL + recipientDetails.profile_image}
                  alt="Profile"
                  className="col-span- rounded-full w-14 h-14 "
                />
              ) : (
                <div className="bg-[#ffffff] rounded-full w-14 h-14 flex items-center text-xl justify-center text-black uppercase font-bold">
                  {recipientDetails?.username[0]}
                </div>
              )}
              <div className="flex flex-col justify-start">
                <h1 className=" text-white text-xl uppercase  pt-1  ">
                  {recipientDetails?.username}
                </h1>
                <h1 className=" text-white text-sm    ">
                  {/* {recipientDetails?.email} */}
                  {activeStatus?.is_online
                    ? "Online"
                    : `last seen :${activeStatus?.last_seen}`}
                </h1>
              </div>

              <div className="col-span- text-center pt-4 ">
                <Menu>
                  <MenuHandler>
                    <span className=" absolute right-12 top-4 text-white text-2xl ">
                      {" "}
                      <Hamburger toggled={isOpen} toggle={setOpen} />
                    </span>
                  </MenuHandler>
                  <MenuList className="max-h-72 text-black font-prompt text-md">
                    <MenuItem onClick={closeMenu}>Block</MenuItem>
                    <MenuItem onClick={clearChat}>ClearChat</MenuItem>
                    <MenuItem onClick={closeMenu}>Report</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
          </div>
          <div className="max-h-screen overflow-y-auto hidescroll">
            <div className="grid grid-cols-1">
              {messages
                .filter(
                  (chatMessage) =>
                    !chatMessage.deleted_for?.some(
                      (user) => user.id === senderDetails.id
                    )
                ) // Exclude messages deleted for the current user
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // Sort by created_at
                .map((chatMessage, index) => (
                  <div key={index}>
                    {/* Check if sender exists before accessing its properties */}
                    {chatMessage.sender?.email === senderDetails.email ? (
                      <div className="flex justify-end">
                        <div className="flex justify-end">
                          <div className="flex flex-col items-end">
                            <Menu>
                              <MenuHandler>
                                <h1 className="bg-white shadow-md shadow-[#989898] font-prompt p-2 text-black text-center tracking-wider w-fit rounded-tl-lg rounded-tr-lg rounded-bl-lg mt-2 mr-3 hover:cursor-pointer nonedit">
                                  {chatMessage.message_text}
                                  <span>
                                    <FontAwesomeIcon
                                      className="hidden ml-1"
                                      color="black"
                                      icon={faEllipsisVertical}
                                    />
                                  </span>
                                </h1>
                              </MenuHandler>
                              <MenuList className="max-h-72 text-black font-prompt text-sm">
                                <MenuItem
                                  onClick={() =>
                                    deleteChatForEveryOneHandle(chatMessage.id)
                                  }
                                >
                                  Delete for everyone
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    deleteChatForMeHandle(chatMessage.id)
                                  }
                                >
                                  Delete for me
                                </MenuItem>
                              </MenuList>
                            </Menu>

                            <h1 className="mt-1 mr-4 text-[#7b7b7b] text-[12px]">
                              {timeAgo(chatMessage.created_at) ===
                              "NaN years ago"
                                ? "just now"
                                : timeAgo(chatMessage.created_at)}
                            </h1>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start">
                        <div>
                          <Menu>
                            <MenuHandler>
                              <h1 className="bg-[#000000] shadow-md shadow-[#989898] font-prompt p-2 text-white text-center tracking-wider rounded-tl-lg rounded-tr-lg rounded-br-lg w-fit mt-2 ml-3">
                                {chatMessage.message_text}
                                <span>
                                  <FontAwesomeIcon
                                    className="hidden ml-2"
                                    color="white"
                                    icon={faEllipsisVertical}
                                  />
                                </span>
                              </h1>
                            </MenuHandler>

                            <MenuList className="max-h-72 text-black font-prompt text-sm">
                              <MenuItem
                                onClick={() =>
                                  deleteChatForMeHandle(chatMessage.id)
                                }
                              >
                                Delete for me
                              </MenuItem>
                            </MenuList>
                          </Menu>
                          <h1 className="ml-4 mt-1 text-[#7b7b7b] text-[12px]">
                            {timeAgo(chatMessage.created_at) === "NaN years ago"
                              ? "just now"
                              : timeAgo(chatMessage.created_at)}
                          </h1>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-items-center bg-black border-l-[1px] shadow-lg shadow-[#6b6b6b] p-2 ">
            <div className="relative">
              <FontAwesomeIcon
                onClick={handleAddDocument}
                icon={faPlus}
                color="white"
                className={`plus-icon ${
                  isOpens ? "rotate-45 pt-3 pr-3" : "rotate-0 pt-3 pr-3"
                } w-6 h-6 hover:cursor-pointer ml-4`}
              />
              {isOpens && (
                <div className="absolute top-full left-0 mt-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600"
                  >
                    Upload File
                  </label>
                </div>
              )}
            </div>

            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-[90%] h-12  rounded-md  outline-none border-[1px] border-black font-prompt"
              placeholder="Type a message"
              style={{ paddingLeft: "20px" }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={sendMessage}
              viewBox="0 0 24 24"
              fill="white"
              className="bg rounded-md hover:bg-white hover:bg-opacity-20  p-[3px]  w-9 mt-[5px]  ml-3 h-9"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-screen 2xl:hidden">
        <div className="h-svh grid grid-rows-[auto,1fr]">
          <div className="bg-black h-20 border-l-[1px] shadow-lg shadow-[#6b6b6b]">
            <div className="grid grid-cols-4 gap-4 pt-3 pl-4">
              {recipientDetails?.profile_image ? (
                <img
                  src={baseURL + recipientDetails.profile_image}
                  alt="Profile"
                  className="rounded-full w-14 h-14 col-span-1"
                />
              ) : (
                <div className="bg-[#ffffff] rounded-full w-14 h-14 flex items-center justify-center text-xl col-span-1 text-black uppercase font-bold">
                  {recipientDetails?.username[0]}
                </div>
              )}
              <div className="flex flex-col justify-start col-span-3 ">
                <h1 className="text-white text-sm sm:text-md md:text-lg lg:text-xl uppercase pt-1   ">
                  {recipientDetails?.username}
                </h1>
                <h1 className="text-white text-sm sm:text-md md:text-lg lg:text-lg ">
                  {recipientDetails?.email}
                </h1>
              </div>
              <div className="text-center pt-4 col-span-4">
                <Menu>
                  <MenuHandler>
                    <span className="absolute right-2 top-2 text-white text-xl">
                      <Hamburger toggled={isOpen} toggle={setOpen} />
                    </span>
                  </MenuHandler>
                  <MenuList className="max-h-72 text-black font-prompt text-md">
                    <MenuItem onClick={closeMenu}>Block</MenuItem>
                    <MenuItem onClick={clearChat}>ClearChat</MenuItem>
                    <MenuItem onClick={closeMenu}>Report</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
          </div>
          <div className="max-h-screen overflow-y-auto hidescroll ">
            <div className="grid grid-cols-1">
              {messages
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // Sort by created_at
                .map((chatMessage, index) => (
                  <div key={index}>
                    {/* Check if sender exists before accessing its properties */}
                    {chatMessage.sender?.email === senderDetails.email ? (
                      <div className="flex justify-end">
                        <div className="flex justify-end">
                          <div className="flex flex-col items-end">
                            <Menu>
                              <MenuHandler>
                                <h1 className="bg-white shadow-md shadow-[#989898] font-prompt p-2 text-black text-center tracking-wider w-fit rounded-tl-lg rounded-tr-lg rounded-bl-lg mt-2 mr-3 hover:cursor-pointer nonedit">
                                  {chatMessage.message_text}
                                  <span>
                                    <FontAwesomeIcon
                                      className="hidden ml-1"
                                      color="black"
                                      icon={faEllipsisVertical}
                                    />
                                  </span>
                                </h1>
                              </MenuHandler>
                              <MenuList className="max-h-72 text-black font-prompt text-sm">
                                <MenuItem
                                  onClick={() =>
                                    deleteChatForEveryOneHandle(chatMessage.id)
                                  }
                                >
                                  Delete for everyone
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    deleteChatForMeHandle(chatMessage.id)
                                  }
                                >
                                  Delete for me
                                </MenuItem>
                              </MenuList>
                            </Menu>

                            <h1 className="mt-1 mr-4 text-[#7b7b7b] text-[12px]">
                              {timeAgo(chatMessage.created_at) ===
                              "NaN years ago"
                                ? "just now"
                                : timeAgo(chatMessage.created_at)}
                            </h1>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start">
                        <div>
                          <Menu>
                            <MenuHandler>
                              <h1 className="bg-[#000000] shadow-md shadow-[#989898] font-prompt p-2 text-white text-center tracking-wider rounded-tl-lg  rounded-tr-lg rounded-br-lg w-fit mt-2 ml-3">
                                {chatMessage.message_text}
                                <span>
                                  <FontAwesomeIcon
                                    className="hidden ml-2"
                                    color="white"
                                    icon={faEllipsisVertical}
                                  />
                                </span>
                              </h1>
                            </MenuHandler>

                            <MenuList className="max-h-72 text-black font-prompt text-sm">
                              <MenuItem
                                onClick={() =>
                                  deleteChatForMeHandle(chatMessage.id)
                                }
                              >
                                Delete for me
                              </MenuItem>
                            </MenuList>
                          </Menu>
                          <h1 className="ml-4 mt-1 text-[#7b7b7b] text-[12px]">
                            {timeAgo(chatMessage.created_at) === "NaN years ago"
                              ? "just now"
                              : timeAgo(chatMessage.created_at)}
                          </h1>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-items-center bg-black border-l-[1px] shadow-lg shadow-[#6b6b6b] p-2">
            <div>
              <FontAwesomeIcon
                onClick={handleAddDocument}
                icon={faPlus}
                color="white"
                className={`plus-icon ${
                  isOpens ? "rotate-45 pt-3 pr-3" : "rotate-0 pt-3 pr-3"
                } w-6 h-6 hover:cursor-pointer ml-4`}
              />
            </div>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-[90%] h-12 rounded-md outline-none border-[1px] border-black font-prompt"
              placeholder="Type a message"
              style={{ paddingLeft: "20px" }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={sendMessage}
              viewBox="0 0 24 24"
              fill="white"
              className="bg rounded-md hover:bg-white hover:bg-opacity-20 p-[3px] w-9 mt-[5px] ml-3 h-9"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </div>
        </div>
      </div>
      {/* this is end */}

      <Toaster />
    </div>
  );
}

export default ChatPage;
