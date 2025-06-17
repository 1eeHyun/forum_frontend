import { Routes, Route } from "react-router-dom";
import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

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
