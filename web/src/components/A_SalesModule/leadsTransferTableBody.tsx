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

const LeadsTransferTableBody = ({
  title,
  subtitle,
  leadsLogsPayload,
  dialogOpen,
  setCustomerDetails,
  setisImportLeadsOpen,
  setSelectedIds,
  selectedIds,
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
        // setprojectList(projectsListA)
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

    return
  }
  useEffect(() => {
    let projectFilAarray = [...leadsLogsPayload]
    if (selProjectIs?.value === 'allprojects') {
      console.log('project list i s', projectList)
      // setFiltProjectListTuned(projectList);

      leadsSerialDatafun()
    } else {
      // projectFilAarray = projectFilAarray.filter((d) => d.projectId === selProjectIs?.value);
      projectFilAarray = projectFilAarray.filter(
        (d) => d.Project === selProjectIs?.label
      )

      leadsSerialDatafun()
      // setFiltProjectListTuned(z);
      // viewSource
    }

    if (selVisitFixedBy?.value === 'allexecutives') {
      console.log('project list i s', projectList)
      // setFiltProjectListTuned(projectList);

      leadsSerialDatafun()
    } else {
      projectFilAarray = projectFilAarray.filter(
        (d) => d.visitFixedBy === selVisitFixedBy?.value
      )

      leadsSerialDatafun()
      // setFiltProjectListTuned(z);
      // viewSource
    }
    if (selVisitDoneBy?.value === 'allexecutives') {
      console.log('project list i s', projectList)
      // setFiltProjectListTuned(projectList);

      leadsSerialDatafun()
    } else {
      projectFilAarray = projectFilAarray.filter(
        (d) => d.by === selVisitDoneBy?.value
      )

      leadsSerialDatafun()
      // setFiltProjectListTuned(z);
      // viewSource
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

    return
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

  const idExists = (arr, targetId) => arr.some(({ id }) => id === targetId)
  const handleCheckboxChange = (data) => {
    if (idExists(selectedIds, data?.id)) {
      setSelectedIds(
        selectedIds.filter((selectedId) => selectedId.id !== data?.id)
      )
    } else {
      setSelectedIds([...selectedIds, data])
    }
  }

  const handleSelectAllChange = () => {
    if (checkboxCount === leadsFilA.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(leadsFilA)
    }
  }

  const checkboxCount = selectedIds.length

  return (
    <div className="h-full flex flex-col ">
      <div className="z-10 flex flex-row justify-between">
        {'Leads'} ({leadsFilA.length || 0})
        <section className="flex flex-row gap-2">
          <button className=" text-[#0E0A1F]  font-normal text-sm">
            ( {checkboxCount} Selected )
          </button>
          <section className="flex flex-row items-center space-x-2">
            <AssigedToDropComp
              assignerName={selProjectIs?.label}
              id={'id'}
              align="right"
              setAssigner={setNewProject}
              // buttonClassName="  rounded-lg "
              // itemsWrapperClassName=" z-[9000] font-normal"
              // itemButtonClassName=" font-normal"
              // variant="special"
              label="Projects"
              usersList={[
                ...[{ label: 'All Projects', value: 'allprojects' }],
                ...projectList,
              ]}
              customStyles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: 'transparent',
                  // borderColor: '#606062',
                  // '&:hover': {
                  //   borderColor: '#606062',
                  // },
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: '#FFFFFF',
                }),
              }}
            />
            {/* <div className="font-md text-xs text-gray-500 tracking-wide ">
              Project {}
            </div> */}
          </section>

          <Tooltip title={`Download ${selectedIds.length} Row`}>
            {/* <CSVDownloader
              className="mr-6 h-[20px] w-[20px]"
              downloadRows={selectedIds}
              sourceTab="visitsReport"
              style={{ height: '20px', width: '20px' }}
            /> */}
          </Tooltip>
        </section>
      </div>

      <div className="grid  gap-8 grid-cols-1">
        <div className="flex flex-col">
          <div className="flex flex-col rounded-lg ">
            {loadingIcon ? (
              <LogSkelton />
            ) : (
              // <table className="min-w-full  rounded-lg  text-center mt-6">
              <table
                className="min-w-full rounded-2xl overflow-hidden text-center mt-6"
                style={{ borderCollapse: 'separate', borderSpacing: 0 }}
              >
                <thead className="rounded-2xl">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium bg-[#FDEFE7] text-gray-900  "
                    >
                      <label
                        htmlFor="selectAllCheckbox"
                        // style={{ marginRight: '8px' }}
                      >
                        <input
                          id="selectAllCheckbox"
                          type="checkbox"
                          checked={
                            checkboxCount === leadsFilA.length &&
                            leadsFilA.length > 0
                          }
                          onChange={handleSelectAllChange}
                          className="mx-auto accent-black"
                        />
                      </label>
                    </th>

                    {[
                      { label: 'sNo', id: 'no', align: 'left' },
                      { label: 'Project', id: 'label', align: 'center' },
                      { label: 'Lead Ph', id: 'all', align: 'center' },
                      { label: 'Status', id: 'new', align: 'center' },
                      { label: 'Source', id: 'new', align: 'center' },
                      { label: 'Executive', id: 'all', align: 'center' },
                      { label: 'Created on', id: 'all', align: 'center' },
                    ].map((d, i) => (
                      <th
                        key={i}
                        scope="col"
                        className={`text-sm font-medium text-[#000000] bg-[#FDEFE7] px-2 py-2 ${
                          // ['Project', 'Lead Name'].includes(d.label)
                          //   ? 'text-left'
                          //   : ''
                          d.align === 'left' ? 'text-left' : 'text-center'
                        }`}
                      >
                        {/* {d?.label?.toUpperCase()} */}
                        {d?.label?.charAt(0).toUpperCase() +
                          d?.label?.slice(1).toLowerCase()}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {leadsFilA?.map((data, i) => {
                    return (
                      <tr
                        className={`  ${i % 2 === 0 ? 'bg-white' : 'bg-white'}`}
                        key={i}
                        onClick={() => selLeadFun(data)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap w-12">
                          <label className="flex   justify-center">
                            <input
                              type="checkbox"
                              checked={idExists(selectedIds, data.id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                handleCheckboxChange(data)
                              }}
                              className="accent-black"
                            />
                          </label>
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap ">
                          {i + 1}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap ">
                          {data?.Project}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.Mobile}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.Status}
                        </td>

                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.Source}
                        </td>

                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {data?.assignedToObj?.name}
                        </td>
                        <td className="text-sm text-gray-900  px-6 py-2 whitespace-nowrap">
                          {prettyDateTime(data?.Date)}
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

export default LeadsTransferTableBody
