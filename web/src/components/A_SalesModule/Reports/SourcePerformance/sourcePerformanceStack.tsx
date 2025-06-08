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

const SourcePerformanceStack = ({
  sourceRawFilData,
  showDrillDownFun,
  leadsFetchedRawData,
  projectFilList,
}) => {
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
        <div style={{ display: 'flex' }} className='flex-col'>
          <div className="w-full flex flex-col gap-6">
            <SourcePerformanceStackedHbar />
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
                  {projectFilList.map((data, i) => {
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
                              data?.TotalNew
                            )
                          }
                        >
                          {data?.TotalNew?.length}
                        </td>
                        <td
                          className="text-sm text-gray-900 font-light px-12 py-2 whitespace-nowrap "
                          onClick={() =>
                            showDrillDownFun(
                              `${data?.label} Inprogress Leads`,
                              data?.inprogress_new
                            )
                          }
                        >
                          {data?.inprogress_new?.length}
                        </td>

                        <td
                          className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap "
                          onClick={() =>
                            showDrillDownFun(
                              `${data?.label} Booked Leads`,
                              data?.booked_new
                            )
                          }
                        >
                          {data?.booked_new?.length}
                        </td>

                        <td
                          className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap "
                          onClick={() =>
                            showDrillDownFun(
                              `${data?.label} Archieve Leads`,
                              data?.archieve_new
                            )
                          }
                        >
                          {data?.archieve_new?.length}
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
