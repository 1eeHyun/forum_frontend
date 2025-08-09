// features/post/components/create/input/TagInput.jsx

import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function TagInput({ value = [], onChange, max = 5 }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const timer = useRef();

  const canAdd = value.length < max;

  // Preview normalization to match server's tag format
  const normalizePreview = (s) =>
    s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 50);

  const add = (raw) => {
    const t = normalizePreview(raw);
    if (!t || !canAdd || value.includes(t)) return;
    onChange([...value, t]);
    setInput("");
    setSuggestions([]);
  };

  const remove = (t) => onChange(value.filter((v) => v !== t));

  const onKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      add(input);
    } else if (e.key === "Backspace" && !input && value.length) {
      remove(value[value.length - 1]);
    }
  };

  // Debounced suggestions fetch
  useEffect(() => {
    clearTimeout(timer.current);
    if (!input.trim()) { setSuggestions([]); return; }
    timer.current = setTimeout(async () => {
      try {
        const q = normalizePreview(input);
        if (!q) { setSuggestions([]); return; }
        const { data } = await axios.get("/api/tags/suggest", { params: { q, limit: 8 } });
        setSuggestions(data.filter((d) => !value.includes(d)).slice(0, 8));
      } catch {
        setSuggestions([]);
      }
    }, 160);
    return () => clearTimeout(timer.current);
  }, [input, value]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border p-2">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-sm">
            #{t}
            <button
              type="button"
              onClick={() => remove(t)}
              className="opacity-60 hover:opacity-100"
              aria-label={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={canAdd ? "Type tag and press Enter" : "Max tags reached"}
            className="flex-1 min-w-[100px] bg-transparent outline-none px-2 py-1 text-sm placeholder-gray-400 dark:placeholder-gray-500"
            disabled={!canAdd}
        />
      </div>

      {!!suggestions.length && (
        <div className="rounded-xl border border-border p-2">
          <div className="text-xs mb-1 opacity-70">Suggested tags</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="rounded-full border px-2 py-1 text-sm hover:bg-muted"
              >
                #{s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
