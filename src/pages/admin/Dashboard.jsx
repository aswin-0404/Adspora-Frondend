import { useEffect, useState } from "react";
import axios from "axios";
import { Users, LayoutDashboard, MapPin, Calendar, Activity, ShieldCheck, AlertCircle, Zap, ArrowUpRight } from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";

const BASE_URL = "https://adspora.onrender.com/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        spaces: 0,
        bookings: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);

    const [monthlyRevenue, setMonthlyRevenue] = useState([]);

    const [topContributors, setTopContributors] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("admin_token") || localStorage.getItem("access");

                const [usersRes, spacesRes, bookingsRes, revenueRes, monthlyRes, topUserRes] = await Promise.all([
                    axios.get(`${BASE_URL}/user-count/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { count: 0 } })),
                    axios.get(`${BASE_URL}/activespace-count/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { count: 0 } })),
                    axios.get(`${BASE_URL}/booking-count/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { count: 0 } })),
                    axios.get(`${BASE_URL}/total-revenue/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { sum: 0 } })),
                    axios.get(`${BASE_URL}/revenue-permonth/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
                    axios.get(`${BASE_URL}/top-contributer/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: null }))
                ]);

                setStats({
                    users: usersRes.data.count || 0,
                    spaces: spacesRes.data.count || 0,
                    bookings: bookingsRes.data.count || 0,
                    revenue: revenueRes.data.sum || 0,
                });

                const topUserData = topUserRes.data;
                const contributorsList = Array.isArray(topUserData) ? topUserData : (topUserData ? [topUserData] : []);

                const formattedContributors = contributorsList.map(u => ({
                    name: u.name,
                    email: u.email,
                    revenue: parseFloat(u.total_amount) || 0,
                }));

                setTopContributors(formattedContributors);

                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                const initialH1Data = monthNames.slice(0, 6).map(name => ({ month: name, amount: 0 }));

                if (Array.isArray(monthlyRes.data)) {
                    monthlyRes.data.forEach(item => {

                        const mIndex = typeof item.month === 'number' ? item.month - 1 : monthNames.indexOf(item.month);
                        if (mIndex >= 0 && mIndex < 6) {
                            initialH1Data[mIndex].amount = item.revenue || item.amount || 0;
                        }
                    });
                }

                setMonthlyRevenue(initialH1Data);

            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { name: "Total Users", value: stats.users || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { name: "Active Spaces", value: stats.spaces || 0, icon: MapPin, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { name: "Live Bookings", value: stats.bookings || 0, icon: Calendar, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
        { name: "Total Revenue", value: `₹${(stats.revenue || 0).toLocaleString()}`, icon: Activity, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen bg-slate-950 items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full animate-pulse blur-sm"></div>
                    </div>
                </div>
            </div>
        );
    }

    const MONTHLY_GOAL = 5000000;
    const maxVal = Math.max(...monthlyRevenue.map(d => d.amount), MONTHLY_GOAL);

    return (
        <div className="flex min-h-screen bg-slate-950 font-sans tracking-tight overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-12 text-gray-100 h-screen overflow-y-auto custom-scrollbar">
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tight uppercase italic flex items-center gap-4">
                            Analytics <span className="text-indigo-500 not-italic">Hub</span>
                            <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black italic rounded-lg tracking-widest">
                                v2.4.0
                            </div>
                        </h1>
                        <p className="text-slate-500 font-medium mt-2">Real-time revenue flows and operational intelligence.</p>
                    </div>
                    <div className="text-right text-slate-500 uppercase tracking-widest text-[10px] font-black">
                        <p className="mb-1">Last Update</p>
                        <p className="text-slate-400 font-bold">Today, 15:05</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statCards.map((stat) => (
                        <div key={stat.name} className={`bg-slate-900/40 backdrop-blur-3xl p-7 rounded-[2.5rem] border ${stat.border} flex items-center gap-6 hover:bg-slate-900/60 transition-all duration-700 group cursor-default shadow-2xl relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className={`p-5 rounded-2xl ${stat.bg} ${stat.color} transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 shadow-xl border border-white/5`}>
                                <stat.icon size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">{stat.name}</p>
                                <p className="text-3xl font-black text-white tabular-nums">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-10">
                    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-slate-800/50 shadow-2xl flex flex-col group h-[520px]">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-lg font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                                    Revenue <span className="text-indigo-500 not-italic">Tracking</span>
                                </h2>
                                <p className="text-xs text-slate-500 font-bold mt-1 tracking-tight">Monthly Performance vs 50L Target</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actual</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-0.5 bg-rose-500/50"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aim: 50L</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex items-end justify-between gap-4 mt-8 px-2 relative h-[300px]">
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <div key={i} className="border-t border-slate-800/10 w-full h-0 relative">
                                        <span className="absolute -left-12 -top-2 text-[7px] font-black text-slate-600 uppercase">
                                            ₹{((maxVal * (5 - i) / 5) / 100000).toFixed(0)}L
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div
                                className="absolute inset-x-0 border-t-2 border-dashed border-rose-500/40 z-20 pointer-events-none transition-all duration-1000"
                                style={{ bottom: `${(MONTHLY_GOAL / maxVal) * 100}%`, transform: 'translateY(-48px)' }}
                            >
                                <div className="absolute -right-2 -top-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[8px] font-black px-3 py-1 rounded-full backdrop-blur-md">
                                    TARGET: 50L
                                </div>
                            </div>

                            {monthlyRevenue.map((d, i) => {
                                const rawHeight = (d.amount / maxVal) * 100;
                                const height = d.amount > 0 ? Math.max(rawHeight, 4) : 0;
                                const progress = ((d.amount / MONTHLY_GOAL) * 100).toFixed(1);

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group/bar relative z-10 h-full justify-end pb-12">
                                        <div className={`flex flex-col items-center mb-3 transition-all duration-500 ${d.amount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                                            <div className="bg-indigo-500 text-white text-[8px] font-black px-2 py-1 rounded-md shadow-lg shadow-indigo-500/20 mb-1 whitespace-nowrap">
                                                ₹{(d.amount / 100000).toFixed(2)}L
                                            </div>
                                            <div className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">
                                                {progress}% OF AIM
                                            </div>
                                        </div>
                                        <div
                                            className={`w-full max-w-[42px] rounded-t-2xl transition-all duration-1000 ease-out relative overflow-hidden ${d.amount >= MONTHLY_GOAL
                                                ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                                : "bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                                                }`}
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-50"></div>
                                            {d.amount > 0 && (
                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
                                            )}
                                        </div>
                                        <p className="absolute -bottom-2 text-[10px] font-black text-slate-500 group-hover/bar:text-white transition-colors uppercase tracking-widest">{d.month}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-slate-800/50 shadow-2xl flex flex-col h-[520px]">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-lg font-black text-white uppercase tracking-widest italic">Operational <span className="text-indigo-500 not-italic">Health</span></h2>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black border border-emerald-500/20 tracking-widest uppercase">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                Stable
                            </div>
                        </div>

                        <div className="space-y-6 flex-1">
                            {[
                                { label: "Approved Listings", value: "88%", status: "Live Ratio", icon: ShieldCheck, color: "text-blue-400" },
                                { label: "Approved Users", value: "94%", status: "Verification", icon: Users, color: "text-indigo-400" },
                                { label: "Active User Rate", value: "76%", status: "Engagement", icon: Activity, color: "text-emerald-400" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-6 rounded-[2.5rem] bg-slate-950/20 border border-slate-800/40 hover:bg-slate-800/30 hover:border-slate-700/50 transition-all duration-300 group cursor-default">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl bg-slate-900 shadow-inner group-hover:scale-110 transition-transform duration-500 ${item.color}`}>
                                            <item.icon size={24} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1 italic opacity-60 tracking-wider text-left">{item.status}</p>
                                        </div>
                                    </div>
                                    <p className="text-3xl font-black text-white tabular-nums tracking-tighter">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-slate-800/50 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h2 className="text-lg font-black text-white uppercase tracking-widest italic">Top <span className="text-indigo-500 not-italic">Contributors</span></h2>
                            <p className="text-xs text-slate-500 font-bold mt-1 tracking-tight">Key users generating the highest platform revenue</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-800/50">
                                    <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Contributor</th>
                                    <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Revenue Generated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                {topContributors.length > 0 ? (
                                    topContributors.map((user, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-800/10 transition-colors">
                                            <td className="py-6">
                                                <div className="flex flex-col text-left">
                                                    <p className="text-sm font-black text-white tracking-tight">{user.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">{user.email}</p>
                                                </div>
                                            </td>

                                            <td className="py-6 text-right">
                                                <p className="text-base font-black text-white italic tracking-tighter tabular-nums">
                                                    ₹{user.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="py-10 text-center text-slate-500 font-medium italic">
                                            No contributors found at this time.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
