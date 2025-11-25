"use client";

import { UserCard } from "@/app/components/HospitalCard";
import { LoaderSmall } from "@/app/components/Loader";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import {
  clearUserSearchInfo,
  saveUserSearchInfo,
  useGetAllUsersQuery,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Seo from "@/app/components/Seo/Seo";

const SearchUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useGetAllUsersQuery({});
  const { userSearchInfo } = useAppSelector((state) => state.user);
  const [responseLength, setResponseLength] = useState<number>(0);

  useEffect(() => {
    dispatch(clearUserSearchInfo({}));
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(saveUserSearchInfo(data.data));
      setResponseLength(data.data.length);
    }
  }, [data]);

  return (
    <>
      <Seo
        title="Find users"
        description="Find users on medliink"
        keywords="discover, find users, users, hospitals"
      />
      <div className="w-screen h-screen bg-white">
        <HospitalSidebarNav>
          <section className="my-5">
            <h3 className="font-bold text-2xl capitalize text-accent">
              All Patients
            </h3>
            <Text className="text-sm ">View all registered patients</Text>

            <section>

              <section
                className={` w-full items-center mx-auto gap-10 ${
                  responseLength !== 0 && "grid"
                } sm:grid-cols-2 xl:grid-cols-3 my-8`}
              >
                {isLoading ? (
                  <LoaderSmall />
                ) : responseLength == 0 ? (
                  <Text className="text-center my-5">No patients found</Text>
                ) : (
                  userSearchInfo?.map((user) => {
                    return (
                      <UserCard
                        _id={user._id}
                        address={user.location || "Around the world"}
                        name={user.name}
                        isVerified={user.isVerified}
                        key={user._id}
                        bio={user.bio}
                        href={`/hospital/search/${user._id}`}
                      />
                    );
                  })
                )}
              </section>
            </section>
          </section>
        </HospitalSidebarNav>
      </div>
    </>
  );
};

export default SearchUsers;
