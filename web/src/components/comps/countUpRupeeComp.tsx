import React from 'react'
import CountUp from 'react-countup'
export const CountUpRupeeComp = ({ value }) => {
  return (
    <CountUp
      start={0}
      end={value}
      duration={2}
      separator=","
      useEasing={true}
      formattingFn={(value) => formatIndianCurrency(value)}
    ></CountUp>
  )
}

const formatIndianCurrency = (value) => {
  const formattedValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value)
  const trimmedValue = formattedValue.replace('.00', '')

  return trimmedValue
}
