import { useState } from "react";
import axios from "@/api/axios";
import { COMMUNITIES } from "@/constants/apiRoutes/communities";

export default function ManageDescriptionSection({ community, onUpdate }) {
  const [editedDescription, setEditedDescription] = useState(community.description || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { method, url } = COMMUNITIES.UPDATE_DESCRIPTION(community.id);
      const res = await axios({ method, url, data: { description: editedDescription } });
      onUpdate(res.data.data.description);
    } catch (err) {
      console.error("Failed to update description", err);
      alert("Failed to update description.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-200 dark:bg-black border border-gray-300 dark:border-zinc-700 rounded-2xl p-6 space-y-6 shadow-sm">
      <h2 className="text-zinc-900 dark:text-white text-xl font-semibold">Community Description</h2>

      <textarea
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        className="w-full text-sm bg-zinc-50 dark:bg-gray-950 text-zinc-900 dark:text-white border border-gray-300 dark:border-zinc-600 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-h-[120px]"
        placeholder="Write a description for your community..."
      />

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium 
          bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={() => setEditedDescription(community.description || "")}
          className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium 
          border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 
          hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
