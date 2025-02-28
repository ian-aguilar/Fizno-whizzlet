"use client";

import Flatpickr from "react-flatpickr";
import { Hook, Options } from "flatpickr/dist/types/options";

export default function Datepicker({ align }: { align?: "left" | "right" }) {
  const onReady: Hook = (selectedDates, dateStr, instance) => {
    (instance.element as HTMLInputElement).value = dateStr.replace("to", "-");
    const customClass = align ?? "";
    instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
  };

  const onChange: Hook = (selectedDates, dateStr, instance) => {
    (instance.element as HTMLInputElement).value = dateStr.replace("to", "-");
  };

  const options: Options = {
    mode: "range",
    static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    defaultDate: [new Date().setDate(new Date().getDate() - 6), new Date()],
    prevArrow: "<",
    nextArrow: ">",
    onReady,
    onChange,
  };

  return (
    <div className="relative">
      <Flatpickr
        className="form-input pl-9 dark:bg-slate-800 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200 font-medium w-[15.5rem]"
        options={options}
      />
      <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 ml-3"
          viewBox="0 0 16 16"
        >
          <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
        </svg>
      </div>
    </div>
  );
}
