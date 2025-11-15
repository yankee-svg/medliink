"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";

interface DashboardCardProps {
  className?: string;
  appointments: number | string;
  healthcareHistoryRef?: React.RefObject<HTMLDivElement>;
  userType?: "user" | "hospital";
}

const DashboardCard = ({
  className,
  appointments,
  healthcareHistoryRef,
  userType,
}: DashboardCardProps) => {
  const [currentIcon, setCurrentIcon] = useState<IconType | any>(AiOutlineEye);
  const [toggler, setToggler] = useState(true);
  const [totalAppointment, setTotalAppointment] = useState(appointments);
  const router = useRouter();

  const handleIconClick = () => {
    setToggler(!toggler);
  };

  const appointmentLink =
    userType === "user" ? "/user/appointments/" : "/hospital/appointments/";

  useEffect(() => {
    setCurrentIcon(toggler ? AiOutlineEye : AiOutlineEyeInvisible);
    setTotalAppointment(toggler ? appointments : "****");
  }, [toggler]);

  const handleHealthcareHistoryClick = () => {
    if (healthcareHistoryRef) {
      healthcareHistoryRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const appointmentButtonClick = () => {
    router.push(appointmentLink);
  };

  return (
    <section
      className={`neu-card transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 cursor-pointer ${className}`}
    >
      <section className="header flex items-center justify-between mb-4">
        <section className="first flex items-center gap-x-2">
          <p className="neu-text-secondary text-sm font-medium">total appointments</p>
          <button 
            onClick={handleIconClick}
            className="p-1 rounded-lg neu-pressed transition-all duration-200 hover:neu-raised"
          >
            {currentIcon}
          </button>
        </section>
        <button
          className="end flex items-center gap-x-1 neu-text-secondary text-sm font-medium transition-all duration-200 hover:neu-text-primary"
          onClick={handleHealthcareHistoryClick}
        >
          <span>healthcare history</span>
          <MdOutlineKeyboardArrowRight className="w-4 h-4" />
        </button>
      </section>
      
      <h3 className="neu-text-primary text-2xl font-bold mb-6">{totalAppointment || 0}</h3>
      
      <section
        className="w-full flex items-end justify-end"
        onClick={appointmentButtonClick}
      >
        <div className="neu-raised px-6 py-2 text-sm font-medium neu-text-primary rounded-full capitalize transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
          appointment
        </div>
      </section>
    </section>
  );
};

export default DashboardCard;
