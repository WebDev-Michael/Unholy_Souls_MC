import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-700/80 backdrop-blur-sm rounded-md shadow-md z-50 p-4 border-b border-gray-600/50">
      <div className="flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 sm:space-x-4 pl-2 sm:pl-5">
          <img 
            src='https://i.imgur.com/NxT8GSD.png' 
            alt="Unholy Souls MC" 
            className="w-16 h-auto sm:w-24" 
          />
          <h1 className="text-lg sm:text-xl font-bold text-white">Unholy Souls MC</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 pr-5"> 
          <Link to="/" className="text-white hover:text-amber-400 transition-colors duration-200">Home</Link>
          <Link to="/meetthesouls" className="text-white hover:text-amber-400 transition-colors duration-200">Meet the Souls</Link>
          <Link to="/gallery" className="text-white hover:text-amber-400 transition-colors duration-200">Gallery</Link>
          
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-white hover:text-amber-400 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-600/50">
          <nav className="flex flex-col space-y-3 pt-4">
            <Link 
              to="/" 
              className="text-white hover:text-amber-400 transition-colors duration-200 px-2 py-2 rounded hover:bg-gray-600/50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/meetthesouls" 
              className="text-white hover:text-amber-400 transition-colors duration-200 px-2 py-2 rounded hover:bg-gray-600/50"
              onClick={() => setIsMenuOpen(false)}
            >
              Meet the Souls
            </Link>
            <Link 
              to="/gallery" 
              className="text-white hover:text-amber-400 transition-colors duration-200 px-2 py-2 rounded hover:bg-gray-600/50"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}

export default Navigation