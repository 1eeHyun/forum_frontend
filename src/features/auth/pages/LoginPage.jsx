import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { login } from "../services/authApi";

export default function LoginPage() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
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

      navigate(ROUTES.HOME);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      const status = err.response?.status;
      setError(msg || `Login failed (status ${status})`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#0e1012] text-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="usernameOrEmail"
          value={form.usernameOrEmail}
          onChange={handleChange}
          placeholder="Username or Email"
          className="w-full px-4 py-2 bg-[#1a1c1f] border border-gray-600 rounded text-white"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 bg-[#1a1c1f] border border-gray-600 rounded text-white"
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
          onClick={() => navigate(ROUTES.SIGNUP)}
          className="text-blue-400 hover:underline text-sm"
        >
          Don't have an account?
        </button>
      </div>
    </div>
  );
}
