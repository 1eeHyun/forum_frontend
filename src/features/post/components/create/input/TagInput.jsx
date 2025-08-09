// features/post/components/create/input/TagInput.jsx
// - Uses apiRoutes (TAG) + apiRequest (axios instance with baseURL=/api)
// - Shows server suggestions as-is, excluding ONLY already-selected tags (by normalized compare)
// - Comments in English

import { useEffect, useRef, useState } from "react";
import axios from "@/api/axios";
import { TAG } from "@/constants/apiRoutes/tags";

export default function TagInput({ value = [], onChange, max = 5 }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const timer = useRef(null);
  const seqRef = useRef(0); // prevent out-of-order updates

  const canAdd = (value?.length || 0) < max;

  // Same normalization rule as server (preview + comparison)
  const normalize = (s) =>
    s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 50);

  const add = (raw) => {
    const t = normalize(raw);
    if (!t || !canAdd) return;
    const existing = new Set((value || []).map(normalize));
    if (existing.has(t)) return; // prevent duplicates
    onChange([...(value || []), t]);
    setInput("");
    setSuggestions([]);
  };

  const remove = (t) => {
    const tn = normalize(t);
    onChange((value || []).filter((v) => normalize(v) !== tn));
  };

  const onKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      add(input);
    } else if (e.key === "Backspace" && !input && (value?.length || 0) > 0) {
      remove(value[value.length - 1]);
    }
  };

  // Debounced suggest fetch (server OK; only exclude already selected)
  useEffect(() => {
    clearTimeout(timer.current);

    if (!input.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    timer.current = setTimeout(async () => {
      const q = normalize(input);
      if (!q) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      const mySeq = ++seqRef.current;
      setLoading(true);

      try {
        const { method, url } = TAG.SUGGEST; // { method:'GET', url:'/tags/suggest' }
        const res = await axios({ method, url, params: { q, limit: 8 } });        

        // Unwrap: either an array or CommonResponse { data: [...] }
        const serverList = Array.isArray(res) ? res
                          : Array.isArray(res?.data.data) ? res.data.data
                          : [];

        const existing = new Set((value || []).map(normalize));

        // Minimal filtering: normalize, remove empties, dedupe, exclude selected, limit
        const final = Array.from(
          new Set(
            serverList
              .map(String)
              .map(normalize)
              .filter(Boolean)
          )
        )
          .filter((t) => !existing.has(t))
          .slice(0, 8);

        if (mySeq !== seqRef.current) return;
        setSuggestions(final);
      } catch (err) {
        if (mySeq !== seqRef.current) return;
        console.error("Tag suggest failed:", err);
        setSuggestions([]);
      } finally {
        if (mySeq === seqRef.current) setLoading(false);
      }
    }, 160);

    return () => clearTimeout(timer.current);
  }, [input, value]);

  return (
    <div className="flex flex-col gap-2">
      {/* Selected tags + input */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border p-2">
        {(value || []).map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-sm"
            title={`#${t}`}
          >
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

      {/* Suggestions */}
      {(!!suggestions.length || loading) && (
        <div className="rounded-xl border border-border p-2">
          <div className="text-xs mb-1 opacity-70">
            {loading ? "Loading suggestions..." : "Suggested tags"}
          </div>
          {!loading && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => add(s)}
                  className="rounded-full border px-2 py-1 text-sm hover:bg-muted"
                  title={`Add #${s}`}
                >
                  #{s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
