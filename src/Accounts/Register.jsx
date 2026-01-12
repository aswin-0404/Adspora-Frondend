import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";

export default function Register() {
  const {register}=useContext(AuthContext)

  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "", 
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const result= await register(formData)

    if (result?.message){
        alert(result.message)
        navigate('/login')
    }else{
        alert(JSON.stringify(result.error))
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Create your account
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Sign up to explore and advertise spaces
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

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
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Register as
            </label>
            <div className="flex items-center gap-6">
              
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={formData.role === "owner"}
                  onChange={handleChange}
                  className="accent-indigo-600"
                />
                Space Owner
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="advertiser"
                  checked={formData.role === "advertiser"}
                  onChange={handleChange}
                  className="accent-indigo-600"
                />
                Advertiser
              </label>

            </div>
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
              placeholder="Create a password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span onClick={()=>navigate('/login')} className="text-indigo-600 font-medium cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
