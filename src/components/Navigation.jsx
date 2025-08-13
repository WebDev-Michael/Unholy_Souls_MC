import React from 'react'
import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <div className=" top-0 left-0 right-0 bg-gray-700/80 rounded-md shadow-md z-50 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 pl-5">
              <img src='https://cdn.discordapp.com/attachments/1166933227148165201/1405303321144721648/image.png?ex=689e5635&is=689d04b5&hm=715e5113639747eea9e6b0363ef7a712cdc08febc043a1af0c8d5ac4bc7587f6&' alt="Unholy Souls MC" className="w-24 h-auto" />
              <h1 className="text-xl font-bold">Unholy Souls MC</h1>
            </div>
            <nav className="flex space-x-6 pr-5"> 
              <Link to="/" className="hover:text-gray-600">Home</Link>
              <Link to="/meetthesouls" className="hover:text-gray-600">Meet the Souls</Link>
              <Link to="/gallery" className="hover:text-gray-600">Gallery</Link>
            </nav>
          </div>
        </div>
  )
}

export default Navigation