import React, { useState } from 'react'

const Stepper = ({
  id,
  streamCurrentStatus,
  streamCoveredA,
  tempLeadStatus,
  streamfrom,
  setStatusFun,
}) => {
  const [hover, setHover] = useState(false)
  const [hoverId, setHoverId] = useState(1000)

  const hoverEffectFun = (i) => {
    setHoverId(i)
  }

  const styleO = {
    normal: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    },
    hover: {
      backgroundColor: '#E2E8F0',
      borderRadius: '4px',
    },
    completed: {
      color: '#4F46E5',
      fontWeight: '500',
    },
  }

  const StatusListA = [
    { label: 'New', value: 'new', logo: 'FireIcon', color: ' bg-violet-500' },
    {
      label: 'Follow up',
      value: 'followup',
      logo: 'RefreshIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Visit Fixed',
      value: 'visitfixed',
      logo: 'FireIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Visit Done',
      value: 'visitdone',
      logo: 'DuplicateInactiveIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Negation',
      value: 'negotiation',
      logo: 'CurrencyRupeeIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Booked',
      value: 'booked',
      logo: 'BadgeCheckIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Not Interested',
      value: 'notinterested',
      logo: 'XCircleIcon',
      color: ' bg-violet-500',
    },
    {
      label: 'Junk',
      value: 'junk',
      logo: 'XCircleIcon',
      color: ' bg-violet-500',
    },
  ]

  return (
    <div className="flex flex-row justify-between py-3 px-3 mt-0.5 mb-0 rounded-xs bg-gray-100">
      {StatusListA.map((statusFlowObj, i) => (
        <div key={i} className="flex flex-col items-center">
          {/* Step Circle */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mb-1 ${
              streamCoveredA.includes(statusFlowObj.value) ||
              statusFlowObj.value === streamfrom
                ? 'bg-blue-500 border-blue-500 text-white'
                : statusFlowObj.value === streamCurrentStatus ||
                  statusFlowObj.value === tempLeadStatus
                ? 'bg-white border-blue-500 text-blue-500'
                : 'bg-white border-gray-300 text-gray-400'
            }`}
            onClick={() => setStatusFun(id, statusFlowObj.value)}
            onMouseEnter={() => {
              hoverEffectFun(i)
              setHover(true)
            }}
            onMouseLeave={() => {
              hoverEffectFun(1000)
              setHover(false)
            }}
            style={{
              ...(hover && hoverId === i
                ? { boxShadow: '0 0 0 4px rgba(79, 70, 229, 0.2)' }
                : {}),
              cursor: 'pointer',
            }}
          >
            {streamCoveredA.includes(statusFlowObj.value) ||
            statusFlowObj.value === streamfrom ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              i + 1
            )}
          </div>

          {/* Step Label */}
          <span
            className={`font-bodyLato text-xs font-normal px-2 py-1 ${
              streamCoveredA.includes(statusFlowObj.value) ||
              statusFlowObj.value === streamfrom
                ? 'text-blue-500 font-medium'
                : statusFlowObj.value === streamCurrentStatus ||
                  statusFlowObj.value === tempLeadStatus
                ? 'text-blue-500'
                : 'text-gray-500'
            }`}
          >
            {statusFlowObj.label}
          </span>

          {/* Connector Line (except for last item) */}
          {i < StatusListA.length - 1 && (
            <div
              className="absolute h-0.5 top-4 bg-gray-300"
              style={{
                width: '100%',
                left: '50%',
                transform: 'translateX(0)',
                zIndex: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default Stepper
