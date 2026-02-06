import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Authcontext";
import { Bell, User, LogOut, Mail } from "lucide-react";
import OwnerInbox from "./OwnerInbox";
import axios from "axios";

export default function OwnerNavbar() {
  const { user, logout } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  const fetchBookingCount = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/booking/request/count/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookingCount(res.data.count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) return;

    axios
      .get("http://127.0.0.1:8000/api/Notread/count/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        setUnreadCount(res.data.count || 0);
      })
      .catch(console.error);

    fetchBookingCount();
  }, [user]);

  useEffect(() => {
    const handleUpdate = () => fetchBookingCount();

    window.addEventListener("bookingUpdated", handleUpdate);

    return () =>
      window.removeEventListener("bookingUpdated", handleUpdate);
  }, []);

  useEffect(() => {
    if (inboxOpen) {
      setUnreadCount(0);
    }
  }, [inboxOpen]);

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/ownerdashboard"
              className="text-2xl font-bold text-indigo-600"
            >
              AdSpace<span className="text-gray-800">Owner</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/ownerdashboard" className="nav-btn">
                Dashboard
              </Link>
              <Link to="/myspace" className="nav-btn">
                My Spaces
              </Link>
              <Link to="/owner/addspace" className="nav-btn">
                Ad Space
              </Link>
              <Link to="/owner/booking/request/" className="nav-btn relative">
                Bookings
                {bookingCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {bookingCount}
                  </span>
                )}
              </Link>
            </div>

            {user && (
              <div className="hidden md:flex items-center space-x-5 relative">
                <button
                  onClick={() => setInboxOpen(true)}
                  className="text-gray-600 hover:text-indigo-600 relative"
                >
                  <Mail size={22} />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

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
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                      >
                        <User size={16} /> Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
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

      {inboxOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/30"
            onClick={() => setInboxOpen(false)}
          />

          <div className="w-full md:w-1/2 bg-gray-100 shadow-xl">
            <OwnerInbox />
          </div>
        </div>
      )}
    </>
  );
}
