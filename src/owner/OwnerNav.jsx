import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/Authcontext";
import { Bell, User, LogOut } from "lucide-react";

export default function OwnerNavbar() {
  const { user, logout } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link
            to="/ownerdashboard"
            className="text-2xl font-bold text-indigo-600"
          >
            AdSpace<span className="text-gray-800">Owner</span>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/ownerdashboard" className="nav-btn">
              Dashboard
            </Link>
            <Link to="/myspace" className="nav-btn">
              My Spaces
            </Link>
            <Link to="/owner/bookings" className="nav-btn">
              Bookings
            </Link>
            <Link to="/owner/addspace" className="nav-btn">
              Ad Space
            </Link>
          </div>

          {/* RIGHT SECTION (MATCHES MAIN NAVBAR) */}
          {user && (
            <div className="hidden md:flex items-center space-x-5 relative">

              {/* 🔔 NOTIFICATIONS */}
              <button
                onClick={() => navigate("/owner/notifications")}
                className="text-gray-600 hover:text-indigo-600"
              >
                <Bell size={22} />
              </button>

              {/* 👤 PROFILE DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  <User size={24} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border">
                    <button
                      onClick={() => {
                        navigate("/ownerprofile");
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <User size={16} /> Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
