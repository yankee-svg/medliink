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
import { BiMessageRoundedDots } from "react-icons/bi";
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
                {/* Health Connection Banner */}
                <section className="w-full mb-8 relative overflow-hidden rounded-3xl shadow-2xl group">
                  <div className="relative h-64 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400">
                    {/* Background Image with Overlay */}
                    <div 
                      className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                      style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-pink-500/70 to-orange-500/60" />
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-12">
                      <div className="inline-block mb-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/30">
                          CONNECT INSTANTLY
                        </span>
                      </div>
                      <h2 className="text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                        Access Healthcare Providers Anytime
                      </h2>
                      <p className="text-white/90 text-lg mb-6 max-w-xl drop-shadow">
                        Connect with multiple hospitals and clinics in one platform
                      </p>
                      <div>
                        <button 
                          onClick={() => router.push('/user/search')}
                          className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                          Find Providers
                        </button>
                      </div>
                    </div>
                    
                    {/* Navigation Dots */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                      <div className="w-2 h-2 rounded-full bg-white/50"></div>
                      <div className="w-2 h-2 rounded-full bg-white/50"></div>
                      <div className="w-8 h-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                </section>

                <section className="stats-container grid p-1 lg:grid-cols-3 gap-10 w-full">
                  <section className="neu-soft h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in"
                    onClick={() => router.push('/user/messages')}>
                    <BiMessageRoundedDots className="w-8 h-8" />
                    <Text>
                      {userDashboardInfo?.messages?.length || 0}{" "}
                      {(userDashboardInfo?.messages?.length || 0) !== 1
                        ? "Active Conversations"
                        : "Active Conversation"}
                    </Text>
                  </section>

                  <section className="neu-soft h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <Text>
                      {userDashboardInfo?.totalCalls || 0} Total{" "}
                      {(userDashboardInfo?.totalCalls || 0) !== 1
                        ? "Calls"
                        : "Call"}
                    </Text>
                  </section>

                  <section className="neu-soft h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in">
                    <SlBadge className="w-8 h-8" />
                    <Text>
                      {userDashboardInfo?.reviews?.length || 0} Provider{" "}
                      {(userDashboardInfo?.reviews?.length || 0) !== 1
                        ? "Reviews"
                        : "Review"}
                    </Text>
                  </section>
                </section>
              </section>

              <section className="second-section w-full xl:w-4/12 mt-16 md:mt-0 grid grid-cols-1 items-center justify-center p-2">
                <section className="connected-providers">
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                    Connected Providers
                  </h3>

                  <div className="my-4 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Healthcare Network</h4>
                        <p className="text-sm text-gray-600">Access multiple providers instantly</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">12+</p>
                        <p className="text-xs text-gray-600">Hospitals</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">50+</p>
                        <p className="text-xs text-gray-600">Clinics</p>
                      </div>
                    </div>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
                      onClick={() => router.push('/user/search')}
                    >
                      Explore All Providers
                    </Button>
                  </div>
                </section>
                <br />
                <br />
                <section className="health-tips">
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                    Health Tips
                  </h3>

                  <div className="my-4 space-y-3">
                    <div className="neu-soft p-4 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Regular Checkups</h4>
                          <p className="text-xs text-gray-600">Schedule routine health screenings to catch issues early</p>
                        </div>
                      </div>
                    </div>

                    <div className="neu-soft p-4 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Stay Connected</h4>
                          <p className="text-xs text-gray-600">Keep in touch with your healthcare providers via messages</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="bg-accent w-full"
                    onClick={handleSymptomsCheckerClick}
                  >
                    Check Symptoms Now
                  </Button>
                </section>
                <br />
                <br />
                <section className="quick-actions-sidebar">
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px] mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => router.push('/user/search')}
                      className="neu-soft p-4 rounded-xl hover:bg-blue-50 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-sm">Find Providers</p>
                          <p className="text-xs text-gray-500">Search nearby clinics</p>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => router.push('/user/messages')}
                      className="neu-soft p-4 rounded-xl hover:bg-green-50 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-sm">Messages</p>
                          <p className="text-xs text-gray-500">Chat with providers</p>
                        </div>
                      </div>
                    </button>

                    <button 
                      onClick={() => router.push('/user/profile/me')}
                      className="neu-soft p-4 rounded-xl hover:bg-purple-50 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-sm">My Profile</p>
                          <p className="text-xs text-gray-500">View & edit profile</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </section>
                <br />
                <br />
                <section className="platform-benefits">
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px] mb-4">
                    Why Use Medliink?
                  </h3>
                  <div className="space-y-3">
                    <div className="neu-soft p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Multiple Providers</h4>
                          <p className="text-xs text-gray-600">Access various hospitals and clinics from one platform</p>
                        </div>
                      </div>
                    </div>

                    <div className="neu-soft p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Instant Booking</h4>
                          <p className="text-xs text-gray-600">Book appointments quickly without phone calls</p>
                        </div>
                      </div>
                    </div>

                    <div className="neu-soft p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">AI-Powered Help</h4>
                          <p className="text-xs text-gray-600">Get preliminary health guidance anytime</p>
                        </div>
                      </div>
                    </div>

                    <div className="neu-soft p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Find Nearby Care</h4>
                          <p className="text-xs text-gray-600">Locate healthcare providers near your location</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
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
