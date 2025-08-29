import React from 'react';
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import logo from '../assets/images/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", to: "/" },
    { name: "Plan Trip", to: "/plantrip" },
    { name: "Trip Overview", to: "/tripoverview" },
    { name: "Add Activity", to: "/addactivity" },
    { name: "About", to: "/about" }
  ];

  const socialLinks = [
    { icon: <FaFacebook className="w-6 h-6" />, href: "https://facebook.com", label: "Facebook" },
    { icon: <FaTwitter className="w-6 h-6" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FaInstagram className="w-6 h-6" />, href: "https://instagram.com", label: "Instagram" }
  ];

  return (
    <footer className="bg-darkNavy text-[#E0F2F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">

          {/* Brand Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="logo" className="h-10 w-auto" />
            </div>
            <p className="text-gray-300 mt-2">
              Plan your trips smarter, track activities, budgets, and enjoy stress-free travel.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-navBlue transition-colors duration-300"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-gray-300" />
                <span className="text-gray-300">+94 (77) 8611588</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-300" />
                <span className="text-gray-300">support@tripmate.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-gray-300" />
                <span className="text-gray-300">Galle, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="col-span-1">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-navBlue transition-colors duration-300"
                  aria-label={`Follow us on ${social.label}`}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 py-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {currentYear} BudgetTripPlanner. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-navBlue text-sm mx-3 transition-colors duration-300"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-300 hover:text-navBlue text-sm mx-3 transition-colors duration-300"
                aria-label="Terms of Service"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
