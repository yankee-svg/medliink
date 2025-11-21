import {
  healthCareHistoryProps,
  useGetHospitalByIdQuery,
  useGetUserByIdQuery,
} from "@/app/store/slices/user.slice";
import moment from "moment";
import Link from "next/link";
import { HiOutlineShieldCheck, HiUserGroup, HiTrendingUp, HiOutlineHeart, HiClock, HiCheckCircle } from "react-icons/hi";
import { LuTimer, LuActivity, LuCalendarDays, LuUsers } from "react-icons/lu";
import Text from "../Text";

interface HealthCareHistoryCardProps extends healthCareHistoryProps {
  className?: string;
  userType: "user" | "hospital";
}

// Healthcare Statistics Card Component with Background Images
const HealthcareStatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend, 
  color = "blue",
  backgroundImage,
  iconBg = "bg-white"
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  color?: "blue" | "green" | "purple" | "orange" | "red";
  backgroundImage?: string;
  iconBg?: string;
}) => {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200",
    green: "from-green-50 to-green-100 border-green-200", 
    purple: "from-purple-50 to-purple-100 border-purple-200",
    orange: "from-orange-50 to-orange-100 border-orange-200",
    red: "from-red-50 to-red-100 border-red-200",
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600", 
    neutral: "text-gray-600",
  };

  return (
    <div className={`
      ${colorClasses[color]} 
      bg-gradient-to-br border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer 
      relative overflow-hidden h-60 min-h-[240px] group
      ${backgroundImage ? 'bg-cover bg-center bg-no-repeat' : ''}
    `}
    style={backgroundImage ? {
      backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : {}}
    >
      {/* Background Image Overlay */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 opacity-15 group-hover:opacity-10 transition-opacity duration-300 blur-sm"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(4px)'
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Icon positioned at top-right corner */}
        <div className="absolute top-0 right-0">
          <div className={`${iconBg} p-3 rounded-xl shadow-lg border opacity-95 flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        
        {/* Change indicator at top-left */}
        {change && (
          <div className={`text-sm font-medium flex items-center ${trendColors[trend || 'neutral']} bg-white/90 px-3 py-1 rounded-full border mb-4 w-fit`}>
            <HiTrendingUp className={`w-4 h-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
            {change}
          </div>
        )}
        
        {/* Value and Title at bottom */}
        <div className="mt-auto text-left">
          <h3 className="text-4xl font-bold text-gray-900 mb-2">{value}</h3>
          <p className="text-xl font-semibold text-gray-800">{title}</p>
        </div>
      </div>
    </div>
  );
};

// Recent Activities Component (Original)
const RecentActivities = ({ activities }: { activities: any[] }) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <LuActivity className="w-5 h-5 mr-2 text-blue-600" />
          Recent Activities
        </h3>
        <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <HiCheckCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 font-medium">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Health Metrics Progress Card (Original)
