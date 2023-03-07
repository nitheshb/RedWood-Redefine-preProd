/* eslint-disable no-constant-condition */
/* eslint-disable new-cap */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect, createRef, useRef } from 'react'

import { Dialog } from '@headlessui/react'
import { RadioGroup } from '@headlessui/react'
import { Checkbox } from '@mui/material'
import { Timestamp } from 'firebase/firestore'
import { Form, Formik, Field } from 'formik'
import jsPDF from 'jspdf'
import { useSnackbar } from 'notistack'
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
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import {
  sendWhatAppMediaSms,
  sendWhatAppTextSms,
} from 'src/util/axiosWhatAppApi'
import CostBreakUpPdf from 'src/util/costBreakUpPdf'
import CostBreakUpPdfAll from 'src/util/costBreakUpPdf_all'
import CostBreakUpPdfConstruct from 'src/util/costBreakUpPdf_construct'
import { PhoneNoField } from 'src/util/formFields/phNoField'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { TextField } from 'src/util/formFields/TextField'
import { TextField2 } from 'src/util/formFields/TextField2'
import { TextFieldFlat } from 'src/util/formFields/TextFieldFlatType'

import BlockingUnitForm from './BlockingUnitForm'
import AddBookingForm from './bookingForm'
import AddPaymentDetailsForm from './FinanceModule/BookingPaymentForm'
import Loader from './Loader/Loader'
import PaymentScheduleSheet from './paymentScheduleSheet'
import UnitTransactionForm from './UnitBillTransactionForm'

