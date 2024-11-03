import React from "react";
import Select from "react-select";
import TooltipCustom from "../tooltip/tooltip";

interface DropdownProps {
  isSearchable?: boolean;
  isDisabled?: boolean;
  Options?: any;
  label?: string;
  tooltipMessage?: string;
  showTooltip?: boolean;
  onChange?: (data: any) => void;
  value?: any;
  name?: string;
  error?: string | boolean;
  onBlur?: (e: any) => void;
  className?: string;
  placeholder?: string;
}

const SearchSingleSelect: React.FC<DropdownProps> = ({
  isSearchable,
  isDisabled,
  Options,
  label,
  tooltipMessage,
  showTooltip,
  onChange,
  value,
  name,
  error,
  onBlur,
  className,
  placeholder,
}) => {
  return (
    <>
      <label className={"flex text-zinc-600 text-sm font-bold mb-1 "}>
        {label}{" "}
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
      <Select
        className="dark:bg-slate-800"
        classNamePrefix="select"
        value={Options?.find((option: any) => option.value === value)}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        name={name}
        options={Options}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
      />
      {error ? <div className="text-red-600 text-sm mt-1">{error}</div> : null}
    </>
  );
};

export default SearchSingleSelect;
