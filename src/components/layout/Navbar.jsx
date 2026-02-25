import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import { Heart, Bell, User, LogOut, Search, Mail, Menu, X } from "lucide-react";
import { WishlistContext } from "../../context/wishlistContext";
import axios from "axios";
import AdvertiserInbox from "../../pages/user/Inbox";
import Button from "../ui/Button";

const BASE_URL = "https://adspora-backend.onrender.com/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { wishlistCount, setWishlistCount } = useContext(WishlistContext);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const handleProtectedNav = (path) => {
    if (!user) navigate("/login");
    else navigate(path);
    setIsOpen(false);
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
          `${BASE_URL}/wishlist/count/`,
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
      .get(`${BASE_URL}/Notread/count/`, {
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

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Explore Spaces", path: "/spaces", protected: true },
    { name: "My Bookings", path: "/advertiser/bookings/", protected: true },
  ];

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Adspora
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => link.protected ? handleProtectedNav(link.path) : navigate(link.path)}
                  className={`text-sm font-medium transition-colors ${location.pathname === link.path
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                    }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => handleProtectedNav("/wishlist")}
                className="relative text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {user && (
                <button
                  onClick={() => setInboxOpen(true)}
                  className="relative text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <Mail size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                  >
                    <User size={18} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setProfileOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User size={16} /> Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-slide-up">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleProtectedNav(link.path)}
                  className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${location.pathname === link.path
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {link.name}
                </button>
              ))}

              {!user && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    className="justify-center"
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {user && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
                  <button
                    onClick={() => handleProtectedNav("/wishlist")}
                    className="flex items-center gap-3 w-full px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <Heart size={18} /> Wishlist
                    {wishlistCount > 0 && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{wishlistCount}</span>}
                  </button>

                  <button
                    onClick={() => { setInboxOpen(true); setIsOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <Mail size={18} /> Messages
                    {unreadCount > 0 && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{unreadCount}</span>}
                  </button>

                  <button
                    onClick={() => handleLogout()}
                    className="flex items-center gap-3 w-full px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {inboxOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setInboxOpen(false)}
          />
          <div className="relative w-full md:w-[600px] lg:w-[800px] h-full bg-white shadow-2xl animate-slide-in-right flex flex-col">
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setInboxOpen(false)}
                className="p-2 bg-white hover:bg-gray-100 rounded-full shadow-md transition-all text-gray-500 hover:text-gray-900 border border-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 h-full overflow-hidden">
              <AdvertiserInbox className="h-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

