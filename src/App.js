import React from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home/HomePage";
import PlanTrip from "./pages/PlanTrip/PlanTrip";
import TripOverview from "./pages/TripOverview/TripOverview";
import AddActivity from "./pages/AddActivity/AddActivity";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Add Trip */}
          <Route path="/plantrip" element={<PlanTrip mode="add" />} />

          {/* Edit Trip */}
          <Route path="/plantrip/:id" element={<PlanTrip mode="edit" />} />
            <Route path="/editactivity" element={<AddActivity />} />
          {/* Other pages */}
          <Route path="/tripoverview" element={<TripOverview />} />
          <Route path="/addactivity" element={<AddActivity mode="add" />} />
          <Route path="/addactivity/:id" element={<AddActivity mode="edit" />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
