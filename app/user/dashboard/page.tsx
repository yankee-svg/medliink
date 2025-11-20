"use client";

import { AppointmentLabel } from "@/app/components/AppointmentCard";
import Button from "@/app/components/Button";
import ChatBotButton from "@/app/components/ChatBotButton";
import DashboardCard from "@/app/components/DashboardCard/DashboardCard";
import Loader, { LoaderSmall } from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import {
  saveAppointmentInfo,
  saveDashboardInfo,
  saveRecentAppointmentInfo,
  useGetLatestAppointmentsQuery,
  useGetUserQuery,
  userAppointmentInfoProps,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsCameraVideo } from "react-icons/bs";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { SlBadge } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { DashboardQuickActions } from "@/app/components/DashboardQuickActions/DashboardQuickActions";
import toast from "react-hot-toast";
import Seo from "@/app/components/Seo/Seo"; // Special thanks to @benrobo for this trick 🙌

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: userData, isLoading } = useGetUserQuery({});
  const { userInfo } = useAppSelector((state) => state.auth);
  const healthCareHistoryRef = useRef<HTMLDivElement | any>(null);
  const chatBotRef = useRef<HTMLFormElement>(null);
  const chatBotMessageBottomRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    userChat: "",
  });

  const [showLoaderSmall, setShowLoaderSmall] = useState<boolean>(false);

  const [chatBodyHeight, setChatBodyHeight] = useState<string>("h-full");

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //it makes more sense to define it here

  interface messageStruct {
    sender: "bot" | "user";
    message: string;
  }

  const [messages, setMessages] = useState<messageStruct[]>([
    {
      sender: "bot",
      message: `Hi, I'm Medliink AI, nice to meet you ${userInfo?.name}`,
    },

    {
      sender: "bot",
      message: ` I can analyze your symptoms to provide rapid and accurate diagnoses for a wide range of health conditions. 
      I can also provide valuable insights into your overall health and wellness, helping you make informed decisions about your healthcare.
`,
    },
  ]);

  let dataToPass = {
    id: userInfo?._id,
    limit: 5,
    userType: "user",
  };

  const router = useRouter();

  useEffect(() => {
    if (userData) {
      dispatch(saveDashboardInfo(userData?.data));
    }
  }, [userData]);

  const { userDashboardInfo, recentAppointmentInfo } = useAppSelector(
    (state) => state.user
  );

  const { data: latestAppointmentData, isLoading: latestAppointmentLoading } =
    useGetLatestAppointmentsQuery(dataToPass);

  useEffect(() => {
    if (latestAppointmentData) {
      dispatch(saveAppointmentInfo(latestAppointmentData?.data));
      dispatch(saveRecentAppointmentInfo(latestAppointmentData?.data));
    }
  }, [latestAppointmentData]);

  const handleNewAppointmentClick = () => {
    router.push("/user/appointments/new");
  };

  const handleSymptomsCheckerClick = () => {
    router.push("/user/dashboard/symptoms-checker");
  };

  const handleBotClick = () => {
    chatBotRef.current?.classList.remove("scale-0");
    chatBotRef.current?.classList.add("scale-100");
  };

  const handleBotCancelButtonClick = () => {
    chatBotRef.current?.classList.remove("scale-100");
    chatBotRef.current?.classList.add("scale-0");
  };

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setShowLoaderSmall(true);

    const updatedMessages = [...messages];
    updatedMessages.push({ sender: "user", message: formData.userChat });

    setMessages(updatedMessages);
    setFormData({ ...formData, userChat: "" });
    scrollToBottom();

    try {
      // Try free Hugging Face API first
      const botResponse = await callFreeAI(formData.userChat);
      
      updatedMessages.push({
        sender: "bot",
        message: botResponse,
      });

      setShowLoaderSmall(false);
      setMessages(updatedMessages);
      scrollToBottom();
    } catch (error) {
      console.log(error);
      // Fallback to healthcare knowledge base
      const fallbackResponse = getHealthcareResponse(formData.userChat);
      const updatedMessages = [...messages];
      updatedMessages.push({
        sender: "bot",
        message: fallbackResponse,
      });
      setMessages(updatedMessages);
      setShowLoaderSmall(false);
      scrollToBottom();
    }
  };

  const callFreeAI = async (userMessage: string): Promise<string> => {
    const prompt = `You are a helpful healthcare assistant. Provide concise, accurate health information. User asks: "${userMessage}"`;

    try {
      // Using Hugging Face's free Inference API with a reliable model
      const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Using public HF token (rate limited but free)
          "Authorization": "Bearer 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"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9
          }
        })
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result = await response.json();
      
      if (Array.isArray(result) && result.length > 0) {
        let generatedText = result[0].generated_text || "";
        
        // Clean up the response
        generatedText = generatedText.replace(prompt, "").replace(/^:\s*/, "").trim();
        
        if (generatedText && generatedText.length > 10) {
          return generatedText;
        }
      }
      
      throw new Error("Invalid response format");
      
    } catch (error) {
      console.log("API call failed, using fallback:", error);
      // Immediately fall back to healthcare responses
      return getHealthcareResponse(userMessage);
    }
  };

  const getHealthcareResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Simple keyword-based healthcare responses
    if (message.includes('headache') || message.includes('head pain')) {
      return "Headaches can have various causes including stress, dehydration, or tension. For persistent or severe headaches, please consult a healthcare professional. Would you like to use our symptoms checker for more detailed analysis?";
    }
    
    if (message.includes('fever') || message.includes('temperature')) {
      return "Fever often indicates your body is fighting an infection. Stay hydrated and rest. If fever persists above 103°F (39.4°C) or is accompanied by severe symptoms, seek medical attention immediately.";
    }
    
    if (message.includes('cough') || message.includes('cold')) {
      return "Coughs can be caused by infections, allergies, or other conditions. Stay hydrated and consider honey for throat soothing. If symptoms worsen or persist, please consult a doctor.";
    }
    
    if (message.includes('stomach') || message.includes('abdominal') || message.includes('nausea')) {
      return "Stomach issues can range from minor to serious. Try bland foods and stay hydrated. Severe or persistent abdominal pain should be evaluated by a healthcare provider.";
    }
    
    if (message.includes('symptoms') || message.includes('check')) {
      return "I recommend using our built-in symptoms checker tool for a more thorough analysis of your symptoms. You can find it in your dashboard!";
    }
    
    if (message.includes('appointment') || message.includes('doctor') || message.includes('hospital')) {
      return "I can help you schedule an appointment with healthcare providers. You can create a new appointment from your dashboard.";
    }
    
    if (message.includes('medication') || message.includes('medicine') || message.includes('drug')) {
      return "Please consult with your healthcare provider or pharmacist before taking any medications. They can provide personalized advice based on your medical history.";
    }
    
    if (message.includes('emergency') || message.includes('urgent') || message.includes('severe')) {
      return "If you're experiencing a medical emergency, please call emergency services immediately or go to your nearest emergency room.";
    }
    
    // Default healthcare response
    return "I'm here to help with your healthcare questions! I can provide general health information, but for specific medical advice, please consult with a healthcare professional. You can also use our symptoms checker tool for detailed analysis.";
  };

  const scrollToBottom = () => {
    const chatBotMessageBottom = chatBotMessageBottomRef.current;
    if (chatBotMessageBottom) {
      chatBotMessageBottom.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    if (messages.length >= 4) {
      setChatBodyHeight("h-auto");
    }
  }, [messages]);

  return (
    <>
      <Seo
        title="Dashboard"
        description="Medliink Dashboard"
        keywords="dashboard, user dashboard"
      />
      <div
        className="w-screen h-screen"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <SidebarLayout showWelcomeMesage={true}>
            <section
              className="general-container w-full mx-auto items-start flex flex-col xl:flex-row gap-x-5"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '18px',
                boxShadow:
                  '0 2px 24px 0 rgba(0,0,0,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.04)',
                minHeight: '80vh',
                padding: '2rem 1rem',
                transition: 'background 0.3s',
              }}
            >
              <section className="w-full p-1 flex md:hidden items-center justify-center">
                <DashboardCard
                  appointments={userDashboardInfo?.appointments?.length!}
                  className="mt-5"
                  healthcareHistoryRef={healthCareHistoryRef}
                  userType="user"
                />
              </section>

              <section className="w-full p-1 flex md:hidden items-center justify-center">
                <DashboardQuickActions />
              </section>

              <section className="first-section w-full xl:w-8/12 hidden md:flex flex-col items-center justify-center ">
                <section className="stats-container grid p-1 lg:grid-cols-3 gap-10 w-full">
                  <section className="neu-soft h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in">
                    <BsCameraVideo className="w-8 h-8" />
                    <Text>
                      {userDashboardInfo?.appointments?.length}{" "}
                      {userDashboardInfo?.appointments?.length! > 1
                        ? "Appointments"
                        : "Appointment"}
                    </Text>
                  </section>

                  <section className="neu-soft h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in">
                    <HiOutlineShieldCheck className="w-8 h-8" />
                    <Text>
                      {userDashboardInfo?.allTotalAppointments} total{" "}
                      {userDashboardInfo?.allTotalAppointments! > 1
                        ? "Checkups"
                        : "Checkup"}
                    </Text>
                  </section>

                  <section className="neu-soft h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in">
                    <SlBadge className="w-8 h-8" />
                    <Text>
                      {userDashboardInfo?.reviews?.length} total{" "}
                      {userDashboardInfo?.reviews?.length! > 1
                        ? "Reviews"
                        : "Review"}
                    </Text>
                  </section>
                </section>

                <section
                  className="health-care-history w-full my-5 p-2"
                  ref={healthCareHistoryRef}
                >
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                    healthcare history
                  </h3>

                  {userDashboardInfo?.healthCareHistory?.length === 0 ? (
                    <Text className="text-center my-5">
                      No healthcare history
                    </Text>
                  ) : (
                    <Text>History dey</Text>
                  )}
                </section>
              </section>

              <section className="second-section w-full xl:w-4/12 mt-16 md:mt-0 grid grid-cols-1 items-center justify-center p-2">
                <section className="user-appointments">
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                    recent appointments
                  </h3>

                  <section className="appointments mt-4">
                    {latestAppointmentLoading ? (
                      <LoaderSmall className="my-2" />
                    ) : recentAppointmentInfo?.length == 0 ? (
                      <Text className="text-center my-3">
                        No recent appointments
                      </Text>
                    ) : (
                      recentAppointmentInfo?.map(
                        (appointment: userAppointmentInfoProps) => {
                          return (
                            <AppointmentLabel
                              key={appointment._id}
                              userType="hospital"
                              status={appointment.status}
                              attender={appointment.hospitalId}
                              _id={appointment._id}
                              href={`/user/appointments/${appointment._id}`}
                              createdAt={appointment.createdAt}
                            />
                          );
                        }
                      )
                    )}
                    <section className="new-appointment w-full flex items-end justify-end my-5">
                      <Button
                        className="bg-accent"
                        onClick={handleNewAppointmentClick}
                      >
                        New appointment
                      </Button>
                    </section>
                  </section>
                </section>
                <br />
                <br />
                <section className="symptoms-checker">
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                    symptoms checker
                  </h3>

                  <Text noCapitalize className="my-4">
                    Symptoms checker to help you identify potential health
                    conditions based on your symptoms.
                  </Text>

                  <Button
                    className="bg-accent"
                    onClick={handleSymptomsCheckerClick}
                  >
                    Symptoms checker
                  </Button>
                </section>
              </section>

              <section className="health-care-history w-full md:hidden my-5 p-2">
                <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                  healthcare history
                </h3>

                {userDashboardInfo?.healthCareHistory?.length === 0 ? (
                  <Text className="text-center my-5 text-sm">
                    No healthcare history
                  </Text>
                ) : (
                  <Text>History dey</Text>
                )}
              </section>
              <form
                className="bg-blue-100 h-4/6 absolute overflow-x-hidden scroll-smooth overflow-y-auto md:w-[28rem] w-11/12 transform-gpu transition duration-150 ease-linear scale-0 rounded-lg shadow-md  bottom-3  right-2 z-[10000]"
                ref={chatBotRef}
                onSubmit={(e) => {
                  handleChatSubmit(e);
                }}
                id="chat-container"
              >
                <section className="w-full sticky top-0 z-[10000] bg-gray-100 flex items-center justify-between p-1">
                  <section className="w-full flex items-center gap-5  p-2">
                    <div className="avatar online">
                      <div className="w-10 rounded-full">
                        <img
                          src="https://api.dicebear.com/7.x/micah/svg?seed=ai"
                          alt="Medliink bot image"
                        />
                      </div>
                    </div>
                    <h2 className="capitalize font-semibold text-[16px]">
                      medliink Ai
                    </h2>
                  </section>

                  <section className="">
                    <section className="h-8 w-8 flex items-center justify-center rounded-full  shadow bg-red-400 text-white duration-100 cursor-pointer transition-colors ease-linear">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                        onClick={handleBotCancelButtonClick}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </section>
                  </section>
                </section>

                <section
                  className={`chat-container w-full ${chatBodyHeight} p-2 overflow-x-hidden overflow-y-clip mb-10`}
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`chat ${
                        msg.sender === "user" ? "chat-end" : "chat-start"
                      }`}
                    >
                      <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={`${
                              msg.sender === "user"
                                ? userInfo?.profilePicture
                                : "https://api.dicebear.com/7.x/micah/svg?seed=ai"
                            }`}
                            alt={`${msg.sender} image`}
                          />
                        </div>
                      </div>
                      <div className="chat-bubble bg-gray-100 text-gray-900 break-words">
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </section>

                <section className="my-2">
                  {showLoaderSmall && <LoaderSmall className="bg-gray-200" />}
                </section>

                <div className="sticky bottom-0 w-full shadow-md flex items-center">
                  <input
                    type="text"
                    placeholder="Type something..."
                    name="userChat"
                    onChange={handleInputChange}
                    value={formData.userChat}
                    className="w-full border-none focus:outline-none focus:border-transparent p-4"
                  />
                  <button className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="absolute right-1 z-[10000] w-6 h-6 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </div>
                <div className="" ref={chatBotMessageBottomRef}></div>
              </form>
              <ChatBotButton onClick={handleBotClick} />
            </section>
          </SidebarLayout>
        )}
      </div>
    </>
  );
};

export default Home;
