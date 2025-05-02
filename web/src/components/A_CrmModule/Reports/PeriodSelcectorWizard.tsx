import React from 'react'

const PeriodSelctorWizard = ({ timeLine, setTimeLine }) => {
  return (
    <div className=" ml-8 py-1 px-1 mb-4 mr-6 gap-2 mt-[24px] text-gray-600 bg-[#f1f1f1] rounded-full  w-[240px] flex items-center justify-between h-[34px]">
      <span
        className={`px-4  rounded-full cursor-pointer text-sm ${
          timeLine === 'W' ? 'bg-blue-100' : '}'
        }`}
        onClick={() => setTimeLine('W')}
      >
        Week
      </span>
      <span
        className={`px-4  rounded-full cursor-pointer text-sm ${
          timeLine === 'M' ? 'bg-blue-100' : 'bg-[#f1f1f1]'
        }`}
        onClick={() => setTimeLine('M')}
      >
        Month
      </span>
      <span
        className={`px-4  rounded-full cursor-pointer text-sm ${
          timeLine === 'Y' ? 'bg-blue-100' : 'bg-[#f1f1f1]'
        }`}
        onClick={() => setTimeLine('Y')}
      >
        Year
      </span>
    </div>
  )
}

export default PeriodSelctorWizard
