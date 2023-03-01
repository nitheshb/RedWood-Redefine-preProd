/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'

import { ErrorMessage, useField } from 'formik'
// import { InputField, Label } from '@redwoodjs/forms'

export const TextField2 = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div className="relative z-0 text-sm">
      <input
        type="text"
        name="name"
        className={`${
          meta.touched && meta.error && 'is-invalid'
        } block w-full px-3 py-2 leading-5 text-gray-700 bg-white border-2 border-blue-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out`}
        placeholder=" "
        autoComplete="off"
        {...field}
        {...props}
      />
      <label
        htmlFor={field.name}
        className="block bg-white absolute left-3 -top-3 text-gray-600 text-sm"
      >
        {label}
        <ErrorMessage
          component="div"
          name={field.name}
          className="error-message text-red-700 text-xs p-1 mx-auto"
        />
      </label>
    </div>
  )
}
