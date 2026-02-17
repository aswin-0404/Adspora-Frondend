import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    adharnumber: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmpassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);

      if (result?.message) {
        alert(result.message);
        navigate("/login");
        return;
      }

      const errorMap = {
        confirmpassword: result?.confirmpassword?.[0],
        email: result?.email?.[0],
        password: result?.password?.[0],
        adharnumber: result?.adharnumber?.[0],
      };

      const firstError = Object.values(errorMap).find((err) => err);
      if (firstError) {
        alert(firstError);
      } else {
        alert("Registration failed. Please check your details.");
      }
    } catch (error) {
      console.error("Registration failed", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-lg p-8 shadow-xl border-0">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Create an Account
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Sign up to explore and advertise spaces
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <Input
              label="Aadhaar Number"
              name="adharnumber"
              placeholder="12-digit number"
              value={formData.adharnumber}
              onChange={handleChange}
              required
              maxLength={12}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${formData.role === "owner"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold"
                    : "border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={formData.role === "owner"}
                  onChange={handleChange}
                  className="hidden"
                />
                Apply as Owner
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${formData.role === "advertiser"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold"
                    : "border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="advertiser"
                  checked={formData.role === "advertiser"}
                  onChange={handleChange}
                  className="hidden"
                />
                Find Spaces
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmpassword"
              placeholder="Confirm password"
              value={formData.confirmpassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full justify-center mt-6"
            size="lg"
            isLoading={loading}
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
