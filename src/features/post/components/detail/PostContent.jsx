export default function PostContent({ content, imageUrls }) {
    return (
      <div className="text-black dark:text-white text-base space-y-4">
        <p className="whitespace-pre-line">{content}</p>
  
        {imageUrls?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`post-img-${idx}`}
                className="w-full rounded-lg object-cover border border-gray-300 dark:border-gray-700"
              />
            ))}
          </div>
        )}
      </div>
    );
  }
  