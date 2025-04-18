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
  streamGetAllUnitTransactions,
  updateTransactionStatus,
  updateUnblockProjectCounts,
  updateUnitAsBooked,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

const UnblockUnitForm = ({openUserProfile,  selUnitDetails, bookCompSteps, bookCurentStep }) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [selected, setSelected] = useState({})
  const [selDays, setSelDays] = useState(5)
  const [bookingProgress, setBookingProgress] = useState(true)
  const [unitTransactionsA, setUnitTransactionsA] = useState([])

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

    if (['customer_blocked'].includes(selUnitDetails?.status)) {
      const unitUpdate = {
        status: 'available',
        unblocked_on: Timestamp.now().toMillis(),
      }

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

      await updateUnblockProjectCounts(   orgId,
        selUnitDetails?.pId,selUnitDetails, user?.email, enqueueSnackbar)
        openUserProfile(false)
    } else {
      console.log('cannot be cancelled')
      enqueueSnackbar(`${selUnitDetails?.status} unit cannot be Unblocked`, {
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

  const initialState = {
    blockReason: '',
  }
  const validate = Yup.object({
    blockReason: Yup.string().required('Reason is Required'),
  })
  const resetter = () => {
    setSelected({})
    setFormMessage('')
  }
  return (
    <>
      <section className="mt-8">
        <div className="w-full  mx-auto mx-4  my-4 ">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 rounded-2xl bg-white border-0 ">
            {/* <div className="rounded-t bg-[#F1F5F9] mb-0 px-3 py-2">
              <div className="text-center flex justify-between">
                <p className="text-xs font-extrabold tracking-tight uppercase font-body my-1">
                  UnBlock Unit
                </p>
              </div>
            </div> */}
            <div className="mx-2 o my-10 mt-4 ">
              <div className="bg-white p-10 rounded-xl">
                <h1 className="text-center text-[#000000s] font-outfit font-medium text-[18px] leading-[100%] tracking-[0em]">
                  Are you Sure to Unblock this unit?
                </h1>

                <hr className="h-[1px] w-[300px] bg-gradient-to-r from-[#F6F5F8]/100 via-[#B1B1B1] to-[#F6F5F8]/100 border-0 my-4 mx-auto" />


                <Formik
                  initialValues={initialState}
                  validationSchema={validate}
                  onSubmit={(values, { resetForm }) => {
                    onSubmitFun(values, resetForm)
                    //
                    console.log('block unit values are ', values, selDays)
                  }}
                >
                  {(formik) => (
                    <Form className="mt-8">
                      <div className="flex justify-center gap-4">
                        <input
                          type="text"
                          name="blockReason"
                          placeholder="Write Unblock Reason"
                          className="w-full h-10 outline-none  rounded-[12px] border border-[#616162] gap-[10px] p-1"
                          onChange={(e) => {
                            formik.setFieldValue('blockReason', e.target.value)
                          }}
                        />
                        <ErrorMessage
                          component="div"
                          name={'blockReason'}
                          className="error-message text-red-700 text-xs p-1 mx-auto"
                        />
                        <button
                          type="submit"
                          className=" bg-[#EDE9FE] rounded-[8px] px-[5px] text-[12px] py-[8px] gap-[10px]  h-9 w-[120px]"
                        >
                          Unblock Unit
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            {bookingProgress && (
              <section className="mb-3 border rounded-[12px] mx-4  mb-4 border-[#E7E7E9] ">
                <div className="mx-auto flex mt-4 flex-row  ">
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
                      <span className="ml-2 font-outfit font-normal text-[16px] leading-[100%] tracking-[0em]">
                        Revert Payment
                      </span>
                    </div>
                  </section>
                  {/*  */}
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
                      <span className="ml-4 font-outfit font-normal text-[16px] leading-[100%] tracking-[0em] ">
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
                      <span className="ml-2 font-outfit font-normal text-[16px] leading-[100%] tracking-[0em] ">
                        Update Payment Projections
                      </span>
                    </div>
                  </section>
                  {/*  */}
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
                      <span className="ml-2 font-outfit font-normal text-[16px] leading-[100%] tracking-[0em]">
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
                      <span className="ml-2 font-outfit font-normal text-[16px] leading-[100%] tracking-[0em] ">
                        Send Canellation E-mail
                      </span>
                    </div>
                  </section>
                  {/*  */}
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
                      <span className="ml-2 font-outfit font-normal text-[16px] leading-[100%] tracking-[0em]">
                        Notified to Manager
                      </span>
                    </div>
                  </section>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default UnblockUnitForm
