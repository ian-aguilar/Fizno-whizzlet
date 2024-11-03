import React, { useState } from "react";
import Multiselect from "multiselect-react-dropdown";

interface MultiselectDropdownProps {
  label: string;
  options: any[]; // Define the type of options
  className?: string;
  handleSelect?: (e: any) => void;
  handleRemove?: (e: any) => void;
  selectedValues?: any[];
}

const MultiselectDropdown: React.FC<MultiselectDropdownProps> = ({
  label,
  options,
  className,
  handleSelect,
  handleRemove,
  selectedValues,
}) => {
  const [showAllOptions, setShowAllOptions] = useState(false);

  return (
    <div className="multi_select_div ">
      <label
        className={`block text-zinc-600 text-sm font-bold mb-1 ${className}`}
        htmlFor={label}
      >
        {label}
      </label>
      <div className="">
        <Multiselect
          className="border border-slate-200 "
          displayValue="label"
          selectedValues={selectedValues}
          onRemove={handleRemove}
          onSelect={handleSelect}
          options={options} // Pass options from parent component
          showCheckbox
          closeIcon="cancel"
          style={{ multiselectContainer: { width: "100%" } }}
        />
      </div>
    </div>
  );
};

export default MultiselectDropdown;
