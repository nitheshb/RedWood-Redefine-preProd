import { useState, useEffect } from 'react'

import { Tooltip } from '@mui/material'
import { useSnackbar } from 'notistack'

import AssigedToDropComp from 'src/components/assignedToDropComp'
import LogSkelton from 'src/components/shimmerLoaders/logSkelton'
import {
  getAllProjects,
  getLeadbyId1,
  steamUsersListByRole,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CSVDownloader from 'src/util/csvDownload'
import { prettyDate, prettyDateTime } from 'src/util/dateConverter'

const SideVisitLeadsBody = ({
  title,
  subtitle,
  leadsLogsPayload,
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
  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })
  const [selVisitDoneBy, setVisitDoneBy] = useState({
    label: 'All Executives',
    value: 'allexecutives',
  })
  const [selVisitFixedBy, setVisitFixedBy] = useState({
    label: 'All Executives',
    value: 'allexecutives',
  })

  const [selProjectEmpIs, setSelProjectEmp] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })

  useEffect(() => {
    console.log('use effect stuff', leadsLogsPayload)
    getProjectsListFun()
  }, [leadsLogsPayload])

  const getProjectsListFun = async () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.uid
        })
        console.log('fetched users list is', projectsListA)

        setprojectList([
          ...projectsListA,
          ...[{ label: 'others', value: 'others' }],
        ])
      },
      (error) => setprojectList([])
    )

    return unsubscribe
  }
  useEffect(() => {
    let projectFilAarray = [...leadsLogsPayload]
    if (selProjectIs?.value == 'allprojects') {
      console.log('project list i s', projectList)

      leadsSerialDatafun()
    } else {
      projectFilAarray = projectFilAarray.filter(
        (d) => d.Project === selProjectIs?.label
      )

      leadsSerialDatafun()
    }

    if (selVisitFixedBy?.value == 'allexecutives') {
      console.log('project list i s', projectList)

      leadsSerialDatafun()
    } else {
      projectFilAarray = projectFilAarray.filter(
        (d) => d.visitFixedBy === selVisitFixedBy?.value
      )

      leadsSerialDatafun()
    }
    if (selVisitDoneBy?.value == 'allexecutives') {
      console.log('project list i s', projectList)

      leadsSerialDatafun()
    } else {
      projectFilAarray = projectFilAarray.filter(
        (d) => d.by === selVisitDoneBy?.value
      )

      leadsSerialDatafun()
    }

    setLeadsFilA(projectFilAarray)
  }, [projectList, selProjectIs, selVisitDoneBy, selVisitFixedBy])

  const leadsSerialDatafun = async () => {
    const streamedTodo = []
    setLoadingIcon(true)
    try {
      const y = await Promise.all(
        leadsLogsPayload.map(async (logData) => {
          const { Luid } = logData
          const x = await getLeadbyId1(orgId, Luid)
          const {
            id,
            Name,
            Project,
            ProjectId,
            Source,
            Status,
            by,
            Mobile,
            Date,
            Email,
            Assigned,
            AssignedBy,
            Notes,
            Timeline,
            documents,
            Remarks,
            notInterestedReason,
            notInterestedNotes,
            stsUpT,
            assignT,
            CT,
            assignedTo,
            assignedToObj,
            coveredA,
          } = await x

          logData.Project = Project
          logData.Name = Name
          logData.id = Luid
          logData.ProjectId = ProjectId
          logData.Status = Status
          logData.Source = Source
          logData.leadOwner = by
          logData.Mobile = Mobile
          logData.Date = Date
          logData.Email = Email
          logData.Assigned = Assigned
          logData.AssignedBy = AssignedBy
          logData.Notes = Notes
          logData.Timeline = Timeline
          logData.documents = documents
          logData.Remarks = Remarks
          logData.notInterestedReason = notInterestedReason
          logData.notInterestedNotes = notInterestedNotes
          logData.stsUpT = stsUpT
          logData.assignT = assignT
          logData.CT = CT
          logData.assignedTo = assignedTo
          logData.assignedToObj = assignedToObj
          logData.coveredA = coveredA
          logData.Time = prettyDate(logData?.T).toLocaleString()
          return logData
        })
      )
      const z = { Project: y?.Project, Time: y.Time }
      setLeadsData(y)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingIcon(false)
    }

    console.log('what matters', streamedTodo)
    await setLeadsData(streamedTodo)
  }
  useEffect(() => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.email
        })
        setusersList(usersListA)
      },
      (error) => setusersList([])
    )

    return unsubscribe
  }, [])

  const selLeadFun = (data) => {
    console.log('data is ', data)
    setisImportLeadsOpen(true)
    setCustomerDetails(data)
  }
  const setNewProject = (leadDocId, value) => {
    setSelProject(value)
  }
  const setVisitDoneByFun = (leadDocId, value) => {
    setVisitDoneBy(value)
  }
  const setVisitFixedByFun = (leadDocId, value) => {
    setVisitFixedBy(value)
  }
  return (
    <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
      <div className="px-4 sm:px-6  z-10 flex flex-row justify-between">
        {subtitle || title} ({leadsFilA.length || 0})
        <section className="flex flex-row">
          <section className="flex flex-col border ml-2 py-1  px-4 text-xs  rounded-full">
            <AssigedToDropComp
              assignerName={selProjectIs?.label}
              id={'id'}
              align="right"
              setAssigner={setNewProject}
              usersList={[
                ...[{ label: 'All Projects', value: 'allprojects' }],
                ...projectList,
              ]}
            />
            <div className="font-md text-xs text-gray-500 mb-[px] tracking-wide mr-4">
              Project {}
            </div>
          </section>
          <section className="flex flex-col ml-2 py-1  border px-4 text-xs  rounded-full">
            <AssigedToDropComp
              assignerName={selVisitFixedBy?.label}
              id={'id'}
              align="right"
              setAssigner={setVisitFixedByFun}
              usersList={[
                ...[{ label: 'All Executives', value: 'allexecutives' }],
                ...usersList,
              ]}
            />
            <div className="font-md text-xs text-gray-500 mb-[px] tracking-wide mr-4">
              Visit Fixed By {}
            </div>
          </section>

          <section className="flex flex-col ml-2 py-1 border px-4 text-xs  rounded-full">
            <AssigedToDropComp
              assignerName={selVisitDoneBy?.label}
              id={'id'}
              align="right"
              setAssigner={setVisitDoneByFun}
              usersList={[
                ...[{ label: 'All Executives', value: 'allexecutives' }],
                ...usersList,
              ]}
            />
            <div className="font-md text-xs text-gray-500 mb-[px] tracking-wide mr-4">
              Visit Done By {}
            </div>
          </section>

          <Tooltip title={`Download ${leadsFilA?.length} Row`}>
            <CSVDownloader
              className="mr-6 h-[20px] w-[20px]"
              downloadRows={leadsFilA}
              sourceTab="visitsReport"
              style={{ height: '20px', width: '20px' }}
            />
          </Tooltip>
        </section>
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
                      { label: 'Lead Ph', id: 'all' },
                      { label: 'Status', id: 'new' },
                      { label: 'From', id: 'all' },
                      { label: 'To', id: 'all' },
                      { label: 'Source', id: 'new' },
                      { label: 'Visit Fixed On', id: 'new' },
                      { label: 'Visit Fixed By', id: 'new' },
                      { label: 'Visited On', id: 'new' },
                      { label: 'Visit Done By', id: 'new' },
                      { label: 'Executive', id: 'all' },
                      { label: 'Created on', id: 'all' },
                      { label: 'By', id: 'all' },
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
                  {leadsFilA?.map((data, i) => {
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
                          {data?.Mobile}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.Status}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.from}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.coverA?.includes('visitdone')
                            ? 'visitdone'
                            : data?.to}
                        </td>

                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.Source}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {prettyDateTime(data?.assignT || data?.Date)}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.visitFixedBy}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.Time}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.by}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.assignedToObj?.name}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {prettyDateTime(data?.Date)}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.leadOwner}
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

export default SideVisitLeadsBody
