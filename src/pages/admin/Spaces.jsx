import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  Lock,
  Unlock,
  Trash2,
  X,
  User,
  Phone,
  Mail,
  Layers,
  Plus,
  Upload,
  Layout,
  DollarSign,
  Type,
  FileText,
  Image,
} from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";

import { BASE_URL } from "../../api";


export default function Spaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addImages, setAddImages] = useState([]);
  const [addFormData, setAddFormData] = useState({
    title: "",
    space_type: "",
    location: "",
    size: "",
    price: "",
    description: "",
    is_approved: true,
  });

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchSpaces();
  }, [token]);



  const fetchSpaces = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/get-all-spaces/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpaces(res.data || []);
    } catch (error) {
      console.error("Failed to fetch spaces", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpaces = spaces.filter(
    (space) =>
      space.title?.toLowerCase().includes(search.toLowerCase()) ||
      space.location?.toLowerCase().includes(search.toLowerCase()),
  );



  const handleToggleSuspend = async (id) => {
    try {
      await axios.patch(
        `${BASE_URL}/toggle-space-suspend/${id}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchSpaces();
    } catch (error) {
      console.error("Failed to toggle space status", error);
    }
  };




  const fetchOwnerDetails = async (space) => {
    setModalLoading(true);

    setSelectedDetail({
      ...space,
      Owner: { name: space.owner || "Confidential User" },
      listings: "...",
    });

    setIsModalOpen(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/detail-of-owner/${space.id}/`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSelectedDetail((prev) => ({
        ...prev,
        Owner: res.data.Owner,
        listings: res.data.listings,
      }));
    } catch (error) {
      console.error("Failed to fetch owner details", error);
    } finally {
      setModalLoading(false);
    }
  };



  const handleDeleteSpace = async (id) => {
    if (
      !window.confirm(
        "ARE YOU ABSOLUTELY SURE? This will permanently delete the space listing.",
      )
    )
      return;
    try {
      await axios.delete(`${BASE_URL}/delete-space/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSpaces();
    } catch (error) {
      console.error("Failed to delete space", error);
    }
  };

  const handleAddFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setAddImages((prev) => [...prev, ...files]);
  };

  const removeAddImage = (index) => {
    setAddImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSpaceSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const data = new FormData();
      Object.entries(addFormData).forEach(([key, value]) => {
        data.append(key, value);
      });
      addImages.forEach((img) => {
        data.append("images", img);
      });

      await axios.post(`${BASE_URL}/add/space/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Space added successfully!");
      setIsAddModalOpen(false);
      fetchSpaces();

      setAddFormData({
        title: "",
        space_type: "",
        location: "",
        size: "",
        price: "",
        description: "",
        is_approved: true,
      });
      setAddImages([]);
    } catch (error) {
      console.error("Failed to add space", error);
      alert("Failed to add space. Please check the details.");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="mb-6 flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              Space Management
            </h1>
            <p className="text-slate-400 mt-1">
              Review and approve ad space listings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              <Plus size={20} />
              Add Space
            </button>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search spaces..."
                className="bg-slate-900/50 text-slate-200 pl-10 pr-4 py-2 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all w-64 group-hover:w-72"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-slate-500 group-hover:text-emerald-400 transition-colors"
                size={18}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 text-slate-400 text-sm font-semibold uppercase tracking-wider backdrop-blur-md sticky top-0">
              <tr>
                <th className="px-6 py-4 border-b border-slate-800">Title</th>
                <th className="px-6 py-4 border-b border-slate-800">Owner</th>
                <th className="px-6 py-4 border-b border-slate-800">
                  Location
                </th>
                <th className="px-6 py-4 border-b border-slate-800">Price</th>
                <th className="px-6 py-4 border-b border-slate-800">Status</th>
                <th className="px-6 py-4 border-b border-slate-800 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredSpaces.map((space) => (
                <tr
                  key={space.id}
                  className="hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-slate-200 truncate max-w-xs group-hover:text-white transition-colors">
                    {space.title}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {space.owner || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-slate-400 flex items-center gap-1">
                    <MapPin size={14} className="text-slate-600" />
                    {space.location}
                  </td>
                  <td className="px-6 py-4 font-mono text-emerald-400 font-medium">
                    ₹{space.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border text-center ${space.is_approved
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                      >
                        {space.is_approved ? "Live" : "Pending Approval"}
                      </span>
                      {space.is_suspend && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 text-center">
                          Suspended
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    {space.is_approved ? (
                      <>
                        <button
                          onClick={() => handleToggleSuspend(space.id)}
                          className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${space.is_suspend
                            ? "text-amber-400 hover:bg-amber-500/10"
                            : "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            }`}
                          title={
                            space.is_suspend ? "Unblock Space" : "Block Space"
                          }
                        >
                          {space.is_suspend ? (
                            <Unlock size={18} />
                          ) : (
                            <Lock size={18} />
                          )}
                        </button>

                        <button
                          onClick={() => fetchOwnerDetails(space)}
                          className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all hover:scale-110 active:scale-95"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleDeleteSpace(space.id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all hover:scale-110 active:scale-95"
                          title="Delete Permanently"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => fetchOwnerDetails(space)}
                          className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all hover:scale-110 active:scale-95"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleToggleSuspend(space.id)}
                          className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all hover:scale-110 active:scale-95"
                          title="Accept Request"
                        >
                          <CheckCircle size={18} />
                        </button>

                        <button
                          onClick={() => handleDeleteSpace(space.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all hover:scale-110 active:scale-95"
                          title="Reject Request"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && selectedDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            ></div>
            <div className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-slide-up overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">
                    Owner{" "}
                    <span className="text-indigo-500 not-italic">
                      Intelligence
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest text-left">
                    Verified Entity Profile
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-2xl transition-all"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <div className="space-y-6 relative z-10 text-left">
                {modalLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">
                      Retrieving Owner Profile...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-6 p-6 bg-slate-800/30 rounded-3xl border border-slate-700/30">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <User size={32} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-left">
                          Full Name
                        </p>
                        <p className="text-xl font-black text-white">
                          {selectedDetail.Owner?.name || "Confidential User"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 bg-slate-800/20 rounded-2xl border border-slate-700/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Mail size={14} className="text-indigo-400" />
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">
                            Email Address
                          </p>
                        </div>
                        <p className="text-sm font-bold text-slate-200 truncate">
                          {selectedDetail.Owner?.email || "Not Provided"}
                        </p>
                      </div>
                      <div className="p-5 bg-slate-800/20 rounded-2xl border border-slate-700/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Phone size={14} className="text-indigo-400" />
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">
                            Contact Phone
                          </p>
                        </div>
                        <p className="text-sm font-bold text-slate-200">
                          {selectedDetail.Owner?.phone || "Not Provided"}
                        </p>
                      </div>
                      <div className="p-5 bg-slate-800/20 rounded-2xl border border-slate-700/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Layers size={14} className="text-indigo-400" />
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">
                            Total Listings
                          </p>
                        </div>
                        <p className="text-sm font-bold text-slate-200">
                          {selectedDetail.listings}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                          Listing Reference
                        </p>
                      </div>
                      <p className="text-lg font-black text-white leading-tight mb-2 text-left">
                        {selectedDetail.title}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsAddModalOpen(false)}
            ></div>
            <div className="relative bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-[2.5rem] p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">
                    Add <span className="text-emerald-500 not-italic">New Space</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest text-left">
                    Admin Direct Provisioning
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-3 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-2xl transition-all"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <form onSubmit={handleAddSpaceSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-left block">Space Title</label>
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        required
                        type="text"
                        name="title"
                        placeholder="e.g. Prime LED Billboard"
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                        value={addFormData.title}
                        onChange={handleAddFormChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-left block">Space Type</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <select
                        required
                        name="space_type"
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold appearance-none cursor-pointer"
                        value={addFormData.space_type}
                        onChange={handleAddFormChange}
                      >
                        <option value="">Select Type</option>
                        <option value="Billboard">Billboard</option>
                        <option value="Hoarding">Hoarding</option>
                        <option value="LED">LED Display</option>
                        <option value="Transit">Transit Media</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-left block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        required
                        type="text"
                        name="location"
                        placeholder="City, Area"
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                        value={addFormData.location}
                        onChange={handleAddFormChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-left block">Price (Monthly)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        required
                        type="number"
                        name="price"
                        placeholder="Amount in ₹"
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                        value={addFormData.price}
                        onChange={handleAddFormChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-left block">Dimensions / Size</label>
                    <div className="relative">
                      <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        required
                        type="text"
                        name="size"
                        placeholder="e.g. 20x10 ft"
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                        value={addFormData.size}
                        onChange={handleAddFormChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-left block">Approval Status</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                      <input
                        type="checkbox"
                        name="is_approved"
                        id="is_approved"
                        className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-900 cursor-pointer"
                        checked={addFormData.is_approved}
                        onChange={handleAddFormChange}
                      />
                      <label htmlFor="is_approved" className="text-sm font-bold text-slate-300 cursor-pointer">Post as Approved (Live)</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-left block">Detailed Description</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-slate-500" size={18} />
                    <textarea
                      required
                      name="description"
                      rows="3"
                      placeholder="Describe the space's features and audience reach..."
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium resize-none"
                      value={addFormData.description}
                      onChange={handleAddFormChange}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-left block">Media Assets</label>
                  <div className="border-2 border-dashed border-slate-800 rounded-3xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-all relative group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleAddImagesChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-800 group-hover:bg-slate-700 text-slate-400 group-hover:text-emerald-500 rounded-xl flex items-center justify-center mb-2 transition-all">
                        <Upload size={24} />
                      </div>
                      <p className="text-white font-bold text-sm">Click to upload space images</p>
                    </div>
                  </div>

                  {addImages.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {addImages.map((img, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700">
                          <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeAddImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 group flex items-center justify-center gap-3"
                  >
                    {addLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        Provision Ad Space
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main >
    </div >
  );
}
