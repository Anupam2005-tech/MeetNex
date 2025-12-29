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
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-lg rounded-xl ",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-gray-300 p-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              <IconX size={20} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-4 text-gray-800">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
