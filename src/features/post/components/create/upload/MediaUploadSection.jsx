import { useRef } from "react";
import { uploadMedia } from "@post/services/postApi";

export default function MediaUploadSection({ files, setFiles, setError }) {
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    const mediaFiles = selectedFiles.filter((file) =>
      ["image/", "video/"].some((type) => file.type.startsWith(type))
    );

    for (const file of mediaFiles) {
      try {
        const res = await uploadMedia(file);
        const url = res.data.data;

        const type = file.type.startsWith("image/") ? "IMAGE" : "VIDEO";

        setFiles((prev) => [...prev, { fileUrl: url, type }]);
      } catch (err) {
        console.error("Upload failed", err);
        setError("Failed to upload media.");
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-white">
        Upload Media (Images or Videos)
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      <div className="flex flex-wrap gap-2">
        {files.map((file, idx) =>
          file.type === "IMAGE" ? (
            <img key={idx} src={file.fileUrl} alt="uploaded" className="h-20 rounded" />
          ) : (
            <video key={idx} src={file.fileUrl} controls className="h-20 rounded" />
          )
        )}
      </div>
    </div>
  );
}
