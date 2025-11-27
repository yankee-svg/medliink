"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Loader from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import { getCurrentDateTime } from "@/app/helpers";
import { useCreateAppointmentMutation } from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Seo from "@/app/components/Seo/Seo";
import { BsCheckCircle, BsHospital, BsClock } from "react-icons/bs";
import { HiUser } from "react-icons/hi";

const SubmitAppointment = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    arrivalTime: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [createAppointment, { isLoading, data }] =
    useCreateAppointmentMutation();
  const { userInfo } = useAppSelector((state) => state.auth);

  const { hospitalSearchProfileInfo } = useAppSelector((state) => state.user);

  // Debug logging
  console.log("hospitalSearchProfileInfo:", hospitalSearchProfileInfo);
  console.log("isLoading:", isLoading);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!formData.patientName || !formData.arrivalTime) {
        toast.error("Please fill in all required fields");
        return;
      }

      const startDate = new Date(formData.arrivalTime);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

      // Don't send patientName to API - backend doesn't accept it
      // Instead, include it in the title and description
      const dataToSubmit = {
        title: `Appointment - ${formData.patientName}`,
        description: `Patient: ${formData.patientName} | Scheduled at ${hospitalSearchProfileInfo?.clinicName}`,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: userInfo?._id,
        hospitalId: hospitalSearchProfileInfo?._id,
      };

      console.log("Submitting appointment data:", dataToSubmit);

      const response: any = await createAppointment(dataToSubmit).unwrap();
      console.log("Appointment created successfully:", response);
      if (response?.data) {
        setShowSuccess(true);
      }
    } catch (error: any) {
      console.error("Full error object:", error);
      console.error("Error data:", error?.data);
      console.error("Error message:", error?.data?.message);
      toast.error(error?.data?.message || error?.message || "Failed to book appointment");
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        router.push("/user/appointments");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, router]);

  return (
    <>
      <Seo
        title={`Book Appointment`}
        description="Book appointment with hospital"
      />
      <div className="w-screen h-screen bg-zinc-50">
        <SidebarLayout>
          <section className="new-appointment w-full">
            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full neu-card animate-fadeIn">
                    <div className="text-center">
                      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <BsCheckCircle className="h-12 w-12 text-green-600" />
                      </div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-2">
                        Appointment Booked!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Your appointment has been successfully scheduled. The hospital will be notified.
                      </p>
                      <div className="neu-pressed-light rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <HiUser className="h-5 w-5 text-blue-600" />
                          <Text className="font-semibold">
                            {formData.patientName}
                          </Text>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <BsHospital className="h-5 w-5 text-purple-600" />
                          <Text className="text-sm">
                            {hospitalSearchProfileInfo?.clinicName}
                          </Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <BsClock className="h-5 w-5 text-green-600" />
                          <Text className="text-sm">
                            {new Date(formData.arrivalTime).toLocaleString()}
                          </Text>
                        </div>
                      </div>
                      <Button
                        onClick={() => router.push("/user/appointments")}
                        className="w-full"
                      >
                        View My Appointments
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <section className="w-11/12 md:w-3/4 xl:w-2/4 mx-auto my-8">
                <form
                  className="w-full"
                  onSubmit={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  <section className="form-header my-5">
                    <h3 className="font-bold text-2xl capitalize text-accent">
                      Book Appointment
                    </h3>
                    <Text className="text-sm">
                      Schedule your visit with{" "}
                      <span className="text-accent font-bold">
                        {hospitalSearchProfileInfo?.clinicName}
                      </span>
                    </Text>
                  </section>

                  {/* Hospital Info Card */}
                  <div className="neu-card rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BsHospital className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">
                          {hospitalSearchProfileInfo?.clinicName}
                        </h4>
                        <Text className="text-xs text-gray-600">
                          Healthcare Provider
                        </Text>
                      </div>
                    </div>
                  </div>

                  <section className="my-4 mb-5">
                    <label htmlFor="patientName" className="text-md my-2 flex items-center gap-2">
                      <HiUser className="h-5 w-5 text-blue-600" />
                      Patient Name *
                    </label>
                    <Input
                      type="text"
                      name="patientName"
                      placeholder="Enter your full name"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      required
                      className="text-sm"
                    />
                  </section>

                  <section className="my-4 mb-5">
                    <label htmlFor="arrivalTime" className="text-md my-2 flex items-center gap-2">
                      <BsClock className="h-5 w-5 text-purple-600" />
                      Arrival Date & Time *
                    </label>
                    <Input
                      type="datetime-local"
                      name="arrivalTime"
                      value={formData.arrivalTime}
                      min={getCurrentDateTime()}
                      onChange={handleInputChange}
                      required
                    />
                  </section>

                  <section className="my-4 mb-5 w-full">
                    <Button disabled={isLoading} className="w-full py-3 text-base">
                      {isLoading ? "Booking..." : "Book Appointment"}
                    </Button>
                  </section>

                  {/* Info Note */}
                  <div className="mt-4 neu-pressed-light rounded-lg p-3">
                    <Text className="text-xs text-gray-600 text-center">
                      <span className="font-semibold">Note:</span> Your appointment will be confirmed by the hospital shortly.
                    </Text>
                  </div>
                </form>
              </section>
            </section>
        </SidebarLayout>
      </div>
    </>
  );
};

export default SubmitAppointment;

