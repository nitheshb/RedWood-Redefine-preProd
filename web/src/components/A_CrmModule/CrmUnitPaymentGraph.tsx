import { useState, useEffect, useRef } from 'react'

import { LinearProgress } from '@mui/material'

import { useAuth } from 'src/context/firebase-auth-context'
import { computeTotal } from 'src/util/computeCsTotals'
import DoughnutChartWithRoundedSegments from '../A_SalesModule/Reports/charts/piechartRounded'

const CrmUnitPaymentGraph = ({ selCustomerPayload }) => {
  const { user } = useAuth()

  const { orgId } = user
  const [partATotal, setPartA] = useState(0)
  const [partBTotal, setPartB] = useState(0)
  const [addOnTotal, setPartAddOn] = useState(0)

  const [unitTotal, setUnitTotal] = useState(0)

  console.log('payload is ', selCustomerPayload)
  useEffect(() => {
    const a =
      selCustomerPayload?.plotCS?.reduce(
        (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
        0
      ) || 0
    const b =
      selCustomerPayload?.addChargesCS?.reduce(
        (partialSum, obj) =>
          partialSum +
          Number(
            computeTotal(
              obj,
              selCustomerPayload?.super_built_up_area ||
                selCustomerPayload?.area?.toString()?.replace(',', '')
            )
          ),
        0
      ) || 0

      const c = selCustomerPayload?.addOnCS?.reduce(
        (partialSum, obj) =>
          partialSum +
          Number(
            computeTotal(
              obj,
              selCustomerPayload?.super_built_up_area || selCustomerPayload?.area?.toString()?.replace(',', '')
            )
          ),
        0
      ) || 0
    setPartA(a)
    setPartB(b)
    setPartAddOn(c)
    console.log('value is ', a, b)
    setUnitTotal(a + b + c)
  }, [selCustomerPayload])

  return (
    <section className="flex flex-col  rounded-md ">
      <>
      <div className="flex flex-col border bg-white rounded-xl shadow my-1  px-2  py-3 pb-4 min-w-[140px] h-[82px]  justify-between mx-">
                                <div className="flex flex-row justify-between mx- mb-2">
                                  <DoughnutChartWithRoundedSegments
                                    progress={
                                      (selCustomerPayload?.T_review / selCustomerPayload?.T_total) *
                                      100
                                    }
                                  />
                                  <section className="font-bodyLato font-semibold text-xs m-1 w-[61%] ">
                                    <section className="flex flex-col  w-full mt-">
                                    <p className="flex flex-row justify-between text-zinc-500 text-[11px] font-normal font-['Lato'] tracking-wide">
                                        Unit Cost: ₹
                                        <div>
                                          {(
                                            selCustomerPayload?.T_total || selCustomerPayload?.T_Total
                                          )?.toLocaleString('en-IN')}
                                        </div>
                                      </p>

                                      <div className="text-zinc-500 flex flex-row justify-between text-[11px] font-normal font-['Lato'] tracking-wide">
                                        Paid: ₹
                                        <div>
                                          {' '}
                                          {(
                                            (selCustomerPayload?.T_review || 0) +
                                            (selCustomerPayload?.T_approved || 0)
                                          ).toLocaleString('en-IN') || 0}
                                        </div>
                                      </div>

                                      <div className="text-zinc-800 flex flex-row justify-between text-[11px] font-normal font-['Lato'] tracking-wide">
                                        Balance:₹
                                        <div className="text-zinc-900 text-[11px] font-bold  tracking-wide">
                                          {selCustomerPayload?.T_balance?.toLocaleString(
                                            'en-IN'
                                          )}
                                        </div>
                                      </div>
                                    </section>
                                  </section>
                                </div>
                              </div>

      </>
    </section>
  )
}

export default CrmUnitPaymentGraph
