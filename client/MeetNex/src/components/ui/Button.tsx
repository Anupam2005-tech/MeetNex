import { type IconType } from 'react-icons';

interface ButtonProps {
  text: string;
  icon?: IconType;
}

const Button = ({ text, icon: Icon }: ButtonProps) => {
  return (
    <button className="px-8 py-2 rounded-full hover:cursor-pointer bg-gradient-to-b from-blue-500 to-blue-600 text-white flex items-center gap-2">
      {Icon && <Icon size={18} />}
      <span>{text}</span>
    </button>
  );
};



export default Button;
