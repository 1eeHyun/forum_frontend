import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { createCommunity } from "../services/communityApi";
import MainLayout from "@/layout/MainLayout";

export default function CreateCommunityPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  const MAX_NAME_LENGTH = 50;
  const MAX_DESC_LENGTH = 300;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.name.trim().length > MAX_NAME_LENGTH) {
      return setError(`Community name must be ${MAX_NAME_LENGTH} characters or fewer.`);
    }
    if (form.description.trim().length > MAX_DESC_LENGTH) {
      return setError(`Description must be ${MAX_DESC_LENGTH} characters or fewer.`);
    }

    try {
      await createCommunity(form);
      navigate(ROUTES.HOME);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      setError(msg || "Failed to create community");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white dark:bg-[#0e1012] text-black dark:text-white rounded-md border border-gray-300 dark:border-gray-700 shadow space-y-6">
        <h2 className="text-2xl font-bold text-center">Create a Community</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Community Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold">
              Community name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={MAX_NAME_LENGTH}
              placeholder="e.g. webtoon"
              className="w-full px-4 py-2 bg-white dark:bg-[#1a1c1f] border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {form.name.length}/{MAX_NAME_LENGTH}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-semibold">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              maxLength={MAX_DESC_LENGTH}
              placeholder="Tell us about your community"
              className="w-full px-4 py-2 bg-white dark:bg-[#1a1c1f] border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {form.description.length}/{MAX_DESC_LENGTH}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
