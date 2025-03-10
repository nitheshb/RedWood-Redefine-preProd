// export const timeConv = function (str) {
//     const d = new Date(str)

//   const options = {
//     month: 'short',
//     day: '2-digit',
//     year: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//     timeZone: 'Asia/Kolkata', // Set the time zone to India
//   }



//   return d.toLocaleString('en-IN', options)
// }



export const timeConv = function (str: string): string {
  const d = new Date(str);

  const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      year: '2-digit', // Correct type
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata', // Set the time zone to India
  };

  return d.toLocaleString('en-IN', options);
}








export function prettyDate(d) {
  if(d){
  const date = new Date(d)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

 
  return (
    months[date.getMonth()] + '-' +
    date.getDate() + '-' +
    date.getFullYear()
  )
  }else{
    'NA'
  }
}

export function prettyDateTime(d) {
  const date = new Date(d)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const dat = date.getDate() < 10 ? `0${date.getDate()} ` : date.getDate()
  const hr = date.getHours() < 10 ? `0${date.getHours()} ` : date.getHours()

  return (
    months[date.getMonth()] +
    ' ' +
    dat +
    ', ' +
    date.getFullYear() +
    '   ' +
    hr +
    ':' +
    String(date.getMinutes()).padStart(2, '0')
  )
}
export function getDifferenceInDays(date1, date2) {
  const x = new Date()
  const diffInMs = date1 - x
  return parseInt(diffInMs / (1000 * 60 * 60 * 24))
}

export function getDifferenceInHours(date1, date2) {
  const x = new Date()
  const diffInMs = date1 - x
  return parseInt(diffInMs / (1000 * 60 * 60))
}

export function getDifferenceInMinutes(date1, date2) {
  const x = new Date()
  const diffInMs = date1 - x
  return parseInt(diffInMs / (1000 * 60))
}

export function getDifferenceInSeconds(date1, date2) {
  const x = new Date()

  const diffInMs = Math.abs(x - date1)
  return parseInt(diffInMs / 1000)
}

export function formatToPhone(no) {
  return no?.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
}

export function getWeekMonthNo(milliseconds) {
  const date = new Date(milliseconds)
  const currentMonth = date.getMonth()
  // Get day month and year
  const day = date.getDate()
  const month = date.getMonth() + 1 // Months are zero-based
  const year = date.getFullYear()
  // Get week number
  const weekNumberOfMonth = Math.ceil((date.getDate() + date.getDay()) / 7)

  // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const dayOfWeek = date.getDay()

  // Adjust the date to start from Monday (if current day is Sunday, move back one week)
  date.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))

  // Get the year of the date

  // Find the first Thursday of the year
  const firstThursday = new Date(year, 0, 4 - ((date.getDay() + 6) % 7))

  // Calculate the week number
  const weekNumberOfYear = Math.floor(
    (date - firstThursday) / (7 * 24 * 3600 * 1000) + 1
  )

  // Calculate the start date of the week (assuming Monday as the start of the week)
  const startDate = new Date(date)
  startDate.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))

  // Calculate the end date of the week
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  // If the end date is in a different month, adjust it to the last day of the month
  if (endDate.getMonth() !== currentMonth) {
    endDate.setDate(new Date(year, currentMonth + 1, 0).getDate())
  }
  // Format the date string
  const formattedDate = `W-${weekNumberOfYear}_M-${month}_year-${year}`

  return {
    weekNumberOfYear: weekNumberOfYear,
    weekNumberOfMonth: weekNumberOfMonth,
    day: day,
    month: month,
    year,
  }
}

