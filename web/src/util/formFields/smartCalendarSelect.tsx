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
    borderRadius: 8,
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

// export const SmartCalendarSelect = ({
//   onChange,
//   // options,
//   // value,
//   // name,
//   label,
//   placeholder,
//   defaultForTeamLeads = false,
//   // className,
// }) => {
//   {
//     ;<label className="label font-regular text-sm ">{label}</label>
//   }
//   //   const defaultValue = (options, value) => {
//   //     return (
//   //       (options ? options.find((option) => option.value === value) : '') || ''
//   //     )
//   //   }
//   // console.log(options,'opt')
//   // const [dateRange, setDateRange] = useState([null, null])

//   const d = new window.Date()


//   // const d = new Date()
//   const teamLeadDefault = [subMonths(startOfMonth(d), 6), endOfDay(d)]
//   const normalDefault = [startOfDay(d), endOfDay(d)]
//   const todayDefault = [startOfDay(d), endOfDay(d)]
//   const thisWeekDefault = [startOfWeek(d), endOfWeek(d)]
//   const thisMonthDefault = [startOfMonth(d), endOfMonth(d)]
  
//   const [dateRange, setDateRange] = useState(
//     defaultForTeamLeads ? teamLeadDefault : normalDefault
//   )
  

//   const [startDate, endDate] = dateRange

//   const [options, setOptions] = useState([
//     {
//       label: 'All Dates',
//       value: [null, null],
//     },
//     {
//       label: 'Today',
//       // value: [startOfDay(d), endOfDay(d)],
//       value: todayDefault,
//     },
//     {
//       label: 'This Week',
//       // value: [startOfWeek(d), endOfWeek(d)],
//       value: thisWeekDefault,
//     },
//     {
//       label: 'This Month',
//       // value: [startOfMonth(d), endOfMonth(d)],
//       value: thisMonthDefault,
//     },
//     // {
//     //   label: 'Last 6 months',
//     //   value: [subMonths(startOfMonth(d), 6), endOfDay(d)],
//     // },
//     { label: 'Last 6 months', 
//       value: teamLeadDefault 
//     },
//     {
//       label: 'Custome Range',
//       value: [startDate, endDate],
//     },
//   ])



//   const [wasAutoSwitched, setWasAutoSwitched] = useState(defaultForTeamLeads)

//   // const [wasAutoSwitched, setWasAutoSwitched] = useState(false)


//   const [isAllDatesExplicitlySelected, setIsAllDatesExplicitlySelected] = useState(false)




//   useEffect(() => {
//     if (dateRange[0] != null) {
//       const [startDate, endDate] = dateRange
    
//       onChange([startDate, endDate])
//     }
//   }, [dateRange])

//   const [value, setValue] = useState(label ? label : 'Today')
//   const [isDatePicker, setDatePicker] = useState(false)

//   console.log(value, 'value')


// // const handleSelectChange = (evt) => {

// //   if (defaultForTeamLeads && evt.label === 'All Dates' && !wasAutoSwitched) {
// //     setValue('Last 6 months')
// //     onChange(teamLeadDefault)
// //     setWasAutoSwitched(true)
// //     return
// //   }


// //   if (evt.label === 'All Dates') {
// //     setValue('All Dates')
// //     onChange([null, null])
// //     return
// //   }

// //   setValue(evt.label)
// //   onChange(evt.value)
  
// //   if (evt.label === 'Custome Range') {
// //     setDatePicker(true)
// //   }
// // }


// const handleSelectChange = (evt) => {

//   if (evt.label === 'All Dates') {

//     if (defaultForTeamLeads && !isAllDatesExplicitlySelected) {

//       setValue('Last 6 months')
//       onChange(teamLeadDefault)
      

//       setIsAllDatesExplicitlySelected(true)
//       return
//     }
    

//     setValue('All Dates')
//     onChange([null, null])
    

//     setIsAllDatesExplicitlySelected(false)
//     return
//   }

  
//   setValue(evt.label)
//   onChange(evt.value)
  
//   if (evt.label === 'Custome Range') {
//     setDatePicker(true)
//   }
// }

//   if (defaultForTeamLeads) {

//     if (value === 'All Dates' && !wasAutoSwitched) {
//       setValue('Last 6 months')
//       onChange(teamLeadDefault)
//       setWasAutoSwitched(true)
//     }
//   }

//   return (
//     <div style={{ width: '200px'}} className="ml-4">
//       {/* {label != '' && label != 'Assign To' && (
//         <label className="label font-regular text-sm ">{label}</label>
//       )} */}
//                       {/* <CalendarMonthTwoToneIcon className="mr-1 mt-[2px] h-4 w-4" /> */}

//       {!isDatePicker ? (
//         <Select
//           maxMenuHeight={150}
//           name={name}
//           value={value}
//           onChange={handleSelectChange}
//           placeholder={value}
//           // onChange={(evt) => {
//           //   setValue(evt.label)
//           //   onChange(evt.value)
//           //   if (evt.label === 'Custome Range') {
//           //     setDatePicker(true)
//           //   }
//           // }}

