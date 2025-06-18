import { useState } from "react";
import axios from "@/api/axios";

export default function ManageDescriptionSection({ community, onUpdate }) {
  const [editedDescription, setEditedDescription] = useState(community.description || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await axios.patch(`/communities/${community.id}/description`, {
        description: editedDescription,
      });
      onUpdate(res.data.data.description);
    } catch (err) {
      console.error("Failed to update description", err);
      alert("Failed to update description.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-black border border-gray-700 rounded-2xl p-6 space-y-6">
      <h2 className="text-white text-xl font-semibold mb-2">Community Description</h2>

      <textarea
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        className="w-full text-sm bg-gray-950 text-white border border-gray-600 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Write a description for your community..."
        rows={4}
      />

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-medium 
                        bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed 
                        transition shadow-sm"
            >
                {isSaving ? "Saving..." : "Save"}
            </button>

            {/* Discard Button */}
            <button
                onClick={() => setEditedDescription(community.description || "")}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-medium 
                        border border-gray-600 text-gray-400 hover:bg-gray-600 transition"
            >
                Discard
            </button>
        </div>
    </div>
  );
}
