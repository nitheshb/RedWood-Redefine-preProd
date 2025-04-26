export const sqmtConverter = (value: number, unit: string) => {
  switch (unit) {
    case 'acre':
      return Math.floor(value * 4046.86)
    case 'hectare':
      return value * 10000
    case 'square-yard':
      return Math.floor(value * 0.83612809913659)
    case 'square-meter':
      return Math.floor(value * 10.764)
    case 'square-feet':
      return Math.floor(value * 0.092903)
    case 'gunta':
      return value * 101
    default:
      return 0
  }
}
