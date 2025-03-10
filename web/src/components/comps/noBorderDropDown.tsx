

import React from 'react'
import Select from 'react-select'
import { ErrorMessage } from 'formik'
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    background: '#fff',
    minHeight: '32px',
    height: '32px',
    boxShadow: state.isFocused ? null : null,
    border: '0px solid #000',
    fontSize: '12px',
    borderRadius: '0', 
    boxShadow: 'none', 
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: '31px',
    padding: '0px',
    fontSize: '12px',
    margin: '0px'

  }),

  input: (provided, state) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorSeparator: state => ({
    display: 'none',
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '31px',
    paddingLeft: '0px',
    paddingRight: '0px',
    // background: '#E5E7EB'

  }),
  singleValue: (provided, state) => ({
    ...provided,

    fontSize: '12px',

  }),
  placeHolder: (provided, state) => ({
    ...provided,

    fontSize: '12px',

  }),
  placeholder: (provided, state) => ({
    ...provided,

    fontSize: '12px',

  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
}


export const NoBorderDropDown = ({
  onChange,
  options,
  value,
  name,
  label,
  className,
}) => {
  const defaultValue = (options, value) => {
    return (
      (options ? options?.find((option) => option?.value === value) : '') || ''
    )
  }

  return (
    <label>
      <div className={className}>
        {(label != '' || label != 'Assigned To') && (
          <label className=" font-regular text-[10px] block text-gray-500 bg-red">{label}</label>
        )}
        <label>
          <Select
            maxMenuHeight={150}
            name={name}
            value={defaultValue(options, value)}
            placeholder={label=== "Maritual Status" ? 'Married' : label ||  'S/O'}
            onChange={(value) => {
              onChange(value)
            }}
            options={options}
            className={`text-sm text-gray-darker bg-red ${
              label != '' ? 'mt-' : ''
            } border-transparent`}
            styles={customStyles}
          />
        </label>
        <ErrorMessage
        component="div"
        name={name}
        className="error-message text-red-700 text-xs px-2 "
      />

      </div>
    </label>
  )
}

export default NoBorderDropDown;
