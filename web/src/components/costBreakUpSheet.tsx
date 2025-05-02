/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-constant-condition */
/* eslint-disable new-cap */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect, createRef, useRef } from 'react'
import {
  CheckCircleIcon,
  MinusCircleIcon,
  EyeIcon,
  SparklesIcon,
} from '@heroicons/react/solid'
import { LinearProgress } from '@mui/material'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import {
  streamUnitById,
  updateLeadCostSheetDetailsTo,
  updateUnitsCostSheetDetailsTo,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CostBreakUpPdf from 'src/util/costBreakUpPdf'
import { prettyDate } from 'src/util/dateConverter'
import PdfInvoiceGenerator from 'src/util/PdfInvoiceGenerator'
import BookingSummaryView from './A_CrmModule/A_Crm_sideFormBodies.tsx/bookingSummaryView'
import AddApplicantDetails from './AddApplicantDetails'
import AdditonalBookingDetails from './AdditionalBookingDetails'
import BlockingUnitForm from './BlockingUnitForm'
import AddPaymentDetailsForm from './FinanceModule/BookingPaymentForm'
import SiderForm from './SiderForm/SiderForm'
import UnitTransactionForm from './UnitBillTransactionForm'
import { Dialog } from '@headlessui/react'
import PdfSummaryGenerator from 'src/util/PdfSummaryGenerator'

import bookingpng from '../../../web/public/bookingpng.png'
import { ToastBar } from 'react-hot-toast'

const CostBreakUpSheet = ({
  title,
  leadDetailsObj1,
  projectDetails,
  selPhaseObj,
  project,
  selUnitDetails,
  possessAdditionalCS,
  possessionAdditionalCostCS,
  actionMode,
}) => {
  const { user } = useAuth()
  const { orgId } = user
  const section1Ref = useRef()
  const section2Ref = useRef()
  const section3Ref = useRef()
  const section4Ref = useRef()

  const { enqueueSnackbar } = useSnackbar()
  const ref = createRef()
  const [fetchedUsersList, setfetchedUsersList] = useState([])
  const [costSheetA, setCostSheetA] = useState([])
  const [usersList, setusersList] = useState([])
  const [projectList, setprojectList] = useState([])
  const [initialValuesA, setInitialValuesA] = useState({})
  const [newSqftPrice, setNewSqftPrice] = useState(0)
  const [onStep, setOnStep] = useState('costsheet')
  const [stepIndx, setStepIndx] = useState(1)
  const [soldPrice, setSoldPrice] = useState(0)
  const [csMode, setCsMode] = useState('plot_cs')
  const [showGstCol, setShowGstCol] = useState(true)
  const [myBookingPayload, setMyBookingPayload] = useState([])
  const [newPlotCostSheetA, setNewPlotCostSheetA] = useState([])
  const [newConstCostSheetA, setNewConstCostSheetA] = useState([])
  const [newPlotCsObj, setNewPlotCsObj] = useState([])

  const [newPlotPS, setNewPlotPS] = useState([])
  const [newConstructCsObj, setNewConstructCsObj] = useState([])
  const [newConstructCostSheetA, setNewConstructCostSheetA] = useState([])
  const [newConstructPS, setNewConstructPS] = useState([])
  const [newAdditonalChargesObj, setNewAdditonalChargesObj] = useState([])
  const [newAdditonalConstChargesObj, setNewAdditonalConstChargesObj] =
    useState([])
  const [newPossessAdditionalCostCS, setNewPossessAdditionalCostCS] = useState(
    []
  )

  const [StatusListA, setStatusListA] = useState([])
  const [reviewLinks, setReviewLinks] = useState([])
  const [leadPayload, setLeadPayload] = useState({})

  const [netTotal, setNetTotal] = useState(0)
  const [partATotal, setPartATotal] = useState(0)
  const [partBTotal, setPartBTotal] = useState(0)
  const [partCTotal, setPartCTotal] = useState(0)
  const [partDTotal, setPartDTotal] = useState(0)

  const [customerInfo, setCustomerInfo] = useState([])
  const [additionalInfo, setAdditonalInfo] = useState({})
  const [costSheet, setCostSheet] = useState({})
  const [paymentSchedule, setPaymentSchedule] = useState({})
  const [streamUnitDetails, setStreamUnitDetails] = useState({})

  const pdfExportComponent = useRef(null)
  const pdfExportComponentConstruct = useRef(null)

  useEffect(() => {
    streamUnitDataFun()
  }, [])
  useEffect(() => {
    streamUnitDataFun()
  }, [selUnitDetails])

  const streamUnitDataFun = () => {
    if (selUnitDetails?.id) {
      const { id } = selUnitDetails
      console.log('hello', selUnitDetails)
      const z = streamUnitById(
        orgId,
        (querySnapshot) => {
          const SnapData = querySnapshot.data()
          SnapData.id = id
          SnapData.uid = id
          console.log('hello stream setup is ==>', SnapData)
          setStreamUnitDetails(SnapData)
        },
        { uid: id },
        () => {
          console.log('error')
        }
      )
    }
  }
  useEffect(() => {
    if (onStep === 'customerDetails') {
      setStepIndx(1)
    }
    if (onStep === 'additonalInfo') {
      setStepIndx(2)
    }

    if (onStep === 'costsheet') {
      setStepIndx(3)
    }

    if (onStep === 'payment_schedule') {
      setStepIndx(4)
    }
    if (onStep === 'booking_summary') {
      setStepIndx(5)
    }
    if (onStep === 'booksheet') {
      setStepIndx(6)
    }
    if (onStep === 'blocksheet') {
      setStepIndx(6)
    }
  }, [onStep])
  useEffect(() => {
    console.log('payload data is ', leadPayload)
  }, [leadPayload])

  useEffect(() => {
    console.log('customer info', customerInfo)
    const x = {}
    customerInfo.map((item, index) => {
      console.log('item', item)

      if (index === 0) {
        x.customerDetailsObj = item
      }
      if (index === 1) {
        x.secondaryCustomerDetailsObj = item
      }
      if (index === 2) {
        x.thirdCustomerDetailsObj = item
      }
      if (index === 3) {
        x.fourthCustomerDetailsObj = item
      }
    })
    x.applicantCount = customerInfo.length
    setMyBookingPayload({ ...myBookingPayload, ...x })
  }, [customerInfo])

  useEffect(() => {
    console.log('customer info', myBookingPayload)
  }, [myBookingPayload])

  useEffect(() => {
    console.log('new customer object x', title, leadDetailsObj1)
    if (leadDetailsObj1) {
      console.log('it exists')

      setLeadPayload(leadDetailsObj1)
    } else {
      leadDetailsObj1 = {}
    }
  }, [leadDetailsObj1])

  useEffect(() => {
    console.log('new cost sheet value is ', newPlotCsObj, newPlotCostSheetA)
  }, [newPlotCsObj, newPlotCostSheetA])
  useEffect(() => {
    if (actionMode === 'costSheetMode') {
      setStatusListA([
        {
          label: 'Cost sheet',
          value: 'costsheet',
          logo: 'RefreshIcon',
          color: ' bg-violet-500',
        },
      ])
      setOnStep('costsheet')
    } else if (actionMode === 'unitBlockMode') {
      setStatusListA([
        {
          label: 'Customer info',
          value: 'customerDetails',
          logo: 'FireIcon',
          color: ' bg-violet-500',
        },
        {
          label: 'Additonal info',
          value: 'additonalInfo',
          logo: 'FireIcon',
          color: ' bg-violet-500',
        },
        {
          label: 'Cost sheet',
          value: 'costsheet',
          logo: 'RefreshIcon',
          color: ' bg-violet-500',
        },

        {
          label: 'Payment schedule',
          value: 'payment_schedule',
          logo: 'FireIcon',
          color: ' bg-violet-500',
        },
        {
          label: 'Booking summary',
          value: 'booking_summary',
          logo: 'FireIcon',
          color: ' bg-violet-500',
        },
        {
          label: 'Confirm Blocking',
          value: 'blocksheet',
          logo: 'FireIcon',
          color: ' bg-violet-500',
        },
      ])
      setReviewLinks([
        {
          headerTitle: 'Section 1',
          headerRef: section1Ref,
          headerID: 'section1',
        },
        {
          headerTitle: 'Section 2',
          headerRef: section2Ref,
          headerID: 'section2',
        },
        {
          headerTitle: 'Section 3',
          headerRef: section3Ref,
          headerID: 'section3',
        },
        {
          headerTitle: 'Section 4',
          headerRef: section4Ref,
          headerID: 'section4',
        },
      ])
      setOnStep('customerDetails')
    } else if (actionMode === 'unitBookingMode') {
      setStatusListA([
        {
          label: 'Customer Info',
          value: 'customerDetails',
          logo: 'FireIcon',
          color: ' bg-violet-500',
          text: 'Applicant details',
        },
        {
          label: 'Additional Info',
          value: 'additonalInfo',
          logo: 'FireIcon',
          color: ' bg-violet-500',
          text: 'Source, Buy Purpose...',
        },
        {
          label: 'Cost Sheet',
          value: 'costsheet',
          logo: 'RefreshIcon',
          color: ' bg-violet-500',
          text: 'Rate pre sqft, gst..',
        },

        {
          label: 'Payment Schedule',
          value: 'payment_schedule',
          logo: 'FireIcon',
          color: ' bg-violet-500',
          text: 'Dates, start, end ...',
        },
        {
          label: 'Preview',
          value: 'booking_summary',
          logo: 'FireIcon',
          color: ' bg-violet-500',
          text: '',
        },
        {
          label: 'Book Unit',
          value: 'booksheet',
          logo: 'FireIcon',
          color: ' bg-violet-500',
        },
      ])
      setReviewLinks([
        {
          headerTitle: 'Section 1',
          headerRef: section1Ref,
          headerID: 'section1',
        },
        {
          headerTitle: 'Section 2',
          headerRef: section2Ref,
          headerID: 'section2',
        },
        {
          headerTitle: 'Section 3',
          headerRef: section3Ref,
          headerID: 'section3',
        },
        {
          headerTitle: 'Section 4',
          headerRef: section4Ref,
          headerID: 'section4',
        },
      ])
      setOnStep('customerDetails')
    }
  }, [actionMode])

  useEffect(() => {
    console.log('macho is ', projectDetails)
    const { projectType } = projectDetails
    if (projectType?.name === 'Plots') {
      setCsMode('plot_cs')
    } else {
      setCsMode('both')
    }
  }, [projectDetails])

  useEffect(() => {
    console.log('phase details are ', selPhaseObj)
    const { additonalChargesObj } = selPhaseObj
    console.log('unit details', selUnitDetails)
    const { uid } = selUnitDetails
    const y = leadDetailsObj1[`${uid}_cs`]?.newSqftPrice || ''

    const x = [
      {
        myId: '1',
        units: {
          value: 'fixedcost',
          label: 'Fixed cost',
        },
        component: {
          value: 'unit_cost_charges',
          label: 'Unit Cost',
        },
        charges: Number.isFinite(y)
          ? selUnitDetails?.super_built_up_area * y
          : selUnitDetails?.super_built_up_area * selUnitDetails?.rate_per_sqft,
        // charges: y,
        gst: {
          label: '0',
          value: '0',
        },
      },
    ]
    // const x = costSheetA
    let merged = []
    try {
      if (leadDetailsObj1 && uid) {
        if (leadDetailsObj1?.[`${uid}_cs`]?.['costSheetA']) {
          const removeFulCostFieldA = leadDetailsObj1[`${uid}_cs`][
            'costSheetA'
          ].filter((dat) => dat?.component?.value != 'unit_cost_charges')
          merged = [...x, ...removeFulCostFieldA]
          console.log('pending here todo')
        } else {
          merged = [...x, ...additonalChargesObj]
        }
      }
    } catch (error) {
      console.log('error at feching the leadDetails Obj')
      // merged = [...x, ...additonalChargesObj]
    }

    const initformValues = {}
    merged.map((d) => {
      const x = d['component']['value']
      console.log('initial values ', x, d?.charges, d)
      initformValues[`${x}`] = d?.charges
    })
    console.log('initial values ', initformValues)
    setInitialValuesA(initformValues)

    setCostSheetA(x)
    console.log('phase details are ', merged, costSheetA)
  }, [selPhaseObj, leadDetailsObj1])

  const [loading, setLoading] = useState(false)
  const [isImportLeadsOpen, setisImportLeadsOpen] = useState(false)
  const [isMover, setIsMover] = useState(false)
  const [showUnitDetails, setShowUnitDetials] = useState(false)

  const initialState = initialValuesA
  const validate = Yup.object({})
  const moveStep = (stepper) => {
    console.log('customerInf i s', customerInfo)
    setOnStep(stepper)
  }

  const onSubmit = async (data, resetForm) => {
    console.log(
      'customer sheet form',
      data,
      Number(newSqftPrice),
      costSheetA,
      selUnitDetails
    )

    const { uid } = selUnitDetails
    const { id } = leadDetailsObj1

    const newCostSheetA = costSheetA.map((dat) => {
      dat.charges = data[dat?.component?.value]
      return dat
    })
    console.log('${uid}', newCostSheetA, uid)

    const xData = {}
    if (uid) {
      xData[`${uid}${'_cs'}`] = {
        oldUnitDetailsObj: selUnitDetails,
        newSqftPrice: Number(newSqftPrice),
        soldPrice: Number(soldPrice),
        costSheetA: costSheetA,
      }
    }
    setCostSheet(newCostSheetA)
    console.log('gen costSheetA', newCostSheetA)
    if (leadDetailsObj1?.id) {
      updateLeadCostSheetDetailsTo(
        orgId,
        id,
        xData,
        'nitheshreddy.email@gmail.com',
        // enqueueSnackbar,
        ToastBar,
        resetForm
      )
    } else {
      updateUnitsCostSheetDetailsTo(
        orgId,
        selUnitDetails?.uid,
        xData,
        user?.email,
        // enqueueSnackbar,
        ToastBar,
        resetForm
      )
    }

    if (isMover) {
      setOnStep('payment_schedule')
      if (onStep === 'payment_schedule') {
        setOnStep('booking_summary')
      }
    }
  }

  const setStatusFun = async (index, newStatus) => {
    if (newStatus === 'booksheet') {
      if (streamUnitDetails?.status == 'available') {
        if (
          streamUnitDetails.customerDetailsObj &&
          streamUnitDetails.customerDetailsObj?.customerName1 != ''
        ) {
          moveStep(newStatus)
        } else {
          enqueueSnackbar('Please fill customer details', {
            variant: 'error',
          })
        }
      } else {
        enqueueSnackbar('Unit already booked', {
          variant: 'error',
        })
      }
      console.log('confirm booking')
    } else {
      moveStep(newStatus)
    }
  }
  return (
    <>
      <section className="  bg-black">
        <div className="max-w-5xl mx-auto py-  bg-white">
          <article className="overflow-hidden">
            <div className=" rounded-b-md ">
              <div className="px-3 pt-2 z-10 flex items-center justify-between ">
                <Dialog.Title className=" font-semibold text-xl mr-auto  text-[#053219] w-full">
                  <div className="flex flex-row   justify-between mb-1">
                    <section className="flex flex-row">
                      <div className="bg-violet-100  items-center rounded-2xl shadow-xs flex flex-col px-2 py-1">
                        <div className="font-semibold text-[#053219]  text-[22px]  mb-[1] tracking-wide">
                          {streamUnitDetails.unit_no}
                        </div>
                        <span
                          className={`items-center h-6   text-xs font-semibold text-gray-500  rounded-full
                      `}
                        >
                          Unit No
                        </span>
                      </div>
                      <div className="flex flex-col ml-2 item-right">
                        <span
                          className={`items-center h-1 mt-[10px] mb-2  text-xs font-semibold text-green-600
                      `}
                        >
                          {streamUnitDetails?.status?.toUpperCase()}
                        </span>
                        <div className="font text-[12px] text-gray-500 tracking-wide overflow-ellipsis overflow-hidden ">
                          {projectDetails?.projectName}
                        </div>
                      </div>
                    </section>

                    {/* 2 */}
                    <div className=" flex flex-row mt-2">
                      <span
                        className={`items-center cursor-pointer h-6 px-3 py-1  mt-1 text-xs font-semibold text-blue-600  mr-2 `}
                        onClick={() => {
                          setShowUnitDetials(!showUnitDetails)
                        }}
                      >
                        {showUnitDetails
                          ? 'Hide unit details'
                          : 'View unit details'}
                      </span>

                      {selUnitDetails?.unitDetail?.status === 'available' && (
                        <div className=" flex flex-col mt-1"></div>
                      )}
                    </div>
                  </div>
                </Dialog.Title>
              </div>
              {showUnitDetails && (
                <div className="py-3  mx-4 grid grid-cols-3 mb-2">
                  <section className="flex flex-col bg-[#F6F7FF] p-3 border border-[#e5e7f8] rounded-md">
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-700 tracking-wide">
                        Unit No
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {streamUnitDetails?.unit_no}
                      </div>
                    </section>
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-500  tracking-wide">
                        Size
                        <span className="text-[10px] text-black-500 ml-1">
                          (sqft)
                        </span>
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {/* {streamUnitDetails?.builtup_area?.toLocaleString(
                              'en-IN'
                            )|| streamUnitDetails?.area?.toLocaleString(
                              'en-IN'
                            ) } */}
                        {streamUnitDetails?.area?.toLocaleString('en-IN')}
                      </div>
                    </section>
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-500  tracking-wide">
                        Facing
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {streamUnitDetails?.facing}
                      </div>
                    </section>
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-500  tracking-wide">
                        BUA
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {/* {streamUnitDetails?.builtup_area?.toLocaleString(
                              'en-IN'
                            )|| streamUnitDetails?.area?.toLocaleString(
                              'en-IN'
                            ) } */}
                        {streamUnitDetails?.builtup_area?.toLocaleString(
                          'en-IN'
                        ) ||
                          streamUnitDetails?.construct_area?.toLocaleString(
                            'en-IN'
                          )}
                      </div>
                    </section>
                  </section>
                  <section className="flex flex-col mx-4 bg-[#F6F7FF] p-3 border border-[#e5e7f8] rounded-md ">
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-700 tracking-wide">
                        East
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {streamUnitDetails?.east_d?.toLocaleString('en-IN')}
                      </div>
                    </section>
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-500  tracking-wide">
                        West
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {streamUnitDetails?.west_d?.toLocaleString('en-IN')}
                      </div>
                    </section>
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-500  tracking-wide">
                        South
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {streamUnitDetails?.south_d?.toLocaleString('en-IN')}
                      </div>
                    </section>
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-500  tracking-wide">
                        North
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {streamUnitDetails?.north_d?.toLocaleString('en-IN')}
                      </div>
                    </section>
                  </section>

                  <section className="flex flex-col bg-[#F6F7FF] p-3 border border-[#e5e7f8] rounded-md ">
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-700 tracking-wide">
                        Release Status
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {streamUnitDetails?.release_status}
                      </div>
                    </section>
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-500  tracking-wide">
                        Survey No
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {streamUnitDetails?.survey_no}
                      </div>
                    </section>
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-500  tracking-wide">
                        Type
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {streamUnitDetails?.size}
                      </div>
                    </section>
                    <section className="flex flow-row justify-between mb-1">
                      <div className="font-md text-xs text-gray-500  tracking-wide">
                        KathaId
                      </div>
                      <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                        {streamUnitDetails?.kathaId}
                      </div>
                    </section>
                  </section>
                </div>
              )}
              <section className="flex flex-row-reverse">
                {['unitBookingMode', 'unitBlockMode'].includes(actionMode) && (
                  <div className="flex flex-col   w-[350px]  h-screen">
                    {/* <img className='rounded-[0px] h-[100px]' src="https://cdn.shopify.com/shopifycloud/shopify/assets/admin/home/onboarding/guides/pg_SetupGuide-56362e0c1a71e80bd572f85c30f0e202203a42a2e79ed40e0ea3906cc0aedce8.png"></img> */}

                    <section className="bg-white  pt-4 mx-2 px-2 ">
                      <div className="mt-1">
                        <div className="flex flex-row align-middle justify-between  mb-1">
                          <h6 className="font-medium text-sm">
                            {'Unit Booking'}
                          </h6>
                          <span className="font-bodyLato text-[12px] text-[#94A4C4] ml-1 mt-[1px]">
                            Preview
                          </span>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          color="warning"
                          value={stepIndx * 16.666}
                          sx={{
                            backgroundColor: '#e5eaf2',
                            borderRadius: '6px',
                            height: '7px',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#8B5CF6',
                            },
                          }}
                          style={{
                            backgroundColor: '#E5EAF2',
                            borderRadius: '6px',
                            height: '7px',
                          }}
                        />
                        <span className="font-bodyLato text-[12px] text-[#94A4C4] ml-1 mt-[1px]">
                          {stepIndx} of {StatusListA?.length} completed!
                        </span>
                      </div>

                      <section className="flex flex-col mt-4">
                        {StatusListA?.map((statusFlowObj, i) => {
                          return (
                            <section
                              key={i}
                              className={`flex flex-row mt-2 cursor-pointer bg-[#F3F3F3] p-2 py-3 rounded-[12px] font-medium border ${
                                onStep != statusFlowObj.value
                                  ? ' border-white'
                                  : 'border-violet-300'
                              }`}
                              onClick={() =>
                                setStatusFun(i, statusFlowObj.value)
                              }
                            >
                              <span className=" flex items-center justify-center w-7 h-7 bg-[#DDD6FE] rounded-full  mt-[px] ">
                                <span className="text-[11px] font-bold">
                                  {i == 4 ? (
                                    <EyeIcon className=" w-3 h-3  text-gray-500" />
                                  ) : (
                                    i + 1
                                  )}
                                </span>
                              </span>

                              <div className="ml-2 w-full ">
                                <span className="text-[12px]  font-bold    -[2px] rounded-lg flex flex-row text-[#000] justify-between ">
                                  {statusFlowObj.label}
                                  {onStep != statusFlowObj.value ? (
                                    i == 5 ? (
                                      <SparklesIcon className=" w-4 h-4 mt-[2px] ml-2 text-gray-400" />
                                    ) : (
                                      <MinusCircleIcon className=" w-3 h-3 mt-[2px] ml-2 text-gray-400" />
                                    )
                                  ) : (
                                    <CheckCircleIcon className=" w-3 h-3 mt-[2px] ml-2 text-green-500" />
                                  )}
                                </span>
                                <p className=" text-[9px]">
                                  {statusFlowObj?.text}
                                  {i == 5 &&
                                    `${streamUnitDetails.customerDetailsObj?.customerName1}`}
                                </p>
                              </div>
                            </section>
                          )
                        })}
                      </section>

                      {/* <section className='h-full mt-4"'>
                     <img className='rounded-[0px] w-full h-full  ' src={bookingpng}></img>
                     </section> */}

                      {/* <ScrollHighlightNabbar navHeader={reviewLinks} /> */}
                    </section>
                  </div>
                )}

                <div className="w-full ">
                  {['costsheet', 'allsheets', 'payment_schedule'].includes(
                    onStep
                  ) && (
                    <div className="">
                      <div className="flex flex-col rounded-[12px]  border mx-0  ">
                        <div className="">
                          <Formik
                            enableReinitialize={true}
                            initialValues={initialState}
                            validationSchema={validate}
                            onSubmit={(values, { resetForm }) => {
                              console.log('i was clicked', values)
                              onSubmit(values, resetForm)
                            }}
                          >
                            {(formik) => (
                              <Form ref={ref} className="">
                                <section
                                  className="bg-[#fff]  rounded-[20px] border m-2"
                                  style={{
                                    boxShadow: '0 1px 12px #f2f2f2',
                                  }}
                                >
                                  {csMode === 'both' && (
                                    <CostBreakUpPdf
                                      formik={formik}
                                      projectDetails={projectDetails}
                                      csMode={csMode}
                                      setCostSheet={setCostSheet}
                                      costSheet={costSheet}
                                      myBookingPayload={myBookingPayload}
                                      setMyBookingPayload={setMyBookingPayload}
                                      pdfExportComponent={pdfExportComponent}
                                      selPhaseObj={selPhaseObj}
                                      leadDetailsObj1={leadDetailsObj1}
                                      selUnitDetails={selUnitDetails}
                                      setNewPlotCsObj={setNewPlotCsObj}
                                      newPlotCsObj={newPlotCsObj}
                                      costSheetA={newPlotCostSheetA}
                                      constructCostSheetA={newConstCostSheetA}
                                      setConstructCostSheetA={
                                        setNewConstCostSheetA
                                      }
                                      newAdditonalConstChargesObj={
                                        newAdditonalConstChargesObj
                                      }
                                      setAddiChargesObj={
                                        setNewAdditonalChargesObj
                                      }
                                      setNewAdditonalConstChargesObj={
                                        setNewAdditonalConstChargesObj
                                      }
                                      setCostSheetA={setNewPlotCostSheetA}
                                      setNewPS={setNewPlotPS}
                                      setNewConstructPS={setNewConstructPS}
                                      newPlotPS={newPlotPS}
                                      showGstCol={showGstCol}
                                      netTotal={netTotal}
                                      setNetTotal={setNetTotal}
                                      partATotal={partATotal}
                                      partBTotal={partBTotal}
                                      partCTotal={partCTotal}
                                      partDTotal={partDTotal}
                                      setPartATotal={setPartATotal}
                                      setPartBTotal={setPartBTotal}
                                      setPartCTotal={setPartCTotal}
                                      setPartDTotal={setPartDTotal}
                                      showOnly={onStep}
                                    />
                                  )}
                                </section>

                                <div className="flex z-10 flex-row justify-between items-center pr-6 bg-white shadow-lg absolute bottom-0 w-full py-3">
                                  <div className="inline-block ml-8 ">
                                    <PdfInvoiceGenerator
                                      user={user}
                                      selUnitDetails={selUnitDetails}
                                      streamUnitDetails={streamUnitDetails}
                                      myBookingPayload={myBookingPayload}
                                      myObj={newPlotCostSheetA}
                                      newPlotPS={newPlotPS}
                                      myAdditionalCharges={
                                        newAdditonalChargesObj
                                      }
                                      netTotal={netTotal}
                                      setNetTotal={setNetTotal}
                                      partATotal={partATotal}
                                      partBTotal={partBTotal}
                                      setPartATotal={setPartATotal}
                                      project={project}
                                      setPartBTotal={setPartBTotal}
                                      projectDetails={projectDetails}
                                      leadDetailsObj1={leadDetailsObj1}
                                      selPhaseObj={selPhaseObj}
                                      possessAdditionalCS={possessAdditionalCS}
                                      possessionAdditionalCostCS={
                                        possessionAdditionalCostCS
                                      }
                                    />
                                  </div>
                                  <div className="mt-2 text-right md:space-x-3 md:block flex flex-row-reverse justify-between mb-3">
                                    <section className="flex gap-2">
                                      <button
                                        className="mb-2 mr-0 md:mb-0  hover:scale-110 focus:outline-none hover:bg-[#5671fc] bg-gradient-to-r from-violet-600 to-indigo-600
text-black

 duration-200 ease-in-out
transition
 px-5 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-green-500
 bg-cyan-600 px-5 py-[6px] text-sm shadow-sm font-medium mr-2 tracking-wider text-white  rounded-md hover:shadow-lg "
                                        type="submit"
                                        disabled={loading}
                                        onClick={() => {
                                          setIsMover(false)
                                        }}
                                      >
                                        Save
                                      </button>
                                      {[
                                        'unitBookingMode',
                                        'unitBlockMode',
                                      ].includes(actionMode) && (
                                        <button
                                          className="mb-2 mr-0 md:mb-0  hover:scale-110 focus:outline-none              hover:bg-[#5671fc]
bg-gradient-to-r from-violet-600 to-indigo-600
text-black duration-200 ease-in-out transition
 px-5 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-green-500
 bg-cyan-600 px-5 py-[6px] text-sm shadow-sm font-medium mr-3 tracking-wider text-white  rounded-md hover:shadow-lg
                                   "
                                          type="submit"
                                          disabled={loading}
                                          onClick={() => {
                                            setIsMover(true)
                                          }}
                                        >
                                          <span>Save & Next</span>
                                        </button>
                                      )}
                                    </section>
                                  </div>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </div>
                  )}

                  {['customerDetails', 'allsheets'].includes(onStep) && (
                    <>
                      <AddApplicantDetails
                        currentMode={actionMode}
                        myBookingPayload={myBookingPayload}
                        setMyBookingPayload={setMyBookingPayload}
                        leadPayload={leadPayload}
                        setLeadPayload={setLeadPayload}
                        setCustomerInfo={setCustomerInfo}
                        customerInfo={customerInfo}
                        setOnStep={setOnStep}
                        source="Booking"
                        stepIndx={stepIndx}
                        StatusListA={StatusListA}
                        selUnitDetails={streamUnitDetails}
                        title="Booking Form"
                      />
                    </>
                  )}
                  {['additonalInfo'].includes(onStep) && (
                    <AdditonalBookingDetails
                      currentMode={actionMode}
                      selUnitDetails={streamUnitDetails}
                      additionalInfo={additionalInfo}
                      setAdditonalInfo={setAdditonalInfo}
                      leadDetailsObj2={leadPayload}
                      customerInfo={customerInfo}
                      setCustomerInfo={setCustomerInfo}
                      setOnStep={setOnStep}
                      source="Booking"
                      stepIndx={stepIndx}
                      setStepIndx={setStepIndx}
                      StatusListA={StatusListA}
                    />
                  )}
                  {['booksheet', 'allsheets'].includes(onStep) && (
                    <AddPaymentDetailsForm
                      title={'undefined'}
                      dialogOpen={undefined}
                      myBookingPayload={myBookingPayload}
                      setMyBookingPayload={setMyBookingPayload}
                      customerInfo={customerInfo}
                      additionalInfo={additionalInfo}
                      costSheet={costSheet}
                      phase={selPhaseObj}
                      leadDetailsObj2={leadPayload}
                      selUnitDetails={streamUnitDetails}
                      newPlotCsObj={newPlotCsObj}
                      newPlotCostSheetA={newPlotCostSheetA}
                      newConstructCsObj={newConstructCsObj}
                      newConstructCostSheetA={newConstCostSheetA}
                      newAdditonalChargesObj={newAdditonalChargesObj}
                      newConstructPS={newConstructPS}
                      newPlotPS={newPlotPS}
                      projectDetails={projectDetails}
                      stepIndx={stepIndx}
                      StatusListA={StatusListA}
                    />
                  )}

                  {['booking_summary'].includes(onStep) && (
                    <BookingSummaryView
                      projectDetails={projectDetails}
                      csMode={csMode}
                      myBookingPayload={myBookingPayload}
                      setMyBookingPayload={setMyBookingPayload}
                      pdfExportComponent={pdfExportComponent}
                      costSheet={costSheet}
                      selPhaseObj={selPhaseObj}
                      leadDetailsObj1={leadDetailsObj1}
                      customerInfo={streamUnitDetails}
                      selUnitDetails={streamUnitDetails}
                      setNewPlotCsObj={setNewPlotCsObj}
                      newPlotCsObj={newPlotCsObj}
                      costSheetA={newPlotCostSheetA}
                      constructCostSheetA={newConstCostSheetA}
                      newAdditonalChargesObj={newAdditonalChargesObj}
                      newAdditonalConstChargesObj={newAdditonalConstChargesObj}
                      setNewAdditonalConstChargesObj={
                        setNewAdditonalConstChargesObj
                      }
                      setAddiChargesObj={setNewAdditonalChargesObj}
                      setCostSheetA={setNewPlotCostSheetA}
                      setNewPS={setNewPlotPS}
                      newPlotPS={newPlotPS}
                      newConstructPS={newConstructPS}
                      showGstCol={showGstCol}
                      netTotal={netTotal}
                      setNetTotal={setNetTotal}
                      partATotal={partATotal}
                      partBTotal={partBTotal}
                      partCTotal={partCTotal}
                      partDTotal={partDTotal}
                      setPartATotal={setPartATotal}
                      setPartBTotal={setPartBTotal}
                      setPartCTotal={setPartCTotal}
                      setPartDTotal={setPartDTotal}
                      showOnly={onStep}
                      section1Ref={section1Ref}
                      section2Ref={section2Ref}
                      section3Ref={section3Ref}
                      section4Ref={section4Ref}
                      stepIndx={stepIndx}
                      StatusListA={StatusListA}
                    />
                  )}

                  {['blocksheet'].includes(onStep) && (
                    <BlockingUnitForm
                      title="Blocking Form"
                      leadDetailsObj2={leadPayload}
                      selUnitDetails={streamUnitDetails}
                      stepIndx={stepIndx}
                      StatusListA={StatusListA}
                    />
                  )}
                  {['Detail View'].includes(onStep) && <UnitTransactionForm />}
                </div>
              </section>
            </div>
          </article>
        </div>
      </section>
      <SiderForm
        open={isImportLeadsOpen}
        setOpen={setisImportLeadsOpen}
        title="costSheetPreview"
        widthClass="max-w-4xl"
        csMode={csMode}
        projectDetails={projectDetails}
        pdfExportComponent={pdfExportComponent}
        selPhaseObj={selPhaseObj}
        headerContent={{}}
        leadDetailsObj={leadDetailsObj1}
        selUnitDetails={streamUnitDetails}
        newPlotCsObj={newPlotCsObj}
        costSheetA={costSheetA || newPlotCostSheetA || []}
        newPlotCostSheetA={costSheetA || newPlotCostSheetA || []}
      />
    </>
  )
}

export default CostBreakUpSheet

export function ScrollHighlightNabbar({ navHeader }) {
  const [activeIndex, setActiveIndex] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const index = nearestIndex(
        window.scrollY,
        navHeader,
        0,
        navHeader.length - 1
      )
      setActiveIndex(index)
    }
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="flex flex-col">
      {navHeader.map((header, index) => (
        <>
          <a
            key={index + header.headerID}
            className={`font-bodyLato text-sm font-normal px-2 py-[4px]   mt-2 mr-1 cursor-pointer rounded-full ${
              activeIndex === index ? 'bg-violet-500 text-white' : ''
            } `}
            href={`#${header.headerID}`}
          >
            <section className="flex flex-row">
              <span
                className={`w-4 h-4 mt-[1px] text-[9px] mr-1 flex justify-center items-center rounded-full  border ${
                  activeIndex === index ? 'bg-violet-500 text-white' : ''
                } `}
              >
                5.{index + 1}
              </span>
              <div>{header.headerTitle}</div>
            </section>
          </a>
        </>
      ))}
    </div>
  )
}

