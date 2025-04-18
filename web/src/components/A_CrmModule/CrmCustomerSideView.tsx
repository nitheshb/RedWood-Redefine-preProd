/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment, useEffect, useState } from 'react'

import { Menu } from '@headlessui/react'
import { Listbox, Transition } from '@headlessui/react'
import { ArrowRightIcon } from '@heroicons/react/outline'
import CalendarIcon from '@heroicons/react/outline/CalendarIcon'
import {
  BadgeCheckIcon,
  DocumentIcon,
  EyeIcon,
  ViewBoardsIcon,
  ViewGridIcon,
  XIcon,
} from '@heroicons/react/solid'
import { CheckIcon, SelectorIcon, DownloadIcon } from '@heroicons/react/solid'
import ClockIcon from '@heroicons/react/solid/ClockIcon'
import PlusCircleIcon from '@heroicons/react/solid/PlusCircleIcon'
import { VerticalAlignBottom } from '@mui/icons-material'
import { DateTimePicker } from '@mui/lab'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import TimePicker from '@mui/lab/TimePicker'
import { Checkbox, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import DatePicker from 'react-datepicker'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

import {
  addLeadScheduler,
  addSchedulerLog,
  deleteSchLog,
  steamLeadActivityLog,
  steamLeadPhoneLog,
  steamLeadScheduleLog,
  steamUsersListByRole,
  updateLeadAssigTo,
  updateLeadStatus,
  updateSchLog,
  addLeadNotes,
  steamLeadNotes,
  createAttach,
  getCustomerDocs,
  updateLeadProject,
  getFinanceForUnit,
  getCrmUnitById1,
  captureWalletPayment,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { storage } from 'src/context/firebaseConfig'
import {
  getDifferenceInHours,
  getDifferenceInMinutes,
  prettyDate,
  prettyDateTime,
  timeConv,
} from 'src/util/dateConverter'
import { CustomSelect } from 'src/util/formFields/selectBoxField'

import SortComp from './sortComp'

import 'react-datepicker/dist/react-datepicker.css'
import { setHours, setMinutes } from 'date-fns'
import { Timestamp } from 'firebase/firestore'

import Loader from './Loader/Loader'
import AddBookingForm from './bookingForm'

import { useSnackbar } from 'notistack'

import SiderForm from '../SiderForm/SiderForm'

import CrmUnitSummary from './A_CrmUnitSummary'
import CrmPaymentSummary from './CrmPaymentSummary'

import AssigedToDropComp from '../assignedToDropComp'

import { USER_ROLES } from 'src/constants/userRoles'
import UnitFullSummary from './CrmUnitFullSummary'



// interface iToastInfo {
//   open: boolean
//   message: string
//   severity: AlertColor
// }
const people = [
  { name: 'Priority 1' },
  { name: 'Priority 2' },
  { name: 'Priority 3' },
  { name: 'Priority 4' },
]
const statuslist = [
  { label: 'Select the Status', value: '' },
  { label: 'New', value: 'new' },
  // { label: 'Follow Up', value: 'followup' },
  { label: 'Visit Fixed', value: 'visitfixed' },
  { label: 'Visit Done', value: 'visitdone' },
  { label: 'Negotiation', value: 'Negotiation' },
  // { label: 'RNR', value: 'rnr' },
  { label: 'Booked', value: 'booked' },
  { label: 'Not Interested', value: 'notinterested' },
  // { label: 'Dead', value: 'Dead' },
]

const attachTypes = [
  { label: 'Select Document', value: '' },
  { label: 'Bank Cheque', value: 'bank_cheque' },
  { label: 'Booking Form', value: 'booking_form' },
  { label: 'Customer Aadhar', value: 'customer_aadhar' },
  { label: 'Co-Applicant Aadhar', value: 'co-applicant_Aadhar' },
  { label: 'Cancellation Form', value: 'cancellation_form' },
  { label: 'Cost Sheet', value: 'cost_sheet' },
  { label: 'Estimation Sheet', value: 'estimation_sheet' },
  { label: 'Payment Screenshot (IMPS/RTGS/NEFT)', value: 'payment_screenshot' },
  { label: 'Payment Receipt', value: 'payment_receipt' },
  { label: 'Others', value: 'others' },

]

const notInterestOptions = [
  { label: 'Select Document', value: '' },
  { label: 'Budget Issue', value: 'budget_issue' },
  { label: 'Looking for Different Property', value: 'differeent_options' },

  { label: 'Others', value: 'others' },


]
export default function CustomerSideViewCRM({
  openUserProfile,

  selCustomerPayload,
}) {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const { orgId } = user

  const [selFeature, setFeature] = useState('summary')
  const [unitView, setUnitView] = useState(false)
  const [unitsOverviewA, setUnitsOverviewA] = useState([])
  const [isUnitDetailsOpen, setisUnitDetailsOpen] = useState(false)
  const [selUnitDetails, setSelUnitDetails] = useState({})
  const [transactionData, setTransactionData] = useState({})
  const [selSubMenu, setSelSubMenu] = useState('summary')
  const [selSubMenu1, setSelSubMenu1] = useState('summary')
  const [filterData, setFilterData] = useState([])



  const [openCapturePayment, setOpenCapturePayment] = useState(false)
  const [selProjectIs, setSelProjectIs] = useState({
    projectName: '',
    uid: '',
  })

  const d = new window.Date()

  const openPaymentFun = () => {
    setSelUnitDetails(selCustomerPayload)
    setOpenCapturePayment(true)
  }
  useEffect(() => {
    console.log('first', selCustomerPayload)
  }, [selCustomerPayload])
  useEffect(() => {
    console.log('first', selCustomerPayload)

 getUnitDetails()


  }, [selCustomerPayload])

  const getUnitDetails = async () => {
    const unitDetails = []
  const x =  await  Promise.all( selCustomerPayload.my_assets?.map(async (d) => {
    const unit = await getCrmUnitById1(orgId, d)
    console.log('unit is ', unit)
    const y = await unit;
    y.id = d
    return y
    }) || []  )
    setUnitsOverviewA(x)
  }
  useEffect(() => {
   console.log('value is ', unitsOverviewA)
  }, [unitsOverviewA])

  const viewTransaction = (docData, sideViewCategory, sideViewCategory1) => {
    console.log('check it ', docData, sideViewCategory, sideViewCategory1)
    setSelSubMenu(sideViewCategory)
    setSelSubMenu1(sideViewCategory1)
    setTransactionData(docData)
    setisUnitDetailsOpen(!isUnitDetailsOpen)
    setSelUnitDetails(docData)
  }
  const onSubmitFun = async (data, resetForm) => {
    console.log('selected value is ', data)

    const y = await capturePayment(data, resetForm)
    
  }

  const capturePayment = async (data, resetForm) => {
    

    const paymentCB = await captureWalletPayment(orgId,selCustomerPayload,data, user?.email, enqueueSnackbar)


  }
  return (
    <div
      className={`bg-white   h-screen    ${openUserProfile ? 'hidden' : ''} `}
    >
      <div className=" pb-[2px] px-3 mt-0 rounded-xs border-b bg-[#D9D8FF]">
        <div className="-mx-3 flex  sm:-mx-4 px-3">
          <div className="w-full  xl:w-4/12  ">

            <div className="flex flex-col justify-between">
              <p className="text-md font-bold tracking-tight uppercase font-body my-[2px]  ml-2">
                {selCustomerPayload?.Name}
                {selCustomerPayload?.projectName}
              </p>

              <p className="text-xs tracking-tight  font-body my-[2px] ml-2">
                No of Assets: {selCustomerPayload?.my_assets?.length}
              </p>
              <p className="text-xs tracking-tight  font-body my-[2px] ml-2">
                Projects: {selCustomerPayload?.projects?.length}
              </p>

              <div></div>
            </div>
          </div>
          <div className="w-full px-1  xl:w-8/12 mt-1 mb-1 bg-white  pl-3 pt-2 ">
            <div className="relative z-10 my-1 pb-2  rounded-md bg-white">
              <div className="grid grid-cols-2 gap-5">
                <section className="flex flex-col bg-[#F6F7FF] p-3 border border-[#e5e7f8] rounded-md">
                  <section className="flex flow-row justify-between mb-1">
                    <div className="font-md text-xs text-gray-700 tracking-wide">
                      Wallet
                    </div>
                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                      Rs {selCustomerPayload?.remaining_money}
                    </div>
                  </section>
                  <section className="flex flow-row justify-between mb-1">
                    <div className="font-md text-xs text-gray-500  tracking-wide">
                      Review
                    </div>
                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                      Rs {selCustomerPayload?.input_money}
                    </div>
                  </section>
                  <section className="flex flow-row justify-between mb-1">
                    <div className="font-md text-xs text-gray-500  tracking-wide">
                      Utilised
                    </div>
                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                      Rs {selCustomerPayload?.utilized_money}
                    </div>
                  </section>

                </section>

                <section>
                  <div>
                    <div className="text-center items-center mr-2 mt-3">

                      <div
                        className="text-center p-[10px] mt-5 bg-[#318896] text-white rounded-3xl items-center align-middle text-xs cursor-pointer hover:underline"
                        onClickCapture={() => {
                          openPaymentFun()
                        }}
                      >
                        Add To Wallet
                      </div>
                      <div className="text-center items-center mr-2 mt-3"></div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div
            className="relative flex flex-col  group"
          >
            <div
              className="absolute bottom-0 right-0 flex-col items-center hidden mb-6 group-hover:flex"
              style={{ zIndex: '9999' }}
            >
              <span
                className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                style={{
                  color: 'black',
                  background: '#e2c062',
                  maxWidth: '300px',
                }}
              >
                <div className="italic flex flex-col">
                  <div className="font-bodyLato">
                  </div>
                </div>
              </span>
              <div
                className="w-3 h-3  -mt-2 rotate-45 bg-black"
                style={{ background: '#e2c062', marginRight: '12px' }}
              ></div>
            </div>
            <span className="font-bodyLato text-[#867777] text-xs mt-2">

            </span>
          </div>
        </div>
      </div>
      {!unitView && (
        <div className="rounded-t bg-[#F1F5F9] mb-0 px-3 ">
          <>
            <div className="">
              <div className="">
  

                <div className=" border-gray-900  bg-[#F1F5F9] rounded-t-lg ">
                  <ul
                    className="flex   rounded-t-lg overflow-x-scroll"
                    id="myTab"
                    data-tabs-toggle="#myTabContent"
                    role="tablist"
                  >
                    {[
                      { lab: 'Summary', val: 'summary' },
                      { lab: 'Profile', val: 'Profile' },
                      { lab: 'Assets Information', val: 'unit_information' },
                      { lab: 'Timeline', val: 'timeline' },
                    ].map((d, i) => {
                      return (
                        <li
                          key={i}
                          className="mr-2 ml-2 text-sm font-bodyLato"
                          role="presentation"
                        >
                          <button
                            className={`inline-block py-3 mr-3 px-1 text-sm font-medium text-center text-black rounded-t-lg border-b-2  hover:text-black hover:border-gray-300   ${
                              selFeature === d.val
                                ? 'border-black text-black'
                                : 'border-transparent'
                            }`}
                            type="button"
                            role="tab"
                            onClick={() => setFeature(d.val)}
                          >
                            {`${d.lab} `}
            
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
   
              </div>
            </div>


            {selFeature === 'summary' && (
              <div className="py-8 px-8 flex flex-col">
                <span className='text-green-700 text-md font pb-3'>My Units</span>
                 {unitsOverviewA?.map((d, i) => (
                  <div key={i} className=" cursor-pointer items-left" onClick={() => viewTransaction(d, 'unit_information', 'unit_information')}>
                       <section className="flex-row w-full px-3  py-2 justify-between border border-gray-200 rounded-lg">
                                  <div className="flex flex-row">
                                    <section className="bg-violet-100  items-center rounded-2xl shadow-xs flex flex-col px-2 py-1">
                                      <div className="font-semibold text-[#053219]  text-[22px]  mb-[1] tracking-wide">
                                        {d?.unit_no}
                                      </div>
                                      <span
                                        className={`items-center h-6   text-xs font-semibold text-gray-500  rounded-full
                      `}
                                      >
                                        Unit No
                                      </span>
                                    </section>
                                    <div className="flex flex-col ml-2 item-right">
                                      <span
                                        className={`items-center h-1 mt-[6px] mb-2  text-xs font-semibold text-green-600
                      `}
                                      >
                                        {d?.customerDetailsObj?.customerName1 ||
                                          'NA'}
                                      </span>
                                      <div className="font text-[12px] text-gray-500 tracking-wide overflow-ellipsis overflow-hidden ">
                                        {d?.projName}
                                      </div>
                                      <section>
                                        <span className="  text-[10px] h-[20px]  text-[#005E36] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                          {d?.area?.toLocaleString(
                                            'en-IN'
                                          )}{' '}
                                          sqft
                                        </span>

                                        <span className="  text-[10px] h-[20px] text-[#005E36] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                          {d?.facing}
                                        </span>
                                        <span className="  text-[10px] h-[20px] text-[#005E36] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                          {d?.status}
                                        </span>
                                      </section>
                                      <section>
                                        <span className="  text-[10px] h-[20px] text-[#005E36] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                          Total Stage Balance: {d?.T_elgible_balance?.toLocaleString('en-IN')}
                                        </span>
                                        <span className="  text-[10px] h-[20px] text-[#005E36] font-bodyLato font-[600] mt-[2px] border border-[#ECFDF5] px-[6px] py-[2px] rounded-xl mr-1 ">
                                        Total Balance: {d?.T_balance?.toLocaleString('en-IN')}
                                        </span>
                                      </section>
                                    </div>
                                  </div>
                                </section>
                  </div>
                ))}
              </div>
            )}

            {selFeature === 'tasks' && (
              <div className="py-8 px-8 flex flex-col items-center">
                <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                  <img
                    className="w-[200px] h-[200px] inline"
                    alt=""
                    src="/all-complete.svg"
                  />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
                  You are clean
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                  Sitback & Relax{' '}
                  <span className="text-blue-600">Add Task</span>
                </time>
              </div>
            )}

            {selFeature === 'timeline' && (
              <div className="py-8 px-8  border bg-[#F6F7FF]">
                {filterData?.length == 0 && (
                  <div className="py-8 px-8 flex flex-col items-center">
                    <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                      <img
                        className="w-[80px] h-[80px] inline"
                        alt=""
                        src="/templates.svg"
                      />
                    </div>
                    <h3 className="mb-1 text-xs font-semibold text-gray-900 ">
                      Timeline is Empty
                    </h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-gray-400 ">
                      This scenario is very rare to view
                    </time>
                  </div>
                )}
                <div className="font-md font-medium text-xs mb-4 text-gray-800">
                  Timelines
                </div>
                <ol className="relative border-l border-gray-200 ">
                  {filterData?.map((data, i) => (
                    <section key={i} className="">
                      <a
                        href="#"
                        className="block items-center p-3 sm:flex hover:bg-gray-100 "
                      >
                        {data?.type == 'status' && (
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white  ">
                            <svg
                              className="w-3 h-3 text-blue-600 \"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </span>
                        )}
                        {data?.type == 'ph' && (
                          <>
                            <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-green-200 rounded-full ring-8 ring-white ">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-blue-600 "
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                            </span>
                            <div className="text-gray-600  m-3">
                              <div className="text-base font-normal">
                                <span className="font-medium text-green-900 ">
                                  {'Rajiv'}
                                </span>{' '}
                                called{' '}
                                <span className="text-sm text-red-900 ">
                                  {Name}
                                </span>{' '}
                              </div>
                              <div className="text-sm font-normal">
                                {data?.txt}
                              </div>
                              <span className="inline-flex items-center text-xs font-normal text-gray-500 ">
                                <ClockIcon className="mr-1 w-3 h-3" />
                                {data?.type == 'ph'
                                  ? timeConv(
                                      Number(data?.time)
                                    ).toLocaleString()
                                  : timeConv(data?.T).toLocaleString()}
                                {'    '}
                                <span className="text-red-900 ml-4 mr-4">
                                  {Number(data?.duration)} sec
                                </span>
                                or
                                <span className="text-red-900 ml-4">
                                  {parseInt(data?.duration / 60)} min
                                </span>
                              </span>
                            </div>
                          </>
                        )}
                        {data?.type != 'ph' && (
                          <div className="text-gray-600  m-3">
                            <div className="text-base font-normal">
                              <span className="font-medium text-green-900 ">
                                {data?.type?.toUpperCase()}
                              </span>{' '}
                              set by{' '}
                              <span className="text-sm text-red-900 ">
                                {data?.by}
                              </span>{' '}
                            </div>
                            <div className="text-sm font-normal">
                              {data?.txt}
                            </div>
                            <span className="inline-flex items-center text-xs font-normal text-gray-500 ">


                              <ClockIcon className="mr-1 w-3 h-3" />
                              {data?.type == 'ph'
                                ? timeConv(Number(data?.time)).toLocaleString()
                                : timeConv(data?.T).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </a>
                    </section>
                  ))}
                </ol>
              </div>
            )}
          </>
        </div>
      )}

      {unitView && (
        <UnitFullSummary
        customerDetails={selCustomerPayload}
        selCustomerPayload={selCustomerPayload}
      />
      )}

      {selFeature === 'legal_info' && <></>}
      <SiderForm
        open={openCapturePayment}
        setOpen={setOpenCapturePayment}
        title={'addWallet'}
        unitsViewMode={false}
        widthClass="max-w-md"
        paymentCaptureFun={onSubmitFun}
        selUnitDetails={selCustomerPayload}
      />

      <SiderForm
              open={isUnitDetailsOpen}
              setOpen={setisUnitDetailsOpen}
              title={'unitDetails_crm_view'}
              customerDetails={selUnitDetails}
              setSelUnitDetails={setSelUnitDetails}
              widthClass="max-w-7xl"
              transactionData={transactionData}
              unitsViewMode={false}
              selCustomerPayload={selUnitDetails}
              selSubMenu={selSubMenu}
              selSubMenu2={selSubMenu1}
      />
    </div>
  )
}
