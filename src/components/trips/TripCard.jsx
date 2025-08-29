import React from "react";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const TripCard = ({ trip, title, dates, budget, image, onView, onEdit, onDelete }) => {
  const navigate = useNavigate();

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = "/default-trip.jpg"; // fallback image
  };
   const formattedBudget = budget ? budget.toLocaleString() : "0";
 console.log(trip);
  return (
    <div className="relative w-72 h-48 rounded-xl overflow-hidden shadow-lg cursor-pointer">
      {/* Background image */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Card content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 text-white items-start">
        {/* Title */}
        <h2 className="text-lg font-bold max-w-[70%] break-words">{title}</h2>

        {/* Dates & Budget */}
        <div>
          <p className="text-sm">Dates: {dates}</p>
          <p className="text-sm">Budget: Rs. {budget}</p>
        </div>

        {/* View Button - Top Right */}
        <button
          onClick={onView}
          className="absolute top-3 right-3 bg-primary text-darkNavy px-3 py-1 rounded-full shadow-md hover:bg-yellow text-sm"
        >
          View
        </button>

        {/* Edit + Delete Buttons - Bottom Right */}
        <div
          onClick={(e) => e.stopPropagation()} // prevent parent clicks
          className="absolute bottom-3 right-3 flex gap-2"
        >
          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="bg-white/50 text-white p-2 rounded-full shadow-md hover:bg-white/70"
          >
            <RiEditLine className="text-black hover:text-blue-700" />
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="bg-white/50 text-white p-2 rounded-full shadow-md hover:bg-white/70"
          >
            <RiDeleteBin6Line className="text-redm hover:text-red-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;