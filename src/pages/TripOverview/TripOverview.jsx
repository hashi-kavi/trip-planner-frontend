import React, { useState, useEffect, useMemo } from "react";
import { RiDeleteBin6Line, RiEditLine, RiAddFill } from "react-icons/ri";
import TripCard from "../../components/trips/TripCard";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const TripOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8080/api/trips";
  const ACTIVITIES_API = "http://localhost:8080/api/activities";

  // Initialize selectedTrip from location state or null
  useEffect(() => {
    if (location.state?.selectedTrip) {
      setSelectedTrip(location.state.selectedTrip);
    }
  }, [location.state]);

  // Fetch trips
  useEffect(() => {
    fetchTrips();
  }, []);

  // Fetch activities when a trip is selected
  useEffect(() => {
    if (selectedTrip?.id) {
      fetchActivities(selectedTrip.id);
    } else {
      setActivities([]); // Clear activities when no trip is selected
    }
  }, [selectedTrip]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTrips(response.data);
    } catch (err) {
      setError("Failed to load trips");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const fetchActivities = async (tripId) => {
  try {
    const response = await axios.get(`${ACTIVITIES_API}/trip/${tripId}`);
    const activityData = response.data || [];
    setActivities(activityData);

    // recalc spent from activities
    const totalSpent = activityData.reduce((sum, act) => sum + (act.cost || 0), 0);

    // update trips array so All Trips page stays correct
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, spent: totalSpent } : t))
    );

    // update only the spent in selectedTrip (keep other fields intact)
    setSelectedTrip((prev) => (prev && prev.id === tripId ? { ...prev, spent: totalSpent } : prev));
  } catch (err) {
    console.error("Error fetching activities:", err);
    setActivities([]);
  }
};


  const handleAddActivity = () => {
    navigate("/addactivity", { state: { trip: selectedTrip } });
  };

  const handleEditActivity = (activity) => {
    navigate("/editactivity", { state: { trip: selectedTrip, activityToEdit: activity } });
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await axios.delete(`${API_URL}/${tripId}`);
      setTrips(trips.filter(trip => trip.id !== tripId));
      if (selectedTrip?.id === tripId) {
        setSelectedTrip(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete trip");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    try {
      await axios.delete(`${ACTIVITIES_API}/${activityId}`);
      fetchActivities(selectedTrip.id);

      // Also refresh the trip to update spent amount
      const tripResponse = await axios.get(`${API_URL}/${selectedTrip.id}`);
      setSelectedTrip(tripResponse.data);
    } catch (err) {
      console.error(err);
      alert("Failed to delete activity");
    }
  };

  const handleBack = () => {
    setSelectedTrip(null);
    setActivities([]);   // optional: clear activities when leaving
    navigate("/tripoverview");
  };

  // Group activities by date
  const activitiesByDate = useMemo(() => {
    const grouped = {};
    activities.forEach((activity) => {
      const date = activity.date || "No Date";
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(activity);
    });
    return grouped;
  }, [activities]);

  // Use the spent amount from the API, not local calculation
  const totalSpent = selectedTrip?.spent || 0;
  const totalBudget = selectedTrip?.totalBudget || 0;
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;

  if (loading) return <div className="bg-infoTeal min-h-screen p-6 flex items-center justify-center text-white text-xl">Loading trips...</div>;
  if (error) return <div className="bg-infoTeal min-h-screen p-6 flex items-center justify-center text-white text-xl">{error}</div>;

  return (
    <div className="bg-infoTeal min-h-screen p-6">
      {!selectedTrip ? (
        // TRIP LIST VIEW
        <div>
          <h1 className="text-3xl font-bold text-white mb-6">All Trips</h1>
          <div className="mt-12 bg-[#0d3b3f]/80 p-6 rounded-xl w-full max-w-5xl">
            <h1 className="text-2xl font-bold text-white mb-6">Your Planned Trips</h1>
            <div className="flex gap-6 flex-wrap justify-center overflow-y-auto max-h-[400px]">
              {trips.length === 0 ? (
                <div className="text-white text-center py-8">
                  <p className="text-lg mb-4">No trips planned yet!</p>
                  <button onClick={() => navigate("/plantrip")} className="bg-primary text-darkNavy px-6 py-2 rounded-lg hover:bg-yellow transition">
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
                    onView={() => setSelectedTrip(trip)}
                    onEdit={() => navigate(`/plantrip/${trip.id}`)}
                    onDelete={() => handleDeleteTrip(trip.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        // TRIP DETAIL VIEW
        <div className="text-white max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-6 bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            ← Back to All Trips
          </button>

          <div className="bg-white text-darkNavy rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{selectedTrip.destination}</h1>
            <p className="text-gray-600 mb-4">{selectedTrip.startDate} → {selectedTrip.endDate}</p>

            {/* Budget Summary */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Total Budget: Rs. {totalBudget.toLocaleString()}</span>
                <span className="font-semibold text-primary">Spent: Rs. {totalSpent.toLocaleString()}</span>
                <span className="font-semibold text-green-600">Remaining: Rs. {remaining.toLocaleString()}</span>
              </div>
              <div className="bg-gray-300 h-4 w-full rounded-full mb-2">
                <div
                  className="bg-primary h-4 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 text-center">
                {Math.round(percentage)}% of budget used
              </div>
            </div>

            {/* Activities Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Activities</h2>

              {activities.length === 0 ? (
                <div className="text-center py-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-500 mb-4">No activities added yet</p>
                  <button
                    onClick={handleAddActivity}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-yellow transition"
                  >
                    <RiAddFill className="inline mr-2" /> Add Your First Activity
                  </button>
                </div>
              ) : (
                <>
                  {Object.entries(activitiesByDate).map(([date, dateActivities]) => (
                    <div key={date} className="mb-6 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-bold mb-3 bg-gray-100 p-2 rounded">
                        {date === 'No Date' ? 'Activities' : `Date: ${date}`}
                      </h3>

                      {dateActivities.map((activity) => (
                        <div key={activity.id} className="flex justify-between items-center bg-gray-50 p-3 rounded mb-2">
                          <div className="flex-1">
                            <div className="font-medium">{activity.name}</div>
                            {activity.location && (
                              <div className="text-sm text-gray-600">Location: {activity.location}</div>
                            )}
                            {activity.notes && (
                              <div className="text-sm text-gray-500 mt-1">{activity.notes}</div>
                            )}
                            {activity.time && (
                              <div className="text-xs text-gray-400 mt-1">Time: {activity.time}</div>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-primary">
                              Rs. {activity.cost?.toLocaleString()}
                            </span>
                            <button
                              onClick={() => handleEditActivity(activity)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="Edit activity"
                            >
                              <RiEditLine size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteActivity(activity.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete activity"
                            >
                              <RiDeleteBin6Line size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="text-center mt-6">
                    <button
                      onClick={handleAddActivity}
                      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-yellow transition flex items-center justify-center mx-auto"
                    >
                      <RiAddFill className="mr-2" /> Add Another Activity
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripOverview;