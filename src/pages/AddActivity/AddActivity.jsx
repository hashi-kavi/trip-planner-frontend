import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AddActivity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trip, activityToEdit } = location.state || {}; // <- activityToEdit

  const [formData, setFormData] = useState({
    name: activityToEdit?.name || "",
    location: activityToEdit?.location || "",
    cost: activityToEdit?.cost || 0,
    notes: activityToEdit?.notes || "",
    date: activityToEdit?.date || "",
    time: activityToEdit?.time || ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if trip is missing
  useEffect(() => {
    if (!trip) navigate("/tripoverview");
  }, [trip, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (activityToEdit) {
        // Edit activity
        await axios.put(`http://localhost:8080/api/activities/${activityToEdit.id}`, {
          ...formData,
          tripId: trip.id
        });
      } else {
        // Add new activity
        await axios.post("http://localhost:8080/api/activities", {
          ...formData,
          tripId: trip.id
        });
      }

      // Navigate back and refresh TripOverview
      navigate("/tripoverview", { state: { selectedTrip: trip, refresh: true } });
    } catch (err) {
      console.error("Failed to save activity:", err);
      setError("Failed to save activity: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/tripoverview", { state: { selectedTrip: trip } });
  };

  return (
    <div className="min-h-screen bg-infoTeal p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-darkNavy mb-4">
          {activityToEdit ? "Edit Activity" : "Add Activity"} for {trip?.destination}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="E.g., Visit Temple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="E.g., Temple of Tooth"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost (Rs.) *</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={trip?.startDate}
              max={trip?.endDate}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be between {trip?.startDate} and {trip?.endDate}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Additional details..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-yellow transition disabled:opacity-50"
            >
              {loading ? "Saving..." : activityToEdit ? "Save Changes" : "Add Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivity;
