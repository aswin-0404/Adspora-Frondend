import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Nav";

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
      <div className="min-h-screen flex items-center justify-center">
        Loading bookings...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">My Booked Spaces</h1>

          {bookings.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
              You have no bookings yet.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-lg font-medium">
                      {booking.space_title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Owner: {booking.space_owner}
                    </p>
                    <p className="text-sm text-gray-500">
                      Booked on:{" "}
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-sm">
                      <span className="text-gray-500">Months:</span>{" "}
                      {booking.months}
                    </p>
                    <p className="font-semibold">₹{booking.amount}</p>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>
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

export default MyBookings;
