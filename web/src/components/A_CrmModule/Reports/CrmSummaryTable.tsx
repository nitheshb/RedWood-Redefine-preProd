/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react'
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
import { ArrowUpDown, Calendar, ChevronDown, ChevronRight, MoveDown, MoveUp, TrendingUp } from 'lucide-react';
import { scaleLinear } from 'd3-scale';
import ReportSideWindow from 'src/components/SiderForm/ReportSideView'
import { getAllProjects, getBookedUnitsByProject } from 'src/context/dbQueryFirebase';
import { useAuth } from 'src/context/firebase-auth-context';

const CrmInventorySummaryTable = ({ projects }) => {
  const { user } = useAuth()
  const { orgId, access, projAccessA } = user
  const [selectedOption, setSelectedOption] = useState('All')
  const [isOpenSideForm, setReportSideForm] = React.useState(false)
  const [isImportLeadsOpen, setisImportLeadsOpen] = React.useState(false)
  const [customerDetails, setCustomerDetails] = React.useState({})
  const [drillDownPayload, setDrillDownPayload] = React.useState([])
  const [subTitle, setSubTitle] = React.useState('false')
  const [projectList, setprojectList] = useState([])
  const [unitsFetchData, setUnitsFetchData] = useState([])
  const [leadsFetchedData, setLeadsFetchedData] = useState([])

  const [selUnitStatus, seTUnitStatus] = React.useState('false')
  const [tableData, setTableData] = useState([])

  const [projectBookingsData, setProjectBookingsData] = useState([
    { time: 'Jan', value: 0, prevValue: 7 },
    { time: 'Feb', value: 0, prevValue: 7 },
    { time: 'Mar', value: 0, prevValue: 7 },
    { time: 'Apr', value: 0, prevValue: 7 },
    { time: 'Jun', value: 0, prevValue: 7 },
    { time: 'July', value: 0, prevValue: 5 },
    { time: 'Aug', value: 0, prevValue: 5 },
    { time: 'Sep', value: 0, prevValue: 7 },
    { time: 'Oct', value: 0, prevValue: 7 },
    { time: 'Nov', value: 0, prevValue: 7 },
    { time: 'Dec', value: 0, prevValue: 7 },]);

  const showDrillDownFun = async (text, data, typeA) => {
    setReportSideForm(true)
    setDrillDownPayload(data)
    setSubTitle(text)
    seTUnitStatus(typeA)
  }
  useEffect(() => {
    getProjectsListFun()
  }, [])

  useEffect(() => {
    boot()
  }, [projectList])
  const getProjectsListFun = () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.projectName
        })
        console.log('fetched proejcts list is', projectsListA)
        const z = [...projectsListA]
        setprojectList(z)
      },
      (error) => setprojectList([])
    )
    return unsubscribe
  }
  useEffect(() => {
    setLeadsFetchedData(tableData)
  }, [tableData])
  const calculateTotal = (data, key) => {
    return data.reduce((acc, item) => {
      return acc + (item[key] || 0)
    }, 0)
  }
  const boot = async () => {
    // await getProjectsListFun()
    const unsubscribe = await getBookedUnitsByProject(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          const y = projectList.filter((proj) => proj?.uid == x?.pId)
          console.log(',my prject sel is  ===> ', projectList)
          if (y.length > 0) {
            console.log(',my prject sel is ', y)
            x.projName = y[0].projectName
          }
          return x
        })
        // setBoardData
        // console.log('my Array data is ', usersListA, crmCustomersDBData)
        // await serealizeData(usersListA)
        console.log('booking details values are', usersListA)
        await setUnitsFetchData(usersListA)
        await updateBookingData(usersListA)

      },
      {
        status: [
          'booked',
          'Booked',
          'agreement_pipeline',
          'ATS',
          'sd_pipeline',
          'Registered',
          'agreement',
          'registered',
          'construction',
          'possession',
        ],
      },
      () => setTableData([])
    )
    return unsubscribe
  }
  function updateBookingData(myDbDataIs) {
    // Month mapping for easy lookup
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "July", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    myDbDataIs.forEach(record => {
      // Convert the timestamp to a Date object
      const date = new Date(record.Date);
      // Get the month name
      const month = monthNames[date.getUTCMonth()];
      // Find the corresponding month in projectBookingsData
      const booking = projectBookingsData.find(entry => entry.time === month);
      if (booking) {
        booking.value += 1; // Increment the value
      }
    });
    setProjectBookingsData(projectBookingsData)
    console.log('booking details values are',projectBookingsData )
    return projectBookingsData;
  }




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





















  const totalUnitsSummary = calculateTotal(projects, 'totalUnitCount')
  const totalAvailableSummary = calculateTotal(projects, 'availableCount')
  const totalSoldSummary = calculateTotal(projects, 'soldUnitCount')
  const totalBlockedSummary = calculateTotal(projects, 'blockedUnitCount')
  const totalMortgagedSummary = calculateTotal(projects, 'mortgaged')

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }










  const channelData = [
    { name: 'Make an offer', value1: 80, value2: 120, value3: 0 },
    { name: 'Online store', value1: 20, value2: 0, value3: 0 },
  ];












