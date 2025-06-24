import React from "react";

export function PrimaryButton({ children, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="px-4 py-2 rounded-lg text-sm bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children }) {
  return (
    <button
      type="button"
      className="px-4 py-2 rounded-lg text-sm bg-muted text-white hover:bg-muted/80 transition"
    >
      {children}
    </button>
  );
}
