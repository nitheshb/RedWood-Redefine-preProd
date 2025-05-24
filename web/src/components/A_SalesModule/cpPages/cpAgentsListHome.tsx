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
  steamUsersListCpAgents,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import 'flowbite'
import { VerySlimSelectBox } from 'src/util/formFields/slimSelectBoxField'
import LeadsTransferBody from '../leadsTransferBody'
import SiderForm from 'src/components/SiderForm/SiderForm'
import CpAgentListTable from './cpAgentListTable'


const CPAgentsListHome = ({ project }) => {
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

    return
  }, [])

  useEffect(() => {
    const unsubscribe1 = steamUsersListCpAgents(
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

    return



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
    return
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
    return
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
      <section className=" mt-1 mx-1  mb-8 leading-7 text-gray-900 bg-[#FFFFFF]  rounded-lg  ">
        <div className="box-border px-4 mx-auto border-solid  py-4 max-w-full ">
          <div className="flex flex-col  leading-7   text-gray-900 border-0 border-gray-200 ">

            <section className="flex items-center">
              <img
                className="w-8 h-8"
                alt="folder icon"
                src="/folder-library.svg"
              />
              <h2 className=" ml-2 text-md font-semibold text-[#2B2B2B] ">
                Channel Partners
              </h2>
            </section>
          </div>

          <div className="mt-2">
            <form className="">
              <div className="flex">
                <div className="relative w-full  pb-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <section className="flex gap-2 flex-row">



                    </section>

                    <section>
                      <section
                        className=" sale_bg_color s_btn_txt_color text-[12px] rounded-md px-3 py-3 font-medium leading-[100%]  cursor-pointer"
                        onClick={() => setisImportLeadsOpen(true)}

                      >
                        Import CP
                      </section>
                    </section>
                  </div>
                </div>
              </div>
            </form>
          </div>


          <div className="">
            <div>
            <CpAgentListTable
                  cpUsersList={usersList}
                />
            </div>
          </div>
        </div>
      </section>
      <SiderForm
        open={isImportLeadsOpen}
        setOpen={setisImportLeadsOpen}
        title={'ImportCP'}
        widthClass="max-w-4xl"
        // setIsClicked={setIsClicked}
      />
    </>
  )
}

export default CPAgentsListHome
