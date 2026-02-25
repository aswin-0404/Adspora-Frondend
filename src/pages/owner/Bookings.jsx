import { useEffect, useState } from "react";
import axios from "axios";
import OwnerNavbar from "../../components/layout/OwnerNavbar";
import { Clock, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react";

const BASE_URL = "https://adspora-frondend.vercel.app";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/owner/bookings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load owner bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/bookings/${id}/accept/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchBookings()
      window.dispatchEvent(new Event("bookingUpdated"));
    } catch (err) {
      alert("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500 font-medium tracking-widest text-xs uppercase">
        Loading Inquiries...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <OwnerNavbar />

      <main className="flex-grow pt-28 pb-12 px-4 max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
          <p className="text-gray-500 mt-1">Manage incoming inquiries from advertisers</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No requests yet</h3>
            <p className="text-gray-500">New requests will appear here as they arrive.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:border-indigo-100 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">ID #{b.id}</span>
                    <span className="text-gray-400 text-xs">
                      {(() => {
                        if (!b.created_at) return "N/A";
                        const parts = b.created_at.split("-");
                        if (parts.length === 3) {
                          const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                          return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
                        }
                        return new Date(b.created_at).toLocaleDateString();
                      })()}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-4">{b.space_title}</h2>

                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Advertiser</p>
                      <p className="text-sm font-semibold text-gray-700">{b.advertiser_name}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-100 hidden md:block"></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Duration</p>
                      <p className="text-sm font-semibold text-gray-700">{b.months} Months</p>
                    </div>
                    <div className="w-px h-6 bg-gray-100 hidden md:block"></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Revenue</p>
                      <p className="text-sm font-bold text-indigo-600">₹{Number(b.amount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 flex flex-row md:flex-col items-center md:items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${b.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    b.status === "REJECTED" ? "bg-rose-50 text-rose-600 border-rose-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                    {b.status}
                  </span>

                  {b.status === "PENDING" && (
                    <button
                      onClick={() => updateStatus(b.id)}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/10 transition-all active:scale-95"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerBookings;

