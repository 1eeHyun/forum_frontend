import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const MAX_IMAGE_HEIGHT = "max-h-[600px]";
const imageWrapperStyle = "w-auto max-w-full object-contain rounded-xl transition-all duration-300";
const navigationBtnStyle =
  "absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white";

export default function PostContent({ content, imageUrls = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4 text-black dark:text-white text-base">
      {/* Post content */}
      <p className="whitespace-pre-line">{content}</p>

      {/* Image carousel */}
      {imageUrls.length > 0 && (
        <div className="relative w-full max-w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          {/* Image container */}
          <div className="w-full flex justify-center items-center bg-black/5 dark:bg-white/5 rounded-xl">
            <img
              src={imageUrls[currentIndex]}
              alt={`Post image ${currentIndex + 1}`}
              className={`${MAX_IMAGE_HEIGHT} ${imageWrapperStyle}`}
            />
          </div>

          {/* Navigation buttons */}
          {imageUrls.length > 1 && (
            <>
              <button
                className={`${navigationBtnStyle} left-2`}
                onClick={goToPrev}
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>
              <button
                className={`${navigationBtnStyle} right-2`}
                onClick={goToNext}
                aria-label="Next image"
              >
                <ChevronRight />
              </button>

              {/* Pagination indicator */}
              <div className="absolute bottom-2 right-3 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
                {currentIndex + 1} / {imageUrls.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
