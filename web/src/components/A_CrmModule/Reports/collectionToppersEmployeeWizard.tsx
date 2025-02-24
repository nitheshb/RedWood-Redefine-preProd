import React, { useEffect, useState } from 'react'


import {
  getBookedUnitsByProject,
  getUnitsAgreeByProject,
  gretProjectCollectionSum,
  gretProjectionSum,
  steamCollectionsReport,
  steamCollectionsSpotLightReport,
  steamUsersListByDept,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { getLastSevenMonths, getLastSevenWeeks, getLastSixYears, getLastThreeMonths, getNextThreeMonths } from 'src/util/dateConverter'

import TableSkeleton from './_mock/comps/table/table-skeleton'
import EmpCollectionSummary from './empCollectionReport'



import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Calendar, ChevronRight, TrendingUp } from 'lucide-react';
import PeriodSelctorWizard from './PeriodSelcectorWizard'
import { capitalizeFirstLetter, CustomTooltip } from './collectionReport'
import CRMReportSideWindow from 'src/components/SiderForm/CRMReportSideView'
const timeSeriesData = [
  { time: 'Week-1', value: 5, prevValue: 5 },
  { time: 'Week-2', value: 5, prevValue: 5 },
  { time: 'Week-3', value: 20, prevValue: 5 },
  { time: 'Week-4', value: 5, prevValue: 5 },
  { time: 'Week-5', value: 5, prevValue: 5 },
  { time: 'Week-6', value: 90, prevValue: 30 },
  { time: 'Week-7', value: 5, prevValue: 5 },
];
const progressData = [
  { name: 'completed', value: 50 },
  { name: 'inProgress', value: 30 },
  { name: 'remaining', value: 20 }
];
const reportData = [
  {
    id: 1,
    projectName: 'Eco stone',
    soldUnits: 3,
    totalAmount: 1001010,
    monthly: {
      april: 25000,
      may: 25000,
      june: 10925500,
    },
    weekly: {
      week1: 5000,
      week2: 6000,
      week3: 7000,
      week4: 8000,
      week5: 9000,
    },
    oldDue: 150000,
  },
  {
    id: 2,
    projectName: 'green gardens',
    soldUnits: 5,
    totalAmount: 2002020,
    monthly: {
      april: 35000,
      may: 45000,
      june: 11925500,
    },
    weekly: {
      week1: 7000,
      week2: 8000,
      week3: 9000,
      week4: 10000,
      week5: 11000,
    },
    oldDue: 200000,
  },
]

