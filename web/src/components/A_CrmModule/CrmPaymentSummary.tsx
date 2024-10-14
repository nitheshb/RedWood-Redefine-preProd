import { useState, useEffect, useRef } from 'react'

import { LinearProgress } from '@mui/material'

import { useAuth } from 'src/context/firebase-auth-context'
import RoundedProgressBar from '../A_SalesModule/Reports/charts/horizontalProgressBar'

const CrmPaymentSummary = ({ selCustomerPayload }) => {
  const { user } = useAuth()

  const { orgId } = user

  return (
    <section className="flex flex-col  rounded-md ">
      <>
        <div className="flex flex-col bg-white shadow rounded-xl my-1  px-2  pt-2 min-w-[260px]">
          <div className="flex flex-row justify-between tracking-wide mx-">

            <h6 className="font-bodyLato font-semibold text-xs m-1 flex flex-col">
            <span className="tracking-wide  font-semibold text-[16px]">
            ₹{selCustomerPayload?.T_elgible_balance <0 ? 0: selCustomerPayload?.T_elgible_balance?.toLocaleString('en-IN')}</span><span className="text-[#637381] tracking-wide font-thin">Stage Balance</span>

            </h6>
            <section className="flex flex-row">
              {/* <h6 className="font-bodyLato font-semibold text-xs m-1 mb-2">
                {selCustomerPayload?.T_elgible?.toLocaleString('en-IN')}
              </h6> */}

              <h6 className="font-bodyLato font-semibold text-xs m-1 flex flex-col text-right">

              ₹{((selCustomerPayload?.T_review || 0) +(selCustomerPayload?.T_approved || 0 ))?.toLocaleString('en-IN')}
              <span className="text-[#637381] tracking-wide font-thin">Paid</span>
            </h6>
            </section>
          </div>
          <div className="flex flex-row mx-1">
          <RoundedProgressBar progress={
                                      (((selCustomerPayload?.T_review || 0) +
                                      (selCustomerPayload?.T_approved || 0) )/ selCustomerPayload?.T_elgible) *
                                      100
                                    }/>
          </div>
          <div className="flex flex-row justify-between mx-">
            <h6 className="font-bodyLato font-semibold text-xs m-1 mb-2">

            </h6>
            <section className="flex flex-row">
              {/* <h6 className="font-bodyLato font-semibold text-xs m-1 mb-2">
                {selCustomerPayload?.T_elgible?.toLocaleString('en-IN')}
              </h6> */}
              <h6 className="font-bodyLato font-semibold text-xs m-1 mb-2">
              <span className="text-[#637381] tracking-wide font-thin">Stage Cost:</span> {' '}₹{selCustomerPayload?.T_elgible?.toLocaleString('en-IN')}
              </h6>
            </section>
          </div>
        </div>
      </>

      {/* <section className="flex flow-row justify-between mb-1">
        <div className="font-md text-xs text-gray-500  tracking-wide">
          Total Review
        </div>
        <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
          Rs {selCustomerPayload?.T_review?.toLocaleString('en-IN')}
        </div>
      </section>
      <section className="flex flow-row justify-between mb-1">
        <div className="font-md text-xs text-gray-500  tracking-wide">
          Out Standing Balance
        </div>
        <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
          Rs {selCustomerPayload?.T_balance?.toLocaleString('en-IN')}
        </div>
      </section> */}
    </section>
  )
}

export default CrmPaymentSummary
