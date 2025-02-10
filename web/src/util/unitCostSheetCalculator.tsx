// create a function that takes in the unit details and calculates the cost sheet

import { zhCN } from "date-fns/locale"

export const CalculateComponentTotal =  (compObj ,area,taxPercent, newValue) => {
  console.log('tax percent',compObj)

  let total = 0
  let gstTotal = 0

    const gstTaxIs = taxPercent
    const isChargedPerSqft = [
      'costpersqft',
      'cost_per_sqft',
      'price_per_sft',
    ].includes(compObj?.units.value)
    total = isChargedPerSqft? (Number(area) *newValue) : Number(newValue)
    gstTotal = (total * (gstTaxIs / 100))


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

export const UpdateComponentCalTotal =  (costSheetA,inx,area,taxPercent, newValue) => {
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

export   async function computePartTotal(additionalChargesObj, plot_area_sqft, area_tax,) {
  const results = await Promise.all(
 additionalChargesObj?.map(async (data, inx) => {
      let x = await CalculateComponentTotal(
        data,
        Number(plot_area_sqft),
        Number( data?.gst?.value || area_tax || 0 ),
        Number(data?.charges)

      );
      console.log("tax percent @@@", Number(x?.TotalNetSaleValueGsT));
      return x;
    })
  );

  const total = results.reduce(
    (partialSum, obj) => partialSum + Number(obj?.TotalNetSaleValueGsT || 0),
    0
  );

  return total;
}

