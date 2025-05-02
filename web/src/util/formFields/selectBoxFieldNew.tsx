import React from 'react'

import { ErrorMessage } from 'formik'
import Select from 'react-select'
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    background: '#fff',
    // borderColor: '#9e9e9e',
    minHeight: '32px',
    height: '32px',
    boxShadow: state.isFocused ? null : null,
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: '30px',
    padding: '0 6px',
  }),

  input: (provided, state) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorSeparator: (state) => ({
    display: 'none',
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '30px',
  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
}

const formatOptionLabel = ({ value, label, dept }) => (
  <div style={{ display: 'flex' }}>
    <div>{label}</div>
    <div
      style={{
        marginLeft: '10px',
        color: '#118d57',
        background: '#22c55e29',
        padding: '0px 8px',
        paddingBottom: '2px',
        borderRadius: '10px',
        fontSize: '10px',
        height: '21px',
      }}
    >
      {dept}
    </div>
  </div>
)
export const CustomSelectNew = ({
  onChange,
  options,
  value,
  name,
  showLabel,
  label,
  placeholder,
  className,
}) => {
  const defaultValue = (options, value) => {
    return (
      (options ? options?.find((option) => option?.value === value) : '') || ''
    )
  }

  return (
    <Select
      maxMenuHeight={150}
      name={name}
      value={defaultValue(options, value)}
      placeholder={placeholder}
      onChange={(value) => {
        onChange(value)
      }}
      options={options}
      // components={{ Option: CustomOption }}
      // getOptionLabel={(option) => `${option.label} - ${option.dept}`}
      formatOptionLabel={formatOptionLabel}
      className={`text-sm  w-full ${
        label != '' ? 'mt-' : ''
      } border-transparent`}
      styles={customStyles}
    />
  )
}
