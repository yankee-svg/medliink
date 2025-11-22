"use client";

import HospitalCard from "@/app/components/HospitalCard";
import { LoaderSmall } from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import HospitalMap from "@/app/components/HospitalMap";
import {
  clearHospitalSearchInfo,
  saveHospitalSearchInfo,
  useSearchHospitalQuery,
  useGetAllHospitalsQuery,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Seo from "@/app/components/Seo/Seo";

const SearchHospitals = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
  });
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<any[]>([]);
  
  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSkip(false);
  };

  const [skip, setSkip] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSearchHospitalQuery(formData.hospitalName, {
    skip,
  });
  const { data: allHospitalsData, isLoading: allHospitalsLoading } = useGetAllHospitalsQuery({});
  const [showData, setShowData] = useState<boolean>(false);
  const { hospitalSearchInfo } = useAppSelector((state) => state.user);
  const [responseLength, setResponseLength] = useState<number>(0);

  const handleVerifiedClick = () => {
    setShowVerifiedOnly(true);
    setFormData({ hospitalName: "" });
    setSkip(true);
    setShowMap(false);
  };

  const handleFindNearbyClick = () => {
    console.log("Find Nearby clicked");
    setShowMap(true);
    setShowVerifiedOnly(false);
    setFormData({ hospitalName: "" });
    setSkip(true);
    
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User location:", latitude, longitude);
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Filter nearby hospitals
          if (allHospitalsData?.data) {
            console.log("Setting nearby hospitals:", allHospitalsData.data);
            setNearbyHospitals(allHospitalsData.data);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          // Still show map even if location fails, use default location
          setUserLocation({ lat: -1.9441, lng: 30.0619 }); // Kigali, Rwanda
          if (allHospitalsData?.data) {
            setNearbyHospitals(allHospitalsData.data);
          }
        }
      );
    } else {
      console.log("Geolocation not supported");
      // Use default location
      setUserLocation({ lat: -1.9441, lng: 30.0619 }); // Kigali, Rwanda
      if (allHospitalsData?.data) {
        setNearbyHospitals(allHospitalsData.data);
      }
    }
  };

  useEffect(() => {
    dispatch(clearHospitalSearchInfo({}));
    
    if (showVerifiedOnly && allHospitalsData) {
      // Show all registered hospitals from the hospital database
      dispatch(saveHospitalSearchInfo(allHospitalsData.data));
      setResponseLength(allHospitalsData.data.length);
      setShowData(true);
    } else if (data) {
      dispatch(saveHospitalSearchInfo(data.data));
      setResponseLength(data.data.length);
      setShowData(true);
    }
  }, [formData, data, showVerifiedOnly, allHospitalsData]);

  // Update nearby hospitals when data is available
  useEffect(() => {
    if (showMap && allHospitalsData?.data && nearbyHospitals.length === 0) {
      console.log("Loading hospitals for map:", allHospitalsData.data);
      setNearbyHospitals(allHospitalsData.data);
    }
  }, [showMap, allHospitalsData]);

  return (
    <>
      <Seo
        title="Find hospitals"
        description="Find hospitals on medliink"
        keywords="Find hospitals, hospitals"
      />
      <div className="w-screen h-screen bg-zinc-50">
        <SidebarLayout>
          <section className="search-hospitals my-3 md:my-5 px-3 md:px-0">
            <h3 className="font-bold text-xl md:text-2xl capitalize text-accent mb-2">
              search hospitals
            </h3>
            <Text className="text-sm mb-4 md:mb-6">
              Discover and connect with healthcare providers near you
            </Text>

            {/* Info Cards Section */}
            <section className="info-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
              <div 
                className="neu-soft p-4 md:p-6 rounded-xl md:rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-blue-50"
                onClick={handleFindNearbyClick}
              >
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-sm md:text-base text-gray-800">Find Nearby</h4>
                </div>
                <Text className="text-xs md:text-sm text-gray-600">
                  Search for hospitals and clinics in your area with verified ratings and reviews
                </Text>
              </div>

              <div 
                className="neu-soft p-4 md:p-6 rounded-xl md:rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-green-50"
                onClick={handleVerifiedClick}
              >
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-sm md:text-base text-gray-800">Registered Hospitals</h4>
                </div>
                <Text className="text-xs md:text-sm text-gray-600">
                  View all hospitals registered on Medliink platform
                </Text>
              </div>
            </section>

            {/* Map View for Nearby Hospitals */}
            {showMap && (
              !userLocation ? (
                <div className="neu-card rounded-2xl md:rounded-3xl overflow-hidden p-6 md:p-8 text-center mb-4 md:mb-8">
                  <div className="flex flex-col items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-1 md:mb-2">Getting Your Location...</h3>
                      <p className="text-sm md:text-base text-gray-600">Please allow location access to find nearby hospitals</p>
                    </div>
                  </div>
                </div>
              ) : (
                <HospitalMap
                  hospitals={nearbyHospitals}
                  userLocation={userLocation}
                  onClose={() => setShowMap(false)}
                />
              )
            )}

            <section className="search-hospitals px-3 md:px-0">
              <form className="flex items-center justify-center mb-4 md:mb-8">
                <input
                  type="text"
                  placeholder="Search hospitals"
                  name="hospitalName"
                  className="bg-[#F5F5F5] capitalize p-3 md:p-5 rounded-full w-full sm:w-11/12 lg:w-8/12 outline-none border-2 border-purple-300 focus:border-accent hover:border-accent transition-all duration-150 ease-in text-sm"
                  onChange={handleInputChange}
                  value={formData.hospitalName}
                ></input>
              </form>

              <section className="found-hospitals w-full px-3 md:px-0">
                {!isLoading && !allHospitalsLoading && showData && (
                  <Text className={`text-center text-xs md:text-sm`}>
                    {showVerifiedOnly ? (
                      <>
                        showing <span className="text-accent font-semibold">all registered hospitals</span>
                      </>
                    ) : (
                      <>
                        search result for{" "}
                        <span className="text-accent">{formData.hospitalName}</span>
                      </>
                    )}
                  </Text>
                )}
              </section>

              <section
                className={`all-hospitals w-full items-center mx-auto gap-4 md:gap-10 px-3 md:px-0 ${
                  responseLength !== 0 && "grid"
                } grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 my-4 md:my-8`}
              >
                {(isLoading || allHospitalsLoading) ? (
                  <LoaderSmall />
                ) : responseLength == 0 ? (
                  <Text className="text-center my-5">No hospitals found</Text>
                ) : (
                  hospitalSearchInfo?.map((hospital) => {
                    return (
                      <HospitalCard
                        _id={hospital._id}
                        address={hospital.location || "Around the world"}
                        clinicName={hospital.clinicName}
                        isVerified={hospital.isVerified}
                        key={hospital._id}
                        href={`/user/search/${hospital._id}`}
                        website={hospital.website}
                      />
                    );
                  })
                )}
              </section>
            </section>
          </section>
        </SidebarLayout>
      </div>
    </>
  );
};

export default SearchHospitals;
