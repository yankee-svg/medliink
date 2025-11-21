"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Loader from "@/app/components/Loader";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import { updateUserInfo } from "@/app/store/slices/auth.slice";
import { saveDashboardInfo } from "@/app/store/slices/user.slice";
import { useUpdateHospitalMutation } from "@/app/store/slices/user.slice";
import { useAppSelector } from "@/app/store/store";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import { HiExternalLink, HiLocationMarker, HiPhone, HiMail, HiGlobe, HiStar } from "react-icons/hi";
import { useDispatch } from "react-redux";

import Seo from "@/app/components/Seo/Seo";

export default function Profile() {
  const { userDashboardInfo } = useAppSelector((state) => state.user);

  const [updateHospital, { isLoading: updateHospitalLoading }] =
    useUpdateHospitalMutation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    location: "",
    website: "",
  });

  const [websiteUrl, setWebsiteUrl] = useState("");

  // Update form data when userDashboardInfo changes
  React.useEffect(() => {
    if (userDashboardInfo) {
      setFormData({
        name: userDashboardInfo?.clinicName || "", // Use clinicName from store but map to name for API
        email: userDashboardInfo?.email || "",
        username: userDashboardInfo?.username || "",
        bio: userDashboardInfo?.bio || "",
        location: userDashboardInfo?.location || "",
        website: userDashboardInfo?.website || "",
      });
      setWebsiteUrl(userDashboardInfo?.website || "");
    }
  }, [userDashboardInfo]);

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    if (!e?.target) return;
    
    const { name, value } = e.target;
    if (!name) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (!userDashboardInfo?._id) {
      toast.error("User ID is missing. Please refresh the page and try again.");
      return;
    }

    if (!formData.name?.trim()) {
      toast.error("Clinic name is required");
      return;
    }

    if (!formData.email?.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.username?.trim()) {
      toast.error("Username is required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      // Send the exact form data like the working user profile
      const dataToSubmit = {
        body: formData,
        id: userDashboardInfo._id,
      };

      console.log("Sending profile update request:", dataToSubmit);
      console.log("Original formData:", formData);

      const response: any = await updateHospital(dataToSubmit).unwrap();

      console.log("Update response:", response);

      // Show success message
      if (response?.message) {
        toast.success(response.message);
      } else {
        toast.success("Profile updated successfully!");
      }

      // Update Redux store if response contains data
      if (response?.data) {
        dispatch(updateUserInfo(response.data));
        dispatch(saveDashboardInfo(response.data));
      } else {
        // Fallback: update with form data
        const updatedUserData = {
          ...userDashboardInfo,
          clinicName: formData.name,
          ...formData
        };
        dispatch(updateUserInfo(updatedUserData));
        dispatch(saveDashboardInfo(updatedUserData));
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      console.log("Full error response:", error?.response?.data);
      console.log("Error status:", error?.status);
      console.log("Error data:", error?.data);
      console.log("Error object keys:", Object.keys(error || {}));
      console.log("Error message:", error?.message);
      console.log("Stringified error:", JSON.stringify(error, null, 2));
      
      // Handle different error scenarios
      let errorMessage = "An error occurred while updating your profile";
      
      if (error?.status === 400) {
        errorMessage = error?.data?.message || error?.data?.error || "Invalid data provided. Please check your input.";
      } else if (error?.status === 401) {
        errorMessage = "You are not authorized to update this profile.";
      } else if (error?.status === 404) {
        errorMessage = "Profile not found. Please refresh the page.";
      } else if (error?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (typeof error?.data === 'string') {
        errorMessage = error.data;
      }

      toast.error(errorMessage);
    }
  };

  const handleWebsiteUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userDashboardInfo?._id) {
      toast.error("User ID is missing. Please refresh the page.");
      return;
    }

    if (!websiteUrl.trim()) {
      toast.error("Website URL cannot be empty");
      return;
    }

    // Basic URL validation
    try {
      new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      // Use the same updateHospital mutation but only send website field
      const response: any = await updateHospital({
        id: userDashboardInfo._id,
        body: { website: websiteUrl }
      }).unwrap();

      toast.success("Website updated successfully!");

      // Update Redux store
      const updatedData = {
        ...userDashboardInfo,
        website: websiteUrl,
      };
      dispatch(updateUserInfo(updatedData));
      dispatch(saveDashboardInfo(updatedData));
    } catch (error: any) {
      console.error("Website update error:", error);
      
      // Even if backend fails, update locally so the redirect works
      const updatedData = {
        ...userDashboardInfo,
        website: websiteUrl,
      };
      dispatch(updateUserInfo(updatedData));
      dispatch(saveDashboardInfo(updatedData));
      
      toast.success("Website saved locally! (Backend update may have failed, but your website link will work)");
    }
  };

  // Show loading state if user data is not yet available
  if (!userDashboardInfo && !updateHospitalLoading) {
    return (
      <>
        <Seo title="Update profile" description="Your hospital profile" />
        <div className="w-screen h-screen bg-zinc-50">
          <HospitalSidebarNav>
            <div className="flex items-center justify-center h-64">
              <Loader />
            </div>
          </HospitalSidebarNav>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Update profile" description="Your hospital profile" />
      <div className="w-screen min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
        {updateHospitalLoading ? (
          <Loader />
        ) : (
          <HospitalSidebarNav>
            {/* Hero Section with Hospital Image */}
            <section className="relative w-full h-72 mb-8 rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
                  alt="Hospital Building"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent"></div>
              </div>
              <div className="relative h-full flex items-end p-8">
                <div className="flex items-end gap-6">
                  {/* Hospital Logo/Avatar */}
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-white p-4">
                      <img
                        className="w-full h-full object-contain"
                        src="https://i.postimg.cc/4dfFhjgW/hospital-icon.png"
                        alt="Hospital Logo"
                      />
                    </div>
                    <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transform transition-transform hover:scale-110">
                      <AiOutlineCamera className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Hospital Name & Info */}
                  <div className="text-white pb-2">
                    <h1 className="text-4xl font-bold mb-2">{userDashboardInfo?.clinicName || "Hospital Name"}</h1>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <HiLocationMarker className="h-4 w-4" />
                        <span>{userDashboardInfo?.location || "Location"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HiStar className="h-4 w-4 text-yellow-400" />
                        <span>4.2 Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-8">
              
              {/* Left Column - Info Cards */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Quick Info Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Quick Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <HiLocationMarker className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">KN 4 Ave, Kigali</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <HiPhone className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">0788 304 005</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <HiMail className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{userDashboardInfo?.email}</p>
                      </div>
                    </div>
                    {userDashboardInfo?.website && (
                      <div className="flex items-start gap-3">
                        <HiGlobe className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Website</p>
                          <a 
                            href={userDashboardInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mission Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="font-bold text-lg mb-3">Our Mission</h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    CHUK is the first and biggest healthcare institution in Rwanda, committed to providing 
                    world-class medical care and playing a vital role in rebuilding Rwanda's healthcare system.
                  </p>
                </div>

                {/* Stats Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Hospital Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">519</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Beds</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">24/7</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Service</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">1918</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Founded</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">4.2</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Edit Forms */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Website Update Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-900">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <HiExternalLink className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 dark:text-white">Hospital Website</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Update your online presence</p>
                    </div>
                  </div>
                  <form onSubmit={handleWebsiteUpdate} className="space-y-4">
                    <div>
                      <label htmlFor="websiteUrl" className="text-sm block mb-2 font-medium text-gray-700 dark:text-gray-300">
                        Website URL
                      </label>
                      <Input
                        type="text"
                        name="websiteUrl"
                        placeholder="https://yourhospital.com"
                        value={websiteUrl}
                        onChange={(e: any) => setWebsiteUrl(e.target.value)}
                      />
                    </div>
                    {websiteUrl && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <HiGlobe className="h-4 w-4 text-blue-600" />
                        <a 
                          href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {websiteUrl}
                        </a>
                      </div>
                    )}
                    <Button disabled={updateHospitalLoading}>
                      {updateHospitalLoading ? "Updating..." : "Update Website"}
                    </Button>
                  </form>
                </div>

                {/* Profile Information Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-xl mb-6 text-gray-800 dark:text-white">Profile Information</h3>
                  <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
                    
                    <div>
                      <label htmlFor="name" className="text-sm block mb-2 font-medium text-gray-700 dark:text-gray-300">
                        Hospital Name
                      </label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Enter hospital name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="username" className="text-sm block mb-2 font-medium text-gray-700 dark:text-gray-300">
                        Username
                      </label>
                      <Input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="text-sm block mb-2 font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="hospital@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="text-sm block mb-2 font-medium text-gray-700 dark:text-gray-300">
                        Location
                      </label>
                      <Input
                        type="text"
                        name="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="bio" className="text-sm block mb-2 font-medium text-gray-700 dark:text-gray-300">
                        About Hospital
                      </label>
                      <textarea
                        className="textarea border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500 rounded-lg w-full p-3 min-h-32"
                        name="bio"
                        placeholder="Tell us about your hospital, services, and facilities..."
                        value={formData.bio}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <Button disabled={updateHospitalLoading}>
                      {updateHospitalLoading ? "Updating..." : "Save Changes"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </HospitalSidebarNav>
        )}
      </div>
    </>
  );
}
