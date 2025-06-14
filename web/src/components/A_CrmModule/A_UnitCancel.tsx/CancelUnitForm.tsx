/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from 'react'

import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/solid'
import { Timestamp } from 'firebase/firestore'
import { ErrorMessage, Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'

import Loader from 'src/components/Loader/Loader'
import {
  cancelUnitDbFun,
  streamGetAllUnitTransactions,
  updateCancelProjectCounts,
  updateTransactionStatus,
  updateUnitAsBooked,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'
import { TextField2 } from 'src/util/formFields/TextField2'
import {format, setHours, setMinutes } from 'date-fns'

const CancelUnitForm = ({openUserProfile,selUnitDetails, bookCompSteps, bookCurentStep }) => {
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [selected, setSelected] = useState({})
  const [selDays, setSelDays] = useState(5)
  const [bookingProgress, setBookingProgress] = useState(true)
  const [unitTransactionsA, setUnitTransactionsA] = useState([])
  const [startDate, setStartDate] = useState(d)

  useEffect(() => {
    getAllTransactionsUnit()
  }, [])

  const getAllTransactionsUnit = async () => {
    const steamLeadLogs = await streamGetAllUnitTransactions(
      orgId,
      'snap',
      {
        unit_id: selUnitDetails?.id,
      },
      (error) => []
    )
    await setUnitTransactionsA(steamLeadLogs)
    return
  }
  const onSubmitFun = async (data, resetForm) => {

    console.log('status is', selUnitDetails)

    if (selUnitDetails?.status === 'booked') {
      UpdateAllTransactionsAsCancel()

      const unitUpdate = {
        leadId: 'id',
        status: 'available',
        customerDetailsObj: {},
        secondaryCustomerDetailsObj: {},
        booked_on: data?.dated,
        ct: Timestamp.now().toMillis(),
        Date: Timestamp.now().toMillis(),
      }
      unitUpdate[`plotCS`] = []
      unitUpdate[`addChargesCS`] = []
      unitUpdate[`constructCS`] = []
      unitUpdate[`fullPs`] = []
      unitUpdate[`T_elgible`] = 0
      unitUpdate[`stepsComp`] = []
      unitUpdate[`T_transaction`] = 0
      unitUpdate[`T_review`] = 0
      unitUpdate[`T_balance`] = 0
      unitUpdate[`oldStatus`] = selUnitDetails?.status

      await updateUnitAsBooked(
        orgId,
        selUnitDetails?.pId,
        selUnitDetails?.uid,
        unitUpdate,
        user?.email,
        enqueueSnackbar,
        resetForm
      )

      await updateCancelProjectCounts(   orgId,
        selUnitDetails?.pId,selUnitDetails, user?.email, enqueueSnackbar)
        openUserProfile=false
    } else {
      console.log('cannot be cancelled')
      enqueueSnackbar(`${selUnitDetails?.status} unit cannot be cancelled`, {
        variant: 'warning',
      })
    }
  }

  const UpdateAllTransactionsAsCancel = () => {
    unitTransactionsA.map((data) => {
      data.Uuid = data?.unit_id
      data.oldStatus = `${data?.status}`
      data.status = `${data?.oldStatus}_cancelled`
      data.subtype = 'booking_cancel'
      updateTransactionStatus(orgId, data, user?.email, enqueueSnackbar)
    })
  }
  const datee = new Date().getTime()
  const initialState = {
    amount: 0,
    dated:  datee,
    payReason: ''

  }
  const validate = Yup.object({
    payReason: Yup.string().required('Reason is Required'),

  })
  const resetter = () => {
    setSelected({})
    setFormMessage('')
  }

   const onSubmitSupabase = async (data, resetForm) => {
      console.log('inside supabase support', data)


    const x = selUnitDetails
    x.cancellationCharges = data.amount
    x.cancelledDate = datee
    x.cancelledBy = user?.email
    x.cancelReason = data?.payReason
    cancelUnitDbFun(orgId, x, user,enqueueSnackbar)
    }
  return (
    <>
      <section className="bg-blueGray-50 min-h-screen bg-white mx-2 rounded-lg border border-gray-100 ">
        <div className="w-full  mx-auto ">
            <div className="mx-2 o my-10 mt-4 ">
              <div className="bg-white p-10 rounded-xl">
                <h1 className="text-center text-xl text-gray-500">
                  Are you Sure to Canel this booking?
                </h1>
                <div className="h-screen">
      <div className="flex items-center justify-center">
        <div
          id="bg-img"
          className="flex h-[664px] w-full flex-col  h-screen">
          <div className="relative top-6 mx-auto max-h-[65%] shadow-lg  border-gray-200 border rounded-xl  ">
            <div className="grid gap-8 grid-cols-1">
              <div className="flex flex-col ">
                <div className="mt-0">
                  <Formik
                    enableReinitialize={false}
                    initialValues={initialState}
                    validationSchema={validate}
                    onSubmit={(values, { resetForm }) => {
                      console.log('values is', values)

                      setBookingProgress(true)
                      onSubmitSupabase(values, resetForm)
                      console.log(values)
                    }}
                  >
                    {(formik, setFieldValue) => (
                      <Form>
                        <div className="form">
                          <section className=" ">
                            <div className="w-full mx-auto ">
                              <div className="relative flex flex-col min-w-0 break-words w-full mb-6  rounded-lg bg-white ">
                                <div className=" flex flex-row px-2 py-2  overflow-y-scroll overflow-auto no-scrollbar">
                                  <section className=" p-4 rounded-md w-[540px]">
                                    <article className="mt-5">
                                      <div className="flex flex-row justify-between">
                                        <section className="flex flex-row">
                                          <div className="inline">
                                            <div className="mt-[7px]">
                                              <label className="text-[20px] font-medium text-[#000000]    mb-[2px]  ">
                                                Cancel Booking
                                                <abbr title="required"></abbr>
                                              </label>
                                            </div>
                                            <div>
                                            <p className='text-[#6A6A6A] font-normal  mt-2 text-[12px]'>Refund amount will be added to customer wallet for withdrawal.</p>
                                          </div>
                                          </div>
                                        </section>
                                        <section className="flex flex-row justify-between">
                                        </section>
                                      </div>
                                    </article>
                                    <section>
                                        <div className="flex flex-wrap mt-10">
                                          <div className="w-full lg:w-4/12 pr-3 mt-[10px]">
                                          <div className="relative w-full mb-5">
                                              <TextField2
                                                label="Cancellation Amount"
                                                name="amount"
                                                type="text"
                                                value={
                                                  formik?.values?.amount?.toLocaleString('en-IN')
                                                  }
                                                  onChange={(e) =>{
                                                  const value = e.target.value.replace(/,/g, '')
                                                    if(!isNaN(value)){
                                                    const rawValue = Number(e.target.value.replace(/,/g, ''))?.toLocaleString('en-IN')
                                                    formik.setFieldValue('amount', rawValue)}
                                                  }}
                                              />
                                            </div>
                                          </div>
                                          <div className="w-full  lg:w-4/12 pl-3 ">
                                            <div className="relative w-full mb-5 mt-[-1px] ">
                                            <label

        className="  text-xs text-[#6A6A6A] "
      >
       Cancellation Date

      </label>
                                              <span className="inline">
                                                <CustomDatePicker
                                                  className="h-8 outline-none border-t-0 border-l-0 border-r-0 border-b border-[#cccccc]  border-solid mt-[-4px]   min-w-[125px]  inline  text-[#0091ae]   lg:w-4/12 w-full flex bg-grey-lighter text-grey-darker border  "
                                                  label="Dated"
                                                  name="dated"
                                                  // selected={startDate}
                                                  selected={formik.values.dated}
                                                  onChange={(date) => {
                                                    // setFieldValue('dated')
                                                    formik.setFieldValue(
                                                      'dated',
                                                      date.getTime()
                                                    )
                                                    // setStartDate(date)
                                                    console.log(startDate)
                                                  }}
                                                  timeFormat="HH:mm"
                                                  injectTimes={[
                                                    setHours(
                                                      setMinutes(d, 1),
                                                      0
                                                    ),
                                                    setHours(
                                                      setMinutes(d, 5),
                                                      12
                                                    ),
                                                    setHours(
                                                      setMinutes(d, 59),
                                                      23
                                                    ),
                                                  ]}
                                                  //dateFormat="MMM d, yyyy"
                                                  dateFormat="MMM dd, yyyy"
                                                />
                                              </span>
                                            </div>
                                          </div>
                                          <div className="w-full  ">
                                            <div className="relative w-full mb-3">
                                              <TextField2
                                                label="Reason"
                                                name="payReason"
                                                type="text"
                                              />
                                            </div>

                                          </div>
                                        </div>

                                      </section>


                                    <div className="text-center space-x-4 mt-6">
                                      <button
                                        className="bg-[#00ADB4] translate-y-1 text-[#fff]  text-[12px]  py-2.5 px-6  font-medium  rounded-full inline-flex items-center"
                                        type="submit"
                                        disabled={loading}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="w-5 h-5"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        &nbsp; &nbsp;
                                        <span>
                                          {' '}
                                         Cancel Booking
                                        </span>
                                      </button>
                                    </div>


                                  </section>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>




              </div>
            </div>

            {/* {bookingProgress && (
              <section className="mb-3">
                <div className="mx-auto flex mt-6 flex-row  ">
                  <section className="ml-3 w-[300px]">
                    <div className="flex items-center">
                      {bookCompSteps?.includes('payment_captured') && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                          <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                        </div>
                      )}
                      {!bookCompSteps?.includes('payment_captured') &&
                        !bookCurentStep?.includes('payment_captured') && (
                          <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                        )}
                      {bookCurentStep?.includes('payment_captured') && (
                        <Loader />
                      )}
                      <span className="ml-2 text-md font-bold text-navy-700 ">
                        Revert Payment
                      </span>
                    </div>
                  </section>
            
                  <section className="ml-3 w-[300px]">
                    <div className="flex items-center">
                      {bookCompSteps?.includes('CS_updated') && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                          <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                        </div>
                      )}
                      {!bookCompSteps?.includes('CS_updated') &&
                        !bookCurentStep?.includes('CS_updated') && (
                          <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                        )}
                      {bookCurentStep?.includes('CS_updated') && <Loader />}
                      <span className="ml-4 text-md font-bold text-navy-700 ">
                        Reset Unit Booking Info
                      </span>
                    </div>
                  </section>
                </div>
                <div className="mx-auto flex mt-6 flex flex-row  ">
                  <section className="ml-3 w-[300px]">
                    <div className="flex items-center">
                      {bookCompSteps?.includes('unit_booked') && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                          <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                        </div>
                      )}
                      {!bookCompSteps?.includes('unit_booked') &&
                        !bookCurentStep?.includes('unit_booked') && (
                          <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                        )}
                      {bookCurentStep?.includes('unit_booked') && <Loader />}
                      <span className="ml-2 text-md font-bold text-navy-700 ">
                        Update Payment Projections
                      </span>
                    </div>
                  </section>
              
                  <section className="ml-3 w-[300px]">
                    <div className="flex items-center">
                      {bookCompSteps?.includes('customer_created') && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                          <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                        </div>
                      )}
                      {!bookCompSteps?.includes('customer_created') &&
                        !bookCurentStep?.includes('customer_created') && (
                          <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                        )}
                      {bookCurentStep?.includes('customer_created') && (
                        <Loader />
                      )}
                      <span className="ml-2 text-md font-bold text-navy-700 ">
                        Deattch Asset from Customer
                      </span>
                    </div>
                  </section>
                </div>
                <div className="mx-auto flex mt-6 flex flex-row  ">
                  <section className="ml-3 w-[300px]">
                    <div className="flex items-center">
                      {bookCompSteps?.includes('customer_email_send') && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                          <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                        </div>
                      )}
                      {!bookCompSteps?.includes('customer_email_send') &&
                        !bookCurentStep?.includes('customer_email_send') && (
                          <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                        )}
                      {bookCurentStep?.includes('customer_email_send') && (
                        <Loader />
                      )}
                      <span className="ml-2 text-md font-bold text-navy-700 ">
                        Send Canellation E-mail
                      </span>
                    </div>
                  </section>
                  
                  <section className="ml-4 w-[300px]">
                    <div className="flex items-center">
                      {bookCompSteps?.includes('notify_to_manager') && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ">
                          <CheckCircleIcon className="h-6 w-6 text-violet-500 " />
                        </div>
                      )}
                      {!bookCompSteps?.includes('notify_to_manager') &&
                        !bookCurentStep?.includes('notify_to_manager') && (
                          <ExclamationCircleIcon className="w-6 h-6 cursor-pointer ml-1 mb-[3px] mr-2 inline-block text-gray-400 " />
                        )}
                      {bookCurentStep?.includes('notify_to_manager') && (
                        <Loader />
                      )}
                      <span className="ml-2 text-md font-bold text-navy-700 ">
                        Notified to Manager
                      </span>
                    </div>
                  </section>
                </div>
              </section>
            )} */}

        </div>
      </section>
    </>
  )
}

export default CancelUnitForm
