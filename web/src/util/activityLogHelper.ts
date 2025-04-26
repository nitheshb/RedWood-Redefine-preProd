export const activeLogNameHelper = (dat) => {
  const { type, from, to, by } = dat
  let tex = type

  switch (type) {
    case 'l_ctd':
      return (tex = 'Lead Created')
    case 'sts_change':
      return (tex = `completed & moved to`)
    case 'assign_change':
      return (tex = `Lead Assigned To`)
    default:
      return (tex = type)
  }
  return tex
}
