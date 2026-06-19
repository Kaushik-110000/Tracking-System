import { useState, useEffect } from "react";
import { FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { useNavigate } from "react-router";
import guardService from "../backend/guard.config.js";
import authservice from "../backend/auth.config.js";

function UserDashboard() {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [feedbackType, setFeedbackType] = useState(""); // "complaint" or "appreciation"
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGuards() {
      try {
        const res = await guardService.ListGuard();
        setGuards(res.data.data);
      } catch (err) {
        setError("Failed to fetch trucks");
      } finally {
        setLoading(false);
      }
    }
    fetchGuards();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return alert("Message cannot be empty");
    try {
      if (feedbackType === "complaint") {
        await guardService.lodgeComplaint(selectedGuard, feedback);
      } else {
        await guardService.sendAppreciation(selectedGuard, feedback);
      }
      alert("Feedback submitted successfully");
      setFeedback("");
      setSelectedGuard(null);
    } catch (error) {
      alert("Failed to submit feedback");
    }
  };

  const handleLogout = async () => {
    await authservice.logoutUser();
    navigate("/user/login");
  };

  if (loading) return <p>Loading trucks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className={`p-6 w-screen min-h-screen transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-10">
        <h2 className="text-3xl font-semibold">🚚 Security Trucks</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
          >
            {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 px-4 py-2 text-white rounded-lg hover:bg-red-600 transition"
          >
            <FiLogOut size={20} className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Guard List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guards.map((guard) => (
          <div
            key={guard._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{guard.fullName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {guard.email}
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setSelectedGuard(guard._id);
                  setFeedbackType("complaint");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Lodge Complaint
              </button>
              <button
                onClick={() => {
                  setSelectedGuard(guard._id);
                  setFeedbackType("appreciation");
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Appreciate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      {selectedGuard && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-2">
              {feedbackType === "complaint"
                ? "Lodge a Complaint"
                : "Submit an Appreciation"}
            </h3>
            <textarea
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder={`Enter your ${feedbackType} here...`}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleFeedbackSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Submit
              </button>
              <button
                onClick={() => setSelectedGuard(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
