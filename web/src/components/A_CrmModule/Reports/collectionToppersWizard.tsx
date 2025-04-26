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
import {
  getLastSevenMonths,
  getLastSevenWeeks,
  getLastSixYears,
  getNextThreeMonths,
} from 'src/util/dateConverter'

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
} from 'recharts'
import { Calendar, ChevronRight, TrendingUp } from 'lucide-react'
import PeriodSelctorWizard from './PeriodSelcectorWizard'
import { capitalizeFirstLetter, CustomTooltip } from './collectionReport'
const timeSeriesData = [
  { time: 'Week-1', value: 5, prevValue: 5 },
  { time: 'Week-2', value: 5, prevValue: 5 },
  { time: 'Week-3', value: 20, prevValue: 5 },
  { time: 'Week-4', value: 5, prevValue: 5 },
  { time: 'Week-5', value: 5, prevValue: 5 },
  { time: 'Week-6', value: 90, prevValue: 30 },
  { time: 'Week-7', value: 5, prevValue: 5 },
]
const CRMCollectionToppersWizard = ({ projects }) => {
  const { user } = useAuth()
  const { orgId } = user

  const [timeLineTC, setTimeLineTC] = useState('W')
  const [totalCollecionR, setTotalCollecionR] = useState([])
  const [load, setLoad] = useState(false)

  useEffect(() => {
    console.log('matched value i', timeLineTC)
    setLoad(false)
    if (timeLineTC === 'W') {
      console.log('matched value i')
      let x = getLastSevenWeeks()
      console.log('month name  is', x)
      weekFun('W', x)
      // console.log('week data is ', x)
    } else if (timeLineTC === 'M') {
      let x = getLastSevenMonths()
      // weekFun('M', x)
      return
      console.log('month name  is', x)
      x.map((data, i) => {
        data.time = data.name
        data.value = timeSeriesData[i]?.value || 0
        data.prevValue = timeSeriesData[i]?.prevValue || 0
        return data
      })
      setTotalCollecionR(x)
      setLoad(true)
    } else if (timeLineTC === 'Y') {
      let x = getLastSixYears()
      // weekFun('Y', x)
      return
      console.log('month name  is', x)
      x.map((data, i) => {
        data.time = data.year
        data.value = timeSeriesData[i]?.value || 0
        data.prevValue = timeSeriesData[i]?.prevValue || 0
        return data
      })
      setTotalCollecionR(x)
      setLoad(true)
    }
  }, [timeLineTC])
  const weekFun = async (datePayload, x) => {
    console.log('matched value i', datePayload)

    const projectToppersA = []

    const unsubscribe = await steamCollectionsSpotLightReport(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          let projObj = projects.find((project) => project.uid === x.pId)
          x.projectName = projObj?.projectName || 'Others'

          console.log('mylist is', x)

          return x
        })

        // projectToppersA.push(usersListA);

        console.log('mylist is', usersListA, projects)
        setProjectToppers(usersListA)
        return usersListA
      },
      {
        type: timeLineTC,
        length: 5,
        weekNumber: 5,
        year: 2025,
      },
      (error) => {}
    )

    return

    setLoad(false)
    const promises = x.map(async (data, i) => {
      let z = {}
      data.time = data.name
      const unsubscribe = await steamCollectionsReport(
        orgId,
        async (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) => {
            const x = docSnapshot.data()
            x.id = docSnapshot.id
            return x
          })
          await console.log('matched value i', i, data, usersListA)

          const value = usersListA.length > 0 ? usersListA[0]?.received : 0
          z = { ...data, value, prevValue: value * 0.9 }
          projectMonthArray.push(z)
          setTotalCollecionR(projectMonthArray)
          await setLoad(i == x.length - 1 ? true : false)
          await console.log('matched value i vvvv', projectMonthArray) // Push into array
          return z
          await console.log('my Array data is set it')
        },
        {
          type: timeLineTC,
          ...data,
        },
        (error) => {}
      )
      return z
      return await getCollectionsReport(data)
    })
  }
  useEffect(() => {
    calMonthlyEmpCollections(projects)
  }, [projects])

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [projectCollections, setProjectCollections] = useState([])
  const [projectToppers, setProjectToppers] = useState([])

  const [loader, setLoaderIcon] = useState(false)
  const [monthsA, setMonthsA] = useState(getNextThreeMonths())

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

            const totalReceivableValue = await gretProjectCollectionSum(
              orgId,
              payload
            )

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
        await console.log('matched value i', usersListA)

        return usersListA.length > 0 ? usersListA[0] : []
        await console.log('my Array data is set it')
      },
      {
        weekNumber: datePayload?.weekNumber,
        year: datePayload?.year,
      },
      (error) => {}
    )
    await console.log('matched value i', unsubscribe)
    return await unsubscribe
  }
  const sortData = (data) => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      const aValue =
        sortConfig.key === 'projectName'
          ? capitalizeFirstLetter(a[sortConfig.key])
          : a[sortConfig.key]
      const bValue =
        sortConfig.key === 'projectName'
          ? capitalizeFirstLetter(b[sortConfig.key])
          : b[sortConfig.key]

      if (sortConfig.direction === 'ascending') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  const collectedData = sortData(projectCollections)
  return (
    <div className="flex flex-col rounded-[30px] py-5 px-8 h-full bg-white shadow">
      <section className="flex flex-row justify-between">
        <div className="pt-6 ">
          <h2 className="text-[#000000] text-[19px] ">
            Collections Spotlight {projectToppers.length}
          </h2>
          <div className="flex items-center gap-3 mt-4 mb-4">
            <span className="text-[30px] text-[#000000] font-semibold">
              &#8377;{' '}
              {totalCollecionR
                ?.reduce((a, b) => a + b.value, 0)
                ?.toLocaleString('en-US')}
            </span>
            <div className="flex items-center text-[#00A236]">
              <TrendingUp className="w-5 h-5 mx-3" />
              <span className="text-[18px]">23%</span>
            </div>
          </div>
        </div>

        <PeriodSelctorWizard
          timeLine={timeLineTC}
          setTimeLine={setTimeLineTC}
        />
      </section>
      <div className="mb-12">
        <h3 className="text-xl font-normal mb-6">Project-wise Breakdown</h3>
        <div className="space-y-4 max-h-[150px] overflow-y-auto">
          {projectToppers?.map((data, index) => {
            return (
              <div className="flex justify-between items-center" key={index}>
                <span className="text-gray-500"> {data?.projectName}</span>
                <span className="text-gray-500">
                  ₹{data?.received?.toLocaleString('en-IN')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CRMCollectionToppersWizard
