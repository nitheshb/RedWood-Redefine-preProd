// import React from "react";

// interface FinanceBarChartProps {
//   distributedPercent: number; // e.g., 70
// }

// const FinanceBarChart: React.FC<FinanceBarChartProps> = ({ distributedPercent }) => {
//   const balancePercent = 100 - distributedPercent;

//   return (
//     <div className="space-y-3">
//       {/* Progress Bar */}
//       <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
//         <div
//           className="bg-[#DBD3FD] h-full"
//           style={{ width: `${distributedPercent}%` }}
//         />
//         <div
//           className="bg-gray-300 h-full"
//           style={{ width: `${balancePercent}%` }}
//         />
//       </div>

//       {/* Percent Text */}
//       <div className="flex justify-between text-sm font-medium text-gray-700">
//         <span>{Math.round(distributedPercent)}%</span>
//         <span>{Math.round(balancePercent)}%</span>
//       </div>

//       {/* Legend */}
//       <div className="flex items-center gap-4 mt-4">
//         <div className="flex items-center gap-2">
//           <div className="w-4 h-4 rounded-sm bg-[#DBD3FD]" />
//           <span className="text-sm text-gray-600">Distributed</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-4 h-4 rounded-sm bg-gray-300" />
//           <span className="text-sm text-gray-600">Balance</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FinanceBarChart;












import { BellIcon } from "lucide-react"; 
import React from "react";

const UnitPaymentsWithFinance = ({ selCustomerPayload }) => {
  const totalPaid = Math.round((selCustomerPayload?.T_review || 0) + (selCustomerPayload?.T_approved || 0));
  const totalCost = Math.round(selCustomerPayload?.T_total || 0);
  const paidPercentage = Math.min((totalPaid / totalCost) * 100, 100);
  const remainingPercentage = 100 - paidPercentage;

  const bankDispatch = 22122232000;
  const distributed = 22122232000;
  const balance = 12232000;
  const distributedPercent = (distributed / bankDispatch) * 100;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col lg:flex-row justify-between gap-8">
    
      <div className="w-full lg:w-1/2">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800 text-lg">Unit Payments</span>
          <BellIcon size={18} className="ml-2 text-gray-600" />
        </div>

        <div className="mt-8">
          <div className="text-sm text-gray-500 mb-1">Total Paid</div>
          <div className="text-xl font-bold mb-4 text-gray-800">
            ₹ {totalPaid.toLocaleString('en-IN')}
          </div>

      
          <div className="w-full bg-gray-200 h-6 rounded-full mb-6 overflow-hidden flex">
            <div
              className="bg-[#DBD3FD] h-6"
              style={{ width: `${paidPercentage}%` }}
            />
            <div
              className="bg-gray-300 h-6"
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>

          <div className="text-sm text-gray-500 mb-1">Total Cost</div>
          <div className="text-xl font-bold text-gray-800">
            ₹ {totalCost.toLocaleString('en-IN')}
          </div>
        </div>
      </div>


      <div className="w-full lg:w-1/2">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Finance Balance</h2>

        <div className="space-y-3">

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-300"
              style={{ width: `${distributedPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-700 font-medium mb-2">
            <span>{Math.round(distributedPercent)}%</span>
            <span>{Math.round(100 - distributedPercent)}%</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-purple-300 rounded-sm" />
            <span className="text-sm text-gray-600">Distributed</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-300 rounded-sm" />
            <span className="text-sm text-gray-600">Balance</span>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Bank Dispatch:</span>
              <span className="font-semibold text-gray-800">₹ {bankDispatch.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Distributed:</span>
              <span className="font-semibold text-gray-800">₹ {distributed.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Balance:</span>
              <span className="font-semibold text-gray-800">₹ {balance.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitPaymentsWithFinance;

