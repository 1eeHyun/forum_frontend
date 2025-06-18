import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Plus } from "lucide-react";

export default function ManageCategoriesSection({ communityId }) {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`/communities/${communityId}/categories`);
      setCategories(res.data.data);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [communityId]);

  const handleChange = (key, value) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === currentIndex ? { ...cat, [key]: value } : cat
      )
    );
  };

  const handleAdd = () => {
    setCategories((prev) => [...prev, { name: "", description: "", id: null }]);
    setCurrentIndex(categories.length); 
  };

  const handleDelete = async () => {
    const target = categories[currentIndex];
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    if (!target.id) {
      const updated = categories.filter((_, i) => i !== currentIndex);
      setCategories(updated);
      setCurrentIndex((i) => Math.max(0, i - 1));
      return;
    }

    try {
      await axios.delete(`/communities/${communityId}/categories/${target.id}`);
      await fetchCategories();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all(
        categories.map((cat) => {
          if (!cat.name && !cat.description) return;
          if (cat.id) {
            return axios.put(`/communities/${communityId}/categories/${cat.id}`, {
              name: cat.name,
              description: cat.description,
            });
          } else {
            return axios.post(`/communities/${communityId}/categories`, {
              name: cat.name,
              description: cat.description,
            });
          }
        })
      );
      await fetchCategories();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const current = categories[currentIndex];

  return (
    <div className="bg-black border border-gray-700 rounded-xl p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-semibold">Manage Categories</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="w-10 h-10 rounded-full hover:bg-gray-700 flex items-center justify-center text-white"
            title="Add Category"
          >
            <Plus size={30} />
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-full text-base bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            Save All
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-400">No categories yet.</p>
      ) : (
        <div className="bg-black border border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white text-lg font-semibold">
              Category {currentIndex + 1} of {categories.length}
            </h3>
            <button
              onClick={handleDelete}
              className="text-sm text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-base text-gray-300 mb-1">Name</label>
              <input
                placeholder="Enter category name"
                value={current.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 bg-black text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <textarea
                placeholder="Enter description"
                rows={5}
                value={current.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-3 py-2 bg-black text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &larr; Previous
            </button>
            <button
              disabled={currentIndex === categories.length - 1}
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
