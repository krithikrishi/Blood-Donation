import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

const HospitalMap = ({ onHospitalSelected }) => {
  const mapContainerRef = useRef(null);
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [directions, setDirections] = useState(null);
  const [travelInfo, setTravelInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          if (mapRef.current) {
            fetchNearbyHospitals(coords, mapRef.current);
          }
        },
        (error) => {
          console.warn("Geolocation error:", error);
          if (mapRef.current) {
            fetchNearbyHospitals(defaultCenter, mapRef.current);
          }
        }
      );
    } else {
      console.warn("Geolocation not supported");
      if (mapRef.current) {
        fetchNearbyHospitals(defaultCenter, mapRef.current);
      }
    }
  }, []);

  const fetchNearbyHospitals = (location, map) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps library not loaded.");
      return;
    }

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: 5000,
      type: "hospital",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setHospitals(results);
      } else {
        console.error("PlacesService failed:", status);
      }
    });
  };

  const handleHospitalSelect = (hospital) => {
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: userLocation,
        destination: {
          lat: hospital.geometry.location.lat(),
          lng: hospital.geometry.location.lng(),
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          mapContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

          setDirections(result);
          setSelectedHospital(hospital);

          const leg = result.routes[0].legs[0];
          const travelData = {
            distance: leg.distance.text,
            duration: leg.duration.text,
          };
          setTravelInfo(travelData);

          if (onHospitalSelected) {
            onHospitalSelected({
              name: hospital.name,
              address: hospital.vicinity || hospital.formatted_address,
              place_id: hospital.place_id,
              location: hospital.geometry.location,
              ...travelData,
            });
          }
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* 🗺️ Map */}
      <div ref={mapContainerRef} style={{ height: "500px", width: "100%" }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation}
          zoom={14}
          onLoad={(map) => {
            mapRef.current = map;
            fetchNearbyHospitals(userLocation, map);
          }}
        >
          <Marker position={userLocation} label="You" />
          {hospitals.map((hospital, index) => (
            <Marker
              key={index}
              position={{
                lat: hospital.geometry.location.lat(),
                lng: hospital.geometry.location.lng(),
              }}
              title={hospital.name}
              onClick={() => handleHospitalSelect(hospital)}
            />
          ))}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      {/* 🏥 Hospital Sidebar */}
      <div className="w-full lg:w-[300px] bg-white rounded-xl shadow-md p-4 max-h-[500px] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3">Nearby Hospitals</h2>
        {travelInfo && (
          <div className="mt-2 px-2 text-sm text-gray-700">
            <p>
              <strong>Distance:</strong> {travelInfo.distance}
            </p>
            <p>
              <strong>Estimated Time:</strong> {travelInfo.duration}
            </p>
          </div>
        )}
        <input
          type="text"
          placeholder="Search hospital..."
          className="w-full p-2 border rounded-md mb-3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
        <ul className="space-y-2">
          {hospitals
            .filter((h) => h.name.toLowerCase().includes(searchQuery))
            .map((hospital, index) => (
              <li
                key={index}
                onClick={() => handleHospitalSelect(hospital)}
                className={`p-2 rounded-md border cursor-pointer transition-all duration-200 select-none ${
                  selectedHospital?.place_id === hospital.place_id
                    ? "bg-blue-100 border-blue-500 font-bold"
                    : "hover:bg-gray-100 hover:font-semibold"
                }`}
              >
                <div className="w-full">{hospital.name}</div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default HospitalMap;
