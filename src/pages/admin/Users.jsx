import { useEffect, useState } from "react";
import axios from "axios";
import { Search, UserCheck, UserX, Trash2 } from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("access");

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/users/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            // Mock data for demo if API fails or doesn't exist yet
            setUsers([
                { id: 1, name: "John Owner", email: "john@example.com", role: "owner", status: "active" },
                { id: 2, name: "Jane Advertiser", email: "jane@example.com", role: "advertiser", status: "active" },
                { id: 3, name: "Blocked User", email: "blocked@example.com", role: "advertiser", status: "blocked" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-slate-950">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="mb-6 flex justify-between items-center text-white">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">User Management</h1>
                        <p className="text-slate-400 mt-1">Manage all users across the platform</p>
                    </div>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search users..."
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
                                <th className="px-6 py-4 border-b border-slate-800">Name</th>
                                <th className="px-6 py-4 border-b border-slate-800">Email</th>
                                <th className="px-6 py-4 border-b border-slate-800">Role</th>
                                <th className="px-6 py-4 border-b border-slate-800">Status</th>
                                <th className="px-6 py-4 border-b border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-white transition-colors">{user.name}</td>
                                    <td className="px-6 py-4 text-slate-400 font-mono text-sm">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-lg ${user.role === "owner"
                                                ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-900/20"
                                                : "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-900/20"
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${user.status === "active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"}`}></span>
                                            <span className={`text-sm font-medium ${user.status === "active" ? "text-green-400" : "text-red-400"
                                                }`}>
                                                {user.status || "active"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        {user.status !== "blocked" ? (
                                            <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="Block User">
                                                <UserX size={18} />
                                            </button>
                                        ) : (
                                            <button className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="Unblock User">
                                                <UserCheck size={18} />
                                            </button>
                                        )}
                                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all hover:scale-105 active:scale-95" title="Delete User">
                                            <Trash2 size={18} />
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
