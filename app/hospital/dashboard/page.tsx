"use client";

import { AppointmentLabel } from "@/app/components/AppointmentCard";
import Button from "@/app/components/Button";
import Loader, { LoaderSmall } from "@/app/components/Loader";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import {
  saveAppointmentInfo,
  saveDashboardInfo,
  saveRecentAppointmentInfo,
  useGetHospitalQuery,
  useGetLatestAppointmentsQuery,
  userAppointmentInfoProps,
  useGetReviewByHospitalIdQuery,
  useGetHospitalRatingQuery,
  saveReviewInfo,
  reviewProps,
  useGetAllUsersQuery,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { BsCameraVideo } from "react-icons/bs";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { SlBadge } from "react-icons/sl";
import { useDispatch } from "react-redux";
import DashboardCard from "@/app/components/DashboardCard/DashboardCard";
import { HospitalDashboardQuickActions } from "@/app/components/DashboardQuickActions/DashboardQuickActions";
import { HealthcareHistoryDashboard } from "@/app/components/HealthCareHistory";
import Seo from "@/app/components/Seo/Seo";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: hospitalData, isLoading } = useGetHospitalQuery({});
  const { data: allUsersData } = useGetAllUsersQuery({});
  const { userInfo } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const healthCareHistoryRef = useRef<HTMLDivElement | any>(null);
  const [showPatientPreview, setShowPatientPreview] = useState(false);

  let dataToPass = {
    id: userInfo?._id,
    limit: 5,
    userType: "hospital",
  };

  useEffect(() => {
    if (hospitalData) {
      dispatch(saveDashboardInfo(hospitalData?.data));
    }
  }, [hospitalData]);

  const { userDashboardInfo, recentAppointmentInfo, userReviewInfo } = useAppSelector(
    (state) => state.user
  );

  const { data: latestAppointmentData, isLoading: latestAppointmentLoading } =
    useGetLatestAppointmentsQuery(dataToPass);

  const { data: reviewsData, isLoading: reviewsLoading } = 
    useGetReviewByHospitalIdQuery(userInfo?._id, { skip: !userInfo?._id });

  const { data: ratingData } = useGetHospitalRatingQuery(userInfo?._id, { skip: !userInfo?._id });

  useEffect(() => {
    if (latestAppointmentData) {
      dispatch(saveAppointmentInfo(latestAppointmentData?.data));
      dispatch(saveRecentAppointmentInfo(latestAppointmentData?.data));
    }
  }, [latestAppointmentData]);

  useEffect(() => {
    if (reviewsData) {
      dispatch(saveReviewInfo(reviewsData.data));
    }
  }, [reviewsData]);

  const handleViewAppointmentClick = () => {
    router.push("/hospital/appointments/");
  };

  const handleViewReviewsClick = () => {
    router.push("/hospital/profile/me/reviews");
  };

  const averageRating = ratingData?.averageRating || 0;
  const totalReviews = userReviewInfo?.length || 0;

  return (
    <>
      <Seo
        title="Hospital Dashboard"
        description="Hospital dashboard"
        keywords="hospital dashboard, dashboard"
      />
      <div className="w-screen h-screen bg-white">
        {isLoading ? (
          <Loader />
        ) : (
          <HospitalSidebarNav showWelcomeMesage={true}>
            <section className="general-container w-full items-start flex flex-col xl:flex-row gap-x-5">
              <section className="w-full p-1 flex md:hidden items-center justify-center">
                <DashboardCard
                  appointments={userDashboardInfo?.appointments?.length!}
                  className="mt-5"
                  healthcareHistoryRef={healthCareHistoryRef}
                  userType="hospital"
                />
              </section>

              <section className="w-full p-1 flex md:hidden items-center justify-center">
                <HospitalDashboardQuickActions />
              </section>

              <section className="first-section w-full xl:w-8/12 hidden md:flex flex-col items-center justify-center ">
                <section className="health-care-history w-full my-5 p-2">
                  <HealthcareHistoryDashboard 
                    userType="hospital"
                    totalPatients={allUsersData?.data?.length || 0}
                    todayAppointments={userDashboardInfo?.appointments?.length || 0}
                    successRate={94.2}
                    avgWaitTime={12}
                    onTotalPatientsClick={() => setShowPatientPreview(!showPatientPreview)}
                    showPatientPreview={showPatientPreview}
                    patientsData={allUsersData?.data || []}
                  />
                </section>
              </section>

              <section className="second-section w-full xl:w-4/12 mt-16 md:mt-0 grid grid-cols-1 items-center justify-center p-1 md:p-2 ">
                {/* Reviews Summary Section */}
                <section className="reviews-summary mb-6">
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px] mb-3">
                    patient reviews
                  </h3>
                  
                  <section className="bg-white rounded-lg p-4 neu-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-x-2">
                        <FaStar className="text-yellow-400 w-6 h-6" />
                        <span className="text-2xl font-bold neu-text-primary">
                          {averageRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm neu-text-secondary">
                          {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(averageRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <Button
                      className="w-full bg-accent"
                      onClick={handleViewReviewsClick}
                    >
                      View All Reviews
                    </Button>
                  </section>
                </section>
              </section>

              <section className="health-care-history w-full md:hidden my-5 p-1">
                <HealthcareHistoryDashboard 
                  userType="hospital"
                  totalPatients={allUsersData?.data?.length || 0}
                  todayAppointments={userDashboardInfo?.appointments?.length || 0}
                  successRate={94.2}
                  avgWaitTime={12}
                  onTotalPatientsClick={() => setShowPatientPreview(!showPatientPreview)}
                  showPatientPreview={showPatientPreview}
                  patientsData={allUsersData?.data || []}
                />
              </section>
            </section>
          </HospitalSidebarNav>
        )}
      </div>
    </>
  );
};

export default Home;
