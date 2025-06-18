import { Routes, Route } from "react-router-dom";
import HomePage from "@home/pages/HomePage";
import CommunityDetailPage from "@community/pages/CommunityDetailPage";
import CommunityManagePage from "@community/pages/CommunityManagePage";
import PrivateRoute from "./PrivateRoute"; // PrivateRoute 컴포넌트

export default function AppRoutes() {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<HomePage />} />

      {/* Community Detail Page */}
      <Route path="/communities/:id" element={<CommunityDetailPage />} />

      {/* Login needed page */}
      <Route
        path="/communities/:id/manage"
        element={
          <PrivateRoute>
            <CommunityManagePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
