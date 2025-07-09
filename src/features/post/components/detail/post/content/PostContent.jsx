import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const MAX_IMAGE_HEIGHT = "max-h-[600px]";
const mediaStyle = "w-auto max-w-full object-contain rounded-xl transition-all duration-300";
const navigationBtnStyle =
  "absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white";

export default function PostContent({ content, files = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = files[currentIndex];

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4 text-black dark:text-white text-base">
      {/* Post content */}
      <p className="whitespace-pre-line">{content}</p>

      {/* Media carousel */}
      {files.length > 0 && currentItem && (
        <div className="relative w-full max-w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          {/* Media container */}
          <div className="w-full flex justify-center items-center bg-black/5 dark:bg-white/5 rounded-xl">
            {currentItem.type === "VIDEO" ? (
              <video
                src={currentItem.fileUrl}
                controls
                className={`${MAX_IMAGE_HEIGHT} ${mediaStyle}`}
              />
            ) : (
              <img
                src={currentItem.fileUrl}
                alt={`Post media ${currentIndex + 1}`}
                className={`${MAX_IMAGE_HEIGHT} ${mediaStyle}`}
              />
            )}
          </div>

          {/* Navigation buttons */}
          {files.length > 1 && (
            <>
              <button
                className={`${navigationBtnStyle} left-2`}
                onClick={goToPrev}
                aria-label="Previous media"
              >
                <ChevronLeft />
              </button>
              <button
                className={`${navigationBtnStyle} right-2`}
                onClick={goToNext}
                aria-label="Next media"
              >
                <ChevronRight />
              </button>

              {/* Pagination indicator */}
              <div className="absolute bottom-2 right-3 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
                {currentIndex + 1} / {files.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
