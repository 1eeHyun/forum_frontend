import React, { useRef, useState } from "react";
import { Camera } from "lucide-react";
import axios from "@/api/axios";
import { COMMUNITIES } from "@/constants/apiRoutes/communities";

const LABELS = {
  changeBanner: "Change Banner",
  changeProfile: "Change",
  save: "Save Position",
};

export default function ManageBannerSection({ community }) {
  const bannerInputRef = useRef();
  const profileInputRef = useRef();
  const containerRef = useRef();

  const [profileFile, setProfileFile] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.put(
        COMMUNITIES.UPDATE_BANNER_IMAGE(community.id).url,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      window.location.reload();
    } catch (err) {
      console.error("Failed to update banner:", err);
    }
  };

  const handleProfileFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
  };

  const handleSaveProfile = async () => {
    if (!profileFile) return;
    const formData = new FormData();
    formData.append("image", profileFile);
    formData.append("positionX", dragOffset.x);
    formData.append("positionY", dragOffset.y);

    try {
      await axios.put(
        COMMUNITIES.UPDATE_PROFILE_IMAGE(community.id).url,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      window.location.reload();
    } catch (err) {
      console.error("Failed to update profile image:", err);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartDrag({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startDrag.x;
    const dy = e.clientY - startDrag.y;
    setStartDrag({ x: e.clientX, y: e.clientY });

    const container = containerRef.current;
    if (!container) return;

    setDragOffset((prev) => {
      const newX = Math.min(1, Math.max(0, prev.x - dx / (container.offsetWidth / zoom)));
      const newY = Math.min(1, Math.max(0, prev.y - dy / (container.offsetHeight / zoom)));
      return { x: newX, y: newY };
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative h-[180px] md:h-[220px] rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700 mb-12 group">
      {/* Banner image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-300"
        style={{ backgroundImage: `url(${community.bannerImageUrl})` }}
      />
      <div className="absolute inset-0 group-hover:bg-black/30 dark:group-hover:bg-black/50 transition duration-300" />

      {/* Banner hover UI */}
      <div
        className="absolute inset-0 hidden group-hover:flex items-center justify-center z-30 cursor-pointer transition"
        onClick={() => bannerInputRef.current?.click()}
      >
        <div className="text-white bg-black/50 hover:bg-black/70 rounded-lg px-4 py-2 flex items-center gap-2">
          <Camera size={18} />
          <span className="text-sm font-medium">{LABELS.changeBanner}</span>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={bannerInputRef}
          className="hidden"
          onChange={handleBannerChange}
        />
      </div>

      {/* Profile Image Editor Modal */}
      {profileFile && (
        <div
          className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="relative w-64 h-64 mb-4"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <div className="rounded-full overflow-hidden w-full h-full border-4 border-white cursor-grab">
              <img
                src={URL.createObjectURL(profileFile)}
                alt="preview"
                draggable={false}
                className="w-full h-full object-cover select-none"
                style={{
                  transform: `scale(${zoom}) translate(-${dragOffset.x * 100 - 50}%, -${dragOffset.y * 100 - 50}%)`,
                  transition: isDragging ? "none" : "transform 0.2s ease",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
              />
            </div>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-64 mb-2"
          />
          <button
            className="px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={handleSaveProfile}
          >
            {LABELS.save}
          </button>
        </div>
      )}

      {/* Profile Image */}
      <div className="absolute left-6 bottom-4 group/profile z-40">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-white dark:bg-black overflow-hidden">
          <img
            src={community.profileImageDto?.imageUrl || "/assets/default-profile.jpg"}
            alt="profile"
            className="w-full h-full object-cover transition-opacity duration-300 group-hover/profile:opacity-50"
            style={{
              objectPosition: `${(community.profileImageDto?.imagePositionX ?? 0.5) * 100}% ${(community.profileImageDto?.imagePositionY ?? 0.5) * 100}%`,
            }}
          />
          <div
            className="absolute inset-0 hidden group-hover/profile:flex items-center justify-center bg-black/40 text-white text-xs z-50 rounded-full cursor-pointer"
            onClick={() => profileInputRef.current?.click()}
          >
            <Camera size={14} className="mr-1" />
            <span>{LABELS.changeProfile}</span>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            className="hidden"
            onChange={handleProfileFileSelect}
          />
        </div>
      </div>
    </div>
  );
}
