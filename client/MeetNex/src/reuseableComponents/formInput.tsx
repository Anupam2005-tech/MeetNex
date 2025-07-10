import type { FieldErrors } from "react-hook-form";
import type { UseFormRegister } from "react-hook-form";

interface FormInputProps {
  label: string;
  register: UseFormRegister<any>;
  required: boolean;
  type?: string;
  placeholder?: string;
  name: string;
  errors: FieldErrors;
}

const FormInput = ({
  label,
  register,
  required,
  type = "text",
  placeholder,
  name,
  errors,
}: FormInputProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-black dark:text-white mb-1">{label}</label>
    <input
      {...register(name, { required })}
      type={type}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
        bg-white text-black placeholder:text-gray-500 
        dark:bg-zinc-900 dark:text-white dark:placeholder:text-neutral-400
        ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{label} is required.</p>
    )}
  </div>
);


export default FormInput;
