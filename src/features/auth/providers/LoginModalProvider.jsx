// src/features/auth/providers/LoginModalProvider.jsx
import { createContext, useState } from "react";
import LoginModal from "../components/LoginModal";

export const LoginModalContext = createContext();

export default function LoginModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <LoginModalContext.Provider value={{ open, close }}>
      {children}
      {isOpen && <LoginModal onClose={close} />}
    </LoginModalContext.Provider>
  );
}
