import React, { useEffect, useState } from 'react'

import { X } from '@mui/icons-material'

import {
  getEmpCollectionsSum,
  gretProjectionSum,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import SkeletonLoaderPage from 'src/pages/SkeletonLoader/skeletonLoaderPage'
import { getNextThreeMonths } from 'src/util/dateConverter'

import TableSkeleton from './_mock/comps/table/table-skeleton'

{
  /* frist capitalize all letters */
}

const capitalizeFirstLetter = (str) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase())
}

{
  /* date */
}
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

{
  /* dummy data */
}


const styles = {
  customTopBottomShadow: {
    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
  }


};

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

const EmpCollectionSummary = ({ projects, crmEmployeesA }) => {
  const { user } = useAuth()
  const { orgId } = user

  const [filter, setFilter] = useState('')
  const [dataView, setDataView] = useState('monthly')
  const [monthsA, setMonthsA] = useState(getNextThreeMonths())
  const [projectAValues, setProjectWithValues] = useState([])
  const [loader, setLoaderIcon] = useState(false)

  useEffect(() => {
    calMonthlyValueNew(crmEmployeesA)
  }, [crmEmployeesA])

  const filteredData = reportData.filter((item) => {
    return (
      (!filter || item.soldUnits === parseInt(filter)) &&
      (dataView === 'monthly' || dataView === 'weekly')
    )
  })

  const handleChangeView = (view) => {
    setDataView(view)
  }

  const calculateTotal = (data, key) => {
    return data.reduce((acc, item) => {
      return acc + (item[key] || 0)
    }, 0)
  }
  const totalSoldSummary = calculateTotal(projects, 'soldUnitCount')

  const calMonthlyValueNew = async (projects) => {
    console.log('crmEmployeesA', crmEmployeesA);
    try {
      setLoaderIcon(true)
      const insideValues = []

      // Iterate over projects
      for (const projectData of projects) {
        //  const z = await projects.map((projectData) => {
        console.log('projects', projects)
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

            // Fetch projection sum asynchronously
            const totalReceivableValue = await getEmpCollectionsSum(
              orgId,
              payload
            )

            // Update month object with receivable value
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

        // Update project data with month array
        newProjectData.months = projectMonthArray
        insideValues.push(newProjectData)
      }

      // After processing all projects, update state with updated project data
      setProjectWithValues(insideValues)
    } catch (error) {
      console.error('Error calculating monthly values:', error)
      // Handle error
    } finally {
      // Set loading state to false
      setLoaderIcon(false)
    }
  }

  const calMonthlyValue = (pId, monthNo, currentYear) => {
    const data = { pId, monthNo, currentYear }

    let totalReceivableValue = 0 // Declare variable to store the total receivable value

    gretProjectionSum(orgId, data)
      .then((payload) => {
        // Assign totalReceivable from the payload to the variable
        totalReceivableValue = payload
        console.log(
          'Total receivable stored in variable:',
          totalReceivableValue
        )
      })
      .catch((error) => {
        console.error('Error:', error)
      })
    return totalReceivableValue

    // get values matched to db
  }
  return (
    <div className="  bg-white rounded-lg">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr
            className={
              dataView === 'monthly'
                ? 'bg-[#F5F5F7] text-gray-600 text-sm leading-normal border border-gray-200 shadow-3xl'
                : 'bg-[#F5F5F7] text-gray-600 text-sm leading-normal border border-gray-200 shadow-3xl'
            }
          >
            <th
              className="py-1 px-6 text-center border  border-gray-200"
              colSpan="1"
            ></th>
            <th
              className="py-1 px-6 text-center border  border-gray-200"
              colSpan="1"
            ></th>
            <th
              className="py-1 px-6 text-center border  border-gray-200"
              colSpan="1"
            ></th>
            {dataView === 'weekly' && (
              <th
                className="py-1 px-6 text-center border  border-gray-200"
                colSpan="4"
              >
                Weekly
              </th>
            )}
            {dataView === 'monthly' && (
              <>
                {monthsA.map((month, i) => {
                  return (
                    <th
                      key={i}
                      className="py-1 px-6 text-center border  border-gray-200"
                      colSpan="4"
                    >
                      {month?.name}
                    </th>
                  )
                })}
              </>
            )}
          </tr>
          <tr className="bg-[#FFF6F0]  text-gray-600 text-sm leading-normal">
            <th className="py-1 px-3 text-left border border-gray-200">
              CRM Executive
            </th>
            <th className="py-1 px-6 text-left border border-gray-200">Units</th>
            <th className="py-1 px-6 text-right border border-gray-200">
              Total Amount
            </th>
            {dataView === 'monthly' ? (
              <>
                {['Target', 'Collection', 'Pending', 'Other Collection'].map(
                  (month, i) => {
                    return (
                      <th
                        key={i}
                        className="py-1 px-6 text-right border border-gray-200"
                      >
                        {month}
                      </th>
                    )
                  }
                )}
                {['Target', 'Collection', 'Pending', 'Other Collection'].map(
                  (month, i) => {
                    return (
                      <th
                        key={i}
                        className="py-1 px-6 text-right border border-gray-200"
                      >
                        {month}
                      </th>
                    )
                  }
                )} {['Target', 'Collection', 'Pending', 'Other Collection'].map(
                  (month, i) => {
                    return (
                      <th
                        key={i}
                        className="py-1 px-6 text-right border border-gray-200"
                      >
                        {month}
                      </th>
                    )
                  }
                )}
                {['Target', 'Collection', 'Pending', 'Other Collection'].map(
                  (month, i) => {
                    return (
                      <th
                        key={i}
                        className="py-1 px-6 text-right border border-gray-200"
                      >
                        {month}
                      </th>
                    )
                  }
                )}
              </>
            ) : (
              <>
                <th className="py-1 px-6 text-right border border-gray-200">
                  Week 1 <br /> ({getDateForWeek(1)})
                </th>
                <th className="py-1 px-6 text-right border border-gray-200">
                  Week 2 <br /> ({getDateForWeek(2)})
                </th>
                <th className="py-1 px-6 text-right border border-gray-200">
                  Week 3 <br /> ({getDateForWeek(3)})
                </th>
                <th className="py-1 px-6 text-right border border-gray-200">
                  Week 4 <br /> ({getDateForWeek(4)})
                </th>
              </>
            )}
          </tr>
        </thead>

        {loader && [1, 2, 3].map((d, i) => <TableSkeleton key={i} />)}

        <tbody className="text-gray-600 text-sm font-light">
          {/* <tr className="bg-gray-100">
            <td
              colSpan={dataView === 'monthly' ? 7 : 6}
              className="border border-black"
            ></td>
          </tr> */}
          {projectAValues?.map((data, index) => {
            console.log('final value is', data)
            let totalAmount = 0
            if (dataView === 'monthly') {
              totalAmount =
                data?.monthly?.june + data?.monthly?.may + data?.monthly?.april
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
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py- px-3 text-left whitespace-nowrap border  border-gray-200">
                  {capitalizeFirstLetter(data?.name)}
                </td>
                <td className="py- px-6 pr-10 text-right border  border-gray-200">
                  {data?.soldUnitCount?.toLocaleString('en-IN')}
                </td>
                <td className="py- px-6  border text-right  border-gray-200">
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
                          className="py- px-6 text-right border  border-gray-200"
                        >
                          {`${x?.receive?.toLocaleString('en-IN')}`}
                        </td>
                        <td
                          key={i}
                          className="py- px-6 text-right border  border-gray-200"
                        >
                          {`${x?.collected?.toLocaleString('en-IN')}`}
                        </td>
                        <td
                          key={i}
                          className="py- px-6 text-right border  border-gray-200"
                        >
                          {`${x?.pending?.toLocaleString('en-IN')}`}
                        </td>
                        <td
                          key={i}
                          className="py- px-6 text-right border  border-gray-200"
                        >
                          {`${x?.otherCollection?.toLocaleString('en-IN')}`}
                        </td>
</>
                      )
                    })}
                    {/* <td className="py-3 px-6 text-right border border-black">
                      {data?.monthly?.june.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-6 text-right border border-black">
                      {data?.monthly?.may.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-6 text-right border border-black">
                      {data?.monthly?.april.toLocaleString('en-IN')}
                    </td> */}
                  </>
                ) : (
                  <>
                    <td className="py- px-6 text-right border border-black">
                      {data?.weekly?.week1.toLocaleString('en-IN')}
                    </td>
                    <td className="py- px-6 text-right border border-black">
                      {data?.weekly?.week2.toLocaleString('en-IN')}
                    </td>
                    <td className="py- px-6 text-right border border-black">
                      {data?.weekly?.week3.toLocaleString('en-IN')}
                    </td>
                    <td className="py- px-6 text-right border border-black">
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
  )
}

export default EmpCollectionSummary
