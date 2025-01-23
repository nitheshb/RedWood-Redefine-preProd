import { useState, useEffect } from 'react'

import {
  Tooltip,
} from '@mui/material'
import { useSnackbar } from 'notistack'

import AssigedToDropComp from 'src/components/assignedToDropComp'
import LogSkelton from 'src/components/shimmerLoaders/logSkelton'
import {
  getAllProjects,
  getLeadbyId1,
  steamUsersListByRole,
  streamGetAllProjectTransactions,
  streamGetAllTransactions,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CSVDownloader from 'src/util/csvDownload'
import { prettyDate, prettyDateTime, timeConv } from 'src/util/dateConverter'

const CollectionsDrillI = ({
  title,
  subtitle,
  filterPaylod,
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
  const [finSelData, setFinSelData] = useState([])
  const [finFetchedData, setFinFetchedData] = useState([])


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
  const sortTransactionsByDate = (transactions) => {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.txt_dated)
      const dateB = new Date(b.txt_dated)
      return dateB - dateA
    })
  }
  useEffect(() => {
    console.log('use effect stuff', leadsLogsPayload)
    getProjectsListFun()
  }, [leadsLogsPayload])
  useEffect(() => {
    getProjectTransactionsDataFun()
  }, [])

  useEffect(() => {
    console.log('use effect stuff', finFetchedData)
    const sortedData = sortTransactionsByDate(finFetchedData)
    setFinSelData(sortedData)
  }, [finFetchedData])

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

    return unsubscribe
  }


  const getProjectTransactionsDataFun = async () => {
    console.log('sideview payload', filterPaylod)
      const { access, uid } = user

      const steamLeadLogs = await streamGetAllProjectTransactions(
        orgId,
        'snap',
        {
          projectId: filterPaylod.uid,
        },
        (error) => []
      )
      const sortedData = sortTransactionsByDate(steamLeadLogs)
      setFinFetchedData(sortedData)
    }
  useEffect(() => {
    // let projectFilAarray = [...leadsLogsPayload]
    if (selProjectIs?.value == 'allprojects') {
      console.log('project list i s', projectList)
      // setFiltProjectListTuned(projectList)

      // leadsSerialDatafun()
    } else {
      // projectFilAarray = projectFilAarray.filter((d) => d.projectId === selProjectIs?.value)
      // projectFilAarray = projectFilAarray.filter((d) => d.Project === selProjectIs?.label)

      // leadsSerialDatafun()
      // setFiltProjectListTuned(z)
      // viewSource
    }

    if (selVisitFixedBy?.value == 'allexecutives') {
      console.log('project list i s', projectList)
      // setFiltProjectListTuned(projectList)

      // leadsSerialDatafun()
    } else {
      // projectFilAarray = projectFilAarray.filter((d) => d.visitFixedBy === selVisitFixedBy?.value)

      // leadsSerialDatafun()
      // setFiltProjectListTuned(z)
      // viewSource
    }    if (selVisitDoneBy?.value == 'allexecutives') {
      console.log('project list i s', projectList)
      // setFiltProjectListTuned(projectList)

      // leadsSerialDatafun()
    } else {
      // projectFilAarray = projectFilAarray.filter((d) => d.by === selVisitDoneBy?.value)

      // leadsSerialDatafun()
      // setFiltProjectListTuned(z)
      // viewSource
    }

    // setLeadsFilA(
    //   projectFilAarray
    // )
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
        {/* <Dialog.Title className=" font-semibold text-xl mr-auto ml-3  font-Playfair tracking-wider">
          {subtitle || title} ({leadsFilA.length || 0})
        </Dialog.Title> */}
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
            {/* <IconButton>
            <FileDownloadIcon />
            <CSVDownloader />
          </IconButton> */}

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
            {/* <CustomRadioGroup
              label="Type"
              value={selected}
              options={projectPlans}
              onChange={setSelected}
            /> */}
            {loadingIcon ? (
              <LogSkelton />
            ) : (
              <>
                      <table className="w-full pt-[1px]">
                                      <thead className="">
                                        <tr className="p-2">
                                          <th className="w-2"></th>
                                          <th className="text-left text-xs app-color-black py-2">
                                            <span className="ml-4">From</span>
                                          </th>
                                          <th className="text-left text-xs app-color-black py-2">
                                            <span className="ml-4">Dated as</span>
                                          </th>
                                          <th className="text-left text-xs app-color-black py-2">
                                            Mode
                                          </th>
                                          <th className="text-left text-xs app-color-black py-2">
                                            Details
                                          </th>
                                          <th className="text-right text-xs app-color-black py-2">
                                            <span className="mr-10">Amount</span>
                                          </th>
                                          <th className="text-left text-xs app-color-black py-2">
                                            <span className="mr-10">Assigned to</span>
                                          </th>
                                          <th className="text-left text-xs app-color-black py-2">
                                            <span className="mr-10">Status</span>
                                          </th>

                                          <th className="text-left text-xs app-color-black py-2">
                                            Comments
                                          </th>

                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody className="p-2">
                                        {finSelData?.map((finData, i) => (
                                          <tr
                                            className="app-border-1 border-y border-slate-200 "
                                            key={i}
                                            // onClick={() => viewTransaction(finData)}
                                          >
                                            <td className="pl-3 ">
                                              <div className="flex justify-center text-right items-center rounded-md w-2 h-8 app-bg-yellow-2 app-color-yellow-1 text-xs font-semibold">
                                                {i + 1}
                                              </div>
                                              {/* <div
                                              className={`${
                                                finData?.status === 'received'
                                                  ? 'bg-green-700'
                                                  : finData?.status === 'rejected'
                                                  ? 'bg-yellow-600'
                                                  : 'bg-violet-600'
                                              }   w-24 text-xs font-semibold px-3 py-0.5 rounded-br-md rounded-tl-md text-white`}
                                            >
                                              {finData?.status?.toLocaleUpperCase()}
                                            </div> */}
                                            </td>
                                            <td>
                                              <div className="flex flex-row py-2 ml-4">
                                                <div className="mr-2 w-[3px] rounded-2xl  bg-violet-300 "></div>
                                                <div className="flex flex-col">
                                                  <span className="font-semibold text-sm app-color-black">
                                                    {finData?.customerName ||
                                                      finData?.fromObj?.name ||
                                                      'NA'}
                                                  </span>
                                                  <span className="font-normal text-xs app-color-gray-1">
                                                    {finData?.towards}
                                                  </span>
                                                  <span className="font-normal text-xs app-color-gray-1">
                                                    {finData?.fromObj?.bankName}
                                                  </span>
                                                  <span className="font-normal text-xs app-color-gray-1">
                                                    {finData?.fromObj?.branch}
                                                  </span>
                                                </div>
                                              </div>
                                            </td>
                                            <td>
                                              <div className="flex flex-row ml-4 py-2">
                                                <span className="font-normal text-xs app-color-gray-1">
                                                  {prettyDate(finData?.txt_dated)}
                                                </span>
                                              </div>
                                            </td>
                                            <td>
                                              <div className="flex flex-row py-2">
                                                {/* <div className="mr-2 w-[3px]  bg-gray-100 "></div> */}
                                                <div className="flex flex-col">
                                                  <span className="font-semibold text-sm app-color-black">
                                                    {finData?.mode}
                                                  </span>
                                                  <span className="font-normal text-xs app-color-gray-1">
                                                    {finData?.txt_id}
                                                  </span>
                                                  {/* <span className="font-normal text-xs app-color-gray-1">
                                                    {timeConv(finData?.txt_dated)}
                                                  </span> */}
                                                </div>
                                              </div>
                                            </td>
                                            <td>
                                              <div className="flex flex-row py-2">
                                                {/* <div className="mr-2 w-[3px]  bg-gray-100 "></div> */}
                                                <div className="flex flex-col">
                                                  <span className="font-normal text-xs app-color-gray-1">
                                                    {finData?.txt_id}
                                                  </span>
                                                  <span className="font-normal text-xs app-color-gray-1">
                                                   {timeConv(finData?.txt_dated)}
                                                  </span>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="text-right">
                                              <span className="text-right font-semibold text-sm app-color-gray-1 mr-10">
                                                ₹ {finData?.totalAmount?.toLocaleString('en-IN')}
                                              </span>
                                            </td>
                                            <td className="text-left">
                                              <span className="text-left font-semibold text-sm app-color-gray-1 mr-10">
                                                {finData?.assignedTo || 'NA'}
                                              </span>
                                            </td>

                                            <td>
                                              <span className=" text-left font-normal text-md app-color-gray-1">
                                                {finData?.status}
                                              </span>
                                            </td>
                                            <td>
                                              <span className="font-semibold text-left text-sm app-color-black">
                                                NA
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
              </>
            )}
          </div>
          <div className="mt-0"></div>
        </div>
      </div>
    </div>
  )
}

export default CollectionsDrillI