//           onChange={(evt) => {
//             // Special handling for Team Leads when "All Dates" is selected
//             if (defaultForTeamLeads && evt.label === 'All Dates') {
//               setValue('Last 6 months')
//               onChange(teamLeadDefault)
//               return
//             }
          
//             setValue(evt.label)
//             onChange(evt.value)
//             if (evt.label === 'Custome Range') {
//               setDatePicker(true)
//             }
//           }}
//           options={options}
//           className={`text-sm  ${
//             label != '' ? 'mt-0' : ''
//           } border-transparent  border-0 p-0`}
//           classNamePrefix="react-select"
//           styles={customStyles}
//         />
//       ) : (
//         <div className="flex" style={{ alignItems: 'flex-end' }}>
//           <CustomDatePicker
//             className={`z-10 pl- py-[6px] px-3 inline text-xs text-[#0091ae] placeholder-green-800 cursor-pointer  max-w-fit   ${'font-semibold  '} border border-[#cccccc] rounded-[4px]`}
//             // onCalendarClose={() => setDatePicker(false)}
//             placeholderText="&#128467;	 Custom"
//             onChange={(update) => {
//               setDateRange(update)
//               console.log('was this updated', update, startDate)
//             }}
//             selectsRange={true}
//             startDate={startDate}
//             endDate={endDate}
//             isClearable={false}
//             // dateFormat="MMM d, yyyy "
//             //dateFormat="d-MMMM-yyyy"
//             dateFormat="MMM dd, yyyy"
//           />
//           <CloseTwoToneIcon
//             onClick={() => {
//               setDatePicker(false)
//               setValue('Today')
//               onChange([startOfDay(d), endOfDay(d)])
//             }}
//           />
//         </div>
//       )}
//       {/* <ErrorMessage
//         component="div"
//         name={name}
//         className="error-message text-red-700 text-xs px-2"
//       /> */}
//     </div>
//   )
// }


export const SmartCalendarSelect = ({
  onChange,
  label,
  placeholder,
  defaultForTeamLeads = false,
}) => {
  const d = new window.Date()
  
  const teamLeadDefault = [subMonths(startOfMonth(d), 6), endOfDay(d)]
  const normalDefault = [null, null] // All Dates
  const todayDefault = [startOfDay(d), endOfDay(d)]
  const thisWeekDefault = [startOfWeek(d), endOfWeek(d)]
  const thisMonthDefault = [startOfMonth(d), endOfMonth(d)]
  
  const [dateRange, setDateRange] = useState(normalDefault)
  const [startDate, endDate] = dateRange

  const [options] = useState([
    {
      label: 'All Dates',
      value: [null, null],
    },
    {
      label: 'Today',
      value: todayDefault,
    },
    {
      label: 'This Week',
      value: thisWeekDefault,
    },
    {
      label: 'This Month',
      value: thisMonthDefault,
    },
    { 
      label: 'Last 6 months', 
      value: teamLeadDefault 
    },
    {
      label: 'Custome Range',
      value: [startDate, endDate],
    },
  ])

  const [value, setValue] = useState('All Dates')
  const [isDatePicker, setDatePicker] = useState(false)

  useEffect(() => {
    if (defaultForTeamLeads && value === 'All Dates') {
      setValue('Last 6 months')
      onChange(teamLeadDefault)
      setDateRange(teamLeadDefault)
    }
  }, [defaultForTeamLeads])

  const handleSelectChange = (evt) => {
    setValue(evt.label)
    onChange(evt.value)
    setDateRange(evt.value)
    
    if (evt.label === 'Custome Range') {
      setDatePicker(true)
    }
  }

  return (
    <div style={{ width: '200px'}}>
      {!isDatePicker ? (
        <Select
          maxMenuHeight={150}
          name={name}
          value={value}
          onChange={handleSelectChange}
          placeholder={value}
          options={options}
          className={`text-sm ${label != '' ? 'mt-0' : ''} border-transparent border-0 p-0`}
          classNamePrefix="react-select"
          styles={customStyles}
        />
      ) : (
        <div className="flex" style={{ alignItems: 'flex-end' }}>
          <CustomDatePicker
            className={`z-10 pl- py-[6px] px-3 inline text-xs text-[#0091ae] placeholder-green-800 cursor-pointer max-w-fit ${'font-semibold'} border border-[#cccccc] rounded-[4px]`}
            placeholderText="&#128467; Custom"
            onChange={(update) => {
              setDateRange(update)
            }}
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            isClearable={false}
            dateFormat="MMM dd, yyyy"
          />
          <CloseTwoToneIcon
            onClick={() => {
              setDatePicker(false)
              setValue(defaultForTeamLeads ? 'Last 6 months' : 'Today')
              onChange(defaultForTeamLeads ? teamLeadDefault : todayDefault)
              setDateRange(defaultForTeamLeads ? teamLeadDefault : todayDefault)
            }}
          />
        </div>
      )}
    </div>
  )
}
