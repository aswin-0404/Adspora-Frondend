import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate()

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">
              Adspora
            </span>
          </div>

          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-indigo-600">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600">
              Explore Spaces
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600">
              About
            </a>
          </div>

          <div className="hidden md:flex space-x-4">
            <button className="text-gray-700 hover:text-indigo-600">
              Login
            </button>
            <button onClick={()=>navigate('/register')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Sign Up
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Home
          </a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Explore Spaces
          </a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Post Ad
          </a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            About
          </a>
          <div className="px-4 py-2 flex space-x-2">
            <button className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg">
              Login
            </button>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
