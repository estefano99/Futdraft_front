import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateTimePicker({ value, onChange }) {
  return (
    <DatePicker
      className="p-2 w-full border border-gray-500 rounded-md"
      selected={value ? new Date(value) : null}
      onChange={(date) => onChange(date)}
      showTimeSelect
      dateFormat="Pp" // Formato de fecha y hora
    />
  );
}
