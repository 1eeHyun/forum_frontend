// src/context/LoginModalContext.jsx
import { createContext, useContext, useState } from "react";
import LoginModal from "@/features/auth/components/LoginModal";

const LoginModalContext = createContext();

export const LoginModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLoginModal = () => setIsOpen(true);
  const closeLoginModal = () => setIsOpen(false);

  return (
    <LoginModalContext.Provider value={{ openLoginModal }}>
      {children}
      {isOpen && <LoginModal onClose={closeLoginModal} />}
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => useContext(LoginModalContext);
