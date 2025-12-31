import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Adding Framer Motion for premium feel
import { cn } from "../../lib/Utils";

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface DropdownProps {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select option",
  className,
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {/* TRIGGER: COMPACT & CLEAN */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 group",
          "bg-white/40 hover:bg-white border border-zinc-200/60 shadow-sm",
          isOpen && "border-zinc-900 ring-4 ring-zinc-950/[0.03] bg-white"
        )}
      >
        {icon && (
          <span className={cn(
            "text-zinc-400 transition-colors duration-300",
            isOpen ? "text-zinc-900" : "group-hover:text-zinc-600"
          )}>
            {icon}
          </span>
        )}
        
        <span className={cn(
          "flex-1 text-left text-[11px] font-bold tracking-tight truncate",
          !selectedOption ? "text-zinc-400" : "text-zinc-800"
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown className={cn(
          "w-3 h-3 text-zinc-300 transition-transform duration-500",
          isOpen && "rotate-180 text-zinc-900"
        )} />
      </button>

      {/* MENU: GLASSMORPHISM & PRECISE ANIMATION */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full mt-2 w-full min-w-[240px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white ring-1 ring-zinc-200/50 p-1.5 z-[1000] overflow-hidden"
          >
            <div className="max-h-[240px] overflow-y-auto custom-scrollbar space-y-0.5">
              {options.length === 0 ? (
                <div className="px-3 py-4 text-center text-[10px] font-medium text-zinc-400 italic">
                  No devices found
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 rounded-xl text-left transition-all duration-200 flex items-center justify-between group",
                      value === option.id 
                        ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10" 
                        : "text-zinc-600 hover:bg-zinc-900/[0.04] hover:text-zinc-900"
                    )}
                  >
                    <div className="flex flex-col truncate pr-4">
                      <span className="text-[11px] font-bold truncate tracking-tight">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className={cn(
                          "text-[9px] font-medium opacity-60 leading-tight mt-0.5",
                        )}>
                          {option.description}
                        </span>
                      )}
                    </div>
                    
                    {value === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check size={12} className="text-emerald-400 shrink-0" />
                      </motion.div>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;