import LoginPage from "../pages/LoginPage";

export default function LoginModal() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1a1c1f] rounded-xl p-6 w-full max-w-md shadow-xl">
        <LoginPage />
      </div>
    </div>
  );
}
