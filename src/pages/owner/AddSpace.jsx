import { useState } from "react";
import OwnerNavbar from "../../components/layout/OwnerNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Upload, X, MapPin, Layout, DollarSign, Type, FileText } from "lucide-react";

const BASE_URL = "https://adspora-backend.onrender.com/api";

export default function AddSpace() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    space_type: "",
    location: "",
    size: "",
    price: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      images.forEach((img) => {
        data.append("images", img);
      });

      await axios.post(`${BASE_URL}/add/space/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      
      alert("Space added successfully");
      navigate("/ownerdashboard");

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Failed to add space. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <OwnerNavbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            List New <span className="text-indigo-600">Ad Space</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Provide details about your advertising inventory</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3 animate-shake">
            <X size={20} className="shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white shadow-xl shadow-indigo-600/5 rounded-3xl overflow-hidden border border-gray-100">
          <div className="h-1.5 bg-indigo-600"></div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">

            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Type size={18} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">General Information</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Space Title</label>
                  <div className="relative group">
                    <input
                      name="title"
                      placeholder="e.g. Prime Billboard at MG Road"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600/50 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Space Type</label>
                  <div className="relative">
                    <select
                      name="space_type"
                      value={formData.space_type}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600/50 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Billboard">Billboard</option>
                      <option value="Hoarding">Hoarding</option>
                      <option value="LED">LED Display</option>
                      <option value="Transit">Transit Media</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
                  <div className="relative group">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      name="location"
                      placeholder="City, Area or specific address"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600/50 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (Monthly)</label>
                  <div className="relative group">
                    <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      name="price"
                      type="number"
                      placeholder="e.g. 50000"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600/50 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-full md:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Dimensions / Size</label>
                  <div className="relative group">
                    <Layout size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      name="size"
                      placeholder="e.g. 20x10 ft"
                      value={formData.size}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600/50 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={18} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Detailed Description</h3>
              </div>
              <textarea
                name="description"
                placeholder="Describe the visibility, audience reach, and key features of this advertising spot..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600/50 transition-all placeholder:text-gray-400 resize-none"
                required
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Upload size={18} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Media Assets</h3>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300 relative group">
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 group-hover:bg-white text-gray-300 group-hover:text-indigo-600 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-sm">
                    <Upload size={32} />
                  </div>
                  <p className="text-gray-900 font-bold text-lg mb-1">Click to upload images</p>
                  <p className="text-gray-400 font-medium tracking-tight">PNG, JPG or WEBP up to 10MB each</p>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
                  {images.map((img, index) => (
                    <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white p-2 rounded-xl transition-all hover:scale-110 active:scale-90 shadow-xl"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-8 flex flex-col sm:flex-row justify-end gap-6 border-t border-gray-50">
              <button
                type="button"
                onClick={() => navigate('/ownerdashboard')}
                className="px-8 py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`relative px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 ${loading ? 'pr-14' : ''}`}
              >
                {loading ? 'Publishing...' : 'Publish Listing'}
                {loading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

