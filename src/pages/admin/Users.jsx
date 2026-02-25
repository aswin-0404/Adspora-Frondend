import { useEffect, useState } from "react";
import axios from "axios";
import { Search, UserCheck, UserX, Trash2, UserPlus, X, Mail, Phone, Lock, ShieldCheck, User as UserIcon } from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";

const BASE_URL = "https://adspora.onrender.com/api";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmpassword: "",
        role: "advertiser",
        adharnumber: "",
        is_suspend: "false"
    });

    const token = localStorage.getItem("access");

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/all-user/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);

        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`${BASE_URL}/delete-user/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const handleStatusToggle = async (id) => {
        try {
            await axios.patch(`${BASE_URL}/toggle-user-status/${id}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchUsers();
        } catch (error) {
            console.error("Failed to toggle user status", error);
        }
        fetchUsers()
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmpassword) {
            alert("Passwords do not match!");
            return;
        }

        setCreateLoading(true);
        try {
            await axios.post(`${BASE_URL}/add-user/`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("User created successfully!");
            setIsModalOpen(false);
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmpassword: "",
                role: "advertiser",
                adharnumber: "",
                is_suspend: "false"
            });
            fetchUsers();
        } catch (error) {
            console.error("Failed to create user", error);
            alert(error.response?.data?.message || "Failed to create user. Please check the details.");
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-950">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="mb-6 flex justify-between items-center text-white">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">User Management</h1>
                        <p className="text-slate-400 mt-1">Manage all users across the platform</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
                        >
                            <UserPlus size={20} />
                            Add User
                        </button>
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
                                            <span className={`w-2 h-2 rounded-full ${user.is_suspend === true || user.is_suspend === "true" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"}`}></span>
                                            <span className={`text-sm font-medium ${user.is_suspend === true || user.is_suspend === "true" ? "text-red-400" : "text-green-400"}`}>
                                                {user.is_suspend === true || user.is_suspend === "true" ? "Blocked" : "Active"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        {user.is_suspend === true || user.is_suspend === "true" ? (
                                            <button
                                                onClick={() => handleStatusToggle(user.id)}
                                                className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all hover:scale-105 active:scale-95"
                                                title="Unblock User"
                                            >
                                                <UserCheck size={18} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusToggle(user.id)}
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all hover:scale-105 active:scale-95"
                                                title="Block User"
                                            >
                                                <UserX size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all hover:scale-105 active:scale-95"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        ></div>
                        <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">
                                        Create <span className="text-indigo-500 not-italic">New User</span>
                                    </h2>
                                    <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">
                                        Provision system access
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-2xl transition-all"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                placeholder="Enter full name"
                                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                                value={formData.name}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                placeholder="email@example.com"
                                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium font-mono text-sm"
                                                value={formData.email}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="text"
                                                name="phone"
                                                placeholder="10 digit number"
                                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                                value={formData.phone}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Aadhaar Number</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="text"
                                                name="adharnumber"
                                                placeholder="12 digit Aadhaar"
                                                maxLength={12}
                                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                                value={formData.adharnumber}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="password"
                                                name="password"
                                                placeholder="••••••••"
                                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium font-mono"
                                                value={formData.password}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="password"
                                                name="confirmpassword"
                                                placeholder="••••••••"
                                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium font-mono"
                                                value={formData.confirmpassword}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Role</label>
                                        <select
                                            name="role"
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none cursor-pointer"
                                            value={formData.role}
                                            onChange={handleFormChange}
                                        >
                                            <option value="advertiser">Advertiser</option>
                                            <option value="owner">Owner</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Initial Status</label>
                                        <select
                                            name="is_suspend"
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none cursor-pointer"
                                            value={formData.is_suspend}
                                            onChange={handleFormChange}
                                        >
                                            <option value="false">Active / Unrestricted</option>
                                            <option value="true">Suspended / Restricted</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={createLoading}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                                    >
                                        {createLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                                                Finalize Registration
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
