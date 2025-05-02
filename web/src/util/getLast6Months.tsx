// Function to get start and end time of a month
export function getMonthStartEnd(year, month) {
  // Months are 0 indexed in JavaScript
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)
  return {
    start: startDate.getTime(),
    end: endDate.getTime(),
  }
}
// Function to get last four months from a given timestamp
export function getLastFourMonths(totalLeadsA, timestamp) {
  const currentDate = new Date(timestamp)
  const lastFourMonths = []

  for (let i = 0; i < 4; i++) {
    const currentMonth = currentDate.getMonth() + 1 // Adding 1 to make months 1-indexed
    const currentYear = currentDate.getFullYear().toString().slice(-2) // Extracting last two digits of the year
    const monthInfo = getMonthStartEnd(
      currentDate.getFullYear(),
      currentDate.getMonth()
    )

    // Calculate counts once for each month
    const counts = calculateCountObj(
      totalLeadsA,
      monthInfo.start,
      monthInfo.end
    )

    lastFourMonths.push({
      month: currentMonth < 10 ? '0' + currentMonth : currentMonth,
      year: currentYear,
      name: `${new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ).toLocaleString('default', { month: 'short' })}-${currentYear}`,
      start: monthInfo.start,
      end: monthInfo.end,
      counts: counts.totalLeads,
      InProgress: counts.InProgress,
      InNotInterested: counts.InNotInterested,
      InJunk: counts.InJunk,
      InBooked: counts.InBooked,
      revisited: counts.revisited,
    })

    currentDate.setMonth(currentDate.getMonth() - 1) // Move to the previous month
  }
  lastFourMonths.sort((a, b) => a.start - b.start)
  return lastFourMonths
}

// Function to get last four months from a given timestamp
export function getLastFourMonths2(totalLeadsA, timestamp) {
  const currentDate = new Date(timestamp)
  const lastFourMonths = []

  for (let i = 0; i < 6; i++) {
    const currentMonth = currentDate.getMonth() + 1 // Adding 1 to make months 1-indexed
    const currentYear = currentDate.getFullYear().toString().slice(-2) // Extracting last two digits of the year
    const monthInfo = getMonthStartEnd(
      currentDate.getFullYear(),
      currentDate.getMonth()
    )
    lastFourMonths.push({
      month: currentMonth < 10 ? '0' + currentMonth : currentMonth,
      year: currentYear,
      name: `${new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ).toLocaleString('default', { month: 'short' })}-${currentYear}`,
      start: monthInfo.start,
      end: monthInfo.end,
      counts: calculateCount(totalLeadsA, monthInfo.start, monthInfo.end),
    })
    currentDate.setMonth(currentDate.getMonth() - 1) // Move to the previous month
  }
  lastFourMonths.sort((a, b) => a.start - b.start)
  return lastFourMonths
}

// Function to calculate the count of totalLeads within a specified date range
function calculateCount(leadsArray, startDate, endDate) {
  return leadsArray.reduce((total, lead) => {
    if (parseInt(lead.day) >= startDate && parseInt(lead.day) <= endDate) {
      return total + lead.totalLeads
    } else {
      return total
    }
  }, 0)
}

function calculateCountObj(leadsArray, startDate, endDate) {
  let totalCount = 0
  let totalInProgress = 0
  let totalInBooked = 0
  let totalInJunk = 0
  let totalInNotInterested = 0
  let totalRevisited = 0

  leadsArray.forEach((lead) => {
    const day = parseInt(lead.day)
    const totalLeads = parseInt(lead.totalLeads)
    const InProgress = lead.InProgress !== null ? parseInt(lead.InProgress) : 0
    const InBooked = lead.InBooked !== null ? parseInt(lead.InBooked) : 0
    const InJunk = lead.InJunk !== null ? parseInt(lead.InJunk) : 0
    const InNotInterested =
      lead.InNotInterested !== null ? parseInt(lead.InNotInterested) : 0
    const revisited = lead.revisited !== null ? parseInt(lead.revisited) : 0

    if (day >= startDate && day <= endDate) {
      totalCount += totalLeads
      totalInProgress += InProgress
      totalInBooked += InBooked
      totalInJunk += InJunk

      totalInNotInterested += InNotInterested
      totalRevisited += revisited
    }
  })

  return {
    totalLeads: totalCount,
    InProgress: totalInProgress,
    InBooked: totalInBooked,
    InJunk: totalInJunk,
    InNotInterested: totalInNotInterested,
    revisited: totalRevisited,
  }
}
