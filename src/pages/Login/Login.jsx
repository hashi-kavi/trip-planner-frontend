import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const response = await fetch("http://localhost:8080/api/auth/login", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(credentials),
     });

     if (response.ok) {
       const token = await response.text(); // read the string token
       localStorage.setItem("token", token); // save token
       navigate("/plantrip"); // redirect
     } else {
       const errorData = await response.json();
       alert("Login failed: " + (errorData.message || "Invalid credentials"));
     }
   } catch (err) {
     alert("Error: " + err.message);
   }
 };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-infoTeal to-secondaryBlue p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-darkNavy">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-infoTeal"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-infoTeal"
        />
        <button
          type="submit"
          className="w-full py-3 bg-infoTeal text-white rounded-lg font-semibold hover:bg-secondaryBlue transition"
        >
          Login
        </button>
        <p className="text-center mt-4 text-sm">
          Don’t have an account? <a href="/signup" className="text-infoTeal hover:underline">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
