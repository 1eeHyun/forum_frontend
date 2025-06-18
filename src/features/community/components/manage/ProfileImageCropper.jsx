import React, { useRef, useState, useEffect } from "react";

export default function ProfileImageCropper({ imageUrl, onSave }) {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0.5, y: 0.5 }); // ratio
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState(null);

  const handleMouseDown = (e) => {
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!dragging || !start || !containerRef.current) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    const { width, height } = containerRef.current.getBoundingClientRect();

    setOffset((prev) => ({
      x: Math.min(1, Math.max(0, prev.x - dx / width)),
      y: Math.min(1, Math.max(0, prev.y - dy / height)),
    }));

    setStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, start]);

  return (
    <div className="relative w-40 h-40 overflow-hidden rounded-full border border-white mx-auto mb-4">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <img
          src={imageUrl}
          className="w-full h-full object-cover"
          style={{
            objectPosition: `${offset.x * 100}% ${offset.y * 100}%`,
          }}
          draggable={false}
        />
      </div>
      <button
        className="mt-2 bg-white text-black px-4 py-1 rounded text-sm"
        onClick={() => onSave(offset)}
      >
        Save Position
      </button>
    </div>
  );
}
