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
      <div className=" border-b border-gray-300  flex flex-row justify-between ">
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
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium text-center rounded-t-lg border-b-2 hover:text-blue  ${
              financeMode === d.val ? 'border-black text-black' : 'border-transparent'
            }`}
            type="button"
            role="tab"
            onClick={() => setFinanceMode(d.val)}
          >
            {/* <img alt="" src="/temp2.png" className="h-5 w-5" /> */}
            <span>{d.lab}</span>
          </button>
              </li>
            )
          })}
        </ul>

        <section className="flex flex-row">
  
          <div className="w-full flex items-center mt-3 mr-3 ">
            <label
              htmlFor="area"
              className="label font-regular text-sm font-bodyLato"
            >
            
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
