"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface Hospital {
  _id: string;
  clinicName: string;
  location?: string;
  isVerified: boolean;
  website?: string;
}

interface HospitalMapProps {
  hospitals: Hospital[];
  userLocation: { lat: number; lng: number };
  onClose: () => void;
}

// Inner Map Component that handles the actual map rendering
const MapContent = ({ hospitals, userLocation, L }: { hospitals: Hospital[], userLocation: { lat: number; lng: number }, L: any }) => {
  // Fix for default marker icons in Leaflet
  const createCustomIcon = (isUser: boolean = false) => {
    if (!L) return null;
    
    return L.divIcon({
      className: 'custom-icon',
      html: isUser 
        ? `<div style="background: #2563eb; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <svg style="width: 24px; height: 24px; color: white;" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>`
        : `<div style="background: #ef4444; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 9h-4v4h-4v-4H6v-4h4V4h4v4h4v4z"/>
            </svg>
          </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  };

  // Generate nearby positions for hospitals
  const getHospitalPosition = (index: number) => {
    const angle = (index * 40) * (Math.PI / 180);
    const distance = 0.02 + (index % 3) * 0.015; // Approximately 2-5 km
    return {
      lat: userLocation.lat + distance * Math.cos(angle),
      lng: userLocation.lng + distance * Math.sin(angle),
    };
  };

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User Location Marker */}
      <Marker
        position={[userLocation.lat, userLocation.lng]}
        icon={createCustomIcon(true)}
      >
        <Popup>
          <div className="text-center">
            <p className="font-bold text-blue-600">You are here</p>
            <p className="text-xs text-gray-600">Current Location</p>
          </div>
        </Popup>
      </Marker>

      {/* Hospital Markers */}
      {hospitals.map((hospital, index) => {
        const position = getHospitalPosition(index);
        const distance = (Math.random() * 4 + 1).toFixed(1); // Mock distance

        return (
          <Marker
            key={hospital._id}
            position={[position.lat, position.lng]}
            icon={createCustomIcon(false)}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h4 className="font-bold text-gray-800 mb-1">{hospital.clinicName}</h4>
                <p className="text-xs text-gray-600 mb-2">
                  {hospital.location || 'Location not specified'}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-blue-600 font-semibold">~{distance} km away</span>
                  {hospital.isVerified && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      Verified
                    </span>
                  )}
                </div>
                <a
                  href={`/user/search/${hospital._id}`}
                  className="block text-xs bg-blue-600 text-white text-center py-1.5 rounded hover:bg-blue-700 transition-colors"
                >
                  View Details
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

const HospitalMap: React.FC<HospitalMapProps> = ({ hospitals, userLocation, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);
  const [shouldRenderMap, setShouldRenderMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const mapIdRef = useRef(`map-${Math.random().toString(36).substring(7)}-${Date.now()}`);

  useEffect(() => {
    // Only initialize once
    if (hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    setIsMounted(true);
    
    // Dynamically import Leaflet only on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        setShouldRenderMap(true);
      }, 100);
    });

    return () => {
      // Cleanup on unmount
      setShouldRenderMap(false);
      hasInitializedRef.current = false;
    };
  }, []);

  if (!isMounted || !L || !shouldRenderMap) {
    return (
      <section className="map-section mb-4 md:mb-8 animate-fadeIn">
        <div className="neu-card rounded-2xl md:rounded-3xl overflow-hidden p-6 md:p-8 text-center">
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-1 md:mb-2">Loading Map...</h3>
              <p className="text-sm md:text-base text-gray-600">Please wait while we prepare the map</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="map-section mb-4 md:mb-8 animate-fadeIn">
      <div className="neu-card rounded-2xl md:rounded-3xl overflow-hidden">
        {/* Map Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 md:p-4 text-white relative">
          <h3 className="font-bold text-lg md:text-xl flex items-center gap-2 pr-10">
            <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">Nearby Hospitals Map</span>
          </h3>
          <p className="text-xs md:text-sm text-blue-100 mt-1 truncate">
            Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 md:top-4 right-3 md:right-4 bg-white/20 hover:bg-white/30 rounded-full p-1.5 md:p-2 transition-colors"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Real Map - Only render when ready */}
        <div id={mapIdRef.current} className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] z-0">
          <MapContent hospitals={hospitals} userLocation={userLocation} L={L} />

          {/* Map Legend */}
          <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-white rounded-lg shadow-lg p-2 md:p-3 text-xs z-[1000]">
            <h4 className="font-bold text-gray-800 mb-1 md:mb-2 text-xs">Legend</h4>
            <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-600 rounded-full border-2 border-white flex-shrink-0"></div>
              <span className="text-gray-700 text-xs">You</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full border-2 border-white flex-shrink-0"></div>
              <span className="text-gray-700 text-xs">Hospital</span>
            </div>
          </div>
        </div>

        {/* Nearby Hospitals List */}
        <div className="p-3 md:p-4 bg-white border-t">
          <h4 className="font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Hospitals Near You ({hospitals.length})</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 max-h-48 md:max-h-64 overflow-y-auto">
            {hospitals.map((hospital, index) => (
              <a
                key={hospital._id}
                href={`/user/search/${hospital._id}`}
                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-blue-50 transition-colors border border-gray-100"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 9h-4v4h-4v-4H6v-4h4V4h4v4h4v4z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-xs md:text-sm text-gray-800 truncate">{hospital.clinicName}</h5>
                  <p className="text-xs text-gray-600 truncate hidden sm:block">{hospital.location || 'Location not specified'}</p>
                  <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                    <span className="text-xs text-blue-600 font-medium">~{(Math.random() * 4 + 1).toFixed(1)} km</span>
                    {hospital.isVerified && (
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    )}
                  </div>
                </div>
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HospitalMap;
