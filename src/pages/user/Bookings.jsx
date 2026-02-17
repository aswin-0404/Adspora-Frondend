import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import { ShoppingBag } from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/advertiser/bookings/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500 font-medium tracking-widest text-xs uppercase">
        Loading Portfolio...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-12 px-4 max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">My Campaigns</h1>
          <p className="text-gray-500 mt-1">Status and details of your booked ad spaces</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
            <ShoppingBag className="mx-auto mb-4 text-gray-200" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No bookings yet</h3>
            <p className="text-gray-500 mb-6">Explore the marketplace to start your first campaign.</p>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10">
              Browse Spaces
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:border-indigo-100 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-widest">
                      #{booking.id}
                    </span>
                    <span className="text-gray-400 text-xs">{new Date(booking.created_at).toLocaleDateString()}</span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-4">{booking.space_title}</h2>

                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Asset Owner</p>
                      <p className="text-sm font-semibold text-gray-700">{booking.space_owner}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-100 hidden md:block"></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Duration</p>
                      <p className="text-sm font-semibold text-gray-700">{booking.months} Months</p>
                    </div>
                    <div className="w-px h-6 bg-gray-100 hidden md:block"></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total Amount</p>
                      <p className="text-sm font-bold text-indigo-600">₹{booking.amount?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-0">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${booking.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      booking.status === "REJECTED" ? "bg-rose-50 text-rose-600 border-rose-100" :
                        "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;
