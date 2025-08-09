// PostForm.jsx

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SelectInput from "@/features/post/components/create/input/SelectInput";
import TextInput from "@/features/post/components/create/input/TextInput";
import TextareaInput from "@/features/post/components/create/input/TextAreaInput";
import ErrorMessage from "@post/components/create/ErrorMessage";
import { PrimaryButton, SecondaryButton } from "@post/components/create/Buttons";
import CommunitySelector from "@post/components/create/CommunitySelector";
import MediaUploadSection from "@/features/post/components/create/upload/MediaUploadSection";
import CommunityRightSidebar from "@community/components/sidebar/CommunityRightSidebar";
import MainLayout from "@/layout/MainLayout";

import TagInput from "@/features/post/components/create/input/TagInput";

import {
  TITLE_MAX,
  CONTENT_MAX,
  POST_VISIBILITY_OPTIONS,
  DEFAULT_FORM,
} from "@post/constants/postConstants";
import { POST_LABELS, POST_ERRORS } from "@post/constants/postLabels";
import { getMyCommunities, getCategoriesByCommunityId } from "@post/services/postApi";

export default function PostForm({ mode = "create", initialData = {}, onSubmit, error }) {
  const location = useLocation();
  const communityFromState = location.state?.community;

  const [form, setForm] = useState({ ...DEFAULT_FORM, ...initialData });
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [categories, setCategories] = useState(initialData.categories || []);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialData.categoryId ?? null
  );
  const [selectedCommunity, setSelectedCommunity] = useState(initialData.community || null);
  const [files, setFiles] = useState(initialData.files || []);
  const [localError, setLocalError] = useState("");

  // Tags state (for PUBLIC visibility)
  const [tags, setTags] = useState(initialData.tags || []);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await getMyCommunities();
        setJoinedCommunities(res.data.data);

        if (mode === "create" && communityFromState) {
          const found = res.data.data.find((c) => c.id === communityFromState.id);
          if (found) {
            setForm((prev) => ({ ...prev, visibility: "COMMUNITY", communityId: found.id }));
            setSelectedCommunity(found);
            const catRes = await getCategoriesByCommunityId(found.id);
            setCategories(catRes.data.data);
          }
        }
      } catch (err) {
        console.error("Failed to load communities:", err);
      }
    };
    fetchCommunities();
  }, [mode, communityFromState]);

  useEffect(() => {
    if (form.communityId) {
      getCategoriesByCommunityId(form.communityId)
        .then((res) => setCategories(res.data.data))
        .catch(() => setCategories([]));
    }
  }, [form.communityId]);

  const handleSelectCommunity = async (community) => {
    setSelectedCommunity(community);
    setForm((prev) => ({ ...prev, communityId: community?.id || null }));
    setSelectedCategoryId(null);
    setCategories([]);

    if (community?.id) {
      try {
        const res = await getCategoriesByCommunityId(community.id);
        setCategories(res.data.data);
      } catch {
        setCategories([]);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.title.trim()) return POST_ERRORS.TITLE_REQUIRED;
    if (form.title.length > TITLE_MAX) return POST_ERRORS.TITLE_TOO_LONG(TITLE_MAX);
    if (form.content.length > CONTENT_MAX) return POST_ERRORS.CONTENT_TOO_LONG(CONTENT_MAX);
    if (form.visibility === "COMMUNITY" && !form.communityId) return POST_ERRORS.COMMUNITY_REQUIRED;
    if (form.visibility === "COMMUNITY" && categories.length > 0 && !selectedCategoryId)
      return POST_ERRORS.CATEGORY_REQUIRED;
    // If PUBLIC, require at least one tag
    if (form.visibility === "PUBLIC" && tags.length === 0)
      return "Public posts must have at least 1 tag.";
    if (tags.length > 5) return "You can add up to 5 tags only.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      visibility: form.visibility,
      communityId: form.visibility === "COMMUNITY" ? form.communityId : null,
      categoryId: selectedCategoryId,
      fileUrls: files,
      // Send tags only for PUBLIC posts
      tags: form.visibility === "PUBLIC" ? tags : undefined,
    };

    onSubmit?.(payload);
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
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? POST_LABELS.EDIT_POST_HEADING : POST_LABELS.CREATE_POST_HEADING}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <SelectInput
              label={POST_LABELS.VISIBILITY}
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              options={POST_VISIBILITY_OPTIONS}
            />

            {/* Tag input only for PUBLIC posts */}
            {form.visibility === "PUBLIC" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Tags (max 5)</label>
                <TagInput value={tags} onChange={setTags} max={5} />
              </div>
            )}

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
                    value={selectedCategoryId ?? ""}
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

            <MediaUploadSection files={files} setFiles={setFiles} setError={setLocalError} />

            {(localError || error) && <ErrorMessage message={localError || error} />}

            <div className="flex justify-end gap-3">
              <SecondaryButton type="button">Save Draft</SecondaryButton>
              <PrimaryButton
                disabled={
                  (form.visibility === "COMMUNITY" && form.communityId && categories.length === 0) ||
                  (form.visibility === "PUBLIC" && tags.length === 0)
                }
              >
                {mode === "edit" ? "Update" : "Post"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
