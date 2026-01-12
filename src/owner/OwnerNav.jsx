import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/Authcontext";


export default function OwnerNavbar() {
  const { user } = useContext(AuthContext);
  const{logout}=useContext(AuthContext)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600"
        >
          AdSpace<span className="text-gray-800">Owner</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/owner/dashboard"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/owner/spaces"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            My Spaces
          </Link>
          <Link
            to="/owner/bookings"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Bookings
          </Link>
          <Link
            to="/owner/earnings"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Earnings
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:block text-gray-600 font-medium">
                Hi, {user.name}
              </span>
              <Link
                to="/owner/profile"
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={()=>logout}
                className="text-gray-700 font-medium hover:text-indigo-600"
              >
                logout
              </button>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Become an Owner
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
