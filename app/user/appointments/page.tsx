"use client";
import AppointmentButton from "@/app/components/AppointmentButton";
import {
  AppointmentCardProps,
  ApppointmentCard,
} from "@/app/components/AppointmentCard";
import Loader from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import { useGetUserAppointmentsQuery, useGetAllHospitalsQuery } from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Seo from "@/app/components/Seo/Seo";
import { HiHeart, HiBriefcase, HiBeaker, HiEye, HiUser, HiClock, HiLocationMarker } from "react-icons/hi";
import { MdChildCare, MdLocalPharmacy } from "react-icons/md";
import { FaBrain, FaTooth, FaBone } from "react-icons/fa";
import { GiLungs } from "react-icons/gi";
import { BsCameraVideo } from "react-icons/bs";
import Link from "next/link";

const Appointment = () => {
  const { userAppointmentInfo } = useAppSelector((state) => state.user);
  const { userInfo } = useAppSelector((state) => state.auth);

  const { data, isLoading } = useGetUserAppointmentsQuery(userInfo?._id);
  const { data: hospitalsData, isLoading: hospitalsLoading } = useGetAllHospitalsQuery({});
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [showServices, setShowServices] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (data) {
      setTotalAppointments(data?.data.length);
    }
  }, [data]);

  // Medical services with their icons and colors
  const medicalServices = [
    {
      id: 1,
      name: "Cardiology",
      icon: HiHeart,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600",
      description: "Heart and cardiovascular care",
      hospitals: ["King Faisal Hospital", "Rwanda Military Hospital", "Clinique La Croix du Sud"]
    },
    {
      id: 2,
      name: "Pediatrics",
      icon: MdChildCare,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
      description: "Children's healthcare",
      hospitals: ["CHUK", "King Faisal Hospital", "Kanombe Military Hospital"]
    },
    {
      id: 3,
      name: "Neurology",
      icon: FaBrain,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
      description: "Brain and nervous system",
      hospitals: ["King Faisal Hospital", "CHUK", "Rwanda Military Hospital"]
    },
    {
      id: 4,
      name: "Orthopedics",
      icon: FaBone,
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600",
      description: "Bone and joint treatment",
      hospitals: ["Rwanda Military Hospital", "CHUK", "Polyclinique du Plateau"]
    },
    {
      id: 5,
      name: "Ophthalmology",
      icon: HiEye,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600",
      description: "Eye care and vision",
      hospitals: ["Kanombe Military Hospital", "King Faisal Hospital", "Kigali Eye Hospital"]
    },
    {
      id: 6,
      name: "Dentistry",
      icon: FaTooth,
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      iconColor: "text-teal-600",
      description: "Dental and oral health",
      hospitals: ["Polyclinique du Plateau", "CHUK", "Clinique Dentaire La Medicale"]
    },
    {
      id: 7,
      name: "Laboratory",
      icon: HiBeaker,
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600",
      description: "Medical tests and diagnostics",
      hospitals: ["King Faisal Hospital", "CHUK", "Rwanda Military Hospital", "Legacy Clinics"]
    },
    {
      id: 8,
      name: "Pulmonology",
      icon: GiLungs,
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      iconColor: "text-cyan-600",
      description: "Lung and respiratory care",
      hospitals: ["CHUK", "King Faisal Hospital", "Clinique La Croix du Sud"]
    },
    {
      id: 9,
      name: "General Medicine",
      icon: HiBriefcase,
      color: "from-gray-500 to-slate-600",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
      iconColor: "text-gray-600",
      description: "General health consultations",
      hospitals: ["King Faisal Hospital", "CHUK", "Rwanda Military Hospital", "Polyclinique du Plateau"]
    },
  ];

  return (
    <>
      <Seo
        title="Your appointments"
        description="Appointments made with hospitals"
        keywords="appointments, hospital appointments"
      />
      <div className="w-screen h-screen bg-zinc-50">
        {isLoading ? (
          <Loader />
        ) : (
          <SidebarLayout>
            <section className="appointments my-5 w-full">
              
              {/* Medical Services Section - Only show when toggled */}
              {showServices && (
                <div className="mb-12 animate-fadeIn">
                  <div className="mb-8">
                    <h3 className="font-bold text-3xl neu-text-primary mb-2">
                      Medical Services
                    </h3>
                    <Text className="text-base neu-text-secondary">
                      Browse our comprehensive healthcare services and find the right specialist for your needs
                    </Text>
                  </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {medicalServices.map((service) => {
                    const IconComponent = service.icon;
                    return (
                      <div
                        key={service.id}
                        className="group relative neu-card rounded-2xl transition-all duration-300 overflow-hidden"
                      >
                        {/* Decorative top bar */}
                        <div className={`h-1.5 bg-gradient-to-r ${service.color}`}></div>
                        
                        {/* Card content */}
                        <div className="p-6">
                          {/* Icon and title */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-xl neu-pressed group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className={`h-7 w-7 ${service.iconColor}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg neu-text-primary mb-1 group-hover:text-blue-600 transition-colors">
                                {service.name}
                              </h4>
                              <p className="text-sm neu-text-muted">
                                {service.description}
                              </p>
                            </div>
                          </div>
                          
                          {/* Divider */}
                          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>
                          
                          {/* Hospitals section */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <HiLocationMarker className="h-4 w-4 text-blue-500" />
                              <span className="text-xs font-semibold neu-text-secondary uppercase tracking-wide">
                                Available Locations
                              </span>
                            </div>
                            <div className="space-y-2 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                              {service.hospitals.map((hospital, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2.5 text-sm neu-text-primary py-1.5 px-3 rounded-lg neu-pressed-light hover:neu-raised transition-all duration-200"
                                >
                                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex-shrink-0"></div>
                                  <span className="font-medium">{hospital}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Stats badges */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 neu-pressed-light rounded-full">
                              <HiClock className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-xs font-semibold text-green-700">24/7 Available</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 neu-pressed-light rounded-full">
                              <HiUser className="h-3.5 w-3.5 text-purple-600" />
                              <span className="text-xs font-semibold text-purple-700">{service.hospitals.length} Centers</span>
                            </div>
                          </div>
                          
                          {/* Action button */}
                          <Link href="/user/search" className="block">
                            <button className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r ${service.color} hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2`}>
                              <span>Book Appointment</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </Link>
                        </div>
                        
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Appointments Section */}
              <div className="pt-8">
                <h3 className="font-bold text-2xl capitalize text-accent">
                  Scheduled appointments
                </h3>
                <Text className="text-sm flex items-center gap-x-2">
                  Your appointment with hospitals{" "}
                  <span
                    className="bg-accent  text-center flex items-center justify-center font-bold h-6 w-6
             text-white rounded-full text-[12px]"
                  >
                    <span className="text-[12px]">
                      {userAppointmentInfo?.length! > 100
                        ? `${99}+`
                        : userAppointmentInfo?.length!}
                    </span>
                  </span>
                </Text>

                <section
                  className={`appointment-container w-full gap-10 ${
                    totalAppointments !== 0 && "flex flex-col md:grid"
                  } sm:grid-cols-2 xl:grid-cols-3 my-8`}
                >
                  {totalAppointments == 0 ? (
                    <div className="w-full p-8">
                      <div className="neu-card rounded-2xl p-8 max-w-2xl">
                        <div className="mb-6">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                            <BsCameraVideo className="h-12 w-12 text-blue-600" />
                          </div>
                          <h3 className="font-bold text-2xl neu-text-primary mb-3">No Appointments Yet</h3>
                          <p className="neu-text-secondary text-base leading-relaxed mb-4">
                            You haven't scheduled any appointments with our healthcare providers yet. Start your healthcare journey by booking your first appointment today!
                          </p>
                          <p className="neu-text-muted text-sm mb-6">
                            Click the camera icon below to explore our medical services and find the right specialist for your needs.
                          </p>
                        </div>
                        
                        <div className="space-y-3 max-w-md">
                          <Link href="/user/search">
                            <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                              Browse Hospitals
                            </button>
                          </Link>
                          <button 
                            onClick={() => setShowServices(true)}
                            className="w-full py-3 px-6 neu-button text-blue-600 font-semibold rounded-xl transition-all duration-200"
                          >
                            View Medical Services
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    userAppointmentInfo?.map(
                      (appointment: AppointmentCardProps | any) => {
                        return (
                          <ApppointmentCard
                            key={appointment._id}
                            title={appointment.title}
                            description={appointment.description}
                            createdAt={appointment.createdAt}
                            startDate={appointment.startDate}
                            endDate={appointment.endDate}
                            _id={appointment._id}
                            userType="user"
                          />
                        );
                      }
                    )
                  )}
                </section>
              </div>
              
              {/* Modified Appointment Button with Toggle */}
              <div onClick={() => setShowServices(!showServices)} title={showServices ? "Hide Services" : "View Medical Services"}>
                <section className="fixed bottom-20 right-10">
                  <section
                    className={`w-16 h-16 flex items-center justify-center bg-accent rounded-full shadow cursor-pointer relative transform-gpu transition-all duration-300 ${
                      showServices ? 'scale-110 rotate-12' : 'scale-100 hover:scale-110'
                    }`}
                  >
                    <BsCameraVideo className="h-10 w-10 text-white" />
                  </section>
                </section>
              </div>
            </section>
          </SidebarLayout>
        )}
      </div>
    </>
  );
};

export default Appointment;
