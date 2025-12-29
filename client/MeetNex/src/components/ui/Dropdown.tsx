import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from "../../lib/Utils"; // Ensure this utility exists

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

  // Close on click outside
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
      {/* TRIGGER */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
          "bg-white border border-zinc-200 shadow-sm hover:border-zinc-300",
          isOpen && "border-zinc-900 ring-4 ring-zinc-900/5"
        )}
      >
        {icon && <span className="text-zinc-400 group-hover:text-zinc-600">{icon}</span>}
        
        <span className={cn(
          "flex-1 text-left text-sm font-semibold truncate",
          !selectedOption ? "text-zinc-400" : "text-zinc-900"
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown className={cn(
          "w-4 h-4 text-zinc-400 transition-transform duration-300",
          isOpen && "rotate-180 text-zinc-900"
        )} />
      </button>

      {/* MENU */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 lg:top-full lg:mt-2 w-full min-w-[220px]  bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-zinc-100 p-1.5 z-[999] animate-in fade-in zoom-in-95">
          <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2.5 rounded-xl text-left transition-all flex items-center justify-between group",
                  value === option.id 
                    ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20" 
                    : "text-zinc-600 hover:bg-zinc-50"
                )}
              >
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold truncate">{option.label}</span>
                  {option.description && (
                    <span className={cn(
                      "text-[10px] mt-0.5",
                      value === option.id ? "text-zinc-400" : "text-zinc-400"
                    )}>
                      {option.description}
                    </span>
                  )}
                </div>
                {value === option.id && <Check size={14} className="text-emerald-400 shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;