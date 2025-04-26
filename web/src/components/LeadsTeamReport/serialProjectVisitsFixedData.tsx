export function serialProjecVisitFixedData(projectListA, fullData) {
  console.log('inside visit fixed full data ', fullData)
  let z = []
  return projectListA?.map((souceObj) => {
    const x = souceObj
    console.log('project is ', souceObj)
    z = [...z, souceObj?.label]
    if (x.label == 'others') {
      x.Total = fullData?.filter((datObj) => {
        return datObj?.projectId == null || datObj?.projectId == ''
      })

      x.inprogress = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          [
            'new',
            'unassigned',
            'followup',
            'visitfixed',
            'visitdone',
            'negotiation',
          ].includes(datObj?.to)
      )
      x.new = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          ['new', 'unassigned'].includes(datObj?.to)
      )
      x.unassigned = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.to == 'unassigned'
      )

      x.followup = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.to == 'followup'
      )

      x.visitfixed = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.to == 'visitfixed'
      )
      x.visitdone = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.coverA.includes('visitdone')
      )
      x.negotiation = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.to == 'negotiation'
      )
      x.booked = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.to == 'booked'
      )
      x.Dead = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.to == 'Dead'
      )
      x.blocked = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.to == 'blocked'
      )
      x.notinterested = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.to == 'notinterested'
      )
      x.dead = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.to == 'dead'
      )
      x.blocked = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.to == 'blocked'
      )
      x.junk = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          datObj?.to == 'junk'
      )
      x.archieve = fullData?.filter(
        (datObj) =>
          (datObj?.projectId == null || datObj?.projectId == '') &&
          ['blocked', 'dead', 'notinterested', 'junk'].includes(datObj?.to)
      )

      x.others = fullData?.filter(
        (datObj) => !z.includes(datObj?.Project) && datObj?.to == ''
      )
    } else {
      x.Total = fullData?.filter(
        (datObj) => datObj?.projectId == souceObj?.value
      )
      x.inprogress = fullData?.filter(
        (datObj) =>
          datObj?.projectId == souceObj?.value &&
          [
            'new',
            'unassigned',
            'followup',
            'visitfixed',
            'visitdone',
            'negotiation',
          ].includes(datObj?.to)
      )
      x.new = fullData?.filter(
        (datObj) =>
          datObj?.projectId == souceObj?.value &&
          ['new', 'unassigned'].includes(datObj?.to)
      )
      x.unassigned = fullData?.filter(
        (datObj) =>
          datObj?.projectId == souceObj?.value && datObj?.to == 'unassigned'
      )

      x.followup = fullData?.filter(
        (datObj) =>
          datObj?.projectId == souceObj?.value && datObj?.to == 'followup'
      )

      x.visitfixed = fullData?.filter(
        (datObj) =>
          datObj?.projectName == souceObj?.label && datObj?.to == 'visitfixed'
      )
      x.visitdone = fullData?.filter(
        (datObj) =>
          datObj?.projectId == souceObj?.value &&
          datObj?.coverA.includes('visitdone')
      )
      x.negotiation = fullData?.filter(
        (datObj) =>
          datObj?.projectId == souceObj?.value && datObj?.to == 'negotiation'
      )
      x.booked = fullData?.filter(
        (datObj) =>
          datObj?.projectId == souceObj?.value && datObj?.to == 'booked'
      )
      x.Dead = fullData?.filter(
        (datObj) => datObj?.projectId == souceObj?.value && datObj?.to == 'Dead'
      )
      x.blocked = fullData?.filter(
        (datObj) =>
          datObj?.projectId == souceObj?.value && datObj?.to == 'blocked'
      )
      x.notinterested = fullData?.filter(
        (datObj) =>
          datObj?.projectId == souceObj?.value && datObj?.to == 'notinterested'
      )
      x.dead = fullData?.filter(
        (datObj) => datObj?.projectId == souceObj?.value && datObj?.to == 'dead'
      )
      x.blocked = fullData?.filter(
        (datObj) =>
          datObj?.projectId == souceObj?.value && datObj?.to == 'blocked'
      )
      x.junk = fullData?.filter(
        (datObj) => datObj?.projectId == souceObj?.value && datObj?.to == 'junk'
      )
      x.archieve = fullData?.filter(
        (datObj) =>
          datObj?.projectId == souceObj?.value &&
          ['blocked', 'dead', 'notinterested', 'junk'].includes(datObj?.to)
      )
      x.others = fullData?.filter(
        (datObj) => datObj?.projectId == souceObj?.value && datObj?.to == ''
      )
    }

    return x
  })
}
