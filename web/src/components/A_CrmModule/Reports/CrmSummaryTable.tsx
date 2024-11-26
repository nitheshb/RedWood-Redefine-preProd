/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'



import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";




import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ArrowDown, ArrowUp, ChevronDown, TrendingUp } from 'lucide-react';
import { scaleLinear } from 'd3-scale';








import ReportSideWindow from 'src/components/SiderForm/ReportSideView'

const CrmInventorySummaryTable = ({ projects }) => {
  const [selectedOption, setSelectedOption] = useState('All')
  const [isOpenSideForm, setReportSideForm] = React.useState(false)
  const [isImportLeadsOpen, setisImportLeadsOpen] = React.useState(false)
  const [customerDetails, setCustomerDetails] = React.useState({})
  const [drillDownPayload, setDrillDownPayload] = React.useState([])
  const [subTitle, setSubTitle] = React.useState('false')
  const [selUnitStatus, seTUnitStatus] = React.useState('false')

  const showDrillDownFun = async (text, data, typeA) => {
    // Display sideForm
    setReportSideForm(true)
    setDrillDownPayload(data)
    setSubTitle(text)
    seTUnitStatus(typeA)
  }


  const calculateTotal = (data, key) => {
    return data.reduce((acc, item) => {
      return acc + (item[key] || 0)
    }, 0)
  }


  // const styles = {
  //   customTopShadow: {
  //     boxShadow: `rgba(60, 64, 67, 0.3) 0px -2px 2px 0px, rgba(60, 64, 67, 0.15) 0px -1px 5px 0px`,

  //   },
  // };

  // const styles = {
  //   customTopBottomShadow: {
  //     boxShadow: `
  //       rgba(60, 64, 67, 0.3) 0px -2px 2px 0px,
  //       rgba(60, 64, 67, 0.15) 0px -1px 5px 0px,
  //       rgba(60, 64, 67, 0.3) 0px 2px 2px 0px,
  //       rgba(60, 64, 67, 0.15) 0px 1px 5px 0px
  //     `,
  //   },
  // };




  const styles = {
    customTopBottomShadow: {
      boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
    }


  };





  const data = [
    { name: 'Project 1', value: 100, metric: 'units', count: 10 },
    { name: 'Project 2', value: 80, metric: 'sessions', count: 8 },
    { name: 'Project 3', value: 60, metric: 'sessions', count: 612 },
    { name: 'Project 3', value: 60, metric: 'sessions', count: 612 },
    { name: 'Project 3', value: 60, metric: 'sessions', count: 612 }
  ];

  const CustomizedLabel = (props) => {
    const { x, y, width, value, index } = props;
    const item = data[index];
    return (
      <text 
        x={x + width + 10} 
        y={y + 15} 
        fill="#000000" 
        fontSize={14}
        dominantBaseline="middle"
      >
        {`${item.count} ${item.metric}`}
      </text>
    );
  };
















  
  
    // const CustomTooltip = ({ active, payload }) => {
    //   if (active && payload && payload.length) {
    //     return (
    //       <div className="bg-white p-2 shadow-lg rounded-md border">
    //         <p className="text-sm">{`${payload[0].payload.label}`}</p>
    //       </div>
    //     );
    //   }
    //   return null;
    // };




  const totalUnitsSummary = calculateTotal(projects, 'totalUnitCount')
  const totalAvailableSummary = calculateTotal(projects, 'availableCount')
  const totalSoldSummary = calculateTotal(projects, 'soldUnitCount')
  const totalBlockedSummary = calculateTotal(projects, 'blockedUnitCount')
  const totalMortgagedSummary = calculateTotal(projects, 'mortgaged')

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }





  


  const timeSeriesData = [
    { time: '12', value: 5, prevValue: 5 },
    { time: '13', value: 5, prevValue: 5 },
    { time: '14', value: 20, prevValue: 5 },
    { time: '15', value: 5, prevValue: 5 },
    { time: '16', value: 5, prevValue: 5 },
    { time: '17', value: 90, prevValue: 30 },
    { time: '18', value: 5, prevValue: 5 },
  ];

  const channelData = [
    { name: 'Make an offer', value1: 80, value2: 120, value3: 0 },
    { name: 'Online store', value1: 20, value2: 0, value3: 0 },
  ];

  const customScale = scaleLinear()
    .domain([5, 10, 50, 100])
    .range([0, 50, 75, 100]);

    const [isOpen, setIsOpen] = useState(false);
   // const [selectedOption, setSelectedOption] = useState("");
  
    const options = [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
      { label: "Option 3", value: "option3" },
    ];
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleOptionClick = (option) => {
      setSelectedOption(option.label); 
      setIsOpen(false); 
    };






    // const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // const sortData = (data) => {
    //   if (!sortConfig.key) return data;
    //   return [...data].sort((a, b) => {
    //     if (a[sortConfig.key] < b[sortConfig.key]) {
    //       return sortConfig.direction === "asc" ? -1 : 1;
    //     }
    //     if (a[sortConfig.key] > b[sortConfig.key]) {
    //       return sortConfig.direction === "asc" ? 1 : -1;
    //     }
    //     return 0;
    //   });
    // };
  
    // const handleSort = (key) => {
    //   let direction = "asc";
    //   if (sortConfig.key === key && sortConfig.direction === "asc") {
    //     direction = "desc";
    //   }
    //   setSortConfig({ key, direction });
    // };
  
    // const sortedProjects = sortData(projects);
  




    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const sortData = (data) => {
      if (!sortConfig.key) return data;
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    };
    
    const handleSort = (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    };
    
    const sortedProjects = sortData(projects);
    



  
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const time = payload[0].payload.time; 

    return (
      <div className="bg-white p-3 rounded-md">
        <p className="text-black">Time: {time}</p>

        {payload.map((entry, index) => {
          const { value, prevValue } = entry.payload; 
          const strokeColor = entry.stroke; 

      
          return (
            <div key={index} className="flex items-center gap-2">
            
              <div
                style={{ backgroundColor: strokeColor }}
                className="w-4 h-4 "
              ></div>
          
              <p className="text-black">
                {entry.dataKey === "value"
                  ? `Current Value: ${value}`
                  : entry.dataKey === "prevValue"
                  ? `Previous Value: ${prevValue}`
                  : null}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
 

















  return (
    <div className="bg-white   ">
      {/* <div className="overflow-x-auto m-4 border shadow-xl rounded-2xlborder shadow-xl rounded-2xl">
        <div className="">
          <div className="flex justify-between mb-4 mt-2">
            <div>
              <p className="font-bold text-black p-1 m-1">
                CRM Inventory Report box
              </p>
            </div>

            <select
              className="mr-2"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="All">Project Name</option>
              <option value="Unit Type">Unit Type</option>
              <option value="Unit Facing">Unit Facing</option>
              <option value="Unit Status">Unit Status</option>
              <option value="Unit Area">Unit Area</option>
            </select>
          </div>

          <div className="rounded-2xl shadow-lg m-3 pb-3 overflow-x-auto">
            <table className=" border-collapse">
              <thead>
                <tr className="bg-[#fff] text-gray-900   text-sm leading-normal">
                  <th
                    className="py-2 px-2 text-center border bg-[#F5F5F7]  border-gray-100"
                    colSpan="6"
                  >
                    Inventory Summary Report By Project
                  </th>
                </tr>
                <tr className="bg-[#AFC7FF] text-gray-900   text-sm leading-normal"
                >
                  <th className="py-2 px-3 text-left border border-[#a3baf0]">
                    Project Name
                  </th>
                  <th
                    className="py-1 px-3 text-left border border-[#a3baf0]"
                    colSpan="1"
                  >
                    Total Units
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-[#a3baf0]"
                    colSpan="1"
                  >
                    Available
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-[#a3baf0]"
                    colSpan="1"
                  >
                    Sold
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-[#a3baf0]"
                    colSpan="1"
                  >
                    Blocked
                  </th>
                  <th
                    className="py-1 px-3 text-center border border-[#a3baf0]"
                    colSpan="1"
                  >
                    Mortgaged
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-900 text-sm font-light">
                {projects.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100 text-[#33393d] font-[400]">
                    <td
                      className="py-1 px-3 text-left border border-gray-100 text-black cursor-pointer "
                      onClick={() => {
                        showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                          'available',
                          'booked',
                          'blockedUnitCount',
                          'blocked',
                          'management_blocked',
                        ])
                      }}
                    >
                      {item.projectName}
                    </td>
                    <td
                      className="py- px-6 text-right border border-gray-100 text-black cursor-pointer "
                      onClick={() => {
                        showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                          'available',
                          'booked',
                          'blockedUnitCount',
                          'blocked',
                          'management_blocked',
                        ])
                      }}
                    >
                      {item.totalUnitCount}
                    </td>
                    <td
                      className="py- px-6 text-right border border-gray-100 text-black cursor-pointer "
                      onClick={() => {
                        showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                          'available',

                        ])
                      }}
                    >
                      {item.availableCount}
                    </td>
                    <td
                      className="py- px-6 text-right border border-gray-100 text-black cursor-pointer "
                      onClick={() => {
                        showDrillDownFun(`Total ${item?.stausTitle}`, item, [

                          'booked',
                          'allotment',
                          'agreement_pipeline',
                          'agreement',
                          'registered',
                          'construction',
                          'possession'

                        ])
                      }}
                    >
                      {item.soldUnitCount}
                    </td>
                    <td
                      className="py- px-6 text-right border border-gray-100 text-black cursor-pointer hover:underline-offset-4"
                      onClick={() => {
                        showDrillDownFun(`Total ${item?.stausTitle}`, item, [

                          'blockedUnitCount',
                          'blocked',
                          'management_blocked',
                        ])
                      }}
                    >
                      {item?.blockedUnitCount ||
                        0 + item.management_blocked ||
                        0}
                    </td>
                    <td className="py- px-6 text-right border border-gray-100 font-semibold">
                      {item.mortgaged}
                    </td>
                  </tr>
                ))}
                <tr className="bg-white text-gray-900  text-sm leading-normal text-[#33393d] font-[400] pb-2 mb-2">
                  <td className="py-1 px-3 text-left border border-gray-100">
                    Totals:
                  </td>
                  <td className="py- px-6 text-right border border-gray-100">
                    {totalUnitsSummary}
                  </td>
                  <td className="py- px-6 text-right border border-gray-100">
                    {totalAvailableSummary}
                  </td>
                  <td className="py- px-6 text-right border border-gray-100">
                    {totalSoldSummary}
                  </td>
                  <td className="py- px-6 text-right border border-gray-100">
                    {totalBlockedSummary}
                  </td>
                  <td className="py- px-6 text-right border border-gray-100">
                    {totalMortgagedSummary}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div> */}







      
<div className='max-w-7xl mx-auto mt-6'>
<div className="grid grid-cols-4 gap-6 mb-8">
  <div className="bg-white rounded-xl p-6  shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Sold Units</h3>
    <p className="text-2xl font-bold mb-2"></p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">157 Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md ">
    <h3 className="text-gray-600 mb-2">Sales</h3>
    <p className="text-2xl font-bold mb-2">₹ </p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500"> Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Balance</h3>
    <p className="text-2xl font-bold mb-2">₹ </p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500"> Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Recieved</h3>
    <p className="text-2xl font-bold mb-2">₹</p>
    <div className="flex items-center gap-2 text-red-500">
      {/* <ArrowDownRight size={20} /> */}
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">Units</span>
    </div>
  </div>
</div>
</div>
















<div className="max-w-7xl mx-auto mt-6 mb-4">



        <div className="grid grid-cols-2 gap-6 h-full items-end">
      
          <div className="flex flex-col rounded-lg py-5 h-full bg-white shadow">
            <div className="pt-6 px-4">
              <h2 className="text-[#000000] text-[19px] ml-4">Booking Trend</h2>
              <div className="flex items-center gap-3 mt-4 mb-4 ml-4">
                <span className="text-[30px] text-[#000000] font-semibold">&#8377; 387.75</span>
                <div className="flex items-center text-[#00A236]">
                  <TrendingUp className="w-5 h-5 mx-3" />
                  <span className="text-[18px]">23%</span>
                </div>
              </div>
            </div>
            <div className="h-96 px-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 0, right: 30, bottom: 0, left: 0 }}>
                  <CartesianGrid vertical={false} stroke="#CCCCCC" />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    stroke="#3D3D3D"
                    tick={{ dy: 10 }}
                    interval={0}
                  />
                  <YAxis
                    domain={[5, 100]}
                    ticks={[5, 25, 50, 75, 100]}
                    axisLine={false}
                    tickLine={false}
                    stroke="#3D3D3D"
                  />


             
                  {/* <Tooltip contentStyle={{ backgroundColor: '#333333', color: 'white' }} /> */}


                  <Tooltip content={<CustomTooltip />} />


                  <Line
                    type="monotone"
                    dataKey="prevValue"
                    stroke="#CCCCCC"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        
          <div className="flex flex-col rounded-lg py-5 h-full bg-white shadow">
            <div className="pt-6 px-4 flex flex-col h-full">
              <h2 className="text-[#000000] mb-4 ml-5">Top 5 Channels</h2>
              <div className="h-72 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelData} margin={{ top: 0, right: 30, bottom: 0, left: 0 }} barGap={0}>
                    <CartesianGrid vertical={false} stroke="#CCCCCC" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#3D3D3D" />
                    <YAxis domain={[0, 'dataMax']} ticks={[10, 50, 100, 150]} axisLine={false} tickLine={false} stroke="#3D3D3D" />




                    <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md text-sm text-gray-700 min-w-[150px]">
                    <p className="font-bold text-blue-500 mb-2">{label}</p>
                    {payload.map((item, index) => (
                      <div key={index} className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          {/* Color Block */}
                          <span
                            className="w-3 h-3  mr-2"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="font-semibold">₹{new Intl.NumberFormat().format(item.value)}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />







                    <Bar dataKey="value1" fill="#29AAE3" radius={[4, 4, 0, 0]} barSize={70} />
                    <Bar dataKey="value2" fill="#87CDEE" radius={[4, 4, 0, 0]} barSize={70} />
                    <Bar dataKey="value3" fill="#29AAE3" radius={[4, 4, 0, 0]} barSize={70} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>















<div className="bg-white p-4 w-full max-w-7xl mx-auto shadow-md rounded-md">



  
<div className="p-4 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-800">CRM Inventory Report</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-gray-600">
          Project Name
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full bg-white rounded-t-[30px] overflow-hidden">
        <div className="bg-[#E0E4EB] p-4 rounded-t-[30px]">
          <h2 className="text-lg text-center font-medium text-[#000000]" >
            Inventory Summary Report By Project
          </h2>
        </div>
        <div>











{/* liked one */}
{/* <div className="overflow-x-auto">
  <table className="w-full border-collapse overflow-hidden">
    <thead>
      <tr className="bg-[#F0F2F5] border-t border-b border-[#E8ECF4]">
        {["projectName", "totalUnit", "available", "soldUnit", "blockedUnit", "mortgaged"].map((key) => (
          <th
            key={key}
            className="text-left p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4] cursor-pointer"
            onClick={() => handleSort(key)}
            style={{ minWidth: "150px" }} 
          >
            <div className="flex items-center justify-between">
              <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
            
              <span className="ml-2">
                {sortConfig.key === key && (
                  sortConfig.direction === "asc" ? 
                    <ArrowUp className="text-blue-500" /> : 
                    <ArrowDown className="text-blue-500" />
                )}
              </span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {sortedProjects.map((item, index) => (
        <tr key={index} className="hover:bg-gray-50 border-b border-[#E8ECF4]">
          <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{item.projectName}</td>
          <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{item.totalUnitCount}</td>
          <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{item.availableCount}</td>
          <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{item.soldUnitCount}</td>
          <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{item.blockedUnitCount || 0}</td>
          <td className="p-4 text-gray-700">{item.mortgaged}</td>
        </tr>
      ))}
      <tr className="hover:bg-gray-50 border-b border-[#E8ECF4]">
        <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">Totals:</td>
        <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{totalUnitsSummary}</td>
        <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{totalAvailableSummary}</td>
        <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{totalSoldSummary}</td>
        <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{totalBlockedSummary}</td>
        <td className="p-4 text-gray-700 border-[#E8ECF4]">{totalMortgagedSummary}</td>
      </tr>
    </tbody>
  </table>
</div> */}



<div className="overflow-x-auto">
  <table className="w-full border-collapse overflow-hidden">
    <thead>
      <tr className="bg-[#F0F2F5] border-t border-b border-[#E8ECF4]">
        {["projectName", "totalUnit", "available", "soldUnit", "blockedUnit", "mortgaged"].map((key) => (
          <th
            key={key}
            className="text-left p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4] cursor-pointer relative"
            onClick={() => handleSort(key)}
          >
            <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {sortConfig.key === key && (
                sortConfig.direction === "asc" ? 
                  <ArrowUp className="text-gray-500" /> : 
                  <ArrowDown className="text-gray-500" />
              )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {sortedProjects.map((item, index) => (
        <tr key={index} className="hover:bg-gray-50 border-b border-[#E8ECF4]">
          <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{item.projectName}</td>
          <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{item.totalUnitCount}</td>
          <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{item.availableCount}</td>
          <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{item.soldUnitCount}</td>
          <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{item.blockedUnitCount || 0}</td>
          <td className="p-4 text-gray-700">{item.mortgaged}</td>
        </tr>
      ))}
      <tr className="hover:bg-gray-50 border-b border-[#E8ECF4]">
        <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">Totals:</td>
        <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{totalUnitsSummary}</td>
        <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{totalAvailableSummary}</td>
        <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{totalSoldSummary}</td>
        <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{totalBlockedSummary}</td>
        <td className="p-4 text-gray-700 border-[#E8ECF4]">{totalMortgagedSummary}</td>
      </tr>
    </tbody>
  </table>
</div>










{/* 
<TableContainer component={Paper} className="overflow-x-auto">
      <Table className="w-full border-collapse overflow-hidden">
        <TableHead>
          <TableRow className="bg-[#F0F2F5] border-t border-b border-[#E8ECF4]">
            {[
              { key: "projectName", label: "Project Name" },
              { key: "totalUnitCount", label: "Total Units" },
              { key: "availableCount", label: "Available" },
              { key: "soldUnitCount", label: "Sold" },
              { key: "blockedUnitCount", label: "Blocked" },
              { key: "mortgaged", label: "Mortgaged" },
            ].map((column) => (
              <TableCell
                key={column.key}
                onClick={() => handleSort(column.key)}
                className="text-left p-1 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4] cursor-pointer"
              >
                {column.label}
                {sortConfig.key === column.key &&
                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedProjects.map((item, index) => (
            <TableRow
              key={index}
              className="hover:bg-gray-50 border-b border-[#E8ECF4]"
            >
              <TableCell className="p-4 text-gray-700 border-r border-[#E8ECF4]">
                {item.projectName}
              </TableCell>
              <TableCell className="p-4 text-gray-700 border-r border-[#E8ECF4]">
                {item.totalUnitCount}
              </TableCell>
              <TableCell className="p-4 text-gray-700 border-r border-[#E8ECF4]">
                {item.availableCount}
              </TableCell>
              <TableCell className="p-4 text-gray-700 border-r border-[#E8ECF4]">
                {item.soldUnitCount}
              </TableCell>
              <TableCell className="p-4 text-gray-700 border-r border-[#E8ECF4]">
                {item.blockedUnitCount + item.management_blocked}
              </TableCell>
              <TableCell className="p-4 text-gray-700">
                {item.mortgaged}
              </TableCell>
            </TableRow>
          ))}

          <TableRow className="hover:bg-gray-50 border-b border-[#E8ECF4]">
            <TableCell className="p-4 text-gray-700 border-r border-[#E8ECF4]">
              Totals:
            </TableCell>
            <TableCell className="p-4 text-gray-700 border-r border-[#E8ECF4]">
              {projects.reduce((sum, item) => sum + item.totalUnitCount, 0)}
            </TableCell>
            <TableCell className="p-4 text-gray-700 border-r border-[#E8ECF4]">
              {projects.reduce((sum, item) => sum + item.availableCount, 0)}
            </TableCell>
            <TableCell className="p-4 text-gray-700 border-r border-[#E8ECF4]">
              {projects.reduce((sum, item) => sum + item.soldUnitCount, 0)}
            </TableCell>
            <TableCell className="p-4 text-gray-700 border-r border-[#E8ECF4]">
              {projects.reduce(
                (sum, item) => sum + item.blockedUnitCount + item.management_blocked,
                0
              )}
            </TableCell>
            <TableCell className="p-4 text-gray-700">
              {projects.reduce((sum, item) => sum + item.mortgaged, 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer> */}



        </div>
      </div>
    </div>


</div>




















      <ReportSideWindow
        open={isOpenSideForm}
        setOpen={setReportSideForm}
        title="Unit Inventory"
        subtitle={subTitle}
        setCustomerDetails={setCustomerDetails}
        setisImportLeadsOpen={setisImportLeadsOpen}
        leadsLogsPayload={drillDownPayload}
        widthClass="max-w-7xl"
        unitsViewMode={undefined}
        setIsClicked={undefined}
        selUnitStatus={selUnitStatus}
      />
    </div>
  )

}



export default CrmInventorySummaryTable
