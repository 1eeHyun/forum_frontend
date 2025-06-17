// src/features/auth/pages/LoginPage.jsx
export default function LoginPage() {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-900 text-white">
        <div className="w-full max-w-md p-8 border border-gray-700 rounded-xl bg-zinc-800 shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-zinc-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-zinc-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  