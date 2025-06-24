import { Routes, Route } from "react-router-dom";
import HomePage from "@home/pages/HomePage";
import PrivateRoute from "./PrivateRoute";
import PostDetailPage from "@post/pages/PostDetailPage";
import CommunityDetailPage from "@community/pages/CommunityDetailPage";
import CommunityManagePage from "@community/pages/CommunityManagePage"; 
import ProfilePage from "@profile/pages/ProfilePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/communities/:id" element={<CommunityDetailPage />} />
      <Route path="/communities/:id/manage" element={<CommunityManagePage />} />
      <Route path="/post/:id" element={<PostDetailPage />} />

      <Route
        path="/profile/:username"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
