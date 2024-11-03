import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({
  handleDateChange,
  value,
}: {
  handleDateChange?: any;
  value?: any;
}) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  // const handleDateChange = (date: Date | null) => {
  //   setStartDate(date ?? new Date()); // Use `??` to provide a default value
  // };

  return (
    <DatePicker
      selected={value}
      onChange={handleDateChange}
      className="dark:bg-[rgb(18,18,18)] dark:border-slate-700 date_picker_custom"
    />
  );
};

export default DatePickerComponent;
