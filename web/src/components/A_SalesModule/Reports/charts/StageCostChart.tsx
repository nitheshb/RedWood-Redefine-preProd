// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// const StageCostChart = () => {
//   const data = [
//     { name: 'Paid', value: 22122232000 },
//     { name: 'Balance', value: 12232000 },
//   ];

//   const COLORS = ['#10B981', '#3B82F6'];

//   const formatCurrency = (value) => {
//     // Format as Indian currency with commas
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(value).replace('₹', '₹ ');
//   };

//   const totalCost = data.reduce((sum, item) => sum + item.value, 0);

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">Stage Cost Breakdown</h2>
      
//       <div className="flex flex-col md:flex-row items-center">
//         <div className="w-full md:w-1/2 h-64 mb-4 md:mb-0">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={data}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 paddingAngle={5}
//                 dataKey="value"
//                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="w-full md:w-1/2 pl-0 md:pl-6">
//           <div className="mb-4">
//             <h3 className="text-lg font-medium text-gray-700">Stage Cost:</h3>
//             <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
//           </div>

//           <div className="mb-4">
//             <h3 className="text-lg font-medium text-gray-700">Paid:</h3>
//             <p className="text-xl text-green-600">{formatCurrency(data[0].value)}</p>
//           </div>

//           <div>
//             <h3 className="text-lg font-medium text-gray-700">Balance:</h3>
//             <p className="text-xl text-blue-600">{formatCurrency(data[1].value)}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StageCostChart;





import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const GaugeChart = ({ value = 50 }) => {
  // Data for the gauge - active, inactive, and transparent segments
  const data = [
    { name: 'Active', value: value, color: '#8884d8' },
    { name: 'Inactive', value: 100 - value, color: '#eee' },
    { name: 'Transparent', value: 100, color: 'transparent' }
  ];

  // Data for the dotted indicators
  const indicators = Array.from({ length: 11 }, (_, i) => i * 10);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '300px', margin: '0 auto' }}>
      {/* Main Pie Chart for the gauge */}
      <PieChart width={300} height={200}>
        {/* Dotted indicators along the arc */}
        <g>
          {indicators.map((val, index) => {
            const angle = 180 - (val * 1.8); // Convert percentage to angle (0-180°)
            const radian = (angle * Math.PI) / 180;
            const x = 150 + 120 * Math.cos(radian);
            const y = 200 - 120 * Math.sin(radian);
            
            return (
              <circle
                key={`indicator-${index}`}
                cx={x}
                cy={y}
                r={2}
                fill="#999"
              />
            );
          })}
        </g>
        
        {/* Gauge segments */}
        <Pie
          data={data}
          cx={150}
          cy={200}
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
      
      {/* Percentage text in center */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#8884d8'
      }}>
        {value}%
      </div>
    </div>
  );
};

export default GaugeChart;