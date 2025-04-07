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
import { CountUpComp } from '../comps/countUpComp'

const CrmUnitPsHome = ({
  // financeMode,
  // setFinanceMode,
  selCustomerPayload,
  projectDetails,
  assets,
  totalIs,
  PSa,
  unitTransactionsA,
  grossUnitTotal,
}) => {
  const { user } = useAuth()
  const pdfPaymentScheduleComp = useRef(null)
  const pdfTransactionComp = useRef(null)
  const { orgId } = user
  const [showHeader, setShowHeader] = useState(false)

  const [financeMode, setFinanceMode] = useState('cost_sheet')


  return (
    <>



    <div className='overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin  scrollbar-thumb-gray-300 '>


      <div className='mr-6'>
      <div className="flex  flex-row justify-between ">
        <ul
          className="flex ml-2"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          {[

{ lab: 'Cost Sheet', val: 'cost_sheet' },
{ lab: 'Payment Schedule', val: 'schedule' },
{ lab: 'Transactions',val: 'transactions',},
           



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



      
<div className="relative w-full  h-[180px]  flex items-center justify-center  ">
  <div className="absolute inset-0 pointer-events-none">
  
    <div className="absolute inset-0">
      {[...Array(4)].map((_, i) => (
        <div
          key={`h-line-${i}`}
          className="relative w-full"
          style={{
            position: "absolute",
            top: `${(i + 1) * (100 / 5)}%`,
            height: "1px",
          }}
        >
          <div
            className="absolute w-full h-full"
            style={{
              background: `linear-gradient(to right, 
                rgba(217,217,217,0.05) 0%, 
                rgba(217,217,217,0.4) 10%, 
                rgba(217,217,217,0.4) 90%, 
                rgba(217,217,217,0.05) 100%)`,
            }}
          />
        </div>
      ))}
    </div>


    <div className="absolute inset-0">
      {[...Array(16)].map((_, i) => (
        <div
          key={`v-line-${i}`}
          className="relative h-full"
          style={{
            position: "absolute",
            left: `${(i + 1) * (100 / 17)}%`,
            width: "1px",
          }}
        >
          <div
            className="absolute w-full h-full"
            style={{
              background: `linear-gradient(to bottom, 
                rgba(217,217,217,0.05) 0%, 
                rgba(217,217,217,0.4) 10%, 
                rgba(217,217,217,0.4) 90%, 
                rgba(217,217,217,0.05) 100%)`,
            }}
          />
        </div>
      ))}
    </div>
  </div>

  <div className="relative z-10 text-center">
    <h1 className="text-2xl font-medium">Total Unit Cost</h1>


<CountUpComp value={Math.round(Number(grossUnitTotal)) || 0} />
  </div>




  {/* <div
    className="absolute w-full flex justify-between px-6 text-gray-700 text-sm font-medium"
    style={{
      bottom: `${(1) * (100 / 5)}%`,
      transform: "translateY(50%)", 
    }}
  >
    <span className="mt-4 text-[#606062] text-[14px] font-medium">TRANSACTIONS</span>

    <span>
      <PdfTransactionsGenerator
        user={user}
        unitTransactionsA={unitTransactionsA}
        selCustomerPayload={selCustomerPayload}
        projectDetails={projectDetails}
        selUnitDetails={undefined}
        myObj={undefined}
        newPlotPS={undefined}
        myAdditionalCharges={undefined}
        streamUnitDetails={undefined}
        myBookingPayload={undefined}
        netTotal={undefined}
        setNetTotal={undefined}
        partATotal={undefined}
        partBTotal={undefined}
        setPartATotal={undefined}
        setPartBTotal={undefined}
        leadDetailsObj1={undefined}
        PSa={undefined}
        totalIs={undefined}
        custObj1={undefined}
        customerDetails={undefined}
      />
    </span>
  </div> */}
</div> 


    <div className='w-full h-full flex justify-center -mt-20 z-10 relative'>
    

    <div className="w-full max-w-5xl px-4">

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
              grossUnitTotal={grossUnitTotal} 
            />
          </PDFExport>
        </>
      )}


      </div>

    </div>



      </div>


 
    </div>

    </>
  )
}

export default CrmUnitPsHome
