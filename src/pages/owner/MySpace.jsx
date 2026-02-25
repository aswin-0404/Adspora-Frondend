import React, { useEffect, useState } from "react";
import axios from "axios";
import OwnerNavbar from "../../components/layout/OwnerNavbar";
import Button from "../../components/ui/Button";
import { Trash2, MapPin, ChevronLeft, ChevronRight, Plus, Layout } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/api";

const MySpace = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this space?")) return;

    try {
      await axios.delete(`${BASE_URL}/ownerspace/delete/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )

      setSpaces((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.error || "Delete failed")
    }
  }

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/get/space/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSpaces(res.data);
      } catch (error) {
        console.error("Failed to load spaces", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, [token]);

  const nextImage = (spaceId, total) => {
    setImageIndex((prev) => ({
      ...prev,
      [spaceId]: ((prev[spaceId] || 0) + 1) % total,
    }));
  };

  const prevImage = (spaceId, total) => {
    setImageIndex((prev) => ({
      ...prev,
      [spaceId]: ((prev[spaceId] || 0) - 1 + total) % total,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <OwnerNavbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              My <span className="text-indigo-600">Ad Spaces</span>
            </h1>
            <p className="text-gray-500 mt-1 text-lg">Manage and track your advertising property inventory</p>
          </div>

          <div className="flex gap-4">
            <div className="hidden sm:flex bg-white border border-gray-200 rounded-2xl px-5 py-2.5 items-center gap-6 shadow-sm">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Listed</p>
                <p className="text-xl font-bold text-gray-900">{spaces.length}</p>
              </div>
              <div className="w-px h-8 bg-gray-100"></div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Approved</p>
                <p className="text-xl font-bold text-emerald-600">{spaces.filter(s => s.is_approved).length}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/owner/addspace')}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/10 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={20} /> Add New Space
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Crunching your space data...</p>
          </div>
        ) : spaces.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Inventory is Empty</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Scale your advertising business by listing your first digital or physical ad space.</p>
            <button
              onClick={() => navigate('/owner/addspace')}
              className="px-8 py-4 bg-gray-900 text-white hover:bg-black rounded-2xl font-bold transition-all shadow-xl"
            >
              Start Listing Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaces.map((space) => {
              const images = space.images || [];
              const current = imageIndex[space.id] || 0;

              return (
                <div
                  key={space.id}
                  className="bg-white rounded-[2rem] overflow-hidden border border-gray-100/80 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                >

                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={images.length > 0 ? images[current].image : "/no-image.png"}
                      alt={space.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-4 left-4 z-10">
                      <div className={`px-3 py-1 rounded-lg text-[11px] font-bold shadow-sm backdrop-blur-md border flex items-center gap-2 ${space.is_approved
                        ? "bg-white/90 text-emerald-600 border-emerald-100"
                        : "bg-white/90 text-amber-600 border-amber-100"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${space.is_approved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        {space.is_approved ? "Active" : "Under Review"}
                      </div>
                    </div>

                    {images.length > 1 && (
                      <div className="absolute inset-0 bg-transparent flex items-center justify-between px-4 pointer-events-none">
                        <button
                          onClick={(e) => { e.stopPropagation(); prevImage(space.id, images.length); }}
                          className="w-10 h-10 bg-white/20 hover:bg-white text-gray-900 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transition-all pointer-events-auto"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); nextImage(space.id, images.length); }}
                          className="w-10 h-10 bg-white/20 hover:bg-white text-gray-900 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transition-all pointer-events-auto"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}

                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-1 uppercase tracking-tight mb-2">
                          {space.title}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="p-1 px-2 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                            {space.space_type}
                          </div>
                          <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                          <div className="flex items-center gap-1 text-[11px] font-medium">
                            <MapPin size={10} /> {space.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-black text-indigo-600 leading-none tracking-tighter">₹{space.price.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">/ month</p>
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-8 font-medium">
                      {space.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100/50">
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Inventory Size</span>
                          <div className="flex items-center gap-1.5">
                            <Layout size={12} className="text-indigo-600" />
                            <span className="text-sm font-bold text-gray-700">{space.size}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(space.id)}
                        className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 border border-transparent hover:border-red-100 shadow-sm hover:shadow-red-500/10"
                        title="Permanently remove listings"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MySpace;
