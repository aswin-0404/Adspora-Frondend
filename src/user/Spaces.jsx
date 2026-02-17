import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "./Nav";
import { useContext } from "react";
import { WishlistContext } from "../context/wishlistContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function SpaceListing() {
  const [spaces, setSpaces] = useState([]);
  const [imageIndex, setImageIndex] = useState({});
  const [wishlistMap, setWishlistMap] = useState({});

  const [query, setQuery] = useState("");
  const [aiRply, setAiRply] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiHelp, setAiHelp] = useState(false);

  const token = localStorage.getItem("access");

  const { wishlistCount, setWishlistCount } = useContext(WishlistContext);

  const navigate = useNavigate();

  const handleChat = async (space) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/chat/room-exists/?space=${space.id}&owner=${space.owner.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    navigate(`/chat/${res.data.room_id}`);

  } catch (err) {
    console.error("Chat check failed", err);
  }
};


  const fetchSpaces = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/spaces/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSpaces(res.data);
    } catch (error) {
      console.error("Error fetching spaces", error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/wishlist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const map = {};

      res.data.forEach((item) => {
        map[item.space.id] = true;
      });

      setWishlistMap(map);

      setWishlistCount(res.data.length);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const handleAddToWishlist = async (spaceId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/wishlist/${spaceId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const isWishlisted = res.data.wishlisted;

      setWishlistMap((prev) => ({
        ...prev,
        [spaceId]: isWishlisted,
      }));

      setWishlistCount((count) =>
        isWishlisted ? count + 1 : Math.max(count - 1, 0)
      );
    } catch (error) {
      console.error("Wishlist error", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      await fetchSpaces();
      await fetchWishlist();
    };

    loadData();
  }, [token]);

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

  const handleAiSearch = async () => {
    if (!query.trim()) return;

    setLoadingAi(true);
    setAiRply("");

    try {
      const res = await axios.post(
        `${BASE_URL}/ai-search/`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-6">
          Available Advertisement Spaces
        </h1>

        {aiHelp ? (
          <div className="bg-white border shadow-lg rounded-2xl p-6 mb-10 relative">
            <button
              onClick={handleAiClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🤖</div>
              <div>
                <h2 className="text-lg font-semibold">AI Space Finder</h2>
                <p className="text-sm text-gray-500">
                  Describe your requirement in natural language
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Example: cheap hoarding in Kochi under 20000"
                className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={handleAiSearch}
                className="bg-indigo-600 text-white px-6 rounded-lg hover:bg-indigo-700 transition"
              >
                Ask AI
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {suggestions.map((text, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(text);
                    handleAiSearch(text);
                  }}
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100"
                >
                  {text}
                </button>
              ))}
            </div>

            {loadingAi && (
              <div className="mt-6 text-gray-500">🤖 Thinking...</div>
            )}

            {aiRply && !loadingAi && (
              <div className="mt-6 bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  🤖 {aiRply}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-10">
            <button
              onClick={() => setAiHelp(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow"
            >
              🤖 AI Support
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spaces.map((space) => {
            const images = space.images || [];
            const current = imageIndex[space.id] || 0;

            return (
              <div
                key={space.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {images.length > 0 ? (
                    <img
                      src={images[current].image}
                      alt={space.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-200">
                      No Image
                    </div>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(space.id, images.length)}
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <button
                        onClick={() => nextImage(space.id, images.length)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-semibold">{space.title}</h2>

                    <div className="text-right">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          space.booked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {space.booked ? "Booked" : "Available"}
                      </span>

                      {space.booked && space.booking_details && (
                        <p className="text-xs text-gray-500 mt-1">
                          Until{" "}
                          {new Date(
                            new Date(space.booking_details.booked_at).setMonth(
                              new Date(
                                space.booking_details.booked_at
                              ).getMonth() + space.booking_details.months
                            )
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {space.space_type}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Location:</strong> {space.location}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Size:</strong> {space.size}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Price:</strong> ₹{space.price}
                  </p>

                  <p className="text-sm text-gray-700">{space.description}</p>

                  <p className="text-xs text-gray-400">
                    Posted on {new Date(space.created_at).toLocaleDateString()}
                  </p>

                  <div className="pt-4 space-y-3">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleAddToWishlist(space.id)}
                        title="Add to Wishlist"
                        className={`p-2 border rounded-full transition ${
                          wishlistMap[space.id]
                            ? "bg-red-50 text-red-600 border-red-300"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {wishlistMap[space.id] ? (
                          <Heart
                            size={18}
                            className="text-red-600 fill-current"
                          />
                        ) : (
                          <Heart size={18} />
                        )}
                      </button>

                      <button onClick={() => handleChat(space)}>
                        <MessageCircle size={18} />
                      </button>
                    </div>

                    <button
                      onClick={() => navigate(`/space/booking/${space.id}`)}
                      disabled={space.booked}
                      className={`w-full py-2 text-sm font-medium rounded-lg transition ${
                        space.booked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {space.booked ? "Already Booked" : "Grab the Space"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
