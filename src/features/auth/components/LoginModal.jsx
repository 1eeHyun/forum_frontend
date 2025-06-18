import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/features/auth/services/authApi";
import { LOGIN_LABELS } from "@/constants/labels/uiLabels";
import { ROUTES } from "@/constants/apiRoutes/routes";

export default function LoginModal({ onClose }) {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const { setUsername, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(form);
      const token = response.data.data?.token || response.data.token || response.data;
      const username = response.data.data?.username;

      localStorage.setItem("token", token);
      if (username) {
        localStorage.setItem("username", username);
        setUsername(username);
      }

      setIsLoggedIn(true);
      window.dispatchEvent(new Event("storage"));
      onClose();
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      const status = err.response?.status;
      setError(msg || `${LOGIN_LABELS.ERROR_DEFAULT} (status ${status})`);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white dark:bg-[#0e1012] text-black dark:text-white">
        <h2 className="text-xl font-bold mb-4">{LOGIN_LABELS.TITLE}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="usernameOrEmail"
            value={form.usernameOrEmail}
            onChange={handleChange}
            placeholder={LOGIN_LABELS.USERNAME_OR_EMAIL}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1c1f] text-black dark:text-white"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={LOGIN_LABELS.PASSWORD}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1c1f] text-black dark:text-white"
          />

          <button
            type="submit"
            className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            {LOGIN_LABELS.SUBMIT}
          </button>

          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate(ROUTES.SIGNUP)}
            className="text-blue-500 dark:text-blue-400 hover:underline text-sm"
          >
            {LOGIN_LABELS.SIGN_UP}            
          </button>
        </div>

        <div className="mt-2 text-center">
          <button
            onClick={onClose}
            className="text-gray-400 hover:underline text-sm"
          >
            {LOGIN_LABELS.CANCEL}
          </button>
        </div>
      </div>
    </div>
  );
}
