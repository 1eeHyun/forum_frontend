import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/features/auth/services/authApi";

export default function LoginModal({ onClose }) {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const { setUsername, setIsLoggedIn } = useAuth();

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
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      const status = err.response?.status;
      setError(msg || `Login failed (status ${status})`);
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
      <div className="bg-card-bg dark:bg-dark-card-bg text-black dark:text-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
            type="text"
            name="usernameOrEmail"
            value={form.usernameOrEmail}
            onChange={handleChange}
            placeholder="Username or Email"
            className="w-full px-4 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white"
            />
            <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white"
            />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-gray-400 hover:underline text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