const CostBreakUpSheet = ({
  selMode,
  title,
  leadDetailsObj1,
  projectDetails,
  selPhaseObj,
  selUnitDetails,
  unitDetails,
  dialogOpen,
  setShowCostSheetWindow,
}) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()
  const ref = createRef()
  const [fetchedUsersList, setfetchedUsersList] = useState([])
  const [costSheetA, setCostSheetA] = useState([])
  const [usersList, setusersList] = useState([])
  const [projectList, setprojectList] = useState([])
  const [initialValuesA, setInitialValuesA] = useState({})
  const [newSqftPrice, setNewSqftPrice] = useState(0)
  const [onStep, setOnStep] = useState('costsheet')
  const [soldPrice, setSoldPrice] = useState(0)
  const [csMode, setCsMode] = useState('both')
  const [newPlotCostSheetA, setNewPlotCostSheetA] = useState([])
  const [newPlotCsObj, setNewPlotCsObj] = useState([])
  const [newPlotPS, setNewPlotPS] = useState([])
  const [newConstructCsObj, setNewConstructCsObj] = useState([])
  const [newConstructCostSheetA, setNewConstructCostSheetA] = useState([])
  const [newConstructPS, setNewConstructPS] = useState([])

  const pdfExportComponent = useRef(null)
  const pdfExportComponentConstruct = useRef(null)
  useEffect(() => {
    console.log('new cost sheet value is ', newPlotCsObj)
  }, [newPlotCsObj])
  useEffect(() => {
    console.log('leadDetailsObj1 are', leadDetailsObj1)
  }, [])

  useEffect(() => {
    console.log('new customer object x', title, leadDetailsObj1)
    if (leadDetailsObj1) {
      console.log('it exists')
    } else {
      leadDetailsObj1 = {}
    }
  }, [leadDetailsObj1])

  useEffect(() => {
    console.log('phase details are ', selPhaseObj)
    const {
      additonalChargesObj,
      ConstructOtherChargesObj,
      payment_scheduleObj,
    } = selPhaseObj
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
      if (leadDetailsObj1) {
        if (leadDetailsObj1[`${uid}_cs`]['costSheetA']) {
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
      merged = [...x, ...additonalChargesObj]
    }

    const initformValues = {}
    merged.map((d) => {
      const x = d['component']['value']
      console.log('initial values ', x, d?.charges)
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

  const devTypeA = [
    {
      name: 'Outright',
      img: '/apart.svg',
    },
    {
      name: 'Joint',
      img: '/apart1.svg',
    },
  ]
  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [selected, setSelected] = useState({})
  const [devType, setdevType] = useState(devTypeA[0])
  const phoneRegExp =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

  const typeSel = async (sel) => {
    await console.log('value is', selected)
    await setSelected(sel)
    await console.log('thsi si sel type', sel, selected)
  }
  const devTypeSel = async (sel) => {
    await setdevType(sel)
  }

  const initialState = initialValuesA
  const validate = Yup.object({
    // blockReason: Yup.number()
    //   .max(15, 'Must be 15 characters or less')
    //   .required('Name is Required'),
  })
  const resetter = () => {
    setSelected({})
    setFormMessage('')
  }
  const moveStep = (stepper) => {
    setOnStep(stepper)
  }

  const calTotal = (costSheetA, formik) => {
    const total = costSheetA.reduce(
      (partialSum, obj) =>
        partialSum + Number(formik.values[`${obj['component'].value}`]),
      0
    )
    setSoldPrice(total)
    return total
  }
  const onSubmit = async (data, resetForm) => {
    console.log('customer sheet form', costSheetA, selUnitDetails, data)

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
    console.log('customer sheet form new values is', newCostSheetA)
    // newCostSheetA.push(x)
    // i need unit_uID & unit details
    const xData = {}

    xData[`${uid}${'_cs'}`] = {
      oldUnitDetailsObj: selUnitDetails,
      newSqftPrice: Number(newSqftPrice),
      soldPrice: Number(soldPrice),
      costSheetA: newCostSheetA,
    }

    updateLeadCostSheetDetailsTo(
      orgId,
      id,
      xData,
      'nitheshreddy.email@gmail.com',
      enqueueSnackbar,
      resetForm
    )
  }
  return (
    <>
      <section className="  bg-black">
        <div className="max-w-5xl mx-auto py-  bg-white">
          <article className="overflow-hidden">
            <div className="bg-[white] rounded-b-md">
              <div className=" mt-">
                <div className="mx-4 p-4">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center  relative ${
                        ['costsheet'].includes(onStep)
                          ? 'text-white'
                          : 'text-[#5671fc] '
                      }`}
                      onClick={() => moveStep('costsheet')}
                    >
                      <div
                        className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${
                          ['costsheet'].includes(onStep)
                            ? 'bg-[#5671fc] border-[#5671fc] '
                            : 'border-[#5671fc] '
                        } `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-bookmark "
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <div
                        className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase ${
                          ['costsheet'].includes(onStep)
                            ? 'text-[#5671fc] '
                            : 'text-gray-500'
                        }`}
                      >
                        Cost sheet
                      </div>
                    </div>
                    <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-[#5671fc] "></div>
                    {/* <div
                      className={`flex items-center  relative ${
                        ['payment_sch'].includes(onStep)
                          ? 'text-white'
                          : 'text-[#5671fc] '
                      }`}
                      onClick={() => moveStep('payment_sch')}
                    >
                      <div
                        className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${
                          ['payment_sch'].includes(onStep)
                            ? 'bg-[#5671fc] border-[#5671fc] '
                            : 'border-[#5671fc] '
                        } `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-mail "
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <div
                        className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase ${
                          ['payment_sch'].includes(onStep)
                            ? 'text-[#5671fc] '
                            : 'text-gray-500'
                        }`}
                      >
                        Payment Schedule
                      </div>
                    </div> */}
                    {/* <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div> */}
                    <div
                      className={`flex items-center  relative ${
                        ['customerDetails'].includes(onStep)
                          ? 'text-white'
                          : 'text-[#5671fc] '
                      }`}
                      onClick={() => moveStep('customerDetails')}
                    >
                      <div
                        className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${
                          ['customerDetails'].includes(onStep)
                            ? 'bg-[#5671fc] border-[#5671fc] '
                            : 'border-[#5671fc] '
                        } `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-user-plus "
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <line x1="20" y1="8" x2="20" y2="14"></line>
                          <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                      </div>
                      <div
                        className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase ${
                          ['customerDetails'].includes(onStep)
                            ? 'text-[#5671fc] '
                            : 'text-gray-500'
                        }`}
                      >
                        Customer details
                      </div>
                    </div>
                    <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
                    <div
                      className={`flex items-center  relative ${
                        ['booksheet'].includes(onStep)
                          ? 'text-white'
                          : 'text-[#5671fc] '
                      }`}
                      onClick={() => moveStep('booksheet')}
                    >
                      <div
                        className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${
                          ['booksheet'].includes(onStep)
                            ? 'bg-[#5671fc] border-[#5671fc] '
                            : 'border-[#5671fc] '
                        } `}
                      >
                        {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-mail "
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg> */}

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-mail "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                          />
                        </svg>
                      </div>
                      <div
                        className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase ${
                          ['booksheet'].includes(onStep)
                            ? 'text-[#5671fc] '
                            : 'text-gray-500'
                        }`}
                      >
                        Book
                      </div>
                    </div>
                    <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
                    <div
                      className={`flex items-center  relative ${
                        ['blocksheet'].includes(onStep)
                          ? 'text-white'
                          : 'text-[#5671fc] '
                      }`}
                      onClick={() => moveStep('blocksheet')}
                    >
                      <div
                        className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${
                          ['blocksheet'].includes(onStep)
                            ? 'bg-[#5671fc] border-[#5671fc] '
                            : 'border-[#5671fc] '
                        } `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-mail "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002"
                          />
                        </svg>
                      </div>
                      <div
                        className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase ${
                          ['blocksheet'].includes(onStep)
                            ? 'text-[#5671fc] '
                            : 'text-gray-500'
                        }`}
                      >
                        Block
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {['costsheet', 'allsheets'].includes(onStep) && (
                <div className="mt-10">
                  <section className="bg-[#F6F7FE]">
                    {/* <p className="text-md font-extrabold tracking-tight uppercase font-body pb-4">
                      COST SHEET
                    </p> */}
                    <div className=" border-gray-800 flex flex-row justify-between bg-[#F6F7FE]">
                      <div>
                        <ul
                          className="flex justify-  rounded-t-lg  ml-2"
                          id="myTab"
                          data-tabs-toggle="#myTabContent"
                          role="tablist"
                        >
                          {[
                            { lab: 'Both', val: 'both' },
                            { lab: 'Plot', val: 'plot_cs' },
                            {
                              lab: 'Construction',
                              val: 'construct_cs',
                            },
                          ].map((d, i) => {
                            return (
                              <li
                                key={i}
                                className="mr-2 font-bodyLato"
                                role="presentation"
                              >
                                <section className="bg-[#F6F7FE]">
                                  <div className="w-full flex items-center ">
                                    <label
                                      htmlFor="area"
                                      className="label font-regular text-sm font-bodyLato"
                                    >
                                      {d?.lab}
                                    </label>
                                    <Field
                                      name="isGSTChecked"
                                      type="checkbox"
                                      component={() => (
                                        <Checkbox
                                          color="primary"
                                          checked={csMode === d.val}
                                          onClick={() => setCsMode(d.val)}
                                          // checked={formik.values.isGSTChecked}
                                          // onChange={() =>
                                          //   formik.setFieldValue(
                                          //     'isGSTChecked',
                                          //     !formik.values.isGSTChecked
                                          //   )
                                          // }
                                        />
                                      )}
                                    />
                                  </div>
                                </section>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                      <section className="bg-[#F6F7FE]">
                        <div className="w-full flex items-center ">
                          <label
                            htmlFor="area"
                            className="label font-regular text-sm font-bodyLato"
                          >
                            Show Gst
                          </label>
                          <Field
                            name="isGSTChecked"
                            type="checkbox"
                            component={() => (
                              <Checkbox
                                color="primary"
                                // checked={formik.values.isGSTChecked}
                                // onChange={() =>
                                //   formik.setFieldValue(
                                //     'isGSTChecked',
                                //     !formik.values.isGSTChecked
                                //   )
                                // }
                              />
                            )}
                          />
                        </div>
                      </section>
                    </div>
                  </section>
                  <div className="flex flex-col mx-0 bg-[#F8FAFC] ">
                    <div className="p-2">
                      <Formik
                        enableReinitialize={true}
                        initialValues={initialState}
                        validationSchema={validate}
                        onSubmit={(values, { resetForm }) => {
                          console.log('i was clicked')
                          onSubmit(values, resetForm)
                        }}
                      >
                        {(formik) => (
                          <Form ref={ref}>
                            <section
                              className="bg-[#fff] p-2 rounded-md "
                              style={{
                                boxShadow: '0 1px 12px #f2f2f2',
                              }}
                            >
                              {csMode === 'both' && (
                                <CostBreakUpPdfAll
                                  projectDetails={projectDetails}
                                  csMode={csMode}
                                  // costSheetA={costSheetA}
                                  pdfExportComponent={
                                    pdfExportComponentConstruct
                                  }
                                  selPhaseObj={selPhaseObj}
                                  leadDetailsObj1={leadDetailsObj1}
                                  selUnitDetails={selUnitDetails}
                                  setNewConstructCsObj={setNewConstructCsObj}
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
                              {csMode === 'plot_cs' && (
                                <CostBreakUpPdf
                                  projectDetails={projectDetails}
                                  csMode={csMode}
                                  // costSheetA={costSheetA}
                                  pdfExportComponent={pdfExportComponent}
                                  selPhaseObj={selPhaseObj}
                                  leadDetailsObj1={leadDetailsObj1}
                                  selUnitDetails={selUnitDetails}
                                  setNewPlotCsObj={setNewPlotCsObj}
                                  newPlotCsObj={newPlotCsObj}
                                  costSheetA={newPlotCostSheetA}
                                  setCostSheetA={setNewPlotCostSheetA}
                                  setNewPS={setNewPlotPS}
                                  newPlotPS={newPlotPS}
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
                                  setNewConstructCsObj={setNewConstructCsObj}
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
                            <div className="flex flex-col mt-2 p-4 ">
                              <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse mb-6">
                                <button
                                  onClick={() => dialogOpen(false)}
                                  type="button"
                                  className="mb-4 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-sm hover:shadow-lg hover:bg-gray-100"
                                >
                                  {' '}
                                  Send to WhatsApp{' '}
                                </button>
                                {/* <Pdf targetRef={ref} filename="post.pdf">
                              {({ toPdf }) => (
                                <button
                                  onClick={toPdf}
                                  type="button"
                                  className="mb-4 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-sm hover:shadow-lg hover:bg-gray-100"
                                >
                                  {' '}
                                  Download{' '}
                                </button>
                              )}
                            </Pdf> */}
                                <button
                                  onClick={() => {
                                    if (
                                      pdfExportComponent.current &&
                                      csMode === 'plot_cs'
                                    ) {
                                      pdfExportComponent.current.save()
                                    } else if (
                                      pdfExportComponentConstruct.current &&
                                      csMode != 'plot_cs'
                                    ) {
                                      pdfExportComponentConstruct.current.save()
                                    }
                                  }}
                                  type="button"
                                  className="mb-4 md:mb-0 hover:scale-110 focus:outline-none bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-sm hover:shadow-lg hover:bg-gray-100         hover:bg-teal-200
                                  bg-teal-100
                                  text-teal-700
                                  border duration-200 ease-in-out
                                  border-[#5671fc] transition"
                                >
                                  {' '}
                                  Download{' '}
                                </button>

                                <button
                                  className="mb-2 md:mb-0  hover:scale-110 focus:outline-none              hover:bg-[#5671fc]
                                  bg-[#5671fc]
                                  text-teal-100
                                  border duration-200 ease-in-out
                                  border-[#5671fc] transition
                                   px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-sm hover:shadow-lg hover:bg-green-500"
                                  type="submit"
                                  disabled={loading}
                                  // onClick={() => submitFormFun(formik)}
                                >
                                  {/* {loading && <Loader />} */}
                                  Save
                                </button>
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
                <AddBookingForm
                  title="Booking Form"
                  selUnitDetails={selUnitDetails}
                  leadDetailsObj2={leadDetailsObj1}
                />
              )}
              {['booksheet', 'allsheets'].includes(onStep) && (
                <AddPaymentDetailsForm
                  title={'undefined'}
                  dialogOpen={undefined}
                  phase={selPhaseObj}
                  leadDetailsObj2={leadDetailsObj1}
                  selUnitDetails={selUnitDetails}
                  newPlotCsObj={newPlotCsObj}
                  newPlotCostSheetA={newPlotCostSheetA}
                  newConstructCsObj={newConstructCsObj}
                  newConstructCostSheetA={newConstructCostSheetA}
                  newConstructPS={newConstructPS}
                  newPlotPS={newPlotPS}
                  projectDetails={projectDetails}
                />
              )}

              {['blocksheet'].includes(onStep) && (
                <BlockingUnitForm title="Blocking Form" />
              )}
              {['Detail View'].includes(onStep) && <UnitTransactionForm />}
              <div className="mt-8 p-4">
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
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export default CostBreakUpSheet
