/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

import AddApplicantDetails from 'src/components/AddApplicantDetails'
import { USER_ROLES } from 'src/constants/userRoles'
import { updateKycApproval } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CrmActivityLog from '../CrmActivityLog'


export default function Cs_customerKyc({ selUnitPayload }) {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()


  const [rejectionReason, setRejectionReason] = useState('')
  const [rejection, setRejection] = useState(false)
  const [fillError, showFillError] = useState(false)




  


  useEffect(() => {
    console.log('selUnitPayload:', selUnitPayload)
    console.log('rejection reason:', selUnitPayload?.kyc_rejection_reason)
  }, [selUnitPayload])


  const submitManagerApproval = (status) => {
    const dataObj = {
      status: status,
      rejectionReason: rejection ? rejectionReason : null

    }
    updateKycApproval(
      orgId,
      selUnitPayload?.id,
      dataObj,
      user.email,
      enqueueSnackbar
    )
  }
  return (
    <div className='flex flex-row bg-white '>

    <section className="bg-white w-full md:px-10 md:mb-20 pb-[250px] overflow-auto no-scrollbar  h-[100%] overflow-y-scroll" style={{ height: `calc(100vh - 60px)` }}>
      <div className="max-w-3xl mx-auto py-4 text-sm text-gray-700">
        <div className="mt-1">
          <div className="p-2 bg-gradient-to-r from-violet-50 to-pink-50 rounded-md flex flex-row justify-between">
            <h2 className="font-medium flex-grow">Customer Kyc</h2>
            <p className="text-md text-[10px] flex-grow text-right">
              {/* Waiting for banker sanction{' '} */}
              {selUnitPayload?.kyc_rejection_reason}
            </p>
          </div>
        </div>
      </div>
      <AddApplicantDetails
        title="Booking Form"
        selUnitDetails={selUnitPayload}
        leadDetailsObj2={selUnitPayload}
        customerInfo={selUnitPayload?.custObj1}

      />
      <div className="mt-5 left-0 text-right md:space-x-3 md:block flex flex-col-reverse py-3 mr-6 flex flex-col mt-2 z-10 flex flex-row justify-between mt-2 pr-6 bg-white shadow-lg absolute bottom-0  w-full">
        
        
        

      {rejection &&    <div className="mt-">
                      <div className="flex justify-center border-2 py-2 px-6 px-10 mb-2 rounded-xl">
                        <input
                          type="text"
                          name="blockReason"
                          placeholder="Write Rejection Comments"
                          className="w-full outline-none text-gray-700 text-lg"
                          onChange={(e) => {
                            setRejectionReason(e.target.value)
                            // formik.setFieldValue('blockReason', e.target.value)

                          }}
                        />
                        {fillError && <div
                          // component="div"

                          // name={'blockReason'}
                          className="error-message text-red-700 text-xs p-1 mx-auto"
                        /> }
                        <button
                          type="submit"
                          className={`${rejectionReason.length>0 ? 'bg-[#ff9f87]' : 'bg-[#f9eeeb]'  }  text-gray-700 font-semibold px-6 py-2 rounded-xl text-md`}
                          onClick={() =>{
                            if(rejectionReason!==''){
                              showFillError(false)
                              submitManagerApproval('rejected')
              }else{
                showFillError(true)
              }
}}
                        >
                          Reject
                        </button>


                      </div>
                    </div>}
        
        <button
          className=" border  border-[#E3BDFF] text-black active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          type="submit"
          onClick={() => {
            setRejection(!rejection)
          }}
        >
          {'Reject'}
        </button>
        <button
          className="bg-[#e3bdff] text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          type="submit"
          onClick={() => {
            submitManagerApproval('approved')
          }}
        >
          {'Approve'}
        </button>
      </div>
    </section>
    <CrmActivityLog selUnitPayload={selUnitPayload} title="KYC Activity" type={['kyc_approval']}/>

    </div>
  )
}
