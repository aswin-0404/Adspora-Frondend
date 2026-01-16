import { useEffect, useState } from "react";
import axios from "axios";
import OwnerNavbar from "./OwnerNav";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function OwnerProfile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchProfile();
  }, []);

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

  if (!profile) {
    return (
      <>
        <OwnerNavbar/>
        <div className="h-screen flex items-center justify-center text-sm text-gray-500">
          Loading profile…
        </div>
      </>
    );
  }

  return (
    <>
      <OwnerNavbar />

      <div className="min-h-screen bg-gray-50 px-8 py-24">
        <div className="max-w-5xl mx-auto">

          {/* PAGE HEADER */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Your Account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View your account information
            </p>
          </div>

          {/* PROFILE CARD */}
          <div className="bg-white border border-gray-200 rounded-lg">

            {/* HEADER */}
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

            {/* DETAILS */}
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

            {/* FOOTER */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button
                disabled
                className="text-sm px-4 py-2 border border-gray-300 rounded-md
                           text-gray-400 cursor-not-allowed"
              >
                Edit Profile (Coming Soon)
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
