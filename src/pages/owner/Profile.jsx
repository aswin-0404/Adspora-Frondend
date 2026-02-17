import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/Authcontext";
import OwnerNavbar from "../../components/layout/OwnerNavbar";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function OwnerProfile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("access");
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    adharnumber: "",
  });



  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/owner/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to load owner profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <>
        <OwnerNavbar />
        <div className="h-screen flex items-center justify-center text-sm text-gray-500">
          Loading profile…
        </div>
      </>
    );
  }



  const openEditModal = () => {
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      adharnumber: profile.adharnumber || "",
    });
    setShowEdit(true)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditProfile = async () => {
    try {
      await axios.patch(
        `${BASE_URL}/edit-profile/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setShowEdit(false),
        fetchProfile()
    } catch (err) {
      console.log("Update failed", err);
    }
  };
  return (
    <>
      <OwnerNavbar />

      <div className="min-h-screen bg-gray-50 px-8 py-24">
        <div className="max-w-5xl mx-auto">

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Your Account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View your account information
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">

            <div className="px-6 py-5 border-b flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {profile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {profile.email}
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                Space Owner
              </span>
            </div>

            <div className="px-6 py-6 space-y-6">

              <div className="grid grid-cols-3 items-center">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="col-span-2 text-sm text-gray-900">
                  {profile.name}
                </p>
              </div>

              <div className="grid grid-cols-3 items-center">
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="col-span-2 text-sm text-gray-900">
                  {profile.email}
                </p>
              </div>

              <div className="grid grid-cols-3 items-center">
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="col-span-2 text-sm text-gray-900">
                  {profile.phone}
                </p>
              </div>

              <div className="grid grid-cols-3 items-center">
                <p className="text-sm text-gray-500">Aadhaar Number</p>
                <p className="col-span-2 text-sm text-gray-900">
                  {profile.adharnumber || "Not provided"}
                </p>
              </div>

            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={openEditModal}
                className="text-sm px-4 py-2 border border-gray-400 rounded-md
                           text-black-400"
              >
                Edit Profile
              </button>
            </div>

          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-fadeIn">

            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Profile
              </h2>

              <button
                onClick={() => setShowEdit(false)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email Address
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Aadhaar Number
                </label>
                <input
                  name="adharnumber"
                  value={formData.adharnumber}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowEdit(false)}
                className="px-5 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleEditProfile}
                className="px-6 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