const HealthMetricsCard = ({ metrics }: { metrics: any[] }) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <HiOutlineHeart className="w-5 h-5 mr-2 text-red-600" />
        Health Metrics
      </h3>
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{metric.label}</span>
              <span className="text-sm text-gray-500">{metric.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${metric.color}`}
                style={{ width: `${metric.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HealthCareHistoryCard = ({
  className,
  attender,
  createdAt,
  href,
  userType,
}: HealthCareHistoryCardProps) => {
  // Call hooks at the top level
  const { data: userData, isLoading: userLoading } = useGetUserByIdQuery(attender, {
    skip: userType !== "user",
  });
  
  const { data: hospitalData, isLoading: hospitalLoading } = useGetHospitalByIdQuery(attender, {
    skip: userType !== "hospital",
  });

  // Determine attender name based on userType
  const attenderName = userType === "user" 
    ? userData?.data?.username 
    : hospitalData?.data?.username;

  return (
    <Link href={href}>
      <section className={`appointment bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 transition-all duration-300 ease-in hover:shadow-lg hover:from-blue-100 hover:to-purple-100 flex items-center justify-between p-4 rounded-xl cursor-pointer my-4 ${className}`}>
        <section className="icon bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 flex items-center justify-center rounded-lg shadow-md">
          <HiOutlineShieldCheck className="w-6 h-6" />
        </section>
        <section className="other-content w-11/12 flex items-center justify-between">
          <Text className="text-sm font-semibold text-gray-800" noCapitalize={true}>
            @{attenderName}
          </Text>
          <div className="text-[13px] text-gray-600 flex items-center gap-x-1 bg-white px-3 py-1 rounded-full border">
            <LuTimer className="w-4 h-4" />
            {moment(new Date(createdAt)).startOf("seconds").fromNow()}
          </div>
        </section>
      </section>
    </Link>
  );
};

// Enhanced Healthcare History Dashboard
const HealthcareHistoryDashboard = ({ 
  userType, 
  totalPatients = 1247, 
  todayAppointments = 23, 
  successRate = 94.2, 
  avgWaitTime = 12,
  recentActivities = [
    { title: "New Patient Registration", description: "John Doe registered for consultation", time: "2 minutes ago" },
    { title: "Appointment Completed", description: "Dr. Smith completed consultation with patient", time: "15 minutes ago" },
    { title: "Lab Results Available", description: "Blood test results uploaded for patient ID #1234", time: "1 hour ago" },
    { title: "Prescription Updated", description: "Medication dosage adjusted for patient care", time: "2 hours ago" },
  ],
  healthMetrics = [
    { label: "Patient Satisfaction", value: "96%", percentage: 96, color: "bg-green-500" },
    { label: "Treatment Success Rate", value: "94%", percentage: 94, color: "bg-blue-500" },
    { label: "Emergency Response Time", value: "87%", percentage: 87, color: "bg-purple-500" },
    { label: "Staff Performance", value: "92%", percentage: 92, color: "bg-orange-500" },
  ]
}: {
  userType: "user" | "hospital";
  totalPatients?: number;
  todayAppointments?: number;
  successRate?: number;
  avgWaitTime?: number;
  recentActivities?: any[];
  healthMetrics?: any[];
}) => {
  return (
    <div className="space-y-8">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <HealthcareStatCard
          title="Total Patients"
          value={totalPatients.toLocaleString()}
          change="+12% from last month"
          trend="up"
          icon={<HiUserGroup className="w-8 h-8 text-blue-600" />}
          color="blue"
          iconBg="bg-white"
        />
        <HealthcareStatCard
          title="Today's Appointments"
          value={todayAppointments}
          change="+3 from yesterday"
          trend="up"
          icon={<LuCalendarDays className="w-8 h-8 text-green-600" />}
          color="green"
          backgroundImage="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          iconBg="bg-white/90"
        />
        <HealthcareStatCard
          title="Success Rate"
          value={`${successRate}%`}
          change="+2.1% improvement"
          trend="up"
          icon={<HiCheckCircle className="w-8 h-8 text-purple-600" />}
          color="purple"
          backgroundImage="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          iconBg="bg-white/90"
        />
        <HealthcareStatCard
          title="Avg Wait Time"
          value={`${avgWaitTime} min`}
          change="-3 min reduction"
          trend="down"
          icon={<LuTimer className="w-8 h-8 text-orange-600" />}
          color="orange"
          iconBg="bg-white"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <RecentActivities activities={recentActivities} />
        
        {/* Health Metrics */}
        <HealthMetricsCard metrics={healthMetrics} />
      </div>

      {/* Healthcare History Timeline */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <HiClock className="w-5 h-5 mr-2 text-blue-600" />
          Recent Healthcare History
        </h3>
        <div className="space-y-4">
          <HealthCareHistoryCard 
            _id="123"
            attender="dr_smith" 
            createdAt={new Date()} 
            href="/appointments/123" 
            userType={userType}
          />
          <HealthCareHistoryCard 
            _id="124"
            attender="dr_johnson" 
            createdAt={new Date(Date.now() - 86400000)} 
            href="/appointments/124" 
            userType={userType}
          />
          <HealthCareHistoryCard 
            _id="125"
            attender="dr_williams" 
            createdAt={new Date(Date.now() - 172800000)} 
            href="/appointments/125" 
            userType={userType}
          />
        </div>
      </div>
    </div>
  );
};

export { HealthCareHistoryCard, HealthcareHistoryDashboard };
