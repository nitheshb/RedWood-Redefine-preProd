import { useState, useEffect, createRef, useRef } from 'react'

import { Timestamp } from '@firebase/firestore'
import { PDFExport } from '@progress/kendo-react-pdf'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'

import { useAuth } from 'src/context/firebase-auth-context'

import { computeTotal } from './computeCsTotals'
import { TextFieldFlat } from './formFields/TextFieldFlatType'

const CostBreakUpPdfAll = ({
  projectDetails,
  csMode,
  costSheet,
  setCostSheet,
  pdfExportComponent,
  selPhaseObj,
  selUnitDetails,
  leadDetailsObj1,
  setNewConstructCsObj,
  newConstructCsObj,
  costSheetA,
  setCostSheetA,
  setNewConstructPS,
  newConstructPS,
}) => {
  const { user } = useAuth()
  const ref = createRef()

  useEffect(() => {}, [])
  const [initialValuesA, setInitialValuesA] = useState({})

  const [newSqftPrice, setNewSqftPrice] = useState(0)

  const [netTotal, setNetTotal] = useState(0)
  const [partATotal, setPartATotal] = useState(0)
  const [partBTotal, setPartBTotal] = useState(0)
  const [plotBookingAdv, setPlotBookingAdv] = useState(0)
  const [partBPayload, setPartBPayload] = useState([])
  const [psPayload, setPSPayload] = useState([])

  useEffect(() => {
    setTotalFun()
  }, [costSheetA, selPhaseObj])

  useEffect(() => {
    setNewConstructCsObj(costSheetA)
  }, [newSqftPrice])

  useEffect(() => {
    console.log('selUnitDetails', selUnitDetails)
    const {
      additonalChargesObj,
      ConstructOtherChargesObj,
      ConstructPayScheduleObj,
      paymentScheduleObj,
    } = selPhaseObj
    const { uid } = selUnitDetails
    const y = leadDetailsObj1[`${uid}_cs`]?.newSqftPrice || ''
    const z = leadDetailsObj1[`${uid}_cs`]?.newPLC || ''


    let x = []
    if (csMode === 'plot_cs') {
      setPartBPayload(additonalChargesObj)
      setPSPayload(paymentScheduleObj)
      x = [
        {
          myId: '1',
          units: {
            value: 'fixedcost',
            label: 'Fixed cost',
          },
          component: {
            value: 'unit_cost_charges',
            label: 'Unit Cost',
          },
          others: selUnitDetails?.rate_per_sqft,
          charges: Number.isFinite(y) ? y : selUnitDetails?.rate_per_sqft,
          TotalSaleValue: Number.isFinite(y)
            ? Number(selUnitDetails?.super_built_up_area * y)
            : Number(
                selUnitDetails?.super_built_up_area *
                  selUnitDetails?.rate_per_sqft
              ),
          // charges: y,
          gst: {
            label: '0.05',
            value: Number.isFinite(y)
              ? Number(selUnitDetails?.super_built_up_area * y)
              : Math.round(
                  selUnitDetails?.super_built_up_area *
                    selUnitDetails?.rate_per_sqft
                ) * 0.05,
          },
          TotalNetSaleValueGsT:
            (Number.isFinite(y)
              ? Number(selUnitDetails?.super_built_up_area * y)
              : Number(
                  selUnitDetails?.super_built_up_area *
                    selUnitDetails?.rate_per_sqft
                )) +
            (Number.isFinite(y)
              ? Number(selUnitDetails?.super_built_up_area * y)
              : Math.round(
                  selUnitDetails?.super_built_up_area *
                    selUnitDetails?.rate_per_sqft
                ) * 0.05),
        },
        {
          myId: '2',
          units: {
            value: 'fixedcost',
            label: 'Fixed cost',
          },
          component: {
            value: 'plc_cost_sqft',
            label: 'PLCf ',
          },
          others: selUnitDetails?.PLC || 500,
          charges: Number.isFinite(y) ? y : selUnitDetails?.plc || 500,
          TotalSaleValue: Math.round(
            selUnitDetails?.super_built_up_area * (selUnitDetails?.plc || 200)
          ),
          // charges: y,
          gst: {
            label: '0.05',
            value: Math.round(
              Number(
                selUnitDetails?.super_built_up_area *
                  (selUnitDetails?.PLC || 200)
              ) * 0.05
            ),
          },
          TotalNetSaleValueGsT:
            Math.round(
              selUnitDetails?.super_built_up_area * (selUnitDetails?.PLC || 200)
            ) +
            Math.round(
              Number(
                selUnitDetails?.super_built_up_area *
                  (selUnitDetails?.PLC || 200)
              ) * 0.05
            ),
        },
      ]
    } else {
      setPartBPayload([...additonalChargesObj || [], ...ConstructOtherChargesObj || []])
      setPSPayload(ConstructPayScheduleObj)
      x = [
        {
          myId: '1',
          units: {
            value: 'fixedcost',
            label: 'Fixed cost',
          },
          component: {
            value: 'unit_cost_charges',
            label: 'Unit Cost',
          },
          others: selUnitDetails?.rate_per_sqft,
          charges: Number.isFinite(y) ? y : selUnitDetails?.rate_per_sqft,
          TotalSaleValue: Number.isFinite(y)
            ? Number(selUnitDetails?.plot_Sqf * y)
            : Number(selUnitDetails?.plot_Sqf * selUnitDetails?.rate_per_sqft),
          // charges: y,
          gst: {
            label: '0.05',
            value: Number.isFinite(y)
              ? Number(selUnitDetails?.plot_Sqf * y)
              : Math.round(
                  selUnitDetails?.plot_Sqf * selUnitDetails?.rate_per_sqft
                ) * 0.05,
          },
          TotalNetSaleValueGsT:
            (Number.isFinite(y)
              ? Number(selUnitDetails?.super_built_up_area * y)
              : Number(
                  selUnitDetails?.plot_Sqf *
                    selUnitDetails?.rate_per_sqft
                )) +
            (Number.isFinite(y)
              ? Number(selUnitDetails?.super_built_up_area * y)
              : Math.round(
                  selUnitDetails?.plot_Sqf *
                    selUnitDetails?.rate_per_sqft
                ) * 0.05),
        },
        {
          myId: '2',
          units: {
            value: 'fixedcost',
            label: 'Fixed cost',
          },
          component: {
            value: 'villa_construct_cost',
            label: 'Villa Construction Cost',
          },
          others: selUnitDetails?.construct_cost_sqf,
          charges: Number.isFinite(y) ? y : selUnitDetails?.construct_cost_sqf,
          TotalSaleValue: Number.isFinite(y)
            ? Number(selUnitDetails?.super_built_up_area * y)
            : Number(
                selUnitDetails?.super_built_up_area * selUnitDetails?.construct_cost_sqf
              ),
          // charges: y,
          gst: {
            label: '0.05',
            value: Number.isFinite(y)
              ? Number(selUnitDetails?.super_built_up_area * y)
              : Math.round(
                  selUnitDetails?.super_built_up_area * selUnitDetails?.construct_cost_sqf
                ) * 0.05,
          },
          TotalNetSaleValueGsT:
            (Number.isFinite(y)
              ? Number(selUnitDetails?.super_built_up_area * y)
              : Number(
                  selUnitDetails?.super_built_up_area * selUnitDetails?.construct_cost_sqf
                )) +
            (Number.isFinite(y)
              ? Number(selUnitDetails?.super_built_up_area * y)
              : Math.round(
                  selUnitDetails?.super_built_up_area * selUnitDetails?.construct_cost_sqf
                ) * 0.05),
        },
        {
          myId: '3',
          units: {
            value: 'fixedcost',
            label: 'Fixed cost',
          },
          component: {
            value: 'plc_cost_sqft',
            label: 'PLC  ',
          },
          others: selUnitDetails?.plc || 200,
          charges: Number.isFinite(y) ? y : selUnitDetails?.plc || 200,
          TotalSaleValue: Math.round(
            selUnitDetails?.super_built_up_area * (selUnitDetails?.plc || 200)
          ),
          // charges: y,
          gst: {
            label: '0.05',
            value: Math.round(
              Number(
                selUnitDetails?.super_built_up_area *
                  (selUnitDetails?.plc || 200)
              ) * 0.05
            ),
          },
          TotalNetSaleValueGsT:
            Math.round(
              selUnitDetails?.super_built_up_area * (selUnitDetails?.plc || 200)
            ) +
            Math.round(
              Number(
                selUnitDetails?.super_built_up_area *
                  (selUnitDetails?.plc || 200)
              ) * 0.05
            ),
        },

        // {
        //   myId: '2',
        //   units: {
        //     value: 'fixedcost',
        //     label: 'Fixed cost',
        //   },
        //   component: {
        //     value: 'Bescom_Sewage_Charges',
        //     label: 'Bescom & Sewage Charges ',
        //   },
        //   others: selUnitDetails?.PLC || 200,
        //   charges: Number.isFinite(y) ? y : selUnitDetails?.PLC || 200,
        //   TotalSaleValue: Math.round(
        //     selUnitDetails?.builtup_area * (selUnitDetails?.PLC || 200)
        //   ),
        //   gst: {
        //     label: '0.05',
        //     value: Math.round(
        //       Number(
        //         selUnitDetails?.builtup_area * (selUnitDetails?.PLC || 200)
        //       ) * 0.05
        //     ),
        //   },
        //   TotalNetSaleValueGsT:
        //     Math.round(
        //       selUnitDetails?.builtup_area * (selUnitDetails?.PLC || 200)
        //     ) +
        //     Math.round(
        //       Number(
        //         selUnitDetails?.builtup_area * (selUnitDetails?.PLC || 200)
        //       ) * 0.05
        //     ),
        // },
        // {
        //   myId: '3',
        //   units: {
        //     value: 'fixedcost',
        //     label: 'Fixed cost',
        //   },
        //   component: {
        //     value: 'clubhouse',
        //     label: 'Club House ',
        //   },
        //   others: selUnitDetails?.PLC || 200,
        //   charges: 0,
        //   TotalSaleValue: 354000,
        //   gst: {
        //     label: '0.05',
        //     value: Math.round(354000 * 0.0),
        //   },
        //   TotalNetSaleValueGsT: 354000,
        // },
      ]
    }
    // const x = costSheetA
    let merged = []
    try {
      if (leadDetailsObj1) {
        if (leadDetailsObj1[`${uid}_cs`]['costSheetA']) {
          const removeFulCostFieldA = leadDetailsObj1[`${uid}_cs`][
            'costSheetA'
          ].filter((dat) => dat?.component?.value != 'unit_cost_charges')
          merged = [...x, ...removeFulCostFieldA]
        } else {
          merged = [...x, ...additonalChargesObj]
        }
      }
    } catch (error) {
      console.log('error at feching the leadDetails Obj')
      // merged = [...x, ...additonalChargesObj]
    }

    const initformValues = {}
    merged.map((d) => {
      const x = d['component']['value']
      initformValues[`${x}`] = d?.charges
    })
    setInitialValuesA(initformValues)

    setCostSheetA(x)
  }, [selPhaseObj, leadDetailsObj1, csMode])

  useEffect(() => {
    CreateNewPsFun(netTotal, plotBookingAdv, csMode)
  }, [])
  useEffect(() => {
    CreateNewPsFun(netTotal, plotBookingAdv, csMode)
  }, [netTotal, plotBookingAdv, csMode])

  const CreateNewPsFun = (netTotal, plotBookingAdv, csMode) => {
    const newPs = psPayload?.map((d1) => {
      const z = d1
      if (csMode === 'plot_cs') {
        z.value = ['on_booking']?.includes(d1?.stage?.value)
          ? Number(d1?.percentage)
          : Math.round((netTotal - plotBookingAdv) * (d1?.percentage / 100))
        if (['on_booking']?.includes(d1?.stage?.value)) {
          z.elgible = true
          z.elgFrom = Timestamp.now().toMillis()
          return z
        }
        return z
      } else {
        z.value = ['Total_Other_Charges_Amenities:\t']?.includes(
          d1?.stage?.value
        )
          ? Number(partBTotal)
          : Math.round((netTotal - partBTotal) * (d1?.percentage / 100))
        return z
      }
    })
    setNewConstructPS(newPs)
  }

  const initialState = initialValuesA
  const validate = Yup.object({
    // blockReason: Yup.number()
    //   .max(15, 'Must be 15 characters or less')
    //   .required('Name is Required'),
  })
  const setTotalFun = async () => {
    const partBTotal = partBPayload.reduce(
      (partialSum, obj) =>
        partialSum +
        Number(computeTotal(obj, selUnitDetails?.super_built_up_area)),
      0
    )

    const partATotal = costSheetA.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    setPartBTotal(partBTotal)
    setPartATotal(partATotal)
    setNetTotal(partATotal + partBTotal)
    selPhaseObj?.paymentScheduleObj?.map((data) => {
      if (data?.stage?.value === 'on_booking') {
        setPlotBookingAdv(data?.percentage)
      }
    })
  }
  const onSubmit = async (data, resetForm) => {
    const { uid } = selUnitDetails
    const { id } = leadDetailsObj1
    // const x = {
    //   myId: '2',
    //   units: {
    //     value: 'fixedcost',
    //     label: 'Fixed cost',
    //   },
    //   component: {
    //     value: 'ratePerSqft',
    //     label: 'sqftCost',
    //   },
    //   charges: Number(newSqftPrice),
    //   gst: {
    //     label: '0',
    //     value: '0',
    //   },
    // }

    const newCostSheetA = costSheetA.map((dat) => {
      dat.charges = data[dat?.component?.value]
      return dat
    })
    // newCostSheetA.push(x)
    // i need unit_uID & unit details
    const xData = {}

    xData[`${uid}${'_cs'}`] = {
      oldUnitDetailsObj: selUnitDetails,
      newSqftPrice: Number(newSqftPrice),
      soldPrice: Number(soldPrice),
      costSheetA: newCostSheetA,
    }
    console.log('my imported details is cs verification', newCostSheetA )
    setCostSheet(newCostSheetA)
    updateLeadCostSheetDetailsTo(
      orgId,
      id,
      xData,
      'nitheshreddy.email@gmail.com',
      enqueueSnackbar,
      resetForm
    )
  }
  const changeOverallCostFun = async (inx, payload, newValue) => {
    const y = costSheetA
    const gstTaxForProjA = selPhaseObj?.partATaxObj.filter((d)=> d?.component.value === 'sqft_cost_tax')
    const gstTaxIs = gstTaxForProjA.length >0 ? gstTaxForProjA[0]?.gst?.value: 0
    const plcGstForProjA = selPhaseObj?.partATaxObj.filter((d)=> d?.component.value === 'plc_tax')
    const plcGstIs = plcGstForProjA.length >0 ? plcGstForProjA[0]?.gst?.value: 0
    const total = Math.round(selUnitDetails?.super_built_up_area * newValue)
    const gstTotal = Math.round(
      Number(selUnitDetails?.super_built_up_area * newValue) * gstTaxIs
    )
    y[inx].charges = newValue
    y[inx].TotalSaleValue = total
    y[inx].gst.label = gstTaxIs
    y[inx].gst.value = gstTotal
    y[inx].TotalNetSaleValueGsT = total + gstTotal

    setCostSheetA(y)
    setTotalFun()
  }
  return (
    <div>
      <div
      // style={{
      //   position: 'absolute',
      //   left: '-1000px',
      //   top: 0,
      // }}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initialState}
          validationSchema={validate}
          onSubmit={(values, { resetForm }) => {
            console.log('my imported details is', values)
            onSubmit(values, resetForm)
          }}
        >
          {(formik) => (
            <PDFExport paperSize="A4" margin="1cm" ref={pdfExportComponent}>
              <div className="p-4">
                <div>
                  {/* upper part */}
                  <div className="flex flex-row justify-between pt-4">
                    <h1 className="font-playfair text-[19px]  text-gray-700">
                      {projectDetails?.projectName?.toUpperCase()}
                    </h1>
                    <div>
                      <img
                        className="h-6 w-24"
                        alt="barcode"
                        src="https://t4.ftcdn.net/jpg/02/28/23/91/240_F_228239110_4eEmhcqbUpZG8y1x1aazFBQMVmbGjoce.jpg"
                      />
                      <div className=" text-center">
                        <span className="tracking-widest font-bodyLato  text-gray-400 text-[10px] mb-[2px]">
                          23456788
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* form  */}
                  <div className=" my-10  justify-end">
                    <h1 className="text-bodyLato text-right text-green-600 font-semibold text-[8px]">
                      Total Amount
                    </h1>
                    <p className="text-bodyLato font-bold text-right text-gray-800 text-[10px]">
                      Rs.{netTotal?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-bodyLato text-left text-gray-800 font-semibold text-[12px] mb-2">
                      Plot Sales Value Information (A)
                    </h1>
                    <table className="w-[100%]">
                      <thead>
                        <tr className=" h-6 border-b-[0.2px] border-gray-300 w-[100%]">
                          <th className="min-w-[35%] text-[10px] text-left text-[#8993a4] font-bodyLato tracking-wide">
                            Charges
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#8993a4] font-bodyLato tracking-wide">
                            Plot Rate/Sqft
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#8993a4] font-bodyLato tracking-wide">
                            Sale Value
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#8993a4] font-bodyLato tracking-wide ">
                            GST
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-[#8993a4] font-bodyLato tracking-wide">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {' '}
                        {costSheetA?.map((d1, inx) => (
                          <tr
                            key={inx}
                            className="border-b-[0.05px] border-gray-300"
                          >
                            <th className="w-[40%] text-[10px] text-left text-gray-700  ">
                              {d1?.component?.label}
                            </th>
                            <td className="w-[15%] text-[10px] text-right text-gray-700 ">
                              <TextFieldFlat
                                label=""
                                className="w-[100%] text-[10px] text-right text-gray-800"
                                name="ratePerSqft"
                                onChange={(e) => {
                                  // setNewSqftPrice(e.target.value)
                                  formik.setFieldValue(
                                    'unit_cost_charges',
                                    e.target.value
                                  )
                                  setNewSqftPrice(e.target.value)
                                  changeOverallCostFun(inx, d1, e.target.value)
                                  // formik.setFieldValue(
                                  //   'ratePerSqft',
                                  //   e.target.value
                                  // )
                                  // console.log(
                                  //   'what is =it',
                                  //   value.value
                                  // )
                                  // formik.setFieldValue(
                                  //   `${d1?.component?.value}`,
                                  //   value
                                  // )
                                }}
                                // value={formik.values[`unit_cost_charges`]}
                                value={d1?.charges?.toLocaleString('en-IN')}
                                // value={newSqftPrice}
                                // type="number"
                              />
                              <TextFieldFlat
                                className=" hidden  "
                                label=""
                                name={d1?.component?.value}
                                // onChange={(value) => {
                                //   console.log('what is =it', value.value)
                                //   formik.setFieldValue(
                                //     `${d1?.component?.value}`,
                                //     value
                                //   )
                                // }}
                                // value={
                                //   formik.values[`${d1?.component?.value}`]
                                // }
                                // value={d1?.charges}
                                type="number"
                              />
                            </td>
                            <td className="w-[15%] text-[10px] text-right text-gray-700 ">
                              {d1?.TotalSaleValue?.toLocaleString('en-IN')}
                            </td>
                            <td className="w-[15%] text-[10px] text-right text-gray-700 ">
                              {d1?.gst?.value?.toLocaleString('en-IN')}
                            </td>
                            <td className="w-[15%] text-[10px] text-right text-gray-800 ">
                              {d1?.TotalNetSaleValueGsT?.toLocaleString(
                                'en-IN'
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-b-[0.05px] border-gray-300">
                          <th className="w-[40%] text-[10px] text-left text-gray-800 ">
                            Total (A)
                          </th>
                          <td className="w-[15%] font-bold text-[10px] text-right text-gray-800 ">
                            {costSheetA
                              .reduce(
                                (partialSum, obj) =>
                                  partialSum + Number(obj?.charges),
                                0
                              )
                              ?.toLocaleString('en-IN')}
                          </td>
                          <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800 ">
                            {costSheetA
                              .reduce(
                                (partialSum, obj) =>
                                  partialSum + Number(obj?.TotalSaleValue),
                                0
                              )
                              ?.toLocaleString('en-IN')}
                          </td>
                          <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800 ">
                            {costSheetA
                              .reduce(
                                (partialSum, obj) =>
                                  partialSum + Number(obj?.gst?.value),
                                0
                              )
                              ?.toLocaleString('en-IN')}
                          </td>
                          <td className="w-[15%] font-bold  text-[10px] text-right text-gray-800 ">
                            {partATotal?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <h1 className=" mt-10 mb-1 text-bodyLato text-left text-gray-800 font-semibold text-[12px] mb-1">
                      Other Charges (B)
                    </h1>
                    <table className="w-full">
                      <thead>
                        {' '}
                        <tr className=" h-6  border-b-[0.2px] border-gray-300">
                          <th className="w-[50%] text-[10px] text-left text-gray-700 text-[#8993a4] font-bodyLato tracking-wide uppercase ">
                            Charges
                          </th>
                          <th className="w-[35%] text-[10px] text-left text-gray-700 text-[#8993a4] font-bodyLato tracking-wide uppercase ">
                            Timeline
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-gray-700  text-[#8993a4] font-bodyLato tracking-wide uppercase">
                            Total Inc GST
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {partBPayload?.map((d1, inx) => (
                          <tr
                            key={inx}
                            className="border-b-[0.05px] border-gray-300"
                          >
                            <th className=" text-[10px] text-left text-gray-700 ">
                              {d1?.component?.label} (0.05% Plor Sale value)
                            </th>
                            <td className="text-[10px] text-left text-gray-700 ">
                              {d1?.description}
                            </td>
                            <td className="text-[10px] text-right text-gray-700 ">
                              {Number(
                                computeTotal(
                                  d1,
                                  selUnitDetails?.super_built_up_area
                                )
                              )?.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-b-[0.05px] border-gray-300">
                          <th className="text-[10px] text-left text-gray-700 ">
                            Total (B)
                          </th>
                          <td className="text-[10px] text-right text-gray-400 "></td>
                          <td className="text-[10px] text-right text-gray-800 font-bold ">
                            {partBTotal?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <section className="flex flex-row justify-between  mt-4 rounded">
                      <h1 className=" mt-4 text-bodyLato text-left text-gray-800 font-semibold text-[12px] mb-2">
                        Total Plot Sale Value(A+B)
                      </h1>
                      <section className=" mt-4 text-green-600  ">
                        {netTotal?.toLocaleString('en-IN')}
                      </section>
                    </section>
                    <h1 className=" mt-10 text-bodyLato text-left text-gray-800 font-semibold text-[12px] mb-2">
                      Plot - Payment Schedule
                    </h1>
                    <table className="w-full">
                      <thead>
                        {' '}
                        <tr className=" h-6 border-b-[0.2px] border-gray-300">
                          <th className="w-[50%] text-[10px] text-left text-gray-400 text-[#8993a4] font-bodyLato tracking-wide uppercase ">
                            Charges
                          </th>
                          <th className="w-[35%] text-[10px] text-left text-gray-400  text-[#8993a4] font-bodyLato tracking-wide uppercase">
                            Payment Timeline
                          </th>
                          <th className="w-[15%] text-[10px] text-right text-gray-400 text-[#8993a4] font-bodyLato tracking-wide uppercase ">
                            Total inc GST
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {newConstructPS?.map((d1, inx) => (
                          <tr
                            key={inx}
                            className="border-b-[0.05px] border-gray-300"
                          >
                            <th className=" text-[10px] text-left text-gray-700 ">
                              {d1?.stage?.label}
                            </th>
                            <td className="text-[10px] text-left text-gray-700 ">
                              {d1?.description}
                            </td>
                            <td className="text-[10px] text-right text-gray-800 ">
                              {d1?.value}
                            </td>
                          </tr>
                        ))}

                        <tr className="border-b-[0.05px] border-gray-300">
                          <th className="text-[10px] text-left text-gray-800 ">
                            Plot Value Total Rs.:
                          </th>
                          <td className="text-[10px] text-right text-gray-400 "></td>
                          <th className="text-[10px] text-right text-gray-800 ">
                            {netTotal?.toLocaleString('en-IN')}
                          </th>
                        </tr>
                      </tbody>
                    </table>

                    <h1 className=" mt-10 text-bodyLato text-left text-gray-400 font-semibold text-[8px]">
                      * Registration & Stamp Duty charges and any taxes apart
                      from GST are to be paid based on the prevailing
                      guidelines.
                    </h1>
                    <h1 className=" my-2 text-bodyLato text-left text-gray-400 font-semibold text-[8px]">
                      * GST are calculated as per current norms & the same may
                      change as per government guidlines. Presently @ 5% on
                      Construction Cost and 18% on Other Charges (Amenities)
                    </h1>
                    <h1 className=" my-2 text-bodyLato text-left text-gray-400 font-semibold text-[8px]">
                      * As per Income Tax rules, please deduct TDS as applicable
                      from all the payments made towards your unit(including the
                      PDCs). If your bank disburses the full smount, then you
                      will have to pay the TDS seperately
                    </h1>
                    <h1 className=" my-2 text-bodyLato text-left text-gray-400 font-semibold text-[8px]">
                      * Provide us the duly signed Form 16B to pass the credit
                      for TDS amount.
                    </h1>
                  </div>
                  {/* end of paper */}
                </div>
              </div>
            </PDFExport>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default CostBreakUpPdfAll
