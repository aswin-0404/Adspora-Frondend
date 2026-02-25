import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { WishlistContext } from "../../context/wishlistContext";
import { AuthContext } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://adspora-frondend.vercel.app";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [imageIndex, setImageIndex] = useState({});
  const navigate = useNavigate()

  const token = localStorage.getItem("access");
  const { setWishlistCount } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/wishlist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setWishlist(data);
      setWishlistCount(data.length);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const removeFromWishlist = async (spaceId) => {
    try {
      await axios.post(
        `${BASE_URL}/wishlist/${spaceId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist((prev) => prev.filter((item) => item.space.id !== spaceId));
      setWishlistCount((count) => Math.max(count - 1, 0));
    } catch (error) {
      console.error("Remove wishlist error", error);
    }
  };

  useEffect(() => {
    if (!token) {
      setWishlist([]);
      setWishlistCount(0);
      return;
    }
    fetchWishlist();
  }, [token, user]);

  const prevImage = (id, length) => {
    setImageIndex((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : length - 1,
    }));
  };

  const nextImage = (id, length) => {
    setImageIndex((prev) => ({
      ...prev,
      [id]: prev[id] < length - 1 ? prev[id] + 1 : 0,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            Your wishlist is empty
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => {
              const space = item.space;
              const images = space.images || [];
              const current = imageIndex[space.id] || 0;

              return (
                <div
                  key={item.id || (item.space && item.space.id)}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  <div className="relative h-48">
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
                          className="absolute top-1/2 left-2 bg-white/80 p-1 rounded-full"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={() => nextImage(space.id, images.length)}
                          className="absolute top-1/2 right-2 bg-white/80 p-1 rounded-full"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">{space.title}</h2>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${space.booked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                          }`}
                      >
                        {space.booked ? "Booked" : "Available"}
                      </span>
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

                    <p className="text-sm text-gray-700">
                      {space.description}
                    </p>

                    <div className="pt-4 flex gap-3">
                      <button
                        onClick={() => removeFromWishlist(space.id)}
                        className="flex-1 py-2 text-sm font-medium rounded-lg
                                   bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        Remove
                      </button>

                      <button
                        onClick={() => navigate(`/space/booking/${space.id}`)}
                        disabled={space.booked}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg ${space.booked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                      >
                        Grab Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

