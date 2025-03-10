/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react'
import PieChartComp from './PieChart'

const LeadsCoversionGraphs = ({
  sourceRawFilData,
  showDrillDownFun,
  leadsFetchedRawData,
  projectFilList,
}) => {
  const [show, setShow] = useState(false)

  const [pieVals, setPieVals] = useState({
    val1: 0,
    val2: 0,
    val3: 0,
  })

  useEffect(() => {
    console.log('full data for projects with raw is =>', projectFilList, sourceRawFilData)
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
    className='rounded-xl'
      style={{
        padding: '1rem',
        backgroundColor: 'white',
      }}
    >
      {show && (
        <div style={{ display: 'flex' }}>
          <div style={{ width: '15rem' }}>
            <div style={{ height: '12.5rem' }} className="bg-[#ffe0bb] p-6 rounded-t-lg">
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
                  className={`bg-[#ffefdb] my-[0.5px] cursor-pointer ${i === 5 ? 'rounded-b-lg' : ''}`}
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
            className=''
              style={{
                padding: '1.5rem',

              }}
            >
              <div
                className='shadow rounded-xl p-2 pl-4'
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
       

              <section className="flex flex-row justify-between mt-[18px]">
              
              </section>
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
                      <tr

                        key={i}
                      >
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
