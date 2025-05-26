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
        <div style={{ display: 'flex' }}>
          <div className="w-full flex flex-col gap-6">
            <SourcePerformanceStackedHbar />
          </div>
        </div>
    </div>
  )
}

export default SourcePerformanceStack
