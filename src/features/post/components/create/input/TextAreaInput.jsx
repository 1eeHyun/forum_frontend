import React from "react";

const inputClass =
  "w-full px-4 py-2 rounded-lg border border-border dark:border-dark-card-bg bg-input-bg dark:bg-dark-action text-input-text dark:text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

export default function TextareaInput({ label, name, value, onChange, maxLength, placeholder, rows, showCount }) {
  return (
    <div className="relative">
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={rows}
        className={inputClass + " resize-none"}
      />
      {showCount && (
        <span className="absolute bottom-2 right-3 text-xs text-muted-foreground dark:text-muted">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}
