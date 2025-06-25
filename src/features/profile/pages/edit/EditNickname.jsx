import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditForm from "@profile/components/edit/EditForm";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { updateNickname } from "@profile/services/profileApi";

import MainLayout from "@/layout/MainLayout";

export default function EditNickname() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const MIN_LENGTH = 3;
  const MAX_LENGTH = 15;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (nickname.length < MIN_LENGTH || nickname.length > MAX_LENGTH) {
      setError(`Nickname must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`);
      return;
    }

    try {
      await updateNickname(username, nickname);
      navigate(ROUTES.PROFILE_EDIT(username));
    } catch (err) {
      const msg = err.response?.data?.message || "An unexpected error occurred.";
      setError(msg);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    if (value.length > MAX_LENGTH) {
      setError(`Nickname must be ${MAX_LENGTH} characters or fewer.`);
    } else {
      setError("");
    }
  };

  return (
    <MainLayout>
      <EditForm
        label="New Nickname"
        value={nickname}
        setValue={handleChange}
        onSubmit={handleSubmit}
        error={error}
        helperText={`${nickname.length}/${MAX_LENGTH} characters`}
      />
    </MainLayout>
  );
}
