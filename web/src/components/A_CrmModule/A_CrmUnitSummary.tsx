import { useState, useEffect, useRef } from 'react'
import { ClockIcon } from '@heroicons/react/outline'
import { PDFExport } from '@progress/kendo-react-pdf'
import { steamUnitActivityLog } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { supabase } from 'src/context/supabase'
import { computeTotal } from 'src/util/computeCsTotals'
import { prettyDate, prettyDateTime, timeConv } from 'src/util/dateConverter'
import CrmUnitCostSheetView from './CrmCostSheetView'
import CrmUnitPaymentSchedule from './CrmPaymentSchedule'
import CrmPaymentSummary from './CrmPaymentSummary'
import CrmUnitPaymentGraph from './CrmUnitPaymentGraph'
import { crmActivieLogNamer } from 'src/util/CrmActivityLogHelper'
import PdfUniteSummary from 'src/util/PdfUniteSummary'
import { BellIcon, CheckCircle, ChevronDownIcon, Clock, MessageSquare, Phone } from 'lucide-react'
import { Cell, Pie, PieChart } from 'recharts'
import { formatIndianNumber } from 'src/util/formatIndianNumberTextBox'
import { calculatePercentages } from 'src/util/areaConverter'
import CostSheetAndPaymentSchedule from './CostSheetAndPaymentSchedule'
import RadialChart from '../A_SalesModule/Reports/charts/RadialChartone'
import RadialCharttwo from '../A_SalesModule/Reports/charts/RadialCharttwo'
import SemicircleProgressChart from '../A_SalesModule/Reports/charts/SemiCircleProgress'
import FinancialSemicircleChart from '../A_SalesModule/Reports/charts/FinancialSemicircleChart'
import FinanceBarChart from '../A_SalesModule/Reports/charts/FinanceBarChart'
import UnitPaymentsWithFinance from '../A_SalesModule/Reports/charts/FinanceBarChart'
import LogSkelton from '../shimmerLoaders/logSkelton'
import SmallSkelton from '../shimmerLoaders/smallSkeleton'

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
  setFeature,
}) => {
  const { user } = useAuth()
  const pdfUnitSummaryComp = useRef(null)
  const { orgId } = user
  const [unitFetchedActivityData, setUnitFetchedActivityData] = useState([])
  const [recentActivityObj, setRecentActivityObj] = useState({})
  const [recentActivitySkeleton, setRecentActivitySkeleton] = useState(true)

  const [upcomingMileStoneObj, setUpcomingMileStoneObj] = useState({})
  const [paymentScheduleTuned, setPaymentScheduleTuned] = useState([])
  const [upcomingMileStoneSkeleton, setUpcomingMileStoneSkeleton] =
    useState(true)

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


  const [isHovered, setIsHovered] = useState(false);


  useEffect(() => {
    console.log('unit dta is ', selUnitPayload, selUnitPayload?.id)
    boot()
    setTotalFun()
    const channel = supabase
      .channel('unit-logs-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: `${orgId}_unit_logs`,
        },
        (payload) => {
          console.log('account records', payload)
          const updatedData = payload.new
          const { uid } = payload.old
          const eventType = payload.eventType
          console.log('account records', updatedData.Uuid, selUnitPayload?.id)

          if (updatedData.Uuid === selUnitPayload?.id) {
            if (updatedData.Uuid === selUnitPayload?.id) {
              console.log(
                'account records',
                updatedData.Uuid,
                selUnitPayload?.id
              )
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
                  return [payload.new, ...prevLogs]
                }
              })
              setRecentActivitySkeleton(false)
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
                      const updatedLogs = prevLogs.filter(
                        (log) => log.uid != uid
                      )
                      return [...updatedLogs]
                    } else {
                      const updatedLogs = prevLogs.map((log) =>
                        log.id === uid ? payload.new : log
                      )
                      return [...updatedLogs]
                    }
                  } else {
                    console.log('New record added!')
                    return [payload.new, ...prevLogs]
                  }
                })
                setRecentActivitySkeleton(false)
              }
            }
          }
        }
      )
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  useEffect(() => {
    if (unitFetchedActivityData.length > 0) {
      setRecentActivityObj(unitFetchedActivityData[0])
      console.log('recent activity obj is ', recentActivityObj)
    }
  }, [unitFetchedActivityData])
  useEffect(() => {
    const paidAmount =
      (selCustomerPayload?.T_review || 0) +
      (selCustomerPayload?.T_approved || 0)
    let bal = 0
    let leftOver = paidAmount
    let newPaidAmount = paidAmount
    let outStanding = 0
    const z = selCustomerPayload?.fullPs?.map((d1, inx) => {
      console.log('left over stuff', inx, leftOver, d1.value)
      bal = leftOver >= d1?.value ? d1?.value : leftOver

      leftOver = newPaidAmount - d1?.value > 0 ? newPaidAmount - d1?.value : 0
      newPaidAmount = newPaidAmount - d1?.value
      outStanding = d1?.value - bal
      return { ...d1, amt: bal, leftOver, outStanding }
    })
    setPaymentScheduleTuned(z)
    if (selCustomerPayload?.fullPs?.length > 0) {
      let x = z?.filter((data) => data?.elgible === true)
      let y = x.at(-1) || {}
      setUpcomingMileStoneObj(y)

      console.log(
        'recent milestone obj is ',
        upcomingMileStoneObj,
        selCustomerPayload
      )
    }
  }, [selCustomerPayload])
  const boot = async () => {
    const unsubscribe = steamUnitActivityLog(orgId, {
      uid: selUnitPayload?.id,
      pId: selUnitPayload?.pId,
    })

    const y = await unsubscribe
    setUnitFetchedActivityData(y)
    setRecentActivitySkeleton(false)
  }
  const setTotalFun = async () => {
    const partBTotal = selUnitPayload?.additonalChargesObj?.reduce(
      (partialSum, obj) =>
        partialSum +
        Number(
          computeTotal(
            obj,
            selUnitPayload?.super_built_up_area ||
            selUnitPayload?.area?.toString()?.replace(',', '')
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

  const documents = [
    {
      id: 1235,
      name: 'Agreement',
      type: 'agree',
      uploadedCount: selCustomerPayload?.agree_doc_count || 0,
    },
    {
      id: 1236,
      name: 'Register Doc',
      type: 'reg',
      uploadedCount: selCustomerPayload?.reg_doc_count || 0,
    },
    {
      id: 1237,
      name: 'Construction Gallery',
      type: 'constructGallery',
      uploadedCount: selCustomerPayload?.constructGallery_doc_count || 0,
    },
    {
      id: 1238,
      name: 'EC',
      type: 'ec',
      uploadedCount: selCustomerPayload?.ec_doc_count || 0,
    },
    {
      id: 1239,
      name: 'Others',
      type: 'others',
      uploadedCount: selCustomerPayload?.others_doc_count || 0,
    },
  ]

  const loanDetails = [
    { type: 'Pay slip', count: 2 },
    { type: 'Pay slip', count: 2 },
    { type: 'Pay slip', count: 2 },
    { type: 'Pay slip', count: 2 },
  ]

  const DocumentIcon = () => (
    <div className="">
      <img alt="CRM Background" src="/IconSetsdoc.svg" className="w-5 h-5" />
    </div>
  )

  return (
    <PDFExport paperSize="A4" margin="1cm" ref={pdfUnitSummaryComp}>
      <div
        className="overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300"
        style={{}}
      >
        {/* <div className="py-1 px-1 m-2 mt-[1px] rounded-lg border border-gray-100  overflow-y-scroll" style={{ height: `calc(100vh - 120px)` }}> */}

        <div className='p-4  mr-6'>
        <div className="min-h-screen ">
          <div className="max-w-5xl mx-auto space-y-4">




              <div className="max-w-5xl mx-auto bg-[#FFFFFF] rounded-[14px] border border-[#EFEFF0] shadow-[0px_4px_30px_0px_#0000000D] pt-6 ">


      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6">
        <div>
          <p className="font-normal text-[14px]   text-[#D68836] mb-2">Balance due in 2 days</p>
          <h2 className="font-semibold text-[24px] bg-gradient-to-r from-[#856FF3] via-[#799AF8] to-[#9596F6] [background-image:linear-gradient(77.2deg,#856FF3_8.14%,#799AF8_81.2%,#9596F6_88.21%)] text-transparent bg-clip-text">₹ 22,12,22,32,000</h2>
        </div>
        
<button 
  className="flex items-center justify-center md:mt-0 w-[132px] h-[34px] gap-[10px] rounded-[8px] px-[14px] py-[10px] 
             [background-image:linear-gradient(75.3deg,#D4DEFC_-12.88%,#EAE7FC_53.9%)] 
             text-[12px] text-[#0D0A1E]"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  Capture Payment
</button>

      </div>
      
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">

<div className="flex items-center justify-between w-auto h-[27px] gap-[6px] rounded-[30px] p-[6px] border border-[#E7E7E9]">
  <div className="bg-gray-100 rounded-full p-1">
    <CheckCircle size={18} className="text-gray-600" />
  </div>
  <span className="font-outfit font-normal text-[12px] mr-3">Paid</span>
  <span className="font-bold text-[12px] text-[#0D0A1E] ">12,22,32,000</span>
</div>



        <div className="font-outfit font-normal text-[12px]  text-black">On Completion of Second slab</div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between px-6 py-2 items-start md:items-center">
        <div className="flex items-center">
          <MessageSquare size={13} className="text-gray-600 mr-2" />
          <p className="font-outfit font-normal text-[12px]  text-[#0D0A1E]">Customer will make the payment tomorrow evening</p>
          <span className=" font-normal text-[10px] leading-[100%] tracking-[0] text-[#404040] ml-2">/ 2 days ago</span>
        </div>
        
        <div className="flex items-center mt-3 md:mt-0">
          <Phone size={13} className="text-gray-600 mr-1" />
          <span className="font-outfit font-normal text-[12px]  text-[#0D0A1E]">Total Dials: 2</span>
        </div>
      </div>


    </div>






<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Card 1 */}
  <div className="relative bg-[#FFFFFF]  border border-[#EFEFF0] shadow-[0px_4px_30px_0px_#0000000D] w-full h-[95px] p-[10px] rounded-[14px] border border-[#E7E7E9] overflow-visible">
    <div className="p-2">
      <div className="font-[Outfit] font-normal text-[12px] text-[#606062] mb-2">Project Name:</div>
      <div className="h-px w-[210px] bg-gradient-to-r from-gray-400/90 to-gray-300/50 my-2"></div>
      <div className="flex items-center justify-between">
        <div className="font-normal text-[14px] text-[#2B2B2B] flex items-center gap-1">
          Delete
        </div>
      </div>
    </div>
  </div>

  {/* Card 3 */}
  <div className="relative bg-[#FFFFFF]  border border-[#EFEFF0] shadow-[0px_4px_30px_0px_#0000000D] w-full h-[95px] p-[10px] rounded-[14px] border bg-[#E7E7E9] overflow-visible">
    <div className="p-2">
      <div className="font-[Outfit] font-normal text-[12px] text-[#606062] mb-2">Lead Created</div>
      <div className="h-px w-[210px] bg-gradient-to-r from-gray-400/90 to-gray-300/50 my-2"></div>
      <div className="flex items-center justify-between">
        <div className="font-normal text-[14px] text-[#2B2B2B] flex items-center gap-1">
          Latest Update
        </div>
      </div>
    </div>
  </div>

  {/* Card 4 */}
  <div className="relative bg-[#FFFFFF]  border border-[#EFEFF0] shadow-[0px_4px_30px_0px_#0000000D] w-full h-[95px] p-[10px] rounded-[14px] border border-[#E7E7E9] overflow-visible">
    <div className="p-2">
      <div className="font-[Outfit] font-normal text-[12px] text-[#606062] mb-2">Source</div>
      <div className="h-px w-[210px] bg-gradient-to-r from-gray-400/90 to-gray-300/50 my-2"></div>
      <div className="flex items-center justify-between">
        <div className="font-normal text-[14px] text-[#2B2B2B] flex items-center gap-1">
          Tabel
        </div>
      </div>
    </div>
  </div>
</div>







            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-[#E7E7E9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] p-6">
                <div>

                <div className="flex justify-between items-center mb-4 overflow-visible">
                      {/* Left section */}
                      <div className="flex items-center">
                        <div className="bg-[#FFFFFF] p-1.5 rounded-lg mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                          <img
                            src="/fire.svg"
                            alt=""
                            className="w-[18px] h-[18px]"
                          />
                        </div>

                        <span className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
                        LAST TRANSACTION
                        </span>
                      </div>

                      {/* Right section */}
                      <div className="border border-green-600 text-green-600 rounded-md px-4 py-1 text-sm">
                        Success
                      </div>
                    </div>


                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-gray-500 text-sm">On 27 Mar 2025</p>
                      <p className="text-[#0E0A1F] text-[14px] font-medium ">
                        Brother Builder pvt
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">Check</p>
                      <p className="text-[#0E0A1F] text-[14px] font-medium ">
                        ₹ 22,76,36,500
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-2xl p-6 border border-[#E7E7E9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] cursor-pointer"
                onClick={() => setFeature('applicant_info')}
              >
                <div>



                <div className="flex justify-between items-center mb-4 overflow-visible">
                      {/* Left section */}
                      <div className="flex items-center">
                        <div className="bg-[#FFFFFF] p-1.5 rounded-lg mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                          <img
                            src="/fire.svg"
                            alt=""
                            className="w-[18px] h-[18px]"
                          />
                        </div>

                        <span className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
                        APPLICANT DETAILS
                        </span>
                      </div>

                      {/* Right section */}
                      <div className="">
                      <svg
                      width="19"
                      height="8"
                      viewBox="0 0 32 12"
                      fill="black"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mb-[13px]"
                    >
                      <path
                        d="M2 4.87494H0.875L0.875 7.12494H2L2 4.87494ZM2 7.12494L30.5 7.12494V4.87494L2 4.87494L2 7.12494ZM25.0685 4.7589e-08C25.0685 3.89997 28.1374 7.125 32 7.125L32 4.875C29.449 4.875 27.3185 2.72744 27.3185 -4.7589e-08L25.0685 4.7589e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z"
                        fill="black"
                      ></path>
                    </svg>
                      </div>
                    </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white overflow-hidden">
                          <div className="w-full h-full bg-gray-300"></div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white overflow-hidden">
                          <div className="w-full h-full bg-gray-300"></div>
                        </div>
                      </div>
                      <span className="ml-5 text-[16px] text-[#0E0A1F] font-medium">
                        2 applicants
                      </span>
                    </div>
                    <div className="h-6 w-px bg-gray-300 mx-4"></div>
                    <div className="text-[#960000] text-[14px] font-medium text-right whitespace-nowrap">
                      KYC{' '}
                      {selCustomerPayload?.kyc_status === 'approved'
                        ? 'Completed'
                        : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="bg-white rounded-2xl  border border-[#E7E7E9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)]  p-6 cursor-pointer"
                onClick={() => setFeature('timeline')}
              >
                <div>

                <div className="flex justify-between items-center mb-4 overflow-visible">
                      {/* Left section */}
                      <div className="flex items-center">
                        <div className="bg-[#FFFFFF] p-1.5 rounded-lg mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                          <img
                            src="/fire.svg"
                            alt=""
                            className="w-[18px] h-[18px]"
                          />
                        </div>

                        <span className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
                        RECENT ACTIVITY ({unitFetchedActivityData.length})
                        </span>
                      </div>

                      {/* Right section */}
                      <div className="">

                      <span className="text-[#606062] font-medium text-[12px] mb-[13px]">
                        {' '}
                        {unitFetchedActivityData.length} more
                      </span>
          
                      </div>
                    </div>
    

                  {!recentActivitySkeleton && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-[#0E0A1F] text-[14px] font-medium">
                          {crmActivieLogNamer(recentActivityObj)}
                        </p>
                        <p className="text-[#960000] text-[12px] font-medium">
                          {recentActivityObj?.subtype}
                        </p>
                      </div>
                      <section className="flex flex-row items-center">
                        <p className="text-gray-500 text-[12px]">
                          {prettyDateTime(recentActivityObj?.T) || 'NA'}
                        </p>
                        <div className="w-[2px] mx-2 mt-[4px] h-[8px] border-0 border-r"></div>

                        <p className="text-gray-500 text-[12px]">
                          {recentActivityObj?.by || 'NA'}
                        </p>
                      </section>
                    </div>
                  )}
                  {recentActivitySkeleton && <SmallSkelton />}
                </div>
              </div>

              <div
                className="bg-white rounded-2xl border border-[#E7E7E9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] overflow-visible p-6 cursor-pointer"
                onClick={() => setFeature('finance_info')}
              >
                <div>


                <div className="flex justify-between items-center mb-4 overflow-visible">
                      {/* Left section */}
                      <div className="flex items-center">
                        <div className="bg-[#FFFFFF] p-1.5 rounded-lg mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                          <img
                            src="/fire.svg"
                            alt=""
                            className="w-[18px] h-[18px]"
                          />
                        </div>

                        <span className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
                        ACTIVE MILESTONE ({selCustomerPayload?.fullPs?.length})
                        </span>
                      </div>

                      {/* Right section */}
                      <div className="">

                      <svg
                      width="19"
                      height="8"
                      viewBox="0 0 32 12"
                      fill="black"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mb-[13px]"
                    >
                      <path
                        d="M2 4.87494H0.875L0.875 7.12494H2L2 4.87494ZM2 7.12494L30.5 7.12494V4.87494L2 4.87494L2 7.12494ZM25.0685 4.7589e-08C25.0685 3.89997 28.1374 7.125 32 7.125L32 4.875C29.449 4.875 27.3185 2.72744 27.3185 -4.7589e-08L25.0685 4.7589e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z"
                        fill="black"
                      ></path>
                    </svg>
          
                      </div>
                    </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <section className="flex flex-col">
                        <p className="text-[#0E0A1F] text-[14px] font-medium">
                          {upcomingMileStoneObj?.label}
                        </p>

                        <p className="text-gray-500 text-[12px]">
                          {prettyDate(upcomingMileStoneObj?.elgFrom)}
                        </p>
                      </section>
                      <section className="flex flex-col text-right">
                        <p className="text-[#0E0A1F] text-[14px] font-medium">
                          Cost: ₹{' '}
                          {upcomingMileStoneObj?.value?.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[#0E0A1F] text-[14px] font-medium">
                          Balance: ₹{' '}
                          {upcomingMileStoneObj?.outStanding?.toLocaleString(
                            'en-IN'
                          )}
                        </p>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
{/* 
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer"
              onClick={() => setFeature('agreement_info')}
            >
              <div className="bg-white border border-[#E7E7E9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)]  rounded-2xl p-6">


              <div className="flex justify-between items-center mb-4 overflow-visible">
            
                      <div className="flex items-center">
                        <div className="bg-[#FFFFFF] p-1.5 rounded-lg mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                          <img
                            src="/fire.svg"
                            alt=""
                            className="w-[18px] h-[18px]"
                          />
                        </div>

                        <span className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
                        DOCUMENTS
                        </span>
                      </div>

                
                      <div className="">

                      <svg
                      width="19"
                      height="8"
                      viewBox="0 0 32 12"
                      fill="black"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mb-[13px]"
                    >
                      <path
                        d="M2 4.87494H0.875L0.875 7.12494H2L2 4.87494ZM2 7.12494L30.5 7.12494V4.87494L2 4.87494L2 7.12494ZM25.0685 4.7589e-08C25.0685 3.89997 28.1374 7.125 32 7.125L32 4.875C29.449 4.875 27.3185 2.72744 27.3185 -4.7589e-08L25.0685 4.7589e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z"
                        fill="black"
                      ></path>
                    </svg>
          
                      </div>
                    </div>



                <div className="space-y-0">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="py-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img
                            src="/IconSetsdoc.svg"
                            alt="Document"
                            className="h-5 w-5 object-contain"
                          />
                          <span className="font-normal text-[14px] leading-[100%] tracking-[0%] font-outfit">
                            {doc.name}
                          </span>
                        </div>
                        <span className="font-normal text-[14px] leading-[100%] tracking-[0%] font-outfit">
                          {doc.uploadedCount} Document
                        </span>
                      </div>
                    </div>

                  ))}
                </div>
              </div>

              <div
                className="bg-white border border-[#E7E7E9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] rounded-2xl p-6"
                onClick={() => setFeature('agreement_info')}
              >




<div className="flex justify-between items-center mb-4 overflow-visible">
         
                      <div className="flex items-center">
                        <div className="bg-[#FFFFFF] p-1.5 rounded-lg mr-3 shadow-[0px_0.75px_4px_0px_rgba(0,0,0,0.1)]">
                          <img
                            src="/fire.svg"
                            alt=""
                            className="w-[18px] h-[18px]"
                          />
                        </div>

                        <span className="font-semibold text-[12px] leading-[100%] tracking-[0.06em] text-[#696990]">
                        LOAN DETAILS
                        </span>
                      </div>

                  
                      <div className="">


                      <div className="px-4 py-1 rounded-md border border-yellow-400 text-yellow-500">
                    In-Review
                  </div>

          
                      </div>
                    </div>


      
                <div className="space-y-4">
                  {loanDetails.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src="/IconSetsdoc.svg"
                          alt="Document"
                          className="h-5 w-5 object-contain"
                        />
                        <span className="font-medium">{detail.type}</span>
                      </div>
                      <span className="text-gray-600">
                        {detail.count} Documents
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer'>

              <div className="flex items-center justify-between bg-white border border-[#E7E7E9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] rounded-2xl p-8 w-full max-w-[500px] mx-auto">

                <div className="flex flex-col items-center w-1/3">
                  <div className="text-gray-600 font-semibold mb-2">Stage Cost</div>



                  <FinancialSemicircleChart
                    paidValue={(selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0)}
                    remainingValue={selCustomerPayload?.T_elgible - ((selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0))}
                    balance={selCustomerPayload?.T_elgible_balance < 0 ? 0 : selCustomerPayload?.T_elgible_balance}
                    filledColor="#DBD3FD"
                    emptyColor="#E5E7EB"
                    showPercentage={true}
                    showBalance={false}


                  />

                </div>


                <div className="w-[250px] pl-2 flex flex-col justify-center space-y-2">
                  <div className="flex items-center justify-between text-gray-700 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-gray-500">Unit Cost:</span>
                    </span>
                    <span className="text-gray-900 font-semibold text-base">
                      ₹ {selCustomerPayload?.T_elgible?.toLocaleString('en-IN') || '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-purple-300"></span>
                      <span className="text-gray-500">Paid:</span>
                    </span>
                    <span className="text-gray-900 font-medium">
                      ₹ {((selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0))?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-gray-300"></span>
                      <span className="text-gray-500">Balance:</span>
                    </span>
                    <span className="text-gray-900 font-medium">
                      ₹ {selCustomerPayload?.T_elgible_balance < 0
                        ? 0
                        : Math.round(selCustomerPayload?.T_elgible_balance)?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* <UnitPaymentsWithFinance selCustomerPayload={{ T_review: 3000000, T_approved: 4000000, T_total: 10000000 }} />  */}

              <div className="grid grid-cols-3 bg-white border border-[#E7E7E9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] rounded-2xl p-4 w-full max-w-[500px] mx-auto">

                <div className="col-span-1 flex flex-col items-center">
                  <div className="text-gray-600 font-semibold mb-2">Unit cost</div>
                  <RadialCharttwo
                    paid={(selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0)}
                    total={selCustomerPayload?.T_total || selCustomerPayload?.T_Total || 0}
                    balance={selCustomerPayload?.T_balance || 0}
                  />
                </div>


                <div className="col-span-2 pl-4 flex flex-col justify-center space-y-2">
                  <div className="flex items-center justify-between text-gray-700 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-gray-500">Unit Cost:</span>
                    </span>
                    <span className="text-gray-900 font-semibold text-base">
                      ₹ {Math.round(selCustomerPayload?.T_total || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-purple-300"></span>
                      <span className="text-gray-500">Paid:</span>
                    </span>
                    <span className="text-gray-900 font-medium">
                      ₹ {((selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0))?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-gray-300"></span>
                      <span className="text-gray-500">Balance:</span>
                    </span>
                    <span className="text-gray-900 font-medium">
                      ₹ {Math.round(selCustomerPayload?.T_balance || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>



            </div>


            <div>
              <CostSheetAndPaymentSchedule
                selUnitDetails={selUnitPayload}
                paymentScheduleTuned={paymentScheduleTuned}
                setFeature={setFeature}
              />
            </div>
          </div>
        </div>

        </div>


        <div>












        </div>

        <div className="flex mt-4 flex-row">
          <div className="w-full">
            <div className="flex flex-row justify-between text-end items-end mr-2"></div>
            <div>
              <div className="  rounded-lg">
                <div className="grid   rounded-lg grid-cols-2 gap-4 mb-3">
                  <div className="bg-[#FFFFFF] p-4 rounded-lg">
                    <div className="flex justify-between ">
                      <span className="font-medium">Stage Balance</span>
                      <span className="font-semibold">...</span>
                    </div>
                    <div className="relative flex justify-center items-center">
                      <PieChart width={250} height={250}>
                        <Pie
                          data={[
                            {
                              name: 'Paid',
                              value: calculatePercentages(
                                (selCustomerPayload?.T_review || 0) +
                                (selCustomerPayload?.T_approved || 0),
                                selCustomerPayload?.T_elgible
                              ).paidPercentage,
                            },
                            {
                              name: 'Remaining',
                              value: calculatePercentages(
                                (selCustomerPayload?.T_review || 0) +
                                (selCustomerPayload?.T_approved || 0),
                                selCustomerPayload?.T_elgible
                              ).unpaidPercentage,
                            },
                          ]}
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
                          ₹
                          {selCustomerPayload?.T_elgible_balance < 0
                            ? 0
                            : Math.round(
                              selCustomerPayload?.T_elgible_balance
                            )?.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <section className="flex flex-row justify-between mx-2">
                      <div className="text-center">
                        <div className="text-[12px] text-gray-500">
                          Elgible Cost
                        </div>

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
                                {formatIndianNumber?.(
                                  Math.round(selCustomerPayload?.T_elgible || 0)
                                )}
                              </span>
                            </span>
                            <div
                              className="w-3 h-3 ml-1  -mt-2 rotate-45 bg-black"
                              style={{
                                background: '#213343',
                                marginRight: '12px',
                              }}
                            ></div>
                          </div>
                          <span className="text-[14px] font-bold text-gray-900">
                            ₹{' '}
                            {Math.round(
                              selCustomerPayload?.T_elgible || 0
                            ).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="font-bold text-[14px]"></div>
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

                                {formatIndianNumber?.(
                                  Math.round(
                                    selCustomerPayload?.T_review || 0
                                  ) + (selCustomerPayload?.T_approved || 0)
                                )}
                              </span>
                            </span>
                            <div
                              className="w-3 h-3 ml-1  -mt-2 rotate-45 bg-black"
                              style={{
                                background: '#213343',
                                marginRight: '12px',
                              }}
                            ></div>
                          </div>
                          <span className="text-[14px] font-bold ">
                            {/* ₹ {Math.round(selCustomerPayload?.T_elgible || 0).toLocaleString('en-IN')} */}
                            ₹
                            {Math.round(
                              (selCustomerPayload?.T_review || 0) +
                              (selCustomerPayload?.T_approved || 0)
                            ).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[12px] text-gray-500">Balance</div>
                        {/* <div className="font-bold text-[14px]">
                    ₹ {Math.round(Math.max(selCustomerPayload?.T_elgible_balance || 0, 0)).toLocaleString('en-IN')}

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
                                {formatIndianNumber?.(
                                  Math.round(
                                    Math.max(
                                      selCustomerPayload?.T_elgible_balance ||
                                      0,
                                      0
                                    )
                                  )
                                )}
                              </span>
                            </span>
                            <div
                              className="w-3 h-3 ml-1 -mt-2 rotate-45 bg-black"
                              style={{
                                background: '#213343',
                                marginRight: '12px',
                              }}
                            ></div>
                          </div>
                          <span className="text-[14px] font-bold">
                            ₹
                            {Math.round(
                              Math.max(
                                selCustomerPayload?.T_elgible_balance || 0,
                                0
                              )
                            ).toLocaleString('en-IN')}
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
                          data={[
                            {
                              name: 'Paid',
                              value: calculatePercentages(
                                (selCustomerPayload?.T_review || 0) +
                                (selCustomerPayload?.T_approved || 0),
                                selCustomerPayload?.T_total ||
                                selCustomerPayload?.T_Total
                              ).paidPercentage,
                            },
                            {
                              name: 'Remaining',
                              value: calculatePercentages(
                                (selCustomerPayload?.T_review || 0) +
                                (selCustomerPayload?.T_approved || 0),
                                selCustomerPayload?.T_total ||
                                selCustomerPayload?.T_Total
                              ).unpaidPercentage,
                            },
                          ]}
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
                          ₹{' '}
                          {Math.round(
                            selCustomerPayload?.T_balance || 0
                          ).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <section className="flex flex-row justify-between mx-2">
                      <div className="text-center">
                        <div className="text-[12px] text-gray-500">
                          Unit Cost
                        </div>
                        <div className="font-bold text-[14px]">
                          ₹{' '}
                          {Math.round(
                            selCustomerPayload?.T_total || 0
                          ).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[12px] text-gray-500">Paid</div>
                        <div className="font-bold text-[14px]">
                          ₹{' '}
                          {(
                            (selCustomerPayload?.T_review || 0) +
                            (selCustomerPayload?.T_approved || 0)
                          )?.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[12px] text-gray-500">Balance</div>
                        <div className="font-bold text-[14px]">
                          ₹{' '}
                          {Math.round(
                            selCustomerPayload?.T_balance || 0
                          ).toLocaleString('en-IN')}
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
                      <section className="flex flex-row justify-between">
                        <div className="">
                          <div className="text-sm text-gray-500 mb-2">
                            Total Paid
                          </div>
                          <div className="font-bold mb-4">
                            ₹{' '}
                            {Math.round(
                              (selCustomerPayload?.T_review || 0) +
                              (selCustomerPayload?.T_approved || 0)
                            ).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </section>
                      <div className="w-full bg-gray-200 h-7 rounded-full mb-6">
                        <div className="bg-[#DBD3FD] h-7 rounded-full w-1/3"></div>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        Total Cost
                      </div>
                      <div className="font-bold">
                        ₹{' '}
                        {Math.round(
                          selCustomerPayload?.T_total || 0
                        ).toLocaleString('en-IN')}
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
            <div className="flex flex-col crm_bg_color rounded-xl mb-2 p-3 ">
              <div className="flex flex-row  bg-white  rounded-xl my-1  px-2 py-2 min-w-[260px]">
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
                    leadDetailsObj1={leadDetailsObj1}
                    setPartATotal={undefined}
                    setPartBTotal={undefined}
                    custObj1={undefined}
                  />
                </div>

                <div>
                  <p className="text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mt-1 ml-1">
                    Unit Summary
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col crm_bg_color rounded-lg p-3 ">
              <div className="flex flex-row ">
                <img
                  src="https://static.ambitionbox.com/static/benefits/WFH.svg"
                  alt=""
                />
                <h1 className="text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-3 ml-1">
                  Payments Summary
                </h1>
              </div>
              <div>
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
            <div className="flex flex-col crm_bg_color rounded-lg p-3 mt-2 ">
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
