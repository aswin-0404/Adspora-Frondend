import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Heart, MessageCircle, ChevronLeft, ChevronRight, Sparkles, X, Send, Search, MapPin, Layout } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { WishlistContext } from "../../context/wishlistContext";
import { AuthContext } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const BASE_URL = "https://adspora.onrender.com/api";

export default function SpaceListing() {
  const [spaces, setSpaces] = useState([]);
  const [imageIndex, setImageIndex] = useState({});
  const [wishlistMap, setWishlistMap] = useState({});

  const [query, setQuery] = useState("");
  const [aiRply, setAiRply] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiHelp, setAiHelp] = useState(false);

  const token = localStorage.getItem("access");
  const { setWishlistCount } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setWishlistMap({});
      setWishlistCount(0);
      return;
    }
    const loadData = async () => {
      await fetchSpaces();
      await fetchWishlist();
    };
    loadData();
  }, [token, user]);

  const fetchSpaces = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/spaces/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpaces(res.data);
    } catch (error) {
      console.error("Error fetching spaces", error);
    }
  };

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/wishlist/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      const map = {};
      data.forEach((item) => {
        if (item.space && item.space.id) {
          map[item.space.id] = true;
        }
      });
      setWishlistMap(map);
      setWishlistCount(data.length);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const handleAddToWishlist = async (spaceId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/wishlist/${spaceId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const currentlyWishlisted = !!wishlistMap[spaceId];
      const newStatus = res.data.wishlisted !== undefined ? res.data.wishlisted : !currentlyWishlisted;

      setWishlistMap((prev) => ({ ...prev, [spaceId]: newStatus }));
      setWishlistCount((count) => newStatus ? count + 1 : Math.max(count - 1, 0));
    } catch (error) {
      console.error("Wishlist error", error);
    }
  };

  const handleChat = async (space) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/chat/room-exists/?space=${space.id}&owner=${space.owner.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/chat/${res.data.room_id}`);
    } catch (err) {
      console.error("Chat check failed", err);
    }
  };

  const handleAiSearch = async () => {
    if (!query.trim()) return;
    setLoadingAi(true);
    setAiRply("");
    try {
      const res = await axios.post(
        `${BASE_URL}/ai-search/`,
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiRply(res.data.replay);
      setSpaces(res.data.results);
      setQuery("");
    } catch (err) {
      console.log("AI search failed", err);
    } finally {
      setLoadingAi(false);
    }
  };

  const suggestions = [
    "Cheap ad spaces in Kochi",
    "LED advertisement under 50000",
    "Billboards near highway",
    "Ad spaces in Trivandrum under 20000",
  ];

  const handleAiClose = () => {
    setAiHelp(false);
    fetchSpaces();
  };

  const prevImage = (spaceId, length) => {
    setImageIndex((prev) => ({
      ...prev,
      [spaceId]: prev[spaceId] > 0 ? prev[spaceId] - 1 : length - 1,
    }));
  };

  const nextImage = (spaceId, length) => {
    setImageIndex((prev) => ({
      ...prev,
      [spaceId]: prev[spaceId] < length - 1 ? prev[spaceId] + 1 : 0,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Explore Spaces
            </h1>
            <p className="text-gray-500 mt-1">Find the perfect spot for your campaign</p>
          </div>

          {!aiHelp && (
            <Button
              onClick={() => setAiHelp(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity border-0"
            >
              <Sparkles size={18} />
              AI Assistant
            </Button>
          )}
        </div>

        {aiHelp && (
          <div className="bg-white border border-indigo-100 shadow-xl rounded-2xl p-6 mb-10 relative animate-slide-up overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <button
              onClick={handleAiClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 rounded-full p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Space Finder</h2>
                <p className="text-sm text-gray-500">
                  Describe what you're looking for in natural language
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., 'Looking for digital billboards in Bangalore under 50k'"
                  className="bg-gray-50 focus:bg-white transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                />
              </div>

              <Button
                onClick={handleAiSearch}
                isLoading={loadingAi}
                className="shrink-0"
              >
                <div className="flex items-center gap-2">
                  Ask AI <Send size={16} />
                </div>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {suggestions.map((text, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(text);
                    handleAiSearch();
                  }}
                  className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100"
                >
                  {text}
                </button>
              ))}
            </div>

            {aiRply && !loadingAi && (
              <div className="mt-6 bg-indigo-50/50 border border-indigo-100 p-5 rounded-xl animate-fade-in">
                <div className="flex gap-3">
                  <div className="text-2xl">🤖</div>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {aiRply}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {spaces.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No spaces found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaces.map((space) => {
              const images = space.images || [];
              const current = imageIndex[space.id] || 0;
              const isWishlisted = wishlistMap[space.id];

              return (
                <div
                  key={space.id}
                  className="bg-white rounded-[2rem] overflow-hidden border border-gray-100/80 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                    {images.length > 0 ? (
                      <img
                        src={images[current].image}
                        alt={space.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-300">
                        <MapPin size={48} opacity={0.2} />
                      </div>
                    )}

                    <div className="absolute top-4 left-4">
                      <div className={`px-3 py-1 rounded-lg text-[11px] font-bold shadow-sm backdrop-blur-md border flex items-center gap-2 ${space.booked
                        ? "bg-white/90 text-red-600 border-red-100"
                        : "bg-white/90 text-emerald-600 border-emerald-100"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${space.booked ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                        {space.booked ? "Booked" : "Available"}
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToWishlist(space.id); }}
                      className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border z-10 ${isWishlisted
                        ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30"
                        : "bg-white/20 text-white border-white/40 hover:bg-white hover:text-rose-500"
                        }`}
                    >
                      <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
                    </button>

                    {images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
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
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-1 uppercase tracking-tight mb-2">
                          {space.title}
                        </h2>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold">
                          <MapPin size={12} className="text-indigo-500" />
                          <span>{space.location}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-black text-gray-900 tracking-tighter tabular-nums">₹{space.price.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">/ Month</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-100">
                        {space.space_type}
                      </span>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100/50">
                        {space.size}
                      </span>
                    </div>


                    <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col gap-3">
                      <button
                        onClick={() => handleChat(space)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-100 rounded-xl font-bold text-sm transition-all"
                      >
                        <MessageCircle size={18} /> Chat with Owner
                      </button>
                      <button
                        disabled={space.booked}
                        onClick={() => navigate(`/space/booking/${space.id}`)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${space.booked
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                          }`}
                      >
                        <Layout size={18} /> {space.booked ? "Already Booked" : "Grab This Space"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
