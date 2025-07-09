import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PostMediaSlider({ files = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % files.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  const currentFile = files[currentIndex];

  return (
    <div
      className="relative w-full h-[300px] md:h-[500px] bg-[url('/bg/mosaic.png')] bg-repeat bg-center bg-gray-200 dark:bg-black overflow-hidden rounded-md mt-3"
      onClick={(e) => e.stopPropagation()}
    >
      {currentFile?.type === "VIDEO" ? (
        <video
          src={currentFile.fileUrl}
          controls
          className="w-full h-full object-contain"
        />
      ) : (
        <img
          src={currentFile?.fileUrl}
          alt={`slide-${currentIndex}`}
          className="w-full h-full object-contain"
        />
      )}

      {files.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 dark:bg-white/20 text-white dark:text-white p-1 rounded-full hover:bg-gray-600 dark:hover:bg-gray-400"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 dark:bg-white/20 text-white dark:text-white p-1 rounded-full hover:bg-gray-600 dark:hover:bg-gray-400"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {files.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex
                    ? "bg-black dark:bg-white"
                    : "bg-gray-400 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
