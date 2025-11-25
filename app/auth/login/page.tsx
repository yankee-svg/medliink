"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Loader from "@/app/components/Loader";
import Text from "@/app/components/Text";
import { loginUser } from "@/app/store/slices/auth.slice";
import { useLoginMutation } from "@/app/store/slices/user.slice";
import { AppDispatch } from "@/app/store/store";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import Seo from "@/app/components/Seo/Seo";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "user",
  });

  // Prevent caching issues
  useEffect(() => {
    // Clear any potential cached navigation
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      if (response) {
        toast.success(response.message);
        const jwtToken = response.data.accessToken;
        const jwtPayload: any = jwt.decode(jwtToken);
        const tempData = jwtPayload;
        const { role } = tempData;
        const { accessToken, refreshToken: token, ...data } = response.data;
        const userData = { ...data, role };

        dispatch(loginUser(userData));

        //make request to our auth server
        try {
          const serverResponse = await axios.post("/api/auth/set-token", {
            token,
          });
        } catch (error: any) {
          toast.error("Token not set");
        }

        //route the user to their respective page
        if (role === "user") {
          router.push("/user/dashboard");
        } else if (role === "hospital") {
          router.push("/hospital/dashboard");
        } else {
          toast.error("Invalid token, please login!");
          router.push("/auth/login");
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };
  return (
    <>
      <Seo
        title="Login"
        description="Login to your Medliink account"
        keywords="login, log in"
      />
      <section className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
        {isLoading && <Loader />}
        
        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Info */}
          <div className="hidden md:flex flex-col justify-center space-y-6 p-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800">
                Welcome to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Medliink
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Bridging health with technology
              </p>
            </div>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Connect with Providers</h3>
                  <p className="text-sm text-gray-600">Access multiple healthcare organizations in one platform</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Quick Appointments</h3>
                  <p className="text-sm text-gray-600">Book healthcare services instantly from anywhere</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Secure & Private</h3>
                  <p className="text-sm text-gray-600">Your health data is protected with enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            <form
              className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 space-y-6 transform transition-all hover:shadow-3xl"
              onSubmit={(e) => {
                handleLogin(e);
              }}
            >
              {/* Mobile Header */}
              <div className="md:hidden text-center mb-6">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Medliink
                </h1>
                <p className="text-gray-600 mt-2">Bridging health with technology</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Welcome Back
                </h3>
                <p className="text-gray-600">Sign in to continue to your account</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder=""
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    placeholder=""
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="userType" className="text-sm font-medium text-gray-700 block mb-2">
                    Login As
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <select
                      className="select border-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl w-full h-14 pl-12 pr-4 transition-all duration-200 bg-white hover:border-gray-400"
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                    >
                      <option value="user">Patient</option>
                      <option value="hospital">Healthcare Provider</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to Medliink?</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                <Link
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  href={"/auth/signup"}
                >
                  Create an account →
                </Link>
                <Link
                  href={"/auth/forgot-password"}
                  className="text-gray-600 hover:text-gray-700 font-medium hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
