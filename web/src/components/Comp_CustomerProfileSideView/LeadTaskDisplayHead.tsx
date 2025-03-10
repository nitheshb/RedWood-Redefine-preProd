/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { CheckCircleIcon } from '@heroicons/react/solid'

export default function LeadTaskDisplayHead({
  data,
  setAddTaskCommentObj,
  closeTaskFun,
  hoverTasId,
  undoFun,
  setShowVisitFeedBackStatusFun,
}) {
  return (
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
            }  ml-2 text-[14px] inline font-bodyLato font-brand tracking-wider text-[#0091ae]`}
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
            className="inline-flex  placeholder:font-thin text-[#0091ae]  cursor-pointer font-bodyLato text-[12px] ml-2 pt-1 text-[#867777] hover:text-green-900"
          >


            <span
          className="font-thin text-[#e91313] cursor-pointer text-[12px]  font-bodyLato text-[10px] ml-2  border-b hover:border-[#0091ae]  "
        >
          Comment
        </span>
          </span>
          {data?.stsType === 'visitfixed' && data?.sts != 'completed' && (
            <span
              className=" mt-[3px]  ml-4 text-green-900 font-semibold hover:border-[#7BD500] text-[12px] ml-2 cursor-pointer"
              onClick={() => setShowVisitFeedBackStatusFun(data, 'visitdone')}
            >
              VISITDONE
            </span>
          )}
        </section>
      )}
    </section>
  )
}
