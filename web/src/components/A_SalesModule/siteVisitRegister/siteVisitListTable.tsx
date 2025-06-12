/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useEffect, useState } from 'react'
import { CalendarIcon, EyeIcon } from '@heroicons/react/outline'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid'
import { startOfWeek, startOfDay, startOfMonth, subMonths } from 'date-fns'
import { sourceListItems } from 'src/constants/projects'
import {
  addAgreegatedSalesValues,
  getAllProjects,
  getEmployeesListDept,
  getEmployeesTaskProgressDept,
  getLeadbyId1,
  getLeadsByDate,
  getLeadsTransfer,
  getTodayTodoLeadsData,
  getTodayTodoLeadsDataByUser,
  steamAllLeadsActivity,
  steamUsersListByRole,
  streamLeadLogdWithNullProj,
  updateLeadsLogWithProject,
  updateTodaySourceStatsDB,
  updateTodayTasksTotal,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { sendWhatAppTextSms1 } from 'src/util/axiosWhatAppApi'
import CSVDownloader from 'src/util/csvDownload'
import { prettyDate, prettyDateTime } from 'src/util/dateConverter'
import { SlimSelectBox } from 'src/util/formFields/slimSelectBoxField'




import CustomDatePicker from 'src/util/formFields/CustomDatePicker'
import LeadsTransferTableBody from '../leadsTransferTableBody'




const SiteVisitListTable = ({
cpUsersList
}) => {
  // }
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId, access } = user

const [leadsSearchRawDB, setLeadsSearchRawDB] = useState([])
useEffect(() => {
  setLeadsSearchRawDB(cpUsersList)
}, [cpUsersList])



  return (
    <div>
      <section className="pb-8 pt-1 mb-8 leading-7 text-gray-900">
        <div className="box-border  border-solid  ">
          <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 "></div>
          {
            (leadsSearchRawDB.length > 0 ? (
              // <LeadsTransferTableBody
              //   title={'Site Visit Leads'}
              //   leadsLogsPayload={leadsSearchRawDB}
              //   setCustomerDetails={setCustomerDetails}
              //   setisImportLeadsOpen={setisImportLeadsOpen}
              //   setSelectedIds={setSelectedIds}
              //   selectedIds={selectedIds}
              // />
               <table
                              className="min-w-full rounded-2xl overflow-hidden text-center mt-6"
                              style={{ borderCollapse: 'separate', borderSpacing: 0 }}
                            >
                              <thead className="rounded-2xl">
                                <tr>


                                  {[
                                    { label: 'sNo', id: 'no', align: 'left' },
                                    { label: 'Name', id: 'name', align: 'left' },
                                    { label: 'Phone No', id: 'offPh', align: 'left' },
                                    { label: 'Project Name', id: 'new', align: 'center' },
                                    { label: 'Source', id: 'new', align: 'center' },
                                    { label: 'Schedudled By', id: 'userStatus', align: 'center' },
                                    { label: 'Conducted By', id: 'empId', align: 'center' },
                                    { label: 'Conducted On', id: 'empId', align: 'center' },
                                    { label: 'Remarks', id: 'empId', align: 'center' },
                                  ].map((d, i) => (
                                    <th
                                      key={i}
                                      scope="col"
                                      className={`text-sm font-medium text-[#000000] bg-[#FDEFE7] px-2 py-2 ${
                                        // ['Project', 'Lead Name'].includes(d.label)
                                        //   ? 'text-left'
                                        //   : ''
                                        d.align === 'left' ? 'text-left' : 'text-center'
                                      }`}
                                    >
                                      {/* {d?.label?.toUpperCase()} */}
                                      {d?.label?.charAt(0).toUpperCase() +
                                        d?.label?.slice(1).toLowerCase()}
                                    </th>
                                  ))}
                                </tr>
                              </thead>

                              <tbody>
                                {leadsSearchRawDB?.map((data, i) => {
                                  return (
                                    <tr
                                      className={`  ${i % 2 === 0 ? 'bg-white' : 'bg-white'}`}
                                      key={i}

                                    >

                                      <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap ">
                                        {i + 1}
                                      </td>
                                      <td className="text-sm text-gray-900 font-medium px-2 py-2 whitespace-nowrap  text-left">
                                        {data?.firstName}
                                      </td>
                                      <td className="text-sm text-gray-900  px-2 py-2 whitespace-nowrap text-left">
                                        {data?.mobile}
                                      </td>
                                      <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                                        {data?.projectName}
                                      </td>
                                      <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                                        {/* {data?.SourceCat}  */}
                                       {[data?.source, data?.SourceCat,].filter(Boolean).join(' | ')}

                                      </td>
                                      <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                                        {data?.svSchByObj?.name}
                                      </td>

                                      <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                                        {data?.svAttendedByObj?.name}
                                      </td>
                                      <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                                        {prettyDateTime(data?.svHappendOn)}
                                      </td>
                                      <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                                        {data?.siteVistRemarks || 'NA'}
                                      </td>

                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
            ) : (
              <div className="py-8 px-8 mt-2 flex flex-col items-center  rounded">
                <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                  <img
                    className="w-[180px] h-[180px] inline"
                    alt=""
                    src="/templates.svg"
                  />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900">
                  No Leads found with above selection
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  <span className="text-blue-600"></span>
                </time>
              </div>
            ))}







        </div>
      </section>
    </div>
  )
}

export default SiteVisitListTable
