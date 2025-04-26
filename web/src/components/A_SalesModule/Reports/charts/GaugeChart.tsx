// import React from 'react';
// import { PieChart, Pie, Cell } from 'recharts';

// const GaugeChart = ({ value = 50 }) => {
//   // Data for the gauge - active, inactive, and transparent segments
//   const data = [
//     { name: 'Active', value: value, color: '#8884d8' },
//     { name: 'Inactive', value: 100 - value, color: '#eee' },
//     { name: 'Transparent', value: 100, color: 'transparent' }
//   ];

//   // Data for the dotted indicators
//   const indicators = Array.from({ length: 11 }, (_, i) => i * 10);

//   return (
//     <div style={{ position: 'relative', width: '100%', maxWidth: '300px', margin: '0 auto' }}>
//       {/* Main Pie Chart for the gauge */}
//       <PieChart width={300} height={200}>
//         {/* Dotted indicators along the arc */}
//         <g>
//           {indicators.map((val, index) => {
//             const angle = 180 - (val * 1.8); // Convert percentage to angle (0-180°)
//             const radian = (angle * Math.PI) / 180;
//             const x = 150 + 120 * Math.cos(radian);
//             const y = 200 - 120 * Math.sin(radian);

//             return (
//               <circle
//                 key={`indicator-${index}`}
//                 cx={x}
//                 cy={y}
//                 r={2}
//                 fill="#999"
//               />
//             );
//           })}
//         </g>

//         {/* Gauge segments */}
//         <Pie
//           data={data}
//           cx={150}
//           cy={200}
//           startAngle={180}
//           endAngle={0}
//           innerRadius={80}
//           outerRadius={120}
//           paddingAngle={0}
//           dataKey="value"
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={entry.color} />
//           ))}
//         </Pie>
//       </PieChart>

//       {/* Percentage text in center */}
//       <div style={{
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         textAlign: 'center',
//         fontSize: '2rem',
//         fontWeight: 'bold',
//         color: '#8884d8'
//       }}>
//         {value}%
//       </div>
//     </div>
//   );
// };

// export default GaugeChart;

import React from 'react'
import { PieChart, Pie, Cell } from 'recharts'

const HalfSemiCircleGauge = ({ value = 75, max = 100 }) => {
  const remaining = max - value

  const data = [
    { name: 'Active', value, color: '#8884d8' },
    { name: 'Inactive', value: remaining, color: '#f0f0f0' },
    { name: 'Hidden', value: max, color: 'transparent' },
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '300px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <PieChart width={300} height={150}>
        <Pie
          data={data}
          cx="50%"
          cy="100%"
          startAngle={180}
          endAngle={0}
          innerRadius={80}
          outerRadius={120}
          paddingAngle={0}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>

      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#8884d8',
        }}
      >
        {value}%
      </div>
    </div>
  )
}

export default HalfSemiCircleGauge
