import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  getMyCommunities,
  createPost,
  getCategoriesByCommunityId,
} from "@post/services/postApi";

import MediaUploadSection from "@/features/post/components/create/upload/MediaUploadSection";
import CommunityRightSidebar from "@community/components/sidebar/CommunityRightSidebar";
import MainLayout from "@/layout/MainLayout";

import SelectInput from "@/features/post/components/create/input/SelectInput";
import TextInput from "@/features/post/components/create/input/TextInput";
import TextareaInput from "@/features/post/components/create/input/TextAreaInput";
import ErrorMessage from "@post/components/create/ErrorMessage";
import { PrimaryButton, SecondaryButton } from "@post/components/create/Buttons";
import CommunitySelector from "@post/components/create/CommunitySelector";

import {
  TITLE_MAX,
  CONTENT_MAX,
  POST_VISIBILITY_OPTIONS,
  DEFAULT_FORM,
} from "@post/constants/postConstants";
import { POST_LABELS, POST_ERRORS } from "@post/constants/postLabels";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const communityFromState = location.state?.community;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]); // { fileUrl, type }

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
    if (!form.title.trim()) return POST_ERRORS.TITLE_REQUIRED;
    if (form.title.length > TITLE_MAX) return POST_ERRORS.TITLE_TOO_LONG(TITLE_MAX);
    if (form.content.length > CONTENT_MAX) return POST_ERRORS.CONTENT_TOO_LONG(CONTENT_MAX);
    if (form.visibility === "COMMUNITY" && !form.communityId) return POST_ERRORS.COMMUNITY_REQUIRED;
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
      communityId: form.visibility === "COMMUNITY" ? form.communityId : null,
      categoryId: selectedCategoryId,
      fileUrls: files, // [{ fileUrl, type }]
    };

    try {
      const res = await createPost(payload);
      const postId = res.data.data.id;
      navigate(`/posts/${postId}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      setError(msg || POST_ERRORS.POST_FAILED);
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
          <h2 className="text-2xl font-bold tracking-tight">{POST_LABELS.CREATE_POST_HEADING}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <SelectInput
              label={POST_LABELS.VISIBILITY}
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              options={POST_VISIBILITY_OPTIONS}
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
                    label={POST_LABELS.SELECT_CATEGORY}
                    name="categoryId"
                    value={selectedCategoryId || ""}
                    onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                    options={[
                      { value: "", label: POST_LABELS.CHOOSE_CATEGORY },
                      ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
                    ]}
                  />
                )}

                {form.communityId && categories.length === 0 && (
                  <p className="text-sm text-yellow-500 font-medium">
                    {POST_LABELS.NO_CATEGORY_WARNING}
                  </p>
                )}
              </>
            )}

            <TextInput
              label={POST_LABELS.TITLE}
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={TITLE_MAX}
              placeholder={POST_LABELS.TITLE}
              showCount
            />

            <TextareaInput
              label={POST_LABELS.CONTENT}
              name="content"
              value={form.content}
              onChange={handleChange}
              maxLength={CONTENT_MAX}
              placeholder={`Write your ${POST_LABELS.CONTENT.toLowerCase()}...`}
              rows={6}
              showCount
            />

            <MediaUploadSection
              files={files}
              setFiles={setFiles}
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
