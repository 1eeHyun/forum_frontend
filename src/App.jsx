import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ChatProvider } from "@/context/ChatContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/layout/Navbar";
import AppRoutes from "@/routes/AppRoutes";
import LoginModalProvider from "@/features/auth/providers/LoginModalProvider";

export default function App() {
  return (
    <BrowserRouter>
      <ChatProvider>       
        <AuthProvider>     
          <ThemeProvider>
            <LoginModalProvider>
              <div className="bg-zinc-900 text-white min-h-screen">
                <Navbar />
                <AppRoutes />
              </div>
            </LoginModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </ChatProvider>
    </BrowserRouter>
  );
}

