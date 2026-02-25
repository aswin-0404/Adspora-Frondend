import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Info, Check, X } from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";

const BASE_URL = "https://adspora-frondend.vercel.app";

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

            const res = await axios.get(`${BASE_URL}/booking-details/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter((booking) =>
        booking.space_title?.toLowerCase().includes(search.toLowerCase()) ||
        booking.advertiser_name?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case "CONFIRMED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20";
            case "PENDING": return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-900/20";
            case "CANCELLED": return "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-900/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    const handleBookingAccept = async (id) => {
        try {
            await axios.patch(`${BASE_URL}/accept-booking/${id}/`, {}, { headers: { Authorization: `Bearer ${token}` } }),
                fetchBookings()
        } catch (err) {
            console.log("Booking accept error", err);
        }
    }

    const handleRejectBooking = async (id) => {
        try {
            await axios.patch(`${BASE_URL}/reject-booking/${id}/`, {}, { headers: { Authorization: `Bearer ${token}` } }),
                fetchBookings()
        } catch (err) {
            console.log("booking reject error", err);
        }

    }

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
                                <th className="px-6 py-4 border-b border-slate-800">Duration</th>

                                <th className="px-6 py-4 border-b border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">#{booking.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-white transition-colors">{booking.space_title}</td>
                                    <td className="px-6 py-4 text-slate-400">{booking.advertiser_name}</td>
                                    <td className="px-6 py-4 text-slate-400">{booking.space_owner}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {(() => {
                                            if (!booking.created_at) return "N/A";
                                            const parts = booking.created_at.split("-");
                                            if (parts.length === 3) {
                                                const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                                                return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
                                            }
                                            return new Date(booking.created_at).toLocaleDateString();
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-indigo-400 font-medium">₹{Number(booking.amount || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-lg ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{booking.months}-Months</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="View Details">
                                            <Info size={18} />
                                        </button>
                                        {booking.status === "PENDING" && (
                                            <>
                                                <button
                                                    onClick={() => handleBookingAccept(booking.id)}
                                                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="Confirm">
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleRejectBooking(booking.id)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="Cancel">
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

