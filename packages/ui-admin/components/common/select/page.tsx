import React, { useState } from "react";
import Multiselect from "multiselect-react-dropdown";

interface SelectComponentProps {
  label: string;
  options: any[];
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  selectedValue?: any;
  onSelect?: (e: any) => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  label,
  options,
  className,
  disabled,
  placeholder,
  selectedValue,
  onSelect,
}) => {
  return (
    <div className="multi_select_div ">
      <label
        className={`block text-zinc-600 text-sm font-bold mb-1 ${className}`}
        htmlFor={label}
      >
        {label}
      </label>
      <div className="relative">
        <Multiselect
          disable={disabled}
          displayValue="label"
          options={options}
          singleSelect
          placeholder={placeholder}
          selectedValues={selectedValue ? [selectedValue] : []}
          onSearch={() => console.log("search")}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export default SelectComponent;
