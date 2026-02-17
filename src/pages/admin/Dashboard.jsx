import { useEffect, useState } from "react";
import axios from "axios";
import { Users, LayoutDashboard, MapPin, Calendar, Activity } from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        spaces: 0,
        bookings: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("admin_token") || localStorage.getItem("access"); 

                const [usersRes, spacesRes, bookingsRes] = await Promise.all([
                    axios.get(`${BASE_URL}/users/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
                    axios.get(`${BASE_URL}/spaces/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
                    axios.get(`${BASE_URL}/bookings/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
                ]);

                setStats({
                    users: usersRes.data.length || 0,
                    spaces: spacesRes.data.length || 0,
                    bookings: bookingsRes.data.length || 0,
                    revenue: 125000, 
                });
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { name: "Total Users", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { name: "Active Spaces", value: stats.spaces, icon: MapPin, color: "text-green-600", bg: "bg-green-50" },
        { name: "Bookings", value: stats.bookings, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
        { name: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="flex min-h-screen bg-slate-950">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-8 text-gray-100">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                    <p className="text-slate-400">Welcome back, Admin</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat) => (
                        <div key={stat.name} className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-colors group">
                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                        <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 text-sm text-slate-500 uppercase tracking-wider">
                                    <th className="py-4 font-semibold pl-4">Activity</th>
                                    <th className="py-4 font-semibold">User</th>
                                    <th className="py-4 font-semibold">Date</th>
                                    <th className="py-4 font-semibold text-right pr-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-800">
                                <tr className="hover:bg-slate-800/30 transition-colors">
                                    <td className="py-4 pl-4 text-slate-200 font-medium">New Space Listed: "Kochi Main Billboard"</td>
                                    <td className="py-4 text-slate-400">John Doe (Owner)</td>
                                    <td className="py-4 text-slate-500">2 mins ago</td>
                                    <td className="py-4 text-right pr-4"><span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)]">Approved</span></td>
                                </tr>
                                <tr className="hover:bg-slate-800/30 transition-colors">
                                    <td className="py-4 pl-4 text-slate-200 font-medium">New User Registration</td>
                                    <td className="py-4 text-slate-400">Sarah Smith (Advertiser)</td>
                                    <td className="py-4 text-slate-500">1 hour ago</td>
                                    <td className="py-4 text-right pr-4"><span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(59,130,246,0.1)]">New</span></td>
                                </tr>
                                <tr className="hover:bg-slate-800/30 transition-colors">
                                    <td className="py-4 pl-4 text-slate-200 font-medium">Booking Request #1024</td>
                                    <td className="py-4 text-slate-400">Tech Corp</td>
                                    <td className="py-4 text-slate-500">3 hours ago</td>
                                    <td className="py-4 text-right pr-4"><span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(234,179,8,0.1)]">Pending</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