const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

const sortedProjects = React.useMemo(() => {
  if (!sortConfig.key) return projects;

  return [...projects].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
}, [projects, sortConfig]);

const handleSort = (key) => {
  setSortConfig((prev) => ({
    key,
    direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
  }));
};

















  return (
    <div className="bg-white ">

<div className='max-w-7xl mx-auto mt-4'>
<div className="grid grid-cols-4 gap-6 mb-8">
  <div className="bg-white rounded-xl p-6  shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Sold Units</h3>
    <p className="text-2xl font-bold mb-2">0</p>
    <div className="flex items-center gap-2 text-red-500">
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">157 Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md ">
    <h3 className="text-gray-600 mb-2">Sales</h3>
    <p className="text-2xl font-bold mb-2">₹ </p>
    <div className="flex items-center gap-2 text-red-500">
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500"> Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Balance</h3>
    <p className="text-2xl font-bold mb-2">₹ </p>
    <div className="flex items-center gap-2 text-red-500">
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500"> Units</span>
    </div>
  </div>
  <div className="bg-white rounded-xl p-6 shadow-inner drop-shadow-md">
    <h3 className="text-gray-600 mb-2">Recieved</h3>
    <p className="text-2xl font-bold mb-2">₹</p>
    <div className="flex items-center gap-2 text-red-500">
      <svg className="fill-current inline-block overflow-visible w-4 h-4 font-semibold text-orange-600" name="arrow-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.006 16.465V5.286a.968.968 0 0 0-.287-.713.967.967 0 0 0-.713-.287.967.967 0 0 0-.712.287.968.968 0 0 0-.287.713v11.179l-4.9-4.902a.916.916 0 0 0-.7-.288c-.266.009-.5.113-.7.313-.182.2-.278.434-.287.7-.008.267.088.5.288.7l6.599 6.603c.1.1.208.17.325.212.116.042.241.063.374.063.134 0 .259-.021.375-.063a.877.877 0 0 0 .325-.212l6.599-6.603a.933.933 0 0 0 .275-.687 1.02 1.02 0 0 0-.275-.713c-.2-.2-.437-.3-.712-.3-.275 0-.513.1-.713.3l-4.874 4.877Z"></path></svg>
      <span>50%</span>
      <span className="text-gray-500">Units</span>
    </div>
  </div>
</div>
</div>
















<div className="max-w-7xl mx-auto mt-6 mb-4">



        <div className="grid grid-cols-2 gap-6 h-full items-end">

          <div className="flex flex-col rounded-[30px] py-5 h-full bg-white shadow">
            <div className="pt-6 px-4">
              <h2 className="text-[#000000] text-[19px] ml-4">Bookings Trend</h2>
              <div className="flex items-center gap-3 mt-4 mb-4 ml-4">
                <span className="text-[30px] text-[#000000] font-semibold">{unitsFetchData?.length?.toLocaleString('en-IN')}</span>
                <div className="flex items-center text-[#00A236]">
                  <TrendingUp className="w-5 h-5 mx-3" />
                  <span className="text-[18px]">23%</span>
                </div>
              </div>
            </div>

            <div className="flex ml-8  py-2 mb-4 gap-2 text-gray-600">
      <Calendar className="w-5 h-5" />
      <span>Jun 07, 2024</span>
      <ChevronRight className="w-5 h-5" />
      <i data-lucide="arrow-right"></i>
      <span>Jun 13, 2024</span>
    </div>




    <div className="flex ml-7 gap-4 mb-6 flex-row">


<button className="flex items-center px-6 py-2 rounded-lg bg-gray-100 text-sm text-gray-600 relative">
          <div className="flex items-center pl-3">
            <div className="w-7 h-[2px] bg-[#29AAE3] mr-2"></div>
            Nov 18, 2024
          </div>
        </button>
        <button className="flex items-center px-6 py-2 rounded-lg bg-gray-100 text-sm text-gray-600 relative">
          <div className="flex items-center pl-3">
            <div className="w-7 h-[2px] border-t-4 font-medium border-[#CCCCCC] border-dotted mr-2"></div>
            Nov 17, 2024
          </div>
        </button>
      </div>











      <div className="h-80 px-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectBookingsData} margin={{ top: 0, right: 30, bottom: 0, left: 0 }}>
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
                axisLine={false}
                tickLine={false}
                stroke="#3D3D3D"
              />



              <Tooltip contentStyle={{ backgroundColor: '#333333', color: 'white' }} />




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


          <div className="flex flex-col rounded-[30px] py-5 h-full bg-white shadow">
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















<div className="bg-white mt-6 p-4 w-full max-w-7xl mx-auto shadow-md rounded-[30px]">



   <div className='border-2 rounded-[30px] border-white p-4'>


<div className="w-full max-w-7xl mx-auto">


      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-800">CRM Inventory Report</h1>
        <button className="flex pl-3 items-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-gray-600">
          Project Name
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full bg-white rounded-t-[30px] overflow-hidden">
        <div className="bg-[#E0E4EB] p-4 rounded-t-[30px]">
          <h2 className="text-lg text-center font-medium text-[#000000]" >

          </h2>
        </div>
        <div>



<div className="overflow-x-auto">
      <table className="w-full overflow-hidden">
        <thead>
          <tr className="bg-[#F0F2F5] text-right  border-t border-b border-[#E8ECF4]">
            {['project Name', 'total Unit', 'available', 'sold Unit', 'blocked Unit', 'mortgaged'].map((key) => (
              <th
                key={key}
                className={`${
                  key === 'project Name' ? 'text-left' : 'text-right'
                } pl-3 p-1 py-2 font-medium text-[#000000] whitespace-nowrap cursor-pointer relative`}
                onClick={() => handleSort(key)}
              >
                <span>
                {key === 'name' ? 'Project Name' : key.charAt(0).toUpperCase() + key.slice(1)}

                </span>


<span className="inline-block ml-2">
                      {sortConfig.key === key ? (
                        sortConfig.direction === 'asc' ? (
                          <MoveUp  className="w-4 h-4 text-gray-600" />
                        ) : (
                          <MoveDown  className="w-4 h-4 text-gray-600" />
                        )
                      ) : (
                        <ArrowUpDown  className="w-4 h-4 text-gray-400" />
                      )}
                    </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedProjects.map((item, index) => (
            <tr key={`${item.name}-${index}`} className="hover:bg-gray-50 border-b border-[#E8ECF4]">
              <td className="p-2 text-gray-700 "
                                    onClick={() => {
                                      showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                                        'available',
                                        'booked',
                                        'blockedUnitCount',
                                        'blocked',
                                        'management_blocked',
                                      ])
                                    }}

              >{item.projectName}</td>
              <td className="p-2 text-gray-700  text-right"
                                    onClick={() => {
                                      showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                                        'available',
                                        'booked',
                                        'blockedUnitCount',
                                        'blocked',
                                        'management_blocked',
                                      ])
                                    }}
              >{item.totalUnitCount}</td>
              <td className="p-2 text-gray-700  text-right "
                                    onClick={() => {
                                      showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                                        'available',
                                        'booked',
                                        'blockedUnitCount',
                                        'blocked',
                                        'management_blocked',
                                      ])
                                    }}

              >{item.availableCount}</td>
              <td className="p-2 text-gray-700  text-right"
                                    onClick={() => {
                                      showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                                        'available',
                                        'booked',
                                        'blockedUnitCount',
                                        'blocked',
                                        'management_blocked',
                                      ])
                                    }}
              >{item.soldUnitCount}</td>
              <td className="p-2 text-gray-700 text-right "
                                    onClick={() => {
                                      showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                                        'available',
                                        'booked',
                                        'blockedUnitCount',
                                        'blocked',
                                        'management_blocked',
                                      ])
                                    }}

              >{item.blockedUnitCount || 0}</td>
              <td className="p-2 m text-right text-gray-700"
                                    onClick={() => {
                                      showDrillDownFun(`Total ${item?.stausTitle}`, item, [
                                        'available',
                                        'booked',
                                        'blockedUnitCount',
                                        'blocked',
                                        'management_blocked',
                                      ])
                                    }}

              >{item.mortgaged}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>





        </div>
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
