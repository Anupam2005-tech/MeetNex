import { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, Video, ChevronDown } from 'lucide-react';

interface DropdownOption {
  id: string;
  label: string;
  type?: string;
}

interface MediaDropdownProps {
  icon: React.ReactNode;
  label: string;
  options: DropdownOption[];
  defaultValue?: string;
}

const MediaDropdown: React.FC<MediaDropdownProps> = ({ 
  icon, 
  label, 
  options, 
  defaultValue 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || options[0]?.id);
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

  const selectedOption = options.find(opt => opt.id === selected);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors shadow-sm min-w-[160px]"
      >
        <span className="text-gray-600">{icon}</span>
        <span className="text-sm text-gray-700 flex-1 text-left truncate">
          {selectedOption?.label || label}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        // Responsive Dropdown positioning: drop up on small screens if near the bottom, drop down otherwise
        <div className="absolute bottom-full mb-2 lg:top-full lg:mt-2 w-full min-w-[280px] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSelected(option.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors ${
                selected === option.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                {option.type && (
                  <span className="text-xs text-gray-500 mt-0.5">{option.type}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Dropdown: React.FC = () => {
  const micOptions: DropdownOption[] = [
    { id: 'default-mic', label: 'Default - Built-in Microphone', type: 'Default' },
    { id: 'external-mic', label: 'External USB Microphone', type: 'USB Audio Device' },
    { id: 'headset-mic', label: 'Headset Microphone', type: 'Bluetooth' },
  ];

  const speakerOptions: DropdownOption[] = [
    { id: 'default-speaker', label: 'Default - Built-in Speakers', type: 'Default' },
    { id: 'headphones', label: 'Headphones', type: 'Bluetooth' },
    { id: 'external-speaker', label: 'External Speakers', type: 'USB Audio Device' },
  ];

  const cameraOptions: DropdownOption[] = [
    { id: 'default-camera', label: 'Hy-UXGA(AF) (05c8:0815)', type: 'USB Camera' },
    { id: 'external-camera', label: 'External Webcam', type: 'USB Camera' },
    { id: 'virtual-camera', label: 'OBS Virtual Camera', type: 'Virtual Device' },
  ];

  return (
    <div className="w-full">
        {/* Responsive flex container: Wraps on small screens, centers content, and aligns left on medium+ screens */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 p-2 ">
            <MediaDropdown
                icon={<Mic className="w-5 h-5" />}
                label="Default"
                options={micOptions}
                defaultValue="default-mic"
            />
            
            <MediaDropdown
                icon={<Volume2 className="w-5 h-5" />}
                label="Default"
                options={speakerOptions}
                defaultValue="default-speaker"
            />
            
            <MediaDropdown
                icon={<Video className="w-5 h-5" />}
                label="Hy-UXGA(AF)..."
                options={cameraOptions}
                defaultValue="default-camera"
            />
        </div>
    </div>
  );
};

export default Dropdown;