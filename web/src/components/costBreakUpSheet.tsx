/* eslint-disable no-constant-condition */
/* eslint-disable new-cap */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect, createRef, useRef } from 'react'

// import './ScrollHighlightNabbar.css'
import { Dialog } from '@headlessui/react'
import { RadioGroup } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { Checkbox } from '@mui/material'
import { Timestamp } from 'firebase/firestore'
import { Form, Formik, Field } from 'formik'
import jsPDF from 'jspdf'
import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
import NumberFormat from 'react-number-format'
import Select from 'react-select'
import * as Yup from 'yup'

import { Label, InputField, TextAreaField, FieldError } from '@redwoodjs/forms'
import { useRouterStateSetter } from '@redwoodjs/router/dist/router-context'

import { apartUnitChargesMock } from 'src/constants/projects'
import {
  getAllProjects,
  steamUsersListByRole,
  updateLeadCostSheetDetailsTo,
  updateUnitsCostSheetDetailsTo,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import {
  sendWhatAppMediaSms,
  sendWhatAppTextSms,
} from 'src/util/axiosWhatAppApi'
import CostBreakUpPdf from 'src/util/costBreakUpPdf'
import CostBreakUpPdfAll from 'src/util/costBreakUpPdf_all'
import CostBreakUpPdfConstruct from 'src/util/costBreakUpPdf_construct'
import { prettyDate } from 'src/util/dateConverter'
import { PhoneNoField } from 'src/util/formFields/phNoField'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { TextField } from 'src/util/formFields/TextField'
import { TextField2 } from 'src/util/formFields/TextField2'
import { TextFieldFlat } from 'src/util/formFields/TextFieldFlatType'
import PdfInvoiceGenerator from 'src/util/PdfInvoiceGenerator'

import BookingSummaryView from './A_CrmModule/A_Crm_sideFormBodies.tsx/bookingSummaryView'
import AddApplicantDetails from './AddApplicantDetails'
import AdditonalBookingDetails from './AdditionalBookingDetails'
import BlockingUnitForm from './BlockingUnitForm'
import AddPaymentDetailsForm from './FinanceModule/BookingPaymentForm'
import Loader from './Loader/Loader'
import PaymentScheduleSheet from './paymentScheduleSheet'
import SiderForm from './SiderForm/SiderForm'
import UnitTransactionForm from './UnitBillTransactionForm'

const CostBreakUpSheet = ({
  title,
  leadDetailsObj1,
  projectDetails,
  selPhaseObj,
  selUnitDetails,
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

  const [newPlotCostSheetA, setNewPlotCostSheetA] = useState([])
  const [newPlotCsObj, setNewPlotCsObj] = useState([])
  const [newPlotPS, setNewPlotPS] = useState([])
  const [newConstructCsObj, setNewConstructCsObj] = useState([])
  const [newConstructCostSheetA, setNewConstructCostSheetA] = useState([])
  const [newConstructPS, setNewConstructPS] = useState([])
  const [newAdditonalChargesObj, setNewAdditonalChargesObj] = useState([])
  const [StatusListA, setStatusListA] = useState([])
  const [reviewLinks, setReviewLinks] = useState([])
  const [leadPayload, setLeadPayload] = useState({})

  const [netTotal, setNetTotal] = useState(0)
  const [partATotal, setPartATotal] = useState(0)
  const [partBTotal, setPartBTotal] = useState(0)
  const [partCTotal, setPartCTotal] = useState(0)

  const [customerInfo, setCustomerInfo] = useState({})
  const [additionalInfo, setAdditonalInfo] = useState({})
  const [costSheet, setCostSheet] = useState({})
  const [paymentSchedule, setPaymentSchedule] = useState({})

  const pdfExportComponent = useRef(null)
  const pdfExportComponentConstruct = useRef(null)

  useEffect(() => {
    console.log('payload data is ', leadPayload)
  }, [leadPayload])

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
    }
    //  else if (actionMode === 'unitBlockMode') {
    //   setStatusListA([
    //     {
    //       label: 'Cost sheet',
    //       value: 'costsheet',
    //       logo: 'RefreshIcon',
    //       color: ' bg-violet-500',
    //     },
    //     {
    //       label: 'Customer details',
    //       value: 'customerDetails',
    //       logo: 'FireIcon',
    //       color: ' bg-violet-500',
    //     },
    //     {
    //       label: 'Block Unit',
    //       value: 'blocksheet',
    //       logo: 'DuplicateInactiveIcon',
    //       color: ' bg-violet-500',
    //     },
    //   ])
    //   setOnStep('blocksheet')
    // }
    else if (actionMode === 'unitBlockMode') {
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
          label: 'Confirm booking',
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
    if (projectType.name === 'Plots') {
      setCsMode('plot_cs')
    } else {
      setCsMode('both')
    }
    // projectDetails
  }, [])

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

  // useEffect(() => {
  //   console.log('value os costsheet', costSheetA)
  // }, [costSheetA])

  const [loading, setLoading] = useState(false)
  const [isImportLeadsOpen, setisImportLeadsOpen] = useState(false)

  const initialState = initialValuesA
  const validate = Yup.object({
    // blockReason: Yup.number()
    //   .max(15, 'Must be 15 characters or less')
    //   .required('Name is Required'),
  })
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
    // const x = {
    //   myId: '2',
    //   units: {
    //     value: 'fixedcost',
    //     label: 'Fixed cost',
    //   },
    //   component: {
    //     value: 'ratePerSqft',
    //     label: 'sqftCost',
    //   },
    //   charges: Number(newSqftPrice),
    //   gst: {
    //     label: '0',
    //     value: '0',
    //   },
    // }

    const newCostSheetA = costSheetA.map((dat) => {
      dat.charges = data[dat?.component?.value]
      return dat
    })
    console.log('${uid}', newCostSheetA, uid)
    // newCostSheetA.push(x)
    // i need unit_uID & unit details
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
        enqueueSnackbar,
        resetForm
      )
    } else {
      updateUnitsCostSheetDetailsTo(
        orgId,
        selUnitDetails?.uid,
        xData,
        'nitheshreddy.email@gmail.com',
        enqueueSnackbar,
        resetForm
      )
    }

    setOnStep('payment_schedule')
  }

  const setStatusFun = async (index, newStatus) => {
    moveStep(newStatus)
    setStepIndx(index +1)
  }
  return (
    <>
      <section className="  bg-black font-['Inter']">
        <div className="max-w-5xl mx-auto py-  bg-white">
          <article className="overflow-hidden">
            <div className=" rounded-b-md">
              <section className="flex flex-row-reverse">
                {['unitBookingMode', 'unitBlockMode'].includes(actionMode) && (
                  <div className="flex flex-col  w-[250px] pt-4 px-2 bg-white h-screen">
                    {stepIndx} of {StatusListA?.length} steps
                    {StatusListA.map((statusFlowObj, i) => (
                      <span
                        key={i}
                        className={`font-bodyLato text-sm font-normal px-2 py-4   mt-2 mr-1 cursor-pointer rounded-lg ${
                          onStep === statusFlowObj.value
                            ? 'bg-violet-500 text-white'
                            : 'bg-violet-100'
                        } `}
                        onClick={() => setStatusFun(i, statusFlowObj.value)}
                      >
                        <section className="flex flex-row">
                          <span
                            className={`w-4 h-4 mt-[1px] text-[9px] mr-1 flex justify-center items-center rounded-full  border ${
                              onStep === statusFlowObj.value
                                ? 'bg-violet-500 text-white'
                                : ''
                            } `}
                          >
                            {i + 1}
                          </span>
                          <section>
                            <div className="">{statusFlowObj.label}</div>
                            {statusFlowObj.value == 'costsheet' && (
                              <div className="text-zinc-800 text-[12px] font-bold font-['Lato'] tracking-wide">
                                ₹{netTotal?.toLocaleString('en-IN')}
                              </div>
                            )}
                            {statusFlowObj.value == 'customerDetails' && (
                              <MyComponent data={customerInfo} />
                            )}
                            {statusFlowObj.value == 'payment_schedule' && (
                              <PaymentScheduleStats newPlotPS={newPlotPS} />
                            )}

                            {/*
                            {Object.entries(
                              customerInfo?.customerDetailsObj
                            ).reduce((count, [key, value]) => {
                              if (value === '') {
                                count++
                              }
                              return count
                            }, 0)} */}
                          </section>
                        </section>
                      </span>
                    ))}
                    {/* <ScrollHighlightNabbar navHeader={reviewLinks} /> */}
                  </div>
                )}
                <div className="w-full">
                  {['costsheet', 'allsheets', 'payment_schedule'].includes(
                    onStep
                  ) && (
                    <div className="">
                      <div className="flex flex-col mx-0 bg-[#F8FAFC] ">
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
                                  className="bg-[#fff] rounded-md border m-2"
                                  style={{
                                    boxShadow: '0 1px 12px #f2f2f2',
                                  }}
                                >
                                  {/* {csMode === 'both' && (
                                    <CostBreakUpPdfAll
                                      projectDetails={projectDetails}
                                      csMode={csMode}
                                      setCostSheet={setCostSheet}
                                      costSheet={costSheet}
                                      // costSheetA={costSheetA}
                                      pdfExportComponent={
                                        pdfExportComponentConstruct
                                      }
                                      selPhaseObj={selPhaseObj}
                                      leadDetailsObj1={leadDetailsObj1}
                                      selUnitDetails={selUnitDetails}
                                      setNewConstructCsObj={
                                        setNewConstructCsObj
                                      }
                                      newConstructCsObj={newConstructCsObj}
                                      newConstructCostSheetA={
                                        newConstructCostSheetA
                                      }
                                      setCostSheetA={setNewConstructCostSheetA}
                                      costSheetA={newConstructCostSheetA}
                                      setNewPS={setNewConstructPS}
                                      setNewConstructPS={setNewConstructPS}
                                      newConstructPS={newConstructPS}
                                    />
                                  )} */}
                                   {csMode === 'both' && (
                                    <CostBreakUpPdf
                                      formik={formik}
                                      projectDetails={projectDetails}
                                      csMode={csMode}
                                      setCostSheet={setCostSheet}
                                      costSheet={costSheet}
                                      // costSheetA={costSheetA}
                                      pdfExportComponent={pdfExportComponent}
                                      selPhaseObj={selPhaseObj}
                                      leadDetailsObj1={leadDetailsObj1}
                                      selUnitDetails={selUnitDetails}
                                      setNewPlotCsObj={setNewPlotCsObj}
                                      newPlotCsObj={newPlotCsObj}
                                      costSheetA={newPlotCostSheetA}
                                      setAddiChargesObj={
                                        setNewAdditonalChargesObj
                                      }
                                      setCostSheetA={setNewPlotCostSheetA}
                                      setNewPS={setNewPlotPS}
                                      newPlotPS={newPlotPS}
                                      showGstCol={showGstCol}
                                      netTotal={netTotal}
                                      setNetTotal={setNetTotal}
                                      partATotal={partATotal}
                                      partBTotal={partBTotal}
                                      partCTotal={partCTotal}
                                      setPartATotal={setPartATotal}
                                      setPartBTotal={setPartBTotal}
                                      setPartCTotal={setPartCTotal}
                                      showOnly={onStep}
                                    />
                                  )}
                                  {csMode === 'plot_cs' && (
                                    <CostBreakUpPdf
                                      formik={formik}
                                      projectDetails={projectDetails}
                                      csMode={csMode}
                                      setCostSheet={setCostSheet}
                                      costSheet={costSheet}
                                      // costSheetA={costSheetA}
                                      pdfExportComponent={pdfExportComponent}
                                      selPhaseObj={selPhaseObj}
                                      leadDetailsObj1={leadDetailsObj1}
                                      selUnitDetails={selUnitDetails}
                                      setNewPlotCsObj={setNewPlotCsObj}
                                      newPlotCsObj={newPlotCsObj}
                                      costSheetA={newPlotCostSheetA}
                                      setAddiChargesObj={
                                        setNewAdditonalChargesObj
                                      }
                                      setCostSheetA={setNewPlotCostSheetA}
                                      setNewPS={setNewPlotPS}
                                      newPlotPS={newPlotPS}
                                      showGstCol={showGstCol}
                                      netTotal={netTotal}
                                      setNetTotal={setNetTotal}
                                      partATotal={partATotal}
                                      partBTotal={partBTotal}
                                      partCTotal={partCTotal}
                                      setPartATotal={setPartATotal}
                                      setPartBTotal={setPartBTotal}
                                      setPartCTotal={setPartCTotal}
                                      showOnly={onStep}
                                      stepIndx={stepIndx}
                                      StatusListA={StatusListA}
                                    />
                                  )}
                                  {csMode === 'construct_cs' && (
                                    <CostBreakUpPdfConstruct
                                      projectDetails={projectDetails}
                                      csMode={csMode}
                                      // costSheetA={costSheetA}
                                      pdfExportComponent={
                                        pdfExportComponentConstruct
                                      }
                                      selPhaseObj={selPhaseObj}
                                      leadDetailsObj1={leadDetailsObj1}
                                      selUnitDetails={selUnitDetails}
                                      setNewConstructCsObj={
                                        setNewConstructCsObj
                                      }
                                      newConstructCsObj={newConstructCsObj}
                                      newConstructCostSheetA={
                                        newConstructCostSheetA
                                      }
                                      setCostSheetA={setNewConstructCostSheetA}
                                      costSheetA={newConstructCostSheetA}
                                      setNewPS={setNewConstructPS}
                                      setNewConstructPS={setNewConstructPS}
                                      newConstructPS={newConstructPS}
                                    />
                                  )}
                                </section>

                                <div className="flex flex-col mt-2 z-10 flex flex-row justify-between mt-2 pr-6 bg-white shadow-lg absolute bottom-0  w-full">
                                  <div className="mt-2 text-right md:space-x-3 md:block flex flex-col-reverse mb-3">
                                    <div className="inline-block">
                                      {/* <PdfInvoiceGenerator
                                        user={user}
                                        selUnitDetails={selUnitDetails}
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
                                        setPartBTotal={setPartBTotal}
                                        projectDetails={projectDetails}
                                        leadDetailsObj1={leadDetailsObj1}
                                      /> */}
                                    </div>
                                    <button
                                      className="mb-2 md:mb-0  hover:scale-110 focus:outline-none              hover:bg-[#5671fc]
                                  [background:linear-gradient(180deg,rgb(156.19,195.71,255)_0%,rgb(180.07,167.87,255)_100%)]
                                  text-black
                                  border duration-200 ease-in-out
                                  transition
                                   px-5 py-1 pb-[5px] text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-green-500"
                                      type="submit"
                                      disabled={loading}
                                      // onClick={() => submitFormFun(formik)}
                                    >
                                      {/* {loading && <Loader />} */}
                                      Save
                                    </button>
                                    {[
                                      'unitBookingMode',
                                      'unitBlockMode',
                                    ].includes(actionMode) && (
                                      <button
                                        className="mb-2 mr-2 md:mb-0  hover:scale-110 focus:outline-none              hover:bg-[#5671fc]
                                  bg-gradient-to-r from-violet-300 to-indigo-300
                                  text-black

                                  border duration-200 ease-in-out
                                  transition
                                   px-5 py-1 pb-[5px] text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-green-500"
                                        type="submit"
                                        disabled={loading}
                                        // onClick={() => submitFormFun(formik)}
                                      >
                                        {/* {loading && <Loader />} */}
                                        <span>Save & Next</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PaymentScheduleSheet */}
                  {/* {['payment_sch', 'allsheets'].includes(onStep) && (
                <PaymentScheduleSheet
                  title="Booking Form"
                  leadDetailsObj2={leadDetailsObj1}
                  selUnitDetails={selUnitDetails}
                  phase={selPhaseObj}
                  soldPrice={soldPrice}
                />
              )} */}
                  {['customerDetails', 'allsheets'].includes(onStep) && (
                    <AddApplicantDetails
                      currentMode={actionMode}
                      leadPayload={leadPayload}
                      setLeadPayload={setLeadPayload}
                      setCustomerInfo={setCustomerInfo}
                      customerInfo={customerInfo}
                      setOnStep={setOnStep}
                      source="Booking"
                      stepIndx={stepIndx}
                      StatusListA={StatusListA}
                      selUnitDetails={selUnitDetails}
                      title="Booking Form"
                    />
                  )}
                  {['additonalInfo'].includes(onStep) && (
                    <AdditonalBookingDetails
                      currentMode={actionMode}
                      selUnitDetails={selUnitDetails}
                      additionalInfo={additionalInfo}
                      setAdditonalInfo={setAdditonalInfo}
                      leadDetailsObj2={leadPayload}
                      customerInfo={customerInfo}
                      setCustomerInfo={setCustomerInfo}
                      setOnStep={setOnStep}
                      source="Booking"
                      stepIndx={stepIndx}
                      StatusListA={StatusListA}

                    />
                  )}
                  {['booksheet', 'allsheets'].includes(onStep) && (
                    <AddPaymentDetailsForm
                      title={'undefined'}
                      dialogOpen={undefined}
                      customerInfo={customerInfo}
                      additionalInfo={additionalInfo}
                      costSheet={costSheet}
                      phase={selPhaseObj}
                      leadDetailsObj2={leadPayload}
                      selUnitDetails={selUnitDetails}
                      newPlotCsObj={newPlotCsObj}
                      newPlotCostSheetA={newPlotCostSheetA}
                      newConstructCsObj={newConstructCsObj}
                      newConstructCostSheetA={newConstructCostSheetA}
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
                      // costSheetA={costSheetA}
                      pdfExportComponent={pdfExportComponent}
                      customerInfo={customerInfo}
                      costSheet={costSheet}
                      selPhaseObj={selPhaseObj}
                      leadDetailsObj1={leadDetailsObj1}
                      selUnitDetails={selUnitDetails}
                      setNewPlotCsObj={setNewPlotCsObj}
                      newPlotCsObj={newPlotCsObj}
                      costSheetA={newPlotCostSheetA}
                      setAddiChargesObj={setNewAdditonalChargesObj}
                      setCostSheetA={setNewPlotCostSheetA}
                      setNewPS={setNewPlotPS}
                      newPlotPS={newPlotPS}
                      showGstCol={showGstCol}
                      netTotal={netTotal}
                      setNetTotal={setNetTotal}
                      partATotal={partATotal}
                      partBTotal={partBTotal}
                      setPartATotal={setPartATotal}
                      setPartBTotal={setPartBTotal}
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
                      selUnitDetails={selUnitDetails}
                      stepIndx={stepIndx}
                      StatusListA={StatusListA}
                    />
                  )}
                  {['Detail View'].includes(onStep) && <UnitTransactionForm />}
                  {/* <div className="mt-8 p-4"> */}
                  {/* <div>
            <div className="font-bold text-gray-600 text-xs leading-8 uppercase h-6 mx-2 mt-3">Full Name</div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                        <input placeholder="First Name" className="p-1 px-2 appearance-none outline-none w-full text-gray-800"> </div>
                </div>
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                        <input placeholder="Last Name" className="p-1 px-2 appearance-none outline-none w-full text-gray-800"> </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                    <div className="font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase"> Username</div>
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                        <input placeholder="Just a hint.." className="p-1 px-2 appearance-none outline-none w-full text-gray-800"> </div>
                </div>
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                    <div className="font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase"> Your Email</div>
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                        <input placeholder="jhon@doe.com" className="p-1 px-2 appearance-none outline-none w-full text-gray-800"> </div>
                </div>
            </div>
        </div> */}

                  {/* </div> */}
                </div>
                {/* {['unitBookingMode', 'unitBlockMode'].includes(actionMode) && (
                  <div className="flex flex-col  w-[250px] pt-4 px-2 bg-violet-100 h-screen">
                    {StatusListA.map((statusFlowObj, i) => (
                      <span
                        key={i}
                        className={`font-bodyLato text-sm font-normal px-2 py-[4px]   mt-2 mr-1 cursor-pointer rounded-full ${
                          onStep === statusFlowObj.value
                            ? 'bg-violet-500 text-white'
                            : ''
                        } `}
                        onClick={() => setStatusFun(i, statusFlowObj.value)}
                      >
                        <section className="flex flex-row">
                          <span
                            className={`w-4 h-4 mt-[1px] text-[9px] mr-1 flex justify-center items-center rounded-full  border ${
                              onStep === statusFlowObj.value
                                ? 'bg-violet-500 text-white'
                                : ''
                            } `}
                          >
                            {i + 1}
                          </span>
                          <div>{statusFlowObj.label}</div>
                        </section>
                      </span>
                    ))}

                  </div>
                )} */}
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
        selUnitDetails={selUnitDetails}
        newPlotCsObj={newPlotCsObj}
        costSheetA={costSheetA || newPlotCostSheetA || []}
        newPlotCostSheetA={costSheetA || newPlotCostSheetA || []}
        // setNewPlotCsObj={setNewPlotCsObj}
        // setCostSheetA={setNewPlotCostSheetA}
        // setNewPS={setNewPlotPS}
        // newPlotPS={newPlotPS}
        // showGstCol={showGstCol}
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
 * @param {number} currentPosition Current Scroll position
 * @param {Array} sectionPositionArray Array of positions of all sections
 * @param {number} startIndex Start index of array
 * @param {number} endIndex End index of array
 * @return {number} Current Active index
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
    // CustomerDetailsObj exists
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
  } else {
    // CustomerDetailsObj does not exist
    return <p>0 of 10 Filled</p>
  }
}

export const PaymentScheduleStats = ({ newPlotPS }) => {
  if (newPlotPS?.length > 0) {
    // CustomerDetailsObj exists

    let start= 'NA'
    let end = 'NA'
    if(newPlotPS[0]['schDate']){
    start = prettyDate(newPlotPS[0]['schDate'])
    }
    if(newPlotPS[newPlotPS.length - 1]['schDate']){

    end = prettyDate(newPlotPS[newPlotPS.length - 1]['schDate'])
    }
    return (
      <div>
        <p className="text-zinc-800 text-[12px] font-bold font-['Lato'] tracking-wide">
          {' '}
          {start || 'NA'}-{end||'NA'}
        </p>
      </div>
    )
  } else {
    // CustomerDetailsObj does not exist
    return <p>0 of 10 Filled</p>
  }
}
