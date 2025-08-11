import React from 'react'
import logo from '../assets/images/Unholy_Souls_Goat.png'
import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <div className=" top-0 left-0 right-0 bg-gray-700/80 rounded-md shadow-md z-50 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 pl-5">
              <img src={logo} alt="Unholy Souls MC" className="w-24 h-auto" />
              <h1 className="text-xl font-bold">Unholy Souls MC</h1>
            </div>
            <nav className="flex space-x-6 pr-5"> 
              <Link to="/" className="hover:text-gray-600">Home</Link>
              <Link to="/about" className="hover:text-gray-600">About</Link>
              <Link to="/cities" className="hover:text-gray-600">Cities</Link>
              <Link to="/rules" className="hover:text-gray-600">Rules</Link>
              <Link to="/meetthesouls" className="hover:text-gray-600">Meet the Souls</Link>
              <Link to="/gallery" className="hover:text-gray-600">Gallery</Link>
            </nav>
          </div>
        </div>
  )
}

export default Navigation