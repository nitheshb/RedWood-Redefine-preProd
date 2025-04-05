import { useState, useEffect, useRef } from 'react'
import { ClockIcon } from '@heroicons/react/outline'
import { PDFExport } from '@progress/kendo-react-pdf'
import { steamUnitActivityLog } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { supabase } from 'src/context/supabase'
import { computeTotal } from 'src/util/computeCsTotals'
import { timeConv } from 'src/util/dateConverter'
import CrmUnitCostSheetView from './CrmCostSheetView'
import CrmUnitPaymentSchedule from './CrmPaymentSchedule'
import CrmPaymentSummary from './CrmPaymentSummary'
import CrmUnitPaymentGraph from './CrmUnitPaymentGraph'
import { crmActivieLogNamer } from 'src/util/CrmActivityLogHelper'
import PdfUniteSummary from 'src/util/PdfUniteSummary'
import { BellIcon, ChevronDownIcon } from 'lucide-react'
import { Cell, Pie, PieChart } from 'recharts'
import { formatIndianNumber } from 'src/util/formatIndianNumberTextBox'
import { calculatePercentages } from 'src/util/areaConverter'

const CrmUnitSummary = ({
  selCustomerPayload: selUnitPayload,
  assets,
  totalIs,
  unitTransactionsA,
  projectType,
  project,
  unitTotal,
  fullPs,
  T_B,
  PSa,
  leadDetailsObj1,
  unitReceivedTotal,
  projectDetails,
  streamUnitDetails,
  plotPS,
  selCustomerPayload,
  myBookingPayload,
  customerDetails,
  selUnitDetails,
}) => {
  const { user } = useAuth()
  const pdfUnitSummaryComp = useRef(null)
  const { orgId } = user
  const [unitFetchedActivityData, setUnitFetchedActivityData] = useState([])
  const [newPlotCostSheetA, setNewPlotCostSheetA] = useState([])
  const [newPlotCsObj, setNewPlotCsObj] = useState([])
  const [newPlotPS, setNewPlotPS] = useState([])
  const [newConstructCsObj, setNewConstructCsObj] = useState([])
  const [newConstructCostSheetA, setNewConstructCostSheetA] = useState([])
  const [newConstructPS, setNewConstructPS] = useState([])
  const [newAdditonalChargesObj, setNewAdditonalChargesObj] = useState([])
  const [StatusListA, setStatusListA] = useState([])

  const [netTotal, setNetTotal] = useState(0)
  const [partATotal, setPartATotal] = useState(0)
  const [partBTotal, setPartBTotal] = useState(0)

  useEffect(() => {
    console.log('unit dta is ', selUnitPayload, selUnitPayload?.id)
    boot()
    setTotalFun()
    const subscription = supabase
      .from(`${orgId}_unit_logs`)
      .on('*', (payload) => {
        console.log('account records', payload)
        const updatedData = payload.new
        const { uid } = payload.old
        const eventType = payload.eventType
        console.log('account records', updatedData.Uuid, selUnitPayload?.id)

        if (updatedData.Uuid === selUnitPayload?.id) {
          if (updatedData.Uuid === selUnitPayload?.id) {
            console.log('account records', updatedData.Uuid, selUnitPayload?.id)
            setUnitFetchedActivityData((prevLogs) => {
              const existingLog = prevLogs.find((log) => log.uid === uid)
              console.log(
                'account records',
                prevLogs,
                existingLog,
                uid,
                payload.old,
                uid
              )
              if (existingLog) {
                console.log('Existing record found!')
                if (payload.new.status === 'Done') {
                  const updatedLogs = prevLogs.filter((log) => log.uid != uid)
                  return [...updatedLogs]
                } else {
                  const updatedLogs = prevLogs.map((log) =>
                    log.uid === uid ? payload.new : log
                  )
                  return [...updatedLogs]
                }
              } else {
                console.log('New record added!')
                return [payload.new,...prevLogs]
              }
            })
          } else {
            if (
              updatedData.by_uid === user?.uid ||
              updatedData?.to_uid === user?.uid
            ) {
              setUnitFetchedActivityData((prevLogs) => {
                const existingLog = prevLogs.find((log) => log.uid === uid)

                if (existingLog) {
                  console.log('Existing record found!')
                  if (payload.new.status === 'Done') {
                    const updatedLogs = prevLogs.filter((log) => log.uid != uid)
                    return [...updatedLogs]
                  } else {
                    const updatedLogs = prevLogs.map((log) =>
                      log.id === uid ? payload.new : log
                    )
                    return [...updatedLogs]
                  }
                } else {
                  console.log('New record added!')
                  return [payload.new,...prevLogs]
                }
              })
            }
          }
        }
      })
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])

  const boot = async () => {
    const unsubscribe = steamUnitActivityLog(orgId, {
      uid: selUnitPayload?.id,
      pId: selUnitPayload?.pId,
    })

    const y = await unsubscribe
    setUnitFetchedActivityData(y)
    await console.log('new setup ', unitFetchedActivityData)
    await console.log('new setup ', y)
  }
  const setTotalFun = async () => {
    const partBTotal = selUnitPayload?.additonalChargesObj?.reduce(
      (partialSum, obj) =>
        partialSum +
        Number(
          computeTotal(
            obj,
            selUnitPayload?.super_built_up_area || selUnitPayload?.area?.toString()?.replace(',', '')
          )
        ),
      0
    )

    const partATotal = selUnitPayload?.plotCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )

    console.log('myObj', partATotal)

    setPartBTotal(partBTotal)
    setPartATotal(partATotal)
    setNetTotal(partATotal + partBTotal)
  }

  return (
    <PDFExport paperSize="A4" margin="1cm" ref={pdfUnitSummaryComp}>
      <div className=" rounded-lg  border border-gray-100   overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300" style={{  }}>
            {/* <div className="py-1 px-1 m-2 mt-[1px] rounded-lg border border-gray-100  overflow-y-scroll" style={{ height: `calc(100vh - 120px)` }}> */}

        <div className="flex flex-row">
          <div className="w-full">
            <div className="flex flex-row justify-between text-end items-end mr-2">


            </div>



            















  
            


            <div>
              <div className='  rounded-lg'>
              
              <div className="grid   rounded-lg grid-cols-2 gap-4 mb-3">
                <div className="bg-[#FFFFFF] p-4 rounded-lg">
                  <div className="flex justify-between ">
                    <span className="font-medium">Stage Balance</span>
                    <span className='font-semibold'>...</span>
                  </div>
                  <div className="relative flex justify-center items-center">
                    <PieChart width={250} height={250}>
                      <Pie
                        data={[  { name: 'Paid', value:  calculatePercentages((selCustomerPayload?.T_review || 0) +(selCustomerPayload?.T_approved || 0 ), selCustomerPayload?.T_elgible).paidPercentage},
                        { name: 'Remaining', value:  calculatePercentages((selCustomerPayload?.T_review || 0) +(selCustomerPayload?.T_approved || 0 ), selCustomerPayload?.T_elgible).unpaidPercentage}]}
                        cx={125}
                        cy={125}
                        innerRadius={70}
                        outerRadius={95}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                        <Cell fill="#DBD3FD" />
                        <Cell fill="#E5E7EB" />
              
              
                      </Pie>
                      {/* <Tooltip content={<CustomTooltip />} /> */}
              
                    </PieChart>
              
                    <div className="absolute text-center">
                      <div className="text-xs text-gray-500">Balance</div>
                      <div className="font-bold">  
                      ₹{selCustomerPayload?.T_elgible_balance < 0 
                ? 0 
                : Math.round(selCustomerPayload?.T_elgible_balance)?.toLocaleString('en-IN')}
                        
                      </div>
                    </div>
                  </div>
              
              
                  <section className="flex flex-row justify-between mx-2">
                  <div className="text-center">
                    <div className="text-[12px] text-gray-500">Elgible Cost</div>
              
                    <div
                              className="relative flex flex-col items-center group"
                              style={{ alignItems: 'start' }}
                            >
                              <div
                                className="absolute bottom-0 flex-col items-center hidden mb-6 flex group-hover:flex"
                                style={{ alignItems: 'start', width: '300px' }}
                              >
                                <span
                                  className="rounded italian relative mr-3 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                  style={{
                                    color: 'white',
                                    background: '#213343',
                                    maxWidth: '300px',
                                  }}
                                >
                                  <span className="italic">
                                    {formatIndianNumber?.(Math.round(selCustomerPayload?.T_elgible || 0))}
              
                                  </span>
                                </span>
                                <div
                                  className="w-3 h-3 ml-1  -mt-2 rotate-45 bg-black"
                                  style={{ background: '#213343', marginRight: '12px' }}
                                ></div>
                              </div>
                              <span className="text-[14px] font-bold text-gray-900">
                    ₹ {Math.round(selCustomerPayload?.T_elgible || 0).toLocaleString('en-IN')}
                                
              
                              </span>
                    </div>
              
              
                    <div className="font-bold text-[14px]">
              
              
                                                          
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[12px] text-gray-500">Paid</div>
                    {/* <div className="font-bold text-[14px]"> 
              
                    ₹{Math.round((selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0)).toLocaleString('en-IN')}
                      
                      </div> */}
              
                      <div
                              className="relative flex flex-col items-center group"
                              style={{ alignItems: 'start' }}
                            >
                              <div
                                className="absolute bottom-0 flex-col items-center hidden mb-6 flex group-hover:flex"
                                style={{ alignItems: 'start', width: '300px' }}
                              >
                                <span
                                  className="rounded italian relative mr-3 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                  style={{
                                    color: 'white',
                                    background: '#213343',
                                    maxWidth: '300px',
                                  }}
                                >
                                  <span className="italic">
                                    {/* {toWords?.convert(Math.round(selCustomerPayload?.T_elgible || 0))} */}
              
                                    {/* {toWords?.convert(Math.round(selCustomerPayload?.T_elgible || 0))} */}
              
                                    {formatIndianNumber?.(Math.round(selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0))}
              
              
                                  </span>
                                </span>
                                <div
                                  className="w-3 h-3 ml-1  -mt-2 rotate-45 bg-black"
                                  style={{ background: '#213343', marginRight: '12px' }}
                                ></div>
                              </div>
                              <span className="text-[14px] font-bold ">
                    {/* ₹ {Math.round(selCustomerPayload?.T_elgible || 0).toLocaleString('en-IN')} */}
              
                    ₹{Math.round((selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0)).toLocaleString('en-IN')}
              
                                
              
                              </span>
                    </div>
              
              
              
              
              
              
                  </div>
                  <div className="text-center">
                    <div className="text-[12px] text-gray-500">Balance</div>
                    {/* <div className="font-bold text-[14px]">
                    ₹ {Math.round(Math.max(selCustomerPayload?.T_elgible_balance || 0, 0)).toLocaleString('en-IN')}
              
                      </div> */}
              
              
              <div className="relative flex flex-col items-center group" style={{ alignItems: 'start' }}>
                <div
                  className="absolute bottom-0 flex-col items-center hidden mb-6 flex group-hover:flex"
                  style={{ alignItems: 'start', width: '300px' }}
                >
                  <span
                    className="rounded italian relative mr-3 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                    style={{
                      color: 'white',
                      background: '#213343',
                      maxWidth: '300px',
                    }}
                  >
                    <span className="italic">
                      {formatIndianNumber?.(Math.round(Math.max(selCustomerPayload?.T_elgible_balance || 0, 0)))}
                    </span>
                  </span>
                  <div
                    className="w-3 h-3 ml-1 -mt-2 rotate-45 bg-black"
                    style={{ background: '#213343', marginRight: '12px' }}
                  ></div>
                </div>
                <span className="text-[14px] font-bold">
                  ₹{Math.round(Math.max(selCustomerPayload?.T_elgible_balance || 0, 0)).toLocaleString('en-IN')}
                </span>
              </div>
              
                  </div>
                  </section>
                </div>
              
                <div className="bg-[#FFFFFF]  p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Unit Cost</span>
                    <ChevronDownIcon size={16} className="ml-2" />
                  </div>
                  <div className="relative flex justify-center items-center">
                    <PieChart width={250} height={250}>
                      <Pie
                        data={[  { name: 'Paid', value:  calculatePercentages(  (selCustomerPayload?.T_review || 0) +
                        (selCustomerPayload?.T_approved || 0), selCustomerPayload?.T_total || selCustomerPayload?.T_Total).paidPercentage},
                        { name: 'Remaining', value:  calculatePercentages(  (selCustomerPayload?.T_review || 0) +
                        (selCustomerPayload?.T_approved || 0), selCustomerPayload?.T_total || selCustomerPayload?.T_Total).unpaidPercentage}]}
                        cx={125}
                        cy={125}
                        innerRadius={70}
                        outerRadius={95}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                        <Cell fill="#DBD3FD" />
                        <Cell fill="#E5E7EB" />
                      </Pie>
                      {/* <Tooltip content={<CustomTooltiptwo />} /> */}
              
                    </PieChart>
              
                    <div className="absolute text-center">
                      <div className="text-xs text-gray-500">Balance</div>
                      <div className="font-bold">
                      ₹ {Math.round(selCustomerPayload?.T_balance || 0).toLocaleString('en-IN')}
              
              
                                                        
                                                        </div>
                    </div>
                  </div>
                  <section className="flex flex-row justify-between mx-2">
                  <div className="text-center">
                    <div className="text-[12px] text-gray-500">Unit Cost</div>
                    <div className="font-bold text-[14px]">
                    ₹ {Math.round(selCustomerPayload?.T_total || 0).toLocaleString('en-IN')}
              
                                                          
                                                          </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[12px] text-gray-500">Paid</div>
                    <div className="font-bold text-[14px]">₹ {((selCustomerPayload?.T_review || 0) +
                                                          (selCustomerPayload?.T_approved || 0))?.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[12px] text-gray-500">Balance</div>
                    <div className="font-bold text-[14px]">
                    ₹ {Math.round(selCustomerPayload?.T_balance || 0).toLocaleString('en-IN')}
              
                                                          
                                                          
                                                          </div>
                  </div>
                  </section>
                </div>
              
                <div className="bg-[#FFFFFF] p-4 rounded-lg">
              
                  <div className="flex justify-between items-center">
                <span className="font-medium">Unit Payments</span>
                <BellIcon size={16} className="ml-2" />
              </div>
              
                  <div className="flex flex-col items-center mt-8">
                    <section className='flex flex-row justify-between'>
                      <div className=''>
                    <div className="text-sm text-gray-500 mb-2">Total Paid</div>
                    <div className="font-bold mb-4">
                    ₹ {Math.round((selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0)).toLocaleString('en-IN')}
              
                                                          </div>
                                                          </div>
              
                    </section>
                    <div className="w-full bg-gray-200 h-7 rounded-full mb-6">
                      <div className="bg-[#DBD3FD] h-7 rounded-full w-1/3"></div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Total Cost</div>
                    <div className="font-bold">
                    ₹ {Math.round(selCustomerPayload?.T_total || 0).toLocaleString('en-IN')}
              
              
                                                          </div>
                  </div>
                </div>
              
              
              
              </div>
              
              
              </div>
            </div>

            <div>
              <CrmUnitCostSheetView
                selCustomerPayload={selUnitPayload}
                assets={assets}
                totalIs={totalIs}
              />
            </div>
            <div>
          <CrmUnitPaymentSchedule
            selCustomerPayload={selUnitPayload}
            assets={assets}
            totalIs={totalIs}
          />
        </div>
          </div>

          <div className="rounded w-[300px] mx-6 flex flex-col">

          <div className="flex flex-col bg-[#f0f1ff] mb-2 rounded-lg p-3 ">

          <div className="flex flex-row  bg-white shadow rounded-xl my-1  px-2 py-2 min-w-[260px]">



<div>

<PdfUniteSummary
    user={user}
    selUnitDetails={selUnitDetails}
    streamUnitDetails={streamUnitDetails}
    myBookingPayload={myBookingPayload}
    myObj={newPlotCostSheetA}
    selCustomerPayload={selCustomerPayload}
    newPlotPS={newPlotPS}
    myAdditionalCharges={newAdditonalChargesObj}
    unitTransactionsA={unitTransactionsA}
    projectType={projectType}
    project={project}
    netTotal={netTotal}
    totalIs={totalIs}
    customerDetails={customerDetails}
    fullPs={fullPs}
    unitReceivedTotal={unitReceivedTotal}
    plotPS={plotPS}
    unitTotal={unitTotal}
    T_B={T_B}



    PSa={PSa}
    setNetTotal={setNetTotal}
    partATotal={partATotal}
    partBTotal={partBTotal}

    projectDetails={projectDetails}
    leadDetailsObj1={leadDetailsObj1} setPartATotal={undefined} setPartBTotal={undefined} custObj1={undefined}
  
    />
</div>



  <div>
    <p className='text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mt-1 ml-1'>Unit Summary</p>
  </div>


          </div>

        </div>





          <div className="flex flex-col bg-[#f0f1ff] rounded-lg p-3 ">
          <div className="flex flex-row ">
                <img
                  src="https://static.ambitionbox.com/static/benefits/WFH.svg"
                  alt=""
                />
                <h1 className="text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-3 ml-1">
                  Payments Summary
                </h1>
              </div>
              <div >
                  <CrmPaymentSummary
                    selCustomerPayload={selUnitPayload}
                    assets={assets}
                  />
                </div>
                <div className="mt-1">
                  <CrmUnitPaymentGraph
                    selCustomerPayload={selUnitPayload}
                    assets={assets}
                  />
                </div>

              </div>
              <div className="flex flex-col bg-[#f0f1ff] rounded-lg p-3 mt-2 ">
          <div className="flex flex-row ">
                <img
                  src="https://static.ambitionbox.com/static/benefits/WFH.svg"
                  alt=""
                />
                <h1 className="text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-3 ml-1">
                  Activity
                </h1>
              </div>

            <div className="relative col-span-12 pl-6 space-y-2 sm:col-span-9 mt-3">
              {unitFetchedActivityData?.length == 0 && (
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
              <div className="col-span-12 space-y-2 relative pl-4 sm:col-span-8  sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:bg-gray-200">
                {unitFetchedActivityData?.map((data, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:bg-violet-200 bg-white p-3 rounded-lg"
                    >
                      <section>
                      <span className="text-[11px]  font-bold    py-[2px] rounded-lg   ">
                      {crmActivieLogNamer(data)}:
                        </span>
                      <span className="text-[10px] ml-1 text-[#398A58] font-bold  bg-[#D9d8ff] px-[6px] py-[2px] rounded-lg   ">
                     {data?.to} {'  '}
                        </span>






                      </section>
                      <span className="text-[12px] font- text-[#151F2B] flex flex-row">
                         By: {data?.by}
                        </span>
                      <span className="inline-flex flex-row items-center text-[12px] font-normal text-gray-500 ">
                        <ClockIcon className=" w-3 h-3 text-gray-300" />
                        <span className="text-gray-500 ml-1 mr-4">
                          {data?.type == 'ph'
                            ? timeConv(Number(data?.time)).toLocaleString()
                            : timeConv(data?.T).toLocaleString()}
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </PDFExport>
  )
}

export default CrmUnitSummary
