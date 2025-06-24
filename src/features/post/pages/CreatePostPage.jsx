import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

import { API } from "@/constants/apiRoutes";
import {
  getMyCommunities,
  createPost,
  getCategoriesByCommunityId,
} from "@post/services/postApi";

import ImageUploadSection from "@post/components/create/ImageUploadSection";
import CommunityRightSidebar from "@community/components/sidebar/CommunityRightSidebar";
import MainLayout from "@/layout/MainLayout";

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
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  // 1. 커뮤니티 리스트 불러오기
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await getMyCommunities();
        console.log("communities:", res.data.data);
        setJoinedCommunities(res.data.data);
      } catch (err) {
        console.error("Failed to load communities:", err);
      }
    };
    fetchCommunities();
  }, []);

  // 2. location.state.community 값 반영
  useEffect(() => {
    if (communityFromState) {
      setForm((prev) => ({
        ...prev,
        visibility: "COMMUNITY",
        communityId: communityFromState.id,
      }));
      setSelectedCommunity(communityFromState);

      getCategoriesByCommunityId(communityFromState.id)
        .then((res) => setCategories(res.data.data))
        .catch((err) => {
          console.error("Failed to load categories:", err);
          setError("Failed to load categories.");
        });
    }
  }, [communityFromState]);

  // 3. form.communityId와 selectedCommunity 동기화
  useEffect(() => {
    if (
      form.visibility === "COMMUNITY" &&
      form.communityId &&
      joinedCommunities.length > 0
    ) {
      const found = joinedCommunities.find((c) => c.id === form.communityId);
      if (found) {
        setSelectedCommunity(found);
      }
    }
  }, [form.communityId, form.visibility, joinedCommunities]);

  // 4. 커뮤니티 선택 핸들러
  const handleSelectCommunity = async (community) => {
    setSelectedCommunity(community);
    setForm((prev) => ({
      ...prev,
      communityId: community?.id || null,
    }));
    setSelectedCategoryId(null);
    setCategories([]);

    if (community?.id) {
      try {
        const res = await getCategoriesByCommunityId(community.id);
        setCategories(res.data.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories.");
      }
    }
  };

  // 5. 폼 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 6. 폼 검증
  const validateForm = () => {
    if (!form.title.trim()) return "Title is required.";
    if (form.title.length > TITLE_MAX)
      return `Title must be ${TITLE_MAX} characters or fewer.`;
    if (form.content.length > CONTENT_MAX)
      return `Content must be ${CONTENT_MAX} characters or fewer.`;
    if (form.visibility === "COMMUNITY" && !form.communityId)
      return "Please select a community.";
    return null;
  };

  // 7. 폼 제출
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
      navigate(`/post/${postId}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      setError(msg || "Post failed");
    }
  };

  return (
    <MainLayout
      rightSidebar={
        form.visibility === "COMMUNITY" && form.communityId ? (
          <CommunityRightSidebar communityId={form.communityId} />
        ) : null
      }
    >
      <div className="w-full max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-card dark:bg-black border border-border dark:border-dark-card rounded-2xl shadow-md p-6 space-y-6 text-foreground dark:text-white">
          <h2 className="text-2xl font-bold tracking-tight">Create a new post</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visibility */}
            <div>
              <label className="block text-sm font-semibold mb-1">Post visibility</label>
              <select
                name="visibility"
                value={form.visibility}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border dark:border-dark-card-bg bg-input-bg dark:bg-dark-action text-input-text dark:text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
                <option value="COMMUNITY">Community</option>
              </select>
            </div>

            {/* Community selection */}
            {form.visibility === "COMMUNITY" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Select a community</label>
                  <Listbox value={selectedCommunity} onChange={handleSelectCommunity}>
                    <div className="relative">
                      <Listbox.Button className="w-full bg-input-bg dark:bg-dark-action text-input-text dark:text-white border border-border dark:border-dark-card-bg rounded-lg px-4 py-2 text-left flex items-center justify-between">
                        <span className="flex items-center gap-2 truncate">
                          {selectedCommunity?.imageDTO?.imageUrl && (
                            <img
                              src={selectedCommunity.imageDTO.imageUrl}
                              className="w-6 h-6 rounded-full object-cover"
                              alt="community"
                            />
                          )}
                          <span className="truncate">{selectedCommunity?.name || "Choose a community"}</span>
                        </span>
                        <ChevronUpDownIcon className="h-5 w-5 text-muted dark:text-muted" />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-card dark:bg-dark-card-bg py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          {joinedCommunities.map((c) => (
                            <Listbox.Option
                              key={c.id}
                              value={c}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                  active ? "bg-primary text-white" : "text-foreground dark:text-white"
                                }`
                              }
                            >
                              {({ selected }) => (
                                <div className="flex items-center gap-2">
                                  <img
                                    src={c.imageDTO?.imageUrl}
                                    className="w-6 h-6 rounded-full object-cover"
                                    alt={c.name}
                                  />
                                  <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                                    {c.name}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                      <CheckIcon className="h-5 w-5 text-white" />
                                    </span>
                                  )}
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                {/* Category select */}
                {form.communityId && categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold mb-1">Select a category</label>
                    <select
                      name="categoryId"
                      value={selectedCategoryId || ""}
                      onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border border-border dark:border-dark-card-bg bg-input-bg dark:bg-dark-action text-input-text dark:text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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

                {form.communityId && categories.length === 0 && (
                  <p className="text-sm text-yellow-500 font-medium">
                    This community has no categories. You cannot create a post in this community.
                  </p>
                )}
              </div>
            )}

            {/* Title */}
            <div className="relative">
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={TITLE_MAX}
                placeholder="Post title"
                className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark-card-bg bg-input-bg dark:bg-dark-action text-input-text dark:text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute bottom-2 right-3 text-xs text-muted-foreground dark:text-muted">
                {form.title.length}/{TITLE_MAX}
              </span>
            </div>

            {/* Content */}
            <div className="relative">
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                maxLength={CONTENT_MAX}
                placeholder="Write your post content..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark-card-bg bg-input-bg dark:bg-dark-action text-input-text dark:text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <span className="absolute bottom-2 right-3 text-xs text-muted-foreground dark:text-muted">
                {form.content.length}/{CONTENT_MAX}
              </span>
            </div>

            {/* Image Upload */}
            <ImageUploadSection
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
              setError={setError}
            />

            {/* Error */}
            {error && (
              <div className="text-red-500 text-sm text-center font-medium">{error}</div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm bg-muted text-white hover:bg-muted/80 transition"
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
                className="px-4 py-2 rounded-lg text-sm bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}