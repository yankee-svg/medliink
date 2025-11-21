"use client";

import HospitalCard from "@/app/components/HospitalCard";
import { LoaderSmall } from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
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

  return (
    <>
      <Seo
        title="Find hospitals"
        description="Find hospitals on medliink"
        keywords="Find hospitals, hospitals"
      />
      <div className="w-screen h-screen bg-zinc-50">
        <SidebarLayout>
          <section className="search-hospitals my-5">
            <h3 className="font-bold text-2xl capitalize text-accent mb-2">
              search hospitals
            </h3>
            <Text className="text-sm mb-6">
              Discover and connect with healthcare providers near you
            </Text>

            {/* Info Cards Section */}
            <section className="info-cards grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="neu-soft p-6 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800">Find Nearby</h4>
                </div>
                <Text className="text-sm text-gray-600">
                  Search for hospitals and clinics in your area with verified ratings and reviews
                </Text>
              </div>

              <div 
                className="neu-soft p-6 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-green-50"
                onClick={handleVerifiedClick}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800">Registered Hospitals</h4>
                </div>
                <Text className="text-sm text-gray-600">
                  View all hospitals registered on Medliink platform
                </Text>
              </div>

              <div className="neu-soft p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800">Book Instantly</h4>
                </div>
                <Text className="text-sm text-gray-600">
                  Schedule appointments with your preferred hospitals in just a few clicks
                </Text>
              </div>
            </section>

            <section className="search-hospitals">
              <form className="flex items-center justify-center mb-8">
                <input
                  type="text"
                  placeholder="Search hospitals"
                  name="hospitalName"
                  className="bg-[#F5F5F5] capitalize p-5 rounded-full w-11/12 lg:w-8/12  outline-none border-2 border-purple-300 focus:border-accent hover:border-accent transition-all duration-150 ease-in text-sm"
                  onChange={handleInputChange}
                  value={formData.hospitalName}
                ></input>
              </form>

              <section className="found-hospitals w-full">
                {!isLoading && !allHospitalsLoading && showData && (
                  <Text className={`text-center text-sm`}>
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
                className={`all-hospitals w-full items-center  mx-auto gap-10 ${
                  responseLength !== 0 && "grid"
                } sm:grid-cols-2 xl:grid-cols-3 my-8`}
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
