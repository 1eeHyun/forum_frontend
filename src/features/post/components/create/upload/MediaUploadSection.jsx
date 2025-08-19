import { useRef } from "react";
import { uploadMedia } from "@post/services/postApi";
import { convertHeicIfNeeded } from "@/utils/convertHeic";

export default function MediaUploadSection({ files, setFiles, setError }) {
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const mediaFiles = selectedFiles.filter((file) =>
      ["image/", "video/"].some((prefix) => file.type?.startsWith(prefix))
    );

    try {
      setError?.("");

      const prepared = await Promise.all(
        mediaFiles.map(async (file) => {
          if (file.type?.startsWith("image/")) {
            try {
              return await convertHeicIfNeeded(file);
            } catch (err) {
              console.error("HEIC convert failed:", err);
              throw new Error("Failed to convert an image. Please try again.");
            }
          }
          return file; // video 
        })
      );

      const results = await Promise.allSettled(
        prepared.map(async (file) => {
          const res = await uploadMedia(file);
          const url = res?.data?.data;
          const type = file.type?.startsWith("image/") ? "IMAGE" : "VIDEO";
          if (!url) throw new Error("Upload response missing URL");
          return { fileUrl: url, type };
        })
      );

      const successItems = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      if (successItems.length) {
        setFiles((prev) => [...prev, ...successItems]);
      }

      const failCount = results.filter((r) => r.status === "rejected").length;
      if (failCount > 0) {
        setError?.(`${failCount} file(s) failed to upload. Please try again.`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError?.("Failed to upload media.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
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
            <img key={idx} src={file.fileUrl} alt="uploaded" className="h-20 rounded object-cover" />
          ) : (
            <video key={idx} src={file.fileUrl} controls className="h-20 rounded" />
          )
        )}
      </div>
    </div>
  );
}
