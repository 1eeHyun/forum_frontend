import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "@/constants/apiRoutes";
import {
  getMyCommunities,
  createPost,
  getCategoriesByCommunityId,
} from "@post/services/postApi";

import ImageUploadSection from "@post/components/create/ImageUploadSection";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const communityFromState = location.state?.community;

  const TITLE_MAX = 150;
  const CONTENT_MAX = 5000;

  const [form, setForm] = useState({
    title: "",
    content: "",
    visibility: "PUBLIC",
    communityId: null,
  });

  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await getMyCommunities();
        setJoinedCommunities(res.data.data);
      } catch (err) {
        console.error("Failed to load communities:", err);
      }
    };
    fetchCommunities();
  }, []);

  // If community is passed from state, set it in the form
  useEffect(() => {
    if (communityFromState) {
      setForm((prev) => ({
        ...prev,
        visibility: "COMMUNITY",
        communityId: communityFromState.id,
      }));

      getCategoriesByCommunityId(communityFromState.id)
        .then((res) => setCategories(res.data.data))
        .catch((err) => {
          console.error("Failed to load categories:", err);
          setError("Failed to load categories.");
        });
    }
  }, [communityFromState]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "communityId") {
      const communityId = value ? Number(value) : null;

      setForm((prev) => ({
        ...prev,
        [name]: communityId,
      }));

      setSelectedCategoryId(null);
      setCategories([]);

      if (communityId) {
        try {
          const res = await getCategoriesByCommunityId(communityId);
          setCategories(res.data.data);
        } catch (err) {
          console.error("Failed to load categories:", err);
          setError("Failed to load categories.");
        }
      }

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Title is required.";
    if (form.title.length > TITLE_MAX) return `Title must be ${TITLE_MAX} characters or fewer.`;
    if (form.content.length > CONTENT_MAX) return `Content must be ${CONTENT_MAX} characters or fewer.`;
    if (form.visibility === "COMMUNITY" && !form.communityId) return "Please select a community.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      visibility: form.visibility,
      imageUrls,
      communityId: form.visibility === "COMMUNITY" ? form.communityId : null,
      categoryId: selectedCategoryId,
    };

    try {
      const res = await createPost(payload);
      const postId = res.data.data.id;
      navigate(API.ROUTES.HOME, { state: { postId } });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      setError(msg || "Post failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-[#0e1012] text-white rounded-md border border-gray-700 shadow space-y-6">
      <div className="text-xl font-semibold">Create post</div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Visibility */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Post visibility</label>
          <select
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
            className="px-4 py-2 bg-[#1a1c1f] border border-gray-600 rounded text-white"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="COMMUNITY">Community</option>
          </select>
        </div>

        {/* Community Selection */}
        {form.visibility === "COMMUNITY" && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Select a community</label>
              <select
                name="communityId"
                value={form.communityId || ""}
                onChange={handleChange}
                className="px-4 py-2 bg-[#1a1c1f] border border-gray-600 rounded text-white"
              >
                <option value="">Choose a community</option>
                {joinedCommunities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* If categories are loaded */}
            {form.communityId && categories.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Select a category</label>
                <select
                  name="categoryId"
                  value={selectedCategoryId || ""}
                  onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                  className="px-4 py-2 bg-[#1a1c1f] border border-gray-600 rounded text-white"
                >
                  <option value="">Choose a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* If no categories exist */}
            {form.communityId && categories.length === 0 && (
              <p className="text-sm text-yellow-400">
                This community has no categories. You cannot create a post in this community.
              </p>
            )}
          </>
        )}

        {/* Title Input */}
        <div className="relative">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={TITLE_MAX}
            placeholder="Title"
            className="w-full px-4 py-3 bg-[#1a1c1f] border border-gray-600 rounded text-white"
          />
          <span className="absolute bottom-2 right-3 text-xs text-gray-400">
            {form.title.length}/{TITLE_MAX}
          </span>
        </div>

        {/* Content Input */}
        <div className="relative">
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            maxLength={CONTENT_MAX}
            placeholder="Body text (optional)"
            rows={6}
            className="w-full px-4 py-3 bg-[#1a1c1f] border border-gray-600 rounded text-white resize-none"
          />
          <span className="absolute bottom-2 right-3 text-xs text-gray-400">
            {form.content.length}/{CONTENT_MAX}
          </span>
        </div>

        {/* Image Upload */}
        <ImageUploadSection
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          setError={setError}
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center font-medium">{error}</p>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-700 rounded"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={
              form.visibility === "COMMUNITY" &&
              form.communityId &&
              categories.length === 0
            }
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </form>

      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  );
}
