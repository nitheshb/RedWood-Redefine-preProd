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
}) {
  const [comingSoonState, setComingSoonState] = useState(false)
  useEffect(() => {
    let x =
      Math.abs(getDifferenceInHours(data?.schTime, '')) <= 24 &&
      Math.abs(getDifferenceInHours(data?.schTime, '')) >= 0
        ? true
        : false
    setComingSoonState(x)
  }, [data])
  return (
    <div>
      {(data?.sts != 'completed' ||
        Math.abs(getDifferenceInHours(data?.schTime, '')) <= 24) && (
        <span
          className={` px-2 py-1 ml-6 mb-2 ${
            comingSoonState ? 'bg-green-400' : 'bg-red-400'
          }  text-white text-[12px] text-center`}
        >
          {comingSoonState ? 'Starts in' : 'Delayed by'} {'  '}
          {Math.abs(getDifferenceInMinutes(data?.schTime, '')) > 60
            ? Math.abs(getDifferenceInMinutes(data?.schTime, '')) > 8640
              ? `${Math.abs(getDifferenceInDays(data?.schTime, ''))} Days `
              : `${Math.abs(getDifferenceInHours(data?.schTime, ''))} Hours `
            : `${Math.abs(getDifferenceInMinutes(data?.schTime, ''))} Min`}{' '}
        </span>
      )}
      <section className="flex flex-row justify-between">
        <div
          className={`${
            data?.sts === 'completed' ? 'cursor-not-allowed ' : 'cursor-pointer'
          }  mt-1 block w-full`}
          onClick={() => {
            if (data?.sts === 'pending') {
              setAddTaskCommentObj(data)
            }
          }}
        >
          <label className="inline-flex items-center">
            {data?.sts != 'completed' && (
              <span
                className="px-[2px] py-[2px]  rounded-full border border-2 cursor-pointer text-[#cdcdcd] hover:text-green-800 hover:border-green-700 hover:bg-green-100"
                onClick={() => closeTaskFun(data)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2 w-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            )}
            {data?.sts === 'completed' && (
              <CheckCircleIcon className="w-4 h-4 inline text-[#058527]" />
            )}
            <div
              className={`${
                data?.sts === 'completed' ? 'line-through' : 'cursor-pointer'
              }  ml-2 text-[16px] inline font-bodyLato font-brand tracking-wider text-[#0091ae] text-[#0E0A1F]`}
              onClick={() => {
                if (data?.sts === 'pending') {
                  setAddTaskCommentObj(data)
                }
              }}
            >
              {data?.notes}
            </div>
          </label>
        </div>
        {data?.sts != 'completed' && (
          <section className="flex flex-row">
            <span
              onClick={() => {
                setAddTaskCommentObj(data)
              }}
              className="inline-flex  placeholder:font-thin text-[#0091ae]  cursor-pointer font-bodyLato text-[12px] ml-2 pt-1  hover:text-green-900"
            >
              <span className=" text-[#0091ae] border-b border-[#0091ae] font-medium w-20 cursor-pointer text-[12px]   ml-2 h-[18px]  hover:border-[#0091ae]  ">
                Add Comment
              </span>
            </span>
            {data?.stsType === 'visitfixed' && data?.sts != 'completed' && (
              <span
                className=" mt-1 w-[58px] h-[18px] ml-4 text-[#0091ae] border-b border-[#0091ae] font-medium hover:border-[#7BD500] text-[12px] ml-2 cursor-pointer "
                onClick={() => setShowVisitFeedBackStatusFun(data, 'visitdone')}
              >
                Visit Done
              </span>
            )}
          </section>
        )}
      </section>
    </div>
  )
}
