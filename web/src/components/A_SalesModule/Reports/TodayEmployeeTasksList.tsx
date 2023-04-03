/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect, useRef } from 'react'

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid'

const TodayEmployeeTaskReport = ({
  setResettingEmpValues,
  GenerateTasksDailyReportForEmp,
  employeeTaskColumn,
  showEmployeeTaskAllData,
  showColumnsEmployeeTaskFun,
  empPerDayTasksCountsA,
}) => {
  return (
    <div className="  rounded-lg my-6 ">
      <div className=" rounded-lg bg-[#EBFAFA]">
        <div style={{ display: 'flex' }} className={'dragMe'}>
          <div className=" flex flex-col  p-10 max-w-[100%] ">
            <div>
              <div>
                <div
                  className="flex m-1 justify-between border-b pb-2"
                  // style={{
                  //   position: 'sticky',
                  //   top: '0px',
                  //   background: 'white',
                  // }}
                  id="section-1"
                >
                  <div className="relative  flex items-center w-auto text-md font-bold leading-none pl-0 ml-1 mt-4 ">
                    <div className=" text-md font-bold leading-none pl-0  ">
                      {`Employee vs Tasks `}
                    </div>
                  </div>

                  <div
                    className="relative  flex items-center w-auto text-md font-bold leading-none pl-0 ml-1 mt-2 ml-4 text-blue cursor-pointer"
                    style={{ gap: '50px' }}
                    onClick={() => {
                      setResettingEmpValues(true)
                      GenerateTasksDailyReportForEmp()
                    }}
                  >
                    Generate Daily Task Report
                  </div>
                </div>

                <div style={{ overflowX: 'scroll' }}>
                  <table className="text-center mt-2">
                    <thead>
                      <tr style={{ background: 'rgb(229,229,229)' }}>
                        {[
                          { label: 'sNo', id: 'no' },
                          { label: 'Name', id: 'name' },
                          { label: 'All', id: 'all' },
                          { label: 'Rnr', id: 'rnr' },
                          { label: 'Busy', id: 'busy' },
                          { label: 'New', id: 'new' },
                          { label: 'Follow Up', id: 'followup' },
                          { label: 'Visit Fixed', id: 'visitfixed' },
                          { label: 'Visit Done', id: 'visitdone' },
                          { label: 'Visit Cancel', id: 'visitCancel' },
                          { label: 'Booked', id: 'booked' },
                          { label: 'Dead', id: 'dead' },
                          { label: 'Blocked', id: 'blocked' },
                          { label: 'Junk', id: 'junk' },

                          { label: 'Negotiations', id: 'negotiation' },
                          { label: 'Others', id: 'others' },
                        ].map((d, i) => (
                          <th
                            key={i}
                            scope="col"
                            style={{
                              display: employeeTaskColumn.includes(d.id)
                                ? ''
                                : 'none',
                              color:
                                ['all'].includes(d.id) &&
                                showEmployeeTaskAllData
                                  ? 'blue'
                                  : 'rgb(146,146,146)',
                              border: '1px solid rgb(223,223,223)',
                            }}
                            className={`text-sm font-medium text-gray-900 px-6 py-4 ${
                              ['name'].includes(d.label) ? 'text-left' : ''
                            }`}
                            onClick={() => {
                              if (['all'].includes(d.id))
                                showColumnsEmployeeTaskFun()
                            }}
                          >
                            <div style={{ display: 'flex' }}>
                              {d.label}
                              {d.id === 'all' ? (
                                !showEmployeeTaskAllData ? (
                                  <ChevronDoubleRightIcon
                                    className="w-4 h-5 inline"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ChevronDoubleLeftIcon
                                    className="w-4 h-5 inline"
                                    aria-hidden="true"
                                  />
                                )
                              ) : null}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {empPerDayTasksCountsA?.map((data, i) => {
                        return (
                          <tr
                            className={`  ${
                              i % 2 === 0
                                ? 'bg-white border-blue-200'
                                : 'bg-gray-100'
                            }`}
                            key={i}
                          >
                            <td
                              className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left"
                              style={{
                                border: '1px solid rgb(231,231,231)',
                              }}
                            >
                              {i + 1}
                            </td>
                            <td
                              className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left"
                              style={{
                                border: '1px solid rgb(231,231,231)',
                              }}
                            >
                              {data?.emp}
                            </td>
                            <td
                              className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                              style={{
                                border: '1px solid rgb(231,231,231)',
                              }}
                            >
                              {data?.all_comp || 0}/{data?.all || 0}
                            </td>

                            <td
                              className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                              style={{
                                border: '1px solid rgb(231,231,231)',
                              }}
                            >
                              {data?.rnr || 0}
                            </td>
                            <td
                              className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                              style={{
                                border: '1px solid rgb(231,231,231)',
                              }}
                            >
                              {data?.busy || 0}
                            </td>
                            <td
                              className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                              style={{
                                border: '1px solid rgb(231,231,231)',
                              }}
                            >
                              {data?.new_comp || 0}/{data?.new || 0}
                            </td>
                            <td
                              className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                              style={{
                                border: '1px solid rgb(231,231,231)',
                              }}
                            >
                              {data?.followup_comp || 0}/{data?.followup || 0}
                            </td>

                            <td
                              className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                              style={{
                                border: '1px solid rgb(231,231,231)',
                              }}
                            >
                              {data?.visitfixed_comp || 0}/{' '}
                              {data?.visitfixed || 0}
                            </td>
                            {showEmployeeTaskAllData && (
                              <>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.visitdone_comp || 0}/{' '}
                                  {data?.visitdone || 0}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.visitCancel_comp || 0}/{' '}
                                  {data?.visitCancel || 0}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.booked_comp || 0}/ {data?.booked || 0}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.dead_comp || 0}/ {data?.dead || 0}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.blocked_comp || 0}/{' '}
                                  {data?.blocked || 0}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.junk_comp || 0}/ {data?.junk || 0}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.negotiation_comp || 0}/
                                  {data?.negotiation || 0}
                                </td>
                                <td
                                  className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap"
                                  style={{
                                    border: '1px solid rgb(231,231,231)',
                                  }}
                                >
                                  {data?.others_comp || 0}/ {data?.others || 0}
                                </td>
                              </>
                            )}
                          </tr>
                        )
                      })}

                      <tr className="border-b bg-gray-800 boder-gray-900">
                        <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap text-left">
                          Total
                        </td>
                        <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                          {/* {Object.keys(empTaskListTuned.Total).length
                      empTaskListTuned.reduce((a, b) => {
                        return a.Total + b.Total
                      }).length
                    } */}
                          {/* {empTaskListTuned.reduce(
                      (previousValue, currentValue) =>
                        previousValue.Total + currentValue.Total,
                      0
                    )} */}
                        </td>
                        <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                          {}
                        </td>

                        <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                          {}
                        </td>

                        <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                          {}
                        </td>
                        <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                          {}
                        </td>
                        <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                          {}
                        </td>

                        <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                          {}
                        </td>
                        {showEmployeeTaskAllData && (
                          <>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {}
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {}
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {}
                            </td>

                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {}
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {}
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {}
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {}
                            </td>
                            <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap">
                              {}
                            </td>
                          </>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodayEmployeeTaskReport
