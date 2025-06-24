import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { PROFILE_ROUTES } from "@/constants/navigation/profileRoutes";

export default function ChatRoomMessageList({ messages, currentUsername, messageRefs }) {
  const navigate = useNavigate();

  const formatTime = (timestamp) => {
    try {
      return timestamp ? format(new Date(timestamp), "HH:mm") : "";
    } catch {
      return "";
    }
  };

  return (
    <>
      {messages?.map((msg, index) => {
        const isMe = msg.senderUsername === currentUsername;
        const messageKey = msg.id ?? `temp-${index}`;
        const time = formatTime(msg.sentAt);

        const wrapperClass = `flex ${isMe ? "justify-end" : "justify-start"}`;
        const rowClass = `flex items-end ${isMe ? "flex-row-reverse" : "flex-row"} gap-2 w-full`;
        const bubbleClass = `
          relative px-3 py-2 rounded-md text-sm break-words w-fit max-w-[60%]
          ${isMe ? "bg-blue-600 text-white" : "bg-gray-200 text-black dark:bg-[#1f2328] dark:text-gray-100"}
        `;

        return (
          <div
            key={messageKey}
            ref={(el) => {
              if (el) messageRefs.current[messageKey] = el;
            }}
            className={wrapperClass}
          >
            <div className={rowClass}>
              {!isMe && (
                <img
                  onClick={() => navigate(PROFILE_ROUTES.DETAIL(msg.senderUsername))}
                  src={msg.senderProfile?.imageDto?.imageUrl}
                  onError={(e) => { e.currentTarget.src = "/default.png"; }}
                  className="w-8 h-8 rounded-full object-cover shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  alt={`${msg.senderUsername}'s profile image`}
                />
              )}
              <div className={bubbleClass}>
                {msg.content}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{time}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}
