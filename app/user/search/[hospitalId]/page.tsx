"use client";
import Button from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import Verified from "@/app/components/Verified";
import {
  saveHospitalSearchProfileInfo,
  useGetHospitalByIdQuery,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import moment from "moment";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { GrLocation } from "react-icons/gr";
import { HiOutlineShieldCheck, HiLocationMarker, HiPhone, HiMail, HiGlobe, HiStar, HiExternalLink } from "react-icons/hi";
import { MdDateRange } from "react-icons/md";
import { SlBadge } from "react-icons/sl";
import { useDispatch } from "react-redux";
import Link from "next/link";
import AppointmentButton from "@/app/components/AppointmentButton";
import Seo from "@/app/components/Seo/Seo";

const HospitalProfile = ({ params }: { params: Promise<{ hospitalId: string }> }) => {
  const { hospitalId } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, isError } = useGetHospitalByIdQuery(hospitalId);
  const { hospitalSearchProfileInfo } = useAppSelector((state) => state.user);

  const router = useRouter();

  useEffect(() => {
    if (data) {
      dispatch(saveHospitalSearchProfileInfo(data.data));
    }
  }, [data]);

  const handleSearchHospitals = () => {
    router.back();
  };

  return (
    <>
      <Seo
        title={`${
          hospitalSearchProfileInfo?.clinicName
            ? hospitalSearchProfileInfo?.clinicName
            : "Hospital"
        }'s Profile`}
      />
      <div className="w-screen min-h-screen bg-gray-50">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <section className="w-full flex items-center flex-col ">
            <Text className="my-5">Couldn't get hospital details 😥</Text>
            <section className="my-5">
              <Button onClick={handleSearchHospitals}>Search Hospitals</Button>
            </section>
          </section>
        ) : (
          <SidebarLayout>
            <section className="my-5 px-4">
              
              {/* Hero Section with Hospital Image */}
              <section className="relative w-full h-80 mb-8 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop"
                    alt="Hospital Building"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent"></div>
                </div>
                
                <div className="relative h-full flex items-end p-8">
                  <div className="flex items-end gap-6">
                    {/* Hospital Logo/Avatar */}
                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-white p-4">
                      <img
                        className="w-full h-full object-contain"
                        src="https://i.postimg.cc/4dfFhjgW/hospital-icon.png"
                        alt="Hospital Logo"
                      />
                    </div>
                    
                    {/* Hospital Name & Info */}
                    <div className="text-white pb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold">{hospitalSearchProfileInfo?.clinicName}</h1>
                        {hospitalSearchProfileInfo?.isVerified && (
                          <Verified big={true} />
                        )}
                      </div>
                      <p className="text-sm opacity-90 mb-3">@{hospitalSearchProfileInfo?.username}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <HiLocationMarker className="h-4 w-4" />
                          <span>{hospitalSearchProfileInfo?.location || "Kigali, Rwanda"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiStar className="h-4 w-4 text-yellow-400" />
                          <span>4.2 (39 reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiOutlineShieldCheck className="h-4 w-4" />
                          <span>{hospitalSearchProfileInfo?.allTotalAppointments || 0} checkups</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-3">
                  <Link
                    href={`/user/search/${hospitalId}/review?hId=${hospitalSearchProfileInfo?._id}`}
                  >
                    <button className="bg-white/95 hover:bg-white text-blue-900 font-semibold px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105">
                      <HiStar className="h-5 w-5" />
                      Write Review
                    </button>
                  </Link>
                </div>
              </section>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column - Hospital Information */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* About Section */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="font-bold text-xl mb-4 text-gray-800">About</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {hospitalSearchProfileInfo?.bio || "The University Teaching Hospital of Kigali is a 519 bed-teaching hospital located in Kigali City, Rwanda. Founded in 1918 by Belgian colonialists, CHUK is the first and the biggest healthcare institution in Rwanda. CHUK has played a role in rebuilding Rwanda's healthcare after the genocide against Tutsi of 1994."}
                    </p>
                  </div>

                  {/* Photo Gallery */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="font-bold text-xl mb-4 text-gray-800">Photos</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop"
                        alt="Hospital exterior"
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&h=300&fit=crop"
                        alt="Hospital buildings"
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop"
                        alt="Medical facility"
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-xl text-gray-800">Reviews</h3>
                      <Link
                        href={`/user/search/${hospitalId}/review?hId=${hospitalSearchProfileInfo?._id}`}
                      >
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                          Write a review
                        </button>
                      </Link>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl font-bold text-gray-800">4.2</div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4].map((star) => (
                            <HiStar key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                          <HiStar className="h-5 w-5 text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-600">
                          {hospitalSearchProfileInfo?.reviews?.length || 39} reviews
                        </p>
                      </div>
                    </div>
                    
                    {hospitalSearchProfileInfo?.reviews?.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No reviews yet. Be the first to review!
                      </p>
                    ) : (
                      <div className="text-gray-600 text-sm">
                        Reviews coming soon...
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Quick Info */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Contact Information */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <HiLocationMarker className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="text-sm font-medium text-gray-800">
                            KN 4 Ave, Kigali
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <HiPhone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <a href="tel:0788304005" className="text-sm font-medium text-blue-600 hover:underline">
                            0788 304 005
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <HiMail className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <a href={`mailto:${hospitalSearchProfileInfo?.email}`} className="text-sm font-medium text-blue-600 hover:underline break-all">
                            {hospitalSearchProfileInfo?.email}
                          </a>
                        </div>
                      </div>
                      {hospitalSearchProfileInfo?.website && (
                        <div className="flex items-start gap-3">
                          <HiGlobe className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Website</p>
                            <a 
                              href={hospitalSearchProfileInfo.website.startsWith('http') ? hospitalSearchProfileInfo.website : `https://${hospitalSearchProfileInfo.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                            >
                              Visit Website
                              <HiExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hospital Stats */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Hospital Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">519</p>
                        <p className="text-xs text-gray-600 mt-1">Beds</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">24/7</p>
                        <p className="text-xs text-gray-600 mt-1">Service</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{hospitalSearchProfileInfo?.allTotalAppointments || 0}</p>
                        <p className="text-xs text-gray-600 mt-1">Checkups</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">4.2</p>
                        <p className="text-xs text-gray-600 mt-1">Rating</p>
                      </div>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
                    <h3 className="font-bold text-lg mb-2">Member Since</h3>
                    <p className="text-sm opacity-90">
                      Joined {moment(new Date(hospitalSearchProfileInfo?.createdAt!)).format('MMMM YYYY')}
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      ({moment(new Date(hospitalSearchProfileInfo?.createdAt!)).startOf("days").fromNow()})
                    </p>
                  </div>
                </div>
              </div>

              {/* Sticky Appointment Button */}
              <div className="fixed bottom-6 right-6 z-50">
                <AppointmentButton />
              </div>
            </section>
          </SidebarLayout>
        )}
      </div>
    </>
  );
};

export default HospitalProfile;
