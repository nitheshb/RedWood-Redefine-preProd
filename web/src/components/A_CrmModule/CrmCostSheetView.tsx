import { Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getProjectByUid } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CombinedPdfGenerator from 'src/util/CombinedPdfGenerator'
import { computeTotal } from 'src/util/computeCsTotals'
import PdfSummaryGenerator from 'src/util/PdfSummaryGenerator'
import PdfUniteSummary from 'src/util/PdfUniteSummary'

const CrmUnitCostSheetView = ({ selCustomerPayload,
   unitTransactionsA, PSa,
   leadDetailsObj1,
   customerDetails,
   streamUnitDetails,
    newAdditonalChargesObj,
    myBookingPayload,
    assets,
    totalIs,
    selUnitDetails,
    newPlotCostSheetA,
    newPlotPS,
    project,

  }) => {
  const { user } = useAuth()
  const { orgId } = user
  const [partATotal, setPartA] = useState(0)
  const [partBTotal, setPartB] = useState(0)
  const [constructTotalA, setConstructA] = useState(0)
  const [constructTotalB, setConstructB] = useState(0)
  const [possessionTotal, setPossessionTotal] = useState(0)
  const [addOnTotal, setPartAddOn] = useState(0)
  const [unitTotal, setUnitTotal] = useState(0)
  const [grossUnitTotal, setGrossTotal] = useState(0)

  const [StatusListA, setStatusListA] = useState([])
  const [reviewLinks, setReviewLinks] = useState([])
  const [leadPayload, setLeadPayload] = useState({})

  const [netTotal, setNetTotal] = useState(0)
  const [partCTotal, setPartCTotal] = useState(0)
  const [partDTotal, setPartDTotal] = useState(0)







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




  console.log('payload is ', selCustomerPayload)
  useEffect(() => {
    let a = selCustomerPayload?.plotCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )

    let b = selCustomerPayload?.addChargesCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )

    let c = selCustomerPayload?.addOnCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    let d = selCustomerPayload?.constructCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    let e = selCustomerPayload?.constAdditionalChargesCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    let f = selCustomerPayload?.possessionAdditionalCostCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )

    if (isNaN(a)) {
      a = 0
    }
    if (isNaN(b)) {
      b = 0
    }
    if (isNaN(c)) {
      c = 0
    }
    if (isNaN(d)) {
      d = 0
    }
    if (isNaN(e)) {
      e = 0
    }
    if (isNaN(f)) {
      f = 0
    }

    setPartA(a)
    setPartB(b)
    setPartAddOn(c)
    setConstructA(d)
    setConstructB(e)
    setUnitTotal(a + b + c +d+e)
    // setPossessionTotal(f)
    setPossessionTotal(f)
    // setGrossTotal(a + b + c +d+e+f)
    setGrossTotal(a + b + c +d+e+f)

  }, [selCustomerPayload])

  return (
    <>
















      <div className="mt-2  ">
        <section className="mr- flex flex-row  ">
          <div className="w-full">
            <div className="border border-[#e5e7f8] bg-[#fff]  rounded-md mt-[4px]">
              <div className="flex flex-row px-3 justify-between items-center">


                <div className='flex items-center'>
                <img
                  src="https://static.ambitionbox.com/static/benefits/WFH.svg"
                  alt=""
                />
                <h1 className="text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-3 ml-1">
                  Cost Sheet
                </h1>
                </div>
                <div>

<PdfSummaryGenerator
    user={user}
    selUnitDetails={selUnitDetails}
    streamUnitDetails={streamUnitDetails}
    myBookingPayload={myBookingPayload}
    myObj={newPlotCostSheetA}
    selCustomerPayload={selCustomerPayload}
    newPlotPS={newPlotPS}
    myAdditionalCharges={newAdditonalChargesObj}
    unitTransactionsA={unitTransactionsA}
    netTotal={netTotal}
    totalIs={totalIs}
    customerDetails={customerDetails}
    project={project}
    constructTotalB={constructTotalB}



    PSa={PSa}
    setNetTotal={setNetTotal}
    partATotal={partATotal}
    partBTotal={partBTotal}

    projectDetails={projectDetails}
    leadDetailsObj1={leadDetailsObj1} setPartATotal={undefined} setPartBTotal={undefined} custObj1={undefined}

    />
</div>




              </div>
              <div className="grid  grid-row-2  gap-x-2  px-3 ">
                <div className=" p-[4px]">

                  <table className="w-[100%] rounded-3xl">
                    <thead className='  '>
                      <tr className=" h-8 border-b-[0.2px] bg-[#E8E6FE]  rounded-lg w-[100%]">
                        <th className="min-w-[35%] text-[12px] text-left text-[#0D027D]   rounded-tl-[10px]  bg-[#E8E6FE]  tracking-wide  px-2">
                          Charges
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#0D027D] bg-[#E8E6FE] tracking-wide">
                          Rate/Sqft
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#0D027D] bg-[#E8E6FE] tracking-wide ">
                          Sale Value
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#0D027D] bg-[#E8E6FE]  tracking-wide px-2">
                          GST
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#0D027D] bg-[#E8E6FE] rounded-tr-[10px] tracking-wide px-2 ">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {' '}
                      {selCustomerPayload?.plotCS?.map((d1, inx) => (
                        <tr
                          key={inx}
                          className="border-b border-dashed h-[32px]"
                        >
                          <th className="w-[40%] text-[12px] text-left text-[#6A6A6A] bg-[#fff] px-2">
                            {d1?.component?.label}
                          </th>

                          <td className="w-[15%] text-[12px] text-right text-[#6A6A6A] bg-[#fff]">
                            ₹ {d1?.charges?.toLocaleString('en-IN')}
                          </td>
                          <td className="w-[15%] text-[12px] text-right text-[#6A6A6A] bg-[#fff] ">
                            ₹{d1?.TotalSaleValue?.toLocaleString('en-IN')}
                          </td>
                          <td className="w-[15%] text-[12px] text-right text-[#6A6A6A] px-2 bg-[#fff]">
                            ₹{d1?.gstValue?.toLocaleString('en-IN')}
                          </td>
                          <td className="w-[15%] text-[12px] text-right  text-[#6A6A6A] bg-[#fff] px-2">
                            ₹
                            {d1?.TotalNetSaleValueGsT?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                      <tr className=" h-[32px]">
                        <th className="w-[40%] text-[10px] text-left text-gray-800 "></th>
                        <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                        <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                        <td className="w-[15%] font-interF font-semibold  text-[12px] text-right text-[#6A6A6A] pr-2  ">
                          {' '}
                           Cost:
                        </td>
                        <td className="w-[15%] font-semibold  text-[12px] text-right text-[#6A6A6A]  px-2">
                          ₹{partATotal?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="w-full mt-2">
                  <thead>
                        <tr className=" h-8 border-b-[0.2px]  w-[100%]">
                          <th className="min-w-[35%] text-[12px] text-left text-[#0D027D] bg-[#E8E6FE]    tracking-wide  px-2">
                            Additional Charges
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0D027D] bg-[#E8E6FE]  tracking-wide">
                            Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0D027D] bg-[#E8E6FE]  tracking-wide ">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0D027D] bg-[#E8E6FE]   tracking-wide px-2">
                            GST
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0D027D] bg-[#E8E6FE]     tracking-wide px-2 ">
                            Total
                          </th>
                        </tr>
                      </thead>
                    <tbody>
                      {selCustomerPayload?.addChargesCS?.map((d1, inx) => (
                        <tr
                          key={inx}
                          className="border-b border-dashed border-t-0 h-[32px]"
                        >
                          <th className=" text-[12px] w-[40%] text-left text-[#6A6A6A] px-2 bg-[#fff]">
                            {d1?.component?.label}
                          </th>
                          <td className="text-[12px] w-[15%] text-right text-[#6A6A6A] px-2 bg-[#fff]">
                            {/* ₹{Number(d1?.charges)?.toLocaleString('en-IN')} */}
                            {d1?.units.value==='fixedcost' ? 'Fixed': <>₹ {d1?.charges?.toLocaleString('en-IN')}</>}
                          </td>

                          <td className="w-[15%] text-[12px] text-right text-[#6A6A6A] bg-[#fff] ">
                            ₹{d1?.TotalSaleValue?.toLocaleString('en-IN')}
                          </td>
                          <td className="w-[15%] text-[12px] text-right text-[#6A6A6A] px-2 bg-[#fff]">
                            ₹{d1?.gstValue?.toLocaleString('en-IN')}
                          </td>

                          <td className="text-[12px] w-[15%] text-right text-[#6A6A6A] bg-[#fff] px-2">
                            ₹
                            {/* {Number(
                              computeTotal(
                                d1,
                                selCustomerPayload?.area
                                  ?.toString()
                                  ?.replace(',', '')
                              )
                            )?.toLocaleString('en-IN')} */}
                            {d1?.TotalNetSaleValueGsT?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                      <tr className=" h-[32px]  ">
                        <th className="w-[40%] text-[10px] text-left text-gray-800 "></th>
                        <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                        <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                        <td className="w-[15%] font-semibold text-[#6A6A6A] text-[12px] text-right  pr-2  ">
                          {' '}
                          Additional Charges:
                        </td>
                        <td className="text-[12px] text-right font-semibold text-[#6A6A6A]  px-2">
                          ₹{partBTotal?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {selCustomerPayload?.constructCS?.length > 0 && (
                    <table className="w-[100%] mt-2">
                      <thead>
                        <tr className=" h-8  w-[100%]">
                          <th className="min-w-[35%] text-[12px] text-left text-[#0D027D]     bg-[#E8E6FE]  tracking-wide  px-2">
                            Construction Charges
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0D027D] bg-[#E8E6FE] tracking-wide">
                             Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0D027D] bg-[#E8E6FE] tracking-wide ">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0D027D] bg-[#E8E6FE] tracking-wide px-2">
                            GST
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0D027D] bg-[#E8E6FE]    tracking-wide px-2 ">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {' '}
                        {selCustomerPayload?.constructCS?.map((d1, inx) => (
                          <tr
                            key={inx}
                            className="border-b border-dashed h-[32px]"
                          >
                            <th className="w-[40%] text-[12px] text-left text-[#6A6A6A] bg-[#fff]  px-2">
                              {d1?.component?.label}
                            </th>

                            <td className="w-[15%] text-[12px] text-right text-[#6A6A6A] bg-[#fff] ">
                              ₹{d1?.charges?.toLocaleString('en-IN')}
                            </td>
                            <td className="w-[15%] text-[12px] text-right text-[#6A6A6A] bg-[#fff]  ">
                              ₹{d1?.TotalSaleValue?.toLocaleString('en-IN')}
                            </td>
                            <td className="w-[15%] text-[12px] text-right  px-2 text-[#6A6A6A] bg-[#fff] ">
                              ₹{d1?.gstValue?.toLocaleString('en-IN')}
                            </td>
                            <td className="w-[15%] text-[12px] text-right  text-[#6A6A6A] bg-[#fff]  px-2">
                              ₹
                              {d1?.TotalNetSaleValueGsT?.toLocaleString(
                                'en-IN'
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr className=" h-[32px]">
                          <th className="w-[40%] text-[10px] text-left text-gray-800 "></th>
                          <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                          <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                          <td className="w-[15%]   font-semibold text-[#6A6A6A] text-[12px] text-right  pr-2  ">
                            {' '}
                            Construction Cost:
                          </td>
                          <td className="w-[15%]  text-[12px] text-right font-semibold text-[#6A6A6A]   px-2">
                            ₹{constructTotalA?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {selCustomerPayload?.constAdditionalChargesCS?.length > 0 && (
                    <table className="w-[100%]">
                      <thead>
                        <tr className=" h-8  w-[100%]">
                          <th className="min-w-[35%] text-[12px] text-left text-[#04050b] bg-[#E8E6FE]    tracking-wide  px-2">
                          Construction Additional Charges
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#04050b] bg-[#E8E6FE] tracking-wide">
                             Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#04050b] bg-[#E8E6FE] tracking-wide ">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#04050b] bg-[#E8E6FE]  tracking-wide px-2">
                            GST
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#04050b] bg-[#E8E6FE]  tracking-wide px-2 ">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {' '}
                        {selCustomerPayload?.constAdditionalChargesCS?.map(
                          (d1, inx) => (
                            <tr
                              key={inx}
                              className="border-b border-dashed h-[32px]"
                            >
                              <th className="w-[40%] text-[12px] text-left text-gray-700 bg-[#fff] px-2">
                                {d1?.component?.label} {d1?.purpose}
                              </th>

                              <td className="w-[15%] text-[12px] text-right text-gray-700 bg-[#fff]">
                                {d1?.units.value==='fixedcost' ? 'Fixed': <>₹ {d1?.charges?.toLocaleString('en-IN')}</>}
                              </td>
                              <td className="w-[15%] text-[12px] text-right text-gray-700 bg-[#fff] ">
                                ₹{d1?.TotalSaleValue?.toLocaleString('en-IN')}
                              </td>
                              <td className="w-[15%] text-[12px] text-right text-gray-700 px-2 bg-[#fff]">
                                ₹{d1?.gstValue?.toLocaleString('en-IN')}
                              </td>
                              <td className="w-[15%] text-[12px] text-right  text-gray-800 bg-[#fff] px-2">
                                ₹
                                {d1?.TotalNetSaleValueGsT?.toLocaleString(
                                  'en-IN'
                                )}
                              </td>
                            </tr>
                          )
                        )}
                        <tr className=" h-[32px]">
                          <th className="w-[40%] text-[10px] text-left text-gray-800 "></th>
                          <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                          <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                          <td className="w-[15%] font-semibold text-[#6A6A6A] text-[12px]  text-right  pr-2  ">
                            {' '}
                            Construction Additonal Charges:
                          </td>
                          <td className="w-[15%] font-bold  text-[12px] text-right text-gray-800  px-2">
                            ₹{constructTotalB?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

{selCustomerPayload?.possessionAdditionalCostCS?.length > 0 && (
                    <table className="w-[100%] mt-2">
                      <thead>
                        <tr className=" h-8  w-[100%]">
                          <th className="min-w-[35%] text-[10px] text-left text-[#04050b] bg-[#E8E6FE]    tracking-wide  px-2">
                            Possession Charges
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#04050b] bg-[#E8E6FE] tracking-wide">
                            Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#04050b] bg-[#E8E6FE] tracking-wide ">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#04050b] bg-[#E8E6FE]  tracking-wide px-2">
                            GST
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#04050b] bg-[#E8E6FE]    tracking-wide px-2 ">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {' '}
                        {selCustomerPayload?.possessionAdditionalCostCS?.map(
                          (d1, inx) => (
                            <tr
                              key={inx}
                              className="border-b border-dashed h-[32px]"
                            >
                              <th className="w-[40%] text-[12px] text-left text-gray-700 bg-[#fff] px-2">
                                {d1?.component?.label}
                              </th>

                              <td className="w-[15%] text-[12px] text-right text-gray-700 bg-[#fff]">
                              {d1?.units.value==='fixedcost' ? 'Fixed': <>₹ {d1?.charges?.toLocaleString('en-IN')}</>}
                              </td>
                              <td className="w-[15%] text-[12px] text-right text-gray-700 bg-[#fff] ">
                                ₹{d1?.TotalSaleValue?.toLocaleString('en-IN')}
                              </td>
                              <td className="w-[15%] text-[12px] text-right text-gray-700 px-2 bg-[#fff]">
                                ₹{d1?.gstValue?.toLocaleString('en-IN')}
                              </td>
                              <td className="w-[15%] text-[12px] text-right  text-gray-800 bg-[#fff] px-2">
                                ₹
                                {d1?.TotalNetSaleValueGsT?.toLocaleString(
                                  'en-IN'
                                )}
                              </td>
                            </tr>
                          )
                        )}
                        <tr className=" h-[32px]">
                          <th className="w-[40%] text-[10px] text-left text-gray-800 "></th>
                          <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                          <td className="w-[5%] font-bold  text-[10px] text-right text-gray-800   "></td>
                          <td className="w-[15%] font-semibold text-[#6A6A6A] text-[12px]  text-right pr-2  ">
                            {' '}
                            Possession Charges
                          </td>
                          <td className="w-[15%] font-bold  text-[12px] text-right text-gray-800  px-2">
                            ₹{possessionTotal?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}


                                {selCustomerPayload?.addOnCS?.length > 0 && (

                                  <>






<table className="w-full mt-2">
                  <thead>
                        <tr className=" h-8 border-b-[0.2px]  w-[100%]">
                          <th className="min-w-[35%] text-[12px] text-left text-[#0D027D] bg-[#E8E6FE]   rounded-tl-[10px]  tracking-wide  px-2">
                          Modifications
                          </th>

                          <th className="w-[15%] text-[12px] text-left text-[#0D027D] bg-[#E8E6FE]   tracking-wide px-2">
                          Comment
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0D027D] bg-[#E8E6FE]  tracking-wide">
                          Sale Value
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0D027D] bg-[#E8E6FE]  tracking-wide">
                          GST
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0D027D] bg-[#E8E6FE] rounded-tr-[10px]  tracking-wide pr-2 ">
                          Total
                          </th>


                        </tr>
                      </thead>
                    <tbody>
                      {selCustomerPayload?.addOnCS?.map((d1, inx) => (

                        <tr
                          key={inx}
                          className="border-b-[0.05px] border-gray-300 border-t-0 h-[32px]"
                        >
                          <th className=" text-[12px] w-[40%] text-left text-[#6A6A6A] px-2 bg-[#fff]">
                         <section className='flex flex-row'> {d1?.component?.label} <Download className="text-center ml-16 w-[13px] h-6 " /></section>
                          </th>
<td className="w-[15%] text-[12px] text-left text-[#6A6A6A] px-2 bg-[#fff]">
                          {d1?.description}
                          </td>
                          <td className="text-[12px] w-[15%] text-right text-[#6A6A6A] px-2 bg-[#fff]">
                          ₹{Number(d1?.charges)?.toLocaleString('en-IN')}
                         </td>
                         <td className="text-[12px] w-[15%] text-right text-[#6A6A6A] px-2 bg-[#fff]">
                          ₹{Number(d1?.gstValue)?.toLocaleString('en-IN')}
                         </td>

                          <td className="w-[15%] text-[12px] text-right text-[#6A6A6A] bg-[#fff] pr-2 ">
                          ₹{' '}
                              {Number(
                                computeTotal(
                                  d1,
                                  selCustomerPayload?.area
                                    ?.toString()
                                    ?.replace(',', '')
                                )
                              )?.toLocaleString('en-IN')}
                          </td>



                        </tr>
                      ))}
                      <tr className="border-b-[0.05px] border-gray-300 h-[32px]  ">
                        <th className="w-[40%] text-[10px] text-left text-gray-800 "></th>
                        <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                        <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                        <td className="w-[15%] font-semibold text-[#6A6A6A] text-[12px] text-right  pr-2  ">
                          {' '}
                         Total Addons:
                        </td>
                        <td className="text-[12px] text-right font-semibold text-[#6A6A6A]  px-2">
                        ₹{addOnTotal?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                                  </>

















                  )}
                </div>
              </div>



              <section className="flex flex-row-reverse justify-between w-full mt- rounded px-3">
                <div className="flex flex-row mt-2 text-bodyLato text-left text-gray-800  text-[14px] mb-2 ">
                  Total Unit Cost
                  <section className="flex flex-row mt-1">

                    <section className="px-2 d-md font-bold text-[14px] text-[#000000e6] leading-none mr-1">
                      ₹{grossUnitTotal?.toLocaleString('en-IN')}
                    </section>
                  </section>
                </div>
              </section>


            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default CrmUnitCostSheetView
