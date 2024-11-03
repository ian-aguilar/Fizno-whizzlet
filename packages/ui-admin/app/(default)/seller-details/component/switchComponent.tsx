import React from "react";

interface SwitchComponentProps {
  capabilities: boolean;
  setCapabilities: (value: boolean) => void;
  label: string;
}

export default function SwitchComponent({
  capabilities,
  setCapabilities,
  label,
}: SwitchComponentProps) {
  return (
    <>
      <div className="my-3 w-96">
        {/* Start */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-black font-semibold dark:text-slate-500 ">
            {label}
          </div>
          <div className="form-switch">
            <input
              type="checkbox"
              id="switch-1"
              className="sr-only"
              checked={capabilities}
              onChange={() => setCapabilities(!capabilities)}
            />
            <label
              className="bg-slate-400 dark:bg-slate-700"
              htmlFor="switch-1"
            >
              <span className="bg-white shadow-sm" aria-hidden="true"></span>
              <span className="sr-only">Switch label</span>
            </label>
          </div>
        </div>
        {/* End */}
      </div>
    </>
  );
}
