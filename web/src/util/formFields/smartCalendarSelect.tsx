import React, { useState, useEffect } from 'react'
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone'

import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone'
import {
  startOfWeek,
  startOfDay,
  endOfDay,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns'
import { setLabels } from 'react-chartjs-2/dist/utils'
import DatePicker from 'react-datepicker'
import Select from 'react-select'

import CustomDatePicker from './CustomDatePicker'
const customStyles = {
  control: (base) => ({
    ...base,
    height: 31,
    minHeight: 30,
    padding: 0,
  }),
  valueContainer: (base) => ({
    ...base,
    alignItems: 'initial',
    paddingTop: 5,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    paddingTop: 5,
  }),
  indicatorSeparator: (base) => ({
    ...base,
    marginTop: 6,
    marginBottom: 10,
  }),
  menu: (provided) => ({ ...provided, marginTop: 0, zIndex: 9999 }),
}
const customStylesVerySmall = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    padding: 0,
  }),
  valueContainer: (base) => ({
    ...base,
    alignItems: 'initial',
    paddingTop: 0,
    marginTop: 3,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    paddingTop: 5,
  }),
  indicatorSeparator: (base) => ({
    ...base,
    marginTop: 6,
    marginBottom: 10,
  }),
  menu: (provided) => ({ ...provided, marginTop: 0, zIndex: 9999 }),
  menuList: (provided, state) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
  }),
}

export const SlimSelectBox = ({
  onChange,
  options,
  value,
  name,
  label,
  placeholder,
  className,
 
}) => {
  const defaultValue = (options, value) => {
    return (
      (options ? options.find((option) => option.value === value) : '') || ''
    )
  }

  return (
    <div className="">
      {label != '' && !['Assign To', 'Add Participants'].includes(label) && (
        <label className="label font-regular text-sm ">{label}</label>
      )}
      <Select
        minMenuHeight={150}
        name={name}
        value={defaultValue(options, value)}
        placeholder={placeholder || label || 'All Projects'}
        onChange={(value) => {
          onChange(value)
        }}
        options={options}
        className={`text-sm  ${
          label != '' ? 'mt-1' : ''
        } border-transparent p-0`}
        classNamePrefix="react-select"
        styles={customStyles}
      />
      {/* <ErrorMessage
        component="div"
        name={name}
        className="error-message text-red-700 text-xs px-2"
      /> */}
    </div>
  )
}
export const VerySlimSelectBox = ({
  onChange,
  options,
  value,
  name,
  label,
  customStyles,
  placeholder,
  className,
}) => {
  const defaultValue = (options, value) => {
    return (
      (options ? options.find((option) => option.value === value) : '') || ''
    )
  }

  return (
    <div className="">
      {label != '' && !['Assign To', 'Add Participants'].includes(label) && (
        <label className="label font-regular text-sm font-semibold text-semibold ">
          {label}
        </label>
      )}
      <Select
        maxMenuHeight={150}
        name={name}
        value={defaultValue(options, value)}
        placeholder={placeholder || label || 'All Projects'}
        onChange={(value) => {
          onChange(value)
        }}
        options={options}
        className={`text-sm font-semibold mt-0  ${
          label != '' ? '' : ''
        } border-transparent p-0`}
        classNamePrefix="react-select"
        styles={customStylesVerySmall}
        theme={(theme) => ({
          ...theme,

          colors: {
            ...theme.colors,
            primary25: '#efefef',
            primary: '#444',
          },
        })}
      />
    </div>
  )
}

