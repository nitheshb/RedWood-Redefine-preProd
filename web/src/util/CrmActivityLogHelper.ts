
export const crmActivieLogNamer = (dat) => {
  const { type, subtype, from, to, by } = dat
  let tex = type

  switch (subtype) {
    case 'cs_approval':
      return (tex = 'Cost Sheet')
    case 'kyc_approval':
        return (tex = 'KYC')
    case 'sd_approval':
          return (tex = 'Sale deed')
    case 'ats_approval':
          return (tex = 'ATS')
    case 'legal_approval':
            return (tex = 'Legal')
    case 'pay_capture':
      return (tex = `Payment`)
    case 'assign_change':
      return (tex = `Lead Assigned To`)
    default:
      return (tex = subtype)
  }
  return tex
}