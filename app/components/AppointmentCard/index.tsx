import { formatDateTime } from "@/app/helpers";
import {
  useGetHospitalByIdQuery,
  useGetUserByIdQuery,
  useCancelAppointmentMutation,
} from "@/app/store/slices/user.slice";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCameraVideo } from "react-icons/bs";
import { LuTimer } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../Button";
import Text from "../Text";
import toast from "react-hot-toast";

export interface AppointmentCardProps {
  className?: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  _id: string;
  createdAt: Date;
  userType: "user" | "hospital";
  patientName?: string;
  onCancelled?: (id: string) => void;
}

interface AppointmentLabelProps {
  className?: string;
  attender: string;
  createdAt: Date;
  status: "pending" | "failed" | "success";
  _id: string;
  href: string;
  userType: "user" | "hospital";
}

const ApppointmentCard = ({
  className,
  title,
  startDate,
  description,
  endDate,
  _id,
  createdAt,
  userType,
  patientName,
  onCancelled,
}: AppointmentCardProps) => {
  const startFormattedTime = formatDateTime(startDate);
  const endFormattedTime = formatDateTime(endDate);

  const router = useRouter();
  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();
  const [isCancelled, setIsCancelled] = useState(false);

  const appointmentLink = `/${userType}/appointments/${_id}`;

  const handleCancelClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to details page
    
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    // Immediately show cancelled state
    setIsCancelled(true);

    try {
      const response: any = await cancelAppointment({ id: _id }).unwrap();
      toast.success(response?.data?.message || "Appointment cancelled successfully");
      // Reload after showing cancelled state
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      // Even on error, keep the blurred state and show error message
      toast.error(error?.data?.message || error?.message || "Failed to cancel appointment");
      // Still reload to refresh the list
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  // Extract patient name from title or description
  const extractedPatientName = patientName || 
    (title?.includes(' - ') ? title.split(' - ')[1] : null) ||
    (description?.includes('Patient: ') ? description.split('Patient: ')[1]?.split(' |')[0] : null);

  // If cancelled, show cancelled state briefly before removal
  if (isCancelled) {
    return (
      <section
        className="appointment-one bg-gray-100 rounded p-3 w-full md:w-96 my-2 opacity-50 relative"
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-60 rounded flex items-center justify-center">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-green-600 font-bold text-lg mb-1">✓ Cancelled</div>
            <Text className="text-sm text-gray-600">Appointment has been cancelled</Text>
          </div>
        </div>
        <h3 className="text-[18px] capitalize font-bold my-2 blur-sm">
          {title}
        </h3>
        <Text className="text-sm text-slate-700 blur-sm">
          {startFormattedTime.dateMonthYear}
        </Text>
        <Text className="text-sm my-3 md:my-2 blur-sm">{description}</Text>
      </section>
    );
  }

  return (
    <section
      className="appointment-one bg-gray-100 rounded p-3 w-full md:w-96 my-2"
    >
      <h3 className="text-[18px] capitalize font-bold my-2 flex items-center justify-between">
        {title}{" "}
        <div className="text-[13px] capitalize flex items-center  gap-x-1">
          <LuTimer className="w-5 h-5" />
          {moment(new Date(createdAt)).startOf("seconds").fromNow()}
        </div>
      </h3>
      
      {extractedPatientName && userType === "hospital" && (
        <div className="flex items-center gap-2 mb-2 bg-blue-50 p-2 rounded-lg">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {extractedPatientName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <Text className="text-xs text-gray-500">Patient</Text>
            <Text className="text-sm font-semibold text-gray-900">{extractedPatientName}</Text>
          </div>
        </div>
      )}
      
      <Text className="text-sm text-slate-700">
        {startFormattedTime.dateMonthYear} ({startFormattedTime.hoursAndMinutes}
        {" - "} {endFormattedTime.hoursAndMinutes})
      </Text>

      <Text className="text-sm my-3 md:my-2">{description}</Text>

      <section className="button-container my-2 mt-3">
        <button
          onClick={handleCancelClick}
          disabled={isCancelling}
          className="w-full px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <AiOutlineClose className="w-4 h-4" />
          {isCancelling ? "Cancelling..." : "Cancel Appointment"}
        </button>
      </section>
    </section>
  );
};

const AppointmentLabel = ({
  className,
  status,
  createdAt,
  attender,
  href,
  userType,
}: AppointmentLabelProps) => {
  let defaultStatus = (
    <section className="status-badge text-black rounded bg-purple-300 flex items-center justify-center h-5 w-20">
      <Text className="text-[12px] font-bold">loading</Text>
    </section>
  );

  const formattedDate = formatDateTime(createdAt);

  switch (status) {
    case "pending":
      defaultStatus = (
        <section className="status-badge text-black rounded bg-yellow-300 flex items-center justify-center h-5 w-20">
          <Text className="text-[12px] font-bold">pending</Text>
        </section>
      );
      break;
    case "success":
      defaultStatus = (
        <section className="status-badge text-black rounded bg-green-300 flex items-center justify-center h-5 w-20">
          <Text className="text-[12px] font-bold">success</Text>
        </section>
      );
      break;
    case "failed":
      defaultStatus = (
        <section className="status-badge  text-black rounded bg-red-400 flex items-center justify-center h-5 w-20">
          <Text className="text-[12px] font-bold">failed</Text>
        </section>
      );
      break;
    default:
      defaultStatus = defaultStatus;
  }

  const dataRequest =
    userType == "user"
      ? useGetUserByIdQuery(attender)
      : useGetHospitalByIdQuery(attender);
  const { data } = dataRequest;
  const [attenderName, setAttenderName] = useState<string>("");

  useEffect(() => {
    setAttenderName(data?.data.username!);
  }, [dataRequest]);

  return (
    <Link href={href}>
      <section
        className={`appointment bg-gray-100 transition-colors ease-in hover:bg-purple-100 flex items-center justify-between p-4 rounded cursor-pointer my-4 ${className}`}
      >
        <section className="icon bg-accent text-white p-3 flex items-center justify-center rounded">
          <BsCameraVideo className="w-6 h-6" />
        </section>

        <section className="other-content w-11/12 flex items-center justify-around">
          <Text className="text-sm">{formattedDate.formattedDate}</Text>
          <Text className="text-sm font-bold" noCapitalize={true}>
            @{attenderName?.length > 12 ? attenderName?.substring(0, 12) + "..." : attenderName }
          </Text>
          <section className="status-badge text-black rounded bg-green-300 flex items-center justify-center h-5 w-20">
            {defaultStatus}
          </section>
        </section>
      </section>
    </Link>
  );
};

export { AppointmentLabel, ApppointmentCard };
