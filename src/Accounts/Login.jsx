import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";

export default function Login() {
  const navigate = useNavigate();
  const {login}=useContext(AuthContext)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

    const result=await login(formData)

    if (result.success){
      if (result.role=="advertiser")navigate('/')
      else if(result.role=="owner")navigate('/ownerdashboard')
      else{
        navigate('/admindash')
      }
    }else{
        alert(result.error);
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Sign in to your account
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Access your Adspora dashboard
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          
          <div className="flex items-center justify-between text-sm">
            <span className="text-indigo-600 cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

         
          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            Login
          </button>
        </form>

        
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
