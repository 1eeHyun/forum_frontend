import LoginModal from "@/features/auth/components/LoginModal";
import { useAuth } from "@/context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <LoginModal onClose={() => {}} />;
  }

  return children;
}
