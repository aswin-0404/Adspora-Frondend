import { Link } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/Authcontext";

export default function OwnerNavbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/owner/dashboard" className="text-2xl font-bold text-indigo-600">
          AdSpace<span className="text-gray-800">Owner</span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link to='/ownerdashboard' className="text-gray-700 hover:text-indigo-600 font-medium">
            Dashboard
          </Link>
          <Link to="/myspace" className="text-gray-700 hover:text-indigo-600 font-medium">
            My Spaces
          </Link>
          <Link to="/owner/bookings" className="text-gray-700 hover:text-indigo-600 font-medium">
            Bookings
          </Link>
          <Link to="/owner/addspace" className="text-gray-700 hover:text-indigo-600 font-medium">
            Ad Space
          </Link>
        </div>

        {/* GREETING + PROFILE DROPDOWN */}
        {user && (
          <div className="relative flex items-center gap-4" ref={dropdownRef}>
            <span className="hidden sm:block text-gray-600 font-medium">
              Hi, {user.name}
            </span>

            {/* PROFILE ICON */}
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 flex items-center justify-center rounded-full
                         bg-gray-100 text-gray-700 hover:bg-indigo-100
                         hover:text-indigo-600 transition"
            >
              👤
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 top-12 w-40 bg-white border rounded-lg shadow-lg">
                <Link
                  to="/owner/profile"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
