/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react'

import PieChartComponent from '../charts/salePieChart'
import StackedLeadsChart from '../charts/salesStackedChart'
import DoughnutChartWithRoundedSegments from '../charts/piechartRounded'
import LeadSummaryPie from '../charts/LeadSummaryPie'
import LeadPerformance3Pie from '../charts/LeadPerformanceSummary3Pie'
import LeadHomeChartBar from '../charts/LeadPerformanceHomeChartBar'
import LeadLoctionMap from '../charts/locationMap'
import QualifiedBySource2Bars from '../charts/QualifiedBySource2Bars'
import HotColdRadialShape from '../charts/HotColdRadialShape'
import PieChartComp from '../leadsConversionRatio/PieChart'
import SourcePerformanceStackedHbar from '../charts/SourcePerformanceHomeChartBar'
import CSVDownloader from 'src/util/csvDownload'
import { SlimSelectBox } from 'src/util/formFields/slimSelectBoxField'
import { CalendarIcon, EyeIcon } from 'lucide-react'
import { prettyDate } from 'src/util/dateConverter'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'

const SourcePerformanceStack = ({
  sourceRawFilData,
  showDrillDownFun,
  leadsFetchedRawData,
  projectFilList,
  sourceFiltListTuned,
  setSelProject,
  selViewSource,
  viewSource,
  selProjectIs,
  projectList,
  sourceDownloadRows,
  sourceListTuned,
  startDate,
  endDate,
  setDateRange,
  setSourceDateRange,
  sourceDateRange,
  startOfDay,
  startOfWeek,
  startOfMonth,
  subMonths,
  isOpened,
  setIsOpened
}) => {
  const d = new window.Date()
  const [show, setShow] = useState(false)

  const [leadsPayload, setLeadsPayload] = useState([])

  const [pieVals, setPieVals] = useState({
    val1: 0,
    val2: 0,
    val3: 0,
  })

  useEffect(() => {
    console.log(
      'full data for projects with raw is =>',
      projectFilList,
      sourceRawFilData
    )
  }, [projectFilList])

  useEffect(() => {
    console.log(
      'otttt',
      sourceRawFilData.filter((datObj) =>
        [
          'followup',
          'visitfixed',
          'visitdone',
          'booked',
          'negotiation',
        ].includes(datObj?.Status)
      ).length
    )
    if (sourceRawFilData && sourceRawFilData.length > 0) {
      console.log('innn')
      const val1 = Math.round(
        (sourceRawFilData.filter((datObj) =>
          [
            'followup',
            'visitfixed',
            'visitdone',
            'booked',
            'negotiation',
          ].includes(datObj?.Status)
        ).length /
          sourceRawFilData.length) *
          100
      )
      const val2 = 100 - val1
      setPieVals({ val1, val2, val3: 50 })
    }
    const inProgressStatuses = new Set([
      'new',
      'unassigned',
      'followup',
      'visitfixed',
      'visitdone',
      'negotiation',
    ])

    const groupedData = {
      Leads: [],
      InProgress: [],
      Booked: [],
      'Not Interested': [],
      Dead: [],
      Junk: [],
    }

    sourceRawFilData.forEach((item) => {
      groupedData.Leads.push(item)

      const status = item?.Status?.toLowerCase()

      if (inProgressStatuses.has(status)) {
        groupedData.InProgress.push(item)
      }

      if (status === 'booked') {
        groupedData.Booked.push(item)
      }

      if (status === 'notinterested') {
        groupedData['Not Interested'].push(item)
      }
      if (status === 'dead') {
        groupedData['Dead'].push(item)
      }
      if (status === 'junk') {
        groupedData['Junk'].push(item)
      }
    })

    const result = [
      {
        stausTitle: 'Leads',
        data: groupedData.Leads,
        count: groupedData.Leads.length,
        fill: '#2463EB',
      },
      {
        stausTitle: 'InProgress',
        data: groupedData.InProgress,
        count: groupedData.InProgress.length,
        fill: '#BDDCFE',
      },
      {
        stausTitle: 'Booked',
        data: groupedData.Booked,
        count: groupedData.Booked.length,
        fill: '#90C6FE',
      },
      {
        stausTitle: 'Not Interested',
        data: groupedData['Not Interested'],
        count: groupedData['Not Interested'].length,
        fill: '#3A87F7',
      },
      {
        stausTitle: 'Dead',
        data: groupedData['Dead'],
        count: groupedData['Dead'].length,
        fill: '#90C6FE',
      },
      {
        stausTitle: 'Junk',
        data: groupedData['Junk'],
        count: groupedData['Junk'].length,
        fill: '#BDDCFE',
      },
    ]
    setLeadsPayload(result)
    return
    setLeadsPayload([
      {
        stausTitle: 'Leads',
        data: sourceRawFilData,
        count: `${sourceRawFilData?.length}`,
      },
      {
        stausTitle: 'InProgress',
        data: sourceRawFilData.filter((datObj) =>
          [
            'new',
            'unassigned',
            'followup',
            'visitfixed',
            'visitdone',
            'negotiation',
          ].includes(datObj?.Status)
        ),
        count: sourceRawFilData.filter((datObj) =>
          [
            'new',
            'unassigned',
            'followup',
            'visitfixed',
            'visitdone',
            'negotiation',
          ].includes(datObj?.Status)
        ).length,
      },
      {
        stausTitle: 'Booked',
        data: sourceRawFilData.filter((datObj) => datObj?.Status == 'booked'),
        count: sourceRawFilData.filter((datObj) => datObj?.Status == 'booked')
          .length,
      },
      {
        stausTitle: 'Not Interested',
        data: sourceRawFilData.filter(
          (datObj) => datObj?.Status == 'notinterested'
        ),
        count: sourceRawFilData.filter(
          (datObj) => datObj?.Status == 'notinterested'
        ).length,
      },
      {
        stausTitle: 'Dead',
        data: sourceRawFilData.filter((datObj) => datObj?.Status == 'dead'),
      },

      {
        stausTitle: 'Junk',
        data: sourceRawFilData.filter((datObj) => datObj?.Status == 'junk'),
      },
    ])
  }, [sourceRawFilData])

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 500)
    return () => {
      setShow(false)
    }
  }, [])

  console.log(pieVals, 'dhvaejfv')

  console.log(show)
  return (
    <div
      className=""
      style={{
      }}
    >
      <section className='flex flex-row justify-end  border rounded-lg mb-2 gap-y-4'>
      <div className=" flex flex-row mt-1  mr-4">
                              <span className="mr-4">
                                <SlimSelectBox
                                  name="project"
                                  label=""
                                  className="input min-w-[164px]"
                                  onChange={(value) => {
                                    console.log(
                                      'zoro condition changed one  is',
                                      value
                                    )
                                    selViewSource(value)
                                  }}
                                  value={viewSource?.value}
                                  options={[
                                    ...[
                                      {
                                        label: 'All Sources',
                                        value: 'allsources',
                                      },
                                    ],
                                    ...sourceListTuned,
                                  ]}
                                  placeholder={undefined}
                                />
                              </span>
                              <SlimSelectBox
                                name="project"
                                label=""
                                className="input min-w-[164px] ml-4"
                                onChange={(value) => {
                                  console.log(
                                    'zoro condition changed one  is',
                                    value
                                  )
                                  setSelProject(value)
                                }}
                                value={selProjectIs?.value}
                                options={[
                                  ...[
                                    {
                                      label: 'All Projects',
                                      value: 'allprojects',
                                    },
                                  ],
                                  ...projectList,
                                ]}
                                placeholder={undefined}
                              />

                            </div>
          <section className="flex flex-row justify-end ">
                                   <section className="flex  border rounded-lg">
                                                       {true && (
                                                         // <Link to={routes.projectEdit({ uid })}>
                                                         <button
                                                           onClick={() => {
                                                             setSourceDateRange(startOfDay(d).getTime())
                                                           }}
                                                         >
                                                           <span
                                                             className={`flex ml-2  items-center h-6 px-3 text-xs ${
                                                               sourceDateRange === startOfDay(d).getTime()
                                                                 ? ' btn_blue  '
                                                                 : 'text-[#4C0053] hover:bg-[#E0E3FF] active:bg-[#E0E3FF]     '
                                                             } rounded-lg`}
                                                           >
                                                             Today
                                                           </span>
                                                         </button>
                                                         // </Link>
                                                       )}

                                                       <button
                                                         onClick={() => {
                                                           setSourceDateRange(startOfWeek(d).getTime())
                                                         }}
                                                       >
                                                         <span
                                                           className={`flex ml-2  items-center h-6 px-3 text-xs ${
                                                             sourceDateRange === startOfWeek(d).getTime()
                                                               ? 'btn_blue '
                                                               : 'text-[#4C0053] hover:bg-[#E0E3FF] active:bg-[#E0E3FF]  '
                                                           }rounded-lg`}
                                                         >
                                                           This Week
                                                         </span>
                                                       </button>
                                                       <button
                                                         onClick={() => {
                                                           setSourceDateRange(startOfMonth(d).getTime())
                                                         }}
                                                       >
                                                         <span
                                                           className={`flex ml-2  items-center h-6 px-3 text-xs ${
                                                             sourceDateRange === startOfMonth(d).getTime()
                                                               ? 'btn_blue '
                                                               : '   text-[#4C0053]   rounded-full '
                                                           } rounded-lg`}
                                                         >
                                                           This Month
                                                         </span>
                                                       </button>
                                                       <button
                                                         onClick={() => {
                                                           setSourceDateRange(
                                                             subMonths(startOfMonth(d), 6).getTime()
                                                           )
                                                         }}
                                                       >
                                                         <span
                                                           className={`flex ml-2  items-center h-6 px-3 text-xs ${
                                                             sourceDateRange ===
                                                             subMonths(startOfMonth(d), 6).getTime()
                                                               ? ' btn_blue  '
                                                               : '  text-[#4C0053] hover:bg-[#E0E3FF] active:bg-[#E0E3FF]  rounded-full '
                                                           }rounded-lg`}
                                                         >
                                                           Last 6 Months
                                                         </span>
                                                       </button>
                                                       <span className="max-h-[42px]  ml-3">
                                                         <label className="bg-green   pl-   flex flex-row cursor-pointer">
                                                           {!isOpened && (
                                                             <span
                                                               className={`flex ml-1 mt-[6px] items-center h-6 px-3 text-xs ${
                                                                 sourceDateRange === startDate?.getTime()
                                                                   ? 'btn_blue  '
                                                                   : '   text-[#4C0053] hover:bg-[#E0E3FF] active:bg-[#E0E3FF]  '
                                                               } rounded-lg`}
                                                               onClick={() => {
                                                                 setIsOpened(true)
                                                               }}
                                                             >
                                                               <CalendarIcon
                                                                 className="h-4 w-4 mr-1"
                                                                 aria-hidden="true"
                                                               />
                                                               {startDate == null ? 'Custom' : ''}
                                                               {/* {sourceDateRange} -- {startDate?.getTime()} */}
                                                               {startDate != null
                                                                 ? prettyDate(startDate?.getTime() + 21600000)
                                                                 : ''}
                                                               {endDate != null ? '-' : ''}
                                                               {endDate != null
                                                                 ? prettyDate(endDate?.getTime() + 21600000)
                                                                 : ''}
                                                             </span>
                                                           )}
                                                           {
                                                             <span
                                                               className="inline"
                                                               style={{
                                                                 display: isOpened ? '' : 'none',
                                                               }}
                                                             >
                                                               <CustomDatePicker
                                                                 className={`z-10 pl- py-1 px-3 mt-[7px] inline text-xs text-[#0091ae] placeholder-blue-800 cursor-pointer  max-w-fit   ${
                                                                   sourceDateRange === startDate?.getTime()
                                                                     ? 'btn_blue '
                                                                     : 'btn_blue '
                                                                 } rounded-lg`}
                                                                 onCalendarClose={() => setIsOpened(false)}
                                                                 placeholderText="&#128467;	 Custom"
                                                                 onChange={(update) => {
                                                                   setDateRange(update)

                                                                   console.log(
                                                                     'was this updated',
                                                                     update,
                                                                     dateRange,
                                                                     startDate,
                                                                     endDate
                                                                   )
                                                                 }}
                                                                 selectsRange={true}
                                                                 startDate={startDate}
                                                                 endDate={endDate}
                                                                 isClearable={true}
                                                                 onClear={() => {
                                                                   console.log('am i cleared')
                                                                 }}
                                                                 // dateFormat="MMM d, yyyy "
                                                                 //dateFormat="d-MMMM-yyyy"
                                                                 dateFormat="MMM dd, yyyy"
                                                               />
                                                             </span>
                                                           }
                                                         </label>
                                                       </span>

                                                       <span style={{ display: '' }}>
                                                         <CSVDownloader
                                                           className="mr-6 h-[20px] w-[20px]"
                                                           downloadRows={sourceRawFilData}
                                                           style={{ height: '20px', width: '20px' }}
                                                         />
                                                       </span>
                                                     </section>
                                  </section>

                            </section>

        <div style={{ display: 'flex' }} className='flex-col'>
          <div className="w-full flex flex-col gap-6">
            <SourcePerformanceStackedHbar sourceFiltListTuned={sourceFiltListTuned} sourceRawFilData={sourceRawFilData} />
          </div>
          {show &&
      <div className="overflow-auto rounded-xl border border-gray-200 mt-4">
       <table className="min-w-full w-full border-collapse text-sm text-left text-gray-700 overflow-x-auto">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                  <tr>
                    {[
                      { label: 'Source', id: 'label' },
                      { label: 'Total', id: 'total' },
                      { label: 'InProgress', id: 'inprogress' },
                      { label: 'Booked', id: 'booked' },
                      { label: 'Archieve', id: 'archieve' },
                      { label: 'Others', id: 'others' },
                    ].map((d, i) => (
                      <th
                        key={i}
                        scope="col"
                        className={`text-sm font-medium text-[#0D0A1E]  px-6 py-4  ${
                          ['Source'].includes(d.label) ? 'text-left' : 'text-right'
                        }`}
                      >
                        {d.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 odd:bg-white even:bg-white">
                  {sourceFiltListTuned.map((data, i) => {
                    return (
                      <tr key={i} className='border-t hover:bg-gray-50 transition-colors text-right py-4 '>
                        <td className="text-sm text-gray-900 font-medium px-6 py-3 whitespace-nowrap text-left ">
                          {data?.label}
                        </td>
                        <td
                          className="text-sm text-gray-900 font-light px-12 py-3 whitespace-nowrap "
                          onClick={() =>
                            showDrillDownFun(
                              `${data?.label} Total Leads`,
                              data?.Total
                            )
                          }
                        >
                          {data?.Total?.length}
                        </td>
                        <td
                          className="text-sm text-gray-900 font-light px-12 py-2 whitespace-nowrap "
                          onClick={() =>
                            showDrillDownFun(
                              `${data?.label} Inprogress Leads`,
                              data?.inprogress
                            )
                          }
                        >
                          {data?.inprogress?.length}
                        </td>

                        <td
                          className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap "
                          onClick={() =>
                            showDrillDownFun(
                              `${data?.label} Booked Leads`,
                              data?.booked
                            )
                          }
                        >
                          {data?.booked?.length}
                        </td>

                        <td
                          className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap "
                          onClick={() =>
                            showDrillDownFun(
                              `${data?.label} Archieve Leads`,
                              data?.archieve
                            )
                          }
                        >
                          {data?.archieve?.length}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap ">
                          {data?.others?.length}
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="border-b bg-gray-800 boder-gray-900">
                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap text-left ">
                      Total
                    </td>
                    <td
                      className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap "
                      onClick={() =>
                        showDrillDownFun(`Total Leads`, leadsFetchedRawData)
                      }
                    >
                      {leadsFetchedRawData?.length}
                    </td>
                    <td
                      className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap "
                      onClick={() =>
                        showDrillDownFun(
                          `Inprogress Leads`,
                          leadsFetchedRawData?.filter((datObj) =>
                            [
                              'new',
                              'unassigned',
                              'followup',
                              'visitfixed',
                              'visitdone',
                              'negotiation',
                            ].includes(datObj?.Status)
                          )
                        )
                      }
                    >
                      {
                        leadsFetchedRawData?.filter((datObj) =>
                          [
                            'new',
                            'unassigned',
                            'followup',
                            'visitfixed',
                            'visitdone',
                            'negotiation',
                          ].includes(datObj?.Status)
                        ).length
                      }
                    </td>
                    <td
                      className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap "
                      onClick={() =>
                        showDrillDownFun(`Total Leads`, leadsFetchedRawData)
                      }
                    >
                      {
                        leadsFetchedRawData?.filter((datObj) =>
                          ['booked'].includes(datObj?.Status)
                        ).length
                      }
                    </td>
                    <td
                      className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap "
                      onClick={() =>
                        showDrillDownFun(
                          `Archieve Leads`,
                          leadsFetchedRawData?.filter((datObj) =>
                            [
                              'blocked',
                              'dead',
                              'notinterested',
                              'junk',
                            ].includes(datObj?.Status)
                          )
                        )
                      }
                    >
                      {
                        leadsFetchedRawData?.filter((datObj) =>
                          ['blocked', 'dead', 'notinterested', 'junk'].includes(
                            datObj?.Status
                          )
                        ).length
                      }
                    </td>
                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap ">
                      0
                    </td>
                  </tr>
                </tbody>
              </table></div>}
        </div>
    </div>
  )
}

export default SourcePerformanceStack
