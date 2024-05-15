import { useState, useEffect, createRef, useRef } from 'react'

import { InformationCircleIcon } from '@heroicons/react/outline'
import { Checkbox } from '@mui/material'
import { PDFExport } from '@progress/kendo-react-pdf'
import { setHours, setMinutes } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { Field, Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import DatePicker from 'react-datepicker'
import * as Yup from 'yup'

import CrmUnitHeader from 'src/components/A_CrmModule/CrmUnitHeader'
import { updateLeadCostSheetDetailsTo } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

import { computeTotal } from './computeCsTotals'
import CostBreakUpPdfPreview from './costBreakUpPdfPreview'
import { TextFieldFlat } from './formFields/TextFieldFlatType'

import '../styles/myStyles.css'

const CostBreakUpPdf = ({
  formik,
  projectDetails,
  csMode,
  setCostSheet,
  costSheet,
  pdfExportComponent,
  selPhaseObj,
  selUnitDetails,
  leadDetailsObj1,
  setNewPlotCsObj,
  newPlotCsObj,
  costSheetA,
  setCostSheetA,
  setAddiChargesObj,
  setNewPS,
  newPlotPS,
  newPlotCostSheetA,
  setNewPlotCostSheetA,
  setNewPlotPS,
  netTotal,
  setNetTotal,
  partATotal,
  partBTotal,
  partCTotal,
  setPartATotal,
  setPartBTotal,
  setPartCTotal,
  showOnly,
  stepIndx,
  StatusListA
}) => {
  const d = new window.Date()

  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()
  const ref = createRef()

  useEffect(() => {
    console.log('sel unti detials ', selUnitDetails, newPlotPS)
  }, [])
  const [initialValuesA, setInitialValuesA] = useState({})

  const [newSqftPrice, setNewSqftPrice] = useState(0)

  const [plotBookingAdv, setPlotBookingAdv] = useState(0)
  const [partBPayload, setPartBPayload] = useState([])
  const [partCPayload, setPartCPayload] = useState([])
  const [psPayload, setPSPayload] = useState([])
  const [pdfPreview, setpdfPreview] = useState(false)
  const [showGstCol, setShowGstCol] = useState(true)

  const handlePSdateChange = (index, newDate) => {
    const updatedRows = [...newPlotPS]
    updatedRows[index].schDate = newDate
    setNewPS(updatedRows)
  }



  useEffect(() => {
    console.log('gen costSheetA', costSheetA, costSheet)
    setTotalFun()
  }, [costSheetA, selPhaseObj])

  useEffect(() => {
    console.log('what is this ', costSheetA)
    setNewPlotCsObj(costSheetA)
  }, [newSqftPrice])
  useEffect(() => {
    setNewSqftPrice(costSheet.length > 0 ? Number(costSheet[0]['charges']) : 0)
  }, [newSqftPrice])

  useEffect(() => {
    const {
      additonalChargesObj,
      ConstructOtherChargesObj,
      ConstructPayScheduleObj,
      paymentScheduleObj,
    } = selPhaseObj
    const { uid } = selUnitDetails
    const y =
      leadDetailsObj1[`${uid}_cs`]?.newSqftPrice || selUnitDetails?.sqft_rate
    const z =
      leadDetailsObj1[`${uid}_cs`]?.newPLC || selUnitDetails?.plc_per_sqft

    // const plotSaleValue =
    //   costSheetA.length > 0
    //     ? Number(selUnitDetails?.area) * Number(costSheetA[0]['charges'])
    //     : Number.isFinite(y)
    //     ? Number(selUnitDetails?.selUnitDetails?.area * y)
    //     : Number(
    //         Number(selUnitDetails?.area) *
    //           (selUnitDetails?.rate_per_sqft || selUnitDetails?.sqft_rate)
    //       )

    const plotSaleValue =
      costSheetA.length > 0
        ? Number(selUnitDetails?.area?.toString()?.replace(',', '')) *
          Number(costSheetA[0]['charges'])
        : Number.isFinite(y)
        ? Number(selUnitDetails?.selUnitDetails?.area * y)
        : Number(
            Number(selUnitDetails?.area?.toString()?.replace(',', '')) *
              (selUnitDetails?.rate_per_sqft || selUnitDetails?.sqft_rate)
          )
    const plcSaleValue =
      costSheetA.length > 1
        ? selUnitDetails?.area?.toString()?.replace(',', '') *
          Number(costSheetA[1]['charges'])
        : Math.round(
            selUnitDetails?.super_built_up_area ||
              selUnitDetails?.area?.toString()?.replace(',', '') *
                (selUnitDetails?.plc || selUnitDetails?.plc_per_sqft)
          )
    const gstTaxForProjA = selPhaseObj?.partATaxObj?.filter(
      (d) => d?.component.value === 'sqft_cost_tax'
    )
    const gstTaxIs =
      gstTaxForProjA?.length > 0 ? gstTaxForProjA[0]?.gst?.value : 0
    const plcGstForProjA = selPhaseObj?.partATaxObj?.filter(
      (d) => d?.component.value === 'plc_tax'
    )
    const plcGstIs =
      plcGstForProjA?.length > 0 ? plcGstForProjA[0]?.gst?.value : 0
    const plot_gstValue = Math.round(plotSaleValue) * gstTaxIs
    const plc_gstValue = Math.round(plcSaleValue * plcGstIs)
    console.log(
      'gen costSheetA values are ',
      Number.isFinite(y),
      y,
      selUnitDetails?.selUnitDetails?.area,
      selUnitDetails?.rate_per_sqft,
      selUnitDetails
    )
    let x = []
    // if (csMode === 'plot_cs') {
      if ('plot_cs' === 'plot_cs') {
      additonalChargesObj?.map((data, inx) => {
        let total = 0
        let gstTotal = 0
        const isChargedPerSqft = data?.units.value === 'costpersqft'
        // const gstTaxIs =
        //   gstTaxForProjA.length > 0 ? gstTaxForProjA[0]?.gst?.value : 0
        const gstPercent =
          Number(data?.gst?.value) > 1
            ? data?.gst?.value * 0.01
            : data?.gst?.value
        total = isChargedPerSqft
          ? Number(
              selUnitDetails?.super_built_up_area ||
                selUnitDetails?.area?.toString()?.replace(',', '')
            ) * Number(data?.charges)
          : Number(data?.charges)

        gstTotal = Math.round(total * gstPercent)

        console.log('myvalue is ', data)
        data.TotalSaleValue = total
        data.gst.label = gstTaxIs
        // data.gst.value = gstTotal
        data.gstValue = gstTotal
        data.TotalNetSaleValueGsT = total + gstTotal
        return data
      })
      setPartBPayload(additonalChargesObj)
      setAddiChargesObj(additonalChargesObj)
      setPSPayload(paymentScheduleObj)
      setPartCPayload(selPhaseObj?.partCTaxObj || [])
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
          others: selUnitDetails?.rate_per_sqft || selUnitDetails?.sqft_rate,
          charges:
            costSheetA.length > 0
              ? Number(costSheetA[0]['charges'])
              : selUnitDetails?.sqft_rate || 0,
          TotalSaleValue: plotSaleValue,
          gstValue: plot_gstValue,
          gst: {
            label: '0.05',
            value: gstTaxIs,
          },
          TotalNetSaleValueGsT: plotSaleValue + plot_gstValue,
        },
        {
          myId: '2',
          units: {
            value: 'fixedcost',
            label: 'Fixed cost',
          },
          component: {
            value: 'plc_cost_sqft',
            label: 'PLC',
          },
          others: selUnitDetails?.plc || 200,
          charges:
            costSheetA.length > 1
              ? Number(costSheetA[1]['charges'])
              : Number.isFinite(z)
              ? z
              : selUnitDetails?.plc || selUnitDetails?.plc_per_sqft,
          TotalSaleValue: plcSaleValue,
          // charges: y,
          gstValue: plc_gstValue,
          gst: {
            label: '0.05',
            value: plcGstIs,
          },
          TotalNetSaleValueGsT: plcSaleValue + plc_gstValue,
        },
      ]
    } else {
      setPartBPayload(ConstructOtherChargesObj)
      setPSPayload(ConstructPayScheduleObj)
      x = [
        {
          myId: '1',
          units: {
            value: 'fixedcost',
            label: 'Fixed cost',
          },
          component: {
            value: 'villa_construct_cost',
            label: 'Villa Construction Cost  ',
          },
          others: selUnitDetails?.construct_price,
          charges: Number.isFinite(y) ? y : selUnitDetails?.construct_price,
          TotalSaleValue: Number.isFinite(y)
            ? Number(selUnitDetails?.builtup_area * y)
            : Number(
                selUnitDetails?.builtup_area * selUnitDetails?.construct_price
              ),
          // charges: y,
          gst: {
            label: '0.05',
            value: Number.isFinite(y)
              ? Number(selUnitDetails?.builtup_area * y)
              : Math.round(
                  selUnitDetails?.builtup_area * selUnitDetails?.construct_price
                ) * 0.05,
          },
          TotalNetSaleValueGsT:
            (Number.isFinite(y)
              ? Number(selUnitDetails?.builtup_area * y)
              : Number(
                  selUnitDetails?.builtup_area * selUnitDetails?.construct_price
                )) +
            (Number.isFinite(y)
              ? Number(selUnitDetails?.builtup_area * y)
              : Math.round(
                  selUnitDetails?.builtup_area * selUnitDetails?.construct_price
                ) * 0.05),
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
        //   others: selUnitDetails?.PLC,
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
        //   others: selUnitDetails?.PLC,
        //   charges: 0,
        //   TotalSaleValue: 354000,
        //   // charges: y,
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
      console.log('gen costSheetA', x)
      // merged = [...x, ...additonalChargesObj]
    }

    const initformValues = {}
    merged.map((d) => {
      const x = d['component']['value']
      initformValues[`${x}`] = d?.charges
    })
    setInitialValuesA(initformValues)
    console.log('gen costSheetA', x)
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
      // if (csMode === 'plot_cs') {
      if ('plot_cs' === 'plot_cs') {

        z.value = ['on_booking'].includes(d1?.stage?.value)
          ? Number(d1?.percentage)
          : Math.round((netTotal - plotBookingAdv) * (d1?.percentage / 100))
        if (['on_booking'].includes(d1?.stage?.value)) {
          z.elgible = true
          z.elgFrom = Timestamp.now().toMillis()
          return z
        }
        return z
      } else {
        z.value = ['Total_Other_Charges_Amenities:\t'].includes(
          d1?.stage?.value
        )
          ? Number(partBTotal)
          : Math.round((netTotal - partBTotal) * (d1?.percentage / 100))
        return z
      }
    })
    setNewPS(newPs)
  }

  const initialState = initialValuesA
  const validate = Yup.object({
    // blockReason: Yup.number()
    //   .max(15, 'Must be 15 characters or less')
    //   .required('Name is Required'),
  })

  const setTotalFun = async () => {
    const partBTotal = selPhaseObj?.additonalChargesObj?.reduce(
      (partialSum, obj) =>
        partialSum +
        Number(
          computeTotal(
            obj,
            selUnitDetails?.super_built_up_area ||
              selUnitDetails?.area?.toString()?.replace(',', '')
          )
        ),
      0
    )
    const partCTotal = selPhaseObj?.partCTaxObj?.reduce(
      (partialSum, obj) =>
        partialSum +
        Number(
          computeTotal(
            obj,
            selUnitDetails?.super_built_up_area ||
              selUnitDetails?.area?.toString()?.replace(',', '')
          )
        ),
      0
    )

    const partATotal = costSheetA.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    setPartBTotal(partBTotal)
    setPartATotal(partATotal)
    setPartCTotal(partCTotal)
    setNetTotal(partATotal + partBTotal)
    selPhaseObj?.paymentScheduleObj?.map((data) => {
      if (data.stage?.value === 'on_booking') {
        setPlotBookingAdv(data?.percentage)
      }
    })
  }
  const onSubmit = async (data, resetForm) => {
    console.log('customer sheet form 1', data, costSheetA, selUnitDetails)
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
      soldPrice: Number(selUnitDetails?.sqft_rate),
      costSheetA: newCostSheetA,
    }

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
    let total = 0
    let gstTotal = 0
    const gstTaxForProjA = selPhaseObj?.partATaxObj?.filter(
      (d) => d?.component.value === 'sqft_cost_tax'
    )
    const gstTaxIs =
      gstTaxForProjA?.length > 0 ? gstTaxForProjA[0]?.gst?.value : 0
    const plcGstForProjA = selPhaseObj?.partATaxObj?.filter(
      (d) => d?.component.value === 'plc_tax'
    )
    if (csMode === 'plot_cs') {
      total = Math.round(
        selUnitDetails?.area?.toString()?.replace(',', '') * newValue
      )
      gstTotal = Math.round(total * gstTaxIs)
    } else {
      total = Math.round(selUnitDetails?.super_built_up_area * newValue)
      gstTotal = Math.round(
        Number(selUnitDetails?.super_built_up_area * newValue) * gstTaxIs
      )
    }

    y[inx].charges = newValue
    y[inx].TotalSaleValue = total
    y[inx].gst.label = gstTaxIs
    y[inx].gst.value = gstTotal
    y[inx].TotalNetSaleValueGsT = total + gstTotal
    console.log('gen costSheetA', y)
    console.log(costSheetA)

    setCostSheetA(y)
    setTotalFun()
  }
  return (
    <div className='font-["Inter"]'>
      {!pdfPreview && (
        <div>
          <PDFExport
            paperSize="A4"
            margin="0.5cm"
            fileName={`${selUnitDetails?.unit_no}_${leadDetailsObj1?.Name}_Nirvana`}
            ref={pdfExportComponent}
          >
            {' '}
            <section
              className="w-full flex flex-col  p-4 rounded-md   bg-[#fff]"
              style={{ boxShadow: '0 1px 12px #f2f2f2' }}
            >
              <div className="w-full  flex flex-row">
                <section className='w-full  flex flex-row'>
                <div className="w-[63.80px] h-[57px] bg-zinc-100 rounded-[5px]"></div>
                <div className="w-full flex flex-col ml-3">
                  <h6 className="w-full lg:w-12/12 text-blueGray-400 text-[13px] mt-[9px] mb- font-bold uppercase">
                    Cost sheet
                  </h6>
                  <div className="w-[455.80px] opacity-50 text-blue-950  text-[12px] font-normal ">
                    Quotation or estimate of unit
                  </div>
                </div>
                </section>
                <section className="w-full ">
                                        {' '}
                                        {stepIndx} of {StatusListA?.length}{' '}
                                        steps
                                      </section>
              </div>
              <div className="mt-4">
                <div>
                  <div>
                    <div className="">
                      <section className="flex flex-row justify-between bg-[#f3fff2] rounded-t-lg">
                        {/* <section className="">
                            <div className="w-full flex items-center ">
                              <label
                                htmlFor="area"
                                className="label font-regular text-sm font-bodyLato"
                              >
                                Show Gst
                              </label>
                              <Field
                                name="isGSTChecked"
                                type="checkbox"
                                component={() => (
                                  <Checkbox
                                    color="primary"
                                    checked={showGstCol}
                                    onClick={() => setShowGstCol(!showGstCol)}
                                  />
                                )}
                              />
                            </div>
                          </section> */}
                      </section>
                      {showOnly === 'costsheet' && (
                        <section>
                          <div className=" border rounded-lg shadow-md overflow-hidden ">
                            <table className="min-w-full divide-y ">
                              <thead>
                                <tr className="h-8 mb-1 border-none w-[100%] bg-[#E8E6FE] text-[#0D027D] font-['Inter'] font-[600] ">
                                  <th className="min-w-[35%] px-2  text-[10px] text-left text-[#0D027D]  tracking-wide uppercase  ">
                                    Particulars
                                  </th>
                                  <th className="w-[15%] px-2 text-[10px] text-right  tracking-wide uppercase ">
                                    Rate/Sqft
                                  </th>
                                  <th
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    } w-[15%] px-2 text-[10px] text-right  tracking-wide uppercase `}
                                  >
                                    Cost
                                  </th>
                                  <th
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    }  w-[15%] px-2 text-[10px] text-right  tracking-wide uppercase `}
                                  >
                                    GST
                                  </th>
                                  <th className="w-[15%] px-2 text-[10px] text-right  tracking-wide uppercase ">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 ">
                                {' '}
                                {costSheetA?.map((d1, inx) => (
                                  <tr
                                    key={inx}
                                    className="py-1 my-2 h-[32px]  py-[24px]"
                                  >
                                    <th className="w-[40%] px-2 text-[12px] text-left  font-normal  ">
                                      {d1?.component?.label}
                                    </th>
                                    <td className="w-[15%]  px-2 text-[12px] text-right  ">
                                      <TextFieldFlat
                                        label=""
                                        className="w-[90%] text-[12px] text-right font-semibold border-b  border-[#B76E00]  pr-1 py-[4px] text-[#B76E00]"
                                        name="ratePerSqft"
                                        onChange={(e) => {
                                          // setNewSqftPrice(e.target.value)
                                          console.log('iam hre')
                                          if (
                                            d1?.component?.value ===
                                            'unit_cost_charges'
                                          ) {
                                            formik.setFieldValue(
                                              'unit_cost_charges',
                                              e.target.value
                                            )
                                          }
                                          if (
                                            d1?.component?.value ===
                                            'plc_cost_sqft'
                                          ) {
                                            formik.setFieldValue(
                                              'plc_cost_sqft',
                                              e.target.value
                                            )
                                          }
                                          setNewSqftPrice(
                                            Number(e.target.value)
                                          )
                                          changeOverallCostFun(
                                            inx,
                                            d1,
                                            e.target.value
                                          )
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
                                        value={d1?.charges}
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
                                    <td
                                      className={`${
                                        !showGstCol ? 'hidden' : ''
                                      } w-[15%] px-2 text-[12px] text-right text-slate-500  `}
                                    >
                                      ₹
                                      {d1?.TotalSaleValue?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </td>
                                    <td
                                      className={`${
                                        !showGstCol ? 'hidden' : ''
                                      } w-[15%] px-2 text-[12px] text-right text-slate-500  `}
                                    >
                                      ₹{d1?.gstValue?.toLocaleString('en-IN')}
                                    </td>
                                    <td className="w-[15%] px-2 text-[12px] text-right text-slate-900  ">
                                      ₹
                                      {d1?.TotalNetSaleValueGsT?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </td>
                                  </tr>
                                ))}
                                <tr className=" border-[#fab56c]   h-[32px]">
                                  <th className="w-[40%] text-[11px] font-semibold text-left text-[#0D027D] pl-2 ">
                                    Total (A)
                                  </th>
                                  <td className="w-[15%] px-2 font-semibold text-[12px] text-right text-gray-600 pr-3"></td>
                                  <td
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    } w-[15%] px-2 font-semibold  text-[12px] text-right text-gray-500 `}
                                  >
                                    ₹
                                    {costSheetA
                                      .reduce(
                                        (partialSum, obj) =>
                                          partialSum +
                                          Number(obj?.TotalSaleValue),
                                        0
                                      )
                                      ?.toLocaleString('en-IN')}
                                  </td>
                                  <td
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    } w-[15%] px-2 font-semibold  text-[12px] text-right text-gray-500 `}
                                  >
                                    ₹
                                    {costSheetA
                                      .reduce(
                                        (partialSum, obj) =>
                                          partialSum + Number(obj?.gst?.value),
                                        0
                                      )
                                      ?.toLocaleString('en-IN')}
                                  </td>
                                  <td className="w-[15%] px-2  font-semibold text-[12px] text-right  text-[#0D027D] ">
                                    ₹{partATotal?.toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className=" border rounded-lg shadow-md overflow-hidden mt-4">
                            <table className="w-full">
                              {/* <thead>
                            {' '}
                            <tr className=" h-6  border-b-[0.2px] border-gray-300">
                              <th className="w-[50%] text-[12px] text-left  text-[#8993a4] tracking-wide uppercase ">
                                Particulars
                              </th>
                              <th className="w-[35%] text-[12px] text-left  text-[#8993a4] tracking-wide uppercase ">
                                Timeline
                              </th>
                              <th className="w-[15%] text-[12px] text-right   text-[#8993a4] tracking-wide uppercase">
                                Total Inc GST
                              </th>
                            </tr>
                          </thead> */}
                              <thead>
                                <tr className="h-8 mb-1 border-none w-[100%]  bg-[#E8E6FE] text-[#0D027D] text-[#0D027D] font-['Inter'] font-[600] ">
                                  <th className="min-w-[35%] px-2  text-[10px] text-left font-bold tracking-wide uppercase">
                                    Particulars
                                  </th>
                                  <th className="w-[15%] px-2 text-[10px] text-left font-bold text-right  tracking-wide uppercase ">
                                    Rate/Sqft
                                  </th>
                                  <th
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    } w-[15%] px-2 text-[10px] text-left font-bold text-right  tracking-wide uppercase `}
                                  >
                                    Cost
                                  </th>
                                  <th
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    }  w-[15%] px-2 text-[10px] text-left font-bold text-right  tracking-wide uppercase `}
                                  >
                                    GST
                                  </th>
                                  <th className="w-[15%] px-2 text-[10px] text-left font-bold text-right  tracking-wide uppercase ">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {partBPayload?.map((d1, inx) => (
                                  <tr
                                    key={inx}
                                    className="h-[32px] border-b border-dashed"
                                  >
                                    <th className=" text-[12px] px-2 text-left  font-normal ">
                                      {d1?.component?.label}
                                      {/* {d1?.units?.value === 'costpersqft' && `(${d1?.charges}% on Sale value)`} */}
                                    </th>
                                    <td className="w-[15%]  px-2 text-[12px] text-right   ">
                                      {Number(d1?.charges)?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </td>
                                    <td
                                      className={`${
                                        !showGstCol ? 'hidden' : ''
                                      } w-[15%] px-2 text-[12px] text-right text-slate-500   `}
                                    >
                                      ₹
                                      {d1?.TotalSaleValue?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </td>
                                    <td
                                      className={`${
                                        !showGstCol ? 'hidden' : ''
                                      } w-[15%] px-2 text-[12px] text-right text-slate-500   `}
                                    >
                                      ₹{d1?.gstValue?.toLocaleString('en-IN')}
                                    </td>
                                    <td className="text-[12px] px-2 text-right   ">
                                      {/* {Number(d1?.charges)?.toLocaleString('en-IN')} */}
                                      ₹
                                      {Number(
                                        computeTotal(
                                          d1,
                                          selUnitDetails?.area
                                            ?.toString()
                                            ?.replace(',', '')
                                        )
                                      )?.toLocaleString('en-IN')}
                                    </td>
                                  </tr>
                                ))}
                                <tr className=" h-[32px] ">
                                  <th className="w-[40%] text-[11px] px-2 font-semibold text-left  text-[#0D027D] ">
                                    Total (B)
                                  </th>
                                  <td className="w-[15%] px-2 font-semibold text-[12px] text-right text-gray-600 pr-3"></td>
                                  <td
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    } w-[15%] px-2 font-semibold  text-[12px] text-right text-gray-800 `}
                                  >
                                    ₹
                                    {partBPayload
                                      ?.reduce(
                                        (partialSum, obj) =>
                                          partialSum +
                                          Number(obj?.TotalSaleValue),
                                        0
                                      )
                                      ?.toLocaleString('en-IN')}
                                  </td>
                                  <td
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    } w-[15%] px-2 font-semibold  text-[12px] text-right text-gray-800 `}
                                  >
                                    ₹
                                    {partBPayload
                                      ?.reduce(
                                        (partialSum, obj) =>
                                          partialSum + Number(obj?.gstValue),
                                        0
                                      )
                                      ?.toLocaleString('en-IN')}
                                  </td>
                                  <td className="text-[12px] px-2 text-right text-[#0D027D] font-semibold">
                                    ₹{partBTotal?.toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className=" border rounded-lg shadow-md overflow-hidden mt-4">
                            <table className="w-full">
                              {/* <thead>
                            {' '}
                            <tr className=" h-6  border-b-[0.2px] border-gray-300">
                              <th className="w-[50%] text-[12px] text-left  text-[#8993a4] tracking-wide uppercase ">
                                Particulars
                              </th>
                              <th className="w-[35%] text-[12px] text-left  text-[#8993a4] tracking-wide uppercase ">
                                Timeline
                              </th>
                              <th className="w-[15%] text-[12px] text-right   text-[#8993a4] tracking-wide uppercase">
                                Total Inc GST
                              </th>
                            </tr>
                          </thead> */}
                              <thead>
                                <tr className="h-8 mb-1 border-none w-[100%]  bg-[#E8E6FE] text-[#0D027D] text-[#0D027D] font-['Inter'] font-[600] ">
                                  <th className="min-w-[35%] px-2  text-[10px] text-left font-bold tracking-wide uppercase">
                                    Particulars
                                  </th>
                                  <th className="w-[15%] px-2 text-[10px] text-left font-bold text-right  tracking-wide uppercase ">
                                    Rate/Sqft
                                  </th>
                                  <th
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    } w-[15%] px-2 text-[10px] text-left font-bold text-right  tracking-wide uppercase `}
                                  >
                                    Cost
                                  </th>
                                  <th
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    }  w-[15%] px-2 text-[10px] text-left font-bold text-right  tracking-wide uppercase `}
                                  >
                                    GST
                                  </th>
                                  <th className="w-[15%] px-2 text-[10px] text-left font-bold text-right  tracking-wide uppercase ">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {partCPayload?.map((d1, inx) => (
                                  <tr
                                    key={inx}
                                    className="h-[32px] border-b border-dashed"
                                  >
                                    <th className=" text-[12px] px-2 text-left  font-normal ">
                                      {d1?.component?.label}
                                      {/* {d1?.units?.value === 'costpersqft' && `(${d1?.charges}% on Sale value)`} */}
                                    </th>
                                    <td className="w-[15%]  px-2 text-[12px] text-right   ">
                                      {Number(d1?.charges)?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </td>
                                    <td
                                      className={`${
                                        !showGstCol ? 'hidden' : ''
                                      } w-[15%] px-2 text-[12px] text-right text-slate-500   `}
                                    >
                                      ₹
                                      {d1?.TotalSaleValue?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </td>
                                    <td
                                      className={`${
                                        !showGstCol ? 'hidden' : ''
                                      } w-[15%] px-2 text-[12px] text-right text-slate-500   `}
                                    >
                                      ₹{d1?.gstValue?.toLocaleString('en-IN')}
                                    </td>
                                    <td className="text-[12px] px-2 text-right   ">
                                      {/* {Number(d1?.charges)?.toLocaleString('en-IN')} */}
                                      ₹
                                      {Number(
                                        computeTotal(
                                          d1,
                                          selUnitDetails?.area
                                            ?.toString()
                                            ?.replace(',', '')
                                        )
                                      )?.toLocaleString('en-IN')}
                                    </td>
                                  </tr>
                                ))}
                                <tr className=" h-[32px] ">
                                  <th className="w-[40%] text-[11px] px-2 font-semibold text-left  text-[#0D027D] ">
                                    Total (C)
                                  </th>
                                  <td className="w-[15%] px-2 font-semibold text-[12px] text-right text-gray-600 pr-3"></td>
                                  <td
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    } w-[15%] px-2 font-semibold  text-[12px] text-right text-gray-800 `}
                                  >
                                    ₹
                                    {partCPayload
                                      ?.reduce(
                                        (partialSum, obj) =>
                                          partialSum + Number(obj?.charges),
                                        0
                                      )
                                      ?.toLocaleString('en-IN')}
                                  </td>
                                  <td
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    } w-[15%] px-2 font-semibold  text-[12px] text-right text-gray-800 `}
                                  >
                                    ₹
                                    {partCPayload
                                      ?.reduce(
                                        (partialSum, obj) =>
                                          partialSum + Number(obj?.gstValue),
                                        0
                                      )
                                      ?.toLocaleString('en-IN')}
                                  </td>
                                  <td className="text-[12px] px-2 text-right text-[#0D027D] font-semibold">
                                    ₹{partCTotal?.toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div>
                            <section className="flex flex-row justify-between">
                              <div></div>

                              <div className="border rounded-lg shadow-lg  mt-4">
                                <section className="flex flex-row justify-between mt-2   ">
                                  <h1 className="px-3 text-[12px] text-left  text-[12px] font-normal ">
                                    Part(A)
                                  </h1>
                                  <section className="flex flex-row">
                                    <section className="px-2 d-md font-semibold text-[12px] text-[#000000e6] leading-none">
                                      ₹{partATotal?.toLocaleString('en-IN')}
                                    </section>
                                  </section>
                                </section>
                                <section className="flex flex-row justify-between  mt-2">
                                  <h1 className="px-3 text-[12px] text-left  text-[12px] font-normal ">
                                    Part(B)
                                  </h1>
                                  <section className="flex flex-row">
                                    <section className="px-2 d-md font-semibold text-[12px] text-[#000000e6] leading-none">
                                      ₹{partBTotal?.toLocaleString('en-IN')}
                                    </section>
                                  </section>
                                </section>
                                <section className="flex flex-row justify-between rounded-b-lg  bg-[#E8E6FE]  mt-2 py-2   ">
                                  <h1 className="px-3 text-[12px] text-left  text-[12px] font-semibold pr-8 ">
                                    Total Cost
                                  </h1>
                                  <section className="flex flex-row mt-2">
                                    <section className="px-2 d-md font-bold text-[12px] text-[#0D027D] leading-none">
                                      ₹{netTotal?.toLocaleString('en-IN')}
                                    </section>
                                  </section>
                                </section>
                              </div>
                            </section>
                          </div>
                        </section>
                      )}
                      {showOnly === 'payment_schedule' && (
                        <div className=" mt-4 border rounded-lg shadow-md overflow-hidden ">
                          <table className="w-full border-b border-dashed">
                            <thead className="">
                              {' '}
                              <tr className=" h-8  border-none bg-[#E8E6FE] text-[#0D027D] font-['Inter'] font-[600]  ">
                                <th className="w-[50%] px-2   text-left  tracking-wide uppercase text-[11px]   ">
                                  Particulars
                                </th>
                                <th className="w-[30%] px-2   text-left  tracking-wide uppercase text-[11px] ">
                                  Payment Timeline
                                </th>
                                <th className="w-[20%] px-2   text-right  tracking-wide uppercase  text-[11px]">
                                  Total inc GST
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {newPlotPS?.map((d1, inx) => (
                                <tr
                                  key={inx}
                                  className="border-b-[0.05px] border-gray-300 py-1 my-2 h-[32px]  py-[24px]"
                                >
                                  <th className=" px-2  text-[11px] text-left  font-normal tracking-wide uppercase ">
                                   {d1?.stage?.label}
                                  </th>
                                  <td className="text-[11px] px-2  text-left font-normal tracking-wide uppercase ">
                                    <DatePicker
                                      id="bmrdaStartDate"
                                      name="bmrdaStartDate"
                                      className={`pl- px-1 h-8 rounded-md mt-1 min-w-[100px] inline text-[#0091ae] flex bg-grey-lighter text-grey-darker border border-[#cccccc] ${ d1?.schDate < newPlotPS[inx-1]?.schData ? 'border-red-600' : 'border-[#cccccc]' } px-2`}
                                      selected={d1.schDate = d1?.schDate || d.getTime() + Number(d1?.zeroDay || 0) * 86400000}
                                      onChange={(date) => {
                                        // formik.setFieldValue(
                                        //   'bmrdaStartDate',
                                        //   date.getTime()
                                        // )
                                        console.log('data', date.getTime())
                                        // setStartDate(date)
                                        handlePSdateChange(inx, date.getTime())
                                      }}
                                      timeFormat="HH:mm"
                                      injectTimes={[
                                        setHours(setMinutes(d, 1), 0),
                                        setHours(setMinutes(d, 5), 12),
                                        setHours(setMinutes(d, 59), 23),
                                      ]}
                                      dateFormat="MMMM d, yyyy"
                                    />
                                    {d1?.description}
                                  </td>
                                  <td className="text-[12px] px-2  text-right tracking-wide uppercase ">
                                    ₹{d1?.value?.toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              ))}

                              <tr className="h-[32px]">
                                <th className="text-[12px] px-2  text-left text-gray-800 ">
                                  Plot Value Total Rs.:
                                </th>
                                <td className="text-[12px] px-2  text-right text-gray-400 "></td>
                                <th className="text-[12px] px-2  text-right text-gray-800 ">
                                  ₹{netTotal?.toLocaleString('en-IN')}
                                </th>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* end of paper */}
                </div>
              </div>
            </section>
          </PDFExport>
        </div>
      )}

      {pdfPreview && (
        <CostBreakUpPdfPreview
          projectDetails={projectDetails}
          csMode={csMode}
          // costSheetA={costSheetA}
          pdfExportComponent={pdfExportComponent}
          selPhaseObj={selPhaseObj}
          leadDetailsObj1={leadDetailsObj1}
          selUnitDetails={selUnitDetails}
          setNewPlotCsObj={setNewPlotCsObj}
          newPlotCsObj={newPlotCsObj}
          costSheetA={newPlotCostSheetA || []}
          setCostSheetA={setNewPlotCostSheetA}
          setNewPS={setNewPlotPS}
          newPlotPS={newPlotPS}
          showGstCol={showGstCol}
          partATotal={partATotal}
          partBTotal={partBTotal}
          netTotal={netTotal}
        />
      )}
    </div>
  )
}

export default CostBreakUpPdf
