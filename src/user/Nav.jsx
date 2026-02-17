import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";
import { Heart, Bell, User, LogOut, Search, Mail } from "lucide-react";
import { WishlistContext } from "../context/wishlistContext";
import axios from "axios";
import AdvertiserInbox from "./AdvertiserInbox";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { wishlistCount, setWishlistCount } = useContext(WishlistContext);

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleProtectedNav = (path) => {
    if (!user) navigate("/login");
    else navigate(path);
  };

  const handleLogout = () => {
    logout();
    setWishlistCount(0);
    setProfileOpen(false);
    navigate("/");
  };

  useEffect(() => {
    if (!user) {
      setWishlistCount(0);
      return;
    }

    const fetchWishlistCount = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) return;

        const res = await axios.get(
          "http://127.0.0.1:8000/api/wishlist/count/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlistCount(res.data.count);
      } catch (err) {
        console.error("Wishlist count error", err);
        setWishlistCount(0);
      }
    };

    fetchWishlistCount();
  }, [user]);
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
  }, [user]);

  useEffect(() => {
  if (inboxOpen) {
    setUnreadCount(0);
  }
}, [inboxOpen]);

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

          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => navigate("/")} className="nav-btn">
              Home
            </button>
            <button
              onClick={() => handleProtectedNav("/spaces")}
              className="nav-btn"
            >
              Explore Spaces
            </button>
            <button
              onClick={() => handleProtectedNav("/advertiser/bookings/")}
              className="nav-btn"
            >owned Spaces</button>
          </div>

          <div className="hidden md:flex items-center space-x-5 relative">
            <button
              onClick={() => handleProtectedNav("/wishlist")}
              className="relative text-gray-600 hover:text-indigo-600"
            >
              <Heart size={22} />

              {wishlistCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 min-w-[18px] h-[18px]
                             bg-red-600 text-white text-xs rounded-full
                             flex items-center justify-center px-1"
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            

            {user?(<button
                  onClick={() => setInboxOpen(true)}
                  className="text-gray-600 hover:text-indigo-600 relative"
                >
                  <Mail size={22} />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>):("")}

            {user ? (
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
                        navigate("/profile");
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
            ) : (
              <>
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/register")}>Sign Up</button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>☰</button>
          </div>
        </div>
      </div>
      {inboxOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/30"
            onClick={() => setInboxOpen(false)}
          />

          <div className="w-full md:w-1/2 bg-gray-100 shadow-xl">
            <AdvertiserInbox />
          </div>
        </div>
      )}
    </nav>
  );
}
