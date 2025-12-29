import { useState, useRef, useEffect,lazy,Suspense } from "react";
import { Send, FileText, X, Plus, Smile } from "lucide-react";
import { Theme } from "emoji-picker-react";
const EmojiPicker = lazy(() => import("emoji-picker-react"));

interface Attachment {
  file: File;
  type: "file";
}

interface ChatInputProps {
  onSend: (message: string, attachments: Attachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
  hideAttachments?: boolean; // New Prop
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  disabled, 
  placeholder = "Type a message...",
  hideAttachments = false // Default to showing them
}) => {
  const [message, setMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmoji(false);
      }
    };
    if (showOptions || showEmoji) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions, showEmoji]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
  }, [message]);

  const sendMessage = () => {
    if ((!message.trim() && attachments.length === 0) || disabled) return;
    onSend(message.trim(), attachments);
    setMessage("");
    setAttachments([]);
    setShowOptions(false);
    setShowEmoji(false);
  };

  const onEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
    textareaRef.current?.focus();
  };

  return (
    <div className="relative flex flex-col gap-2 w-full font-sans">
      {/* ATTACHMENT PREVIEWS - Only show if attachments aren't hidden */}
      {!hideAttachments && attachments.length > 0 && (
        <div className="flex gap-2 flex-wrap px-1 pb-1">
          {attachments.map((att, idx) => (
            <div key={idx} className="flex items-center gap-1.5 bg-gray-100/80 backdrop-blur-sm border border-gray-200 pl-2 pr-1 py-1 rounded-lg text-[11px] font-medium text-gray-600">
              <FileText size={12} className="text-indigo-500" />
              <span className="truncate max-w-[120px]">{att.file.name}</span>
              <button onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="p-0.5 hover:bg-red-50 hover:text-red-500 rounded-md">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="group relative flex items-end gap-2 bg-gray-100/50 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300 border-none rounded-[24px] p-1.5 shadow-sm">
        
        {/* OPTIONS MENU - HIDDEN IF hideAttachments IS TRUE */}
        {!hideAttachments && (
          <div className="relative" ref={optionsRef}>
            <button
              type="button"
              onClick={() => { setShowOptions(!showOptions); setShowEmoji(false); }}
              className={`h-9 w-9 flex items-center justify-center rounded-full transition-all duration-300 outline-none ${
                showOptions ? "bg-gray-900 text-white rotate-45" : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              <Plus size={20} />
            </button>

            {showOptions && (
              <div className="absolute bottom-12 left-0 w-44 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-1.5 z-[60] animate-in slide-in-from-bottom-2 duration-200">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 rounded-xl text-sm text-gray-700 outline-none transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  Documents
                </button>
              </div>
            )}
          </div>
        )}

        <input 
          ref={fileInputRef} 
          type="file" 
          multiple 
          hidden 
          onChange={(e) => {
            if(e.target.files) {
              setAttachments(prev => [...prev, ...Array.from(e.target.files!).map(f => ({ file: f, type: 'file' as const }))]);
            }
            setShowOptions(false);
          }} 
        />

        {/* EMOJI PICKER */}
        <div className="relative" ref={emojiRef}>
          <button
            type="button"
            onClick={() => { setShowEmoji(!showEmoji); setShowOptions(false); }}
            className={`h-9 w-9 flex items-center justify-center rounded-full transition-all duration-300 outline-none ${
              showEmoji ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            <Smile size={20} />
          </button>

          {showEmoji && (
  <Suspense fallback={<div>Loading...</div>}>
    <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} />
  </Suspense>
)}
        </div>

        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={placeholder}
          value={message}
          disabled={disabled}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          className={`flex-1 bg-transparent border-none focus:ring-0 outline-none text-[15px] text-gray-800 py-2 resize-none max-h-[150px] placeholder:text-gray-400 leading-snug scrollbar-none ${hideAttachments ? 'ml-2' : ''}`}
        />

        <button
          type="button"
          onClick={sendMessage}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all duration-200 outline-none"
        >
          <Send size={16} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;