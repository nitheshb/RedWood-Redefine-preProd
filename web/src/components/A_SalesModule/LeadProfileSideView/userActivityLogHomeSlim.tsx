import { ClockIcon, MoveRight } from 'lucide-react';
import { useState,useEffect, useRef } from 'react';
import { timeConv } from 'src/util/dateConverter';
import { activieLogNamer, empNameSetter } from 'src/util/logNameTranformer';

export default function UserActivityLogHomeSlim( {filterData, usersList}) {
useEffect(() => {
  console.log('chek', filterData)
}, [filterData])

  return (
      <div className="py-2">
        {filterData?.length == 0 && (
          <div className="py-8 px-8 flex flex-col items-center">
            <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
              <img
                className="w-[200px] h-[200px] inline"
                alt=""
                src="/templates.svg"
              />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
              Timeline is Empty
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
              This scenario is very rare to view
            </time>
          </div>
        )}



        <div className="">

            <div className="">
              <div className="space-y-3">
                {filterData?.map((data, i) => (
                  <div key={i} className="">


                    <div className="border-b border-gray-100 py-2">
                      <a
                        href="#"
                        className="block   sm:flex "
                      >
                        {data?.type == 'status' && (
                          <span className="flex  -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white  ">
                            <svg
                              className="w-3 h-3 text-blue-600 \"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </span>
                        )}
                        {data?.type == 'ph' && (
                          <>
                            <span className="flex  -left-3 justify-center items-center w-6 h-6 bg-green-200 rounded-full ring-8 ring-white ">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-blue-600 "
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                            </span>
                            <div className="text-gray-600  m-3">
                              <div className="text-base font-normal">
                                <span className="font-medium text-green-900 ">
                                  {'Rajiv'}
                                </span>{' '}
                                called{' '}
                                <span className="text-sm text-red-900 ">
                                  {Name}
                                </span>{' '}
                              </div>
                              <div className="text-sm font-normal">
                                {data?.txt}
                              </div>
                              <span className="inline-flex items-center text-xs font-normal text-gray-500 ">
                                <ClockIcon className="mr-1 w-3 h-3" />
                                {data?.type == 'ph'
                                  ? timeConv(
                                      Number(data?.time)
                                    ).toLocaleString()
                                  : timeConv(
                                      data?.T
                                    ).toLocaleString()}
                                {'    '}
                                <span className="text-red-900 ml-4 mr-4">
                                  {Number(data?.duration)} sec
                                </span>
                                or
                                <span className="text-red-900 ml-4">
                                  {parseInt(data?.duration / 60)}{' '}
                                  min
                                </span>
                              </span>
                            </div>
                          </>
                        )}
                        {data?.type != 'ph' && (
                          <div className="text-gray-600 font-bodyLato mx-3 my-1">
                            <div className="text-base    font-normal">
                              {data?.type === 'sts_change' && (
                                <span className="text-[12px] font-medium text-gray-800 bg-[#F5F5F5] p-2 py-1 px-3 rounded-[8px] ">
                                  {data?.from?.toUpperCase()} {'  '}
                                </span>
                              )}
                              {data?.type != 'sts_change' && ( <span className="text-sm font-normal text-gray-800  ">
                                {activieLogNamer(data)}
                              </span>)}{' '}
                              {data?.type === 'sts_change' && ( <span className="text-sm font-normal text-gray-800 mx-2 ">
                                <MoveRight className='w-4 h-4 ' />
                              </span>)}
                              {data?.type === 'sts_change' && (
                                <span className="text-[12px] font-medium text-gray-800 bg-[#F5F5F5] p-2 py-1 px-3 rounded-[8px] ">
                                  {'  '} {data?.to?.toUpperCase()}
                                </span>
                              )}
                              {data?.type === 'assign_change' && (
                                <span className="text-xs  text-gray-500 ml-2 ">
                                  {'  '} {empNameSetter(usersList, data?.to)}
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-normal">
                              {data?.txt}
                            </div>
                            <span className=" flex flex-col  text-xs font-normal text-gray-500 ">
                              <div className='flex flex-row'>
                              <ClockIcon className=" w-3 h-3   text-gray-500" />

                              <span className="text-xs  text-gray-500 ml-1">
                                {data?.type == 'ph'
                                  ? timeConv(
                                      Number(data?.time)
                                    ).toLocaleString()
                                  : timeConv(
                                      data?.T
                                    ).toLocaleString()}
                              </span>
                              </div>
                              <div className='flex flex-row'>

                              <span className="text-xs  text-gray-500 ml-1  white-space-nowrap">
                              by:
                              </span>
                              <span className="text-xs text-gray-500 ml-1 whitespace-nowrap overflow-ellipsis overflow-hidden text-ellipsis">

                              {data?.by}
                              </span>
                              </div>



                            </span>
                          </div>
                        )}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>

  );
}

