/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react'

import { SlimSelectBox } from 'src/util/formFields/slimSelectBoxField'

import CallPerformanceChartBar from '../charts/CallPerformanceHomeChartBar'
import HotColdRadialShape from '../charts/HotColdRadialShape'
import LeadHomeChartBar from '../charts/LeadPerformanceHomeChartBar'
import LeadPerformance3Pie from '../charts/LeadPerformanceSummary3Pie'
import LeadStagePerformanceOverSalesTeam from '../charts/LeadStagePerformanceOverSalesTeam'
import LeadSummaryPie from '../charts/LeadSummaryPie'
import LeadLoctionMap from '../charts/locationMap'
import DoughnutChartWithRoundedSegments from '../charts/piechartRounded'
import QualifiedBySource2Bars from '../charts/QualifiedBySource2Bars'
import PieChartComponent from '../charts/salePieChart'
import StackedLeadsChart from '../charts/salesStackedChart'
import PieChartComp from '../leadsConversionRatio/PieChart'
import { steamUsersListByRole, streamGetCallActivity } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

const CallActivityGraphs = ({
  sourceRawFilData,
  showDrillDownFun,
  leadsFetchedRawData,
  projectFilList,
}) => {
    const { user } = useAuth()
    const { orgId } = user
  const [show, setShow] = useState(false)
    const [fetchedSalesTeamList, setfetchedSalesTeamList] = useState([])

  const [leadsPayload, setLeadsPayload] = useState([])

  const [pieVals, setPieVals] = useState({
    val1: 0,
    val2: 0,
    val3: 0,
  })
  useEffect(() => {
    getEmployeesCallData()

    return
  }, [])

  const getEmployeesCallData = async () => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        await Promise.all(
          usersListA.map(async (user) => {
            user.label = user.displayName || user.name;
            user.value = user.uid;
            let x = await getLeadsSourcesDb(user.uid);
            user.callData = x.length> 0 ? x[0] : {};
          })
        );
        console.log('fetchedSalesTeamList', usersListA)
      await  usersListA.sort((a, b) => a.label.localeCompare(b.label))


      await  setfetchedSalesTeamList(usersListA)
      },
      (error) => setfetchedSalesTeamList([])
    )
  }
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
  const getLeadsSourcesDb = async (uid) => {
    const data = await streamGetCallActivity(
      orgId,
      (doc) => {
        const leadsList = doc.data()
        const leadsListA = []
        console.log('fetched call log is', leadsList)
        // Object.entries(leadsList).forEach((entry) => {
        //   const [key, value] = entry
        //   leadsListA.push(value)
        //   console.log('my total fetched list is 3', `${key}: ${value}`)
        // })
        setfetchedSalesTeamList(leadsListA)
      },
      {
        uid: uid,
      },
      (error) => ([])
    )
    return data

    console.log('mydata is', data)
  }
  console.log(pieVals, 'dhvaejfv')

  console.log(show)

  const callActivityData = [
    {
      teamMember: 'Chaitanya',
      totalCalls: 120,
      talkTime: 60,
      avrTimeDuration: '12 min',
      totalOutgoing: 40,
      outgoingAnswered: 14,
      totalIncoming: 24,
      incomingAnswered: 12,
    },
    {
      teamMember: 'Rubhika',
      totalCalls: 130,
      talkTime: 75,
      avrTimeDuration: '25 min',
      totalOutgoing: 41,
      outgoingAnswered: 15,
      totalIncoming: 25,
      incomingAnswered: 13,
    },
    {
      teamMember: 'Vishal',
      totalCalls: 140,
      talkTime: 90,
      avrTimeDuration: '9 min',
      totalOutgoing: 42,
      outgoingAnswered: 16,
      totalIncoming: 26,
      incomingAnswered: 14,
    },
    {
      teamMember: 'Nithesh',
      totalCalls: 150,
      talkTime: 105,
      avrTimeDuration: '15 min',
      totalOutgoing: 43,
      outgoingAnswered: 17,
      totalIncoming: 27,
      incomingAnswered: 15,
    },
    {
      teamMember: 'Luffy',
      totalCalls: 160,
      talkTime: 120,
      avrTimeDuration: '20 min',
      totalOutgoing: 44,
      outgoingAnswered: 18,
      totalIncoming: 28,
      incomingAnswered: 16,
    },
    {
      teamMember: 'Zoro',
      totalCalls: 170,
      talkTime: 135,
      avrTimeDuration: '15 min',
      totalOutgoing: 45,
      outgoingAnswered: 19,
      totalIncoming: 29,
      incomingAnswered: 17,
    },
  ]
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-row gap-2 pt-4 pb-4 right-0 justify-end">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  const legendData = [
    {
      name: 'Booked',
      value: 'Booked',
      color: '#2867B2',
    },
    {
      name: 'Junk',
      value: 'Junk',
      color: '#17DA5F',
    },
    {
      name: 'Follow Up',
      value: 'Follow Up',
      color: '#C42626',
    },
    {
      name: 'Visit Done',
      value: 'Visit Done',
      color: '#C42626',
    },
    {
      name: 'Visit Fixed',
      value: 'Visit Fixed',
      color: '#C42626',
    },
  ]
  return (
    <div className="">
      {show && (
        <div style={{ display: 'flex' }}>
          <div className="w-full flex flex-col gap-6">
            <CallPerformanceChartBar />
            <section>
              {/* section - 3 */}
              <section className="flex flex-row flex-wrap gap-6">
                <section className="w-[100%] border-[#e7e5eb] bg-white rounded-lg p-4">
                  <div className="flex flex-col"></div>
                  <section className="flex flex-row justify-between">
                    <article className="flex flex-col">
                      <div className="text-[#1f2937]">
                        Lead stage performance over sales team
                      </div>

                      <div className="text-[#808080] text-xs mt-1">
                        The schools that completes the domains and maximum
                        number of MIPs submitted on domains
                      </div>
                    </article>
                    <article>
                      <SlimSelectBox
                        name=""
                        label=""
                        className="input min-w-[164px]"
                        options={[
                          {
                            label: 'This week',
                            value: 'thisweek',
                          },
                        ]}
                        placeholder="This week"
                        onChange={undefined}
                        value={undefined}
                        customStyles={undefined}
                      />
                    </article>
                  </section>
                  <section>
                    <CustomLegend payload={legendData} />
                  </section>
                  <LeadStagePerformanceOverSalesTeam leadsData={leadsPayload} />
                </section>
              </section>
            </section>
          </div>
        </div>
      )}
      <section>
        <section className="flex flex-row flex-wrap gap-6">
          <section className="w-[100%] pt-4">
            <div className="flex flex-col"></div>
            <section className="flex flex-row justify-between">
              <article className="flex flex-col">
                <div className="text-[#1f2937]">Team Call Activity</div>

                <div className="text-[#808080] text-xs mt-1">
                  The calls duration that domains and maximum number of calls made by each team member
                </div>
              </article>
              <article>
                <SlimSelectBox
                  name=""
                  label=""
                  className="input min-w-[164px]"
                  options={[
                    {
                      label: 'This week',
                      value: 'thisweek',
                    },
                  ]}
                  placeholder="This week"
                  onChange={undefined}
                  value={undefined}
                  customStyles={undefined}
                />
              </article>
            </section>
          </section>
        </section>
      </section>
      {show && (
        <div className="overflow-auto rounded-xl border border-gray-200 mt-4">
          <table className="min-w-full w-full text-sm text-left text-gray-700 overflow-x-auto">
            <thead className="bg-gray-100 text-xs text-gray-500">
              <tr>
                {[
                  { label: 'Team members', id: 'teammembers' },
                  { label: 'Total calls', id: 'totalcalls' },
                  { label: 'Talk time (min)', id: 'talktime' },
                  { label: 'Avr time duration (min)', id: 'avrtimeduration' },
                  { label: 'Total Outgoing', id: 'totaloutgoing' },
                  { label: 'Outgoing Answered', id: 'outgoinganswered' },
                  { label: 'Total Incoming', id: 'totalincoming' },
                  { label: 'Incoming Answered', id: 'incominganswered' },
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
              {fetchedSalesTeamList.map((data, i) => {
                return (
                  <tr
                    key={i}
                    className="border-t hover:bg-gray-50 transition-colors text-right py-4 "
                  >
                    <td className="text-sm text-gray-900 font-medium px-6 py-3 whitespace-nowrap text-left ">
                      {data?.name}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-12 py-3 whitespace-nowrap ">
                      {data?.callData?.totalCallsCount}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-12 py-2 whitespace-nowrap ">
                      {data?.callData?.talktime}
                    </td>

                    <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap ">
                      {data?.callData?.avrTimeDuration}
                    </td>

                    <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap ">
                      {data?.callData?.totalOutGoingCallsCount}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap ">
                      {data?.callData?.totalOutgoingAnswered}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap ">
                      {data?.callData?.totalIncomingCallsCount}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap ">
                      {data?.callData?.totalIncomingAnswered}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CallActivityGraphs
