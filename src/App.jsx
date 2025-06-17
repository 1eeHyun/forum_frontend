import { BrowserRouter } from "react-router-dom";
import Navbar from "@/layout/Navbar";
import AppRoutes from "@/routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-zinc-900 text-white min-h-screen">
        <Navbar />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
