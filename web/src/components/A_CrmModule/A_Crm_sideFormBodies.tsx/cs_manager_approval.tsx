/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from 'react'

import { OfficeBuildingIcon } from '@heroicons/react/outline'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'

import DocRow from 'src/components/LegalModule/Docu_row'
import { USER_ROLES } from 'src/constants/userRoles'
import { useAuth } from 'src/context/firebase-auth-context'
import CSManagerApprovalBody from './cs_manager_approval_body'
import CrmActivityLog from '../CrmActivityLog'

export default function CsMangerApprovalFlow({
  type,
  setStatusFun,
  selUnitPayload,
}) {
  const [selLoanBank, setLoanBank] = useState({})
  const [preSanctionReview, SetPreSanctionReview] = useState('In-Review')
  const [postSanctionReview, SetPostSanctionReview] = useState('In-Review')
  const [S1, setS1] = useState(true)
  const [S2, setS2] = useState(true)
  const [S3, setS3] = useState(true)
  const [S4, setS4] = useState(true)
  const [S5, setS5] = useState(true)
  const [S6, setS6] = useState(true)

  const { user } = useAuth()

  return (
    <div className="flex flex-row bg-white ">
      <section
        className="bg-white w-full md:px-10 md:mb-20 pb-[250px] overflow-auto no-scrollbar  h-[100%]  overflow-y-scroll"
        style={{ height: `calc(100vh - 60px)` }}
      >
        <div className="max-w-3xl mx-auto py-4 text-sm text-gray-700">
          <div className="mt-1">
            <div className="p-2 bg-gradient-to-r from-violet-50 to-pink-50 rounded-md flex flex-row justify-between">
              <h2 className="font-medium flex-grow">Cost Sheet Approval</h2>
              <p className="text-md text-[10px] flex-grow text-right">
                {selUnitPayload?.man_cs_rej_reason}
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto py-4 text-sm text-gray-700">
          <section className="flex flex-col">
            <section className=" ">
              <section className="flex flex-row justify-between">
                <section className="flex flex-row w-full">
                  <div className="rounded-full font-bold bg-gradient-to-r from-violet-200 to-pink-200 h-7 w-7 flex items-center justify-center mr-2">
                    <span className="text-[14px] mb-[2px]">1</span>
                  </div>
                  <p className="mt- pb-2 font-semibold text-gray-600  mt-[4px] mb-2 border-b w-full">
                    Manager Approval
                  </p>
                </section>

                {!S1 && (
                  <p className="mt- pb-2 font-semibold text-blue-600  mt-[4px] mb-2 mr-2 border-b w-[300px] text-right">
                    {selLoanBank?.bName || 'NA'}
                  </p>
                )}
                {S1 && (
                  <ArrowUpIcon
                    className="w-[14px] h-[14px]  mt-[8px] text-blue-600"
                    onClick={() => setS1(!S1)}
                  />
                )}
                {!S1 && (
                  <ArrowDownIcon
                    className="w-[18px] h-[18px] mt-[7px]"
                    onClick={() => setS1(!S1)}
                  />
                )}
              </section>
            </section>
            {S1 && (
              <section className="mt-1 ml-9 container">
                <CSManagerApprovalBody selUnitPayload={selUnitPayload} />
              </section>
            )}
          </section>
        </div>
      </section>
      <CrmActivityLog
        selUnitPayload={selUnitPayload}
        title="Cost Sheet Activity"
        type={['cs_approval']}
      />
    </div>
  )
}
