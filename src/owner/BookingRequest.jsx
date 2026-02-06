import { useEffect, useState } from "react";
import axios from "axios";
import OwnerNavbar from "./OwnerNav";

const BASE_URL = "http://127.0.0.1:8000/api";

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
      setBookings(res.data);
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
      <div className="min-h-screen flex items-center justify-center">
        Loading booking requests...
      </div>
    );
  }

  return (
    <>
      <OwnerNavbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">
            Incoming Booking Requests
          </h1>

          {bookings.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
              No booking requests yet.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {b.space_title}
                    </h2>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">
                        {b.advertiser_name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{b.advertiser_name}</span>
                    </div>

                    <p className="text-xs text-gray-400">
                      Requested on {new Date(b.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 text-right space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      {b.months} months · ₹{b.amount}
                    </p>

                    <span
                      className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                        b.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : b.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.status}
                    </span>

                    {b.status === "PENDING" && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => updateStatus(b.id)}
                          className="px-4 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OwnerBookings;