export function getNextThreeMonths() {
  const months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ]

  // Get the current month
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonthIndex = currentDate.getMonth()
  const currentMonthName = months[currentMonthIndex]

  const nextMonths = [
    {
      name: `${currentMonthName?.name}-${currentYear}`,
      count: currentMonthName?.value,
      currentYear: currentYear //%100
    },
  ]

  // Get the names and counts of the next three months
  for (let i = 1; i <= 3; i++) {
    const nextMonthIndex = (currentMonthIndex + i) % 12
    const nextMonthName = months[nextMonthIndex]
    nextMonths.push({
      name: `${nextMonthName?.name}-${currentYear}`,
      count: nextMonthName?.value,
      currentYear: currentYear //%100 // high
    })
  }

  return nextMonths
}
export function getLastThreeMonths() {
  const months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ]

  // Get the current month
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonthIndex = currentDate.getMonth()
  const currentMonthName = months[currentMonthIndex]

  const lastMonths = [
    {
      name: `${currentMonthName?.name}-${currentYear}`,
      count: currentMonthName?.value,
      currentYear: currentYear //%100
    },
  ]

// Get the names and counts of the last three months
for (let i = 1; i <= 2; i++) {
  let previousMonthIndex = (currentMonthIndex - i + 12) % 12;
  let previousMonthName = months[previousMonthIndex];

  // Adjust year when moving back to a previous year
  let previousYear = currentYear;
  if (currentMonthIndex - i < 0) {
    previousYear = (currentYear - 1 + 100) % 100; // Handle the year transition
  }

  lastMonths.push({
    name: `${previousMonthName.name}-${previousYear}`,
    count: previousMonthName.value,
    currentYear: previousYear,
  });
}

return lastMonths.reverse();
}

export function getLastSevenMonths() {
  const months = [
    { name: 'Jan', value: 1 },
    { name: 'Feb', value: 2 },
    { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 },
    { name: 'May', value: 5 },
    { name: 'Jun', value: 6 },
    { name: 'Jul', value: 7 },
    { name: 'Aug', value: 8 },
    { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 },
    { name: 'Nov', value: 11 },
    { name: 'Dec', value: 12 },
  ]

  // Get the current month
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonthIndex = currentDate.getMonth()
  const currentMonthName = months[currentMonthIndex]

  const lastMonths = [
    {
      name: `${currentMonthName?.name}-${currentYear}`,
      count: currentMonthName?.value,
      month: currentMonthName?.value,
      currentYear: currentYear //%100
    },
  ]

// Get the names and counts of the last three months
for (let i = 1; i < 7; i++) {
  let previousMonthIndex = (currentMonthIndex - i + 12) % 12;
  let previousMonthName = months[previousMonthIndex];

  // Adjust year when moving back to a previous year
  let previousYear = currentYear;
  if (currentMonthIndex - i < 0) {
    previousYear = (currentYear - 1 + 100) % 100; // Handle the year transition
  }

  lastMonths.push({
    name: `${previousMonthName.name}-${previousYear}`,
    count: previousMonthName.value,
    month: previousMonthName.value,

    currentYear: previousYear,
  });
}

return lastMonths.reverse();
}

export function getLastSevenWeeks() {
  const currentDate = new Date();

  // Function to get the week number of a given date
  function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date - startOfYear;
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.ceil((diff + startOfYear.getDay() * 24 * 60 * 60 * 1000) / oneWeek);
  }

  const currentYear = currentDate.getFullYear();
  const currentWeek = getWeekNumber(currentDate);

  const lastWeeks = [
    {
      name: `W${currentWeek}-${currentYear}`,
      week: `W${currentWeek}-${currentYear}`,
      weekNumber: currentWeek,
      year: currentYear,
    },
  ];

  // Get the last 6 weeks
  for (let i = 1; i < 7; i++) {
    let previousWeek = currentWeek - i;
    let previousYear = currentYear;

    // Handle year transition if week number is less than 1
    if (previousWeek < 1) {
      previousYear -= 1;
      previousWeek = getWeekNumber(new Date(previousYear, 11, 31)) + previousWeek;
    }

    lastWeeks.push({
      name:`Week${previousWeek}`,
      week: `Week${previousWeek}`,
      weekNumber: previousWeek,
      year: previousYear,
    });
  }

  return lastWeeks.reverse();
}

export function getLastSixYears() {
  const currentYear = new Date().getFullYear();
  const lastYears = [];

  for (let i = 0; i < 6; i++) {
    lastYears.push(

    {
      name: currentYear - i,
      year: currentYear - i});
  }

  return lastYears.reverse(); // Reverse to keep the latest year at the end
}



