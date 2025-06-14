/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect } from 'react'

import { useSnackbar } from 'notistack'

import { USER_ROLES } from 'src/constants/userRoles'
import { updateATSApproval } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CrmActivityLog from '../CrmActivityLog'

export default function Crm_ATS_approval({
  type,
  setStatusFun,
  selUnitPayload,
}) {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()


  useEffect(() => {
    console.log('yo yo ', selUnitPayload)
  }, [])
  const submitManagerApproval = (status) => {
    const dataObj = {
      status: status,
    }
    updateATSApproval(
      orgId,
      selUnitPayload?.id,
      dataObj,
      user.email,
      enqueueSnackbar
    )
 

  }
  return (
    <div className='flex flex-row bg-white '>
    <section className="bg-white w-full md:px-10 md:mb-20 pb-[250px] overflow-auto no-scrollbar  h-[100%] overflow-y-scroll">
      <div className="max-w-3xl mx-auto py-4 text-sm text-gray-700">
        <div className="mt-1">
          <div className="p-2 bg-gradient-to-r from-violet-50 to-pink-50 rounded-md flex flex-row justify-between">
            <h2 className="font-medium flex-grow">Unit ATS</h2>
            <p className="text-md text-[10px] flex-grow text-right">
              Waiting for banker sanction{' '}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 left-0 text-right md:space-x-3 md:block flex flex-col-reverse py-3 mr-6 flex flex-col mt-2 z-10 flex flex-row justify-between mt-2 pr-6 bg-white shadow-lg absolute bottom-0  w-full">
        <button
          className="bg-red-400 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          type="submit"
          onClick={() => {
            submitManagerApproval('rejected')
          }}
        >
          {'Reject'}
        </button>
        <button
          className="bg-green-400 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          type="submit"
          onClick={() => {
            submitManagerApproval('approved')
          }}
        >
          {'Approve'}
        </button>
      </div>
    </section>
    <CrmActivityLog selUnitPayload={selUnitPayload} title="ATS Approval Activity" type={['ats_approval']}/>

    </div>
  )
}
