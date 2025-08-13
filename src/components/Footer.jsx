import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className="bg-gray-700/80 rounded-md shadow-md mt-8 sm:mt-12 mb-4 mx-4 sm:mx-6 lg:mx-8">
        <p className="text-gray-500 pt-2 text-xs sm:text-sm text-center px-4">
          © 2025 Unholy Souls MC - All rights reserved
        </p>
        <div className="flex justify-center items-center">
          <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 pb-2 px-4">
            <Link to="/" className="text-white hover:text-amber-400 transition-colors duration-200 text-center">
              Home
            </Link>
            <Link to="/meetthesouls" className="text-white hover:text-amber-400 transition-colors duration-200 text-center">
              Meet the Souls
            </Link>
            <Link to="/gallery" className="text-white hover:text-amber-400 transition-colors duration-200 text-center">
              Gallery
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Footer;
