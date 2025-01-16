
import { Download } from 'lucide-react'
import { useAuth } from 'src/context/firebase-auth-context'
import { prettyDate } from 'src/util/dateConverter'
import PdfTransactionsGenerator from 'src/util/PdfTransactionsGenerator'

const CrmUnitFinanceHistory = ({
  selCustomerPayload,
  assets,
  totalIs,
  unitTransactionsA,
}) => {
  const { user } = useAuth()
  const { orgId } = user

  return (
    <>
       


       <PdfTransactionsGenerator
  user={user} 
  unitTransactionsA={unitTransactionsA}
  selCustomerPayload={selCustomerPayload}
  selUnitDetails={undefined} myObj={undefined} newPlotPS={undefined} myAdditionalCharges={undefined} streamUnitDetails={undefined} myBookingPayload={undefined} netTotal={undefined} setNetTotal={undefined} partATotal={undefined} partBTotal={undefined} setPartATotal={undefined} setPartBTotal={undefined} projectDetails={undefined} leadDetailsObj1={undefined} PSa={undefined} totalIs={undefined} custObj1={undefined} customerDetails={undefined}                                        // selUnitDetails={selUnitDetails}
/>


      <div className="mt-2">
        <section className="mr-2 flex flex-col bg-[#F0F1FF] from-green-50 to-amber-50  bg-[#F0F1FF] bg-[#F0F1FF] bg-[#F0F1FF] p-3 border border-[#e5e7f8] rounded-md ">
          <div>
            <div className="flex flex-row ">
                <img
                  src="https://static.ambitionbox.com/static/benefits/JobTraining.svg"
                  alt=""
                />
                <h1 className=" text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-1 ml-1">
                Payment History
                </h1>
              </div>
            <table className="w-full mb-10 mt-2">
              <thead>
                {' '}
                <tr className=" h-6 border-b-[0.2px] border-gray-300 ">
                  <th className="w-[12%] text-[10px]  text-left text-gray-400 text-[#823d00] tracking-wide uppercase pl-2 ">
                    Paid On
                  </th>
                  <th className="w-[8%] text-[10px] text-center text-gray-400 text-[#823d00] font-bodyLato tracking-wide uppercase ">
                    Mode
                  </th>
                  <th className="w-[15%] text-[10px] text-center text-gray-400 text-[#823d00] font-bodyLato tracking-wide uppercase ">
                    Bank Ref Id
                  </th>
                  <th className="w-[10%] text-[10px] text-right text-gray-400  text-[#823d00] font-bodyLato tracking-wide uppercase">
                    Amount
                  </th>
                  {/* <th className="w-[10%] text-[10px] text-center text-gray-400  text-[#823d00] font-bodyLato tracking-wide uppercase">
                    Event
                  </th> */}
                  <th className="w-[10%] text-[10px] text-center text-gray-400 text-[#823d00] font-bodyLato tracking-wide uppercase ">
                    Status
                  </th>


                  <th className="w-[15%] text-[10px] text text-gray-400 text-[#823d00] font-bodyLato tracking-wide uppercase ">
                    Accounts
                  </th>
                  {/* <th className="w-[15%] text-[10px] text-center text-gray-400 text-[#8993a4] font-bodyLato tracking-wide uppercase ">
                    Tx Id
                  </th> */}
                  <th className="w-[15%] text-[10px] text-center text-gray-400 text-[#823d00] font-bodyLato tracking-wide uppercase ">
                    Reviewer
                  </th>

                  <th className="w-[15%] text-[10px] text-center text-gray-400 text-[#823d00] font-bodyLato tracking-wide uppercase ">
                    Download
                  </th>
                </tr>
              </thead>

              <tbody>
                {unitTransactionsA?.map((d1, inx) => {
                  totalIs = 0
                    // selCustomerPayload?.[`${assets[0]}_T_review`] - d1?.value
                  return (
                    <tr key={inx} className={`border-b-[0.05px] border-gray-300 h-[45px] ${inx%2 === 0 ? '': ' '}`}>
                      <th className=" text-[12px] text-left text-blue-700  pl-2">
                        {prettyDate(d1?.txt_dated ||d1?.dated).toLocaleString() }
                      </th>
                      <td className="text-[12px] text-center  text-gray-800 ">
                        {d1?.mode}
                      </td>
                      <td className="text-[12px] text-center text-gray-800 ">
                        {d1?.bank_ref || d1?.chequeno}
                      </td>
                      <td className="text-[13px] text-right text-gray-800 font-bold ">
                        ₹{d1?.totalAmount?.toLocaleString('en-IN') || d1?.amount?.toLocaleString('en-IN')}
                      </td>
                      {/* <td className="text-[10px] text-center text-gray-800 ">
                        {d1?.payReason}
                      </td> */}

                      <td className="text-[12px] text-center text-gray-800 ">
                      <span className="bg-[#D9D8FF] text-[10px] px-2 py-[2px] rounded-2xl font-bold">{d1?.status}</span>
                      </td>


                      <td className="text-[12px] text-center text-gray-800 ">

                        {d1?.towards ||d1?.builderName}
                        <div>  {d1?.customerName}</div>
                      </td>
                      {/* <td className="text-[10px] text-center text-gray-800 ">
                        {d1?.created}
                      </td> */}
                      <td className="text-[12px] text-center text-gray-800 ">
                        {d1?.Reviewer || "NA"}
                      </td>

                      <td className="text-[12px] text-center text-gray-800 flex justify-center items-center">
  <Download className="text-center" />
</td>

                    </tr>
                  )
                })}

                {/* <tr className="border-b-[0.05px] border-gray-300">
                  <th className="text-[10px] text-left text-gray-800 ">
                    Plot Value Total Rs.:
                  </th>
                  <td className="text-[10px] text-right text-gray-400 "></td>
                  <th className="text-[10px] text-right text-gray-800 "></th>
                </tr> */}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}

export default CrmUnitFinanceHistory
