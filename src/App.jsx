import { BrowserRouter } from "react-router-dom";
import { ChatProvider } from "@/context/ChatContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/layout/Navbar";
import AppRoutes from "@/routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <AuthProvider> 
          <div className="bg-zinc-900 text-white min-h-screen">
            <Navbar />
            <AppRoutes />
          </div>
        </AuthProvider>
      </ChatProvider>
    </BrowserRouter>
  );
}
