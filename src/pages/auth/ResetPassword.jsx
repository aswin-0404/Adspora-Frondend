import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import axios from "axios";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    try {
      setLoading(true);
      setMessage("");

      await axios.post(
        `https://adspora-frondend.vercel.app/reset-password/${uid}/${token}/`,
        { password }
      );

      setMessage("✅ Password updated successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setMessage("❌ Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email and new password
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-indigo-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          onClick={submit}
          disabled={loading || !password}
          className={`w-full py-3 rounded-lg font-medium text-white transition ${loading || !password
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
            }`}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

