import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditForm from "@profile/components/edit/EditForm";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { updateUsername } from "@profile/services/profileApi";

import MainLayout from "@/layout/MainLayout";

export default function EditUsername() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");

  const MIN_LENGTH = 6;
  const MAX_LENGTH = 15;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newUsername.length < MIN_LENGTH || newUsername.length > MAX_LENGTH) {
      setError(`Username must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`);
      return;
    }

    try {
      const res = await updateUsername(username, newUsername);

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("username", newUsername);
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("userInfoUpdated"));

      navigate(ROUTES.PROFILE_EDIT(newUsername));
    } catch (err) {
      const msg = err.response?.data?.message || "An unexpected error occurred.";
      setError(msg);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setNewUsername(value);
    if (value.length > MAX_LENGTH) {
      setError(`Username must be ${MAX_LENGTH} characters or fewer.`);
    } else {
      setError("");
    }
  };

  return (
    <MainLayout>
      <EditForm
        label="New Username"
        value={newUsername}
        setValue={handleChange}
        onSubmit={handleSubmit}
        error={error}
        helperText={`${newUsername.length}/${MAX_LENGTH} characters`}
      />
    </MainLayout>
  );
}
