import { useGetHospitalRatingQuery } from "@/app/store/slices/user.slice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { HiExternalLink, HiPhone, HiMail, HiLocationMarker, HiX } from "react-icons/hi";
import Text from "../Text";
import Verified from "../Verified";

interface HospitalCardProps {
  className?: string;
  clinicName: string;
  address: string;
  isVerified: boolean;
  _id: string;
  href: string;
  website?: string;
  email?: string;
  phone?: string;
}

interface UserCardProps {
  className?: string;
  name: string;
  address: string;
  isVerified: boolean;
  _id?: string;
  bio: string;
  href: string;
}

const HospitalCard = ({
  className,
  clinicName,
  address,
  isVerified,
  _id,
  href,
  website,
  email,
  phone,
}: HospitalCardProps) => {
  const stars = Array(5).fill(null);
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const { data } = useGetHospitalRatingQuery(_id);

  useEffect(() => {
    if (data) {
      setRating(data.data.rating);
    }
  }, [data]);

  // map the stars based on the hospital rating
  const starElements = stars.map((_, index) => (
    <React.Fragment key={index}>
      {index < rating ? (
        <BsStarFill className="h-4 w-4 text-yellow-500" />
      ) : (
        <BsStar className="h-4 w-4 opacity-50" />
      )}
    </React.Fragment>
  ));

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className={`neu-card-small transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 cursor-pointer group ${className} relative`}
      >
        <div className="absolute top-3 right-3">
          <div className="p-1.5 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200">
            <HiExternalLink className="w-3.5 h-3.5 text-blue-600" />
          </div>
        </div>
        
        <div className="flex items-start justify-between mb-3 pr-8">
          <h2 className="neu-text-primary font-bold text-lg group-hover:text-primary transition-colors duration-200">
            {clinicName}
          </h2>
          <span className="flex-shrink-0">{isVerified && <Verified />}</span>
        </div>
        
        <Text className="neu-text-secondary text-sm mb-3 line-clamp-2">
          {address}
        </Text>
        
        <div className="flex items-center justify-between">
          <div className="rating flex gap-x-1">
            {starElements}
          </div>
          <span className="neu-text-muted text-xs">
            {(rating || 0).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Contact Info Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiX className="w-6 h-6 text-gray-500" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{clinicName}</h2>
                {isVerified && <Verified big={true} />}
              </div>
              <div className="flex items-center gap-2 text-yellow-500">
                {starElements}
                <span className="text-sm text-gray-600 ml-2">{(rating || 0).toFixed(1)}</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <HiLocationMarker className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="text-sm font-medium text-gray-800">{address}</p>
                </div>
              </div>

              {/* Phone */}
              {phone && (
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <HiPhone className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <a href={`tel:${phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {phone}
                    </a>
                  </div>
                  <a 
                    href={`tel:${phone}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Call Now
                  </a>
                </div>
              )}

              {/* Email */}
              {email && (
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <HiMail className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${email}`} className="text-sm font-medium text-blue-600 hover:underline break-all">
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {/* Website */}
              {website && (
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <HiExternalLink className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Website</p>
                    <a 
                      href={website.startsWith('http') ? website : `https://${website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                  <a 
                    href={website.startsWith('http') ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    Visit
                    <HiExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link href={href}>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg">
                  View Full Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const UserCard = ({
  className,
  name,
  address,
  isVerified,
  _id,
  href,
  bio,
}: UserCardProps) => {
  return (
    <Link href={href}>
      <div className={`neu-card-small transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 cursor-pointer group ${className}`}>
        <div className="flex items-start justify-between mb-3">
          <h2 className="neu-text-primary font-bold text-lg group-hover:text-primary transition-colors duration-200">
            {name}
          </h2>
          <span className="flex-shrink-0">{isVerified && <Verified />}</span>
        </div>
        
        <Text className="neu-text-secondary text-sm mb-2 line-clamp-1">
          {address}
        </Text>
        
        <Text className="neu-text-muted text-sm line-clamp-2">
          {bio}
        </Text>
      </div>
    </Link>
  );
};

export default HospitalCard;
