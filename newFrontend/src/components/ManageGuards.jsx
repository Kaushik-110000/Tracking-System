import { useEffect, useState } from "react";
import adminservice from "../backend/admin.config";
import errorTeller from "../backend/errorTeller";
import { useNavigate } from "react-router";

function ManageGuards({ darkMode }) {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchGuards = async () => {
      try {
        const guards = await adminservice.getUnauthorisedGuards();
        if (guards) {
          setGuards(guards.data.data);
        }
      } catch (error) {
        setError(errorTeller(error));
      } finally {
        setLoading(false);
      }
    };
    fetchGuards();
  }, []);

  const handleApproval = async (id, isApproved) => {
    try {
      await adminservice.approveRejectGuards(id, isApproved);
      setGuards((prev) => prev.filter((g) => g._id !== id));
    } catch (error) {
      alert("Failed to update truck status");
    }
  };

  return (
    <div
      className={`p-8 min-h-screen transition-all duration-500 ${
        darkMode ? "bg-slate-950 text-white" : "bg-blue-300 text-black"
      }`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center font-serif border-2  p-4 rounded-lg shadow-lg">
        Manage Trucks
      </h2>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#219EBC]"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div
          className={`p-6 rounded-xl shadow-lg transition-all duration-500 ${
            darkMode
              ? "bg-[#023047] text-white border border-[#219EBC]"
              : "bg-white"
          }`}
        >
          {guards.length === 0 ? (
            <p className="text-center text-lg font-semibold">
              No trucks found.
            </p>
          ) : (
            <table className="w-full border-collapse shadow-lg overflow-hidden">
              <thead>
                <tr className="text-left  font-semibold bg-[#219EBC] text-white">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Complains</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guards.map((guard) => (
                  <tr
                    key={guard._id}
                    className="border-b transition-all duration-300 hover:bg-[#8ECAE6]"
                  >
                    <td className="p-4">{guard.fullName}</td>
                    <td className="p-4">{guard.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          guard.isApproved
                            ? "bg-[#FFB703] text-white"
                            : "bg-yellow-500 text-black"
                        }`}
                        id={guard._id}
                        onClick={(e) =>
                          navigate(`/complains/${e.currentTarget.id}`)
                        }
                      >
                        {guard.isApproved ? "Approved" : "View Truck Complains"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        className="px-4 py-2 bg-[#FFB703] text-white rounded-lg shadow-md hover:bg-[#FB8500] transform hover:scale-105 transition-all duration-300 mr-3"
                        onClick={() => handleApproval(guard._id, true)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
                        onClick={() => handleApproval(guard._id, false)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default ManageGuards;
