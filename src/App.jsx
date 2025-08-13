import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ChatProvider } from "@/context/ChatContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

import LoginModalProvider from "@/features/auth/providers/LoginModalProvider";
import Navbar from "@/layout/Navbar";
import AppRoutes from "@/routes/AppRoutes";
import ChatDock from "@chat/components/ChatDock";

export default function App() {
  return (
    <BrowserRouter>
      <ChatProvider>       
        <AuthProvider>     
          <ThemeProvider>
            <LoginModalProvider>

              {/* Main Layout */}
              <div className="bg-zinc-900 text-white min-h-screen">
                <Navbar />
                <AppRoutes />
              </div>
              
              {/* Chat Dock */}
              <ChatDock />
              
            </LoginModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </ChatProvider>
    </BrowserRouter>
  );
}

