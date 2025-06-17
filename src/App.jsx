import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "@/context/ChatContext";
import { AuthProvider } from "@/context/AuthContext";

import Layout from "@/components/Layout";
import AppRoutes from "@/routes/AppRoutes";
import PingOnlineStatus from "@/components/system/PingOnlineStatus";

export default function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <AuthProvider>
          <PingOnlineStatus />
          <Routes>
            <Route element={<Layout />}>
              <Route path="*" element={<AppRoutes />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ChatProvider>
    </BrowserRouter>
  );
}
