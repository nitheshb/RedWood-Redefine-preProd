import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useField, ErrorMessage } from "formik";

export const DateField2 = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="relative z-0 text-sm">
      <DatePicker
  selected={selectedDate}
  onChange={(date) => {
    setSelectedDate(date);
    helpers.setValue(date);
  }}
  dateFormat="dd/MM/yyyy"
  showMonthDropdown
  showYearDropdown
  dropdownMode="select"
  className={`${
    meta.touched && meta.error && "is-invalid"
  } block w-32 px-3 py-2 leading-5 text-gray-700 bg-white border-2 border-blue-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out`}
  placeholderText=" "
  autoComplete="off"
  {...field}
  {...props}
/>

      <label
        htmlFor={field.name}
        className="block bg-white absolute left-3 -top-3 text-gray-600 text-sm"
      >
        {label}
      </label>
      <ErrorMessage
        component="div"
        name={field.name}
        className="error-message text-red-700 text-xs p-1 mx-auto"
      />
    </div>
  );
};
