import React from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';
import range from 'lodash/range';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({ selected, onChange, ...props }) => {
  const years = range(1850, getYear(new Date()) + 1, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <DatePicker
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            padding: "5px",
            background: "#f2f2f2",
            borderRadius: "5px",
          }}
        >
          <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            style={{
              border: "1px solid #ccc",
              background: "#fff",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "3px",
              marginRight: "5px",
            }}
          >
            {"<"}
          </button>


          <select
            value={months[getMonth(date)]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
            style={{
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>



          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(value)}
            style={{
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            style={{
              border: "1px solid #ccc",
              background: "#fff",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "3px",
              marginLeft: "5px",
            }}
          >
            {">"}
          </button>
        </div>
      )}
      selected={selected}
      onChange={onChange}
      {...props}
    />
  );
};

export default CustomDatePicker;
