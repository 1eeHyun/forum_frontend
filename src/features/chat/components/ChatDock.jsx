// src/features/chat/ChatDock.jsx
import { useContext } from "react";
import { Dialog } from "@headlessui/react";
import { ChatContext } from "@/context/ChatContext";
import ChatRoom from "@/components/chat/ChatRoom";

/**
 * Floating chat modal (single panel).
 * - Fixed width/height so it always opens at the same visual size.
 * - No inner padding so ChatRoom fills the panel 1:1.
 */
export default function ChatDock() {
  const { isOpen, close, selectedRoomId } = useContext(ChatContext);

  return (
    <Dialog open={isOpen} onClose={close} className="relative z-[200]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Bottom-right anchor like your floating UI */}
      <div className="fixed inset-0 flex items-end justify-end p-4">
        <Dialog.Panel
          className="
            w-[375px]                     /* match your modal width */
            h-[560px]                     /* fixed height; tweak if you prefer 540/520 */
            max-h-[80vh]                  /* guard for very small screens */
            bg-white dark:bg-[#111417]
            rounded-xl shadow-2xl
            border border-gray-300 dark:border-gray-700
            overflow-hidden
            p-0                           /* IMPORTANT: let ChatRoom control spacing */
          "
        >
          <Dialog.Title className="sr-only">Chat</Dialog.Title>

          {selectedRoomId ? (
            <ChatRoom roomId={selectedRoomId} onClose={close} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              No chat selected
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
