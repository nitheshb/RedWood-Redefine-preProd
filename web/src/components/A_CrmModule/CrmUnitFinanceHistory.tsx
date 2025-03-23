
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getProjectByUid } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { prettyDate } from 'src/util/dateConverter'
import { downloadImage } from 'src/util/imageDownlaod'
import PdfTransactionsGenerator from 'src/util/PdfTransactionsGenerator'

const CrmUnitFinanceHistory = ({
  selCustomerPayload,
  assets,
  totalIs,

  unitTransactionsA,
}) => {
  const { user } = useAuth()
  const { orgId } = user




  const [projectDetails, setProject] = useState({})
  const getProjectDetails = async (id) => {
    const unsubscribe = await getProjectByUid(
      orgId,
      id,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setProject(projects[0])
      },
      () =>
        setProject({
          projectName: '',
        })
    )
    return unsubscribe
  }
  useEffect(() => {
    getProjectDetails(selCustomerPayload?.pId)
  }, [selCustomerPayload])






  return (
    <>






      <div className="mt-2">
        <section className="mr-2 flex flex-col   bg-white p-3 rounded-md ">
          <div>
            <div className="flex flex-row px-3 justify-between items-center ">


              <div className='flex items-center'>
              <img
                  src="https://static.ambitionbox.com/static/benefits/JobTraining.svg"
                  alt=""
                />
                <h1 className=" text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-1 ml-1">
                Payment History
                </h1>
              </div>


                <div>
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
  // selUnitDetails={selUnitDetails}
/>
                </div>
              </div>
            <table className="w-full mb-10 mt-2">
              <thead>
                {' '}
                <tr className=" h-8 ">
                  <th className="w-[12%] text-[12px]  text-left text-[#3D3D3D]   rounded-tl-[10px]  bg-[#E8E6FE]  tracking-wide  pl-2 ">
                    Paid On
                  </th>
                  <th className="w-[8%] text-[12px] text-center text-[#3D3D3D] bg-[#E8E6FE]  tracking-wide  ">
                    Mode
                  </th>
                  <th className="w-[15%] text-[12px] text-center text-[#3D3D3D] bg-[#E8E6FE]   tracking-wide  ">
                    Bank Ref Id
                  </th>
                  <th className="w-[10%] text-[12px] text-right text-[#3D3D3D] bg-[#E8E6FE]   tracking-wide ">
                    Amount
                  </th>
    
                  <th className="w-[10%] text-[12px] text-center text-[#3D3D3D] bg-[#E8E6FE]   tracking-wide  ">
                    Status
                  </th>


                  <th className="w-[15%] text-[12px] text text-[#3D3D3D] bg-[#E8E6FE]   tracking-wide  ">
                    Accounts
                  </th>
                  {/* <th className="w-[15%] text-[10px] text-center text-gray-400 text-[#8993a4] font-bodyLato tracking-wide uppercase ">
                    Tx Id
                  </th> */}
                  <th className="w-[15%] text-[12px] text-center text-[#3D3D3D] bg-[#E8E6FE]  tracking-wide  ">
                    Reviewer
                  </th>

                  <th className="w-[15%] text-[12px] text-center text-[#3D3D3D]  rounded-tr-[10px] bg-[#E8E6FE]  tracking-wide  ">
                    
                  </th>
                </tr>
              </thead>

              <tbody>
                {unitTransactionsA?.map((d1, inx) => {
                  totalIs = 0
                    // selCustomerPayload?.[`${assets[0]}_T_review`] - d1?.value
                  return (
                    <tr key={inx} className={` border-b border-dashed h-[45px] ${inx%2 === 0 ? '': ' '}`}>
                      <th className=" text-[12px] text-left text-blue-700  pl-2">
                        {prettyDate(d1?.txt_dated ||d1?.dated) }
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

                      <td className={` text-[12px] text-center flex justify-center items-center`}>
                      <button
          color="gray"
          className="border-0 block rounded ml-2"
          onClick={() => { downloadImage(
            JSON.parse(d1?.attchUrl)?.url,
            `${JSON.parse(d1?.attchUrl)?.fileName}`
          )}}
        >
  <Download className={`text-center w-[13px] h-6 mt-[8px]  ${d1?.attchUrl.length>1 ? 'text-gray-800 ' : 'text-gray-400 ' }`} />
  </button>

</td>

                    </tr>
                  )
                })}

              </tbody>
            </table>





          </div>
        </section>
      </div>
    </>
  )
}

export default CrmUnitFinanceHistory
