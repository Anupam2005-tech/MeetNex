import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@tabler/icons-react";
import { cn } from "../../lib/Utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string; // deprecated in favor of classNames.content or kept for compat
  classNames?: {
    overlay?: string;
    content?: string;
    header?: string;
    title?: string;
    closeBtn?: string;
    body?: string;
    footer?: string;
  };
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  classNames = {},
}) => {

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm", classNames.overlay)}
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-black/5",
          className,
          classNames.content
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className={cn("flex items-center justify-between border-b border-gray-100 p-5", classNames.header)}>
            <h2 className={cn("text-lg font-bold text-gray-900 tracking-tight", classNames.title)}>{title}</h2>

            <button
              onClick={onClose}
              className={cn("text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-lg hover:bg-gray-100", classNames.closeBtn)}
            >
              <IconX size={20} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={cn("p-5 text-gray-600 leading-relaxed", classNames.body)}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className={cn("border-t border-gray-100 p-5 bg-gray-50/50 rounded-b-2xl flex items-center gap-3", classNames.footer)}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
