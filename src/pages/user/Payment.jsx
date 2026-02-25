import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PaymentPage = () => {
  const [space, setSpace] = useState(null);
  const [months, setMonths] = useState(1);
  const [proof, setProof] = useState(null);
  const [mode, setMode] = useState("manual");
  const { spaceId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const BASE_URL = "https://adspora-backend.onrender.com/api";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/spaces/${spaceId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSpace(res.data);
      });
  }, [spaceId]);

  const price = space?.price || 0;
  const tax = 50;
  const total = price * months + tax;

  const handlePayment = async () => {
    if (!proof) {
      alert("Please upload payment proof");
      return;
    }

    const formData = new FormData();
    formData.append("space", space.id);
    formData.append("months", months);
    formData.append("proof", proof);

    await axios.post(`${BASE_URL}/space/booking/`, formData, {
      headers: {
        Authorization: ` Bearer ${token}`,
      },
    });

    alert("Booking Submitted for verification");
    navigate('/advertiser/bookings/')
  };

  const startGatewayPayment = async () => {
    const res = await axios.post(
      `${BASE_URL}/payments/create-order/`,
      {
        space: space.id,
        months,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const options = {
      key: res.data.key,
      order_id: res.data.order_id,
      amount: res.data.amount * 100,
      name: "AdSpora",
      description: "Space Booking",
      handler: async function (response) {
        await axios.post(`${BASE_URL}/payments/verify/`, {
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          space: space.id,
          months,
          amount: res.data.amount,
        });

        alert("Booking confirmed!");
      },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-6 border-r">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

              <img
                src={space?.image || "https://via.placeholder.com/400"}
                className="rounded-lg mb-4"
                alt=""
              />

              <p className="font-medium">{space?.title}</p>
              <p className="text-sm text-gray-500">{space?.location}</p>

              <div className="mt-4 space-y-2">
                <p className="flex justify-between">
                  <span>Monthly Price</span>
                  <span>₹{price}</span>
                </p>

                <p className="flex justify-between">
                  <span>Months</span>
                  <span>{months}</span>
                </p>

                <p className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax}</span>
                </p>

                <hr />
                <p className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Booking Details</h2>

              <div>
                <label className="text-sm font-medium">Number of Months</label>
                <select
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full border p-2 rounded mt-1"
                >
                  {[1, 2, 3, 4, 5, 6, 9, 12].map((m) => (
                    <option key={m} value={m}>
                      {m} Month(s)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMode("manual")}
                  className={`px-4 py-2 rounded ${
                    mode === "manual" ? "bg-green-600 text-white" : "border"
                  }`}
                >
                  Manual
                </button>
                <button
                  onClick={() => setMode("gateway")}
                  className={`px-4 py-2 rounded ${
                    mode === "gateway" ? "bg-indigo-600 text-white" : "border"
                  }`}
                >
                  Razorpay
                </button>
              </div>

              {mode === "manual" && (
                <div>
                  <label className="text-sm font-medium">
                    Upload Your Proof
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setProof(e.target.files[0])}
                    className="w-full border p-2 rounded mt-1"
                  />
                  {proof && (
                    <p className="text-xs text-green-600 mt-1">
                      Uploaded: {proof.name}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  if (mode === "manual") handlePayment();
                  if (mode === "gateway") startGatewayPayment();
                }}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
              >
                {mode === "manual"
                  ? "Submit for Verification"
                  : "Pay with Razorpay"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <span className="text-lg">←</span>
            Back to spaces
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

