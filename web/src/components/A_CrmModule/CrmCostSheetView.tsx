import { Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getProjectByUid } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CombinedPdfGenerator from 'src/util/CombinedPdfGenerator'
import { computeTotal } from 'src/util/computeCsTotals'
import PdfSummaryGenerator from 'src/util/PdfSummaryGenerator'
import PdfUniteSummary from 'src/util/PdfUniteSummary'
import CrmUnitFinanceHistory from './CrmUnitFinanceHistory'

const CrmUnitCostSheetView = ({
  selCustomerPayload,
  unitTransactionsA,
  PSa,
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
    setUnitTotal(a + b + c + d + e)
    // setPossessionTotal(f)
    setPossessionTotal(f)
    // setGrossTotal(a + b + c +d+e+f)
    setGrossTotal(a + b + c + d + e + f)
  }, [selCustomerPayload])

  return (
    <>
      <div className="  ">
        <section className=" mb-6 flex flex-row  ">
          <div className="w-full   ">
            <div className="   rounded-md mt-[4px]">
              <div className="flex flex-row px-3 justify-between items-center">
                <div className="flex items-center">
                  {/* <img
                  src="https://static.ambitionbox.com/static/benefits/WFH.svg"
                  alt=""
                /> */}
                  <h1 className="font-outfit uppercase text-left text-[#606062] font-medium text-[12px] mb-2 mt-3 ml-1">
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
                    leadDetailsObj1={leadDetailsObj1}
                    setPartATotal={undefined}
                    setPartBTotal={undefined}
                    custObj1={undefined}
                  />
                </div>
              </div>
              <div className="grid  grid-row-2  gap-x-2   ">
                <div className=" p-[4px]">
                  <table className="w-[100%]  rounded-2xl overflow-hidden">
                    <thead className=" ">
                      <tr className=" h-9 border-b-[0.2px] bg-[#EDE9FE]    w-[100%]">
                        <th className="min-w-[33%] text-[12px] text-left text-[#0E0A1F]  font-medium   bg-[#EDE9FE]  tracking-wide pl-6">
                          Charges
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#0E0A1F]  font-medium bg-[#EDE9FE] tracking-wide">
                          Rate/Sqft
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#0E0A1F]  font-medium bg-[#EDE9FE] tracking-wide ">
                          Sale Value
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#0E0A1F]  font-medium bg-[#EDE9FE]  tracking-wide px-2">
                          GST
                        </th>
                        <th className="w-[15%] text-[12px] text-right  text-[#0E0A1F]  font-medium bg-[#EDE9FE] rounded-tr-[10px] tracking-wide pr-6 ">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {' '}
                      {selCustomerPayload?.plotCS?.map((d1, inx) => (
                        <tr
                          key={inx}
                          className="border-b border-dashed h-[32px] "
                        >
                          <th className="w-[40%] text-[12px]  text-left text-[#606062] font-normal bg-[#FCFCFD] pl-6">
                            {d1?.component?.label}
                          </th>

                          <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal bg-[#FCFCFD]">
                            ₹{' '}
                            {Math.round(d1?.charges || 0).toLocaleString(
                              'en-IN'
                            )}
                          </td>
                          <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal bg-[#FCFCFD] ">
                            ₹{' '}
                            {Math.round(d1?.TotalSaleValue || 0).toLocaleString(
                              'en-IN'
                            )}
                          </td>
                          <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal px-2 bg-[#FCFCFD]">
                            ₹{' '}
                            {Math.round(d1?.gstValue || 0).toLocaleString(
                              'en-IN'
                            )}
                          </td>
                          <td className="w-[15%] text-[12px] text-right  text-[#606062] font-normal bg-[#FCFCFD] pr-6">
                            ₹{' '}
                            {Math.round(
                              d1?.TotalNetSaleValueGsT || 0
                            ).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                      <tr className=" h-[32px]  bg-[#FCFCFD]">
                        <th className="w-[40%]  font-medium text-[12px] text-left pl-6 text-[#0E0A1F] ">
                          {' '}
                          Total:
                        </th>
                        <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                        <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                        <td className="w-[15%] font-interF font-medium  text-[12px] text-right text-[#606062] font-normal pr-2  "></td>
                        <td className="w-[15%] font-medium  text-[12px] text-right text-[#0E0A1F]  pr-6">
                          ₹{' '}
                          {Math.round(partATotal || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="w-full mt-5  rounded-2xl overflow-hidden">
                    <thead>
                      <tr className=" h-9 border-b-[0.2px]  w-[100%]">
                        <th className="min-w-[35%] text-[12px] text-left text-[#0E0A1F]  font-medium bg-[#EDE9FE]     tracking-wide  pl-6">
                          Additional Charges
                        </th>
                        <th className="w-[15%] text-[12px] text-right text-[#0E0A1F]  font-medium bg-[#EDE9FE]  tracking-wide">
                          Rate/Sqft
                        </th>
                        <th className="w-[15%] text-[12px] text-right text-[#0E0A1F]  font-medium bg-[#EDE9FE]  tracking-wide ">
                          Sale Value
                        </th>
                        <th className="w-[15%] text-[12px] text-right text-[#0E0A1F]  font-medium bg-[#EDE9FE]   tracking-wide px-2">
                          GST
                        </th>
                        <th className="w-[15%] text-[12px] text-right text-[#0E0A1F]  font-medium bg-[#EDE9FE]     tracking-wide pr-6 ">
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
                          <th className=" text-[12px] w-[40%] text-left text-[#606062] font-normal pl-6 bg-[#FCFCFD]">
                            {d1?.component?.label}
                          </th>
                          <td className="text-[12px] w-[15%] text-right text-[#606062] font-normal px-2 bg-[#FCFCFD]">
                            {/* ₹{Number(d1?.charges)?.toLocaleString('en-IN')} */}
                            {d1?.units.value === 'fixedcost' ? (
                              'Fixed'
                            ) : (
                              <>
                                ₹{' '}
                                {Math.round(d1?.charges || 0).toLocaleString(
                                  'en-IN'
                                )}
                              </>
                            )}
                          </td>

                          <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal bg-[#FCFCFD] ">
                            ₹{' '}
                            {Math.round(d1?.TotalSaleValue || 0).toLocaleString(
                              'en-IN'
                            )}
                          </td>
                          <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal px-2 bg-[#FCFCFD]">
                            ₹{' '}
                            {Math.round(d1?.gstValue || 0).toLocaleString(
                              'en-IN'
                            )}
                          </td>

                          <td className="text-[12px] w-[15%] text-right text-[#606062] font-normal bg-[#FCFCFD] pr-6">
                            {/* {Number(
                              computeTotal(
                                d1,
                                selCustomerPayload?.area
                                  ?.toString()
                                  ?.replace(',', '')
                              )
                            )?.toLocaleString('en-IN')} */}
                            ₹{' '}
                            {Math.round(
                              d1?.TotalNetSaleValueGsT || 0
                            ).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                      <tr className=" h-[32px]  bg-[#FCFCFD] ">
                        <th className="w-[40%]  font-medium text-[12px] text-left text-[#0E0A1F] pl-6 ">
                          {' '}
                          Total:
                        </th>
                        <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                        <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                        <td className="w-[15%] font-medium text-[#606062] font-normal text-[12px] text-right  pr-2  "></td>
                        <td className="text-[12px] text-right font-medium text-[#0E0A1F]  pr-6">
                          ₹{' '}
                          {Math.round(partBTotal || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {selCustomerPayload?.constructCS?.length > 0 && (
                    <table className="w-[100%]  mt-5  rounded-2xl overflow-hidden">
                      <thead>
                        <tr className=" h-9  w-[100%]">
                          <th className="min-w-[35%] text-[12px] text-left text-[#0E0A1F]  font-medium    bg-[#EDE9FE]  tracking-wide  pl-6">
                            Construction Charges
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F]   font-medium bg-[#EDE9FE] tracking-wide">
                            Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F]  font-medium bg-[#EDE9FE] tracking-wide ">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F]  font-medium bg-[#EDE9FE] tracking-wide px-2">
                            GST
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F]  font-medium bg-[#EDE9FE]    tracking-wide pr-6 ">
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
                            <th className="w-[40%] text-[12px] text-left text-[#606062] font-normal bg-[#FCFCFD]  pl-6">
                              {d1?.component?.label}
                            </th>

                            <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal bg-[#FCFCFD] ">
                              ₹{' '}
                              {Math.round(d1?.charges || 0).toLocaleString(
                                'en-IN'
                              )}
                            </td>
                            <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal bg-[#FCFCFD]  ">
                              ₹{' '}
                              {Math.round(
                                d1?.TotalSaleValue || 0
                              ).toLocaleString('en-IN')}
                            </td>
                            <td className="w-[15%] text-[12px] text-right  px-2 text-[#606062] font-normal bg-[#FCFCFD] ">
                              ₹{' '}
                              {Math.round(d1?.gstValue || 0).toLocaleString(
                                'en-IN'
                              )}
                            </td>
                            <td className="w-[15%] text-[12px] text-right  text-[#606062] font-normal bg-[#FCFCFD]  pr-6">
                              ₹{' '}
                              {Math.round(
                                d1?.TotalNetSaleValueGsT || 0
                              ).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                        <tr className=" h-[32px]  bg-[#FCFCFD]">
                          <th className="w-[40%] text-[14px]  font-medium text-left text-[#0E0A1F] pl-6 ">
                            {' '}
                            Total:
                          </th>
                          <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                          <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                          <td className="w-[15%]   font-medium text-[#606062] font-normal text-[12px] text-right  pr-2  "></td>
                          <td className="w-[15%]  text-[12px] text-right font-medium text-[#0E0A1F]   pr-6">
                            ₹{' '}
                            {Math.round(constructTotalA || 0).toLocaleString(
                              'en-IN'
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {selCustomerPayload?.constAdditionalChargesCS?.length > 0 && (
                    <table className="w-[100%]  mt-5  rounded-2xl overflow-hidden">
                      <thead>
                        <tr className=" h-9  w-[100%]">
                          <th className="min-w-[35%] text-[12px] text-left text-[#0E0A1F] font-medium bg-[#EDE9FE]  pl-6  tracking-wide  px-2">
                            Construction Additional Charges
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F] font-medium bg-[#EDE9FE] tracking-wide">
                            Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F] font-medium bg-[#EDE9FE] tracking-wide ">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F] font-medium bg-[#EDE9FE]  tracking-wide px-2">
                            GST
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F] font-medium bg-[#EDE9FE] pr-6  tracking-wide pr-6 ">
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
                              <th className="w-[40%] text-[12px] text-left text-[#606062] font-normal bg-[#FCFCFD] pl-6">
                                {d1?.component?.label} {d1?.purpose}
                              </th>

                              <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal bg-[#FCFCFD]">
                                {d1?.units.value === 'fixedcost' ? (
                                  'Fixed'
                                ) : (
                                  <>
                                    ₹{' '}
                                    {Math.round(
                                      d1?.charges || 0
                                    ).toLocaleString('en-IN')}
                                  </>
                                )}
                              </td>
                              <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal bg-[#FCFCFD] ">
                                ₹{' '}
                                {Math.round(
                                  d1?.TotalSaleValue || 0
                                ).toLocaleString('en-IN')}
                              </td>
                              <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal px-2 bg-[#FCFCFD]">
                                ₹{' '}
                                {Math.round(d1?.gstValue || 0).toLocaleString(
                                  'en-IN'
                                )}
                              </td>
                              <td className="w-[15%] text-[12px] text-right  text-gray-800 bg-[#FCFCFD] pr-6">
                                ₹{' '}
                                {Math.round(
                                  d1?.TotalNetSaleValueGsT || 0
                                ).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          )
                        )}
                        <tr className=" h-[32px]  bg-[#FCFCFD]">
                          <th className="w-[40%] font-medium text-[14px] text-left text-[#0E0A1F] pl-6 ">
                            {' '}
                            Total:
                          </th>
                          <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                          <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                          <td className="w-[15%] font-medium text-[#606062] font-normal text-[12px]  text-right  pr-2  "></td>
                          <td className="w-[15%] font-medium  text-[14px] text-right text-[#0E0A1F]  pr-6">
                            ₹{' '}
                            {Math.round(constructTotalB || 0).toLocaleString(
                              'en-IN'
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {selCustomerPayload?.possessionAdditionalCostCS?.length >
                    0 && (
                    <table className="w-[100%]  mt-5  rounded-2xl overflow-hidden">
                      <thead>
                        <tr className=" h-9  w-[100%]">
                          <th className="min-w-[35%] text-[12px] text-left text-[#0E0A1F] font-medium bg-[#EDE9FE]    tracking-wide  pl-6">
                            Possession Charges
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F] font-medium bg-[#EDE9FE] tracking-wide">
                            Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F] font-medium bg-[#EDE9FE] tracking-wide ">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F] font-medium bg-[#EDE9FE]  tracking-wide px-2">
                            GST
                          </th>
                          <th className="w-[15%] text-[12px] text-right text-[#0E0A1F] font-medium bg-[#EDE9FE]    tracking-wide pr-6 ">
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
                              <th className="w-[40%] text-[12px] text-left text-[#606062] font-normal bg-[#FCFCFD] pl-6">
                                {d1?.component?.label}
                              </th>

                              <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal bg-[#FCFCFD]">
                                {d1?.units.value === 'fixedcost' ? (
                                  'Fixed'
                                ) : (
                                  <>
                                    ₹{' '}
                                    {Math.round(
                                      d1?.charges || 0
                                    ).toLocaleString('en-IN')}
                                  </>
                                )}
                              </td>
                              <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal bg-[#FCFCFD] ">
                                ₹{' '}
                                {Math.round(
                                  d1?.TotalSaleValue || 0
                                ).toLocaleString('en-IN')}
                              </td>
                              <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal px-2 bg-[#FCFCFD]">
                                ₹{' '}
                                {Math.round(d1?.gstValue || 0).toLocaleString(
                                  'en-IN'
                                )}
                              </td>
                              <td className="w-[15%] text-[12px] text-right  text-gray-800 bg-[#FCFCFD] pr-6">
                                ₹{' '}
                                {Math.round(
                                  d1?.TotalNetSaleValueGsT || 0
                                ).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          )
                        )}
                        <tr className=" h-[32px]  bg-[#FCFCFD]">
                          <th className="w-[40%] text-[14px] font-medium text-left text-[#0E0A1F] pl-6 ">
                            {' '}
                            Total:
                          </th>
                          <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                          <td className="w-[5%] font-bold  text-[10px] text-right text-gray-800   "></td>
                          <td className="w-[15%] font-medium text-[#606062] font-normal text-[12px]  text-right pr-2  "></td>
                          <td className="w-[15%] font-medium  text-[14px] text-right text-[#0E0A1F]  pr-6">
                            ₹{' '}
                            {Math.round(possessionTotal || 0).toLocaleString(
                              'en-IN'
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                  {selCustomerPayload?.addOnCS?.length > 0 && (
                    <>
                      <table className="w-full  mt-5  rounded-2xl overflow-hidden">
                        <thead>
                          <tr className=" h-9 border-b-[0.2px]  w-[100%]">
                            <th className="min-w-[35%] text-[12px] text-left text-[#0E0A1F] bg-[#EDE9FE]   rounded-tl-[10px]  tracking-wide  px-2">
                              Modifications
                            </th>

                            <th className="w-[15%] text-[12px] text-left text-[#0E0A1F] bg-[#EDE9FE]   tracking-wide px-2">
                              Comment
                            </th>
                            <th className="w-[15%] text-[12px] text-right text-[#0E0A1F] bg-[#EDE9FE]  tracking-wide">
                              Sale Value
                            </th>
                            <th className="w-[15%] text-[12px] text-right text-[#0E0A1F] bg-[#EDE9FE]  tracking-wide">
                              GST
                            </th>
                            <th className="w-[15%] text-[12px] text-right text-[#0E0A1F] bg-[#EDE9FE] rounded-tr-[10px]  tracking-wide pr-2 ">
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
                              <th className=" text-[12px] w-[40%] text-left text-[#606062] font-normal px-2 bg-[#FCFCFD]">
                                <section className="flex flex-row">
                                  {' '}
                                  {d1?.component?.label}{' '}
                                  <Download className="text-center ml-16 w-[13px] h-6 " />
                                </section>
                              </th>
                              <td className="w-[15%] text-[12px] text-left text-[#606062] font-normal px-2 bg-[#FCFCFD]">
                                {d1?.description}
                              </td>
                              <td className="text-[12px] w-[15%] text-right text-[#606062] font-normal px-2 bg-[#FCFCFD]">
                                ₹{' '}
                                {Math.round(
                                  Number(d1?.charges) || 0
                                ).toLocaleString('en-IN')}
                              </td>
                              <td className="text-[12px] w-[15%] text-right text-[#606062] font-normal px-2 bg-[#FCFCFD]">
                                ₹{' '}
                                {Math.round(
                                  Number(d1?.gstValue) || 0
                                ).toLocaleString('en-IN')}
                              </td>

                              <td className="w-[15%] text-[12px] text-right text-[#606062] font-normal bg-[#FCFCFD] pr-2 ">
                                ₹{' '}
                                {Math.round(
                                  Number(
                                    computeTotal(
                                      d1,
                                      selCustomerPayload?.area
                                        ?.toString()
                                        ?.replace(',', '')
                                    )
                                  ) || 0
                                ).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                          <tr className="border-b-[0.05px] border-gray-300 h-[32px]   bg-[#FCFCFD]">
                            <th className="w-[40%] text-[14px] font-medium text-left text-[#0E0A1F]  ">
                              {' '}
                              Total:
                            </th>
                            <td className="w-[15%] font-bold text-[10px] text-right text-gray-800  "></td>
                            <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800   "></td>
                            <td className="w-[15%] font-medium text-[#606062] font-normal text-[14px] text-right  pr-2  ">
                              {' '}
                            </td>
                            <td className="text-[12px] text-right font-medium text-[#606062] font-normal  px-2">
                              ₹{' '}
                              {Math.round(
                                Number(addOnTotal) || 0
                              ).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  )}
                  <section className="flex bg-[#FCFCFD] flex-row-reverse justify-between w-full  rounded-2xl overflow-hidden mt-5 rounded-b-2xl px-3">
                    <div className="flex  flex-row mt-2 text-bodyLato text-left text-gray-800  text-[14px] mb-2 ">
                      Total Unit Cost:
                      <section className="flex flex-row mt-1">
                        <section className="px-2 d-md font-bold text-[14px] text-[#000000e6] leading-none mr-1">
                          ₹{' '}
                          {Math.round(
                            Number(grossUnitTotal) || 0
                          ).toLocaleString('en-IN')}
                        </section>
                      </section>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <CrmUnitFinanceHistory
        selCustomerPayload={selCustomerPayload}
        assets={assets}
        totalIs={totalIs}
        grossUnitTotal={grossUnitTotal}
        unitTransactionsA={unitTransactionsA}
        // projectDetails={projectDetails}
      /> */}
      </div>
    </>
  )
}

export default CrmUnitCostSheetView
