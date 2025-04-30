/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'
import { startOfDay } from 'date-fns'
import { Link } from '@redwoodjs/router'
import { USER_ROLES } from 'src/constants/userRoles'
import {
  getAllProjects,
  getLeadsByStatusUser,
  steamUsersListByDeptWithInactive,
  steamUsersListByRole,
  updateLeadAssigTo,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import 'flowbite'
import { VerySlimSelectBox } from 'src/util/formFields/slimSelectBoxField'
import LeadsTransferBody from './leadsTransferBody'

const LeadsTransferHome = ({ project }) => {
  const { user } = useAuth()
  const d = new window.Date()

  const { orgId } = user
  const [customerRawData, setCustomerRawData] = useState([])

  const [isOpenSideView, setIsOpenSideView] = useState(false)

  const [selLeadsOf, setSelLeadsOf] = useState({
    label: 'My Leads',
    value: 'myleads',
  })

  const [selLeadTransferTo, setSelLeadTransferTo] = useState({
    label: 'My Leads',
    value: 'myleads',
  })
  const [fetchLeadsLoader, setFetchLeadsLoader] = useState(true)

  const [isImportLeadsOpen, setisImportLeadsOpen] = useState(false)

  const [usersAllList, setUsersAllList] = useState([])
  const [usersList, setusersList] = useState([])

  const [leadsFetchedRawData, setLeadsFetchedRawData] = useState([])

  const [leadsFetchedData, setLeadsFetchedData] = useState([])

  const [serialLeadsData, setSerialLeadsData] = useState([])

  const [showOnlyDone, setShowOnlyDone] = useState(false)

  const [sourceDateRange, setSourceDateRange] = React.useState(
    startOfDay(d).getTime()
  )
  const [dateRange, setDateRange] = React.useState([null, null])

  const [selectedIds, setSelectedIds] = useState([])

  const [leadsTyper, setLeadsTyper] = useState('inProgress')
  const [searchKey, setSearchKey] = useState(['new'])
  const [currentStatus, setCurrentStatus] = useState(['new'])
  const archieveFields = ['Dead', 'RNR', 'blocked', 'notinterested', 'junk']
  const statusFields = [
    'new',
    'followup',
    'visitfixed',
    'visitdone',
    'negotiation',
    'reassign',
    'RNR',
    'booked',
  ]

  const [availType, setAvailType] = useState({
    projectName: '',
    uid: '',
    value: '',
  })

  const registerA = [
    {
      label: 'Booking',
      projectName: 'Blocked',
      value: 'booking',
    },
    {
      label: 'Booking',
      projectName: 'Booking',
      value: 'booking',
    },
    {
      label: 'Agreement',
      projectName: 'Agreement',
      value: 'agreement',
    },
    {
      label: 'Registered',
      projectName: 'registered',
      value: 'registered',
    },
    {
      label: 'Rejected',
      projectName: 'Released',
      value: 'rejected',
    },
  ]

  useEffect(() => {
    const unsubscribe = steamUsersListByDeptWithInactive(
      orgId,
      ['sales', 'sales-manager', 'sales-executive'],
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })

        setUsersAllList(usersListA)
      },
      (error) => setUsersAllList([])
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })

        setusersList(usersListA)
      },
      (error) => setusersList([])
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    setFetchLeadsLoader(true)
    if (selLeadsOf?.value == 'myleads') {
      const { uid } = user
      getMyLeadsOrAnyUserLeads(uid)
    } else if (selLeadsOf?.value == 'cpleads') {
    } else if (selLeadsOf?.value == 'teamleads') {
      if (user?.role?.includes(USER_ROLES.ADMIN)) {
      } else {
      }
    } else {
      getMyLeadsOrAnyUserLeads(selLeadsOf?.value)
    }
  }, [selLeadsOf])

  useEffect(() => {
    getProjects()
  }, [])
  const getProjects = async () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        projects.map((user) => {
          user.label = user?.projectName
          user.value = user?.uid
        })
        setCustomerRawData([...projects])
        console.log('project are ', projects)
      },
      () => setCustomerRawData([])
    )
    return unsubscribe
  }

  const serealizeData = (array) => {
    // let newData =
    const x = statusFields.map((status) => {
      const items = array.filter((data) => data.Status.toLowerCase() == status)
      return { name: status, items }
    })
    setSerialLeadsData(x)
  }
  const getMyLeadsOrAnyUserLeads = async (userId) => {
    const { access, uid, orgId } = user
    const unsubscribe = getLeadsByStatusUser(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })
        // setBoardData
        console.log('my valus are ', usersListA)
        await setLeadsFetchedRawData(usersListA)
        await serealizeData(usersListA)
        // filter_Leads_Projects_Users_Fun()

        await setLeadsFetchedData(usersListA)
      },
      {
        isCp: user?.role?.includes(USER_ROLES.CP_AGENT),
        uid: userId,
        status:
          leadsTyper === 'inProgress'
            ? [
                'new',
                'followup',
                'unassigned',
                'visitfixed',
                'visitcancel',
                '',
                'visitdone',
                'negotiation',
                'reassign',
                'RNR',
                // 'booked',
              ]
            : leadsTyper === 'booked'
            ? ['booked']
            : archieveFields,
      },
      (error) => setLeadsFetchedData([])
    )
    return unsubscribe
  }

  const selProjctFun = (project) => {
    setIsOpenSideView(!isOpenSideView)
    console.log('check it', project)
    setSelLeadsOf(project)
  }

  const selAvailFun = (project) => {
    setAvailType(project)
  }

  const tranferLeads = () => {
    console.log('hello it', selectedIds, selLeadTransferTo, user)
    selectedIds.map((data) => {
      const projId = data?.ProjectId
      const { id: leadDocId, assignedTo, Status } = data
      const txt = `A New Lead is assigned to ${selLeadTransferTo?.name}`
      updateLeadAssigTo(
        orgId,
        projId,
        leadDocId,
        selLeadTransferTo,
        assignedTo?.uid,
        Status,
        data,
        1,
        txt,
        user?.email
      )
    })
    setSelectedIds([])
  }

  return (
    <>
      <section className=" mt-1 mx-1 py-6 mb-8 leading-7 text-gray-900 bg-[#FDFDFD]  rounded-lg  ">
        <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">
          <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
            <div className="flex items-center flex-shrink-0  px-0  pl-0   mb-1">
              <Link className="flex items-center">
                <span className="relative z-10 flex items-center w-auto text-md font-medium leading-none pl-0">
                  Leads Transfer
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-2">
            <form className="">
              <div className="flex">
                <div className="relative w-full  pb-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <section className="flex gap-2 flex-row">
                      <section>
                        {/* <div className="font-semibold">Transfer From</div> */}
                        <VerySlimSelectBox
                          name="project"
                          label=""
                          placeholder="Transfer From"
                          className="input w-[30%]  placeholder-black text-black "
                          onChange={(value) => {
                            console.log('changed value is ', value.value)
                            selProjctFun(value)
                          }}
                          value={selLeadsOf?.value}
                          options={[...usersAllList]}
                        />
                      </section>

                      <section>
                        {/* <div className="font-semibold">{'Transfer To'}</div> */}

                        <VerySlimSelectBox
                          name="project"
                          label=""
                          placeholder="Transfer To"
                          className="input w-[30%] placeholder-black text-black  "
                          onChange={(value) => {
                            console.log('changed value is ', value.value)
                            setSelLeadTransferTo(value)
                          }}
                          value={selLeadTransferTo?.value}
                          options={[...usersList]}
                        />
                      </section>
                    </section>

                    <section>
                      <section
                        className="text-white bg-[#F25533]  text-[12px] rounded-md px-3 py-3 font-medium leading-[100%]  cursor-pointer"
                        onClick={() => tranferLeads()}
                      >
                        Apply Lead Transfer
                      </section>
                    </section>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {selLeadsOf == undefined && (
            <div className="py-8 px-8 mt-10 flex flex-col items-center bg-red-100 rounded">
              <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                <img
                  className="w-[180px] h-[180px] inline"
                  alt=""
                  src="/templates.svg"
                />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-gray-900">
                No Units Found
              </h3>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                <span className="text-blue-600"></span>
              </time>
            </div>
          )}

          <div className="">
            <div>
              <div className=" rounded px-1 mb-3">
                {/* <div className="font-semibold">Current Lead Status</div> */}
                <div className="sm:flex items-center justify-between rounded  ">
                  <div className="flex items-center">
                    {[
                      {
                        lab: 'All',
                        val: 'all',
                        match: ['all'],
                      },
                      {
                        lab: 'New',
                        val: 'new',
                        match: ['new'],
                      },
                      {
                        lab: 'Followup',
                        val: 'followup',
                        match: ['followup'],
                      },
                      {
                        lab: 'Visit Fixed',
                        val: 'visitfixed',
                        match: ['visitfixed'],
                      },
                      {
                        lab: 'Visit Done',
                        val: 'visitdone',
                        match: ['visitdone'],
                      },

                      {
                        lab: 'Not Interested',
                        val: 'notinterested',
                        match: ['notinterested'],
                      },
                    ].map((d, i) => {
                      return (
                        // <a
                        //   key={i}
                        //   className=" focus:outline-none mr-2"
                        //   href="javascript:void(0)"
                        //   onClick={() => setCurrentStatus(d.match)}
                        // >
                        //   <div
                        //     className={`px-3  pt-[2px] pb-[4px] text-[14px]  ${
                        //       currentStatus.includes(d.val)
                        //         ? 'border-b-2 border-black'
                        //         : ''
                        //     }`}
                        //   >
                        //     {d.lab}
                        //   </div>

                        //   <div className="h-12 border-r rounded-sm border-[#E7E7E9] mx-4 last:border-none"></div>

                        // </a>

                        <div key={i} className="flex items-center">
                          <a
                            className="focus:outline-none"
                            href="javascript:void(0)"
                            onClick={() => setCurrentStatus(d.match)}
                          >
                            <div
                              className={` flex flex-col items-center ${
                                currentStatus.includes(d.val)
                                  ? 'border-b-2 border-black text-[#0E0A1F]'
                                  : 'text-[#606062]'
                              }`}
                            >
                              <span className="text-sm font-normal">
                                {d.lab}
                              </span>
                              {/* <span className="text-xs mt-1">{d.count}</span> */}
                            </div>
                          </a>
                          {i !== 5 && (
                            <div className="h-4 border-r mx-4 border-gray-200"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div>
              {!false && (
                <LeadsTransferBody
                  leadAssignedTo={selLeadsOf?.value}
                  coveredStatus={searchKey}
                  currentStatus={currentStatus}
                  setSelectedIds={setSelectedIds}
                  selectedIds={selectedIds}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LeadsTransferHome
