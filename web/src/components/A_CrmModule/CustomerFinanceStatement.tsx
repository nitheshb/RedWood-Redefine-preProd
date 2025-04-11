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



<div className='overflow-y-scroll w-full items-center justify-center mx-auto min-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300'>







      <div className="relative min-h-screen mr-6">



      <div className="relative z-0">



      <div className=" mx-auto w-full ">
        <ul
          className="flex "
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
            className={`flex items-center gap-2  px-2 text-sm font-medium text-center rounded-t-lg border-b-2 hover:text-blue  ${
              financeMode === d.val ? 'border-black text-black' : 'border-transparent'
            }`}
            type="button"
            role="tab"
            onClick={() => setFinanceMode(d.val)}
          >
            {/* <img alt="" src="/temp2.png" className="h-5 w-5" /> */}
            <span className='text-[#606062] font-medium text-[12px] uppercase tracking-wide'>{d.lab}</span>
          </button>
              </li>
            )
          })}
        </ul>



{/* 
        <section className="flex flex-row">
  
          <div className="w-full flex items-center mt-3 mr-3 ">
            <label
              htmlFor="area"
              className="label font-regular text-sm font-bodyLato"
            >
            
            </label>
          </div>
        </section> */}
      </div>



  

  <img
    alt="CRM Background"
    src="/bgimgcrm.svg"
    className="w-full h-auto object-cover"
  />


  <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  ">
      <div className="text-center space-y-2">
        <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Paid</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>
      </div>
      <div className="text-center space-y-2">
        <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Unit Cost</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>
      </div>
      <div className="text-center space-y-2">
        <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">Total Due</p>
        <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">No Data</h2>
      </div>
    </div>
  </div>
</div>
        



    <div className='absolute w-full flex justify-center mt-[-90px] z-10'>
    

    <div className="w-full max-w-4xl px-4 mx-auto">

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
