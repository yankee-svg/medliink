"use client";
import Link from "next/link";
import { AiOutlineEye } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";

interface DashboardQuickActionsProps {
  className?: string;
}

export const DashboardQuickActions = ({
  className,
}: DashboardQuickActionsProps) => {
  return (
    <section
      className={`rounded-lg bg-slate-50 w-full p-4  md:hidden flex flex-col justify-center gap-y-3  mt-10  ${className}`}
    >
      <h4 className="font-bold text-[16px] capitalize my-2">quick actions</h4>

      <section className="action-buttons flex w-full justify-around items-start">
        <Link
          href={"/user/appointments/new"}
          className="action-1 flex items-center justify-center flex-col gap-y-2 flex-1"
        >
          <section className="image bg-purple-200 rounded-full p-3 flex items-center justify-center">
            <IoAdd className="w-5 h-5" />
          </section>
          <p className="text-[11px] capitalize text-center">add appointment</p>
        </Link>

        <Link
          href={"/user/appointments/"}
          className="action-1 flex items-center justify-center flex-col gap-y-2 flex-1"
        >
          <section className="image bg-purple-200 rounded-full p-3 flex items-center justify-center">
            <AiOutlineEye className="w-5 h-5" />
          </section>
          <p className="text-[11px] capitalize text-center">appointment</p>
        </Link>

        <Link
          href={"/user/search"}
          className="action-1 flex items-center justify-center flex-col gap-y-2 flex-1"
        >
          <section className="image bg-purple-200 rounded-full p-3 flex items-center justify-center">
            <FiSearch className="w-5 h-5" />
          </section>
          <p className="text-[11px] capitalize text-center">explore</p>
        </Link>
      </section>
    </section>
  );
};

export const HospitalDashboardQuickActions = ({
  className,
}: DashboardQuickActionsProps) => {
  return (
    <section
      className={`rounded-lg bg-slate-50 w-full p-4  md:hidden flex flex-col justify-center gap-y-3  mt-10  ${className}`}
    >
      <h4 className="font-bold text-[16px] capitalize my-2">quick actions</h4>
      <section className="action-buttons flex w-full justify-around items-start">
        <Link
          href={"/hospital/messages"}
          className="action-1 flex items-center justify-center flex-col gap-y-2 flex-1"
        >
          <section className="image bg-purple-200 rounded-full p-3 flex items-center justify-center">
            <IoAdd className="w-5 h-5" />
          </section>
          <p className="text-[11px] capitalize text-center">messages</p>
        </Link>

        <Link
          href={"/hospital/appointments/"}
          className="action-1 flex items-center justify-center flex-col gap-y-2 flex-1"
        >
          <section className="image bg-purple-200 rounded-full p-3 flex items-center justify-center">
            <AiOutlineEye className="w-5 h-5" />
          </section>
          <p className="text-[11px] capitalize text-center">appointments</p>
        </Link>

        <Link
          href={"/hospital/search"}
          className="action-1 flex items-center justify-center flex-col gap-y-2 flex-1"
        >
          <section className="image bg-purple-200 rounded-full p-3 flex items-center justify-center">
            <FiSearch className="w-5 h-5" />
          </section>
          <p className="text-[11px] capitalize text-center">explore</p>
        </Link>
      </section>
    </section>
  );
};
