import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, MapPin, Calendar, LogOut, Settings } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
    const location = useLocation();
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const navItems = [
        { name: "Dashboard", path: "/admindash", icon: LayoutDashboard },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Spaces", path: "/admin/spaces", icon: MapPin },
        { name: "Bookings", path: "/admin/bookings", icon: Calendar },
    ];

    return (
        <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 border-r border-slate-800 flex flex-col z-50 shadow-xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-center">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    Adspora<span className="text-gray-400 text-sm ml-1 font-medium">Admin</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-900/20"
                                : "text-gray-400 hover:bg-slate-800 hover:text-gray-100"
                                }`}
                        >
                            <item.icon size={20} className={isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300"} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
}
