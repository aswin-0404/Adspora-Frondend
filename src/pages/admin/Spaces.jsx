import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function Spaces() {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("access");

    useEffect(() => {
        fetchSpaces();
    }, [token]);

    const fetchSpaces = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/spaces/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSpaces(res.data || []);
        } catch (error) {
            console.error("Failed to fetch spaces", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSpaces = spaces.filter((space) =>
        space.title?.toLowerCase().includes(search.toLowerCase()) ||
        space.location?.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div className="flex h-screen bg-slate-950">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="mb-6 flex justify-between items-center text-white">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">Space Management</h1>
                        <p className="text-slate-400 mt-1">Review and approve ad space listings</p>
                    </div>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search spaces..."
                            className="bg-slate-900/50 text-slate-200 pl-10 pr-4 py-2 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all w-64 group-hover:w-72"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-500 group-hover:text-emerald-400 transition-colors" size={18} />
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900/80 text-slate-400 text-sm font-semibold uppercase tracking-wider backdrop-blur-md sticky top-0">
                            <tr>
                                <th className="px-6 py-4 border-b border-slate-800">Title</th>
                                <th className="px-6 py-4 border-b border-slate-800">Owner</th>
                                <th className="px-6 py-4 border-b border-slate-800">Location</th>
                                <th className="px-6 py-4 border-b border-slate-800">Price</th>
                                <th className="px-6 py-4 border-b border-slate-800">Status</th>
                                <th className="px-6 py-4 border-b border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredSpaces.map((space) => (
                                <tr key={space.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-200 truncate max-w-xs group-hover:text-white transition-colors">{space.title}</td>
                                    <td className="px-6 py-4 text-slate-400">{space.owner?.name || "Unknown"}</td>
                                    <td className="px-6 py-4 text-slate-400 flex items-center gap-1"><MapPin size={14} className="text-slate-600" />{space.location}</td>
                                    <td className="px-6 py-4 font-mono text-emerald-400 font-medium">₹{space.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-lg ${space.approved
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20"
                                            : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-900/20"
                                            }`}>
                                            {space.approved ? "Approved" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="View Details">
                                            <Eye size={18} />
                                        </button>
                                        {!space.approved && (
                                            <button className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="Approve">
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="Reject">
                                            <XCircle size={18} />
                                        </button>
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
