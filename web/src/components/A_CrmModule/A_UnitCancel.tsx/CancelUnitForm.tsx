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
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formValues, setFormValues] = useState(null)
  const [resetFormFn, setResetFormFn] = useState(null)




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





    const handleConfirmationYes = () => {
      setShowConfirmation(false)
      if (formValues && resetFormFn) {
        setBookingProgress(true)
        onSubmitSupabase(formValues, resetFormFn)
      }
    }
  
    const handleConfirmationNo = () => {
      setShowConfirmation(false)
    }


  const handleSubmit = (values, { resetForm }) => {
    setFormValues(values)
    setResetFormFn(() => resetForm)
    setShowConfirmation(true)
  }
  





  return (
    <>



<div className='overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300'>




<div className="relative min-h-screen mr-6">
    {/* Background image */}
    {/* <div className="">
      <img alt="CRM Background" src="/bgimgcrm.svg" className="w-full h-auto" />
    </div> */}



    <div className="relative z-0">



    {/* <h1 className="text-[#606062] font-outfit  max-w-3xl mx-auto w-full px-4 tracking-[0.06em] font-heading font-medium text-[12px] uppercase mb-0">
    Unit Cancellation
      </h1>
       */}

<h1 className="text-[#606062] font-outfit mb-1   mx-auto w-full  tracking-[0.06em] font-heading font-medium text-[12px] uppercase mb-0">
Unit Cancellation
  </h1>

      <img
        alt="CRM Background"
        src="/bgimgcrm.svg"
        className="w-full h-auto object-cover"
      />

      <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  ">
          <div className="text-center space-y-2">
            <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Cancelled On</p>
            <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>
          </div>
          <div className="text-center space-y-2">
            <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Cancellation Reason</p>
            <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>
          </div>
          <div className="text-center space-y-2">
            <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Cancelled By</p>
            <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>

          </div>
        </div>
      </div>
    </div>



      <div className="w-full h-full items-center justify-center  flex mt-[-70px] z-10 relative">
              
         

    <section className=" rounded-lg border border-gray-100 ">
        <div className="w-full  ">
            <div className=" ">
              <div className="">
                {/* <h2 className="text-[#606062] uppercase  tracking-[0.06em] text-[12px]">
                Cancel booking
                </h2> */}
                <div className="h-screen">
      <div className="flex ">
        <div
          id="bg-img"
          className="flex h-full max-w-2xl  flex-col  h-screen">
          <div className="relative mt-2 rounded-2xl  ">
            <div className="grid gap-8 grid-cols-1">
              <div className="flex flex-col ">
                <div className="mt-0">
                  <Formik
                    enableReinitialize={false}
                    initialValues={initialState}
                    validationSchema={validate}
                    onSubmit={handleSubmit}
                    // onSubmit={(values, { resetForm }) => {
                    //   console.log('values is', values)

                    //   setBookingProgress(true)
                    //   onSubmitSupabase(values, resetForm)
                    //   console.log(values)
                    // }}
                  >
                    {(formik, setFieldValue) => (
                      <Form>
                        <div className="form">
                          <section className=" ">
                            <div className="w-full mx-auto ">
                              <div className="relative flex flex-col min-w-0 break-words w-full rounded-2xl bg-white  ">
                                <div className=" flex flex-row  ">
                                  <section className="  rounded-md w-[540px]">
                                    <article className="">
                                      <div className="flex flex-row   border-b border-gray-200 justify-between">
                                        <section className="flex p-4 flex-row">
                                          <div className="inline">
                                            {/* <div className="mt-[7px]">
                                              <label className="text-[20px] font-medium text-[#000000]    mb-[2px]  ">
                                                Cancel Booking
                                                <abbr title="required"></abbr>
                                              </label>
                                            </div> */}
                                            <div>
                                            <h2 className='text-[#000000] font-outfit font-medium  text-[16px]'>Add Cancellation Details                                            </h2>
                                          </div>
                                          </div>
                                        </section>
                                        
                                      </div>
                                    </article>

                                    <div className="p-5">

  <div className="flex flex-col md:flex-row gap-8 mb-4">

    <div className="w-full ">
    <label className="block text-[#616162] font-normal text-[12px] leading-[100%] tracking-[0.06em] mb-1">Cancellation Charges</label>

      <TextField2
        // label="Cancellation Amount"
        name="amount"
        type="text"
        className="w-full h-10 border-0 border-b-[1.6px] border-[#E7E7E9] focus:border-[#E7E7E9] focus:ring-0 focus:outline-none sm:text-sm "
        value={formik?.values?.amount?.toLocaleString('en-IN')}
        onChange={(e) => {
          const value = e.target.value.replace(/,/g, '')
          if (!isNaN(value)) {
            const rawValue = Number(value)
            formik.setFieldValue('amount', rawValue)
          }
        }}
      />
    </div>

    <div className="w-full">
      <label className="text-xs text-[#616162]  font-outfit font-normal text-[12px] leading-[100%] tracking-[0.06em]">Cancellation Date</label>
      <div className="relative w-full">
        <CustomDatePicker
          className="w-full h-8  px-2 py-2 outline-none border-t-0 border-l-0 border-r-0 border-0 border-b-[1.6px] border-[#E7E7E9] border-solid text-[#191B1C] font-medium"
          label="Dated"
          name="dated"
          calendarClassName="z-[9999]"
          selected={formik.values.dated}
          onChange={(date) => {
            formik.setFieldValue('dated', date.getTime())
          }}
          dateFormat="MMM dd, yyyy"
        />
      </div>
    </div>
  </div>


  {/* <div className="w-full text-xs text-[#6A6A6A] mb-4">
    <TextField2
      label="Reason"
      name="payReason"
      type="text"
    />
  </div> */}


<div className="w-full text-xs text-[#6A6A6A] mb-4">
  <label className="block text-[#616162] font-outfit font-normal text-[12px] leading-[100%] tracking-[0.06em] mb-1">Reason</label>
  <TextField2
    name="payReason"
    type="text"
    className="w-full h-8  px-2 py-2 outline-none border-t-0 border-l-0 border-r-0 border-0 border-b-[1.6px] border-[#E7E7E9] border-solid text-[#000000] font-semibold"

  
  />
</div>



  <div className="text-center py-4">
    <button
      className="bg-[#EDE9FE] text-[#0E0A1F] text-sm py-2.5 px-24 font-semibold rounded-md inline-flex items-center shadow-sm hover:bg-[#DBD3FD] transition-all duration-200 focus:outline-none "
      type="submit"
      disabled={loading}
    >
      <span className='text-[16px] font-outfit '>Cancel Booking</span>
    </button>
  </div>
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
            </div>
  </div>
</div>









{showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative z-10">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <img src="/cancelpopup.svg" alt="" />
              </div>
            </div>
            <h2 className="font-medium text-[20px] leading-none tracking-[0.06em]  text-center mb-4">Cancel Booking</h2>
            <p className="text-center text-[#0E0A1F]  font-normal text-base leading-none tracking-normal mb-6">Are you sure you want to cancel Booking ?</p>
            <div className="flex space-x-4">
              <button 
                onClick={handleConfirmationNo}
                className="flex-1 py-3 bg-[#EDE9FE] hover:bg-gray-200 text-gray-800 rounded-md font-medium"
              >
                No
              </button>
              <button 
                onClick={handleConfirmationYes}
                className="flex-1 py-3 bg-white border border-[#0E0A1F] hover:bg-gray-50 text-gray-800 rounded-md font-medium"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}


    </>
  )
}

export default CancelUnitForm
