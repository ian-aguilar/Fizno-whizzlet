import React from "react";
import TooltipCustom from "../tooltip/tooltip";

interface InputComponentProps {
  label: string;
  className?: string;
  value?: string; // Define the type for the value prop
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  onChange?: (newValue: any) => void; // Correct type for onChange
  tooltipMessage?: string;
  showTooltip?: boolean;
  name?: string;
  onBlur?: (newValue: any) => void;
  error?: string | boolean;
  mandatory?: boolean;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  className,
  value,
  disabled,
  placeholder,
  onChange,
  type,
  tooltipMessage,
  showTooltip,
  name,
  onBlur,
  error,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e); // Pass the new value to the parent component
    }
  };
  return (
    <div>
      <label
        className={`block text-zinc-600 text-sm font-bold mb-1 flex  ${className}`}
        htmlFor={label}
      >
        {label}
        {showTooltip ? (
          <TooltipCustom bg="light" className="ms-2 ">
            <div className="text-[10px] font-normal text-slate-900 min-w-52 ">
              {tooltipMessage}
            </div>
          </TooltipCustom>
        ) : (
          ""
        )}
      </label>
      <input
        className="h-9 px-2 rounded-sm border border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleChange}
        type={type}
        {...rest}
        name={name}
        onBlur={onBlur}
      />
      {error ? <div className="text-red-600 text-sm mt-1">{error}</div> : null}
    </div>
  );
};

export default InputComponent;
