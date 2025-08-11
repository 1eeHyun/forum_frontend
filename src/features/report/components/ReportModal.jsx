import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, Flag, X } from "lucide-react";
import { createReport } from "@report/services/reportApi";
import { extractApiErrorMessage } from "@/utils/apiError";

// MUST match backend enum names exactly
const REPORT_REASONS = [
  { value: "SPAM",          label: "Spam" },
  { value: "HARASSMENT",    label: "Harassment" },
  { value: "HATE",          label: "Hate / Discrimination" },
  { value: "SEXUAL",        label: "Sexual content" },
  { value: "SELF_HARM",     label: "Self-harm" },
  { value: "ILLEGAL",       label: "Illegal activity" },
  { value: "PERSONAL_INFO", label: "Personal information (doxxing)" },
  { value: "OTHER",         label: "Other" },
];

/**
 * ReportModal
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - target: { type: "COMMUNITY" | "POST" | "COMMENT" | "USER", id: number, name?: string, username?: string }
 *  - onSubmitted?: () => void
 *
 * Renders via React Portal to avoid clipping by parent containers.
 */
export default function ReportModal({ open, onClose, target, onSubmitted }) {
  const [reason, setReason] = useState("SPAM");
  const [detail, setDetail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset internal state whenever the modal opens
  useEffect(() => {
    if (open) {
      setReason("SPAM");
      setDetail("");
      setPending(false);
      setError("");
      setShowSuccess(false);
    }
  }, [open]);

  // Close on ESC key
  useEffect(() => {
    if (!open && !showSuccess) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !pending) {
        // If success modal is open, close all; else close the form modal
        if (showSuccess) {
          closeAll();
        } else {
          onClose?.();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, showSuccess, pending, onClose]);

  // If neither modal is visible, render nothing
  if (!open && !showSuccess) return null;

  const handleBackdropClose = (e) => {
    // Close when clicking on overlay only (not on dialog)
    if (e.target === e.currentTarget && !pending) onClose?.();
  };

  const handleSubmit = async () => {
    setError("");

    const allowed = new Set(REPORT_REASONS.map((r) => r.value));
    if (!reason || !allowed.has(reason)) {
      setError("Select a valid reason.");
      return;
    }

    try {
      setPending(true);

      const payload = {
        targetType: target.type,   // "COMMUNITY" | "POST" | "COMMENT" | "USER"
        targetId: target.id,
        reason,
        detail,
        ...(target.type === "USER" && target.username
          ? { targetUsername: target.username }
          : {}),
      };

      await createReport(payload);
      onSubmitted?.();
      setShowSuccess(true); // Show success modal
    } catch (e) {
      console.error(e);
      const status = e?.response?.status;
      const msg = extractApiErrorMessage(
        e,
        status === 409
          ? "You have already reported this content."
          : "Failed to submit report. Please try again."
      );
      setError(msg);
    } finally {
      setPending(false);
    }
  };

  const closeAll = () => {
    setShowSuccess(false);
    onClose?.();
  };

  // Choose portal target safely (SSR guard)
  const portalTarget = typeof document !== "undefined" ? document.body : null;

  // Report form modal node
  const formModal = open ? (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
      onClick={handleBackdropClose}
    >
      <div
        className="bg-white dark:bg-[#1a1d21] text-black dark:text-white rounded-2xl shadow-xl w-[92%] max-w-lg"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Flag size={18} />
            <h3 className="text-base font-semibold">
              Report {target?.name ? `"${target.name}"` : ""}
            </h3>
          </div>
          <button
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
            aria-label="Close"
            disabled={pending}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Reason */}
          <div>
            <label className="block text-sm mb-1">Reason</label>
            <select
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111418] px-3 py-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={pending}
            >
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm mb-1">Details (optional)</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111418] px-3 py-2"
              rows={4}
              placeholder="Provide more context for moderators."
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              disabled={pending}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={onClose}
            disabled={pending}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-60"
            onClick={handleSubmit}
            disabled={pending}
          >
            {pending ? "Submitting..." : "Submit report"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // Success modal node
  const successModal = showSuccess ? (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/50"
      onClick={closeAll}
    >
      <div
        className="bg-white dark:bg-[#1a1d21] text-black dark:text-white rounded-2xl shadow-xl w-[88%] max-w-sm p-6 text-center"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-3">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h4 className="text-lg font-semibold mb-1">Report submitted</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Thank you for helping keep the community safe.
        </p>
        <button
          className="mt-5 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
          onClick={closeAll}
          autoFocus
        >
          Close
        </button>
      </div>
    </div>
  ) : null;

  // Render both modals via portal so they appear above all parents
  return (
    <>
      {portalTarget && formModal && createPortal(formModal, portalTarget)}
      {portalTarget && successModal && createPortal(successModal, portalTarget)}
    </>
  );
}
