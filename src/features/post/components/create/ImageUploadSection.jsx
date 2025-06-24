import { useState, useRef } from "react";
import { uploadPostImage } from "@post/services/postApi";

export default function ImageUploadSection({ imageUrls, setImageUrls, setError }) {
  const dropRef = useRef(null);

  const handleFiles = async (files) => {
    if (imageUrls.length + files.length > 5) {
      setError("You can upload up to 5 images.");
      return;
    }

    try {
      const uploads = await Promise.all(
        Array.from(files).map(uploadPostImage)
      );
      setImageUrls((prev) => [...prev, ...uploads]);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Image upload failed.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const moveImage = (fromIndex, toIndex) => {
    const updated = [...imageUrls];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setImageUrls(updated);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">Images (up to 5)</label>
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border border-dashed border-gray-500 rounded-md p-4 text-center bg-[#1a1c1f] text-gray-300"
      >
        Drag & drop images here, or click below
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
      />

      <div className="flex gap-2 flex-wrap mt-2">
        {imageUrls.map((url, idx) => (
          <div key={idx} className="relative w-24 h-24 group">
            <img
              src={url}
              alt="preview"
              className="w-full h-full object-cover rounded"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("fromIndex", idx);
              }}
              onDrop={(e) => {
                const fromIndex = Number(e.dataTransfer.getData("fromIndex"));
                moveImage(fromIndex, idx);
              }}
              onDragOver={(e) => e.preventDefault()}
            />
            <button
              type="button"
              className="absolute -top-2 -right-2 bg-red-600 rounded-full text-xs px-1"
              onClick={() =>
                setImageUrls((prev) => prev.filter((_, i) => i !== idx))
              }
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
