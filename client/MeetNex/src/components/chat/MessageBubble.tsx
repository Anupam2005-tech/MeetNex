import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for cleaner tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MessageBubbleProps {
  message: string;
  sender: "me" | "other" | "ai";
  time?: string;
  showAvatar?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  time,
}) => {
  const isMe = sender === "me";
  const isAI = sender === "ai";

  return (
    <div
      className={cn(
        "flex w-full mb-3 px-1 animate-in fade-in slide-in-from-bottom-1 duration-300",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex flex-col max-w-[85%]",
        isMe ? "items-end" : "items-start"
      )}>
        {/* MESSAGE BOX */}
        <div
          className={cn(
            "relative px-4 py-2.5 text-[14px] leading-relaxed shadow-sm transition-all",
            "inline-block w-auto h-auto whitespace-pre-wrap break-words", // Dynamic sizing
            
            // "Me" styles: Blue gradient with crisp corners
            isMe && "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-[20px] rounded-tr-none shadow-blue-100",
            
            // "Other" styles: Soft gray with subtle border
            sender === "other" && "bg-white border border-gray-100 text-gray-800 rounded-[20px] rounded-tl-none",
            
            // "AI" styles: Glassmorphism with indigo/violet glow
            isAI && "bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 text-indigo-900 rounded-[20px] rounded-tl-none shadow-indigo-50"
          )}
        >
          {/* Subtle inner highlight for "Me" messages to add depth */}
          {isMe && (
            <div className="absolute inset-0 rounded-[20px] rounded-tr-none border-t border-white/20 pointer-events-none" />
          )}
          
          {message}
        </div>

        {/* METADATA (Time) */}
        {time && (
          <div className={cn(
            "flex items-center gap-1 mt-1 px-1",
            isMe ? "flex-row-reverse" : "flex-row"
          )}>
            <span className="text-[10px] font-medium text-gray-400 tracking-tight">
              {isAI ? "AI Assistant • " : ""}{time}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;