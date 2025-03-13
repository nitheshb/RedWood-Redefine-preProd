import { useState, useEffect, createRef } from 'react'
import { PDFExport } from '@progress/kendo-react-pdf'
import { setHours, setMinutes } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { useSnackbar } from 'notistack'
import DatePicker from 'react-datepicker'
import * as Yup from 'yup'
import { updateLeadCostSheetDetailsTo } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { computeTotal } from './computeCsTotals'
import { TextFieldFlat } from './formFields/TextFieldFlatType'
import '../styles/myStyles.css'
import CustomDatePicker from './formFields/CustomDatePicker'
import { CalculateComponentTotal, UpdateComponentCalTotal } from './unitCostSheetCalculator'
import { plotCS_Dummy_A } from 'src/constants/projects'

const CostBreakUpPdf = ({
  formik,
  projectDetails,
  csMode,
  myBookingPayload,
  setMyBookingPayload,
  setCostSheet,
  costSheet,
  pdfExportComponent,
  selPhaseObj,
  selUnitDetails,
  leadDetailsObj1,
  setNewPlotCsObj,
  newPlotCsObj,
  costSheetA,
  constructCostSheetA,
  newAdditonalConstChargesObj,
  setCostSheetA,
  setConstructCostSheetA,
  setAddiChargesObj,
  setNewAdditonalConstChargesObj,
  setNewPS,
  newPlotPS,
  newPlotCostSheetA,
  setNewPlotCostSheetA,
  setNewPlotPS,
  setNewConstructPS,
  netTotal,
  setNetTotal,
  partATotal,
  partBTotal,
  partCTotal,
  partDTotal,
  setPartATotal,
  setPartBTotal,
  setPartCTotal,
  setPartDTotal,
  showOnly,
  stepIndx,
  StatusListA,
  setStepIndx

}) => {
  const d = new window.Date()

  const { user } = useAuth()
  const { orgId, role } = user

  const { enqueueSnackbar } = useSnackbar()
  const ref = createRef()

  useEffect(() => {
    if (newPlotPS?.length > 2) {
      console.log('sel unti detials ', selUnitDetails, newPlotPS[1]['value'])
    }
    console.log('sel unti detials ', selUnitDetails, newPlotPS)
  }, [newPlotPS])
  const [initialValuesA, setInitialValuesA] = useState({})

  const [newSqftPrice, setNewSqftPrice] = useState(0)
  const [newConstSqftPrice, setConstNewSqftPrice] = useState(0)
  const [costPerSqft, setCostPerSqft] = useState(1000)
  const [constructionPerSqft, setConstructionPerSqft] = useState(1200)
  const [gst, setGST] = useState(12)
  const [constGst, setConstGST] = useState(0)

  const [plotBookingAdv, setPlotBookingAdv] = useState(0)
  const [partBPayload, setPartBPayload] = useState([])
  const [partBConstPayload, setPartBConstPayload] = useState([])
  const [partCPayload, setPartCPayload] = useState([])
  const [possessAdditionalCS, setPossessAdditionalCS] = useState([])

  const [psPayload, setPSPayload] = useState([])
  const [psConstructPayload, setConstructPSPayload] = useState([])
  const [psConstAdditonalPayload, setPSConstAdditonalPayload] = useState([])

  const [pdfPreview, setpdfPreview] = useState(false)
  const [showGstCol, setShowGstCol] = useState(true)
  const [partETotal, setPartETotal] = useState(0)

  const handlePSdateChange = (index, newDate, type) => {

    if(type == 'constructPS'){
      const updatedRows = [...psConstructPayload]
      updatedRows[index].schDate = newDate
      setConstructPSPayload(updatedRows)
      setNewPS([...updatedRows, ...psConstructPayload])
    }
    if(type == 'plotPs'){
      const updatedRows = [...psPayload]
      updatedRows[index].schDate = newDate
      setPSPayload(updatedRows)
      setNewPS([...updatedRows, ...psConstructPayload])

    }
  }

  // const handlePSdateChange = (index, newDate) => {

  //   const updatedRows = [...newPlotPS];
  //   const incrementedDate = new Date(newDate);
  //   incrementedDate.setDate(incrementedDate.getDate() + 30);
  //   updatedRows[index].schDate = incrementedDate;
  //   setNewPS(updatedRows);
  // }
  useEffect(() => {
    const z =
      selPhaseObj?.fullCs?.filter(
        (d) => d?.section?.value === 'possessionAdditionalCost'
      ) || []
    const a = z.map((data4) => {
      let total = 0
      let gstTotal = 0
      const charges = 0
      const dataNewObj = { ...data4 }
      const x = data4?.units?.value
      const isChargedPerSqft = [
        'costpersqft',
        'cost_per_sqft',
        'price_per_sft',
      ].includes(x)

      const gstPercent =
      Number(data4?.gst?.value) > 1
        ? Number(data4?.gst?.value) * 0.01
        : Number(data4?.gst?.value)
      total = isChargedPerSqft
      ? Number(
          selUnitDetails?.construct_area ||
            selUnitDetails?.area?.toString()?.replace(',', '')
        ) * Number(data4?.charges)
      : Number(data4?.charges)
      gstTotal = Math.round(total * gstPercent)
      dataNewObj.TotalSaleValue = total
      dataNewObj.gstValue = gstTotal
      dataNewObj.TotalNetSaleValueGsT = total + gstTotal
      console.log('Check it', dataNewObj)

      return dataNewObj
    })
    console.log('Check it', a)
    setPossessAdditionalCS(a)
  }, [selPhaseObj, selUnitDetails])
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
    setNewConstructPS(psConstructPayload)
  }, [psConstructPayload])
  useEffect(() => {
    const costSqftA = selPhaseObj?.fullCs?.filter(
      (row) => row.component.value === 'sqft_cost_tax'
    )
    const costConstructSqftA = selPhaseObj?.fullCs?.filter(
      (row) => row.component.value === 'sqft_construct_cost_tax'
    )
    if (costSqftA?.length > 0) {
      console.log('setUpData', costSqftA)
      const x = costSqftA[0]
      setCostPerSqft(x?.charges)
      setGST(x?.gst.value)
    }
    if (costConstructSqftA?.length > 0) {
      console.log('setUpData', costSqftA)
      const x = costConstructSqftA[0]
      setConstructionPerSqft(x?.charges)
      setConstGST(x?.gst?.value)
    }
  }, [])
  useEffect(() => {

    let x = {...myBookingPayload}
    x.plotPS = psPayload || []
    x.constructPS = psConstructPayload || []
    x.fullPs = [...psPayload || [], ...psConstructPayload || []]
    setMyBookingPayload(x)
    console.log('values are ',x?.fullPs)
  }, [psPayload, psConstructPayload])

  useEffect(() => {
    console.log('leadDetailsObj1', leadDetailsObj1)
    const {
      additonalChargesObj,
      // ConstructOtherChargesObj,
      constructOtherChargesObj,
      ConstructPayScheduleObj,
      paymentScheduleObj,
    } = selPhaseObj
    const { uid } = selUnitDetails
    let y = selUnitDetails?.sqft_rate
    let z = selUnitDetails?.plc_per_sqft

    if(leadDetailsObj1 && leadDetailsObj1[`${uid}_cs`]) {
      y= leadDetailsObj1[`${uid}_cs`]?.newSqftPrice || selUnitDetails?.sqft_rate
      z = leadDetailsObj1[`${uid}_cs`]?.newPLC || selUnitDetails?.plc_per_sqft

    }


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
      costSheetA.length > 0?
      // 1000 : Number.isFinite(y)
        // ? 1001
        // : 10002
        Number(selUnitDetails?.area?.toString()?.replace(',', '')) *
          Number(costSheetA[0]['charges'])
        : Number.isFinite(y)
        ? Number(Number(selUnitDetails?.area?.toString()?.replace(',', '')) * Number(y.toString()?.replace(',', '')))
        : Number(
            Number(selUnitDetails?.area?.toString()?.replace(',', '')) *
              (selUnitDetails?.rate_per_sqft || selUnitDetails?.sqft_rate)
          )
    // const constSaleValue =
    //   costSheetA.length > 0
    //     ? Number(selUnitDetails?.area?.toString()?.replace(',', '')) *
    //       Number(costSheetA[0]['charges'])
    //     : Number.isFinite(y)
    //     ? Number(selUnitDetails?.area * y)
    //     : Number(
    //         Number(selUnitDetails?.area?.toString()?.replace(',', '')) *
    //           (selUnitDetails?.rate_per_sqft || selUnitDetails?.sqft_rate)
    //       )

    const constSaleValue =Number.isFinite(y)
    ? Number( (selUnitDetails?.builtup_area || selUnitDetails?.construct_area || 0 )* y)
    : Number((selUnitDetails?.builtup_area || selUnitDetails?.construct_area || 0) * selUnitDetails?.construct_price_sqft || 0)
    const constPlcSaleValue =Number.isFinite(y)
    ? Number( (selUnitDetails?.builtup_area || selUnitDetails?.construct_area || 0 )* y)
    : Number((selUnitDetails?.builtup_area || selUnitDetails?.construct_area || 0) * (selUnitDetails?.plc || selUnitDetails?.plc_per_sqft || 0))
    const plcSaleValue =
      costSheetA.length > 1
        ? selUnitDetails?.area?.toString()?.replace(',', '') *
          Number(costSheetA[1]['charges'])
        : Math.round(
            selUnitDetails?.construct_area ||
              selUnitDetails?.area?.toString()?.replace(',', '') *
                (selUnitDetails?.plc || selUnitDetails?.plc_per_sqft)
          )
    const plcConstructSaleValue =
          costSheetA.length > 1
            ? selUnitDetails?.area?.toString()?.replace(',', '') *
              Number(costSheetA[1]['charges'])
            : Math.round(
                selUnitDetails?.construct_area ||
                  selUnitDetails?.area?.toString()?.replace(',', '') *
                    (selUnitDetails?.plc || selUnitDetails?.plc_per_sqft)
              )
    const gstTaxForProjA = selPhaseObj?.partATaxObj?.filter(
      (d) => d?.component.value === 'sqft_cost_tax'
    )
    // const gstTaxIs =
    //   gstTaxForProjA?.length > 0
    //     ? Number(gstTaxForProjA[0]?.gst?.value) > 1
    //       ? Number(gstTaxForProjA[0]?.gst?.value) * 0.01
    //       : Number(gstTaxForProjA[0]?.gst?.value)
    //     : 0
    const gstTaxIs =(selPhaseObj?.area_tax / 100)

    const plcGstForProjA = selPhaseObj?.partATaxObj?.filter(
      (d) => d?.component.value === 'plc_tax'
    )
    const plcGstIs =
      plcGstForProjA?.length > 0
        ? Number(plcGstForProjA[0]?.gst?.value) > 1
          ? Number(plcGstForProjA[0]?.gst?.value) * 0.01
          : Number(plcGstForProjA[0]?.gst?.value)
        : 0
    // const gstCostIs
    const gstTaxForConstructionA = selPhaseObj?.partATaxObj?.filter(
      (d) => d?.component.value === 'sqft_construct_cost_tax'
    )
    // const gstConstTaxIs =
    //   gstTaxForConstructionA?.length > 0
    //     ? Number(gstTaxForConstructionA[0]?.gst?.value) > 1
    //       ? Number(gstTaxForConstructionA[0]?.gst?.value) * 0.01
    //       : Number(gstTaxForConstructionA[0]?.gst?.value)
    //     : 0

    const constTaxPercent = selPhaseObj?.const_tax
    const gstConstTaxIs = (constTaxPercent/100)
    const CplcGstIsPercent = 0
    const  gstPlcConstTaxIs = CplcGstIsPercent/100
    const plot_gstValue = Math.round(plotSaleValue) * gstTaxIs
    const plc_gstValue = Math.round(plcSaleValue * plcGstIs)
    const const_gstValue = Math.round(constSaleValue * gstConstTaxIs )
    const const_plc_gstValue = Math.round(constPlcSaleValue * gstPlcConstTaxIs )


    console.log(
      'gen costSheetA values are ',
      Number.isFinite(y),
      y,
      selUnitDetails?.selUnitDetails?.area,
      selUnitDetails?.rate_per_sqft,
      selUnitDetails
    )
    let x = []
    let constructionCS = []
    // if (csMode === 'plot_cs') {
    if ('plot_cs' === 'plot_cs') {
      additonalChargesObj?.map((data, inx) => {
        return CalculateComponentTotal(data,selUnitDetails?.area?.toString()?.replace(',', ''),selPhaseObj?.area_tax, data?.charges)
      })
      constructOtherChargesObj?.map((data, inx) => {
        console.log('myvalue is', data)
        let gstPercentIs= Number(data?.gst?.value || 0)
       return  CalculateComponentTotal(data,selUnitDetails?.construct_area || selUnitDetails?.area?.toString()?.replace(',', ''),gstPercentIs, data?.charges)
      })
      setPartBPayload(additonalChargesObj)
      setAddiChargesObj(additonalChargesObj)
      setPartBConstPayload(constructOtherChargesObj)
      // setConstAddiChargesObj(additonalChargesObj)
      // setNewAdditonalConstChargesObj(constructOtherChargesObj)
      setPSConstAdditonalPayload(constructOtherChargesObj)
      setPSPayload(paymentScheduleObj)
      setPartCPayload(selPhaseObj?.partCTaxObj || [])
      console.log('construct ps obj', ConstructPayScheduleObj)
      setConstructPSPayload(ConstructPayScheduleObj)

      x = [
        {
          myId: '1',
          units: {
            value: 'cost_per_sqft',
            label: 'Cost per Sqft',
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
            label: gst,
            value: gstTaxIs,
          },
          TotalNetSaleValueGsT: plotSaleValue + plot_gstValue,
        },
        {
          myId: '2',
          units: {
            value: 'cost_per_sqft',
            label: 'Cost per Sqft',
          },
          component: {
            value: 'plc_cost_sqft',
            label: 'PLC',
          },
          others: selUnitDetails?.plc || 0,
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


      const constructionSqftRate = selUnitDetails?.construct_price_sqft || 0
      const constructionArea =
        selUnitDetails?.builtup_area || selUnitDetails?.construct_area || 0
      constructionCS = [
        {
          myId: '3',
          units: {
            value: 'cost_per_sqft',
            label: 'Cost per Sqft',
          },
          component: {
            value: 'villa_construct_cost',
            label: 'Villa Construction Cost  ',
          },
          others: constructionSqftRate,
          charges: Number.isFinite(y) ? y : constructionSqftRate,
          TotalSaleValue: Number.isFinite(y)
            ? Number(constructionArea * y)
            : Number(constructionArea * constructionSqftRate),
          // charges: y,
          gstValue: const_gstValue,
          gst: {
            label: constTaxPercent,
            value: constTaxPercent,
          },
          TotalNetSaleValueGsT:
            (Number.isFinite(y)
              ? Number(constructionArea * y)
              : Number(constructionArea * constructionSqftRate)) +
            const_gstValue,
        },
        {
          myId: '4',
          units: {
            value: 'cost_per_sqft',
            label: 'Cost per Sqft',
          },
          component: {
            value: 'plc_cost_sqft',
            label: 'Construction PLC',
          },
          others: selUnitDetails?.plc || 0,
          charges:
            costSheetA.length > 1
              ? Number(costSheetA[1]['charges'])
              : Number.isFinite(z)
              ? z
              : selUnitDetails?.plc || selUnitDetails?.plc_per_sqft,
          TotalSaleValue: constPlcSaleValue,
          // charges: y,
          gstValue: const_plc_gstValue,
          gst: {
            label: CplcGstIsPercent,
            value: CplcGstIsPercent,
          },
          TotalNetSaleValueGsT: constPlcSaleValue + const_plc_gstValue,
        },
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
    setConstructCostSheetA(constructionCS)
  }, [selPhaseObj, leadDetailsObj1, csMode])

  useEffect(() => {
    CreateNewPsFun(netTotal, plotBookingAdv, csMode)
  }, [])
  useEffect(() => {
    CreateNewPsFun(netTotal, plotBookingAdv, csMode)
    console.log('test', newPlotPS)
  }, [netTotal, plotBookingAdv, csMode])

  const CreateNewPsFun = (netTotal, plotBookingAdv, csMode) => {
    const flatCost = Number(partATotal + partBTotal)
    const flatSchTotalCost = Number(partATotal + partBTotal)
    const constCost = Number((partCTotal || 0) + (partDTotal || 0) )
    console.log('flat fixed values ', psPayload)
    const flatFixedCosts = psPayload?.reduce(
      (acc, item) =>
        item.units.value === 'fixedcost' ? acc + Number(item.value) : acc,
      0
    )
    const constFixedCosts = selPhaseObj?.ConstructPayScheduleObj?.reduce(
      (acc, item) =>
        item.units.value === 'fixedcost' ? acc + item.value : acc,
      0
    )
    // const bookingAdvance  =0
    // const bookingAdvance = myBookingPayload?.plotPS?.reduce(
    //   (acc, item) =>
    //     item?.stage?.value === 'on_booking' ? acc + Number(item.value) : acc,
    //   0
    // ) || 0
    const bookingAdvance = myBookingPayload?.plotPS?.filter(
      (d) => d?.stage?.value === 'on_booking'
    )
    const filLegalCharges = myBookingPayload?.addChargesCS?.filter(
      (d) => d?.component?.value === 'legal_charges'
    )
    let flatLegalFixedCosts = 0
    let bookingAdvanceCost = 0
    if(filLegalCharges && filLegalCharges?.length > 0){
      flatLegalFixedCosts =filLegalCharges[0]?.TotalNetSaleValueGsT || 0
    }
    console.log('booking advance is', bookingAdvance)
    if(bookingAdvance && bookingAdvance?.length > 0){
      console.log('booking advance is', bookingAdvance)
      bookingAdvanceCost =bookingAdvance[0]?.percentage || 10
    }
    const newPs = psPayload?.map( (d1, inx) => {
      const z = d1
      // if (csMode === 'plot_cs') {
      if ('plot_cs' === 'plot_cs') {
       let applicablePlotCost = flatCost- flatLegalFixedCosts
      //  if(inx ==1){
      //   applicablePlotCost = (applicablePlotCost-bookingAdvanceCost)
      //  }

      if(!['costpersqft'].includes(d1?.units?.value)){

        z.value = ['fixedcost'].includes(d1?.units?.value)
          ? Number(d1?.percentage)
          : inx ==1 ? Number(
            (((applicablePlotCost) * (d1?.percentage / 100)).toFixed(2) - bookingAdvanceCost))

          :  Number(
              ((applicablePlotCost) * (d1?.percentage / 100)).toFixed(2)
            )
            // z.value = applicablePlotCost
          }else {
            let calc =  CalculateComponentTotal(d1,selUnitDetails?.area?.toString()?.replace(',', '') ,0,Number(d1?.percentage))
            z.value = calc?.TotalNetSaleValueGsT
          }
        if (['fixedcost'].includes(d1?.units?.value)) {
          z.elgible = true
          z.elgFrom = Timestamp.now().toMillis()
          return z
        }
        return z
      }
    })
    console.log('sel unti id => ', newPs, psPayload, psConstructPayload)
    setNewPS(newPs)
    const newPs1 = selPhaseObj?.ConstructPayScheduleObj?.map((d1, i) => {
      console.log('d1 is', d1)
      const z = d1

        z.value = ['fixedcost'].includes(d1?.units?.value)
          ? Number(d1?.percentage)
          :
            Number(
              ((constCost - constFixedCosts) * (d1?.percentage / 100)).toFixed(
                2
              )
            )
        if(i=== selPhaseObj?.ConstructPayScheduleObj?.length-1){
          z.value = z.value  + partETotal
        }
        if (['fixedcost'].includes(d1?.units?.value)) {
          z.elgible = true
          z.elgFrom = Timestamp.now().toMillis()
          return z
        }
        return z

    })

    console.log('sel unti id => ', newPs, psPayload)
    setConstructPSPayload(newPs1)
    const netValue = partATotal + partBTotal + partCTotal + partDTotal + partETotal

    const currentBookingPayload = {
      T_total: netValue,
      T_balance: netValue,
      // T_received: data['T_received'] || 0,
      // T_elgible: T_elgible,
      // T_elgible_balance: T_elgible_balance,
      // T_approved: data['T_received'] || 0,
      //  T_transaction: data['T_received'] || 0,

      // T_review: netTotal,
      T_A: partATotal,
      T_B: partBTotal,
      T_C: partCTotal,
      T_D: partDTotal,
      T_E: partETotal,
      plotCS: [...costSheetA],
      constructCS: [...constructCostSheetA],
      addChargesCS: partBPayload,
      constAdditionalChargesCS: partBConstPayload,
      possessionAdditionalCostCS: possessAdditionalCS,
      plotPS: newPs,
      constructPS: psConstructPayload,
      fullPs: psPayload,
      // plc_per_sqft: data['plc_per_sqft'],
      sqft_rate:
        costSheetA.length > 0 ? Number(costSheetA[0]['charges']) : undefined,
      construct_price_sqft:
        constructCostSheetA.length > 0
          ? Number(constructCostSheetA[0]['charges'])
          : undefined,
      // ats_date: data['ats_date'],
      // atb_date: data['atb_date'],
      // sd_date: data['sd_date'],
      // ats_target_date: data['ats_target_date'],
      // sd_target_date: data['sd_target_date'],
    }
    setMyBookingPayload({...myBookingPayload,...currentBookingPayload})
  }

  useEffect(() => {
    console.log('myBookingPayload', myBookingPayload)
  }, [myBookingPayload])

  const initialState = initialValuesA
  const validate = Yup.object({})

  const setTotalFun = async () => {
    const partBTotal = partBPayload?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    const partDTotal = partBConstPayload?.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )

    const partATotal = costSheetA.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    const partCTotal = constructCostSheetA.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    const partETotal = possessAdditionalCS.reduce(
      (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT),
      0
    )
    setPartBTotal(partBTotal)
    setPartATotal(partATotal)
    setPartCTotal(partCTotal)
    setPartDTotal(partDTotal)
    setPartETotal(partETotal)
    setNetTotal(
      (partATotal || 0) +
        (partBTotal || 0) +
        (partCTotal || 0) +
        (partDTotal || 0) +  (partETotal || 0)
    )
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
  const changeOverallPartACostFun = async (inx, payload, newValue) => {

    const area = selUnitDetails?.area?.toString()?.replace(',', '');
    const taxPercent =selPhaseObj?.area_tax
    let y = await UpdateComponentCalTotal(costSheetA,inx,area, taxPercent, newValue)
    // const y = costSheetA
    // let total = 0
    // let gstTotal = 0
    // const gstTaxForProjA = selPhaseObj?.partATaxObj?.filter(
    //   (d) => d?.component.value === 'sqft_cost_tax'
    // )
    // // const gstTaxIs = gstTaxForProjA?.length > 0 ? gstTaxForProjA[0]?.gst?.value : 0

    //   const gstTaxIs = selPhaseObj?.area_tax
    // const plcGstForProjA = selPhaseObj?.partATaxObj?.filter(
    //   (d) => d?.component.value === 'plc_tax'
    // )
    // if (csMode === 'plot_cs') {
    //   total = Math.round(
    //     selUnitDetails?.area?.toString()?.replace(',', '') * newValue
    //   )
    //   gstTotal = Math.round(total * gstTaxIs)
    // } else {
    //   total = Math.round(
    //     Number(selUnitDetails?.area) *
    //       newValue
    //   )
    //   gstTotal = Math.round(total * (gstTaxIs / 100))
    // }

    // y[inx].charges = newValue
    // y[inx].TotalSaleValue = total
    // y[inx].gst.label = gstTaxIs
    // // y[inx].gst.value = gstTotal
    // y[inx].gstValue = gstTotal
    // y[inx].TotalNetSaleValueGsT = total + gstTotal
    // console.log('gen costSheetA', y)
    // console.log(costSheetA)

    setCostSheetA(y)
    setTotalFun()
  }
  const changeOverallConstructCostFun = async (inx, payload, newValue) => {

    const area = selUnitDetails?.construct_area?.toString()?.replace(',', '');
    const taxPercent =payload?.gst?.value
    let  z = await UpdateComponentCalTotal(constructCostSheetA,inx,area, taxPercent, newValue)
    // const y = constructCostSheetA

    // let total = 0
    // let gstTotal = 0
    // const gstTaxForProjA = selPhaseObj?.partATaxObj?.filter(
    //   (d) => d?.component.value === 'sqft_cost_tax'
    // )
    // const gstTaxIs =selPhaseObj?.const_tax
    // const plcGstForProjA = selPhaseObj?.partATaxObj?.filter(
    //   (d) => d?.component.value === 'plc_tax'
    // )

    //   total = Math.round(
    //     Number(
    //       selUnitDetails?.construct_area || selUnitDetails?.construct_area ||0
    //     ) * newValue
    //   )
    //   gstTotal = Math.round(total * (gstTaxIs / 100))


    // y[inx].charges = newValue
    // y[inx].TotalSaleValue = total
    // y[inx].gst.label = gstTaxIs
    // // y[inx].gst.value = gstTotal
    // y[inx].gstValue = gstTotal
    // y[inx].TotalNetSaleValueGsT = total + gstTotal
    // console.log('gen costSheetA', y)
    // console.log(costSheetA)

    setConstructCostSheetA(z)
    setTotalFun()
  }
  return (
    <div className="">
      {!pdfPreview && (
        <div >
          <PDFExport

            paperSize="A4"
            margin="0.5cm"
            fileName={`${selUnitDetails?.unit_no}_${leadDetailsObj1?.Name}_Nirvana`}
            ref={pdfExportComponent}
          >
            {' '}

            <section className="flex bg-[#EDEDED] p-4 rounded-t-[20px] flex-row">
                {/* <div className="w-[53.80px] h-[58px] bg-zinc-100 rounded-[5px] mr-2"></div> */}
                <div className="w-full flex flex-col">
                  <div className=" flex flex-row gap-2 ">
                    <div>
                      <section className="flex flex-row">
                        <h6 className="text-black text-[14px] mt-[2px] mb- font-bold">
                        {showOnly === 'payment_schedule' ? 'Payment Schedule' : 'Cost Sheet'}
                        </h6>
                      </section>
                      <div className="w-[455.80px] opacity-50 text-blue-950  text-[12px] font-normal ">
                      {showOnly === 'payment_schedule'
                      ? 'Schedule of payments and timelines'
                      : 'Quotation,Unit Cost Calculation.'}
                      </div>

                    </div>

                    <div></div>
                  </div>

                  {/* <div className="w-[455.80px] opacity-50 text-white  text-[12px] font-normal ">
                                            Details of applicant is mandatory
                                          </div> */}
                </div>
              </section>
            <section
              className="w-full flex flex-col px-4   rounded-t-[20px]"
              style={{ boxShadow: '0 1px 12px #f2f2f2' }}
            >

              <div className="mt-6">
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
                        <section className=" mb-20">
                          <section className="border- rounded-lg  shadow-md overflow-hidden">
                            <div className="border-y-1 rounded-t-lg  overflow-hidden ">
                              <table className="min-w-full divide-y ">
                                <thead>
                                  <tr className="h-8 mb-1 border-none w-[100%] bg-[#E8E6FE] text-[#0D027D]  font-[600] ">
                                    <th className="min-w-[35%] px-2  text-[12px] text-left text-[#0D027D]  tracking-wide">
                                      {selPhaseObj?.projectType?.name ===
                                      'Apartment'
                                        ? 'Flat'
                                        : 'Plot'}{' '}
                                      Charges (
                                      {selUnitDetails?.area?.toLocaleString(
                                        'en-IN'
                                      ) || 0}{' '}
                                      sqft)
                                    </th>
                                    <th className="w-[15%] px-2 text-[12px] text-right  tracking-wide">
                                      Rate/Sqft
                                    </th>
                                    <th
                                      className={`${
                                        !showGstCol ? 'hidden' : ''
                                      } w-[15%] px-2 text-[12px] text-right  tracking-wide `}
                                    >
                                      Cost
                                    </th>
                                    <th
                                      className={`${
                                        !showGstCol ? 'hidden' : ''
                                      }  w-[15%] px-2 text-[12px] text-right  tracking-wide `}
                                    >
                                      GST
                                    </th>
                                    <th className="w-[15%] px-2 text-[12px] text-right  tracking-wide ">
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
                                      {!((role.includes('sales') && projectDetails?.allowSalesExCsEdit) || (role.includes('admin')) ||  (role.includes('crm')) || false) && Number(d1?.charges)?.toLocaleString(
                                          'en-IN'
                                        )}
                                     {((role.includes('sales') && projectDetails?.allowSalesExCsEdit) || (role.includes('admin')) ||  (role.includes('crm'))|| false) &&   <TextFieldFlat
                                          label=""
                                          className="w-[90%] text-[12px] text-right font-semibold border-b  border-[#B76E00]  pr-1 py-[4px] text-[#B76E00]"
                                          name="ratePerSqft"
                                          onChange={(e) => {

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
                                            changeOverallPartACostFun(
                                              inx,
                                              d1,
                                              e.target.value
                                            )

                                          }}

                                          value={d1?.charges}

                                        />}
                                        <TextFieldFlat
                                          className=" hidden  "
                                          label=""
                                          name={d1?.component?.value}

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
                                  {/* for construction cost  */}
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
                                            partialSum + Number(obj?.gstValue),
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

                            <div className=" border-y-1  overflow-hidden mt-4">
                              <table className="w-full">
                                <thead>
                                  <tr className="h-8 mb-1 border-none w-[100%]  bg-[#E8E6FE] text-[#0D027D] text-[#0D027D]  font-[600] ">
                                    <th className="min-w-[35%] px-2  text-[12px] text-left font-bold tracking-wide ">
                                      Additional Charges
                                    </th>
                                    <th className="w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide ">
                                      Rate/Sqft
                                    </th>
                                    <th
                                      className={`${
                                        !showGstCol ? 'hidden' : ''
                                      } w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide `}
                                    >
                                      Cost
                                    </th>
                                    <th
                                      className={`${
                                        !showGstCol ? 'hidden' : ''
                                      }  w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide `}
                                    >
                                      GST
                                    </th>
                                    <th className="w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide  ">
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
                                        {d1?.TotalNetSaleValueGsT?.toLocaleString(
                                          'en-IN'
                                        )}
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
                            {/* construction cost sheet */}
                            {selPhaseObj?.projectType?.name === 'Villas' && (
                              <section>
                                <div className=" border-y-1  overflow-hidden mt-4 ">
                                  <table className="min-w-full divide-y ">
                                    <thead>
                                      <tr className="h-8 mb-1 border-none w-[100%] bg-[#E8E6FE] text-[#0D027D]  font-[600] ">
                                        <th className="min-w-[35%] px-2  text-[12px] text-left text-[#0D027D]  tracking-wide">
                                          Construction Charges (
                                          {selUnitDetails?.construct_area?.toLocaleString(
                                            'en-IN'
                                          ) || 0}{' '}
                                          sqft)
                                        </th>
                                        <th className="w-[15%] px-2 text-[12px] text-right  tracking-wide">
                                          Rate/Sqft
                                        </th>
                                        <th
                                          className={`${
                                            !showGstCol ? 'hidden' : ''
                                          } w-[15%] px-2 text-[12px] text-right  tracking-wide `}
                                        >
                                          Cost
                                        </th>
                                        <th
                                          className={`${
                                            !showGstCol ? 'hidden' : ''
                                          }  w-[15%] px-2 text-[12px] text-right  tracking-wide `}
                                        >
                                          GST
                                        </th>
                                        <th className="w-[15%] px-2 text-[12px] text-right  tracking-wide ">
                                          Total
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 ">
                                      {' '}
                                      {constructCostSheetA?.map((d1, inx) => (
                                        <tr
                                          key={inx}
                                          className="py-1 my-2 h-[32px]  py-[24px]"
                                        >
                                          <th className="w-[40%] px-2 text-[12px] text-left  font-normal  ">
                                            {d1?.component?.label}
                                          </th>
                                          <td className="w-[15%]  px-2 text-[12px] text-right  ">
                                          {!((role.includes('sales') && projectDetails?.allowSalesExCsEdit) || (role.includes('admin')) ||  (role.includes('crm')) || false)  && Number(d1?.charges)?.toLocaleString(
                                          'en-IN'
                                        )}

                                         { ((role.includes('sales') && projectDetails?.allowSalesExCsEdit) || (role.includes('admin')) ||  (role.includes('crm')) || false)
                                   && <TextFieldFlat
                                              label=""
                                              className="w-[90%] text-[12px] text-right font-semibold border-b  border-[#B76E00]  pr-1 py-[4px] text-[#B76E00]"
                                              name="constRatePerSqft"
                                              onChange={(e) => {
                                                // setNewSqftPrice(e.target.value)
                                                console.log(
                                                  'iam hre',
                                                  d1?.component?.value,
                                                  e.target.value
                                                )

                                                if (
                                                  d1?.component?.value ===
                                                  'villa_construct_cost'
                                                ) {
                                                  formik.setFieldValue(
                                                    'villa_construct_cost',
                                                    e.target.value
                                                  )
                                                }

                                                setConstNewSqftPrice(
                                                  Number(e.target.value)
                                                )
                                                changeOverallConstructCostFun(
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
                                            />}
                                            <TextFieldFlat
                                              className=" hidden  "
                                              label=""
                                              name={d1?.component?.value}

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
                                            ₹
                                            {d1?.gstValue?.toLocaleString(
                                              'en-IN'
                                            )}
                                          </td>
                                          <td className="w-[15%] px-2 text-[12px] text-right text-slate-900  ">
                                            ₹
                                            {d1?.TotalNetSaleValueGsT?.toLocaleString(
                                              'en-IN'
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                      {/* for construction cost  */}
                                      <tr className=" border-[#fab56c]   h-[32px]">
                                        <th className="w-[40%] text-[11px] font-semibold text-left text-[#0D027D] pl-2 ">
                                          Total (C)
                                        </th>
                                        <td className="w-[15%] px-2 font-semibold text-[12px] text-right text-gray-600 pr-3"></td>
                                        <td
                                          className={`${
                                            !showGstCol ? 'hidden' : ''
                                          } w-[15%] px-2 font-semibold  text-[12px] text-right text-gray-500 `}
                                        >
                                          ₹
                                          {constructCostSheetA
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
                                          {constructCostSheetA
                                            .reduce(
                                              (partialSum, obj) =>
                                                partialSum +
                                                Number(obj?.gstValue),
                                              0
                                            )
                                            ?.toLocaleString('en-IN')}
                                        </td>
                                        <td className="w-[15%] px-2  font-semibold text-[12px] text-right  text-[#0D027D] ">
                                          ₹{partCTotal?.toLocaleString('en-IN')}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <div className=" border-y-1 overflow-hidden mt-4">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="h-8 mb-1 border-none w-[100%]  bg-[#E8E6FE] text-[#0D027D] text-[#0D027D]  font-[600] ">
                                        <th className="min-w-[35%] px-2  text-[12px] text-left font-bold tracking-wide ">
                                          Construction Additional Charges
                                        </th>
                                        <th className="w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide ">
                                          Rate/Sqft
                                        </th>
                                        <th
                                          className={`${
                                            !showGstCol ? 'hidden' : ''
                                          } w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide `}
                                        >
                                          Cost
                                        </th>
                                        <th
                                          className={`${
                                            !showGstCol ? 'hidden' : ''
                                          }  w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide `}
                                        >
                                          GST
                                        </th>
                                        <th className="w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide  ">
                                          Total
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {partBConstPayload?.map((d1, inx) => (
                                        <tr
                                          key={inx}
                                          className="h-[32px] border-b border-dashed"
                                        >
                                          <th className=" text-[12px] px-2 text-left  font-normal ">
                                            {d1?.component?.label}
                                            {/* {d1?.units?.value === 'costpersqft' && `(${d1?.charges}% on Sale value)`} */}
                                          </th>
                                          <td className="w-[15%]  px-2 text-[12px] text-right   ">
                                            {Number(
                                              d1?.charges
                                            )?.toLocaleString('en-IN')}
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
                                            ₹
                                            {d1?.gstValue?.toLocaleString(
                                              'en-IN'
                                            )}
                                          </td>
                                          <td className="text-[12px] px-2 text-right   ">
                                            {/* {Number(d1?.charges)?.toLocaleString('en-IN')} */}
                                            ₹
                                            {d1?.TotalNetSaleValueGsT?.toLocaleString('en-IN')}
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className=" h-[32px] ">
                                        <th className="w-[40%] text-[11px] px-2 font-semibold text-left  text-[#0D027D] ">
                                          Total (D)
                                        </th>
                                        <td className="w-[15%] px-2 font-semibold text-[12px] text-right text-gray-600 pr-3"></td>
                                        <td
                                          className={`${
                                            !showGstCol ? 'hidden' : ''
                                          } w-[15%] px-2 font-semibold  text-[12px] text-right text-gray-800 `}
                                        >
                                          ₹
                                          {partBConstPayload
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
                                          {partBConstPayload
                                            ?.reduce(
                                              (partialSum, obj) =>
                                                partialSum +
                                                Number(obj?.gstValue),
                                              0
                                            )
                                            ?.toLocaleString('en-IN')}
                                        </td>
                                        <td className="text-[12px] px-2 text-right text-[#0D027D] font-semibold">
                                          ₹{partDTotal?.toLocaleString('en-IN')}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <div className=" border-y-1 overflow-hidden mt-4">
                            <table className="w-full">
                              <thead>
                                <tr className="h-8 mb-1 border-none w-[100%]  bg-[#E8E6FE] text-[#0D027D] text-[#0D027D]  font-[600] ">
                                  <th className="min-w-[35%] px-2  text-[12px] text-left font-bold tracking-wide ">
                                    Possession Charges
                                  </th>
                                  <th className="w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide ">
                                    Rate/Sqft
                                  </th>
                                  <th
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    } w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide `}
                                  >
                                    Cost
                                  </th>
                                  <th
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    }  w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide `}
                                  >
                                    GST
                                  </th>
                                  <th className="w-[15%] px-2 text-[12px] text-left font-bold text-right  tracking-wide  ">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {possessAdditionalCS?.map((d1, inx) => (
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
                                      {d1?.TotalNetSaleValueGsT?.toLocaleString(
                                        'en-IN'
                                      )}
                                    </td>
                                  </tr>
                                ))}
                                <tr className=" h-[32px] ">
                                  <th className="w-[40%] text-[11px] px-2 font-semibold text-left  text-[#0D027D] ">
                                    Total (E)
                                  </th>
                                  <td className="w-[15%] px-2 font-semibold text-[12px] text-right text-gray-600 pr-3"></td>
                                  <td
                                    className={`${
                                      !showGstCol ? 'hidden' : ''
                                    } w-[15%] px-2 font-semibold  text-[12px] text-right text-gray-800 `}
                                  >
                                    ₹
                                    {possessAdditionalCS
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
                                    {possessAdditionalCS
                                      ?.reduce(
                                        (partialSum, obj) =>
                                          partialSum + Number(obj?.gstValue),
                                        0
                                      )
                                      ?.toLocaleString('en-IN')}
                                  </td>
                                  <td className="text-[12px] px-2 text-right text-[#0D027D] font-semibold">
                                    ₹{partETotal?.toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                              </section>
                            )}
                          </section>

                          <div className='mt-5 mb-10'>
                            <section className="flex flex-row justify-between mb-8 mt-4">
                              <div></div>

                              <div className="border rounded-lg shadow-lg  mt-4">
                                <section className="flex flex-row justify-between mt-2   ">
                                  <h1 className="px-3 text-[12px] text-left  text-[12px] font-normal ">
                                  {selPhaseObj?.projectType?.name ===
                                      'Apartment'
                                        ? 'Flat'
                                        : 'Plot'}{' '}
                                      Charges
                                  </h1>
                                  <section className="flex flex-row mt-1">
                                    <section className="px-2 d-md font-semibold text-[12px] text-[#000000e6] leading-none">
                                      ₹{partATotal?.toLocaleString('en-IN')}
                                    </section>
                                  </section>
                                </section>
                                <section className="flex flex-row justify-between  mt-2">
                                  <h1 className="px-3 text-[12px] text-left  text-[12px] font-normal ">
                                    Additional Charges
                                  </h1>
                                  <section className="flex flex-row mt-1">
                                    <section className="px-2 d-md font-semibold text-[12px] text-[#000000e6] leading-none">
                                      ₹{partBTotal?.toLocaleString('en-IN')}
                                    </section>
                                  </section>
                                </section>
                                {selPhaseObj?.projectType?.name ===
                                  'Villas' && (
                                  <>
                                    <section className="flex flex-row justify-between  mt-2">
                                      <h1 className="px-3 text-[12px] text-left  text-[12px] font-normal ">
                                        Construction Charges
                                      </h1>
                                      <section className="flex flex-row mt-1">
                                        <section className="px-2 d-md font-semibold text-[12px] text-[#000000e6] leading-none">
                                          ₹{partCTotal?.toLocaleString('en-IN')}
                                        </section>
                                      </section>
                                    </section>
                                    <section className="flex flex-row justify-between  mt-2">
                                      <h1 className="px-3 text-[12px] text-left  text-[12px] font-normal mr-9 ">
                                      Construction Additional Charges
                                      </h1>
                                      <section className="flex flex-row mt-1">
                                        <section className="px-2 d-md font-semibold text-[12px] text-[#000000e6] leading-none">
                                          ₹{partDTotal?.toLocaleString('en-IN')}
                                        </section>
                                      </section>
                                    </section>
                                    <section className="flex flex-row justify-between  mt-2">
                                      <h1 className="px-3 text-[12px] text-left  text-[12px] font-normal ">
                                        Possession Charges
                                      </h1>
                                      <section className="flex flex-row mt-1">
                                        <section className="px-2 d-md font-semibold text-[12px] text-[#000000e6] leading-none">
                                          ₹{partETotal?.toLocaleString('en-IN')}
                                        </section>
                                      </section>
                                    </section>
                                  </>
                                )}

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
                        <>
                          <div className=" mt-1 border rounded-lg shadow-md overflow-hidden ">
                            <table className="w-full border-b border-dashed">
                              <thead className="">
                                {' '}
                                <tr className=" h-8  border-none bg-[#E8E6FE] text-[#0D027D]  font-[600]  ">
                                  <th className="w-[50%] px-2   text-left  tracking-wide  text-[12px]   ">
                                    {selPhaseObj?.projectType?.name ===
                                    'Apartment'
                                      ? 'Flat'
                                      : 'Plot'}{' '}
                                    Payment Schedule
                                  </th>
                                  <th className="w-[30%] px-2   text-left  tracking-wide  text-[12px] ">
                                    Payment Timeline of
                                  </th>
                                  <th className="w-[20%] px-2   text-right  tracking-wide   text-[12px]">
                                    Total inc GST
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {psPayload?.map((d1, inx) => (
                                  <tr
                                    key={inx}
                                    className="border-b-[0.05px] border-gray-300 py-1 my-2 h-[32px]  py-[24px]"
                                  >
                                    <th className=" px-2  text-[10px] text-left text-bold   tracking-wide  text-grey-900 ">
                                      {d1?.stage?.label}
                                      <div className="text-[9px] text-left text-normal  text-slate-600 ">
                                        {d1?.description} ({d1?.zeroDay} days)
                                      </div>
                                    </th>
                                    <td className="text-[11px] px-2  text-left font-normal tracking-wide uppercase ">
                                      <CustomDatePicker
                                        id="bmrdaStartDate"
                                        name="bmrdaStartDate"
                                        className={`pl- px-1 h-8 rounded-md mt-1 min-w-[100px] max-w-[120px] inline text-[#0091ae] flex bg-grey-lighter text-grey-darker border border-[#cccccc] ${
                                          d1?.schDate <
                                          newPlotPS[inx - 1]?.schData
                                            ? 'border-red-600'
                                            : 'border-[#cccccc]'
                                        } px-2`}
                                        // selected={d1.schDate = d1?.schDate || d.getTime() + (newPlotPS
                                        //   .slice(0, inx)
                                        //   .reduce((sum, prevItem) => sum + (Number(prevItem.zeroDay) || 0), 0)+ Number(d1?.zeroDay || 0) * 86400000)}
                                        selected={
                                          (d1.schDate =
                                            d1?.schDate ||
                                            d.getTime() +
                                              (newPlotPS
                                                .slice(0, inx)
                                                .reduce(
                                                  (sum, prevItem) =>
                                                    sum +
                                                    (Number(prevItem.zeroDay) ||
                                                      0),
                                                  0
                                                ) +
                                                Number(d1?.zeroDay || 0)) *
                                                86400000)
                                        }
                                        onChange={(date) => {
                                          // formik.setFieldValue(
                                          //   'bmrdaStartDate',
                                          //   date.getTime()
                                          // )
                                          console.log(
                                            'sel unti data',
                                            date.getTime()
                                          )

                                          // setStartDate(date)
                                          handlePSdateChange(
                                            inx,
                                            date.getTime(),
                                            'plotPs'
                                          )
                                        }}
                                        timeFormat="HH:mm"
                                        injectTimes={[
                                          setHours(setMinutes(d, 1), 0),
                                          setHours(setMinutes(d, 5), 12),
                                          setHours(setMinutes(d, 59), 23),
                                        ]}
                                        dateFormat="MMM dd, yyyy"
                                        leadYears={10}

                                      />
                                    </td>
                                    <td className="text-[12px] px-2  text-right tracking-wide uppercase ">
                                     ₹{d1?.value?.toLocaleString('en-IN')}
                                    </td>
                                  </tr>
                                ))}

                                <tr className="h-[32px]">
                                  <th className="text-[12px] px-2  text-left text-gray-800 ">
                                    {selPhaseObj?.projectType?.name ===
                                    'Apartment'
                                      ? 'Flat Value Total Rs.:'
                                      : 'Plot Value Total'}
                                  </th>
                                  <td className="text-[12px] px-2  text-right text-gray-400 "></td>
                                  <th className="text-[12px] px-2  text-right text-gray-800 ">
                                    ₹
                                    {(
                                      (myBookingPayload?.T_A || 0) +
                                      (myBookingPayload?.T_B || 0)
                                    )?.toLocaleString('en-IN')}
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {/* construction payment schedule */}
                          {selPhaseObj?.projectType?.name === 'Villas' && (
                            <div className=" mt-4 border rounded-lg shadow-md overflow-hidden mb-24 ">
                              <table className="w-full border-b border-dashed">
                                <thead className="">
                                  {' '}
                                  <tr className=" h-8  border-none bg-[#E8E6FE] text-[#0D027D]  font-[600]  ">
                                    <th className="w-[50%] px-2   text-left  tracking-wide text-[11px]   ">
                                      Construction Payment Schedule
                                    </th>
                                    <th className="w-[30%] px-2   text-left  tracking-wide text-[11px] ">
                                      Payment Timeline of
                                    </th>
                                    <th className="w-[20%] px-2   text-right  tracking-wide text-[11px]">
                                      Total inc GST
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {psConstructPayload?.map((d1, inx) => (
                                    <tr
                                      key={inx}
                                      className="border-b-[0.05px] border-gray-300 py-1 my-2 h-[32px]  py-[24px]"
                                    >
                                      <th className=" px-2  text-[10px] text-left text-bold   tracking-wide uppercase text-grey-900 ">
                                        {d1?.stage?.label}
                                        <div className="text-[9px] text-left text-normal lowercase text-slate-600 ">
                                          {d1?.description} ({d1?.zeroDay} days)
                                        </div>
                                      </th>
                                      <td className="text-[11px] px-2  text-left font-normal tracking-wide uppercase ">
                                        <DatePicker
                                          id="bmrdaStartDate"
                                          name="bmrdaStartDate"
                                          className={`pl- px-1 h-8 rounded-md mt-1 min-w-[100px] max-w-[120px] inline text-[#0091ae] flex bg-grey-lighter text-grey-darker border border-[#cccccc] ${
                                            d1?.schDate <
                                            newPlotPS[inx - 1]?.schData
                                              ? 'border-red-600'
                                              : 'border-[#cccccc]'
                                          } px-2`}
                                          selected={
                                            (d1.schDate =
                                              d1?.schDate ||
                                              d.getTime() +
                                                (psConstructPayload
                                                  .slice(0, inx)
                                                  .reduce(
                                                    (sum, prevItem) =>
                                                      sum +
                                                      (Number(
                                                        prevItem.zeroDay
                                                      ) || 0),
                                                    0
                                                  ) +
                                                  Number(d1?.zeroDay || 0)) *
                                                  86400000)
                                          }
                                          onChange={(date) => {
                                            console.log(
                                              'sel unti data',
                                              date.getTime()
                                            )

                                            handlePSdateChange(
                                              inx,
                                              date.getTime(),
                                              'constructPS'
                                            )
                                          }}
                                          timeFormat="HH:mm"
                                          injectTimes={[
                                            setHours(setMinutes(d, 1), 0),
                                            setHours(setMinutes(d, 5), 12),
                                            setHours(setMinutes(d, 59), 23),
                                          ]}
                                          //dateFormat="d-MMMM-yyyy"
                                          dateFormat="MMM dd, yyyy"
                                        />
                                      </td>
                                      <td className="text-[12px] px-2  text-right tracking-wide uppercase ">
                                        ₹{d1?.value?.toLocaleString('en-IN')}
                                      </td>
                                    </tr>
                                  ))}

                                  <tr className="h-[32px]">
                                    <th className="text-[12px] px-2  text-left text-gray-800 ">
                                      Construction Value Total Rs.:
                                    </th>
                                    <td className="text-[12px] px-2  text-right text-gray-400 "></td>
                                    <th className="text-[12px] px-2  text-right text-gray-800 ">
                                      ₹
                                      {(
                                        (partCTotal || 0) + (partDTotal || 0) + (partETotal || 0)
                                      )?.toLocaleString('en-IN')}
                                    </th>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </>
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
      {/*
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
      )} */}
    </div>
  )
}

export default CostBreakUpPdf





