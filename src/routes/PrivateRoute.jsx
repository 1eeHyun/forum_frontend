import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "@/features/auth/components/LoginModal";
import { useAuth } from "@/context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);    
    navigate(location.pathname);
  };

  if (!isLoggedIn) {    
    return <LoginModal onClose={handleCloseModal} />;
  }

  return children;
}
