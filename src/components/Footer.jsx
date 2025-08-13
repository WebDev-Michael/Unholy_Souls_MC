import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className=" top-0 left-0 right-0 bg-gray-700/80 rounded-md shadow-md z-50 mt-2 mb-2">
      <p className="text-gray-500 pt-2 text-sm text-center">
          © 2025 Unholy Souls MC - All rights reserved
        </p>
        <div className="flex justify-center items-center">
          
          <nav className="flex space-x-6 pb-2">
            <Link to="/" className="hover:text-gray-600">
              Home
            </Link>
            <Link to="/meetthesouls" className="hover:text-gray-600">
              Meet the Souls
            </Link>
            <Link to="/gallery" className="hover:text-gray-600">
              Gallery
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Footer;
