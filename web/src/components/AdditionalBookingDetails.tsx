/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from 'react'
import { setHours, setMinutes } from 'date-fns'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import {
  updateLeadCustomerDetailsTo,
  steamUsersListByRole,
  updateUnitCustomerDetailsTo,
  streamMasters,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { TextField } from 'src/util/formFields/TextField'


const AdditonalBookingDetails = ({
  source,
  title,
  customerInfo,
  setCustomerInfo,
  additionalInfo,
  setAdditonalInfo,
  leadDetailsObj2,
  selUnitDetails,
  dialogOpen,
  setShowApplicantEdit,
  setOnStep,
  currentMode,
  stepIndx,
  setStepIndx,
  StatusListA,
}) => {
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId } = user
  const [usersList, setusersList] = useState([])
  const [isMover, setIsMover] = useState(false)










  useEffect(() => {
    console.log('yo yo ', selUnitDetails, leadDetailsObj2)
  }, [])

  useEffect(() => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })
        console.log('fetched users list is', usersListA)

        setusersList(usersListA)
      },
      (error) => setusersList([])
    )

    return unsubscribe
  }, [])
  useEffect(() => {
    console.log('new customer object', leadDetailsObj2)
  }, [leadDetailsObj2])

  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)

  const uid = selUnitDetails?.uid || selUnitDetails?.id
  const datee = new Date().getTime()
  const initialState = {
    aggrementAddress:
      leadDetailsObj2?.aggrementDetailsObj?.aggrementAddress ||
      additionalInfo?.aggrementDetailsObj?.aggrementAddress ||
      additionalInfo?.aggrementAddress ||
      '',
    industry: leadDetailsObj2?.industry || additionalInfo?.industry || '',

    leadSource:
      leadDetailsObj2?.Source || selUnitDetails?.leadSource || '',
    sourceOfPay:
      leadDetailsObj2?.Status === 'booked'
        ? leadDetailsObj2[`${uid}_otherInfo`]?.sourceOfPay
        : additionalInfo?.sourceOfPay || selUnitDetails?.sourceOfPay || '',
    purpose:
      leadDetailsObj2?.Status === 'booked'
        ? leadDetailsObj2[`${uid}_otherInfo`]?.purpose
        : additionalInfo?.purpose || selUnitDetails?.purpose || '',
    bookedOn: additionalInfo?.bookedOn ||selUnitDetails?.bookedOn || d,

    purchasePurpose: leadDetailsObj2?.purchasePurpose || '',
 
    bookingSource: leadDetailsObj2?.bookingSource || '',
    bookedBy:
      leadDetailsObj2?.bookedBy ||
      leadDetailsObj2?.assignedToObj?.label ||
      additionalInfo?.bookedBy || selUnitDetails?.bookedBy ||
      '',

    referralName: '',
    annualIncome:
      leadDetailsObj2?.annualIncome || additionalInfo?.annualIncome || '',
    designation:
      leadDetailsObj2?.designation || additionalInfo?.designation || '',
  }





  const [sourceListItemsA, setSourceListItems] = useState([]);



  useEffect(() => {
    const unsubscribe = streamMasters(
      orgId,
      (querySnapshot) => {
        const bankA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          return x
        })

        console.log('fetched users list is', bankA)
        // step 3: filter and set values to each title
        if (bankA?.length > 0) {


          const qA = bankA.filter((item) => item.title === 'Lead Source')


          setSourceListItems(qA.sort((a, b) => {
            return a.order - b.order;
          }));


        }
      },
      (error) => setRows([])
    )

    return unsubscribe
  }, [])











  // Custom PAN card validation function


  const onSubmit = async (data, resetForm) => {
    console.log('customer details form', data)
    const {
      aggrementAddress,
      industry,
      designation,
      annualIncome,
      leadSource,
      sourceOfPay,
      purpose,
      bookingSource,
      bookedBy,
      purchasePurpose,
      bookedOn,
      referralName,
    } = data
    const { uid } = selUnitDetails

    const aggrementDetailsObj = {
      aggrementAddress,
    }

    const xData = {}
    xData[`${uid}${'_source_of_pay'}`] = { self: 20, bank: 80 } // sourceOfPay
    xData[`${uid}${'_otherInfo'}`] = {
      leadSource,
      sourceOfPay,
      purpose,
      referralName,

    }










    const updateDoc = {
      aggrementDetailsObj,
      industry,
      designation,
      annualIncome,
      bookingSource,
      bookedBy,
      purchasePurpose,
      leadSource,
      sourceOfPay,
      purpose,
      referralName,

    }
    setAdditonalInfo(data)
    const { id } = leadDetailsObj2
    console.log('did you find my id', id, leadDetailsObj2)

    if (source === 'fromBookedUnit') {
      updateUnitCustomerDetailsTo(
        orgId,
        selUnitDetails?.uid,
        updateDoc,
        'nitheshreddy.email@gmail.com',
        enqueueSnackbar,
        resetForm
      )
    } else {
      updateLeadCustomerDetailsTo(
        orgId,
        id,
        updateDoc,
        'nitheshreddy.email@gmail.com',
        enqueueSnackbar,
        resetForm
      )
      updateUnitCustomerDetailsTo(
        orgId,
        selUnitDetails?.uid,
        updateDoc,
        'nitheshreddy.email@gmail.com',
        enqueueSnackbar,
        resetForm
      )
    }
    if(isMover){
    setOnStep('costsheet')
   }
  }
  const bgImgStyle = {
    backgroundImage:
      'url("https://images.unsplash.com/photo-1605106715994-18d3fecffb98?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
  return (
    <>
      <div className=" ">
        <div className="grid gap-8 grid-cols-1">
          <div className="flex flex-col  bg-white ">
            <div className="mt-0">
              <Formik
                enableReinitialize={true}
                initialValues={initialState}
                onSubmit={(values, { resetForm }) => {
                  console.log('formik submitted',source, values, resetForm)
                  onSubmit(values, resetForm)
                }}
              >
                {(formik) => (
                  <Form>
                    <div className="form">

                      <section className=" bg-blueGray-50">
                        <div className="w-full mx-auto ">
                          <div className="relative flex flex-col min-w-0 break-words w-full mb-6  bg-[#F9FBFB] border rounded-[12px]">
                            <div className="flex-auto">
                              <section className=" ">


                                <div>

                                </div>

                                <section
                                  className=" m-2 rounded-[20px]  bg-[#fff]"
                                  style={{ boxShadow: '0 1px 12px #f2f2f2' }}
                                >
                                  <section className="flex bg-[#EDEDED] p-4 mt-1 rounded-t-[20px] flex-row">
                                    <div className="w-full flex flex-col">
                                      <div className=" flex flex-row gap-2 ">
                                        <div>
                                          <section className="flex flex-row">
                                            <h6 className="text-black text-[14px] mt-[2px] mb- font-bold">
                                              Additional Information
                                            </h6>
                                          </section>
                                          <div className="w-[455.80px] opacity-50 text-blue-950  text-[12px] font-normal ">
                                            These details are helpful to understand customer better.
                                          </div>

                                        </div>

                                        <div></div>
                                      </div>

                                   
                                    </div>
                                  </section>

                                  <div className='p-4'>

                                  <h6 className="text-blueGray-400  text-[14px] mt-3 mb- font-bold mt-8">
                                    Other Information
                                  </h6>
                                  <div className="border-t-4 rounded-xl w-16 mt-1 mb-3 border-[#8b5cf6]"></div>

                                  <div className="flex flex-wrap">
                                    <div className="w-full lg:w-12/12 px-4">
           
                                    </div>
                                    <div className="w-1/2 lg:w-12/12 ">
                                      <div className="relative w-full mb-3">
                    


<CustomSelect
  name="sourceOfPay"
  label="Source of payment/source"
  className="input"
  onChange={(value) => {
    formik.setFieldValue('sourceOfPay', value.value);
  }}
  value={formik.values.sourceOfPay}
  options={[
    { value: 'self-funding', label: 'Self Funding' },
    { value: 'bank-loan', label: 'Bank loan' },
  ]}
/>

                                      </div>
                                    </div>
                                    <div className="w-1/2 lg:w-12/12 px-4">
                                      <div className="relative w-full mb-3">
               

<CustomSelect
  name="purpose"
  label="Purpose of purchase"
  className="input"
  onChange={(value) => {
    formik.setFieldValue('purpose', value.value);
  }}
  value={formik.values.purpose}
  options={[
    { value: 'primary-residence', label: 'Primary Residence' },
    { value: 'second-home', label: 'Second Home' },
    { value: 'investment', label: 'Investment' },
    { value: 'rental', label: 'Rental Property' },
    { value: 'retirement-home', label: 'Retirement Home' },
    { value: 'commercial-use', label: 'Commercial Use' },
    { value: 'land-acquisition', label: 'Land Acquisition' },
    { value: 'development', label: 'Development' },
    { value: 'gift', label: 'Gift' },
    { value: 'grant', label: 'Grant' },
    { value: 'corporate-funding', label: 'Corporate Funding' },
    { value: 'government-assistance', label: 'Government Assistance' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'other', label: 'Other' },
  ]}
/>



                                      </div>
                                    </div>


                                  </div>

                                  </div>


                                  <section className="rounded-md  p-4 pl-0 mt-2 ">
                                    <div className='p-4'>
                                    <h6 className="text-blueGray-400 text-[14px] mt-3  font-bold ">
                                      Booked By
                                    </h6>
                                    <div className="border-t-4 rounded-xl w-16 mt-1 mb-3 border-[#8b5cf6]"></div>

                                    <div className="flex flex-wrap mt-4">


                                      <div className="w-full lg:w-4/12 ">
                                        <div className="relative w-full mb-3">
                          
                                          <CustomSelect
                                            name="bookedBy"
                                            label="Booking By"
                                            className="input"
                                            onChange={(value) => {
                                              formik.setFieldValue(
                                                'bookedBy',
                                                value.value
                                              )
                                            }}
                                            value={formik.values.bookedBy}
                                            options={usersList}
                                          />
                                        </div>
                                      </div>
                                      <div className="w-full lg:w-4/12 px-4">
                                        <div className="relative w-full mb-3">
                                          <label className="text-gray-500 text-[12px]">
                                            Booked On
                                          </label>
                                          <span className="inline">
                                            <CustomDatePicker
                                              className="h-8 outline-none border-radius rounded-md  px-2 border-[#cccccc] border-gray-500 text-sm mt-[-4px] pb-1  w-[90%] inline  w-full flex bg-grey-lighter text-grey-darker border border-gray-500 "
                                              label="Dated"
                                              name="bookedOn"
                                              selected={formik.values.bookedOn}
                                              onChange={(date) => {
                                                formik.setFieldValue(
                                                  'bookedOn',
                                                  date
                                                )
    
                                              }}
                                              timeFormat="HH:mm"
                                              injectTimes={[
                                                setHours(setMinutes(d, 1), 0),
                                                setHours(setMinutes(d, 5), 12),
                                                setHours(setMinutes(d, 59), 23),
                                              ]}
                                              dateFormat="MMM dd, yyyy"
                                            />
                                          </span>
                                        </div>
                                      </div>
                                      <div className="w-full lg:w-4/12 px-4">
                                        <div className="relative w-full">
                                          <div className="w-full flex flex-col mb-3">
                                            <CustomSelect
                                              name="leadSource"
                                              label="Lead Source"
                                              className="input"
                                              onChange={(value) => {
                                                formik.setFieldValue(
                                                  'leadSource',
                                                  value.value
                                                )
                                              }}
                                              value={formik.values.leadSource}
                                              options={sourceListItemsA}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="w-full lg:w-4/12 ">
                                        <div className="relative w-full">
                                          <div className="w-full flex flex-col mb-3">
                                            <TextField
                                              label="Referral Name"
                                              name="referralName"
                                              type="text"

                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    </div>
                                  </section>
                                </section>


                                <hr className="mt-3 border-b-1 border-blueGray-300" />
                              </section>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                    <div className="mt-5 text-right  md:block flex flex-col-reverse py-3 mr-6 flex flex-col mt-2 z-10 flex flex-row justify-between mt-2 pr-6 bg-white shadow-lg absolute bottom-0  w-full">
                      {setShowApplicantEdit != undefined && (
                        <button
                          className="bg-red-400 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                          disabled={loading}
                          onClick={() => setShowApplicantEdit(false)}
                        >
                          {'Cancel'}
                        </button>
                      )}

                      <button
                        className="mb-2 mr-0 md:mb-0  hover:scale-110 focus:outline-none              hover:bg-[#5671fc]
bg-gradient-to-r from-violet-600 to-indigo-600
text-black

 duration-200 ease-in-out
transition
 px-5 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-green-500
 bg-cyan-600 px-5 py-[6px] text-sm shadow-sm font-medium mr-2 tracking-wider text-white  rounded-md hover:shadow-lg"
                        type="submit"
                        disabled={loading}
                        onClick={()=>{
                          setIsMover(false)
                        }}
                      >

                        <span> {'Save'}</span>
                      </button>
                      {setShowApplicantEdit == undefined && (
                        <button
                          className="mb-2 mr-0 md:mb-0  hover:scale-110 focus:outline-none              hover:bg-[#5671fc]
bg-gradient-to-r from-violet-600 to-indigo-600
text-black

 duration-200 ease-in-out
transition
 px-5 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-green-500
 bg-cyan-600 px-5 py-[6px] text-sm shadow-sm font-medium mr-3 tracking-wider text-white  rounded-md hover:shadow-lg"
                          type="submit"
                          disabled={loading}
                          onClick={()=>{
                            setIsMover(true)
                          }}
                        >
                          <span> {'Save & Next'}</span>
                        </button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default AdditonalBookingDetails
function setRows(arg0: undefined[]) {
  throw new Error('Function not implemented.')
}

