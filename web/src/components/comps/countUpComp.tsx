import React from 'react'

import CountUp from 'react-countup'

export const CountUpComp = ({ value }) => {
  return (
    <CountUp
      start={0}
      end={value}
      duration={1}
      separator=","
      useEasing={true}
      formattingFn={(value) => formatIndianCurrency(value)}
    ></CountUp>
  )
}

const formatIndianCurrency = (value) => {
  const formattedValue = new Intl.NumberFormat('en-IN', {
    currency: 'INR',
  }).format(value)

  return formattedValue
}
