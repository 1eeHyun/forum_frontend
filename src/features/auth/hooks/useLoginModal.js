import { useContext } from "react";
import { LoginModalContext } from "../providers/LoginModalProvider";

export default function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) throw new Error("useLoginModal must be used within LoginModalProvider");
  return context;
}
