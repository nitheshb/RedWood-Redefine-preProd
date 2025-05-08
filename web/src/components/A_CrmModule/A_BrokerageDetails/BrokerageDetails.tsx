import { useState, useEffect } from 'react'
import { CheckCircleIcon, PencilIcon } from '@heroicons/react/solid'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'

import Loader from 'src/components/Loader/Loader'
import { useAuth } from 'src/context/firebase-auth-context'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'
import { TextField2 } from 'src/util/formFields/TextField2'
import {
  fetchBrokerageDetails,
  updateBrokerageDetails,
} from 'src/context/dbQueryFirebase'

const BrokerageDetails = ({ selUnitDetails }) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [existingBrokerage, setExistingBrokerage] = useState({})
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    setExistingBrokerage(selUnitDetails?.brokerageDetails || {})
    if (selUnitDetails?.brokerageDetails) {
      setEditMode(true)
    }
  }, [selUnitDetails])

  const onSubmitFun = async (data, resetForm) => {
    setLoading(true)
    try {
      console.log('Submitting form with data:', data)
      await updateBrokerageDetails(
        orgId,
        selUnitDetails?.pId,
        selUnitDetails?.id,
        data,
        user?.email,
        enqueueSnackbar,
        resetForm
      )
      console.log('Refreshing brokerage details...')
    } catch (error) {
      console.error('Error updating brokerage details:', error)
    } finally {
      setLoading(false)
    }
  }

  const datee = new Date().getTime()
  const initialState = {
    brokerName: selUnitDetails?.brokerageDetails?.brokerName || '',
    brokerageType:
      selUnitDetails?.brokerageDetails?.brokerageType || 'percentage',
    brokerageAmount: selUnitDetails?.brokerageDetails?.brokerageAmount || 0,
    transactionDate: selUnitDetails?.brokerageDetails?.transactionDate || datee,
  }

  console.log('Initial form values:', initialState)

  const validate = Yup.object({
    brokerName: Yup.string().required('Broker Name is Required'),
    brokerageAmount: Yup.number()
      .required('Brokerage Amount is Required')
      .positive('Brokerage Amount must be positive'),
    transactionDate: Yup.date().required('Transaction Date is Required'),
  })

  return (


         <>


<div className="overflow-y-scroll w-full items-center justify-center mx-auto min-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">
    
    
    <div className="relative min-h-screen mr-6">
      <div className="max-w-6xl bg-white rounded-[16px] mx-auto p-6">
        <h1 className="font-[Outfit] font-semibold text-[16px] leading-[100%] tracking-[0%] mb-6">Unit Details</h1>
        
        {/* Top summary card */}
        <div className="max-w-5xl mx-auto my-4 p-4 bg-white border border-[#e7e7e9] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] rounded-[16px]">
          <div className="flex flex-row divide-x divide-gray-200">
            <div className="flex-1 p-2 px-6 text-center">
              <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">  Eligible /Not</div>
              <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">NO Data</div>
            </div>
            
            <div className="flex-1 p-2 px-6 text-center">
              <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2"> Payable amount</div>
              <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">No Data</div>
            </div>
            
            <div className="flex-1 p-2 px-6 text-center">
              <div className="font-[Outfit] font-normal leading-[100%] tracking-[0%] mb-2">Payable Before</div>
              <div className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#606062] text-center">No Data</div>
            </div>
          </div>
        </div>
        
        {/* Main details card */}
        <div className="w-full h-full flex justify-center  z-10 relative">
          <div className="min-h-screen  mx-2 w-[60%] ">
            <div className=" max-w-xl	mx-auto">
              <div className="bg-white border border-[#E7E7E9] bg-[#FCFCFD] shadow-[0px_4px_30px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <section className="flex flex-row justify-between">
                    <h1 className="text-[20px] font-medium text-[#000000]    mb-[2px] ">
                      {selUnitDetails?.brokerageDetails != undefined
                        ? 'Edit Brokerage Details'
                        : 'Add Brokerage Details'}
                    </h1>
                    {editMode && (
                      <span
                        className="inline-flex items-center cursor-pointer p-2 bg-[#e8e6f6] hover:bg-gray-200 rounded-lg"
                        onClick={() => setEditMode(false)}
                      >
                        <PencilIcon className="w-4 h-4 cursor-pointer " />
                      </span>
                    )}
                  </section>
                </div>
                <div className="p-6">
                  {!editMode && (
                    <section>
                      <Formik
                        enableReinitialize={true}
                        initialValues={initialState}
                        // validationSchema={validate}
                        onSubmit={(values, { resetForm }) => {
                          onSubmitFun(values, resetForm)
                          console.log('values are', values)
                        }}
                      >
                        {(formik) => (
                          <Form>
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                  <label className="block text-[12px] mb-3 font-outfit font-medium text-[#616162]">
                                    Broker Name
                                  </label>
                                  <TextField2
                                    name="brokerName"
                                    type="text"
                                    className="mt-1 block w-full border-0 border-b-[1.6px] border-[#E7E7E9] focus:border-[#E7E7E9] focus:ring-0 focus:outline-none sm:text-sm"
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="block text-[12px]   font-outfit font-medium text-[#616162]  mb-1">
                                    Brokerage Type
                                  </label>
                                  <div className="flex space-x-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        formik.setFieldValue(
                                          'brokerageType',
                                          'percentage'
                                        )
                                      }
                                      className={`px-6 py-1  rounded-md text-sm border ${
                                        formik.values.brokerageType ===
                                        'percentage'
                                          ? 'bg-[#E8E6FE] text-[##0E0A1F] font-medium border-[#A59EFF] border-2'
                                          : 'bg-white text-[#0E0A1F] font-medium border-[#0E0A1F] border-2'
                                      }`}
                                    >
                                      Percentage
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        formik.setFieldValue(
                                          'brokerageType',
                                          'fixed'
                                        )
                                      }
                                      className={`px-6 py-1  rounded-md text-sm border ${
                                        formik.values.brokerageType === 'fixed'
                                          ? 'bg-[#E8E6FE] text-black font-medium border-[#A59EFF] border-2'
                                          : 'bg-white text-[#0E0A1F] font-medium border-[#0E0A1F] border-2'
                                      }`}
                                    >
                                      Fixed
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                  <label className="block text-[12px] mb-4  font-outfit font-medium text-[#616162]">
                                    Brokerage Amount
                                  </label>
                                  <TextField2
                                    name="brokerageAmount"
                                    type="number"
                                    //   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    className="mt-1 block w-full border-0 border-b-[1.6px] border-[#E7E7E9] focus:border-[#E7E7E9] focus:ring-0 focus:outline-none sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[12px] mb-3 font-medium text-[#616162]  font-outfit">
                                    Transaction Date
                                  </label>
                                  <div className="relative w-full border-0 border-b-[1.6px] border-[#E7E7E9]   focus-within:border-[#E7E7E9]">
                                    <CustomDatePicker
                                      selected={formik.values.transactionDate}
                                      onChange={(date) => {
                                        formik.setFieldValue(
                                          'transactionDate',
                                          date.getTime()
                                        )
                                      }}
                                      className="w-full bg-transparent outline-none text-sm"
                                      dateFormat="MMM dd, yyyy"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <button
                                  type="submit"
                                  disabled={loading}
                                  className="inline-flex items-center px-6 py-3 border border-transparent text-base   shadow-sm text-Black  bg-[#E8E6FE] px-6 py-2 mt-4 text-sm shadow-sm font-medium tracking-wider text-[#0E0A1F] hover:text-[#0E0A1F] rounded-lg hover:shadow-md hover:bg-[#DBD3FD] transition-all duration-200 focus:outline-none  flex items-center justify-center"
                                >
                                  {loading ? (
                                    <Loader className="w-5 h-5 mr-2" />
                                  ) : (
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                  )}
                                  {selUnitDetails?.brokerageDetails != undefined
                                    ? 'Update Brokerage Details'
                                    : 'Add Brokerage Details'}
                                </button>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </section>
                  )}
                  {/* Display Saved Data Section */}
                  {editMode && (
                    <div className="">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-sm text-gray-600">Broker Name</p>
                            <p className="text-lg font-medium text-gray-900">
                              {existingBrokerage.brokerName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Brokerage Type
                            </p>
                            <p className="text-lg font-medium text-gray-900">
                              {existingBrokerage.brokerageType}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Brokerage Amount
                            </p>
                            <p className="text-lg font-medium text-gray-900">
                              {existingBrokerage.brokerageAmount}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Transaction Date
                            </p>
                            <p className="text-lg font-medium text-gray-900">
                              {new Date(
                                existingBrokerage.transactionDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>
    </div>
  
  
  
  
  
  
  
  
  
  
  
  
  
  

        </div>











        
    {/* <div className="overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">
      <div className="relative min-h-screen mr-6">
        <div className="relative z-0">
          <h1 className="text-[#606062] font-outfit  mb-1  mx-auto w-full  tracking-[0.06em] font-heading font-medium text-[12px] uppercase mb-0">
            Brokerage Details
          </h1>

          <img
            alt="CRM Background"
            src="/crmfinal.svg"
            className="w-full h-auto object-cover"
          />

          <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  ">
              <div className="text-center space-y-2">
                <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                  Eligible /Not
                </p>
                <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                  No Data
                </h2>
              </div>
              <div className="text-center space-y-2">
                <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                  Payable amount
                </p>
                <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                  No Data
                </h2>
              </div>
              <div className="text-center space-y-2">
                <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                  Payable before
                </p>
                <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                  No Data
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full flex justify-center mt-[-70px] z-10 relative">
          <div className="min-h-screen  mx-2 w-[60%] ">
            <div className=" max-w-xl	mx-auto">
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <section className="flex flex-row justify-between">
                    <h1 className="text-[20px] font-medium text-[#000000]    mb-[2px] ">
                      {selUnitDetails?.brokerageDetails != undefined
                        ? 'Edit Brokerage Details'
                        : 'Add Brokerage Details'}
                    </h1>
                    {editMode && (
                      <span
                        className="inline-flex items-center cursor-pointer p-2 bg-[#e8e6f6] hover:bg-gray-200 rounded-lg"
                        onClick={() => setEditMode(false)}
                      >
                        <PencilIcon className="w-4 h-4 cursor-pointer " />
                      </span>
                    )}
                  </section>
                </div>
                <div className="p-6">
                  {!editMode && (
                    <section>
                      <Formik
                        enableReinitialize={true}
                        initialValues={initialState}
                        // validationSchema={validate}
                        onSubmit={(values, { resetForm }) => {
                          onSubmitFun(values, resetForm)
                          console.log('values are', values)
                        }}
                      >
                        {(formik) => (
                          <Form>
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                  <label className="block text-[12px] mb-3 font-outfit font-medium text-[#616162]">
                                    Broker Name
                                  </label>
                                  <TextField2
                                    name="brokerName"
                                    type="text"
                                    className="mt-1 block w-full border-0 border-b-[1.6px] border-[#E7E7E9] focus:border-[#E7E7E9] focus:ring-0 focus:outline-none sm:text-sm"
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="block text-[12px]   font-outfit font-medium text-[#616162]  mb-1">
                                    Brokerage Type
                                  </label>
                                  <div className="flex space-x-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        formik.setFieldValue(
                                          'brokerageType',
                                          'percentage'
                                        )
                                      }
                                      className={`px-6 py-1  rounded-md text-sm border ${
                                        formik.values.brokerageType ===
                                        'percentage'
                                          ? 'bg-[#E8E6FE] text-[##0E0A1F] font-medium border-[#A59EFF] border-2'
                                          : 'bg-white text-[#0E0A1F] font-medium border-[#0E0A1F] border-2'
                                      }`}
                                    >
                                      Percentage
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        formik.setFieldValue(
                                          'brokerageType',
                                          'fixed'
                                        )
                                      }
                                      className={`px-6 py-1  rounded-md text-sm border ${
                                        formik.values.brokerageType === 'fixed'
                                          ? 'bg-[#E8E6FE] text-black font-medium border-[#A59EFF] border-2'
                                          : 'bg-white text-[#0E0A1F] font-medium border-[#0E0A1F] border-2'
                                      }`}
                                    >
                                      Fixed
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                  <label className="block text-[12px] mb-4  font-outfit font-medium text-[#616162]">
                                    Brokerage Amount
                                  </label>
                                  <TextField2
                                    name="brokerageAmount"
                                    type="number"
                                    //   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    className="mt-1 block w-full border-0 border-b-[1.6px] border-[#E7E7E9] focus:border-[#E7E7E9] focus:ring-0 focus:outline-none sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[12px] mb-3 font-medium text-[#616162]  font-outfit">
                                    Transaction Date
                                  </label>
                                  <div className="relative w-full border-0 border-b-[1.6px] border-[#E7E7E9]   focus-within:border-[#E7E7E9]">
                                    <CustomDatePicker
                                      selected={formik.values.transactionDate}
                                      onChange={(date) => {
                                        formik.setFieldValue(
                                          'transactionDate',
                                          date.getTime()
                                        )
                                      }}
                                      className="w-full bg-transparent outline-none text-sm"
                                      dateFormat="MMM dd, yyyy"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <button
                                  type="submit"
                                  disabled={loading}
                                  className="inline-flex items-center px-6 py-3 border border-transparent text-base   shadow-sm text-Black  bg-[#E8E6FE] px-6 py-2 mt-4 text-sm shadow-sm font-medium tracking-wider text-[#0E0A1F] hover:text-[#0E0A1F] rounded-lg hover:shadow-md hover:bg-[#DBD3FD] transition-all duration-200 focus:outline-none  flex items-center justify-center"
                                >
                                  {loading ? (
                                    <Loader className="w-5 h-5 mr-2" />
                                  ) : (
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                  )}
                                  {selUnitDetails?.brokerageDetails != undefined
                                    ? 'Update Brokerage Details'
                                    : 'Add Brokerage Details'}
                                </button>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </section>
                  )}

                  {editMode && (
                    <div className="">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-sm text-gray-600">Broker Name</p>
                            <p className="text-lg font-medium text-gray-900">
                              {existingBrokerage.brokerName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Brokerage Type
                            </p>
                            <p className="text-lg font-medium text-gray-900">
                              {existingBrokerage.brokerageType}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Brokerage Amount
                            </p>
                            <p className="text-lg font-medium text-gray-900">
                              {existingBrokerage.brokerageAmount}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Transaction Date
                            </p>
                            <p className="text-lg font-medium text-gray-900">
                              {new Date(
                                existingBrokerage.transactionDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> */}

         
         
         </>


















  )
}

export default BrokerageDetails
