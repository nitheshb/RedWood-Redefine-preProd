import { Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from 'src/context/firebase-auth-context'
import CombinedPdfGenerator from 'src/util/CombinedPdfGenerator'
import { computeTotal } from 'src/util/computeCsTotals'
import PdfSummaryGenerator from 'src/util/PdfSummaryGenerator'

const CrmUnitCostSheetView = ({ selCustomerPayload,projectDetails, unitTransactionsA, PSa, leadDetailsObj1, streamUnitDetails, newAdditonalChargesObj, myBookingPayload, assets, totalIs,selUnitDetails,newPlotCostSheetA, newPlotPS }) => {
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

  console.log('payload is ', selCustomerPayload)
  useEffect(() => {
    let a = selCustomerPayload?.plotCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    // let b = selCustomerPayload?.addChargesCS?.reduce(
    //   (partialSum, obj) =>
    //     partialSum +
    //     Number(
    //       computeTotal(
    //         obj,
    //         selCustomerPayload?.super_built_up_area ||
    //           selCustomerPayload?.area?.toString()?.replace(',', '')
    //       )
    //     ),
    //   0
    // )
    let b = selCustomerPayload?.addChargesCS?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    // let c =
    //   selCustomerPayload?.addOnCS?.reduce(
    //     (partialSum, obj) =>
    //       partialSum +
    //       Number(
    //         computeTotal(
    //           obj,
    //           selCustomerPayload?.super_built_up_area ||
    //             selCustomerPayload?.area?.toString()?.replace(',', '')
    //         )
    //       ),
    //     0
    //   ) || 0
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
    setPossessionTotal(f)
    setGrossTotal(a + b + c +d+e+f)

  }, [selCustomerPayload])

  return (
    <>

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
          PSa={PSa}
          setNetTotal={setNetTotal}
          partATotal={partATotal}
          partBTotal={partBTotal}
          // setPartATotal={setPartATotal}
          // setPartBTotal={setPartBTotal}
          projectDetails={projectDetails}
          leadDetailsObj1={leadDetailsObj1} setPartATotal={undefined} setPartBTotal={undefined} custObj1={undefined} customerDetails={undefined}
          // user={user}
          // selUnitDetails={selUnitDetails}
          // myObj={newPlotCostSheetA}
          // newPlotPS={newPlotPS}
          // netTotal={unitTotal}
          // setNetTotal={setUnitTotal}
          // partATotal={partATotal}

          // partBTotal={0}
          // setPartATotal={partATotal}
          // projectDetails={{}} myAdditionalCharges={undefined} setPartBTotal={undefined} leadDetailsObj1={undefined} customerDetails={undefined}
          />
    </div>





      <div className="mt-2  ">
        <section className="mr- flex flex-row  ">
          <div className="w-full">
            <div className="border border-[#e5e7f8] bg-[#fff]  rounded-md mt-[4px]">
              <div className="flex flex-row  px-3">
                <img
                  src="https://static.ambitionbox.com/static/benefits/WFH.svg"
                  alt=""
                />
                <h1 className="text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-3 ml-1">
                  Cost Sheet
                </h1>
              </div>
              <div className="grid  grid-row-2  gap-x-2  px-3 ">
                <div className=" p-[4px]">
                  {/* <h1 className=" mt-2 mb-1 text-bodyLato text-left text-gray-800 font-semibold text-[12px] mb-1">
                    Part (A)
                  </h1> */}
                  <table className="w-[100%] rounded-3xl">
                    <thead className='  '>
                      <tr className=" h-8 border-b-[0.2px] bg-[#EDEDED]  rounded-lg w-[100%]">
                        <th className="min-w-[35%] text-[12px] text-left text-[#3D3D3D]   rounded-tl-[10px]  bg-[#EDEDED]  tracking-wide  px-2">
                          Plot
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#3D3D3D] bg-[#EDEDED] tracking-wide">
                          Plot Rate/Sqft
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#3D3D3D] bg-[#EDEDED] tracking-wide ">
                          Sale Value
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#3D3D3D] bg-[#EDEDED]  tracking-wide px-2">
                          GST
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#3D3D3D] bg-[#EDEDED] rounded-tr-[10px] tracking-wide px-2 ">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {' '}
                      {selCustomerPayload?.plotCS?.map((d1, inx) => (
                        <tr
                          key={inx}
                          className="border-b-[0.05px] border-[#cccccc] h-[32px]"
                        >
                          <th className="w-[40%] text-[12px] text-left text-[#6A6A6A] bg-[#fff] px-2">
                            {d1?.component?.label}
                          </th>

                          <td className="w-[15%] text-[12px] text-right text-[#6A6A6A] bg-[#fff]">
                            ₹{d1?.charges?.toLocaleString('en-IN')}
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
                      <tr className="border-b-[0.05px] border-gray-300 h-[32px]">
                        <th className="w-[40%] text-[10px] text-left text-gray-800 "></th>
                        <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                        <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                        <td className="w-[15%] font-interF font-semibold  text-[12px] text-right text-[#6A6A6A] pr-2  ">
                          {' '}
                          Plot Cost:
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
                          <th className="min-w-[35%] text-[12px] text-left text-[#3D3D3D] bg-[#EDEDED]   rounded-tl-[10px]  tracking-wide  px-2">
                            Additional Charges
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#3D3D3D] bg-[#EDEDED]  tracking-wide">
                            Plot Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#3D3D3D] bg-[#EDEDED]  tracking-wide ">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#3D3D3D] bg-[#EDEDED]   tracking-wide px-2">
                            GST
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#3D3D3D] bg-[#EDEDED]  rounded-tr-[10px]   tracking-wide px-2 ">
                            Total
                          </th>
                        </tr>
                      </thead>
                    <tbody>
                      {selCustomerPayload?.addChargesCS?.map((d1, inx) => (
                        <tr
                          key={inx}
                          className="border-b-[0.05px] border-gray-300 border-t-0 h-[32px]"
                        >
                          <th className=" text-[12px] w-[40%] text-left text-[#6A6A6A] px-2 bg-[#fff]">
                            {d1?.component?.label}
                          </th>
                          <td className="text-[12px] w-[15%] text-right text-[#6A6A6A] px-2 bg-[#fff]">
                            ₹{Number(d1?.charges)?.toLocaleString('en-IN')}
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
                      <tr className="border-b-[0.05px] border-gray-300 h-[32px]  ">
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
                        <tr className=" h-8 border-b-[0.2px] border-gray-300 w-[100%]">
                          <th className="min-w-[35%] text-[12px] text-left text-[#3D3D3D]   rounded-tl-[10px]  bg-[#EDEDED]  tracking-wide  px-2">
                            Construction Charges
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#3D3D3D] bg-[#EDEDED] tracking-wide">
                            Construct Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#3D3D3D] bg-[#EDEDED] tracking-wide ">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#3D3D3D] bg-[#EDEDED] tracking-wide px-2">
                            GST
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#3D3D3D] bg-[#EDEDED]  rounded-tr-[10px]  tracking-wide px-2 ">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {' '}
                        {selCustomerPayload?.constructCS?.map((d1, inx) => (
                          <tr
                            key={inx}
                            className="border-b-[0.05px] border-gray-300 h-[32px]"
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
                        <tr className="border-b-[0.05px] border-gray-300 h-[32px]">
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
                        <tr className=" h-8 border-b-[0.2px] border-gray-300 w-[100%]">
                          <th className="min-w-[35%] text-[12px] text-left text-[#04050b] bg-[#D9D8FF]  tracking-wide  px-2">
                          Construction Additional Charges
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#04050b] bg-[#D9D8FF] tracking-wide">
                            Plot Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#04050b] bg-[#D9D8FF] tracking-wide ">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#04050b] bg-[#D9D8FF]  tracking-wide px-2">
                            GST
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#04050b] bg-[#D9D8FF]  tracking-wide px-2 ">
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
                              className="border-b-[0.05px] border-gray-300 h-[32px]"
                            >
                              <th className="w-[40%] text-[12px] text-left text-gray-700 bg-[#F0f1ff] px-2">
                                {d1?.component?.label}
                              </th>

                              <td className="w-[15%] text-[12px] text-right text-gray-700 bg-[#F0f1ff]">
                                ₹{d1?.charges?.toLocaleString('en-IN')}
                              </td>
                              <td className="w-[15%] text-[12px] text-right text-gray-700 bg-[#F0f1ff] ">
                                ₹{d1?.TotalSaleValue?.toLocaleString('en-IN')}
                              </td>
                              <td className="w-[15%] text-[12px] text-right text-gray-700 px-2 bg-[#F0f1ff]">
                                ₹{d1?.gstValue?.toLocaleString('en-IN')}
                              </td>
                              <td className="w-[15%] text-[12px] text-right  text-gray-800 bg-[#F0f1ff] px-2">
                                ₹
                                {d1?.TotalNetSaleValueGsT?.toLocaleString(
                                  'en-IN'
                                )}
                              </td>
                            </tr>
                          )
                        )}
                        <tr className="border-b-[0.05px] border-gray-300 h-[32px]">
                          <th className="w-[40%] text-[10px] text-left text-gray-800 "></th>
                          <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                          <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                          <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800 pr-2  ">
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


                  {selCustomerPayload?.addOnCS?.length > 0 && (
                    <table className="w-full">
                      {/* <thead>
                      {' '}
                      <tr className=" h-6  border-b-[0.2px] border-gray-300 h-[32px]">
                        <th className="w-[40%] text-[10px] text-left text-gray-700 text-[#00a76f]  tracking-wide uppercase ">
                          Particulars
                        </th>
                        <th className="w-[30%] text-[10px] text-right text-gray-700 text-[#00a76f]  tracking-wide uppercase ">
                          Timeline
                        </th>
                        <th className="w-[15%] text-[10px] text-right text-gray-700  text-[#00a76f] tracking-wide uppercase px-2">
                          Rate
                        </th>
                        <th className="w-[20%] text-[10px] text-right text-gray-700  text-[#00a76f] tracking-wide uppercase">
                          Total Inc GST
                        </th>
                      </tr>
                    </thead> */}
                      {/* <tbody>
                        {selCustomerPayload?.addOnCS?.map((d1, inx) => (
                          <tr
                            key={inx}
                            className="border-b-[0.05px] border-gray-300 border-t-0 h-[32px]"
                          >
                            <th className=" text-[12px] w-[40%] text-left text-gray-700 px-2 bg-[#F0f1ff]">
                              {d1?.component?.label}
                            </th>
                            <td className="text-[12px] w-[15%] text-right text-gray-700 px-2 bg-[#F0f1ff]">
                              ₹{Number(d1?.charges)?.toLocaleString('en-IN')}
                            </td>
                            <td className="text-[12px] w-[30%] text-right text-gray-700 bg-[#F0f1ff] ">
                              {d1?.description}
                            </td>

                            <td className="text-[12px] w-[15%] text-right text-gray-700 font-bold bg-[#F0f1ff] px-2">
                              ₹
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
                          <th className="text-[12px] text-left text-gray-700  "></th>
                          <td className="text-[12px] text-right text-gray-400   "></td>
                          <td className="text-[12px] text-right text-gray-800 font-bold   ">
                            Total (C) :
                          </td>
                          <td className="text-[12px] text-right text-gray-800 font-bold  px-2">
                            ₹{addOnTotal?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody> */}
                    </table>
                  )}
                </div>
              </div>

              <section className="flex flex-row-reverse justify-between w-full mt- rounded px-3">
                <div className="flex flex-row mt-2 text-bodyLato text-left text-gray-800  text-[14px] mb-2 ">
                  Total unit sale value:
                  <section className="flex flex-row mt-1">



                    <section className="px-2 d-md font-bold text-[14px] text-[#000000e6] leading-none mr-1">
                      ₹{unitTotal?.toLocaleString('en-IN')}
                    </section>
                  </section>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div> <div className="mt-2  ">
        <section className="mr- flex flex-row  ">
          <div className="w-full">
            <div className="border border-[#e5e7f8] bg-[#fff]  rounded-md mt-[4px]">
              <div className="flex flex-row  px-3">
                <img
                  src="https://static.ambitionbox.com/static/benefits/WFH.svg"
                  alt=""
                />
                <h1 className="text-bodyLato text-left text-[#1E223C] font-semibold text-[14px] mb-2 mt-3 ml-1">
                 Possession Charges
                </h1>
              </div>
              <div className="grid  grid-row-2  gap-x-2  px-3 ">
                <div className=" rounded-md p-[4px]">
                  {/* <h1 className=" mt-2 mb-1 text-bodyLato text-left text-gray-800 font-semibold text-[12px] mb-1">
                    Part (A)
                  </h1> */}

                   {selCustomerPayload?.possessionAdditionalCostCS?.length > 0 && (
                    <table className="w-[100%]">
                      <thead>
                        <tr className=" h-8 border-b-[0.2px] border-gray-300 w-[100%]">
                          <th className="min-w-[35%] text-[10px] text-left text-[#04050b] bg-[#D9D8FF]  tracking-wide  px-2">
                            Possession Charges
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#04050b] bg-[#D9D8FF] tracking-wide">
                            Plot Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#04050b] bg-[#D9D8FF] tracking-wide ">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#04050b] bg-[#D9D8FF]  tracking-wide px-2">
                            GST
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#04050b] bg-[#D9D8FF]  tracking-wide px-2 ">
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
                              className="border-b-[0.05px] border-gray-300 h-[32px]"
                            >
                              <th className="w-[40%] text-[12px] text-left text-gray-700 bg-[#fff] px-2">
                                {d1?.component?.label}
                              </th>

                              <td className="w-[15%] text-[12px] text-right text-gray-700 bg-[#fff]">
                                ₹{d1?.charges?.toLocaleString('en-IN')}
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
                        <tr className="border-b-[0.05px] border-gray-300 h-[32px]">
                          <th className="w-[40%] text-[10px] text-left text-gray-800 "></th>
                          <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                          <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                          <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800 pr-2  ">
                            {' '}
                            Total (E)
                          </td>
                          <td className="w-[15%] font-bold  text-[12px] text-right text-gray-800  px-2">
                            ₹{possessionTotal?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                  {selCustomerPayload?.addOnCS?.length > 0 && (
                    <table className="w-full">
                      {/* <thead>
                      {' '}
                      <tr className=" h-6  border-b-[0.2px] border-gray-300 h-[32px]">
                        <th className="w-[40%] text-[10px] text-left text-gray-700 text-[#00a76f]  tracking-wide uppercase ">
                          Particulars
                        </th>
                        <th className="w-[30%] text-[10px] text-right text-gray-700 text-[#00a76f]  tracking-wide uppercase ">
                          Timeline
                        </th>
                        <th className="w-[15%] text-[10px] text-right text-gray-700  text-[#00a76f] tracking-wide uppercase px-2">
                          Rate
                        </th>
                        <th className="w-[20%] text-[10px] text-right text-gray-700  text-[#00a76f] tracking-wide uppercase">
                          Total Inc GST
                        </th>
                      </tr>
                    </thead> */}
                      <tbody>
                        {selCustomerPayload?.addOnCS?.map((d1, inx) => (
                          <tr
                            key={inx}
                            className="border-b-[0.05px] border-gray-300 border-t-0 h-[32px]"
                          >
                            <th className=" text-[12px] w-[40%] text-left text-gray-700 px-2 bg-[#fff]">
                              {d1?.component?.label}
                            </th>
                            <td className="text-[12px] w-[15%] text-right text-gray-700 px-2 bg-[#fff]">
                              ₹{Number(d1?.charges)?.toLocaleString('en-IN')}
                            </td>
                            <td className="text-[12px] w-[30%] text-right text-gray-700 bg-[#fff] ">
                              {d1?.description}
                            </td>

                            <td className="text-[12px] w-[15%] text-right text-gray-700 font-bold bg-[#fff] px-2">
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

                            <td className="text-[12px] w-[15%] text-right text-gray-700 font-bold bg-[#fff] px-2">
                            <Download className="text-center w-[13px] h-6 " />
                            </td>
                          </tr>
                        ))}
                        <tr className="border-b-[0.05px] border-gray-300 h-[32px]  ">
                          <th className="text-[12px] text-left text-gray-700  "></th>
                          <td className="text-[12px] text-right text-gray-400   "></td>
                          <td className="text-[12px] text-right text-gray-800 font-bold   ">
                            Total (C) :
                          </td>
                          <td className="text-[12px] text-right text-gray-800 font-bold  px-2">
                            ₹{addOnTotal?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <section className="flex flex-row-reverse justify-between w-full mt- rounded px-3">
                <div className="flex flex-row mt-2 text-bodyLato text-left text-gray-800  text-[14px] mb-2 ">
                  Total Unit Cost with possession charges:
                  <section className="flex flex-row mt-1">
                    <section className="px-2 d-md  text-[12px]  ">
                      ₹{unitTotal?.toLocaleString('en-IN')}
                    </section>
                    <section className=" d-md  text-[12px]  ">+</section>

                    <section className="px-2 d-md  text-[12px]  ">
                      ₹{possessionTotal?.toLocaleString('en-IN')}
                    </section>


                    <section className=" d-md font-bold text-[12px] text-[#0000008c] ">
                      =
                    </section>
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
