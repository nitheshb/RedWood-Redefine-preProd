import { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import LogSkelton from 'src/components/shimmerLoaders/logSkelton'
import { streamEmpBookedLeads } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { prettyDate } from 'src/util/dateConverter'

const EmpBookingSideBody = ({
  title,
  subtitle,
  leadsLogsPayload: projectPayload,
  dialogOpen,
  setCustomerDetails,
  setisImportLeadsOpen,
}) => {
  const { user } = useAuth()
  const { orgId } = user

  const { enqueueSnackbar } = useSnackbar()
  const [usersList, setusersList] = useState([])

  const [leadsData, setLeadsData] = useState([])
  const [loadingIcon, setLoadingIcon] = useState(false)
  const [projectList, setprojectList] = useState([])
  const [leadsFilA, setLeadsFilA] = useState([])

  const [leadsFetchedData, setLeadsFetchedData] = useState([])

  useEffect(() => {
    getLeadsData()
  }, [])
  useEffect(() => {
    console.log('payload is ', projectPayload)
    getLeadsData()
  }, [projectPayload])

  const getLeadsData = () => {
    const unsubscribe = streamEmpBookedLeads(
      orgId,
      {
        pId: projectPayload?.uid,
        startTime: projectPayload.thisMonth['startOfMonth'],
        endTime: projectPayload.thisMonth['endOfMonth'],
      },
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setLeadsFetchedData(usersListA)
      },
      () => setLeadsFetchedData([])
    )
    return
  }
  const selLeadFun = (data) => {
    console.log('data is ', data)
    setisImportLeadsOpen(true)
    setCustomerDetails(data)
  }
  return (
    <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
      <div className="px-4 sm:px-6  z-10 flex flex-row justify-between">
        {subtitle || title} ({leadsFilA.length || 0})
      </div>

      <div className="grid  gap-8 grid-cols-1">
        <div className="flex flex-col m-4">
          <div className="flex flex-col mt-2 rounded-lg bg-white border border-gray-100 p-4 ">
            {loadingIcon ? (
              <LogSkelton />
            ) : (
              <table className="min-w-full text-center mt-6">
                <thead className="border-b">
                  <tr>
                    {' '}
                    {[
                      { label: 'sNo', id: 'no' },
                      { label: 'Project', id: 'label' },
                      { label: 'Lead Name', id: 'all' },
                      { label: 'Status', id: 'new' },
                      { label: 'Booked On', id: 'all' },
                      { label: 'Created on', id: 'all' },
                      { label: 'Source', id: 'new' },
                      { label: 'Executive', id: 'all' },

                      { label: 'Visit Fixed By', id: 'new' },
                    ].map((d, i) => (
                      <th
                        key={i}
                        scope="col"
                        className={`text-sm font-medium text-gray-900 px-6 py-4 ${
                          ['Project', 'Lead Name'].includes(d.label)
                            ? 'text-left'
                            : ''
                        }`}
                      >
                        {d.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {leadsFetchedData?.map((data, i) => {
                    return (
                      <tr
                        className={`  ${
                          i % 2 === 0
                            ? 'bg-white border-blue-200'
                            : 'bg-gray-100'
                        }`}
                        key={i}
                        onClick={() => selLeadFun(data)}
                      >
                        <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                          {i + 1}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-left">
                          {data?.Project}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap text-left">
                          {data?.Name}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.Status}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {prettyDate(data?.stsUpT)}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {prettyDate(data?.Date)}
                        </td>

                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.Source}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.assignedToObj?.name}
                        </td>

                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.by}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="mt-0"></div>
        </div>
      </div>
    </div>
  )
}

export default EmpBookingSideBody
