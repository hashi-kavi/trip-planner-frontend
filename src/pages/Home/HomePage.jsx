import React, { useEffect, useState } from "react";
import homebg from "../../assets/images/homebg.jpg";
import { useNavigate } from "react-router-dom";
import TripCard from "../../components/trips/TripCard";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:8080/api/trips";

  // Fetch trips for logged-in user
  useEffect(() => {
    if (token) {
      fetchTrips();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchTrips = async () => {
    try {
      const response = await axios.get(API_URL);
      setTrips(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to load trips. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartPlanning = () => {
    if (token) {
      navigate("/plantrip");
    } else {
      navigate("/login");
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      // Add authorization header if token exists
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await axios.delete(`${API_URL}/${id}`, config);
      setTrips(trips.filter((trip) => trip.id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting trip:", err);

      // More specific error messages
      if (err.response?.status === 500) {
        setError("Server error. The trip might have associated data that prevents deletion.");
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError("You don't have permission to delete this trip.");
      } else {
        setError("Failed to delete trip. Please try again.");
      }
    }
  };

  const handleViewTrip = (trip) => {
    navigate(`/tripoverview`, { state: { selectedTrip: trip } });
  };

  const handleEditTrip = (trip) => {
    navigate(`/plantrip/${trip.id}`);
  };

  if (loading) {
    return (
      <section className="p-6 h-screen bg-cover bg-center flex flex-col justify-center items-center" style={{ backgroundImage: `url(${homebg})` }}>
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  return (
    <section
      className="p-6 min-h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${homebg})` }}
    >
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg z-50">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {!token ? (
        <>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg text-center">
            Plan Your Dream Trip on a Budget
          </h1>
          <p className="text-lg text-white mb-6 drop-shadow text-center">
            Track your expenses, organize activities, and stay on budget with ease.
          </p>
          <button
            onClick={handleStartPlanning}
            className="px-8 py-3 bg-infoTeal text-white font-semibold rounded-[25px] hover:bg-secondaryBlue transition shadow-lg"
          >
            Start Planning
          </button>
        </>
      ) : (
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Plan Your Dream Trip on a Budget
            </h1>
            <p className="text-lg text-white mb-6 drop-shadow">
              Track your expenses, organize activities, and stay on budget with ease.
            </p>
            <button
              onClick={handleStartPlanning}
              className="px-6 py-2 bg-primary text-darkNavy font-semibold rounded-[25px] hover:bg-yellow transition mb-8"
            >
              Add New Trip
            </button>
          </div>

          {/* Your Trips Section - Same as TripOverview */}
          <div className="bg-[#0d3b3f]/80 p-6 rounded-xl w-full">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Your Planned Trips
            </h2>

            {/* Cards Grid - Exactly like TripOverview */}
            <div className="flex gap-6 flex-wrap justify-center">
              {trips.length === 0 ? (
                <div className="text-white text-center py-8">
                  <p className="text-lg mb-4">No trips planned yet!</p>
                  <button
                    onClick={handleStartPlanning}
                    className="bg-primary text-darkNavy px-6 py-2 rounded-lg hover:bg-yellow transition"
                  >
                    Plan Your First Trip
                  </button>
                </div>
              ) : (
                trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    title={trip.destination}
                    dates={`${trip.startDate} → ${trip.endDate}`}
                    budget={trip.totalBudget}
                    image={trip.imagePath ? `http://localhost:8080/${trip.imagePath}` : "/default-trip.jpg"}
                    onView={() => handleViewTrip(trip)}
                    onEdit={() => handleEditTrip(trip)}
                    onDelete={() => {
                      if (window.confirm(`Are you sure you want to delete your trip to ${trip.destination}?`)) {
                        handleDeleteTrip(trip.id);
                      }
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;