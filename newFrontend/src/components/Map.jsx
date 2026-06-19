/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import locationservice from "../backend/location.config.js";
import guardService from "../backend/guard.config.js";
import otherServices from "../backend/others.config.js";
// Define custom icon for assigned trucks
const guardIcon = new L.Icon({
  iconUrl: "/policeman.png", // Example truck icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

// Clickable Marker Component
function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      // console.log("Clicked Location:", lat, lng);
      onLocationSelect(lat, lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        📍 Latitude: {position[0]}, Longitude: {position[1]}
      </Popup>
    </Marker>
  );
}

// Update map view dynamically
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 25);
    }
  }, [center, map]);
  return null;
}

function Map() {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [loading, setLoading] = useState(false);
  const [guards, setGuards] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [assignedGuards, setAssignedGuards] = useState([]);
  const [duration, setDuration] = useState(6);
  const [from, setFrom] = useState("");
  const [ratings, setRatings] = useState([]);
  useEffect(() => {
    guardService
      .ListUnassignedGuard()
      .then((res) => {
        const validGuards = res?.data?.data;
        setGuards(validGuards);
        // console.log("Guards Data:", validGuards);
      })
      .catch((error) => console.error("Error fetching trucks:", error));

    guardService
      .ListAssignedGuards()
      .then((res) => {
        setAssignedGuards(res.data.data);

        if (res.data.data?.length > 0) {
          setMapCenter([res.data.data[0].latitude, res.data.data[0].longitude]);
        }
      })
      .catch((error) => {
        console.error("Error fetching assigned trucks:", error);
      });

    otherServices.getratings().then((res) => {
      setRatings(res.data.data);
      console.log(res.data.data);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const curTime = new Date(Date.now()).toISOString();

      assignedGuards.forEach((assigned) => {
        const { to, _id } = assigned;

        const shiftOver = to === curTime;
        if (shiftOver) {
          locationservice
            .removeAssignment({ assignmentId: _id })
            .then(() => {
              console.log("Assignment Removed");
            })
            .catch((err) => {
              console.error("Error:", err);
            });
        }
      });
    }, 300000);

    return () => clearInterval(interval);
  });

  const handleFinalSubmit = () => {
    if (!selectedLocation || !selectedGuard) {
      alert("Please select a location and a truck first.");
      return;
    }

    const now = new Date(); // Get current time
    const from = now.toISOString(); // Convert to UTC format

    const to = new Date(
      now.getTime() + duration * 60 * 60 * 1000
    ).toISOString();

    console.log("Final Submission:", {
      selectedLocation,
      selectedGuard,
      from,
      to,
      duration,
    });

    locationservice
      .addAssignment({
        guardId: selectedGuard._id,
        latitude: selectedLocation[0],
        longitude: selectedLocation[1],
        from,
        to,
        duration,
      })
      .then(() => {
        console.log("Assignment Added");
        window.location.reload();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const handleUnassignMent = (e) => {
    const eid = e.currentTarget.id;
    locationservice
      .removeAssignment({ assignmentId: e.currentTarget.id })
      .then(() => {
        console.log("Assignment Removed");
        setAssignedGuards(() => {
          return assignedGuards.filter((assignment) => {
            return assignment?._id !== eid;
          });
        });
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handleLocationSearch = async (locationName) => {
    try {
      setLoading(true);
      const res = await locationservice.getLocationCoordinates({
        location: locationName,
      });
      if (res?.data?.data) {
        console.log("res", res.data.data);
        const { latitude, longitude } = res.data.data;
        setMapCenter([parseFloat(latitude), parseFloat(longitude)]);
        console.log("Updated Map Center:", latitude, longitude);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    try {
      const res = await locationservice.checkAvailability(selectedGuard._id);
      console.log(res);
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };

  return (
    <div className="flex items-center w-full min-h-screen gap-10 bg-black py-6 px-16">
      <div className=" w-[60vw] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          📍 Location Tracker
        </h1>

        <div className="flex w-3/4 max-w-md mb-4">
          <input
            type="text"
            placeholder="Enter location..."
            // onBlur={(e) => handleLocationSearch(e.target.value)}
            className="flex-1 p-2  rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() =>
              handleLocationSearch(document.querySelector("input").value)
            }
            className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
          >
            🔍 Search
          </button>
        </div>
        {loading && (
          <p className="text-blue-600 font-semibold">⏳ Fetching location...</p>
        )}
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg brightness-90">
          <MapContainer center={mapCenter} zoom={35} className="h-full w-full">
            <ChangeView center={mapCenter} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* User Clickable Marker */}
            <LocationMarker
              onLocationSelect={(lat, lng) => setSelectedLocation([lat, lng])}
            />
            {/* Assigned Trucks Markers */}
            {assignedGuards.map((guard) => (
              <Marker
                key={guard.guardDetails._id}
                position={[guard.latitude, guard.longitude]}
                icon={guardIcon}
              >
                <Popup
                  id={guard.guardDetails._id}
                  // onClick={console.log(guard.guardDetails._id)}
                >
                  🛡️ {guard.guardDetails.fullName} <br />
                  ✉️ {guard.guardDetails.email} <br />
                  📍 {guard.latitude}, {guard.longitude}
                  <button id={guard._id} onClick={handleUnassignMent}>
                    Remove
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* List of Trucks */}
      <div className=" w-[40vw] flex flex-col justify-center items-center ">
        <div className="w-full max-w-md mt-4  rounded-lg shadow-lg overflow-hidden ">
          <h2 className="text-lg font-semibold mb-2 bg-amber-400">
            🛡️ Assign Trucks
          </h2>
          <ul className="hover:*:hover:opacity-100 hover:*:hover:scale-105 transition-all duration-500 *:opacity-75 ">
            {guards.map((guard) => (
              <li
                key={guard._id}
                className={`p-2 px-4 transition-all flex justify-between duration-500 cursor-pointer border-b hover:bg-black ${
                  selectedGuard?.id === guard.id ? "bg-white/30" : ""
                }`}
                onClick={() => setSelectedGuard(guard)}
              >
                <div>
                  {guard.fullName} ({guard.email})
                </div>
                <div>
                  {ratings.map((rating) => {
                    if (rating.guard_id.toString() === guard._id.toString()) {
                      console.log(rating.predicted_rating);

                      return rating.predicted_rating.toFixed(2);
                    }
                  })}
                  {/* 67af390b6188073298ad3343 */}
                </div>
                {/* //add a star here */}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center mt-4 p-2 gap-4 w-md bg-black/80 rounded-lg">
          <div className="w-full max-w-md rounded-lg shadow-lg p-2 text-xs font-bold">
            <label>From Time : </label>
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-8 p-2 border border-gray-300 rounded-lg mb-2"
            />
            <br />
            <label>Duration (in hours) : </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-8 w-20 p-2 border border-gray-300 rounded-lg mb-2"
            />
          </div>
          <button
            className="bg-green-600 w-40 text-white rounded-lg hover:bg-green-700"
            onClick={handleFinalSubmit}
          >
            ✅  Submit
          </button>
        </div>

        <div className="w-full max-w-md my-8 rounded-lg shadow-lg overflow-hidden">
          <h2 className="text-lg font-semibold mb-2 bg-amber-400">
            🛡️ Assigned Trucks
          </h2>
          <ul className="*:flex *:justify-between *:items-center *:w-full">
            {assignedGuards.map((guard) => (
              <li key={guard.guardDetails._id} className="p-2 border-b">
                {guard.guardDetails.fullName} ({guard.guardDetails.email})
                <button
                  id={guard._id}
                  onClick={handleUnassignMent}
                  className="ml-4 px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  ❌ Unassign
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Map;
