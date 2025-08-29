import React from "react";
import TripPerson from "../../assets/images/Trip_person.png";
import Chart from "../../assets/images/Chart.png";

const About = () => {
  return (
    <div className="bg-infoTeal min-h-screen w-full flex flex-col items-center p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#E0F2F1] mb-6">
                              About Tripmate
                            </h1>
      <div className="max-w-6xl w-full flex flex-col md:flex-row md:justify-center">

        <div className="w-full md:w-auto mb-8 md:mb-0 md:pr-8">

          {/* Image for mobile */}
          <div className="md:hidden flex justify-center mb-6">
            <img src={Chart} alt="Chart" className="w-32 h-32" />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full md:w-auto flex flex-col justify-center items-center bg-white bg-opacity-10 rounded-xl p-6 md:p-8">
          <p className="mb-6 text-[#E0F2F1] text-lg leading-relaxed">
            Our mission is to make travel easy and affordable by helping you plan
            trips, manage budgets, and track activities in one place
          </p>

          <ul className="list-inside text-[#E0F2F1] mb-8 space-y-3">
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Plan trips easily</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Track expenses</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>Stay on budget</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>View itineraries and activities</span>
            </li>
          </ul>

          <h2 className="font-bold text-xl mb-4 text-primary">
            Start planning your trip today! 👌
          </h2>

          <p className="text-sm text-[#E0F2F1] opacity-90 mt-6 pt-4 border-t border-white border-opacity-20">
            This project was created by Kavindya Ranaweera as part of a university
            course to help travelers simplify their planning experience
          </p>
        </div>
      </div>

      {/* Desktop Images */}
      <div className="max-w-6xl w-full mt-8 hidden md:flex justify-end space-x-6">
        <img src={Chart} alt="Chart" className="w-24 h-24" />
        <img src={TripPerson} alt="Trip Person" className="w-40 h-40" />
      </div>
    </div>
  );
};

export default About;
