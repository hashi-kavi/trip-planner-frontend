import React, { useState } from "react";
import logo from "../../assets/images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token"); // check if user logged in

  return (
    <nav className="bg-darkNavy text-[#E0F2F1] px-6 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="h-10 w-auto" />
      </div>

      {/* If logged in -> show full nav, else -> only login/signup */}
      {token ? (
        <div className="space-x-6 hidden md:flex">
          <NavLink to="/" className="hover:text-infoTeal">Home</NavLink>
          <NavLink to="/plantrip" className="hover:text-infoTeal">Plan Trip</NavLink>
          <NavLink to="/tripoverview" className="hover:text-infoTeal">Trip Overview</NavLink>
          <NavLink to="/addactivity" className="hover:text-infoTeal">Add Activity</NavLink>
          <NavLink to="/about" className="hover:text-infoTeal">About</NavLink>
          <button onClick={() => {localStorage.removeItem("token"); navigate("/");}} className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
        </div>
      ) : (
        <div className="space-x-4 hidden md:flex">
          <button onClick={()=>navigate("/login")} className="bg-infoTeal text-white px-4 py-2 rounded hover:bg-secondaryBlue">
            Login
          </button>
          <button onClick={()=>navigate("/signup")} className="bg-secondaryBlue text-white px-4 py-2 rounded hover:bg-infoTeal">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
