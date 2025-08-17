import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

function Footer() {
  const { isAuthenticated } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div className="bg-gray-700/80 rounded-md shadow-md mt-8 sm:mt-12 mb-4 mx-4 sm:mx-6 lg:mx-8">
        <p className="text-gray-500 pt-4 text-xs sm:text-sm text-center px-4">
          © 2025 Unholy Souls MC - All rights reserved
        </p>
        <div className="flex justify-center items-center py-4">
          <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 px-4 w-full max-w-4xl">
            <Link 
              to="/" 
              className="text-white hover:text-amber-400 transition-colors duration-200 text-center cursor-pointer py-2 px-3 rounded hover:bg-gray-600/30 text-sm sm:text-base font-medium"
              onClick={scrollToTop}
            >
              Home
            </Link>
            <Link 
              to="/meetthesouls" 
              className="text-white hover:text-amber-400 transition-colors duration-200 text-center cursor-pointer py-2 px-3 rounded hover:bg-gray-600/30 text-sm sm:text-base font-medium"
              onClick={scrollToTop}
            >
              Meet the Souls
            </Link>
            <Link 
              to="/gallery" 
              className="text-white hover:text-amber-400 transition-colors duration-200 text-center cursor-pointer py-2 px-3 rounded hover:bg-gray-600/30 text-sm sm:text-base font-medium"
              onClick={scrollToTop}
            >
              Gallery
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/admin" 
                  onClick={scrollToTop}
                  className="text-amber-400 hover:text-amber-300 transition-colors duration-200 py-2 px-3 rounded hover:bg-gray-600/30 text-sm sm:text-base font-medium text-center"
                >
                  Admin
                </Link>
                <Link 
                  to="/members" 
                  onClick={scrollToTop}
                  className="text-amber-400 hover:text-amber-300 transition-colors duration-200 py-2 px-3 rounded hover:bg-gray-600/30 text-sm sm:text-base font-medium text-center"
                >
                  Members
                </Link>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={scrollToTop}
                className="text-amber-400 hover:text-amber-300 transition-colors duration-200 py-2 px-3 rounded hover:bg-gray-600/30 text-sm sm:text-base font-medium text-center col-span-2 sm:col-span-1"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Footer;