const COLORS = ['#0EA5E9', '#93C5FD', '#DBEAFE'];
const CRMCollectionTopEmpWizard = ({ projects }) => {
  const { user } = useAuth()
  const { orgId } = user

  const [timeLineTC, setTimeLineTC] = useState('W');
  const [totalCollecionR, setTotalCollecionR] = useState([])
  const [load, setLoad] = useState(false)


  useEffect(() => {
    console.log('matched value i', timeLineTC)
    setLoad(false)
 if(timeLineTC === 'W'){
  console.log('matched value i')
  let x =  getLastSevenWeeks();
  console.log('month name  is', x)
  weekFun('W', x)
  // console.log('week data is ', x)

 }else if(timeLineTC === 'M'){
  let x = getLastSevenMonths()
  // weekFun('M', x)
return
  console.log('month name  is', x)
  x.map((data, i)=>{
     data.time = data.name
    data.value = timeSeriesData[i]?.value || 0
    data.prevValue = timeSeriesData[i]?.prevValue || 0
    return data
  })
  setTotalCollecionR(x)
  setLoad(true)
 }else if(timeLineTC === 'Y'){
  let x = getLastSixYears()
  // weekFun('Y', x)
  return
  console.log('month name  is', x)
  x.map((data, i)=>{
    data.time = data.year
    data.value = timeSeriesData[i]?.value || 0
    data.prevValue = timeSeriesData[i]?.prevValue || 0
    return data
  })
  setTotalCollecionR(x)
  setLoad(true)

 }
  }, [timeLineTC])
   const weekFun = async (datePayload,x) => {
    console.log('matched value i', datePayload)


    const projectToppersA = []


    const unsubscribe = await steamCollectionsSpotLightReport(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id


          console.log('mylist is', x)

          return x
        })

        projectToppersA.push(usersListA);

        console.log('mylist is', usersListA, projects)
        setProjectToppers(projectToppersA)
        return usersListA

      },
      {
        'type': timeLineTC,
        length: 5,
        weekNumber: 5,
        year: 2025
      },
      (error) =>  {}
    )

    return

    setLoad(false)
    const promises = x.map(async (data, i) => {
      let z = {}
      data.time = data.name;
      const unsubscribe = await steamCollectionsReport(
        orgId,
        async (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) => {
            const x = docSnapshot.data()
            x.id = docSnapshot.id
            return x
          })
          await console.log('matched value i', i ,data, usersListA )

          const value = usersListA.length > 0 ? usersListA[0]?.received : 0;
          z = { ...data, value, prevValue: (value*0.9) };
          projectMonthArray.push(z);
          setTotalCollecionR(projectMonthArray)
          await setLoad(i==x.length-1? true : false)
          await console.log('matched value i vvvv',projectMonthArray )// Push into array
          return z
          await console.log('my Array data is set it', )
        },
        {
          'type': timeLineTC,
          ...data
        },
        (error) =>  {}
      )
      return z
      return await getCollectionsReport(data);
    });




   }
  useEffect(() => {
    calMonthlyValueNew(projects)
    calMonthlyEmpCollections(projects)
  }, [projects])
  const [filterPayload, setFilterPayload] = useState({})
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [projectCollections, setProjectCollections] = useState([])
  const [projectToppers, setProjectToppers] = useState([])
  const [last3MonthsA, setLast3MonthsA] = useState(getLastThreeMonths())
  const [isOpenSideForm, setReportSideForm] = useState(false)
  const [subTitle, setSubTitle] = useState('')
  const [filter, setFilter] = useState('')

    const [projectAValues, setProjectWithValues] = useState([])
  const [dataView, setDataView] = useState('monthly')


    const [loader, setLoaderIcon] = useState(false)
    const [monthsA, setMonthsA] = useState(getNextThreeMonths())
  const [selCat, setSelCat] = useState('project_collections')
  const [crmEmployeesA, setCRMEmployees] = useState([])
    useEffect(() => {
      getCRMemployees()
    }, [])
    const getCRMemployees = async () => {
      const unsubscribe = steamUsersListByDept(
        orgId,
        ['crm'],
        (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) =>
            docSnapshot.data()
          )
          setCRMEmployees(usersListA)
          usersListA.map((user) => {
            user.label = user.displayName || user.name
            user.value = user.uid
          })
          console.log('fetched users list is', usersListA)
          setCRMEmployees(usersListA)
        },
        (error) => setCRMEmployees([])
      )
      return unsubscribe
    }

  const filteredData = reportData?.filter((item) => {
    return (
      (!filter || item.soldUnits === parseInt(filter)) &&
      (dataView === 'monthly' || dataView === 'weekly')
    )
  })

  const handleChangeView = (view) => {
    setDataView(view)
  }
 const calMonthlyValueNew = async (projects) => {
    try {
      setLoaderIcon(true)
      const insideValues = []

      // Iterate over projects
      for (const projectData of projects) {
        //  const z = await projects.map((projectData) => {
        const newProjectData = { ...projectData }
        const projectMonthArray = []

        // Use Promise.all to execute asynchronous operations concurrently
        await Promise.all(
          monthsA.map(async (month) => {
            const payload = {
              pId: projectData.uid,
              monthNo: month.count,
              currentYear: month.currentYear,
            }

            const totalReceivableValue = await gretProjectionSum(orgId, payload)



            const updatedMonth = { ...month, receive: totalReceivableValue }
            console.log(
              'Value refreshed',
              updatedMonth,
              projectData?.projectName,
              '=>',
              updatedMonth.receive?.length
            )

            projectMonthArray.push(updatedMonth)
          })
        )

        newProjectData.months = projectMonthArray
        insideValues.push(newProjectData)
      }

      setProjectWithValues(insideValues)
    } catch (error) {
      console.error('Error calculating monthly values:', error)
    } finally {
      setLoaderIcon(false)
    }
  }

   const calMonthlyEmpCollections = async (projects) => {
      try {
        setLoaderIcon(true)
        const insideValues = []

        for (const projectData of projects) {
          const newProjectData = { ...projectData }
          const projectMonthArray = []

          await Promise.all(
            monthsA.map(async (month) => {
              const payload = {
                pId: projectData.uid,
                monthNo: month.count,
                currentYear: month.currentYear,
              }

              const totalReceivableValue = await gretProjectCollectionSum(orgId, payload)

              const updatedMonth = { ...month, receive: totalReceivableValue }
              console.log(
                'Value refreshed',
                updatedMonth,
                projectData?.projectName,
                '=>',
                updatedMonth.receive?.length
              )

              projectMonthArray.push(updatedMonth)
            })
          )

          newProjectData.months = projectMonthArray
          insideValues.push(newProjectData)
        }

        setProjectCollections(insideValues)
      } catch (error) {
        console.error('Error calculating monthly values:', error)
      } finally {
        setLoaderIcon(false)
      }
    }
   const getCollectionsReport = async (datePayload) => {

         const { access, uid } = user


           const unsubscribe = await steamCollectionsReport(
             orgId,
             async (querySnapshot) => {
               const usersListA = querySnapshot.docs.map((docSnapshot) => {
                 const x = docSnapshot.data()
                 x.id = docSnapshot.id
                 return x
               })
               await console.log('matched value i',usersListA )

               return usersListA.length>0 ? usersListA[0] : []
               await console.log('my Array data is set it', )
             },
             {
               'weekNumber': datePayload?.weekNumber,
               'year': datePayload?.year
             },
             (error) =>  {}
           )
          await console.log('matched value i', unsubscribe)
           return await unsubscribe


       }
       const sortData = (data) => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
          const aValue =
            sortConfig.key === "projectName"
              ? capitalizeFirstLetter(a[sortConfig.key])
              : a[sortConfig.key];
          const bValue =
            sortConfig.key === "projectName"
              ? capitalizeFirstLetter(b[sortConfig.key])
              : b[sortConfig.key];

          if (sortConfig.direction === "ascending") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      };
      const sortedData = sortData(projectAValues);

       const collectedData = sortData(projectCollections);


       const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
          direction = "descending";
        }
        setSortConfig({ key, direction });
      };

      const getDateForWeek = (weekNumber) => {
        const today = new Date()
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const firstDayOfWeek = new Date(firstDayOfMonth)
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() + (weekNumber - 1) * 7)

        const day = String(firstDayOfWeek.getDate()).padStart(2, '0')
        const month = String(firstDayOfWeek.getMonth() + 1).padStart(2, '0')
        const year = firstDayOfWeek.getFullYear()

        return `${day}-${month}-${year}`
      }
      const showDrillDownFun = async (text, data) => {
        // Display sideForm
        setReportSideForm(true)
        setFilterPayload(data)
        setSubTitle(text)
      }
  return (
    <section className='flex flex-col'>
    <div className="flex flex-col rounded-[30px] py-5 h-full bg-white shadow">

    <div className="w-full max-w-3xl mx-auto p-8  ">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-normal">Collections</h1>
      <span className="text-gray-500">Month</span>
    </div>

    {/* Amount */}
    <div className="mb-6">
      <h2 className="text-4xl font-semibold">₹ 492,767.93</h2>
    </div>

    {/* Progress Bar Chart */}
    <div className="h-8 mb-12">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={progressData}
          layout="vertical"
          barSize={32}
        >
          <Bar
            dataKey="value"
            fill="#0EA5E9"
            background={false}
            radius={[4, 4, 4, 4]}
          >
            {progressData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Project Breakdown */}
    <div className="mb-12">
      <h3 className="text-xl font-normal mb-6">Project-wise Breakdown</h3>
      <div className="space-y-4 max-h-[150px] overflow-y-auto">
      {collectedData?.map((data, index) => {
        return( <div className="flex justify-between items-center" key={index}>
          <span className="text-gray-500">                      {capitalizeFirstLetter(data?.projectName)}</span>
          <span className="text-gray-500">₹    {data?.months
                      ?.reduce((accumulator, currentValue) => {
                        return accumulator + (currentValue?.receive || 0)
                      }, 0)
                      ?.toLocaleString('en-IN')}</span>
        </div>)
      })}

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Project 2</span>
          <span className="text-gray-500">₹ 0.0</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Project 3</span>
          <span className="text-gray-500">₹ 214.84</span>
        </div>
      </div>
    </div>

    {/* Employee Breakdown */}
    <div>
      <h3 className="text-xl font-normal mb-6">Employee-wise Breakdown</h3>
      <div className="space-y-4">
      <div className="space-y-4 max-h-[150px] overflow-y-auto">
      {sortedData?.map((data, index) => {
        return( <div className="flex justify-between items-center" key={index}>
          <span className="text-gray-500">                      {capitalizeFirstLetter(data?.projectName)}</span>
          <span className="text-gray-500">₹    {data?.months
                      ?.reduce((accumulator, currentValue) => {
                        return accumulator + (currentValue?.receive || 0)
                      }, 0)
                      ?.toLocaleString('en-IN')}</span>
        </div>)
      })}

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Project 2</span>
          <span className="text-gray-500">₹ 0.0</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Project 3</span>
          <span className="text-gray-500">₹ 214.84</span>
        </div>
      </div>
      </div>
    </div>
  </div>
    </div>

    <div className=''>
<div className="p-4 mt-6 rounded-[30px] bg-white w-full max-w-7xl mx-auto">

<div className='border-2 rounded-[30px] border-[#f1f1f1] p-4'>


        <div className="flex items-center  mb-4">
          <div>
            <h2 className="text-xl font-medium text-gray-800">
              Collections
            </h2>
          </div>

          {[
            { label: 'Project Collections', value: 'project_collections' },
            { label: 'Employee Collections', value: 'employee_collections' },
          ].map((data, i) => {
            return (
              <section
                key={i}
                className="flex "
                onClick={() => {
                  console.log('am i clicked', data.value)
                  setSelCat(data.value)
                }}
              >
                <span
                  className={`flex ml-2 mt-1 items-center h-6 px-3 text-xs  ${
                    selCat === data.value
                      ? 'font-normal text-green-800 bg-[#FFEDEA]'
                      : 'font-normal text-black-100 bg-[#f0f8ff]'
                  }  rounded-full`}
                >
                  {/* <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" /> */}
                  <img alt="" src="/temp2.png" className="h-3 w-3 mr-1" />
                  {data?.label}
                </span>
              </section>
            )
          })}
        </div>
        {selCat === 'project_collections' && (
                  <section className=" w-full max-w-7xl overflow-hidden  mt-6">
                      <div className="overflow-x-auto">

          <table className="rounded-[30px] w-full max-w-7xl   my-3 overflow-hidden ">
            <thead className="">
            <tr
            className={
              dataView === 'monthly'
                ? 'bg-[#E0E4EB] text-gray-600 text-sm leading-normal border-0 border-gray-100 shadow-3xl'
                : 'bg-[#E0E4EB] text-gray-600 text-sm leading-normal border-0 border-gray-100 shadow-3xl'
            }
          >
            <th
              className="py-1 px-6 text-center border-0  rounded-tl-2xl"
              colSpan="1"
            ></th>
            <th
              className="py-1 px-6 text-center border-0  border-gray-100"
              colSpan="1"
            ></th>
            <th
              className="py-1 px-6 text-center border-0  border-gray-100"
              colSpan="1"
            ></th>
            {dataView === 'weekly' && (
              <th
                className="py-1 px-6 text-center border  border-gray-100 rounded-tr-2xl"
                colSpan="4"
              >
                Weekly
              </th>
            )}
            {dataView === 'monthly' && (
              <>
                {last3MonthsA.map((month, i) => {
                  return (
                    <th
                      key={i}
                      className={`py-1 px-6 text-center border-l   border-[#d3d1d1] ${
                        i+1 === monthsA.length ? 'rounded-tr-2xl' : ''
                      }`}
                      colSpan="3"
                    >
                      {month?.name}
                    </th>
                  )
                })}
              </>
            )}
          </tr>

              <tr className="bg-[#F0F2F5] border-t border-b border-[#E8ECF4]">
                <th className="text-left pl-3 p-1 py-2 font-medium text-[#000000] whitespace-nowrap "
                onClick={() => requestSort("projectName")}
                >
                  Project Name
                </th>
                <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap "
                 onClick={() => requestSort("soldUnitCount")}
                >
                  Sold Units
                </th>
                <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap "
                 onClick={() => requestSort("totalAmount")}
                >
                  Total Amount
                </th>
                {dataView === 'monthly' ? (
                  <>
                    {last3MonthsA.map((month, i) => {
                      return (
          
                        ['Target', 'Collection', 'Pending'].map(
                          (month, i) => {
                            return (
                              <th
                                key={i}
                                className="text-right p-1 px-4 font-medium text-[#000000] whitespace-nowrap border-r border-[#d3d1d1]"
                              >
                                {month}
                              </th>
                            )
                          }
                        )
                      )
                    })}
                  </>
                ) : (
                  <>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap ">
                      Week 1 <br /> ({getDateForWeek(1)})
                    </th>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap">
                      Week 2 <br /> ({getDateForWeek(2)})
                    </th>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap ">
                      Week 3 <br /> ({getDateForWeek(3)})
                    </th>
                    <th className="text-right p-1 font-medium text-[#000000] whitespace-nowrap ">
                      Week 4 <br /> ({getDateForWeek(4)})
                    </th>
                  </>
                )}
              </tr>
            </thead>

            {loader && [1, 2, 3].map((d, i) => <TableSkeleton key={i} />)}

            <tbody className="">

              {sortedData?.map((data, index) => {
                console.log('final value is', data)
                let totalAmount = 0
                if (dataView === 'monthly') {
                  totalAmount =
                    data?.monthly?.june +
                    data?.monthly?.may +
                    data?.monthly?.april
                } else {
                  totalAmount =
                    data?.weekly?.week1 +
                    data?.weekly?.week2 +
                    data?.weekly?.week3 +
                    data?.weekly?.week4
                }
                const oldDue = 0
                return (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-100 text-gray-700 font-[400]"
                  >
                    <td className="p-2 text-gray-700  ">
                      {capitalizeFirstLetter(data?.projectName)}
                    </td>
                    <td className="p-2 text-gray-700  text-right ">
                      {data?.soldUnitCount?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-gray-700  text-right ">
                      {/* {totalAmount?.toLocaleString('en-IN')} */}
                      {data?.months
                        ?.reduce((accumulator, currentValue) => {
                          return accumulator + (currentValue?.receive || 0)
                        }, 0)
                        ?.toLocaleString('en-IN')}
                    </td>
                    {dataView === 'monthly' ? (
                      <>
                        {data?.months?.map((month, i) => {
                          console.log('what is this', month)
                          const x = month
                          console.log('what is this', month)
                          return (
                            <>
                            <td
                            key={i}
                            className="py-1 px-6 text-right border-t border-l  border-gray-100"
                          onClick={() => showDrillDownFun('project_collections', data)}
                          >
                            {`${x?.receive?.toLocaleString('en-IN')}`}
                          </td>
                          <td
                            key={i}
                            className="py-1 px-6 text-right border-t border-l  border-gray-100"
                          >
                            {`${x?.collected?.toLocaleString('en-IN')}`}
                          </td>
                          <td
                            key={i}
                            className="py-1 px-6 text-right border-t border-l  border-gray-100"
                          >
                            {`${x?.pending?.toLocaleString('en-IN')}`}
                          </td>
                          </>
                          )
                        })}
  
                      </>
                    ) : (
                      <>
                        <td className="p-2 text-gray-700 ">
                          {data?.weekly?.week1.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-gray-700  ">
                          {data?.weekly?.week2.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-gray-700  ">
                          {data?.weekly?.week3.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-gray-700 ">
                          {data?.weekly?.week4.toLocaleString('en-IN')}
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
          </section>
        )}
        {selCat === 'employee_collections' && (
          <EmpCollectionSummary
            projects={projects}
            crmEmployeesA={crmEmployeesA}
          />
        )}

        </div>


      </div>
</div>
<CRMReportSideWindow
            open={isOpenSideForm}
            setOpen={setReportSideForm}
            title={subTitle}
            subtitle={subTitle}
            filterPaylod={filterPayload}

            widthClass="max-w-7xl"
            unitsViewMode={undefined}
            setIsClicked={undefined}
          />
    </section>
  )
}

export default CRMCollectionTopEmpWizard
