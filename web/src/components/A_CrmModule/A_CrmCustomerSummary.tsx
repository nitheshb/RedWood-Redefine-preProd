import { useEffect, useRef } from 'react'
import { PDFExport } from '@progress/kendo-react-pdf'
import { useAuth } from 'src/context/firebase-auth-context'
import CrmUnitHeader from './CrmUnitHeader'

const CrmCustomerSummary = ({
  selCustomerPayload,
  assets,
  totalIs,
  unitTransactionsA,
}) => {
  const { user } = useAuth()
  const pdfUnitSummaryComp = useRef(null)
  const { orgId } = user

  useEffect(() => {
    console.log('selCustomerIs', selCustomerPayload)
  }, [])

  return (
    <PDFExport paperSize="A4" margin="1cm" ref={pdfUnitSummaryComp}>
      <div className="py-3 px-3 m-4 mt-2 rounded-lg border border-gray-100 h-[100%] overflow-y-scroll overflow-auto no-scrollbar">
        <div className="text-end items-end mr-2 mt-3">
          <div
            className=" flex flex-row justify-end items-center align-middle text-blue-500 text-xs cursor-pointer hover:underline"
            onClickCapture={() => {
              pdfUnitSummaryComp.current.save()
            }}
          >
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 pr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              <span className="text-[11px]">CUSTOMER SUMMARY</span>
            </>
          </div>
        </div>

        <CrmUnitHeader projectDetails={selCustomerPayload} />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline mt-2 ml-2 mb-5">
          <div className="">
            <label className="font-semibold text-[#053219]  text-sm  mt-3 mb-1  tracking-wide ">
              Transaction Ddetails<abbr title="required"></abbr>
            </label>
          </div>

          <div className="border-t-4 rounded-xl w-16 mt-1 border-green-600"></div>
        </div>
        <div className="p-3 flex flex-col">
          <span
            className={`items-center h-6 px-3 py-1 mt-1 text-xs font-semibold text-green-500 bg-green-100 rounded-full
                        `}
          >
            {'In-Progress'}
          </span>
        </div>
      </div>
    </PDFExport>
  )
}

export default CrmCustomerSummary
