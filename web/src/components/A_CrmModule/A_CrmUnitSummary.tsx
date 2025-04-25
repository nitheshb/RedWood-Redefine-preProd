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
import { BellIcon, ChevronDownIcon } from 'lucide-react'
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
  const [upcomingMileStoneSkeleton, setUpcomingMileStoneSkeleton] = useState(true)

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
              setRecentActivitySkeleton(false)
            }
          }
        }
      })
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
useEffect(() => {
  if(unitFetchedActivityData.length > 0){
  setRecentActivityObj(unitFetchedActivityData[0])
console.log('recent activity obj is ', recentActivityObj)
}
}, [unitFetchedActivityData])
useEffect(() => {
  const paidAmount = (selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0)
  let bal = 0
  let leftOver = paidAmount
  let newPaidAmount = paidAmount
  let outStanding = 0
  const z = selCustomerPayload?.fullPs?.map((d1, inx) => {
    console.log('left over stuff',inx, leftOver, d1.value)
    bal = leftOver >= d1?.value ? d1?.value : leftOver

    leftOver = newPaidAmount - d1?.value > 0 ? newPaidAmount - d1?.value : 0
    newPaidAmount = newPaidAmount - d1?.value
    outStanding =  d1?.value - bal
    return { ...d1, amt: bal, leftOver, outStanding }
  })
  setPaymentScheduleTuned(z)
  if(selCustomerPayload?.fullPs?.length > 0){
   let x = z?.filter((data) => data?.elgible ===true)
let y = x.at(-1)|| {};
    setUpcomingMileStoneObj(y)

console.log('recent milestone obj is ', upcomingMileStoneObj, selCustomerPayload)
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

  const documents = [
    {
      id: 1235,
      name: 'Agreement',
      type: 'agree',
      uploadedCount: selCustomerPayload?.agree_doc_count || 0
    },
    {
      id: 1236,
      name: 'Register Doc',
      type: 'reg',
      uploadedCount: selCustomerPayload?.reg_doc_count  || 0
    },
    {
      id: 1237,
      name: 'Construction Gallery',
      type: 'constructGallery',
      uploadedCount: selCustomerPayload?.constructGallery_doc_count || 0
    },
    {
      id: 1238,
      name: 'EC',
      type: 'ec',
      uploadedCount: selCustomerPayload?.ec_doc_count || 0
    },
    {
      id: 1239,
      name: 'Others',
      type: 'others',
      uploadedCount: selCustomerPayload?.others_doc_count || 0

    },
  ];

  const loanDetails = [
    { type: "Pay slip", count: 2 },
    { type: "Pay slip", count: 2 },
    { type: "Pay slip", count: 2 },
    { type: "Pay slip", count: 2 }
  ];






  const DocumentIcon = () => (
    <div className=''>
<img
    alt="CRM Background"
    src="/IconSetsdoc.svg"
    className="w-5 h-5"
  />
    </div>
  );









  return (
    <PDFExport paperSize="A4" margin="1cm" ref={pdfUnitSummaryComp}>
      <div className=" rounded-lg  border border-gray-100   overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300" style={{  }}>
            {/* <div className="py-1 px-1 m-2 mt-[1px] rounded-lg border border-gray-100  overflow-y-scroll" style={{ height: `calc(100vh - 120px)` }}> */}
            <div className="min-h-screen mr-6">
  <div className="max-w-5xl mx-auto space-y-4">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div className="bg-white rounded-xl p-6">
        <div>
          <div className="flex justify-between overflow-visible items-center mb-4">
            <div className="flex items-center gap-2 overflow-visible">
              {/* <img src="/su5.svg" alt="Transaction" className="w-[30px] h-[29px] mr-2 object-cover" /> */}
              <div>
       <img src="https://bvconuycpdvgzbvbkijl.supabase.co/storage/v1/object/public/sizes/6bfe8c-fire/front/400/color.webp" alt="Transaction" className="w-[35px]  mr-1 object-cover" />

              </div>
              <h2 className="text-gray-600 font-medium text-[12px] uppercase tracking-wide mb-[9px]">
                LAST TRANSACTION
              </h2>
            </div>
            <div className="inline-block border border-green-600 text-green-600 rounded-md px-4 py-1 text-sm">
              Success
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-gray-500 text-sm">On 27 Mar 2025</p>
              <p className="text-[#0E0A1F] text-[14px] font-medium ">Brother Builder pvt</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Check</p>
              <p className="text-[#0E0A1F] text-[14px] font-medium ">₹ 22,76,36,500</p>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-white rounded-xl p-6 cursor-pointer" onClick={() => setFeature('applicant_info')}>
        <div>

<section className='flex flex-row justify-between items-center mb-4'>
          <div className="flex items-center gap-2  mb-4 overflow-visible">
          <div>
          {/* <img src="/su66.svg" alt="Applicant" className="w-[30px] h-[30px] mr-2 object-contain" /> */}
   <img src="https://bvconuycpdvgzbvbkijl.supabase.co/storage/v1/object/public/sizes/b91186-shield/dynamic/400/color.webp" className='w-[35px]'></img>

          </div>

            <h2 className="text-[#606062] font-medium text-[12px] uppercase tracking-wide">
              APPLICANT DETAILs
            </h2>
          </div>
          <svg width="19" height="8" viewBox="0 0 32 12" fill="black" xmlns="http://www.w3.org/2000/svg" className="mb-[13px]"><path d="M2 4.87494H0.875L0.875 7.12494H2L2 4.87494ZM2 7.12494L30.5 7.12494V4.87494L2 4.87494L2 7.12494ZM25.0685 4.7589e-08C25.0685 3.89997 28.1374 7.125 32 7.125L32 4.875C29.449 4.875 27.3185 2.72744 27.3185 -4.7589e-08L25.0685 4.7589e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black"></path></svg>
          </section>
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
              <span className="ml-5 text-[16px] text-[#0E0A1F] font-medium">2 applicants</span>
            </div>
            <div className="h-6 w-px bg-gray-300 mx-4"></div>
            <div className="text-[#960000] text-[14px] font-medium text-right whitespace-nowrap">
                KYC {selCustomerPayload?.kyc_status === 'approved' ? 'Completed': 'Pending'}

            </div>
          </div>
        </div>
      </div>
    </div>


    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div className="bg-white rounded-xl  p-6 cursor-pointer" onClick={() => setFeature('timeline')}>
        <div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 mb-4 ">
              <img src="https://bvconuycpdvgzbvbkijl.supabase.co/storage/v1/object/public/sizes/49b6f4-target/front/400/color.webp" alt="Activity" className="w-[35px] mr-1 object-contain" />


              <h2 className="text-[#606062] font-medium text-[12px] uppercase tracking-wide">
                RECENT ACTIVITY ({unitFetchedActivityData.length})
              </h2>
            </div>

         <section className='flex flex-row'>
         <span className="text-[#606062] font-medium text-[12px] mb-[13px]"> {unitFetchedActivityData.length} more</span>
          {/* <svg width="19" height="8" viewBox="0 0 32 12" fill="black" xmlns="http://www.w3.org/2000/svg" className="mb-[13px]"><path d="M2 4.87494H0.875L0.875 7.12494H2L2 4.87494ZM2 7.12494L30.5 7.12494V4.87494L2 4.87494L2 7.12494ZM25.0685 4.7589e-08C25.0685 3.89997 28.1374 7.125 32 7.125L32 4.875C29.449 4.875 27.3185 2.72744 27.3185 -4.7589e-08L25.0685 4.7589e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black"></path></svg> */}

         </section>
          </div>

         { !recentActivitySkeleton &&<div className="space-y-1">
            <div className="flex justify-between items-center">
              <p className="text-[#0E0A1F] text-[14px] font-medium">{crmActivieLogNamer(recentActivityObj)}</p>
              <p className="text-[#960000] text-[12px] font-medium">{recentActivityObj?.subtype}</p>

            </div>
            <section className='flex flex-row'>
              <p className="text-gray-500 text-[12px]">{prettyDateTime(recentActivityObj?.T) || 'NA'}</p>
              <p className="text-gray-500 text-[12px]">
                {recentActivityObj?.by || 'NA'}
              </p>


            </section>

          </div>}
         {recentActivitySkeleton && <SmallSkelton />}
        </div>
      </div>


      <div className="bg-white rounded-xl overflow-visible p-6 cursor-pointer" onClick={() => setFeature('finance_info')}>
        <div>
          <section className='flex flex-row justify-between items-center mb-3'>
          <div className="flex items-center gap-2 overflow-visible mb-4">
            {/* <img src="/su3.svg" alt="Calendar" className="w-[30px] h-[29px] mr-2 object-contain" /> */}
            <div>

     <img src="https://bvconuycpdvgzbvbkijl.supabase.co/storage/v1/object/public/sizes/e9828b-flag/iso/400/color.webp" className='w-[35px]'></img>

            </div>
            <h2 className="text-[#606062] font-medium text-[12px] uppercase tracking-wide">
              ACTIVE MILESTONE ({selCustomerPayload?.fullPs?.length})
            </h2>
          </div>
          <svg width="19" height="8" viewBox="0 0 32 12" fill="black" xmlns="http://www.w3.org/2000/svg" className="mb-[13px]"><path d="M2 4.87494H0.875L0.875 7.12494H2L2 4.87494ZM2 7.12494L30.5 7.12494V4.87494L2 4.87494L2 7.12494ZM25.0685 4.7589e-08C25.0685 3.89997 28.1374 7.125 32 7.125L32 4.875C29.449 4.875 27.3185 2.72744 27.3185 -4.7589e-08L25.0685 4.7589e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black"></path></svg>
        </section>
          <div className="space-y-1">

            <div className="flex justify-between items-center">
              <section className="flex flex-col">
              <p className="text-[#0E0A1F] text-[14px] font-medium">
                {upcomingMileStoneObj?.label}
              </p>


            <p className="text-gray-500 text-[12px]">{prettyDate(upcomingMileStoneObj?.elgFrom)}</p>
</section>
<section className='flex flex-col text-right'>
              <p className="text-[#0E0A1F] text-[14px] font-medium">
               Cost: ₹ {upcomingMileStoneObj?.value?.toLocaleString('en-IN')}
              </p>
              <p className="text-[#0E0A1F] text-[14px] font-medium">
               Balance: ₹ {upcomingMileStoneObj?.outStanding?.toLocaleString('en-IN')}
              </p>
              </section>
</div>
          </div>
        </div>
      </div>
    </div>


    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer" onClick={() => setFeature('agreement_info')}>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <section className='flex flex-row justify-between items-center'>
        <div className="flex items-center mb-6">
          <img src="/su1.svg" alt="Documents" className="h-5 w-5 mr-2" />
          <h2 className="text-[12px] font-medium text-[#606062]">DOCUMENTS</h2>
        </div>
        <svg width="19" height="8" viewBox="0 0 32 12" fill="black" xmlns="http://www.w3.org/2000/svg" className="mb-[13px]"><path d="M2 4.87494H0.875L0.875 7.12494H2L2 4.87494ZM2 7.12494L30.5 7.12494V4.87494L2 4.87494L2 7.12494ZM25.0685 4.7589e-08C25.0685 3.89997 28.1374 7.125 32 7.125L32 4.875C29.449 4.875 27.3185 2.72744 27.3185 -4.7589e-08L25.0685 4.7589e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black"></path></svg>
        </section>
        <div className="space-y-0">
          {documents.map((doc, index) => (
              <div key={index} className="py-4 border-b border-gray-200 last:border-b-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                 <img src="/IconSetsdoc.svg" alt="Document" className="h-5 w-5 object-contain" />
                 <span className="font-normal text-[14px] leading-[100%] tracking-[0%] font-outfit">{doc.name}</span>
                </div>
                <span className="font-normal text-[14px] leading-[100%] tracking-[0%] font-outfit">{doc.uploadedCount} Document
                </span>
              </div>
            </div>
            // <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200">
            //   <div className="flex items-center gap-3">
            //     <img src="/IconSetsdoc.svg" alt="Document" className="h-5 w-5 object-contain" />
            //     <span className="font-medium">{doc.name}</span>
            //   </div>
            //   <span className="text-gray-600">{doc.uploadedCount} Document</span>
            // </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6" onClick={() => setFeature('agreement_info')}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img src="/su1.svg" alt="Loan" className="h-5 w-5 mr-2" />
            <h2 className="text-[12px] font-medium text-[#606062]">LOAN DETAILS</h2>
          </div>
          <div className="px-4 py-1 rounded-md border border-yellow-400 text-yellow-500">
            In-Review
          </div>
        </div>
        <div className="space-y-4">
          {loanDetails.map((detail, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img src="/IconSetsdoc.svg" alt="Document" className="h-5 w-5 object-contain" />
                <span className="font-medium">{detail.type}</span>
              </div>
              <span className="text-gray-600">{detail.count} Documents</span>
            </div>
          ))}
        </div>
      </div>







    </div>



    <div>
  <CostSheetAndPaymentSchedule selUnitDetails={selUnitPayload} paymentScheduleTuned={paymentScheduleTuned} setFeature={setFeature}/>
  </div>

  </div>
</div>















<div>



<div className="relative bg-gray-50 p-6 rounded-lg mb-6">
        <div className="text-gray-600 font-medium mb-4">UNIT COST</div>
        <div className="flex justify-between">
          <div className="w-3/5 relative">
            {/* Custom radial chart with thin segments */}
            <div className="relative h-40 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Create individual segments around the circle */}
                {Array.from({ length: 60 }).map((_, i) => {
                  // const angle = (i * 6) * (Math.PI / 180);
                  const angle = (i * 6) * (Math.PI / 180);
                  const innerRadius = 45;
                  const outerRadius = 85;
                  const x1 = 100 + innerRadius * Math.cos(angle);
                  const y1 = 100 + innerRadius * Math.sin(angle);
                  const x2 = 100 + outerRadius * Math.cos(angle);
                  const y2 = 100 + outerRadius * Math.sin(angle);

                  const color = i < 27 ? "#e0d4ff" : "#e5e7eb";
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={color}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              <div className="absolute text-3xl font-bold">45%</div>
            </div>
          </div>
          <div className="flex items-center justify-end w-2/5">
            <svg className="w-32 h-32 opacity-10" viewBox="0 0 100 100">
              <path
                d="M20,20 C50,50 50,50 80,20 M20,80 C50,50 50,50 80,80"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Finance Balance */}
      <div className="relative bg-gray-50 p-6 rounded-lg">
        <div className="text-gray-600 font-medium mb-4">FINANCE BALANCE</div>
        <div className="flex justify-between">
          <div className="w-3/5">
            {/* Two separate bars instead of one stacked bar */}
            <div className="mt-4 mb-4 space-y-4">
              {/* Purple bar - 70% */}
              <div className="h-6">
                <div className="bg-purple-200 rounded h-full" style={{ width: '70%' }}></div>
              </div>
              {/* Gray bar - 30% */}
              <div className="h-6">
                <div className="bg-gray-200 rounded h-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div className="flex">
              <div className="text-xl font-semibold">70%</div>
              <div className="text-xl font-semibold ml-20">30%</div>
            </div>
          </div>
          <div className="flex items-center justify-end w-2/5">
            <svg className="w-32 h-32 opacity-10" viewBox="0 0 100 100">
              <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(15, 50, 50)" />
              <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(30, 50, 50)" />
              <path d="M30,30 C50,20 70,20 70,50 C70,80 30,80 30,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
        </div>
      </div>

</div>


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

          <div className="flex flex-col bg-[#EDE9FE] rounded-xl mb-2 p-3 ">

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
    leadDetailsObj1={leadDetailsObj1} setPartATotal={undefined} setPartBTotal={undefined} custObj1={undefined}


    />
</div>



  <div>
    <p className='text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mt-1 ml-1'>Unit Summary</p>
  </div>


          </div>

        </div>





          <div className="flex flex-col bg-[#EDE9FE] rounded-lg p-3 ">
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
              <div className="flex flex-col bg-[#EDE9FE] rounded-lg p-3 mt-2 ">
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