ScrollHighlightNabbar.propTypes = {
  navHeader: PropTypes.arrayOf(
    PropTypes.shape({
      headerID: PropTypes.string,
      headerRef: PropTypes.object.isRequired,
      headerTitle: PropTypes.string.isRequired,
    })
  ).isRequired,
}

/**
 * @param {number} currentPosition
 * @param {Array} sectionPositionArray
 * @param {number} startIndex
 * @param {number} endIndex
 * @return {number}
 */
const nearestIndex = (
  currentPosition,
  sectionPositionArray,
  startIndex,
  endIndex
) => {
  if (startIndex === endIndex) return startIndex
  else if (startIndex === endIndex - 1) {
    if (
      Math.abs(
        sectionPositionArray[startIndex].headerRef.current.offsetTop -
          currentPosition
      ) <
      Math.abs(
        sectionPositionArray[endIndex].headerRef.current.offsetTop -
          currentPosition
      )
    )
      return startIndex
    else return endIndex
  } else {
    const nextNearest = ~~((startIndex + endIndex) / 2)
    const a = Math.abs(
      sectionPositionArray[nextNearest].headerRef.current.offsetTop -
        currentPosition
    )
    const b = Math.abs(
      sectionPositionArray[nextNearest + 1].headerRef.current.offsetTop -
        currentPosition
    )
    if (a < b) {
      return nearestIndex(
        currentPosition,
        sectionPositionArray,
        startIndex,
        nextNearest
      )
    } else {
      return nearestIndex(
        currentPosition,
        sectionPositionArray,
        nextNearest,
        endIndex
      )
    }
  }
}

