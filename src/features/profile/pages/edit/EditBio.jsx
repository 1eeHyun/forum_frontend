import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditForm from "@profile/components/edit/EditForm";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { updateBio } from "@profile/services/profileApi";

import MainLayout from "@/layout/MainLayout";

export default function EditBio() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  const MAX_LENGTH = 160;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (bio.length > MAX_LENGTH) {
      setError(`Bio must be ${MAX_LENGTH} characters or fewer.`);
      return;
    }

    try {
      await updateBio(username, bio);
      navigate(ROUTES.PROFILE_EDIT(username));
    } catch (err) {
      const msg = err.response?.data?.message || "Unexpected error occurred.";
      setError(msg);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setBio(value);
    if (value.length > MAX_LENGTH) {
      setError(`Bio must be ${MAX_LENGTH} characters or fewer.`);
    } else {
      setError("");
    }
  };

  return (
    <MainLayout>
      <EditForm
        label="Bio"
        value={bio}
        setValue={handleChange}
        onSubmit={handleSubmit}
        isTextarea
        error={error}
        helperText={`${bio.length}/${MAX_LENGTH} characters`}
      />
    </MainLayout>
  );
}
