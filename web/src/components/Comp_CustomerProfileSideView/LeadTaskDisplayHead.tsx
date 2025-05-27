/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { CheckCircleIcon } from '@heroicons/react/solid'
import { use } from 'i18next'
import { useState, useEffect } from 'react'
import {
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
} from 'src/util/dateConverter'

export default function LeadTaskDisplayHead({
  data,
  setAddTaskCommentObj,
  closeTaskFun,
  hoverTasId,
  undoFun,
  setShowVisitFeedBackStatusFun,
  EditTaskOpenWindowFun
}) {
  const [comingSoonState, setComingSoonState] = useState(false)



  useEffect(() => {
    let x =

     getDifferenceInHours(data?.schTime, '') >= 0
        ? true
        : false
    setComingSoonState(x)
  }, [data])
  return (
    <div>



      <div className='flex items-start '>

{/*
        <div className=''>

          {data?.sts === 'completed' && (
            // <CheckCircleIcon className="w-4 h-4 inline text-[#058527]" />
            <img
              src="/Checked.svg"
              alt="Completed"
              className="w-5 h-5 inline align-middle"
            />
          )}

{data?.sts != 'completed' &&  data?.stsType !== 'visitfixed' &&  (


                <img
                src="/UnCheck.svg"
                alt="Completed"
                className="w-5 h-5 inline align-middle"
                onClick={() => closeTaskFun(data)}
              />
              )}

        </div> */}



  {data?.sts === 'completed' && (
    <img
      src="/Checked.svg"
      alt="Completed"
      className="w-5 h-5 inline align-middle mt-2"
    />
  )}

  {data?.sts != 'completed' && (
    <img
      src="/UnCheck.svg"
      alt="Completed"
      className="w-5 h-5 inline align-middle mt-1"
      onClick={() => closeTaskFun(data)}
    />
  )}

        <div className='flex flex-row justify-between ml-3 w-full' >

        <section>

  {(data?.sts != 'completed' ) && (
    <span
      className={` px-3 py-1  mb-3  rounded-[4px] ${comingSoonState ? 'bg-[#DFF6E0] text-[#1B6600]' : 'bg-[#FDECEC] text-[#D20D0D]'
        }   font-outfit font-medium text-[12px] leading-tight tracking-tight text-center`}
    >
      {comingSoonState ? 'Starts in' : 'Delayed by'} {'  '}
      {getDifferenceInMinutes(data?.schTime, '') > 60
        ? Math.abs(getDifferenceInMinutes(data?.schTime, '')) > 8640
          ? `${Math.abs(getDifferenceInDays(data?.schTime, ''))} Days `
          : `${Math.abs(getDifferenceInHours(data?.schTime, ''))} Hours `
        : `${Math.abs(getDifferenceInMinutes(data?.schTime, ''))} Min`}{' '}
    </span>
  )}

<div className={`${data?.sts === 'completed' ? 'cursor-not-allowed ' : 'cursor-pointer'
              }  mt-1 block`}
            onClick={() => {
              if (data?.sts === 'pending') {
                setAddTaskCommentObj(data)
              }
            }}
          >
            <label className="inline-flex gap-2 items-center">
              <div
                className={`${data?.sts === 'completed' ? 'line-through' : 'cursor-pointer'
                  }   font-outfit font-medium text-[16px] leading-[14px] tracking-normal  text-[#0091ae] `}
                onClick={() => {
                  if (data?.sts === 'pending') {
                    setAddTaskCommentObj(data)
                  }
                }}
              >
                {data?.notes}
              </div>


{/*
              <div className='flex gap-2'> */}

                <span
                  className="text-[14px] font-medium px-2 py-[2px] rounded-[13px]  text-[#606062]"
                >
                  #{data?.stsType === 'visitfixed' ? 'Visit Fixed' : data?.stsType|| 'New'}
                </span>

              {data?.sts != 'completed' && <img
                  src="/edit-02.svg"
                  alt="Edit"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => { EditTaskOpenWindowFun(data) }}
                />}

                          </label>
                        </div>


              </section>

        {/* <section className="flex flex-row justify-between"> */}



          <div>
          {data?.sts != 'completed' && (
            <section className="flex gap-4 flex-row">
              <span
                onClick={() => {
                  setAddTaskCommentObj(data)
                }}
                className=" px-3 py-2 rounded-[8px] border border-[#E7E7E9] text-[#000000] font-normal text-[12px] cursor-pointer hover:text-green-900 "
                // className="inline-flex  placeholder:font-thin text-[#0091ae]  cursor-pointer font-bodyLato text-[12px]   hover:text-green-900"
              >

                  Add Comment

              </span>
              {data?.stsType === 'visitfixed' && data?.sts != 'completed' && (
                <span
                  className="px-3 py-2 rounded-[8px] border border-[#E7E7E9] text-[#000000] font-normal text-[12px] cursor-pointer hover:text-green-900 "
                  onClick={() => setShowVisitFeedBackStatusFun(data, 'visitdone')}
                >
                  Visit Done
                </span>
              )}
            </section>
          )}
          </div>

        {/* </section> */}

        </div>
      </div>

    </div>
  )
}
