import { useState, useEffect } from "react";
import ManageGuards from "./ManageGuards.jsx";
import Map from "./Map.jsx";
import {
  FiLogOut,
  FiSun,
  FiMoon,
  FiShield,
  FiBook,
  FiMap,
} from "react-icons/fi";
import authservice from "../backend/auth.config";
import { useNavigate } from "react-router";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("manageGuards");
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authservice.logoutUser();
    navigate("/user/login");
  };

  const handleTakeAdminToUser = async () => {
    const user = await authservice.getCurrentUser();

    if (user.role === "admin") {
      navigate(`/user/u/${user._id}`);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div
      className={`flex w-screen min-h-screen  transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <aside
        className={`w-[20vw] h-screen p-6 flex flex-col gap-4 transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-b from-gray-800 to-gray-900"
            : "bg-gradient-to-b from-blue-800 to-blue-900 text-white"
        } shadow-xl rounded-r-lg`}
      >
        <div>
          {/* Dashboard Logo / Header */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <FiShield size={28} className="text-yellow-500" />
            <h2 className="text-3xl font-extrabold tracking-wide">Admin</h2>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="flex flex-col gap-4 *:text-sm">
              <li
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-lg text-lg font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 ${
                  activeTab === "manageGuards"
                    ? darkMode
                      ? "bg-gray-700 text-white shadow-lg scale-105"
                      : "bg-blue-700 text-white shadow-lg scale-105"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-blue-700 hover:text-white"
                }`}
              >
                {darkMode ? (
                  <FiSun size={20} className=" text-yellow-400" />
                ) : (
                  <FiMoon size={20} className=" text-gray-200" />
                )}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </li>
              <li
                className={`p-3 rounded-lg text-lg font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 ${
                  activeTab === "manageGuards"
                    ? darkMode
                      ? "bg-gray-700 text-white shadow-lg scale-105"
                      : "bg-blue-700 text-white shadow-lg scale-105"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-blue-700 hover:text-white"
                }`}
                onClick={() => setActiveTab("manageGuards")}
              >
                <FiShield size={20} />
                Manage Trucks
              </li>

              <li
                className={`p-3 rounded-lg text-lg font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 ${
                  activeTab === "assignGuards"
                    ? darkMode
                      ? "bg-gray-700 text-white shadow-lg scale-105"
                      : "bg-blue-700 text-white shadow-lg scale-105"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-blue-700 hover:text-white"
                }`}
                onClick={() => setActiveTab("assignGuards")}
              >
                <FiMap size={20} />
                Assign Trucks
              </li>

              <li
                onClick={handleTakeAdminToUser}
                className={`p-3 justify rounded-lg text-lg font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 ${
                  activeTab === ""
                    ? darkMode
                      ? "bg-gray-700 text-white shadow-lg scale-105"
                      : "bg-blue-700 text-white shadow-lg scale-105"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-blue-700 hover:text-white"
                }`}
              >
                <FiBook size={20} />
                User Panel
              </li>
            </ul>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center  space-x-2 w-full py-3 text-lg font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-md"
        >
          <FiLogOut size={22} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1  transition-all duration-300">
        {activeTab === "manageGuards" && <ManageGuards darkMode={darkMode} />}
        {activeTab === "assignGuards" && (
          <div className="w-[80vw]">
            <Map />
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
