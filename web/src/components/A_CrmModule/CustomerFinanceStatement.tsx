import { useState, useEffect, useRef } from 'react'
import { PDFExport } from '@progress/kendo-react-pdf'


import { useAuth } from 'src/context/firebase-auth-context'
import CrmUnitPaymentSchedule from './CrmPaymentSchedule'
import CrmPaymentSummary from './CrmPaymentSummary'
import CrmUnitCustomerDetailsView1 from './CrmUnitCustomerDetailsView1'
import CrmUnitFinanceHistory from './CrmUnitFinanceHistory'
import CrmUnitHeader from './CrmUnitHeader'
import PdfTransactionsGenerator from 'src/util/PdfTransactionsGenerator'
import PdfPaymentScheduleGenerator from 'src/util/PdfPaymentScheduleGenerator'
import CrmUnitCostSheetView from './CrmCostSheetView'

const CrmUnitPsHome = ({
  financeMode,
  setFinanceMode,
  selCustomerPayload,
  assets,
  totalIs,
  PSa,
  unitTransactionsA,
}) => {
  const { user } = useAuth()
  const pdfPaymentScheduleComp = useRef(null)
  const pdfTransactionComp = useRef(null)
  const { orgId } = user
  const [showHeader, setShowHeader] = useState(false)

  return (
    <>
      <div className=" border-gray-800 flex flex-row justify-between bg-[#F6F7FE]">
        <ul
          className="flex justify-  rounded-t-lg  ml-2"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          {[
               {
                lab: 'Transactions',
                val: 'transactions',
              },
            { lab: 'Payment Schedule', val: 'schedule' },

            { lab: 'Cost Sheet', val: 'cost_sheet' },

          ].map((d, i) => {
            return (
              <li key={i} className="mr-2 font-bodyLato" role="presentation">
                <button
                  className={`inline-block py-3 mr-4 text-sm font-medium text-center rounded-t-lg border-b-2  hover:text-blue hover:border-gray-300   ${
                    financeMode === d.val
                      ? 'border-[#1B97F2] border-b-3'
                      : 'border-transparent'
                  }`}
                  type="button"
                  role="tab"
                  onClick={() => setFinanceMode(d.val)}
                >
                  {`${d.lab} `}

                </button>
              </li>
            )
          })}
        </ul>

        <section className="flex flex-row bg-[#F6F7FE]">
  
          <div className="w-full flex items-center mt-3 mr-3 ">
            <label
              htmlFor="area"
              className="label font-regular text-sm font-bodyLato"
            >
              Bank Split
            </label>
          </div>
        </section>
      </div>
      {financeMode === 'schedule' && (
        <>
          <PDFExport paperSize="A4" margin="1cm" ref={pdfPaymentScheduleComp}>

            {showHeader && (
              <>
                <CrmUnitHeader projectDetails={selCustomerPayload} />
                <CrmUnitCustomerDetailsView1
                  Name={selCustomerPayload?.customerName1}
                  Mobile={selCustomerPayload?.phoneNo1}
                  netTotal={12345}
                  selCustomerPayload={selCustomerPayload}
                  assets={assets}
                />
              </>
            )}
            {/* <CrmPaymentSummary
              selCustomerPayload={selCustomerPayload}
              assets={assets}
            /> */}
            <CrmUnitPaymentSchedule
              selCustomerPayload={selCustomerPayload}
              assets={assets}
              totalIs={totalIs}
            />
          </PDFExport>
        </>
      )}
      {financeMode === 'cost_sheet' && (
        <>
          <PDFExport paperSize="A4" margin="1cm" ref={pdfPaymentScheduleComp}>
            <CrmUnitCostSheetView
                selCustomerPayload={selCustomerPayload}
                assets={assets}
                totalIs={totalIs}
              />
          </PDFExport>
        </>
      )}
      {financeMode === 'transactions' && (
        <>
          <PDFExport paperSize="A4" margin="1cm" ref={pdfTransactionComp}>
            {showHeader && (
              <>
                <CrmUnitHeader projectDetails={selCustomerPayload} />

                <CrmUnitCustomerDetailsView1
                  Name={selCustomerPayload?.customerName1}
                  Mobile={selCustomerPayload?.phoneNo1}
                  netTotal={12345}
                  selCustomerPayload={selCustomerPayload}
                  assets={assets}
                />
              </>
            )}
            {/* <CrmPaymentSummary
              selCustomerPayload={selCustomerPayload}
              assets={assets}
            /> */}
            <CrmUnitFinanceHistory
              selCustomerPayload={selCustomerPayload}
              assets={assets}
              totalIs={totalIs}
              unitTransactionsA={unitTransactionsA}
            />
          </PDFExport>
        </>
      )}
    </>
  )
}

export default CrmUnitPsHome
