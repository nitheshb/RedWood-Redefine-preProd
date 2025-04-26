/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useEffect, useState } from 'react'
import { XIcon } from '@heroicons/react/solid'
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone'
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone'
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone'
import ScheduleSendTwoToneIcon from '@mui/icons-material/ScheduleSendTwoTone'
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone'
import { setHours, setMinutes } from 'date-fns'

const todaydate = new Date()
const torrowDate = new Date(
  +new Date().setHours(0, 0, 0, 0) + 86400000
).getTime()
export default function AddLeadTaskComment({
  closeTask,
  data,
  setShowVisitFeedBackStatusFun,
  setShowNotInterestedFun,
  setAddCommentTitle,
  addCommentTitle,
  addCommentTime,
  setClosePrevious,
  setPostPoneToFuture,
  setAddCommentPlusTask,
  setAddCommentTime,
  cancelResetStatusFun,
  addTaskCommentFun,
  addCommentPlusTask,
  setSelType,
  selType,

  d,
}) {
  const [error, setError] = useState(false)
  const [hover, setHover] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [intialSchTime, setIntialSchTime] = useState(0)

  const [pickerDate, setPickerDate] = useState(new Date(addCommentTime))
  useEffect(() => {
    console.log('date issue ', addCommentTime)
    setPickerDate(new Date(addCommentTime))
  }, [])

  useEffect(() => {
    console.log('date issue ', addCommentTime)
    setPickerDate(new Date(addCommentTime))
  }, [addCommentTime])

  const [hoverId, setHoverID] = useState(1000)
  const [hoverTasId, setHoverTasId] = useState(2000)
  useEffect(() => {
    if (addCommentTitle === 'undefined' || addCommentTitle === '') {
      setError(true)
    } else {
      setError(false)
    }
  }, [addCommentTitle])
  useEffect(() => {
    setError(false)
    setIntialSchTime(addCommentTime)
  }, [])
  const hoverEffectFun = (id) => {
    setHoverID(id)
  }
  const hoverEffectTaskFun = (id) => {
    setHoverTasId(id)
  }

  const setPostPoneCounterFun = (myDate) => {
    if (intialSchTime > torrowDate && myDate < torrowDate) {
      console.log(
        'am i coming here Future2Present',
        intialSchTime < torrowDate,
        myDate < torrowDate
      )
      // Future2Present
      setPostPoneToFuture('Future2Present')
    } else if (intialSchTime < torrowDate && myDate > torrowDate) {
      // present to future
      console.log(
        'am i coming here 1 present2Future',
        intialSchTime < torrowDate,
        myDate > torrowDate
      )
      setPostPoneToFuture('present2Future')
    } else if (intialSchTime < torrowDate && myDate < torrowDate) {
      console.log(
        'am i coming here present',
        intialSchTime < torrowDate,
        myDate < torrowDate
      )
      setPostPoneToFuture('present')
    }
  }

  return (
    <div className=" form outline-none   py-2 mx-4  max-h-[72px] min-h-[72px] mb-4">
      <div className="flex flex-row justify-between px-4">
        <section className="w-full flex flex-col">
          {addCommentTitle === '' && !clicked && !addCommentPlusTask && (
            <section className="flex flex-row mt-2">
              {[
                {
                  type: 'reschedule',
                  label: 'RNR',
                  desc: 'RNR',
                },
                {
                  type: 'reschedule',
                  label: 'Busy',
                  desc: 'Call again as customer is busy now.',
                },
                {
                  type: 'reschedule',
                  label: 'SwitchedOff',
                  desc: 'Phone Switched Off',
                },
                {
                  type: 'reschedule',
                  label: 'Reschedule',
                  desc: 'Rescheduling:',
                },

                {
                  type: 'textHelp',
                  label: 'ProjectDetails',
                  desc: 'Asked for Project details like broucher e.t.c',
                },
                {
                  type: 'textHelp',
                  label: 'Quotation',
                  desc: 'Share Quotation',
                },
              ].map(
                (dataObj, i) =>
                  (dataObj?.type === 'reschedule' ||
                    dataObj?.type === 'textHelp' ||
                    dataObj?.type === 'notinterested' ||
                    (data?.stsType === 'visitfixed' &&
                      dataObj?.type === 'visitdone')) && (
                    <>
                      <span
                        className={`text-xs font-Playfair italic cursor-pointer   mr-4 text-[#5c6575] hover:border-b h-[16px] ${
                          addCommentTitle === dataObj?.desc ? 'border-b' : ''
                        } `}
                        onClick={() => {
                          setClicked(true)
                          setHover(false)
                          setSelType(dataObj?.type)
                          setAddCommentTitle(dataObj?.desc)
                        }}
                        onMouseEnter={() => {}}
                        onMouseLeave={() => {}}
                      >
                        {' '}
                        {dataObj?.label}
                      </span>
                    </>
                  )
              )}
            </section>
          )}
          {clicked && selType === 'reschedule' && !addCommentPlusTask && (
            <section className="flex flex-row ">
              <span className="text-xs font-Playfair  text-[#5c6575] font-bold mt-2">
                {' '}
                Reschedule to:
              </span>
              <span className="inline mt-[4px] pl-2">
                <DatePicker
                  className=" pl- px- min-w-[151px] inline text-xs text-[#0091ae] bg-white cursor-pointer"
                  selected={pickerDate}
                  onChange={(date) => {
                    console.log(
                      'am i coming here',
                      addCommentTime,
                      addCommentTime < torrowDate,
                      date.getTime() < torrowDate,
                      date.getTime() > torrowDate,
                      date.getTime()
                    )

                    setPostPoneCounterFun(date.getTime())

                    setAddCommentTime(date.getTime())
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
              </span>

              {[
                {
                  type: 'time',
                  label: '+30min',
                  value: 30 * 60000,
                },
                {
                  type: 'time',
                  label: '+45min',
                  value: 45 * 60000,
                },
                {
                  type: 'time',
                  label: '+1hr',
                  value: 60 * 60000,
                },

                {
                  type: 'time',
                  label: '+2hr',
                  value: 120 * 60000,
                },
                {
                  type: 'time',
                  label: '+3hr',
                  value: 180 * 60000,
                },
                {
                  type: 'time',
                  label: '+1day',
                  value: 60 * 24 * 60000,
                },
                {
                  type: 'time',
                  label: '+2day',
                  value: 60 * 24 * 2 * 60000,
                },
                {
                  type: 'time',
                  label: '+5day',
                  value: 60 * 24 * 5 * 60000,
                },
              ].map((dataObj, i) => (
                <>
                  <span
                    className={`text-xs font-Playfair italic cursor-pointer   ml-2 mt-2 text-[#5c6575] hover:border-b h-[16px] ${
                      addCommentTitle === dataObj?.label ? 'border-b' : ''
                    } `}
                    onClick={() => {
                      console.log('am i coming here clicked')
                      setAddCommentTime(d.getTime() + dataObj.value)
                      setPostPoneCounterFun(d.getTime() + dataObj.value)
                    }}
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  >
                    {' '}
                    {dataObj?.label}
                  </span>
                </>
              ))}
            </section>
          )}
          <section className="w-full flex flex-row min-h-[36px]">
            <input
              name="commentTitle"
              type="text"
              value={addCommentTitle}
              onChange={(e) => {
                console.log('any error ', e, e.target.value)

                if (e.target.value === '') {
                  setClicked(false)
                  setHover(true)
                }
                setAddCommentTitle(e.target.value)
              }}
              placeholder="Type here"
              className={`w-full  pb-1 pt-1 outline-none text-sm font-bodyLato focus:border-blue-600 hover:border-blue-600  border-b border-[#cdcdcd]${
                hover ? ' text-[33475b] ' : ' text-[33475b]'
              } bg-white`}
            ></input>
            {!(addCommentTitle === 'undefined' || addCommentTitle === '') && (
              <XIcon
                className="h-4 w-4 mt-2 inline cursor-pointer"
                onClick={() => {
                  setClicked(false)
                  setSelType('')
                  setAddCommentTitle('')
                }}
              />
            )}

            {!addCommentPlusTask && (
              <button
                type="submit"
                onClick={() => {
                  if (
                    addCommentTitle === 'undefined' ||
                    addCommentTitle === ''
                  ) {
                    cancelResetStatusFun()
                    setError(true)
                  }
                  if (
                    !error &&
                    !(addCommentTitle === 'undefined' || addCommentTitle === '')
                  ) {
                    setClosePrevious(false)
                    addTaskCommentFun(data)
                  }
                }}
                className={`flex mt-2 ml-4 cursor-pointer rounded-xs text-bodyLato items-center  pl-2 h-[28px] pr-2 rounded py-1 text-xs font-medium  ${
                  addCommentTitle === 'undefined' || addCommentTitle === ''
                    ? 'bg-[#FFC5C5]'
                    : 'bg-[#21C55D]'
                }  `}
              >
                <span className="text-md">
                  {(addCommentTitle === 'undefined' ||
                    addCommentTitle === '') && <CloseTwoToneIcon />}
                  {!closeTask &&
                    !addCommentPlusTask &&
                    selType != 'reschedule' &&
                    !(
                      addCommentTitle === 'undefined' || addCommentTitle === ''
                    ) && <SendTwoToneIcon />}{' '}
                  {!closeTask &&
                    selType === 'reschedule' &&
                    !(
                      addCommentTitle === 'undefined' || addCommentTitle === ''
                    ) && <ScheduleSendTwoToneIcon />}
                  {closeTask &&
                    !(
                      addCommentTitle === 'undefined' || addCommentTitle === ''
                    ) && <CheckTwoToneIcon />}
                </span>
              </button>
            )}
          </section>
        </section>
      </div>
      {addCommentPlusTask && (
        <section>
          <div className="flex flex-row ml-3">
            <section className="max-h-[42px] mt-[5px]">
              <div className="bg-green   pl-   flex flex-row cursor-pointer">
                <CalendarMonthTwoToneIcon className="cursor-none" />
                <span className="inline">
                  <DatePicker
                    className=" pl- px- min-w-[151px] inline text-xs text-[#0091ae] bg-white cursor-pointer"
                    selected={pickerDate}
                    onChange={(date) => setAddCommentTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    injectTimes={[
                      setHours(setMinutes(d, 1), 0),
                      setHours(setMinutes(d, 5), 12),
                      setHours(setMinutes(d, 59), 23),
                    ]}
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </span>
              </div>
            </section>
          </div>
        </section>
      )}
    </div>
  )
}
