import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate=useNavigate()

  const submit = async () => {
    try {
      setLoading(true);
      setMessage("");

      await axios.post("http://127.0.0.1:8000/api/forgot-password/", {
        email,
      });

      setEmail("");
      setMessage("✅ Reset link sent! Check your email.");
    } catch (err) {
      setMessage("❌ Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email to receive a password reset link
        </p>

        {/* Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />

        {/* Button */}
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-4 text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
