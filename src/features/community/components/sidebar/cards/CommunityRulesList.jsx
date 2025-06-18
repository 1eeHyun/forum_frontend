import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CommunityRulesList({ rules }) {
  const [openRuleIds, setOpenRuleIds] = useState([]);

  const toggleRule = (id) => {
    setOpenRuleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="rounded-xl border-gray-700 dark:border-gray-600">
      <h2 className="text-base text-gray-900 font-semibold mb-2 dark:text-white">
        RULES
      </h2>
      <ul className="space-y-4">
        {rules.map((rule, index) => (
          <li key={rule.id}>
            <button
              onClick={() => toggleRule(rule.id)}
              className="w-full flex items-center justify-between text-left text-sm text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-900 font-semibold w-5 dark:text-gray-400">
                  {index + 1}
                </span>
                <span className="font-medium">{rule.title}</span>
              </div>

              <ChevronDown
                size={25}
                className={`transform transition-transform duration-300 ${
                  openRuleIds.includes(rule.id) ? "rotate-180" : ""
                } text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white`}
              />
            </button>
            {openRuleIds.includes(rule.id) && (
              <div className="mt-1 ml-5 text-sm text-gray-700 whitespace-pre-line dark:text-gray-300">
                {rule.content}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
