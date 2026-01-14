import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/api";

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

  const [images, setImages] = useState([]); // store as array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add Advertisement Space
      </h2>

      {error && (
        <div className="mb-4 text-red-600 font-medium">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-5"
      >
        <input
          type="text"
          name="title"
          placeholder="Space Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <select
          name="space_type"
          value={formData.space_type}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        >
          <option value="">Select Space Type</option>
          <option value="Billboard">Billboard</option>
          <option value="Hoarding">Hoarding</option>
          <option value="LED">LED</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="size"
          placeholder="Size (e.g. 10x20 ft)"
          value={formData.size}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        {/* 🔥 MODERN IMAGE UPLOAD */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload Images
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
            <input
              type="file"
              id="imageUpload"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <label htmlFor="imageUpload" className="cursor-pointer">
              <p className="text-gray-600">
                Click to upload or drag & drop images
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PNG, JPG supported
              </p>
            </label>
          </div>

          {/* IMAGE PREVIEW */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="h-32 w-full object-cover rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white
                               w-6 h-6 rounded-full hidden group-hover:flex
                               items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg
                     hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Add Space"}
        </button>
      </form>
    </div>
  );
}
