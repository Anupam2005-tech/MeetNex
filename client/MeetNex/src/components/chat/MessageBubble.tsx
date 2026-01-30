import { useState, useRef, useEffect } from "react";
import { FileText, MoreVertical, Download } from "lucide-react";
import { cn } from "@/lib/Utils";



interface MessageBubbleProps {
  text?: string;
  fileName?: string;
  fileUrl?: string; // Add this to handle the actual download link
  fileType?: string;
  sender: "me" | "other" | "ai";
  senderName?: string;
  time?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ text, fileName, fileUrl, fileType, sender, senderName, time }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMe = sender === "me";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []); // Add missing dependency dependency array was empty, which is correct for mounting only


  const handleDownload = async () => {
    if (!fileUrl) {
      // console.error('Download failed: No URL provided');
      return;
    }

    try {
      // Check if it is a Data URI
      if (fileUrl.startsWith("data:")) {
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = fileName || "download";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setShowDropdown(false);
          return;
      }

      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      setShowDropdown(false);

    } catch (error) {
      // console.error("Download failed:", error);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName || "download";
      link.target = "_blank";
      link.click();
    }
  };
  return (
    <div className={cn("flex w-full mb-3 px-1", isMe ? "justify-end" : "justify-start")}>
      <div className={cn("flex flex-col max-w-[85%]", isMe ? "items-end" : "items-start")}>
        
        {/* SENDER NAME (Only for others) */}
        {!isMe && senderName && (
           <span className="text-[11px] text-gray-500 ml-2 mb-1 font-medium select-none">
             {senderName}
           </span>
        )}

        <div className={cn(
          "relative p-1 rounded-[20px] shadow-sm",
          isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
        )}>

          {/* MEDIA RENDER (Image/Video) OR FILE CARD */}
          {fileName && fileUrl && (
            fileType?.startsWith("image/") ? (
               <div className="rounded-lg overflow-hidden my-1 max-w-[240px] border border-white/10 relative group">
                  <img src={fileUrl} alt={fileName} className="w-full h-auto object-cover max-h-[200px]" />
                   {/* Overlay Download Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button onClick={handleDownload} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md">
                        <Download size={20} />
                     </button>
                  </div>
               </div>
            ) : fileType?.startsWith("video/") ? (
                <div className="rounded-lg overflow-hidden my-1 max-w-[240px] border border-white/10">
                   <video src={fileUrl} controls className="w-full h-auto max-h-[200px]" />
                </div>
            ) : (
                // GENERIC FILE ATTACHMENT CARD
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
                    {(fileType && fileType.split('/')[1]?.toUpperCase()) || "DOCUMENT"}
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
            )
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