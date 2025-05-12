import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { setHours, setMinutes } from 'date-fns'
import { useEffect, useState } from 'react'

export default function EditLeadTask({
  editTaskObj,
  setStartDate,
  startDate,
  takTitle,
  setTitleFun,
  cancelResetStatusFun,
  editTaskFun,
  d,
}) {
  const [pickerDate, setPickerDate] = useState(new Date(startDate))
  useEffect(() => {
    console.log('date issue ', startDate)
    setPickerDate(new Date(startDate))
  }, [])

  useEffect(() => {
    console.log('date issue ', startDate)
    setPickerDate(new Date(startDate))
  }, [startDate])

  const [error, setError] = useState(false)
  useEffect(() => {
    if (takTitle === 'undefined' || takTitle === '') {
      setError(true)
    } else {
      setError(false)
    }
  }, [takTitle])

  return (
    <div className=" form   py-4 border rounded-lg">
      <section className=" px-4">
        <div className="font-[Outfit] py-2 font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#616162]">
          Edit Title
          {error && (
            <div className="error-message text-red-700 text-xs p-1">
              {' '}
              Title Required
            </div>
          )}
        </div>
        <input
          name="taskTitle"
          type="text"
          value={takTitle}
          onChange={(e) => {
            setTitleFun(e)
          }}
          placeholder="Enter a short title"
          className="w-full h-full pb-1 outline-none text-sm    border-b border-[#cdcdcd] text-[33475b]  "
        ></input>
        <div className="flex flex-row mt-3">
          <section>
            <span className="font-[Outfit] py-2 font-normal text-[12px] leading-[100%] tracking-[0.06em] text-[#616162]">
              Edit Due Date
            </span>


            <div className="w-full border-b border-gray-300">
  <DatePicker
    className="w-full text-xs text-[#0091ae] outline-none bg-transparent py-1"
    selected={pickerDate}
    onChange={(date) => {
      console.log('am i coming here', date, date.getTime())
      setStartDate(date.getTime())
    }}
    showTimeSelect
    timeFormat="HH:mm"
    injectTimes={[
      setHours(setMinutes(d, 1), 0),
      setHours(setMinutes(d, 5), 12),
      setHours(setMinutes(d, 59), 23),
    ]}
    dateFormat="MMMM d, yyyy h:mm aa"
  />
</div>


          </section>
        </div>
      </section>
      <div className="flex flex-row mt-4 justify-between pr-4">
        <section>
          <span>{''}</span>
        </section>
        <section className="flex">
          <button
            type="submit"
            onClick={() => {
              if (!error) {
                console.log('edit tsk obj ', editTaskObj)
                editTaskFun(editTaskObj)
              }
            }}
            className={`flex mt-2 cursor-pointer rounded-lg items-center justify-center  h-[36px]  py-2 px-6 text-sm font-medium sale_bg_color sales_text_color  `}
          >
            <span className="">Save Task</span>
          </button>
          <button
            // onClick={() => fSetLeadsType('Add Lead')}
            onClick={() => cancelResetStatusFun()}
            className={`flex mt-2 ml-4 rounded-lg  items-center   justify-center h-[36px]  py-2 px-6 text-sm font-medium border `}
          >
            <span className="">Cancel</span>
          </button>
        </section>
      </div>
    </div>
  )
}
