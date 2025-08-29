import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api/trips";

const PlanTrip = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trip, setTrip] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    totalBudget: "",
  });
  const [tripImage, setTripImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (mode === "edit" && id) {
      setLoading(true);
      axios.get(`${API_URL}/${id}`)
        .then(res => {
          setTrip(res.data);
          // If there's an existing image, you might want to handle it
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load trip data");
        })
        .finally(() => setLoading(false));
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrip(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTripImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!trip.destination || !trip.startDate || !trip.endDate || !trip.totalBudget) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("destination", trip.destination);
    formData.append("startDate", trip.startDate);
    formData.append("endDate", trip.endDate);
    formData.append("totalBudget", trip.totalBudget);

    if (tripImage) {
      formData.append("image", tripImage);
    }

    try {
      const response = await axios({
        method: mode === "edit" ? "put" : "post",
        url: mode === "edit" ? `${API_URL}/${id}` : API_URL,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(mode === "edit" ? "Trip updated successfully!" : "Trip created successfully!");
      navigate("/tripoverview");
    } catch (error) {
      console.error("Error saving trip:", error);
      setError("Failed to save trip: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/tripoverview");

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-infoTeal min-h-screen w-full flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        {mode === "edit" ? "Edit Trip" : "Add Trip"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSaveTrip} className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Destination *</label>
          <input
            type="text"
            name="destination"
            value={trip.destination}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={trip.startDate || ""}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">End Date *</label>
          <input
            type="date"
            name="endDate"
            value={trip.endDate || ""}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Total Budget *</label>
          <input
            type="number"
            name="totalBudget"
            value={trip.totalBudget}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Trip Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : (mode === "edit" ? "Update" : "Save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanTrip;