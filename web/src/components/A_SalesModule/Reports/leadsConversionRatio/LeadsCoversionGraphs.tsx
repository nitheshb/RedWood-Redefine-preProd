/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react'
import PieChartComp from './PieChart'
import PieChartComponent from '../charts/salePieChart'
import StackedLeadsChart from '../charts/salesStackedChart'
import DoughnutChartWithRoundedSegments from '../charts/piechartRounded'
import Example from '../charts/pieChartCircle'

const LeadsCoversionGraphs = ({
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
    ]);

    const groupedData = {
      Leads: [],
      InProgress: [],
      Booked: [],
      'Not Interested': [],
      Dead: [],
      Junk: [],
    };

sourceRawFilData.forEach((item) => {
  groupedData.Leads.push(item);

  const status = item?.Status?.toLowerCase();

  if (inProgressStatuses.has(status)) {
    groupedData.InProgress.push(item);
  }

  if (status === 'booked') {
    groupedData.Booked.push(item);
  }

  if (status === 'notinterested') {
    groupedData['Not Interested'].push(item);
  }
  if (status === 'dead') {
    groupedData['Dead'].push(item);
  }
  if (status === 'junk') {
    groupedData['Junk'].push(item);
  }
});

const result = [
  {
    stausTitle: 'Leads',
    data: groupedData.Leads,
    count: groupedData.Leads.length,
    fill: "#2463EB"
  },
  {
    stausTitle: 'InProgress',
    data: groupedData.InProgress,
    count: groupedData.InProgress.length,
    fill: "#BDDCFE"
  },
  {
    stausTitle: 'Booked',
    data: groupedData.Booked,
    count: groupedData.Booked.length,
    fill: "#90C6FE"
  },
  {
    stausTitle: 'Not Interested',
    data: groupedData['Not Interested'],
    count: groupedData['Not Interested'].length,
    fill:"#3A87F7"
  },
  {
    stausTitle: 'Dead',
    data: groupedData['Dead'],
    count: groupedData['Dead'].length,
    fill: "#90C6FE"
  },
  {
    stausTitle: 'Junk',
    data: groupedData['Junk'],
    count: groupedData['Junk'].length,
    fill:  "#BDDCFE"
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
        ).length
      },
      {
        stausTitle: 'Booked',
        data: sourceRawFilData.filter(
          (datObj) => datObj?.Status == 'booked'
        ),
        count: sourceRawFilData.filter(
          (datObj) => datObj?.Status == 'booked'
        ).length,
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
        data: sourceRawFilData.filter(
          (datObj) => datObj?.Status == 'dead'
        ),
      },

      {
        stausTitle: 'Junk',
        data: sourceRawFilData.filter(
          (datObj) => datObj?.Status == 'junk'
        ),
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
        padding: '1rem',

      }}
    >
        {show && (
        <div style={{ display: 'flex' }}>
          <div className='w-full flex flex-col gap-6'>
            <section>
            <div
              className=" p-6 rounded-t-lg border"
            >
              <span className=" text-lg ">Lead Conversion Ratio</span>
              <div className=" text-[44px] my-5">
                {`${
                  sourceRawFilData.filter((datObj) =>
                    [
                      'followup',
                      'visitfixed',
                      'visitdone',
                      'booked',
                      'negotiation',
                    ].includes(datObj?.Status)
                  ).length
                }`}
                :{' '}
                {`${
                  sourceRawFilData.filter(
                    (datObj) => datObj?.Status == 'booked'
                  ).length
                }`}
              </div>
              <div className=" text-sm">Qualified vs Bookings </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
              className='border-b border-l border-r rounded-b-lg'
            >
              {[
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
                },
                {
                  stausTitle: 'Booked',
                  data: sourceRawFilData.filter(
                    (datObj) => datObj?.Status == 'booked'
                  ),
                },
                {
                  stausTitle: 'Not Interested',
                  data: sourceRawFilData.filter(
                    (datObj) => datObj?.Status == 'notinterested'
                  ),
                },
                {
                  stausTitle: 'Dead',
                  data: sourceRawFilData.filter(
                    (datObj) => datObj?.Status == 'dead'
                  ),
                },

                {
                  stausTitle: 'Junk',
                  data: sourceRawFilData.filter(
                    (datObj) => datObj?.Status == 'junk'
                  ),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={` my-[0.5px] cursor-pointer  border-r ${
                    i === 5 ? 'rounded-b-lg' : ''
                  }`}
                  style={{
                    height: '4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    fontSize: '1.3rem',
                    width: '100%',
                  }}
                  onClick={() =>
                    showDrillDownFun(`Total ${item?.stausTitle}`, item?.data)
                  }
                >
                  <div className="">{item?.stausTitle}</div>
                  <div className="">{item?.data?.length}</div>
                </div>
              ))}
            </div>
            </section>

            <section>

            {/* section - 3 */}
            <section className="flex flex-row flex-wrap gap-2">
              <section className="w-[49%] border-[#e7e5eb] bg-white rounded-lg p-5">
                <div className="flex flex-col"></div>
                <section className="flex flex-row justify-between">
                  <article className="flex flex-col">
                    <div className="text-[#1A1A1A]">Lead Performance Summary</div>
                    <div className="text-[#7F7F7F] text-xs mt-1">
                      Showing the distribution of leads across the different stages of the sales funnel.
                    </div>
                  </article>
                  <article>date</article>
                </section>

                <div className="w-full h-[400px] mt-4">
                  <section className="flex flex-row justify-between">
                    <article></article>
                    <article className="flex flex-row mr-2 mb-3">
                      <section className="flex flex-row">
                        <div className="text-[#1f2937] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#9333ea]"></div>
                        <div className="text-[#4b5563] text-xs">
                          {' '}
                          This month
                        </div>
                      </section>
                      <section className="flex flex-row">
                        <div className="text-[#2563eb] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#2563eb]"></div>
                        <div className="text-[#4b5563] text-xs">
                          {' '}
                          Last month
                        </div>
                      </section>
                    </article>
                  </section>
                  {/* <StackedLeadsChart /> */}
                  <Example leadsData={leadsPayload}/>
                </div>
                {/* bottom sheet */}
                <section className="mt-3 ml-4">
                  <div className="text-[#1f2937] font-[600] text-xl">
                    Conversion funnel
                  </div>
                  <div className="flex flex-row border-b border-gray-200">
                    <ul
                      className="flex flex-wrap -mb-px mt-1"
                      id="myTab"
                      data-tabs-toggle="#myTabContent"
                      role="tablist"
                    >
                      {[
                        {
                          lab: 'First-Time',
                          val: 'business_tasks',
                          color: '#4F46E5',
                        },
                        {
                          lab: 'Returning',
                          val: 'personal_tasks',
                          color: '#9333EA',
                        },
                      ].map((d, i) => {
                        return (
                          <li key={i} className="mr-4">
                            {' '}
                            <button
                              className={`inline-block pb-[6px] mr-3 text-sm  text-center text-black rounded-t-lg border-b-2  hover:text-black hover:border-gray-300   ${
                                d.val === d.val
                                  ? 'border-black'
                                  : 'border-transparent'
                              }`}
                              type="button"
                              role="tab"
                              // onClick={() => setisClicked(d.val)}
                            >
                              <section className="flex flex-row text-[15px] mb-1ss ">
                                <div
                                  className={`w-3 h-3 bg-[${d.color}] mt-1 mr-1 rounded-sm`}
                                ></div>
                                {d.lab}
                              </section>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </section>
                <article className="text-[#4f46e5] text-center font-[500] text-[13px]">
                  View full Report
                </article>
              </section>
              <section className="w-[49%] border-[#e7e5eb] bg-white rounded-lg p-4">
                <div className="flex flex-col"></div>
                <section className="flex flex-row justify-between">
                  <article className="flex flex-col">
                    <div className="text-[#1f2937]">Revenue</div>
                    <div className="text-[#1f2937] font-[700] text-2xl mt-2">
                      ₹62,820.59
                    </div>
                    <div className="text-[#EF4444] text-xs mt-1">
                      0.2% less than the previous 30 days
                    </div>
                  </article>
                  <article>date</article>
                </section>

                <div className="w-full h-[400px] mt-4">
                  <section className="flex flex-row justify-between">
                    <article></article>
                    <article className="flex flex-row mr-2 mb-3">
                      <section className="flex flex-row">
                        <div className="text-[#1f2937] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#9333ea]"></div>
                        <div className="text-[#4b5563] text-xs">
                          {' '}
                          This month
                        </div>
                      </section>
                      <section className="flex flex-row">
                        <div className="text-[#2563eb] w-3 h-3 mt-1 mx-2 rounded-sm bg-[#2563eb]"></div>
                        <div className="text-[#4b5563] text-xs">
                          {' '}
                          Last month
                        </div>
                      </section>
                    </article>
                  </section>
                  <PieChartComponent />
                </div>
              </section>
            </section>
            </section>
          </div>
        </div>
      )}
      {show && (
        <div style={{ display: 'flex' }}>
          <div style={{ width: '15rem' }}>
            <div
              style={{ height: '12.5rem' }}
              className="bg-[#ffe0bb] p-6 rounded-t-lg"
            >
              <span className=" text-lg ">Lead Conversion Ratio</span>
              <div className=" text-[44px] my-5">
                {`${
                  sourceRawFilData.filter((datObj) =>
                    [
                      'followup',
                      'visitfixed',
                      'visitdone',
                      'booked',
                      'negotiation',
                    ].includes(datObj?.Status)
                  ).length
                }`}
                :{' '}
                {`${
                  sourceRawFilData.filter(
                    (datObj) => datObj?.Status == 'booked'
                  ).length
                }`}
              </div>
              <div className=" text-sm">Qualified vs Bookings </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              {leadsPayload.map((item, i) => (
                <div
                  key={i}
                  className={`bg-[#ffefdb] my-[0.5px] cursor-pointer ${
                    i === 5 ? 'rounded-b-lg' : ''
                  }`}
                  style={{
                    height: '4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    fontSize: '1.3rem',
                    width: '100%',
                  }}
                  onClick={() =>
                    showDrillDownFun(`Total ${item?.stausTitle}`, item?.data)
                  }
                >
                  <div className="">{item?.stausTitle}</div>
                  <div className="">{item?.data?.length}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: '50rem' }}>
            <div
              className=""
              style={{
                padding: '1.5rem',
              }}
            >
              <div
                className="shadow rounded-xl p-2 pl-4"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '14rem',
                    height: '12rem',
                    position: 'relative',
                  }}
                >
                  <PieChartComp pieVal={pieVals.val1} />
                  <div
                    style={{
                      position: 'absolute',
                      top: '40%',
                      left: '39%',
                      fontSize: '2rem',
                      fontWeight: '600',
                      color: '#000',
                    }}
                  >
                    {pieVals.val1}%
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '80%',
                      left: '4.5%',
                      padding: '0 0.5rem',
                      fontSize: '0.9rem',
                      color: '#000',
                    }}
                    className="bg-[#ffe0bb] rounded-lg"
                  >
                    <span className="">New Lead-to-Opportunity</span>
                  </div>
                </div>
                <div
                  style={{
                    width: '14rem',
                    height: '12rem',
                    position: 'relative',
                    backgroundColor: 'white',
                  }}
                >
                  <PieChartComp pieVal={pieVals.val2} />
                  <div
                    style={{
                      position: 'absolute',
                      top: '40%',
                      left: '39%',
                      fontSize: '2rem',
                      fontWeight: '600',
                      color: '#000',
                    }}
                  >
                    {pieVals.val2}%
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '80%',
                      left: '18.5%',
                      padding: '0 0.5rem',
                      fontSize: '0.9rem',
                      color: '#000',
                    }}
                    className="bg-[#ffe0bb] rounded-lg"
                  >
                    <span className="">New Lead-to-Junk</span>
                  </div>
                </div>
                <div
                  style={{
                    width: '14rem',
                    height: '12rem',
                    position: 'relative',
                  }}
                >
                  <PieChartComp pieVal={pieVals.val3} />
                  <div
                    style={{
                      position: 'absolute',
                      top: '40%',
                      left: '39%',
                      fontSize: '2rem',
                      fontWeight: '600',
                      color: '#000',
                    }}
                  >
                    {pieVals.val3}%
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '80%',
                      left: '9%',
                      padding: '0 0.5rem',
                      fontSize: '0.9rem',
                      color: '#000',
                    }}
                    className="bg-[#ffe0bb] rounded-lg"
                  >
                    <span className="">Opportunity-to-Booking</span>
                  </div>
                </div>
              </div>

              <section className="flex flex-row justify-between mt-[18px]"></section>
              <table className="min-w-full cardborder text-center">
                <thead className="border-b">
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
                        className={`text-sm font-semibold font-medium text-gray-900 px-6 py-4 border ${
                          ['Source'].includes(d.label) ? 'text-left' : ''
                        }`}
                      >
                        {d.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projectFilList.map((data, i) => {
                    return (
                      <tr key={i}>
                        <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left border">
                          {data?.label}
                        </td>
                        <td
                          className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap border"
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
                          className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap border"
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
                          className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap border"
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
                          className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap border"
                          onClick={() =>
                            showDrillDownFun(
                              `${data?.label} Archieve Leads`,
                              data?.archieve_new
                            )
                          }
                        >
                          {data?.archieve_new?.length}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap border">
                          {data?.others?.length}
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="border-b bg-gray-800 boder-gray-900">
                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap text-left border">
                      Total
                    </td>
                    <td
                      className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap border"
                      onClick={() =>
                        showDrillDownFun(`Total Leads`, leadsFetchedRawData)
                      }
                    >
                      {leadsFetchedRawData?.length}
                    </td>
                    <td
                      className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap border"
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
                      className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap border"
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
                      className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap border"
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
                    <td className="text-sm text-white font-medium px-6 py-2 whitespace-nowrap border">
                      0
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeadsCoversionGraphs
