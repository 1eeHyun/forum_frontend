import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateProfileImage } from "@profile/services/profileApi";
import { ROUTES } from "@/constants/apiRoutes/routes";

import MainLayout from "@/layout/MainLayout";

export default function ProfileImageCropper() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleMouseDown = (e) => {
    dragging.current = true;
    start.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;

    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    start.current = { x: e.clientX, y: e.clientY };

    setBgPos((prev) => ({
      x: Math.min(100, Math.max(0, prev.x + dx * 0.5)),
      y: Math.min(100, Math.max(0, prev.y + dy * 0.5)),
    }));
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  const handleDone = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("positionX", bgPos.x);
    formData.append("positionY", bgPos.y);

    try {
      await updateProfileImage(username, formData);
      window.dispatchEvent(new Event("userInfoUpdated"));
      navigate(ROUTES.PROFILE_EDIT(username));
    } catch (err) {
      console.error("Image update failed:", err);
    }
  };  

  return (
    <MainLayout>
      <div className="max-w-md mx-auto mt-10 space-y-6 text-white text-center">
        <label className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer transition-colors">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-48 h-48 rounded-full border-4 border-blue-500 mx-auto cursor-move select-none"
          style={{
            backgroundImage: `url(${imagePreview})`,
            backgroundSize: "cover",
            backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
          }}
        />

        <p className="text-sm text-gray-400">
          Drag to reposition image in the circle
        </p>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => navigate(ROUTES.PROFILE_EDIT(username))}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={handleDone}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            Done
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
