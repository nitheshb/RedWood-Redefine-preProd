export const sqftConverter = (value: number, unit: string) => {
  switch (unit) {
    case 'acre':
      return value * 43560
    case 'hectare':
      return value * 107639
    case 'square-yard':
      return value * 9
    case 'square-meter':
      return Math.floor(value * 10.764)
    case 'gunta':
      return value * 1089
    default:
      return 0
  }
}

export function calculatePercentages(paid, total) {


  if (total <= 0) {
      return {
          paidPercentage: 0,
          unpaidPercentage: 0,
          error: "Total amount must be greater than zero."
      };
  }

  let paidPercentage = (paid / total) * 100;

  // Cap paid percentage at 100%
  if (paidPercentage > 100) {
      paidPercentage = 100;
  }

  const unpaidPercentage = 100 - paidPercentage;
  console.log('paid is', paid, total, {
    paidPercentage: Number(paidPercentage.toFixed(2)), // Rounded to 2 decimal places
    unpaidPercentage: Number(unpaidPercentage.toFixed(2)), // Rounded to 2 decimal places
})
  return {
      paidPercentage: Number(paidPercentage.toFixed(2)), // Rounded to 2 decimal places
      unpaidPercentage: Number(unpaidPercentage.toFixed(2)) // Rounded to 2 decimal places
  };
}
