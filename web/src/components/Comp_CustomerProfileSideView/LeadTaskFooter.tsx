/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import 'react-datepicker/dist/react-datepicker.css'
import {
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
  prettyDateTime,
} from 'src/util/dateConverter'
import { CheckIcon } from '@heroicons/react/solid'

export default function LeadTaskFooter({
  data,
  hoverTasId,
  EditTaskOpenWindowFun,
  delFun,
}) {
  return (
    <section className="flex flex-row justify-between mt-[2px]">
      <section className="flex flex-row">
        <span className="text-xs  font-normal text-[#b03d32] text-gray-500">
          {data?.sts === 'completed' && (
            <span className="text-xs  text-gray-500  flex flex-row justify-center items-center">
              <div className="relative flex flex-col  group">
                <div
                  className="absolute bottom-0 right-0 flex-col items-center hidden mb-6 group-hover:flex"
                  style={{ zIndex: '9999' }}
                >
                  <span
                    className="rounded  relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                    style={{
                      color: '#94B5ED',
                      background: '#FCE6D9',
                      maxWidth: '100%',
                    }}
                  >
                    <div className="italic flex flex-col">
                      <div className="font-bodyLato">
                        Due on: {prettyDateTime(data?.schTime)}{' '}
                      </div>
                    </div>
                  </span>
                  <div
                    className="w-3 h-3  -mt-2 rotate-45 bg-black"
                    style={{
                      background: '#FCE6D9',
                      marginRight: '12px',
                    }}
                  ></div>
                </div>
                <span className="flex items-center font-outfit font-normal text-xs leading-tight tracking-tight text-[#606062]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="calendar_icon inline mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.5 1h-7A1.5 1.5 0 001 2.5v7A1.5 1.5 0 002.5 11h7A1.5 1.5 0 0011 9.5v-7A1.5 1.5 0 009.5 1zM2 2.5a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-7zM8.75 8a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM3.5 4a.5.5 0 000 1h5a.5.5 0 000-1h-5z"
                      fill="currentColor"
                    ></path>
                  </svg>{' '}
                  {prettyDateTime(data?.schTime)}{' '}
                </span>
              </div>

              <div className="w-px h-3 bg-gray-300 mx-2"></div>

              <div className="relative flex flex-col  group">
                <div
                  className="absolute bottom-0 right-0 flex-col items-center hidden mb-6 group-hover:flex"
                  style={{ zIndex: '9999' }}
                >
                  <span
                    className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                    style={{
                      color: '#94B5ED',
                      background: '#FCE6D9',
                      maxWidth: '100%',
                    }}
                  >
                    <div className="italic flex flex-col">
                      <div className="font-bodyLato">
                        Completed on {prettyDateTime(data?.comT)}
                      </div>
                    </div>
                  </span>
                  <div
                    className="w-3 h-3  -mt-2 rotate-45 bg-black"
                    style={{
                      background: '#FCE6D9',
                      marginRight: '12px',
                    }}
                  ></div>
                </div>
                <span className="">
                  <span className="flex items-center gap-1 font-outfit font-normal text-xs leading-tight tracking-tight text-[#606062]">
                    <img
                      src="/hugeicons_note-done.svg"
                      alt="Completed"
                      className="w-4 h-4"
                    />
                    {/* <CheckIcon className="w-4 h-4 inline text-gray-500" />{' '} */}
                    {'   '}
                    {prettyDateTime(data?.comT)}{' '}
                  </span>
                </span>
              </div>
            </span>
          )}

          {data?.sts != 'completed' && (
            <div className="flex flex-row">
              <div className="relative flex flex-col  group">
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex z-100000">
                  <span
                    className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                    style={{
                      color: '#94B5ED',
                      background: '#FCE6D9',
                      width: '100%',
                    }}
                  >
                    <div className="italic flex flex-col">
                      <div className="font-bodyLato ">
                        {prettyDateTime(data?.schTime)}
                      </div>
                    </div>
                  </span>
                  <div
                    className="w-3 h-3  -mt-2 rotate-45 bg-black"
                    style={{
                      background: '#FCE6D9',
                      marginRight: '12px',
                    }}
                  ></div>
                </div>
                <span
                  className={`font-bodyLato flex  gap-1 flex-row ${
                    getDifferenceInMinutes(data?.schTime, '') >= 0
                      ? 'text-xs  text-gray-500'
                      : 'text-xs  text-gray-500'
                  }`}
                >
                  {/* <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="calendar_icon inline mr-1 mt-[2px]"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.5 1h-7A1.5 1.5 0 001 2.5v7A1.5 1.5 0 002.5 11h7A1.5 1.5 0 0011 9.5v-7A1.5 1.5 0 009.5 1zM2 2.5a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-7zM8.75 8a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM3.5 4a.5.5 0 000 1h5a.5.5 0 000-1h-5z"
                      fill="currentColor"
                    ></path>
                  </svg> */}
                  <img
                    src="/gg_calendar-due.svg"
                    alt="date"
                    className="w-4 h-4"
                  />
                  <div className=" mr-2 inline">
                    <div className="font-bodyLato">
                      {prettyDateTime(data?.schTime)}
                    </div>
                  </div>
                </span>
              </div>
            </div>
          )}
        </span>
        <div className="relative flex flex-row items-center group">
          <div
            className="absolute bottom-0 right-0 flex-col items-center hidden mb-6 group-hover:flex"
            style={{ zIndex: '9999' }}
          >
            <span
              className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
              style={{
                color: '#94B5ED',
                background: '#FCE6D9',
                maxWidth: '100%',
              }}
            >
              <div className="italic flex flex-col">
                <div className="font-bodyLato">Assigned To {data?.by}</div>
              </div>
            </span>
            <div
              className="w-3 h-3  -mt-2 rotate-45 bg-black"
              style={{
                background: '#FCE6D9',
                marginRight: '12px',
              }}
            ></div>
          </div>

          <div className="w-px h-3 bg-gray-300 mx-2 "></div>

          <span className="flex items-center font-outfit font-normal text-xs leading-tight tracking-tight text-[#606062]">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className="inline mr-1"
            >
              <path
                d="M9.357 1C10.264 1 11 1.736 11 2.643V6.07c0 .436-.173.854-.481 1.162L7.232 10.52a1.643 1.643 0 01-2.323 0L1.48 7.09c-.64-.64-.64-1.68.001-2.322L4.768 1.48C5.076 1.173 5.494 1 5.93 1h3.427zm-.07.91H5.93a.805.805 0 00-.569.235L2.145 5.362a.805.805 0 000 1.138L5.5 9.855a.805.805 0 001.138 0l3.217-3.217a.805.805 0 00.236-.569V2.713a.804.804 0 00-.804-.804zM7.364 3.726a.91.91 0 110 1.818.91.91 0 010-1.818z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg> */}
            {data?.by}
          </span>
        </div>
      </section>
      {data?.sts != 'completed' && hoverTasId === data?.ct && (
        <section className="flex flex-row">
          <span
            className="inline-flex  font-thin text-[#0091ae]   font-bodyLato text-[12px] ml-2  text-[#867777] hover:text-green-900"
            onClick={() => EditTaskOpenWindowFun(data)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </span>
        </section>
      )}
    </section>
  )
}
