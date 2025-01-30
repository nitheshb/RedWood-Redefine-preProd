// create a function that takes in the unit details and calculates the cost sheet

import { zhCN } from "date-fns/locale"

export const CalculateComponentTotal = async (compObj ,area,taxPercent, newValue) => {
  console.log('tax percent',compObj)

  let total = 0
  let gstTotal = 0

    const gstTaxIs = taxPercent
    const isChargedPerSqft = [
      'costpersqft',
      'cost_per_sqft',
      'price_per_sft',
    ].includes(compObj?.units.value)
    total = isChargedPerSqft? Math.round(Number(area) *newValue) : Number(newValue)
    gstTotal = Math.round(total * (gstTaxIs / 100))


    compObj.charges = newValue
    compObj.TotalSaleValue = total
    // compObj.gst.label = gstTaxIs
  // y[inx].gst.value = gstTotal
  compObj.gstValue = gstTotal
  compObj.TotalNetSaleValueGsT = total + gstTotal


return compObj
  // setCostSheetA(y)
  // setTotalFun()
}

export const UpdateComponentCalTotal = async (costSheetA,inx,area,taxPercent, newValue) => {
  console.log('tax percent',taxPercent)
  const y = costSheetA
  const myObj = y[inx]
  const z = CalculateComponentTotal(myObj,area,taxPercent, newValue)
  const mz = {...myObj, ...z}
  // costSheetA[inx] = {...z }
  console.log('cost sheet A ====>',mz)
  return costSheetA
  // setCostSheetA(y)
  // setTotalFun()
}

