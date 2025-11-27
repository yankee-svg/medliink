"use client";

import Button from "@/app/components/Button";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useGetHospitalByIdQuery,
  hospitalProps,
  useGetRoomTokenQuery,
  saveRoomToken,
  saveCurrentTypingMessage,
  currentTypingMessaageProps,
} from "@/app/store/slices/user.slice";
import React, { useEffect, useState, useRef, Suspense } from "react";
import Loader from "@/app/components/Loader";
import { useAppSelector } from "@/app/store/store";
import { socket } from "@/app/store/middlewares/socket";
import NetworkStatus from "@/app/components/NetworkStatus/NetworkStatus";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { currentTime, currentMongoTime } from "@/app/helpers";
import Seo from "@/app/components/Seo/Seo";

const MessagesContent = () => {
  const searchParams = useSearchParams();
  const messageInputRef = useRef<HTMLDivElement | any>(null);
  const router = useRouter();
  const hospitalId = searchParams.get("hospitalId");
  const {
    data: hospitalData,
    isLoading: hospitalDataLoading,
    isError,
  } = useGetHospitalByIdQuery(hospitalId);
  const [fetchedHospitalData, setFetchedHospitalData] =
    useState<hospitalProps>();
  const { userDashboardInfo } = useAppSelector((state) => state.user);
  const { data: roomIdData, isLoading: roomIdLoading } = useGetRoomTokenQuery({
    userId: userDashboardInfo?._id,
    hospitalId: hospitalId,
  });

  const { roomToken, currentTypingMessage } = useAppSelector(
    (state) => state.user
  );

  const dispatch = useDispatch<AppDispatch>();

  const [messages, setMessages] = useState<currentTypingMessaageProps[]>([]);
  const [formData, setFormData] = useState({
    typedMessage: "",
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (hospitalData) {
      setFetchedHospitalData(hospitalData?.data);
    }
    if (roomIdData) {
      dispatch(saveRoomToken(roomIdData.data.roomId));
    }
  }, [hospitalData, roomIdData]);

  // Socket connection status
  useEffect(() => {
    const handleConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Check initial connection state
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  // Separate effect to join room after roomToken is set
  useEffect(() => {
    if (roomToken && isConnected) {
      console.log('Joining room:', roomToken);
      //Join the chat
      socket.emit("joinRoom", roomToken);

      socket.on("chatHistory", (data) => {
        //get the chat history
        console.log("Chat history received:", data);
        //set the messages
        setMessages(data);
      });

      socket.on('roomJoined', (data) => {
        console.log('Successfully joined room:', data);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      return () => {
        socket.off("chatHistory");
        socket.off('roomJoined');
        socket.off('error');
      };
    }
  }, [roomToken, isConnected]);

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const data = {
      roomId: roomToken,
      sender: userDashboardInfo?._id,
      receiver: hospitalId,
    };
    socket.emit("typing", data);

    let typingTimer: any;

    socket.on("responseTyping", (data) => {
      dispatch(saveCurrentTypingMessage(data));
      clearTimeout(typingTimer);

      typingTimer = setTimeout(() => {
        dispatch(saveCurrentTypingMessage(""));
      }, 2000);
    });
  };

  const viewOnlineHospitals = () => {
    router.back();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | any) => {
    e.preventDefault();

    if (formData.typedMessage.trim() === "") return;
    if (!isConnected) {
      console.error('Cannot send message: Not connected to server');
      return;
    }

    const data = {
      roomId: roomToken,
      sender: userDashboardInfo?._id,
      receiver: hospitalId,
      message: formData.typedMessage.trim(),
    };

    setIsSending(true);

    //send the message
    socket.emit("sendMessage", data, (response: any) => {
      setIsSending(false);
      if (response?.error) {
        console.error('Failed to send message:', response.error);
      } else {
        console.log('Message sent successfully');
      }
    });

    setFormData({ typedMessage: "" });
  };

  //listen for new message
  useEffect(() => {
    const handleNewMessage = (data: any) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages change
    const containerRef = messageInputRef.current;
    if (containerRef) {
      containerRef.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyPress = (event: React.KeyboardEvent | any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Submit the form when Enter is pressed (without Shift key)
      handleSubmit(event);
    }
  };

  return (
    <div className="w-screen h-screen bg-zinc-50">
      {hospitalDataLoading || roomIdLoading ? (
        <Loader />
      ) : isError ? (
        <section className="w-full flex items-center flex-col ">
          <Text className="my-5">Couldn't get hospital details 😥</Text>
          <section className="my-5">
            <Button onClick={viewOnlineHospitals}>Online Hospitals</Button>
          </section>
        </section>
      ) : (
        <SidebarLayout>
          <section className="my-5">
            <section className="messages-section my-5 w-full lg:w-1/2 lg:mx-auto">
              <section className="user-details flex items-center w-full justify-between p-1">
                <section className="first-section flex items-center gap-x-5">
                  <div className="avatar online">
                    <div className="w-24 rounded-full bg-white flex items-center justify-center border-2 border-blue-200 p-4">
                      <img
                        src="/medliink.png"
                        className="w-full h-full object-contain"
                        alt="hospital"
                      />
                    </div>
                  </div>

                  <div>
                    <Text className="font-semibold">
                      {fetchedHospitalData?.clinicName}
                    </Text>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        isConnected ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <Text className="text-xs text-gray-500">
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </Text>
                    </div>
                  </div>
                </section>

                <section className="second-section px-4">
                  <NetworkStatus />
                </section>
              </section>
              <section className="status-tab w-full items-center justify-center my-5">
                <Text className="text-[13px] text-center text-accent font-bold">
                  {currentTypingMessage?.message}
                </Text>
              </section>
              <section className="h-screen w-full flex flex-col">
                <div className="flex-grow">
                  {messages.length == 0 ? (
                    <Text className="font-bold text-center text-sm text-accent">
                      You've no messages with{" "}
                      {fetchedHospitalData?.clinicName}{" "}
                    </Text>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 ${
                          message?.sender === userDashboardInfo?._id
                            ? "sender"
                            : "receiver"
                        }`}
                        ref={messageInputRef}
                      >
                        <div
                          className={`max-w-[70%] ${
                            message?.sender === userDashboardInfo?._id
                              ? "bg-purple-200"
                              : "bg-slate-100"
                          } p-2 rounded-md ml-${
                            message?.sender === userDashboardInfo?._id
                              ? "auto"
                              : "0"
                          } break-words`}
                        >
                          {message?.message}
                          <Text className="block text-[12px] text-right p-0 m-0">
                            {message?.createdAt
                              ? currentMongoTime(message?.createdAt!)
                              : currentTime()}
                          </Text>
                        </div>
                      </div>
                    ))
                  )}

                  <div className="breaker my-5"></div>

                  <form
                    className="w-full my-8 flex flex-col items-center justify-center p-1 mb-10"
                    onSubmit={handleSubmit}
                  >
                    <div className="relative w-full ">
                      <textarea
                        placeholder={isConnected ? "Type a message..." : "Connecting..."}
                        rows={1}
                        spellCheck="false"
                        name="typedMessage"
                        value={formData.typedMessage}
                        onChange={handleInputChange}
                        tabIndex={0}
                        onKeyDown={handleKeyPress}
                        disabled={!isConnected || isSending}
                        className="w-full outline-none border-2 border-purple-300 focus:border-accent hover:border-accent transition-all duration-150 ease-in p-4 rounded-[30px] block disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button 
                        type="submit"
                        disabled={!isConnected || isSending || !formData.typedMessage.trim()}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 px-5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          <svg className="animate-spin h-6 w-6 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="text-accent"
                          >
                            <path
                              d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        )}
                      </button>
                    </div>
                  </form>
                  <br />
                  <br />
                  <br />
                </div>
              </section>
            </section>
          </section>
        </SidebarLayout>
      )}
    </div>
  );
};

const Messages = () => {
  const [fetchedHospitalData, setFetchedHospitalData] = useState<hospitalProps>();

  return (
    <>
      <Seo
        title={`Message with ${
          fetchedHospitalData?.clinicName
            ? fetchedHospitalData?.clinicName
            : "hospital"
        }`}
      />
      <Suspense fallback={<div className="w-screen h-screen flex items-center justify-center">
        <Loader />
      </div>}>
        <MessagesContent />
      </Suspense>
    </>
  );
};

export default Messages;
