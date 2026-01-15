import React, { useEffect, useState } from "react";
import axios from "axios";
import OwnerNavbar from "./OwnerNav";

const MySpace = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState({}); // per-space image index

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/get/space/", {
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

  if (loading) {
    return <p className="text-center mt-10">Loading spaces...</p>;
  }

  return (
    <>
      <OwnerNavbar />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Spaces</h1>

        {spaces.length === 0 ? (
          <p className="text-gray-500">No spaces added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => {
              const images = space.images || [];
              const current = imageIndex[space.id] || 0;

              return (
                <div
                  key={space.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  {/* IMAGE CAROUSEL */}
                  <div className="relative w-full h-48">
                    <img
                      src={
                        images.length > 0
                          ? images[current].image
                          : "/no-image.png"
                      }
                      alt={space.title}
                      className="w-full h-48 object-cover"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(space.id, images.length)}
                          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
                        >
                          ‹
                        </button>

                        <button
                          onClick={() => nextImage(space.id, images.length)}
                          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">{space.title}</h2>

                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          space.is_approved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {space.is_approved ? "Approved" : "Pending"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">📍 {space.location}</p>

                    <p className="text-sm">
                      <span className="font-medium">Type:</span>{" "}
                      {space.space_type}
                    </p>

                    <p className="text-sm">
                      <span className="font-medium">Size:</span> {space.size}
                    </p>

                    <p className="text-sm">
                      <span className="font-medium">Price:</span> ₹
                      {space.price}
                    </p>

                    <p className="text-sm text-gray-700 line-clamp-2">
                      {space.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MySpace;
