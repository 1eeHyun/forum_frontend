import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import axios from "@/api/axios";
import { COMMUNITIES } from "@/constants/apiRoutes/communities";

export default function ManageRulesSection({ communityId }) {
  const [rules, setRules] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRules = async () => {
    try {
      const { method, url } = COMMUNITIES.RULES(communityId);
      const res = await axios({ method, url });
      setRules(res.data.data);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to fetch rules", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [communityId]);

  const handleChange = (key, value) => {
    setRules((prev) =>
      prev.map((rule, i) =>
        i === currentIndex ? { ...rule, [key]: value } : rule
      )
    );
  };

  const handleAddRule = () => {
    setRules((prev) => [...prev, { title: "", content: "", id: null }]);
    setCurrentIndex(rules.length);
  };

  const handleDelete = async () => {
    const target = rules[currentIndex];
    const confirmed = window.confirm("Are you sure you want to delete this rule?");
    if (!confirmed) return;

    if (!target.id) {
      const updated = rules.filter((_, i) => i !== currentIndex);
      setRules(updated);
      setCurrentIndex((i) => Math.max(0, i - 1));
      return;
    }

    try {
      const url = `/communities/${communityId}/rules/${target.id}`;
      await axios.delete(url);
      await fetchRules();
    } catch (err) {
      console.error("Delete failed", err.response?.data || err.message);
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all(
        rules.map((rule) => {
          if (!rule.title && !rule.content) return;

          if (rule.id) {
            const url = `/communities/${communityId}/rules/${rule.id}`;
            return axios.put(url, {
              title: rule.title,
              content: rule.content,
            });
          } else {
            const { method, url } = COMMUNITIES.ADD_RULE(communityId);
            return axios({ method, url, data: { title: rule.title, content: rule.content } });
          }
        })
      );
      await fetchRules();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const currentRule = rules[currentIndex];

  return (
    <div className="bg-action-hover dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl p-6 w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-black dark:text-white text-xl font-semibold">Manage Community Rules</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddRule}
            className="w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-black dark:text-white transition"
            title="Add Rule"
          >
            <Plus size={30} />
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-full text-base bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            Save All
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : rules.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No rules yet.</p>
      ) : (
        <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-black dark:text-white text-lg font-semibold">
              Rule {currentIndex + 1} of {rules.length}
            </h3>
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-base text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                placeholder="Enter title"
                value={currentRule.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Content</label>
              <textarea
                placeholder="Enter content"
                rows={5}
                value={currentRule.content}
                onChange={(e) => handleChange("content", e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
          </div>

          {/* Prev/Next Buttons */}
          <div className="flex justify-between mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="text-black dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &larr; Previous
            </button>
            <button
              disabled={currentIndex === rules.length - 1}
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="text-black dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
