import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { signup } from "../services/authApi";

import MainLayout from "@/layout/MainLayout";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "", email: "", nickname: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { confirmPassword, ...signupData } = form;
      await signup(signupData);
      navigate(ROUTES.LOGIN);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      const status = err.response?.status;
      setError(msg || `Sign up failed (status ${status})`);
    }
  };

  return (
    <MainLayout noSidebar>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-[#0e1012] text-black dark:text-white rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Create a new account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["username", "password", "confirmPassword", "email", "nickname"].map((field) => (
            <input
              key={field}
              type={
                field === "password" || field === "confirmPassword"
                  ? "password"
                  : field === "email"
                  ? "email"
                  : "text"
              }
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={
                field === "confirmPassword"
                  ? "Confirm Password"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              className="w-full px-4 py-2 bg-gray-100 dark:bg-[#1a1c1f] border border-gray-400 dark:border-gray-600 rounded text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          ))}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-500 transition"
          >
            Sign Up
          </button>
          {error && <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>}
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Already have an account?
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
