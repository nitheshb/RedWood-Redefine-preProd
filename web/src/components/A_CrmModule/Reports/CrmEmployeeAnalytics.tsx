import React, { useState } from 'react';

const CrmEmployeeAnalytics = () => {
  const dummyData = [
    {
      id: 1,
      employeeName: 'Alice Johnson',
      units: 40,
      target: 15000,
      collected: 10500,
      backlog: 4500,
      quarter: 'Q2',
      monthly: 'April',
      week: 'Week 15'
    },
    {
      id: 2,
      employeeName: 'Bob Smith',
      units: 90,
      target: 12000,
      collected: 8000,
      backlog: 4000,
      quarter: 'Q2',
      monthly: 'April',
      week: 'Week 15'
    },
    {
      id: 3,
      employeeName: 'Charlie Davis',
      units: 56,
      target: 20000,
      collected: 18000,
      backlog: 2000,
      quarter: 'Q2',
      monthly: 'April',
      week: 'Week 15'
    },
    {
      id: 4,
      employeeName: 'David Lee',
      units: 150,
      target: 18000,
      collected: 15000,
      backlog: 3000,
      quarter: 'Q2',
      monthly: 'April',
      week: 'Week 15'
    },
    {
      id: 5,
      employeeName: 'Emily Wang',
      units: 80,
      target: 22000,
      collected: 19000,
      backlog: 3000,
      quarter: 'Q2',
      monthly: 'April',
      week: 'Week 15'
    },
    {
      id: 6,
      employeeName: 'Franklin Rodriguez',
      units: 110,
      target: 14000,
      collected: 10000,
      backlog: 4000,
      quarter: 'Q2',
      monthly: 'April',
      week: 'Week 15'
    },
  ];

  const [employees, setEmployees] = useState(dummyData);
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  
  const sortedEmployees = employees.sort((a, b) => b.units - a.units);

  const top3Employees = sortedEmployees.slice(0, 3);

  const maxUnits = Math.max(...employees.map(e => e.units));
  
  const getBarHeight = (units, maxHeight) => `${(units / maxUnits) * maxHeight}px`;

  
  const getColorForHeight = () => {
    return '#DDDDDD'; 
  };


  const barWidth = '110px'; 

  const maxHeight = 400;

  const tableWidth = '80%'; 



  return (
    <div className="container bg-white rounded-lg p-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Top Performing Employee</h2>
        <div className="flex justify-center items-end space-x-2 bg-[#fff] shadow-sm rounded-lg p-4" style={{ maxHeight: `${maxHeight}px`, width: '27%' }}>
          {top3Employees.map((employee, index) => (
            <div key={employee.id} className="flex flex-col items-center">
              <div
                className="rounded-lg text-center text-black px-2 py-1"
                style={{
                  height: getBarHeight(employee.units, 300),
                  width: barWidth,
                  backgroundColor: getColorForHeight()
                }}
              >
                {employee.units}
              </div>
              <span className="text-sm mt-2">{employee.employeeName}</span>
            </div>
          ))}
        </div>
      </div>



      <div className=''  style={{ width: tableWidth }}>


        
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Employee Performance Summary</h2>
        <div className="flex items-center">
          <label className="text-lg mr-2">Search:</label>
          <input
            type="text"
            placeholder="Search employees..."
            value={filter}
            onChange={handleFilterChange}
            className="border p-2"
          />
        </div>
      </div>

      <div className="shadow-md bg-white rounded-lg">
        <table className="text-sm text-left text-black dark:text-gray-400 w-full">
          <thead className="text-sm  text-black bg-gray-200">
            <tr>
              <th scope="col" className="py-3 px-6">
                Employee name
              </th>
              <th scope="col" className="py-3 text-right px-6">
                No of units/projects
              </th>
              <th scope="col" className="py-3 text-right px-6">
                Target amount
              </th>
              <th scope="col" className="py-3 text-right px-6">
                Collected amount
              </th>
              <th scope="col" className="py-3 text-right px-6">
                Backlog
              </th>
              <th scope="col" className="py-3  text-right px-6">
                Quarter
              </th>
              <th scope="col" className="py-3 px-6">
                Monthly
              </th>
              <th scope="col" className="py-3 px-6">
                Week
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees
              .filter(employee => employee.employeeName.toLowerCase().includes(filter.toLowerCase()))
              .map((item, index) => (
                <tr key={index} className="bg-white border-b">
                  <td className="py-4 px-6 text-black">{item.employeeName}</td>
                  <td className="py-4 px-6 text-right text-black">{item.units}</td>
                  <td className="py-4 px-6 text-right text-black">${item.target.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right text-black">${item.collected.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right text-black">${item.backlog.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right text-black">{item.quarter}</td>
                  <td className="py-4 px-6 text-black">{item.monthly}</td>
                  <td className="py-4 px-6 text-black">{item.week}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>




      </div>

     


    </div>
  );
};



export default CrmEmployeeAnalytics