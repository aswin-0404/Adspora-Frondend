import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Nav";
import { User } from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/advertiser/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="h-screen flex items-center justify-center text-sm text-gray-500">
          Loading profile…
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* PAGE CONTAINER */}
      <div className="min-h-screen bg-gray-50 px-8 py-24">
        <div className="max-w-6xl mx-auto">

          {/* PAGE HEADER */}
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-gray-900">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your personal and contact information
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-12 gap-8">

            {/* LEFT SIDEBAR */}
            <div className="col-span-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {profile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Advertiser Account
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t pt-4">
                  <p className="text-xs uppercase text-gray-400 mb-2">
                    Account Email
                  </p>
                  <p className="text-sm text-gray-800">
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="col-span-8">
              <div className="bg-white border border-gray-200 rounded-lg">

                {/* SECTION HEADER */}
                <div className="px-6 py-4 border-b">
                  <h2 className="text-sm font-medium text-gray-900">
                    Personal Information
                  </h2>
                </div>

                {/* DETAILS */}
                <div className="px-6 py-6 space-y-6">

                  {/* NAME */}
                  <div className="grid grid-cols-3">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="col-span-2 text-sm text-gray-900">
                      {profile.name}
                    </p>
                  </div>

                  {/* EMAIL */}
                  <div className="grid grid-cols-3">
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="col-span-2 text-sm text-gray-900">
                      {profile.email}
                    </p>
                  </div>

                  {/* PHONE */}
                  <div className="grid grid-cols-3">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="col-span-2 text-sm text-gray-900">
                      {profile.phone}
                    </p>
                  </div>

                  {/* AADHAR */}
                  <div className="grid grid-cols-3">
                    <p className="text-sm text-gray-500">Aadhaar Number</p>
                    <p className="col-span-2 text-sm text-gray-900">
                      {profile.adharnumber || "Not provided"}
                    </p>
                  </div>

                </div>

                {/* ACTION FOOTER */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                  <button
                    disabled
                    className="text-sm px-4 py-2 border border-gray-300 rounded-md text-gray-400 cursor-not-allowed"
                  >
                    Edit Profile (Coming Soon)
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
