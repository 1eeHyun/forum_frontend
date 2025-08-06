// src/components/modal/ErrorModal.jsx
import { Dialog } from "@headlessui/react";

export default function ErrorModal({ open, onClose, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed z-50 inset-0 flex items-center justify-center"
    >
      {/* Background */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 z-50 max-w-sm mx-auto">
        <Dialog.Title className="text-lg font-semibold mb-2">Notice</Dialog.Title>
        <Dialog.Description className="text-sm text-gray-700 dark:text-gray-300">
          {message}
        </Dialog.Description>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            autoFocus
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </Dialog>
  );
}
