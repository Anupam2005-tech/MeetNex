import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time?: string;
}

interface ChatBoxProps {
  messages?: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-2 text-sm">
      {messages && messages.length > 0 ? (
        messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg.text}
            sender={msg.sender}
            time={msg.time}
          />
        ))
      ) : (
        <p className="text-gray-400 text-center mt-4">
          No messages yet
        </p>
      )}

      {/* Scroll Anchor */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatBox;
