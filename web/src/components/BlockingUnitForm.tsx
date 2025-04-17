/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { ErrorMessage, Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'

import {
  updateUnitAsBlocked,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

const BlockingUnitForm = ({
  title,
  dialogOpen,
  leadDetailsObj2,
  selUnitDetails,
  stepIndx,
  StatusListA,
}) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [selected, setSelected] = useState({})
  const [selDays, setSelDays] = useState(5)

  const onSubmitFun = async (data, resetForm) => {
    const { id, purpose, customerDetailsObj, secondaryCustomerDetailsObj } =
      leadDetailsObj2
    const { uid } = selUnitDetails

    const unitUpdate = {
      blocked_leadId: id || '',
      status: 'customer_blocked',
      blocked_by: customerDetailsObj?.Name || '',
      blockedOn: Timestamp.now().toMillis(),
      ct: Timestamp.now().toMillis(),
      Date: Timestamp.now().toMillis(),
    }
    updateUnitAsBlocked(
      orgId,
      leadDetailsObj2?.ProjectId,
      uid,
      id,
      unitUpdate,
      user?.email,
      enqueueSnackbar,
      resetForm
    )
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
      <section className="bg-blueGray-50 ">
        <div className="w-full  mx-auto ">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6  rounded-2xl bg-[#F9FBFB] border-0 ">
            {/* <div className="rounded-t bg-[#F1F5F9] mb-0 px-3 py-2">
              <div className="text-center flex justify-between">
                <p className="text-xs font-extrabold tracking-tight uppercase font-body my-1">
                  Block Unit
                </p>
              </div>
            </div> */}
            <div className="mx-2 o my-10 mt-4 ">
              <div className="bg-white p-10 rounded-xl">
                <h1 className="text-center text-[#000000s] font-outfit font-medium text-[18px] leading-[100%] tracking-[0em]">
                  How many days you want to block?
                </h1>

                <hr className="h-[1px] w-[300px] bg-gradient-to-r from-[#F6F5F8]/100 via-[#B1B1B1] to-[#F6F5F8]/100 border-0 my-4 mx-auto" />
                <div className="flex flex-wrap justify-center mt-10 space-x-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((days, i) => (
                    <option
                      key={i}
                      value={days}
                      onMouseEnter={() => setSelDays(days)}
                      onClick={() => setSelDays(days)}
                      className={`${
                        days === selDays ? 'bg-[#DBD3FD]  text-[] ' : ''
                      } flex items-center   border  border-[#E7E7E9] justify-center w-10 h-10  text-[#606062]   hover:bg-[#DBD3FD] hover:text-[#000000]  transition duration-150 rounded-full font-medium  cursor-pointer`}
                    >
                      {days}
                    </option>
                  ))}
                  {/* <span className="mt-[12px] text-sm text-gray-700 ">days</span> */}
                </div>
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
                    <Form className="mt-8 ">


                      <div className="flex justify-center gap-4">
                        <input
                          type="text"
                          name="blockReason"
                          placeholder="Write a blocking reason"
                          className="w-full h-10 outline-none  rounded-[12px] border border-[#616162] gap-[10px] p-1"
                          onChange={(e) => {
                            formik.setFieldValue('blockReason', e.target.value)
                            // handleFileUploadFun(
                            //   e.target.files[0],
                            //   'panCard1'
                            // )
                          }}
                        />
                        <ErrorMessage
                          component="div"
                          name={'blockReason'}
                          className="error-message text-red-700 text-xs p-1 mx-auto"
                        />


<button
                          type="submit"
                          className=" bg-[#EDE9FE] rounded-[8px] px-[5px] text-[12px] py-[8px] gap-[10px]  h-9 w-[70px]"
                        >
                          Block
                        </button>


                      </div>



<div className="text-center mt-10">
        <div className="inline-block border border-gray-200 text-center py-4 px-4  rounded-[10px] border-[#E7E7E9] block mt-6 font-outfit font-normal text-[14px] leading-[100%] tracking-[0.06em]">
          <p className="text-[12px">Blocking Unit for {selDays} days</p>
        </div>
      </div>

                    </Form>
                  )}
                </Formik>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default BlockingUnitForm
