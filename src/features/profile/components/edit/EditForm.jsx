import { useNavigate } from "react-router-dom";

export default function EditForm({
  label,
  value,
  setValue,
  onSubmit,
  isTextarea = false,
  error = "",
  helperText = ""
}) {
  const navigate = useNavigate();

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto mt-6 space-y-4 text-white">
      <div>
        <label className="block text-sm mb-1">{label}</label>
        {isTextarea ? (
          <textarea
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            value={value}
            onChange={setValue}
          />
        ) : (
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            value={value}
            onChange={setValue}
          />
        )}

        {helperText && (
          <p className="text-right text-xs text-gray-400 mt-1">{helperText}</p>
        )}

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Done
        </button>
      </div>
    </form>
  );
}
