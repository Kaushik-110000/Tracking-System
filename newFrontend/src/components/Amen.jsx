import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import livelocservice from "../backend/liveloc.config.js";
import locationservice from "../backend/location.config.js";
import guardService from "../backend/guard.config.js";
const blueIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [30, 30],
});

const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [30, 30],
});
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

function Amen({ locationId, guardId }) {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [assignment, setAssignment] = useState(null);
  const [progress, setProgress] = useState(0);
  const [totalInsideTime, setTotalInsideTime] = useState(0);
  const [totalOutsideTime, setTotalOutsideTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const radius = 65;

  useEffect(() => {
    locationservice.getSingleAssignment(locationId).then((res) => {
      setAssignment(res.data.data);
    });
  }, [locationId]);

  useEffect(() => {
    let interval;
    if (assignment && !isCompleted) {
      getLocation();
      interval = setInterval(getLocation, 60000);
    }
    return () => clearInterval(interval);
  }, [assignment, isCompleted]);

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          sendLocationToServer(latitude, longitude);
          console.log("nav geo", location);
          if (assignment) {
            const inside = checkInsideCircle(
              latitude,
              longitude,
              assignment.latitude,
              assignment.longitude,
              radius
            );
            handleLocationStatus(inside);
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const handleLocationStatus = (inside) => {
    const now = Date.now();
    const fromTime = new Date(assignment.from).getTime();
    const toTime = new Date(assignment.to).getTime();
    console.log("timesss", fromTime, toTime);

    if (now > toTime) return;
    let a = true;
    if (inside) {
      setTotalInsideTime((prev) => prev + 60000);
    } else {
      setTotalOutsideTime((prev) => prev + 60000);
      if (a) {
        handleOut();
        a = false;
      }
    }

    updateProgress();
  };

  const updateProgress = () => {
    const now = Date.now();
    const fromTime = new Date(assignment.from).getTime();
    const toTime = new Date(assignment.to).getTime();

    if (now >= toTime) {
      handleComplete();
      return;
    }
    const totalDuration = toTime - fromTime;
    // console.log("hero", now, fromTime, toTime, totalDuration);

    const currentProgress = ((now - fromTime) / totalDuration) * 100;
    // console.log("hero", currentProgress);
    setProgress(Math.max(currentProgress, 0));
  };

  const handleComplete = () => {
    setIsCompleted(true);
    console.log(`Work completed.`);
  };

  const handleOut = async () => {
    await guardService.lodgeComplaint(guardId, "The truck is outside the zone");
  };

  const checkInsideCircle = (lat1, lon1, lat2, lon2, radius) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) <= radius;
  };

  const sendLocationToServer = async (lat, lng) => {
    try {
      await livelocservice.sendLocation({ latitude: lat, longitude: lng });
    } catch (error) {
      console.error("Error sending location:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 py-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        📍 Live Location Tracker
      </h2>
      <div className="w-3/4 h-[500px] rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={[22.775931, 86.1468165]}
          zoom={15}
          className="h-full w-full"
        >
          <ChangeView
            center={
              location.latitude
                ? [location.latitude, location.longitude]
                : [22.775931, 86.1468165]
            }
          />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {location.latitude && location.longitude && (
            <Marker
              position={[location.latitude, location.longitude]}
              icon={blueIcon}
            >
              <Popup>
                🏃 Your Live Location
                <br />
                📍 {location.latitude}, {location.longitude}
              </Popup>
            </Marker>
          )}
          {assignment && (
            <>
              <Marker
                position={[assignment.latitude, assignment.longitude]}
                icon={redIcon}
              >
                <Popup>
                  🛡️ Assigned Location
                  <br />
                  📍 {assignment.latitude}, {assignment.longitude}
                </Popup>
              </Marker>
              <Circle
                center={[assignment.latitude, assignment.longitude]}
                pathOptions={{
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.3,
                }}
                radius={radius}
              />
            </>
          )}
        </MapContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-gray-700 font-semibold">
          Progress: {progress.toFixed(2)}%
        </p>
        {isCompleted && (
          <p className="text-green-600 font-bold mt-2">
            🎉 Work Completed Successfully!
          </p>
        )}
      </div>
    </div>
  );
}

export default Amen;
