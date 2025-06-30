import { Routes, Route } from "react-router-dom";

import SignupPage from "@/features/auth/pages/SignupPage";
import LoginPage from "@/features/auth/pages/LoginPage";

import HomePage from "@home/pages/HomePage";
import PrivateRoute from "./PrivateRoute";

import PostDetailPage from "@post/pages/PostDetailPage";
import CreatePostPage from "@post/pages/CreatePostPage";

import CommunityDetailPage from "@community/pages/CommunityDetailPage";
import CommunityManagePage from "@community/pages/CommunityManagePage"; 

import ProfilePage from "@profile/pages/ProfilePage";
import ProfileEditPage from "@profile/pages/EditProfilePage";
import EditBio from "@profile/pages/edit/EditBio";
import EditNickname from "@profile/pages/edit/EditNickname";
import EditUsername from "@profile/pages/edit/EditUsername";
import EditProfileImage from "@profile/pages/edit/EditProfileImage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/communities/:id" element={<CommunityDetailPage />} />
      <Route path="/communities/:id/manage" element={<CommunityManagePage />} />

      <Route path="/posts/:id" element={<PostDetailPage />} />

      <Route
        path="/create-post"
        element={
          <PrivateRoute>
            <CreatePostPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile/:username"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile/:username/edit"
        element={
          <PrivateRoute>
            <ProfileEditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:username/edit/bio"
        element={
          <PrivateRoute>
            <EditBio />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:username/edit/nickname"
        element={
          <PrivateRoute>
            <EditNickname />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:username/edit/username"
        element={
          <PrivateRoute>
            <EditUsername />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:username/edit/picture"
        element={
          <PrivateRoute>
            <EditProfileImage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
