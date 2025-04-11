import React from 'react';

const RoundedProgressBar = ({ progress, width = 100, height = 8, backgroundColor = '#E5E7EB', fillColor = '#E3BDFF', showLabels = false, }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const remaining = 100 - clampedProgress;


  return (

     <div className='w-full'>

<div
      style={{
        width: `${width}%`,
        height: `${height}px`,
        backgroundColor: backgroundColor,
        borderRadius: `${height / 2}px`,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: `${clampedProgress}%`,
          height: '100%',
          backgroundColor: fillColor,
          transition: 'width 0.5s ease-in-out'
        }}
      />
    </div>


    {showLabels && (
        <div className="mt-1 flex justify-between text-[12px] font-semibold">
          <span className="bg-[#DFF6E0]  text-[#1B6600] px-1.5 py-0.5 rounded-md">
            {clampedProgress.toFixed(0)}%
          </span>
          <span className="bg-[#F5E6E6] text-[#960000] px-1.5 py-0.5 rounded-md">
            {remaining.toFixed(0)}%
          </span>
        </div>
      )}

     </div>
    
 

    
  );
};

export default RoundedProgressBar;
