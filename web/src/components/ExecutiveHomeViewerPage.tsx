/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect } from 'react'

import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone'
import { startOfMonth } from 'date-fns'
import { useSnackbar } from 'notistack'
import { RootStateOrAny, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import { MetaTags } from '@redwoodjs/web'

import LLeadsTableView from 'src/components/LLeadsTableView/LLeadsTableView'
import { USER_ROLES } from 'src/constants/userRoles'
import {
  addLeadSupabase,
  getCpLeadsByAdminStatus,
  getLeadsByAdminStatus,
  getLeadsByStatus,
  getLeadsByStatusUser,
  getLeadsByUnassigned,
  getMyProjects,
  steamUsersListByRole,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'
import {
  SlimDateSelectBox,
  VerySlimSelectBox,
} from 'src/util/formFields/slimSelectBoxField'
import { SmartCalendarSelect } from 'src/util/formFields/smartCalendarSelect'

import SiderForm from './SiderForm/SiderForm'

// function createGuidId() {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//     const r = (Math.random() * 16) | 0,
//       v = c == 'x' ? r : (r & 0x3) | 0x8
//     return v.toString(16)
//   })
// }
const ExecutiveHomeViewerPage = ({ leadsTyper, isClicked, setIsClicked }) => {
  const uid = uuidv4()

  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const { enqueueSnackbar } = useSnackbar()
  const { orgId, access, projAccessA } = user
  const isImportLeads =
    user?.role?.includes(USER_ROLES.ADMIN) ||
    user?.role?.includes(USER_ROLES.SALES_MANAGER)
  const [isImportLeadsOpen, setisImportLeadsOpen] = useState(false)
  // kanban board
  const [ready, setReady] = useState(false)
  const [boardData, setBoardData] = useState([])
  // const [showForm, setShowForm] = useState(false)
  // const [selectedBoard, setSelectedBoard] = useState(0)
  const [fetchedUsersList, setfetchedUsersList] = useState([])
  const [isOpened, setIsOpened] = React.useState(false)
  const [dateRange, setDateRange] = React.useState([null, null])
  const [startDate, endDate] = dateRange
  // const [shortDateRange, setShortDateRange] = useState(
  //   startOfMonth(new Date()).getTime()
  // )
  const [shortDateRange, setShortDateRange] = useState([null, null])

  const [usersList, setusersList] = useState([])
  const [openUserProfile, setopenUserProfile] = useState(false)
  const [addLeadsTypes, setAddLeadsTypes] = useState('')
  const [selUserProfile, setSelUserProfile] = useState({})
  const [leadsFetchedRawData, setLeadsFetchedRawData] = useState([])
  const [leadsFetchedData, setLeadsFetchedData] = useState([])
  const [serialLeadsData, setSerialLeadsData] = useState([])
  const [projectList, setprojectList] = useState([])
  const [unitsViewMode, setUnitsViewMode] = useState(false)
  const [fetchLeadsLoader, setFetchLeadsLoader] = useState(true)
  const [uuidKey, setUuidKey] = useState(uuidv4())
  const [searchValue, setSearchValue] = useState('')
  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })
  const [selLeadsOf, setSelLeadsOf] = useState({
    label: 'My Leads',
    value: 'myleads',
  })

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
  const searchVal = useSelector((state: RootStateOrAny) => state.search)

  useEffect(() => {
    // setDateRange
    console.log('muy selected value is', shortDateRange)
    // if (shortDateRange.includes(null)) return
    setDateRange(shortDateRange)
  }, [shortDateRange])

  useEffect(() => {
    setSearchValue(searchVal)
  }, [searchVal])
  const searchData = useSelector((state: RootStateOrAny) => state.searchData)
  useEffect(() => {
    Object.keys(searchData).length &&
      isClicked &&
      selUserProfileF('User Profile', searchData)
  }, [searchData, isClicked])
  const archieveFields = ['Dead', 'RNR', 'blocked', 'notinterested', 'junk']
  // useEffect(() => {
  //   getLeadsDataFun()
  // }, [])

  useEffect(() => {
    setFetchLeadsLoader(true)
    if (selLeadsOf?.value == 'myleads') {
      const { uid } = user
      getMyLeadsOrAnyUserLeads(uid)
    } else if (selLeadsOf?.value == 'cpleads') {
      getCpTeamLeads()
    } else if (selLeadsOf?.value == 'teamleads') {
      if (user?.role?.includes(USER_ROLES.ADMIN)) {
        getAdminAllLeads()
      } else {
        getMyTeamLeads()
      }
    } else {
      getMyLeadsOrAnyUserLeads(selLeadsOf?.value)
    }
  }, [selLeadsOf])

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
    if (leadsTyper == 'archieveLeads') {
      const archieveFields1 = [
        'Dead',
        'RNR',
        'blocked',
        'notinterested',
        'junk',
      ]
      setGetStatus(archieveFields1)
      setIsLoading(false)
    } else if (leadsTyper == 'inProgress') {
      const archieveFields2 = [
        'new',
        'followup',
        'unassigned',
        'visitfixed',
        '',
        'visitdone',
        'negotiation',
        'reassign',
        'RNR',
      ]
      setGetStatus(archieveFields2)
    }
  }, [leadsTyper])

  useEffect(() => {
    const unsubscribe = getMyProjects(
      orgId,
      { projAccessA: projAccessA },
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.projectName
        })
        if (user?.role?.includes(USER_ROLES.ADMIN)) {
          setprojectList(projectsListA)
        } else {
          setprojectList(
            projectsListA.filter((d) => projAccessA.includes(d.uid))
          )
        }
      },
      (error) => {
        console.log('error at bro', error)
        setprojectList([])
      }
    )

    return unsubscribe
  }, [])
  const [getStatus, setGetStatus] = useState([])
  useEffect(() => {
    filter_Leads_Projects_Users_Fun()
  }, [selProjectIs, startDate, endDate])

  useEffect(() => {
    filter_Leads_Projects_Users_Fun()
  }, [leadsFetchedRawData])

  const getAdminAllLeads = async () => {
    const { orgId } = user
    if (user?.role?.includes(USER_ROLES.ADMIN)) {
      const unsubscribe = getLeadsByAdminStatus(
        orgId,
        async (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) => {
            const x = docSnapshot.data()
            x.id = docSnapshot.id
            return x
          })

          console.log('my valus are ', usersListA)
          await setLeadsFetchedRawData(usersListA)
          await serealizeData(usersListA)
        },
        {
          status:
            leadsTyper === 'inProgress'
              ? [
                'new',
                'followup',
                'unassigned',
                'visitfixed',
                '',

                'negotiation',
              ]
              : leadsTyper === 'booked'
                ? ['booked']
                : archieveFields,
          projAccessA: projAccessA,
        },
        (error) => setLeadsFetchedData([])
      )
      return unsubscribe
    }
  }
  const getMyTeamLeads = async () => {
    const unsubscribe = await getLeadsByStatus(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })

        await getUnassignedLeads(usersListA)
      },
      {
        status:
          leadsTyper === 'inProgress'
            ? [
              'new',
              'followup',
              'unassigned',
              'visitfixed',
              '',
              'visitdone',
              'visitcancel',
              'negotiation',
              'reassign',
              'RNR',
              // 'booked',
            ]
            : leadsTyper === 'booked'
              ? ['booked']
              : archieveFields,
        projAccessA: projAccessA,
        isCp: user?.role?.includes(USER_ROLES.CP_AGENT),
      },
      (error) => setLeadsFetchedData([])
    )
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
        console.log('my valus are ', usersListA)
        await setLeadsFetchedRawData(usersListA)
        await serealizeData(usersListA)
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

  const getCpTeamLeads = async () => {
    const { orgId } = user
    if (user?.role?.includes(USER_ROLES.ADMIN)) {
      const unsubscribe = getCpLeadsByAdminStatus(
        orgId,
        async (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) => {
            const x = docSnapshot.data()
            x.id = docSnapshot.id
            return x
          })
          usersListA.map((data) => {
            const y = data
            delete y.Note
            delete y.AssignedTo
            delete y.AssignTo
            delete y.AssignedBy
            delete y['Country Code']
            delete y.assignT
            delete y.CT
            delete y.visitDoneNotes
            delete y.VisitDoneNotes
            delete y.VisitDoneReason
            delete y.EmpId
            delete y.CountryCode
            delete y.from
            delete y['Followup date']
            delete y.mode
            delete y.notInterestedNotes
            delete y.notInterestedReason
            y.coveredA = { a: data.coveredA }
            addLeadSupabase(data)
          })
          await setLeadsFetchedRawData(usersListA)
          await serealizeData(usersListA)
        },
        {
          status:
            leadsTyper === 'inProgress'
              ? [
                'new',
                'followup',
                'unassigned',
                'visitfixed',
                '',
                'visitdone',
                'visitcancel',
                'negotiation',
              ]
              : leadsTyper === 'booked'
                ? ['booked']
                : archieveFields,
          projAccessA: projAccessA,
        },
        (error) => setLeadsFetchedData([])
      )
      return unsubscribe
    } else if (access?.includes('manage_leads')) {
      const unsubscribe = await getLeadsByStatus(
        orgId,
        async (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) => {
            const x = docSnapshot.data()
            x.id = docSnapshot.id
            return x
          })

          await getUnassignedLeads(usersListA)
        },
        {
          status:
            leadsTyper === 'inProgress'
              ? [
                'new',
                'followup',
                'unassigned',
                'visitfixed',
                '',
                'visitdone',
                'visitcancel',
                'negotiation',
                'reassign',
                'RNR',
              ]
              : leadsTyper === 'booked'
                ? ['booked']
                : archieveFields,
          projAccessA: projAccessA,
          isCp: true,
        },
        (error) => setLeadsFetchedData([])
      )
    }
  }

  const getUnassignedLeads = (otherData) => {
    const unsubscribe1 = getLeadsByUnassigned(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })

        const xA = [...otherData, ...usersListA]
        await setLeadsFetchedRawData(xA)
        await serealizeData(xA)
      },
      (error) => setLeadsFetchedData([])
    )
    return unsubscribe1
  }
  const filter_Leads_Projects_Users_Fun = () => {
    setFetchLeadsLoader(true)
    const x = leadsFetchedRawData
    console.log('raw max is ==>  ', x.length, x)
    if (selProjectIs?.value != 'allprojects') {
      const z = x
        .filter((d1) => d1.Project === selProjectIs?.value)
        .filter((item) => {
          if (startDate !== null && endDate != null) {
            return (
              item?.Date >= startDate?.getTime() &&
              item?.Date <= endDate?.getTime() + 86399999
            )
          } else if (startDate !== null) {
            return (
              item?.Date >= startDate?.getTime() + 19070000 &&
              item?.Date <= startDate?.getTime() + 86399999
            )
          } else {
            return item
          }
        })
      let y = z
      if (selLeadsOf?.value == 'myleads') {
        y = z
          // .filter((d1) => d1?.assingedTo === user.uid)
          .filter((item) => {
            if (startDate !== null && endDate != null) {
              return (
                item?.Date >= startDate?.getTime() &&
                item?.Date <= endDate?.getTime() + 86399999
              )
            } else if (startDate !== null) {
              return (
                item?.Date >= startDate?.getTime() + 19070000 &&
                item?.Date <= startDate?.getTime() + 86399999
              )
            } else {
              return item
            }
          })
      } else if (selLeadsOf?.value == 'teamleads') {
        y = z.filter((item) => {
          if (startDate !== null && endDate != null) {
            return (
              item?.Date >= startDate?.getTime() &&
              item?.Date <= endDate?.getTime() + 86399999
            )
          } else if (startDate !== null) {
            return (
              item?.Date >= startDate?.getTime() + 19070000 &&
              item?.Date <= startDate?.getTime() + 86399999
            )
          } else {
            return item
          }
        })
      } else {
        console.log('seleUser details are', selLeadsOf?.value)
        y = z
          .filter((d1) => d1?.assignedTo === selLeadsOf?.value)
          .filter((item) => {
            if (startDate !== null && endDate != null) {
              return (
                item?.Date >= startDate?.getTime() &&
                item?.Date <= endDate?.getTime() + 86399999
              )
            } else if (startDate !== null) {
              return (
                item?.Date >= startDate?.getTime() + 19070000 &&
                item?.Date <= startDate?.getTime() + 86399999
              )
            } else {
              return item
            }
          })
      }
      setFetchLeadsLoader(false)
      console.log('my Array data is delayer follow', y.length, new Date())
      setLeadsFetchedData(y)
    } else {
      let y = x
      if (selLeadsOf?.value == 'myleads') {
        console.log('my Array data is delayer 2 yo', x)
        if (startDate !== null) {
          y = x
            // .filter((d1) => d1?.assingedTo === user.uid)
            .filter((item) => {
              if (startDate !== null && endDate != null) {
                return (
                  item?.Date >= startDate?.getTime() &&
                  item?.Date <= endDate?.getTime() + 86399999
                )
              } else if (startDate !== null) {
                return (
                  item?.Date >= startDate?.getTime() + 19070000 &&
                  item?.Date <= startDate?.getTime() + 86399999
                )
              } else {
                return item
              }
            })
        } else {
          y = x
        }
        console.log('my Array data is delayer 2 yo yo', y)
      } else if (
        selLeadsOf?.value == 'teamleads' ||
        selLeadsOf?.value == 'cpleads'
      ) {
        if (startDate !== null) {
          y = x.filter((item) => {
            if (startDate !== null && endDate != null) {
              return (
                item?.Date >= startDate?.getTime() &&
                item?.Date <= endDate?.getTime() + 86399999
              )
            } else if (startDate !== null) {
              return (
                item?.Date >= startDate?.getTime() + 19070000 &&
                item?.Date <= startDate?.getTime() + 86399999
              )
            }
          })
        } else {
          y = x
        }
      } else {
        console.log('seleUser details are', selLeadsOf?.value)
        y = x
          .filter((d1) => d1?.assignedTo === selLeadsOf?.value)
          .filter((item) => {
            if (startDate !== null && endDate != null) {
              return (
                item?.Date >= startDate?.getTime() &&
                item?.Date <= endDate?.getTime() + 86399999
              )
            } else if (startDate !== null) {
              return (
                item?.Date >= startDate?.getTime() + 19070000 &&
                item?.Date <= startDate?.getTime() + 86399999
              )
            } else {
              return item
            }
          })
      }
      console.log('my Array data is delayer follow 1 ', y.length, new Date())
      setLeadsFetchedData(y)
      setFetchLeadsLoader(false)
    }
  }

  const serealizeData = (array) => {
    const x = statusFields.map((status) => {
      const items = array.filter((data) => data.Status.toLowerCase() == status)
      return { name: status, items }
    })
    setSerialLeadsData(x)
  }

  const fSetLeadsType = (type) => {
    setAddLeadsTypes(type)
    setUnitsViewMode(false)
    setisImportLeadsOpen(true)
  }
  const selUserProfileF = (title, data) => {
    setAddLeadsTypes(title)
    setUnitsViewMode(false)
    setisImportLeadsOpen(true)
    setSelUserProfile(data)
  }
  return (
    <>
      <div className=" fixed w-[95%]  h-[100%]  mb-10 ">
        <div className=" bg-white mb-10 rounded-lg mt-1 mx-1 z-10">
          <div className=" bg-white rounded-lg ">
            <div className="bg-white rounded-lg  ">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 rounded-t-md">

                <section className="flex items-center">
                  <img className="w-8 h-8" alt="folder icon" src="/folder-library.svg" />
                  <h2 className="ml-2 text-md font-semibold text-[#2B2B2B] ">
                    Leads Management
                  </h2>
                </section>


                <div className="flex flex-wrap items-center gap-3">

                  <VerySlimSelectBox
                    name="project"
                    label=""
                    className="w-40 rounded-lg"
                    onChange={(value) => {
                      console.log('changed value is ', value.value);
                      setSelProject(value);
                    }}
                    value={selProjectIs?.value}
                    options={[{ label: 'All Projects', value: 'allprojects' }, ...projectList]}
                    customStyles={{
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                          ? '#F25533'
                          : state.isFocused
                            ? '#FDEFE7' 
                            : provided.backgroundColor,
                        color: state.isSelected
                          ? 'white'
                          : state.isFocused
                            ? '#2B2B2B' 
                            : provided.color,
                      }),
                      control: (base) => ({
                        ...base,
                        height: 30,
                        minHeight: 30,
                        padding: 0,
                        borderRadius: 8,
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        alignItems: 'initial',
                        paddingTop: 0,
                        marginTop: 3,
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        paddingTop: 5,
                      }),
                      indicatorSeparator: (base) => ({
                        ...base,
                        marginTop: 6,
                        marginBottom: 10,
                      }),
                      menu: (provided) => ({ ...provided, marginTop: 0, zIndex: 9999, borderRadius: 8,  }),
                      menuList: (provided, state) => ({
                        ...provided,
                        paddingTop: 0,
                        paddingBottom: 0,
                        borderRadius: 8, 
                      }),
                    }}
                  />
{/* 
                  <VerySlimSelectBox
                    name="project"
                    label=""
                    className="w-40 rounded-lg"
                    onChange={(value) => {
                      console.log('changed value is ', value.value);
                      setSelProject(value);
                    }}
                    value={selProjectIs?.value}
                    options={[{ label: 'All Projects', value: 'allprojects' }, ...projectList]}

                  /> */}


                  {access?.includes('manage_leads') && (
                    <VerySlimSelectBox
                      name="leadType"
                      label=""
                      placeholder="My Leads"
                      className="w-40 rounded-lg"
                      onChange={(value) => {
                        console.log('changed value is ', value.value);
                        setSelLeadsOf(value);
                      }}
                      value={selLeadsOf?.value}
                      options={[
                        { label: 'Team Leads', value: 'teamleads' },
                        { label: 'My Leads', value: 'myleads' },
                        { label: 'Cp Leads', value: 'cpleads' },
                        ...usersList,
                      ]}

                      customStyles={{
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? '#F25533'
                            : state.isFocused
                              ? '#FDEFE7' 
                              : provided.backgroundColor,
                          color: state.isSelected
                            ? 'white'
                            : state.isFocused
                              ? '#2B2B2B' 
                              : provided.color,
                        }),
                        control: (base) => ({
                          ...base,
                          height: 30,
                          minHeight: 30,
                          padding: 0,
                          borderRadius: 8,
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          alignItems: 'initial',
                          paddingTop: 0,
                          marginTop: 3,
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          paddingTop: 5,
                        }),
                        indicatorSeparator: (base) => ({
                          ...base,
                          marginTop: 6,
                          marginBottom: 10,
                        }),
                        menu: (provided) => ({ ...provided, marginTop: 0, zIndex: 9999, borderRadius: 8,  }),
                        menuList: (provided, state) => ({
                          ...provided,
                          paddingTop: 0,
                          paddingBottom: 0,
                          borderRadius: 8, 
                        }),
                      }}
                    />
                  )}


                  <SmartCalendarSelect
                    onChange={(value) => {
                      console.log(value, 'Selected Date Range');
                      setShortDateRange(value);
                    }}
                    label="All Dates"
                    defaultForTeamLeads={selLeadsOf?.value === 'teamleads'}

                            customStyles={{
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? '#F25533'
                            : state.isFocused
                              ? '#FDEFE7' 
                              : provided.backgroundColor,
                          color: state.isSelected
                            ? 'white'
                            : state.isFocused
                              ? '#2B2B2B' 
                              : provided.color,
                        }),
                        control: (base) => ({
                          ...base,
                          height: 30,
                          minHeight: 30,
                          padding: 0,
                          borderRadius: 8,
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          alignItems: 'initial',
                          paddingTop: 0,
                          marginTop: 3,
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          paddingTop: 5,
                        }),
                        indicatorSeparator: (base) => ({
                          ...base,
                          marginTop: 6,
                          marginBottom: 10,
                        }),
                        menu: (provided) => ({ ...provided, marginTop: 0, zIndex: 9999, borderRadius: 8,  }),
                        menuList: (provided, state) => ({
                          ...provided,
                          paddingTop: 0,
                          paddingBottom: 0,
                          borderRadius: 8, 
                        }),
                      }}



                  />


                  <button
                    onClick={() => fSetLeadsType('Add Lead')}
                    className="flex items-center px-4 py-1 gap-1 text-sm font-medium text-white sale_bg_color border-2 border-[#F25533] rounded-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 stroke-white"
                      fill="none"
                      viewBox="0 0 22 22"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Add Lead</span>
                  </button>


                  {!user?.role?.includes(USER_ROLES.CP_AGENT) && (
                    <button
                      onClick={() => fSetLeadsType('Import Leads')}
                      className="flex items-center gap-1 px-4 py-1 text-sm font-medium text-black border-2 border-[#F25533] rounded-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 stroke-[#F25533]"
                        fill="none"
                        viewBox="0 0 22 22"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm sale_text_color">Import Lead</span>
                    </button>
                  )}
                </div>
              </div>


              <MetaTags
                title="ExecutiveHome"
                description="ExecutiveHome page"
              />

              {!ready && (
                <div className="	">
                  <LLeadsTableView
                    setFetchLeadsLoader={setFetchLeadsLoader}
                    fetchLeadsLoader={fetchLeadsLoader}
                    leadsFetchedData={leadsFetchedData}
                    setisImportLeadsOpen={setisImportLeadsOpen}
                    selUserProfileF={selUserProfileF}
                    leadsTyper={leadsTyper}
                    searchVal={searchValue}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SiderForm
        open={isImportLeadsOpen}
        setOpen={setisImportLeadsOpen}
        title={addLeadsTypes}
        widthClass="max-w-4xl"
        customerDetails={selUserProfile}
        unitsViewMode={unitsViewMode}
        setUnitsViewMode={setUnitsViewMode}
        setIsClicked={setIsClicked}
      />
    </>
  )
}

export default ExecutiveHomeViewerPage
