import { createContext, useState, useContext } from "react";
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

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error("useLoginModal must be used within a LoginModalProvider");
  }
  return context;
}
