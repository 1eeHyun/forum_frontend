import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function ChatRoomMessageList({ messages, currentUsername, messageRefs }) {
  const navigate = useNavigate();

  return (
    <>
      {messages?.map((msg, index) => {
        const isMe = msg.senderUsername === currentUsername;
        const time = msg.sentAt ? format(new Date(msg.sentAt), "HH:mm") : "";

        const messageKey = msg.id ?? `temp-${index}`;

        return (
          <div
            key={messageKey}
            ref={(el) => {
              if (el) messageRefs.current[messageKey] = el;
            }}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-end ${isMe ? "flex-row-reverse" : "flex-row"} gap-2 w-full`}>
              {!isMe && (
                <img
                  onClick={() => navigate(`/profile/${msg.senderUsername}`)}
                  src={msg.senderProfile?.imageDto?.imageUrl || "/default.png"}
                  className="w-8 h-8 rounded-full object-cover shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  alt="profile"
                />
              )}
              <div
                className={`
                  relative px-3 py-2 rounded-md text-sm break-words w-fit max-w-[60%]
                  ${isMe 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-black dark:bg-[#1f2328] dark:text-gray-100"
                  }
                `}
              >
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