ScrollHighlightNabbar.propTypes = {
  navHeader: PropTypes.arrayOf(
    PropTypes.shape({
      headerID: PropTypes.string,
      headerRef: PropTypes.object.isRequired,
      headerTitle: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export const MyComponent = ({ data }) => {
  if (data && data?.customerDetailsObj) {
    const customerDetails = data?.customerDetailsObj

    const emptyValueCount = Object.values(customerDetails).filter(
      (value) => value != ''
    ).length

    return (
      <div>
        <p className="text-zinc-800 text-[12px] font-bold font-['Lato'] tracking-wide">
          {' '}
          {emptyValueCount} of 10 fields
        </p>
      </div>
    )
  }

  return null
}

export const PaymentScheduleStats = ({ newPlotPS }) => {
  if (newPlotPS?.length > 0) {
    let start = 'NA'
    let end = 'NA'
    if (newPlotPS[0]['schDate']) {
      start = prettyDate(newPlotPS[0]['schDate'])
    }
    if (newPlotPS[newPlotPS.length - 1]['schDate']) {
      end = prettyDate(newPlotPS[newPlotPS.length - 1]['schDate'])
    }
    return (
      <div>
        <p className="text-zinc-800 text-[12px] font-bold font-['Lato'] tracking-wide">
          {' '}
          {start || 'NA'} to {end || 'NA'}
        </p>
      </div>
    )
  } else {
    return <p></p>
  }
}
