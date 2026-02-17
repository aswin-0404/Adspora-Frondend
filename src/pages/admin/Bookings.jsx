import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Info, Check, X } from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("access");

    useEffect(() => {
        fetchBookings();
    }, [token]);

    const fetchBookings = async () => {
        try {

            const res = await axios.get(`${BASE_URL}/bookings/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(res.data || []);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            // Mock Data
            setBookings([
                { id: 101, space: "Prime Billboard", advertiser: "Tech Solutions", owner: "City Ads", date: "2024-03-15", status: "confirmed", amount: 45000 },
                { id: 102, space: "Mall LED", advertiser: "Fashion Co", owner: "Retail Media", date: "2024-03-16", status: "pending", amount: 12000 },
                { id: 103, space: "Bus Shelter", advertiser: "Local Cafe", owner: "Transit Ads", date: "2024-03-14", status: "cancelled", amount: 5000 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter((booking) =>
        booking.space?.toLowerCase().includes(search.toLowerCase()) ||
        booking.advertiser?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case "confirmed": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20";
            case "pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-900/20";
            case "cancelled": return "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-900/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    return (
        <div className="flex h-screen bg-slate-950">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="mb-6 flex justify-between items-center text-white">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Booking Management</h1>
                        <p className="text-slate-400 mt-1">Track and manage booking transactions</p>
                    </div>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            className="bg-slate-900/50 text-slate-200 pl-10 pr-4 py-2 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all w-64 group-hover:w-72"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-500 group-hover:text-indigo-400 transition-colors" size={18} />
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900/80 text-slate-400 text-sm font-semibold uppercase tracking-wider backdrop-blur-md sticky top-0">
                            <tr>
                                <th className="px-6 py-4 border-b border-slate-800">ID</th>
                                <th className="px-6 py-4 border-b border-slate-800">Space</th>
                                <th className="px-6 py-4 border-b border-slate-800">Advertiser</th>
                                <th className="px-6 py-4 border-b border-slate-800">Owner</th>
                                <th className="px-6 py-4 border-b border-slate-800">Date</th>
                                <th className="px-6 py-4 border-b border-slate-800">Amount</th>
                                <th className="px-6 py-4 border-b border-slate-800">Status</th>
                                <th className="px-6 py-4 border-b border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">#{booking.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-white transition-colors">{booking.space}</td>
                                    <td className="px-6 py-4 text-slate-400">{booking.advertiser}</td>
                                    <td className="px-6 py-4 text-slate-400">{booking.owner}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{new Date(booking.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-mono text-indigo-400 font-medium">₹{booking.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-lg ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="View Details">
                                            <Info size={18} />
                                        </button>
                                        {booking.status === "pending" && (
                                            <>
                                                <button className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="Confirm">
                                                    <Check size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="Cancel">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
