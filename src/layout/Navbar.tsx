import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Vehicle Rental
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>

          <Link to="/vehicles" className="text-gray-700 hover:text-blue-600">
            Vehicles
          </Link>

          <Link to="/about" className="text-gray-700 hover:text-blue-600">
            About
          </Link>

          <Link to="/contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </Link>

          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
