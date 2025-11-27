"use client";

import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import ActiveUsers from "@/app/components/ActiveUsers/ActiveUsers";
import Seo from "@/app/components/Seo/Seo";
import { useGetAllUsersQuery } from "@/app/store/slices/user.slice";
import { useAppSelector } from "@/app/store/store";
import { LoaderSmall } from "@/app/components/Loader";
import Link from "next/link";

const Messages = () => {
  const { data: allUsersData, isLoading: allUsersLoading } = useGetAllUsersQuery({});
  const { userDashboardInfo } = useAppSelector((state) => state.user);

  return (
    <>
      <Seo
        title="Your messages"
        description="Your messages with users"
        keywords="Message with user, messages"
      />
      <div className="w-screen h-screen bg-white">
        <HospitalSidebarNav>
          <section className="appointments my-5">
            <h3 className="font-bold text-2xl capitalize text-accent">
              messages
            </h3>
            <Text className="text-sm">Your messages with users</Text>

            <section className="messages-section my-5">
              <section className="message-area">
                <ActiveUsers />
                <section className="all-messages my-5">
                  {allUsersLoading ? (
                    <div className="flex justify-center py-10">
                      <LoaderSmall />
                    </div>
                  ) : allUsersData?.data?.length === 0 ? (
                    <Text className="text-center text-sm text-gray-500 py-10">
                      No users available to message
                    </Text>
                  ) : (
                    allUsersData?.data?.map((user: any) => {
                      return (
                        <Link
                          key={user._id}
                          href={`/hospital/messages/${userDashboardInfo?._id}_${user?._id}?userId=${user?._id}`}
                        >
                          <section className="flex items-center gap-x-3 my-4 cursor-pointer hover:bg-blue-100 transition-colors duration-100 ease-in p-2 rounded-lg">
                            <div className={`avatar ${user?.online ? 'online' : 'offline'}`}>
                              <div className="w-14 rounded-full">
                                <img src={user?.profilePicture} alt={user?.name} />
                              </div>
                            </div>
                            <div className="message-content flex-1">
                              <h2 className="font-bold capitalize flex items-center gap-x-1">
                                {user?.name}
                                {user?.isVerified && (
                                  <span>
                                    <svg
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="dodgerblue"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M21.5609 10.7386L20.2009 9.15859C19.9409 8.85859 19.7309 8.29859 19.7309 7.89859V6.19859C19.7309 5.13859 18.8609 4.26859 17.8009 4.26859H16.1009C15.7109 4.26859 15.1409 4.05859 14.8409 3.79859L13.2609 2.43859C12.5709 1.84859 11.4409 1.84859 10.7409 2.43859L9.17086 3.80859C8.87086 4.05859 8.30086 4.26859 7.91086 4.26859H6.18086C5.12086 4.26859 4.25086 5.13859 4.25086 6.19859V7.90859C4.25086 8.29859 4.04086 8.85859 3.79086 9.15859L2.44086 10.7486C1.86086 11.4386 1.86086 12.5586 2.44086 13.2486L3.79086 14.8386C4.04086 15.1386 4.25086 15.6986 4.25086 16.0886V17.7986C4.25086 18.8586 5.12086 19.7286 6.18086 19.7286H7.91086C8.30086 19.7286 8.87086 19.9386 9.17086 20.1986L10.7509 21.5586C11.4409 22.1486 12.5709 22.1486 13.2709 21.5586L14.8509 20.1986C15.1509 19.9386 15.7109 19.7286 16.1109 19.7286H17.8109C18.8709 19.7286 19.7409 18.8586 19.7409 17.7986V16.0986C19.7409 15.7086 19.9509 15.1386 20.2109 14.8386L21.5709 13.2586C22.1509 12.5686 22.1509 11.4286 21.5609 10.7386ZM16.1609 10.1086L11.3309 14.9386C11.1909 15.0786 11.0009 15.1586 10.8009 15.1586C10.6009 15.1586 10.4109 15.0786 10.2709 14.9386L7.85086 12.5186C7.56086 12.2286 7.56086 11.7486 7.85086 11.4586C8.14086 11.1686 8.62086 11.1686 8.91086 11.4586L10.8009 13.3486L15.1009 9.04859C15.3909 8.75859 15.8709 8.75859 16.1609 9.04859C16.4509 9.33859 16.4509 9.81859 16.1609 10.1086Z"
                                        fill="#93C5FD"
                                      ></path>
                                    </svg>
                                  </span>
                                )}
                              </h2>
                              <Text className="text-[12px] text-gray-600 truncate">
                                Message conversation with {user?.name}
                              </Text>
                            </div>
                          </section>
                        </Link>
                      );
                    })
                  )}

                </section>
              </section>
            </section>
          </section>
        </HospitalSidebarNav>
      </div>
    </>
  );
};

export default Messages;
