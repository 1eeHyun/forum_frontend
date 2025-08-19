import heic2any from "heic2any";

export async function convertHeicIfNeeded(file) {
  const isHeic =
    file?.type === "image/heic" ||
    file?.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file?.name || "");

  if (!isHeic) return file;

  const blob = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });

  return new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
    type: "image/jpeg",
  });
}
