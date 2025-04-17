// const SemicircleProgressChart = ({ progress = 0, size = 120, strokeWidth = 15 }) => {
//     const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));

//     const radius = (size - strokeWidth) / 2;
//     const circumference = radius * Math.PI;
//     const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

//     const halfHeight = size / 2 + strokeWidth / 2;

//     return (
//       <div className="relative" style={{ width: size, height: halfHeight }}>
//         <svg
//           className="w-full h-full"
//           viewBox={`0 0 ${size} ${halfHeight}`}
//         >
//           {/* Background track */}
//           <path
//             className="text-gray-200"
//             strokeWidth={strokeWidth}
//             stroke="currentColor"
//             fill="transparent"
//             d={`
//               M ${strokeWidth / 2}, ${size / 2}
//               A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}
//             `}
//           />

//           {/* Progress Indicator */}
//           <path
//             className="text-purple-400 transition-all duration-300 ease-in-out"
//             strokeWidth={strokeWidth}
//             strokeDasharray={circumference}
//             strokeDashoffset={strokeDashoffset}
//             strokeLinecap="round"
//             stroke="currentColor"
//             fill="transparent"
//             d={`
//               M ${strokeWidth / 2}, ${size / 2}
//               A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}
//             `}
//           />
//         </svg>


//         <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
//           <span className="text-sm font-bold">{Math.round(safeProgress)}%</span>
//         </div>
//       </div>
//     );
//   };

//   export default SemicircleProgressChart;






// import React from 'react';

// const SemicircleProgressChart = ({
//   progress = 0,
//   size = 120,
//   strokeWidth = 15,
// }) => {
//   const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));

//   const radius = (size - strokeWidth) / 2;
//   const circumference = Math.PI * radius;
//   const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

//   const halfHeight = size / 2 + strokeWidth / 2;

//   return (
//     <div className="relative" style={{ width: size, height: halfHeight }}>
//       <svg
//         className="w-full h-full"
//         viewBox={`0 0 ${size} ${halfHeight}`}
//       >
//         {/* Background semicircle */}
//         <path
//           d={`
//             M ${strokeWidth / 2}, ${size / 2}
//             A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}
//           `}
//           stroke="#e5e7eb" // Tailwind gray-200
//           strokeWidth={strokeWidth}
//           fill="transparent"
//         />

//         {/* Progress semicircle */}
//         <path
//           d={`
//             M ${strokeWidth / 2}, ${size / 2}
//             A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}
//           `}
//           stroke="#a855f7" // Tailwind purple-500
//           strokeWidth={strokeWidth}
//           fill="transparent"
//           strokeDasharray={circumference}
//           strokeDashoffset={strokeDashoffset}
//           strokeLinecap="round"
//           style={{ transition: 'stroke-dashoffset 0.4s ease-in-out' }}
//         />
//       </svg>

//       {/* Progress label */}
//       <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
//         <span className="text-sm font-bold">{Math.round(safeProgress)}%</span>
//       </div>
//     </div>
//   );
// };

// export default SemicircleProgressChart;








import React from 'react';

interface SemicircleProgressChartProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  filledColor?: string;
  emptyColor?: string;
}

const SemicircleProgressChart: React.FC<SemicircleProgressChartProps> = ({
  progress = 0,
  size = 90,
  strokeWidth = 10,
  filledColor = '#DBD3FD', // Tailwind purple-500
  emptyColor = '#e5e7eb', // Tailwind gray-200
}) => {
  // Safely clamp the progress between 0 and 100
  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));

  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  // Calculate height to show only the top half plus some space for the label
  const halfHeight = size / 2 + strokeWidth / 2;

  return (
    <div className="relative" style={{ width: size, height: halfHeight }}>
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${size} ${halfHeight}`}
      >
        {/* Background semicircle */}
        <path
          d={`
            M ${strokeWidth / 2}, ${size / 2}
            A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}
          `}
          stroke={emptyColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress semicircle */}
        <path
          d={`
            M ${strokeWidth / 2}, ${size / 2}
            A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}
          `}
          stroke={filledColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease-in-out' }}
        />
      </svg>

      {/* Progress label */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
        <span className="text-sm font-bold">{Math.round(safeProgress)}%</span>
      </div>
    </div>
  );
};

export default SemicircleProgressChart;