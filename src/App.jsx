import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/layout/Navbar";
import HomePage from "@home/pages/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-zinc-900 text-white min-h-screen">
        <Navbar /> 
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
