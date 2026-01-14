import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <span
            className="text-2xl font-bold text-indigo-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Adspora
          </span>

          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-indigo-600"
            >
              Home
            </button>
            <button className="text-gray-700 hover:text-indigo-600">
              Explore Spaces
            </button>
            <button className="text-gray-700 hover:text-indigo-600">
              About
            </button>
          </div>

          {/* 🔐 AUTH SECTION */}
          <div className="hidden md:flex space-x-4">
            {user ? (
              <button
                onClick={logout}
                className="border border-red-500 text-red-500 px-4 py-2 rounded-lg
             hover:bg-red-50 hover:text-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>☰</button>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <button className="block w-full text-left px-4 py-2">Home</button>
          <button className="block w-full text-left px-4 py-2">Explore</button>
          <button className="block w-full text-left px-4 py-2">About</button>

          <div className="px-4 py-2">
            {user ? (
              <button
                onClick={logout}
                className="w-full text-red-600 border border-red-600 py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg mb-2"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
