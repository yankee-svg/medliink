import { useGetHospitalRatingQuery } from "@/app/store/slices/user.slice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { HiExternalLink } from "react-icons/hi";
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
}: HospitalCardProps) => {
  const stars = Array(5).fill(null);
  const [rating, setRating] = useState(0);

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
    // If website exists, redirect to website instead of profile page
    if (website) {
      e.preventDefault();
      const url = website.startsWith('http') ? website : `https://${website}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Link href={href} onClick={handleCardClick}>
      <div className={`neu-card-small transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 cursor-pointer group ${className} relative`}>
        {website && (
          <div className="absolute top-3 right-3">
            <div className="p-1.5 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200">
              <HiExternalLink className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </div>
        )}
        
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
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
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