export const SmartCalendarSelect = ({
  onChange,
  // options,
  // value,
  // name,
  label,
  placeholder,
  defaultForTeamLeads = false,
  // className,
}) => {
  {
    ;<label className="label font-regular text-sm ">{label}</label>
  }
  //   const defaultValue = (options, value) => {
  //     return (
  //       (options ? options.find((option) => option.value === value) : '') || ''
  //     )
  //   }
  // console.log(options,'opt')





  // const [dateRange, setDateRange] = useState([null, null])

  const d = new window.Date()


  // const d = new Date()
  const teamLeadDefault = [subMonths(startOfMonth(d), 6), endOfDay(d)]
  const normalDefault = [startOfDay(d), endOfDay(d)]
  
  const [dateRange, setDateRange] = useState(
    defaultForTeamLeads ? teamLeadDefault : normalDefault
  )
  

  const [startDate, endDate] = dateRange

  const [options, setOptions] = useState([
    {
      label: 'All Dates',
      value: [null, null],
    },
    {
      label: 'Today',
      value: [startOfDay(d), endOfDay(d)],
    },
    {
      label: 'This Week',
      value: [startOfWeek(d), endOfWeek(d)],
    },
    {
      label: 'This Month',
      value: [startOfMonth(d), endOfMonth(d)],
    },
    // {
    //   label: 'Last 6 months',
    //   value: [subMonths(startOfMonth(d), 6), endOfDay(d)],
    // },
    { label: 'Last 6 months', value: teamLeadDefault },
    {
      label: 'Custome Range',
      value: [startDate, endDate],
    },
  ])
  useEffect(() => {
    if (dateRange[0] != null) {
      const [startDate, endDate] = dateRange
      // onChange(startDate?.getTime())
      onChange([startDate, endDate])
    }
  }, [dateRange])


 


  useEffect(() => {
    if (defaultForTeamLeads) {
      setValue('Last 6 months')
      onChange(teamLeadDefault)
    } else {
      setValue('Today')
      onChange(normalDefault)
    }
  }, [defaultForTeamLeads])



  useEffect(() => {
    if (label === startOfDay(d).getTime()) {
      setValue('Today')
    } else if (label === startOfWeek(d).getTime()) {
      setValue('This Week')
    } else if (label === startOfMonth(d).getTime()) {
      setValue('This Month')
    } else if (label === subMonths(startOfMonth(d), 6).getTime()) {
      setValue('Last 6 months')
    }
  }, [label])

  const [value, setValue] = useState(label ? label : 'Today')
  const [isDatePicker, setDatePicker] = useState(false)

  console.log(value, 'value')
  return (
    <div style={{ width: '200px'}} className="ml-4">
      {/* {label != '' && label != 'Assign To' && (
        <label className="label font-regular text-sm ">{label}</label>
      )} */}
                      {/* <CalendarMonthTwoToneIcon className="mr-1 mt-[2px] h-4 w-4" /> */}

      {!isDatePicker ? (
        <Select
          maxMenuHeight={150}
          name={name}
          value={value}
          placeholder={value}
          onChange={(evt) => {
            setValue(evt.label)
            onChange(evt.value)
            if (evt.label === 'Custome Range') {
              setDatePicker(true)
            }
          }}
          options={options}
          className={`text-sm  ${
            label != '' ? 'mt-0' : ''
          } border-transparent  border-0 p-0`}
          classNamePrefix="react-select"
          styles={customStyles}
        />
      ) : (
        <div className="flex" style={{ alignItems: 'flex-end' }}>
          <CustomDatePicker
            className={`z-10 pl- py-[6px] px-3 inline text-xs text-[#0091ae] placeholder-green-800 cursor-pointer  max-w-fit   ${'font-semibold  '} border border-[#cccccc] rounded-[4px]`}
            // onCalendarClose={() => setDatePicker(false)}
            placeholderText="&#128467;	 Custom"
            onChange={(update) => {
              setDateRange(update)
              console.log('was this updated', update, startDate)
            }}
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            isClearable={false}
            // dateFormat="MMM d, yyyy "
            //dateFormat="d-MMMM-yyyy"
            dateFormat="MMM dd, yyyy"
          />
          <CloseTwoToneIcon
            onClick={() => {
              setDatePicker(false)
              setValue('Today')
              onChange([startOfDay(d), endOfDay(d)])
            }}
          />
        </div>
      )}
      {/* <ErrorMessage
        component="div"
        name={name}
        className="error-message text-red-700 text-xs px-2"
      /> */}
    </div>
  )
}
