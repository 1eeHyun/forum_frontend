import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  getMyCommunities,
  createPost,
  getCategoriesByCommunityId,
} from "@post/services/postApi";

import ImageUploadSection from "@post/components/create/ImageUploadSection";
import CommunityRightSidebar from "@community/components/sidebar/CommunityRightSidebar";
import MainLayout from "@/layout/MainLayout";

import SelectInput from "@post/components/create/SelectInput";
import TextInput from "@post/components/create/TextInput";
import TextareaInput from "@post/components/create/TextareaInput";
import ErrorMessage from "@post/components/create/ErrorMessage";
import { PrimaryButton, SecondaryButton } from "@post/components/create/Buttons";
import CommunitySelector from "@post/components/create/CommunitySelector";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
            <SelectInput
              label="Post visibility"
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              options={[
                { value: "PUBLIC", label: "Public" },
                { value: "PRIVATE", label: "Private" },
                { value: "COMMUNITY", label: "Community" },
              ]}
            />

            {form.visibility === "COMMUNITY" && (
              <>
                <CommunitySelector
                  communities={joinedCommunities}
                  selected={selectedCommunity}
                  onSelect={handleSelectCommunity}
                />

                {form.communityId && categories.length > 0 && (
                  <SelectInput
                    label="Select a category"
                    name="categoryId"
                    value={selectedCategoryId || ""}
                    onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                    options={[
                      { value: "", label: "Choose a category" },
                      ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
                    ]}
                  />
                )}

                {form.communityId && categories.length === 0 && (
                  <p className="text-sm text-yellow-500 font-medium">
                    This community has no categories. You cannot create a post in this
                    community.
                  </p>
                )}
              </>
            )}

            <TextInput
              label="Post title"
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={TITLE_MAX}
              placeholder="Post title"
              showCount
            />

            <TextareaInput
              label="Content"
              name="content"
              value={form.content}
              onChange={handleChange}
              maxLength={CONTENT_MAX}
              placeholder="Write your post content..."
              rows={6}
              showCount
            />

            <ImageUploadSection
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
              setError={setError}
            />

            {error && <ErrorMessage message={error} />}

            <div className="flex justify-end gap-3">
              <SecondaryButton>Save Draft</SecondaryButton>
              <PrimaryButton
                disabled={
                  form.visibility === "COMMUNITY" &&
                  form.communityId &&
                  categories.length === 0
                }
              >
                Post
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
