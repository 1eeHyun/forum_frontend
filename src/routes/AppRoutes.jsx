import { Routes, Route } from "react-router-dom";
import HomePage from "@home/pages/HomePage";
import PrivateRoute from "./PrivateRoute";
import CommunityDetailPage from "@community/pages/CommunityDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/communities/:id" element={<CommunityDetailPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}

        {/* Login needed page */}
        <Route
            path="/profile"
            element={
            <PrivateRoute>
                {/* <ProfilePage /> */}                
            </PrivateRoute>
            }
        />
    </Routes>
  );
}
