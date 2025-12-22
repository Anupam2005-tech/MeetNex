import React, { useState, useRef, useEffect } from "react";
import { FileText, MoreVertical, Download } from "lucide-react";
import { cn } from "@/lib/Utils";



interface MessageBubbleProps {
  text?: string;
  fileName?: string;
  fileUrl?: string; // Add this to handle the actual download link
  sender: "me" | "other" | "ai";
  time?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ text, fileName, fileUrl, sender, time }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMe = sender === "me";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleDownload = () => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDropdown(false);
  };

  return (
    <div className={cn("flex w-full mb-3 px-1", isMe ? "justify-end" : "justify-start")}>
      <div className={cn("flex flex-col max-w-[85%]", isMe ? "items-end" : "items-start")}>
        <div className={cn(
          "relative p-1 rounded-[20px] shadow-sm",
          isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
        )}>
          
          {/* FILE ATTACHMENT CARD */}
          {fileName && (
            <div className={cn(
              "relative flex items-center gap-3 p-3 rounded-[16px] min-w-[200px]",
              isMe ? "bg-white/10" : "bg-gray-50"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                isMe ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
              )}>
                <FileText size={20} />
              </div>
              
              <div className="flex-1 flex flex-col overflow-hidden pr-6">
                <span className="text-xs font-bold truncate">{fileName}</span>
                <span className={cn("text-[10px] opacity-70", isMe ? "text-blue-100" : "text-gray-500")}>
                  Document
                </span>
              </div>

              {/* DROPDOWN TRIGGER */}
              <div className="absolute top-2 right-2" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={cn(
                    "p-1 rounded-md transition-colors",
                    isMe ? "hover:bg-white/10 text-white/70" : "hover:bg-gray-200 text-gray-400"
                  )}
                >
                  <MoreVertical size={14} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-7 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      <Download size={14} className="text-blue-500" />
                      Download
                    </button>
                   
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TEXT CONTENT */}
          {text && (
            <div className="px-3 py-2 text-[14px] leading-relaxed whitespace-pre-wrap break-words">
              {text}
            </div>
          )}
        </div>

        {time && <span className="text-[10px] text-gray-400 mt-1 px-1">{time}</span>}
      </div>
    </div>
  );
};