/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// import { Link, routes } from '@redwoodjs/router'
import { useState, useEffect } from 'react'

import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone'
import { useSnackbar } from 'notistack'
import DatePicker from 'react-datepicker'
import { RootStateOrAny, useSelector } from 'react-redux'
// import { XIcon } from '@heroicons/react/outline'

// import { XIcon } from '@heroicons/react/outline'

import { v4 as uuidv4 } from 'uuid'

import { MetaTags } from '@redwoodjs/web'

import DropCompUnitStatus from 'src/components/dropDownUnitStatus'
import LLeadsTableView from 'src/components/LLeadsTableView/LLeadsTableView'
import SiderForm from 'src/components/SiderForm/SiderForm'
import { USER_ROLES } from 'src/constants/userRoles'
import {
  addLeadSupabase,
  getAllProjects,
  getBookedUnitsByProject,
  getCpLeadsByAdminStatus,
  getLeadsByAdminStatus,
  getLeadsByStatus,
  getLeadsByStatusUser,
  getLeadsByUnassigned,
  getMyProjects,
  steamUsersListByRole,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { SlimSelectBox } from 'src/util/formFields/slimSelectBoxField'

import UnitBookingSummaryTableLayout from './UnitBookingSummary.tsx/bookingSummaryTableLayout'
import LogSkelton from 'src/components/shimmerLoaders/logSkelton'
import UnitSummaryTableBody from './UnitBookingSummary.tsx/BookingSummaryTable'
import UnitSummaryTableBodyV1 from './UnitBookingSummary.tsx/BookingSummaryTableV1'

const UnitBookingSummaryHomePage1 = ({
  leadsTyper,
  isClicked,
  setIsClicked,
}) => {
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
  const [tableData, setTableData] = useState([])
  const [unitsFetchData, setUnitsFetchData] = useState([])
  const [selSubMenu, setSelSubMenu] = useState('summary')

  const [selSubMenu1, setSelSubMenu1] = useState('summary')
  const [searchValue, setSearchValue] = useState('')
  const [value, setValue] = useState('all')
  const [tabHeadFieldsA, settabHeadFieldsA] = useState([])
  const [mySelRows, setmySelRows] = useState([])

  const [statusSepA, setStatusSepA] = useState([])
  const [viewUnitStatusA, setViewUnitStatusA] = React.useState([
    'Phone No',
    'Last Activity',
  ])
  const [filLeadsA, setFilLeadsA] = useState([])



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

  useEffect(() => {}, [leadsFetchedData])
  const pickCustomViewer = (item) => {
    const newViewer = viewUnitStatusA
    if (viewUnitStatusA.includes(item)) {
      const filtered = newViewer.filter(function (value) {
        return value != item
      })
      setViewUnitStatusA(filtered)
      console.log('reviwed is ', viewUnitStatusA)
    } else {
      setViewUnitStatusA([...newViewer, item])
      console.log('reviwed is add ', viewUnitStatusA)
    }
  }

  useEffect(() => {
    console.log('selected value is', value)
    setFetchLeadsLoader(false)
    switch (value) {
      case 'all':
        return setFilLeadsA(leadsFetchedData)
      default:
        return setFilLeadsA(
          leadsFetchedData.filter((dat) => {
            console.log(
              'filtre value is ',
              dat?.unitStatus,
              value,
              (dat?.unitStatus?.toLowerCase() || dat?.status?.toLowerCase()) ==
                'booked'
            )
            return (
              (dat?.unitStatus?.toLowerCase() || dat?.status?.toLowerCase()) ===
              value?.toLowerCase()
            )
          })
        )
    }
  }, [value, leadsFetchedData])
  useEffect(() => {
    setLeadsFetchedData(tableData)
  }, [tableData])
  const rowsCounter = (parent, searchKey) => {
    return searchKey === 'all'
      ? parent
      : parent.filter(
          (item) =>
            (item?.unitStatus?.toLowerCase() || item?.status?.toLowerCase()) ===
            searchKey.toLowerCase()
        )
  }
  const searchVal = useSelector((state: RootStateOrAny) => state.search)
  useEffect(() => {
    boot()
  }, [projectList])

  useEffect(() => {
    setSearchValue(searchVal)
  }, [searchVal])
  const searchData = useSelector((state: RootStateOrAny) => state.searchData)
  useEffect(() => {
    Object.keys(searchData).length &&
      isClicked &&
      selUserProfileF('User Profile', searchData)
  }, [searchData, isClicked])

  const selUserProfileF = (title, data) => {
    setAddLeadsTypes(title)
    setUnitsViewMode(false)
    setisImportLeadsOpen(true)
    setSelUserProfile(data)
  }

  useEffect(() => {
    // axios
    //   .get('/api/tableData1/all')
    //   .then(({ data }) => {
    //     setTableData(tableData1)
    //   })
    //   .catch((error) => {
    //     // setTableData(tableData1)
    //     console.log(error)
    //   })

    const tabHeadFieldsA1 = [
      { value: 'all', lab: 'All', val: 'all' },
      { value: 'booked', lab: 'Booked' },
      { value: 'allotment', lab: 'Allotment' },
      { value: 'ATS', lab: 'Agreement' },
      { value: 'registered', lab: 'Registered' },
      { value: 'construction', lab: 'Construction' },
      { value: 'possession', lab: 'Possession' },
    ]

    settabHeadFieldsA(tabHeadFieldsA1)

    leadsTyper === 'inProgress'
      ? setValue('all')
      : leadsTyper === 'archieveLeads'
      ? setValue('archieve_all')
      : setValue('booked')
  }, [])
  const boot = async () => {
    // await getProjectsListFun()
    const unsubscribe = await getBookedUnitsByProject(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          const y = projectList.filter((proj) => proj?.uid == x?.pId)
          console.log(',my prject sel is  ===> ', projectList)
          if (y.length > 0) {
            console.log(',my prject sel is ', y)
            x.projName = y[0].projectName
          }
          return x
        })
        // setBoardData
        // console.log('my Array data is ', usersListA, crmCustomersDBData)
        // await serealizeData(usersListA)
        console.log('values are', usersListA)
        await setUnitsFetchData(usersListA)
      },
      {
        status: [
          'booked',
          'Booked',
          'agreement_pipeline',
          'ATS',
          'sd_pipeline',
          'Registered',
          'agreement',
          'registered',
          'construction',
          'possession',
        ],
      },
      () => setTableData([])
    )
    return unsubscribe
  }
  useEffect(() => {
    // unitsFetchData
    console.log('values are', unitsFetchData.length, selProjectIs.uid)
    switch (selProjectIs.value) {
      case 'allprojects':
        return setTableData(unitsFetchData)
      default:
        return setTableData(
          unitsFetchData.filter((dat) => dat?.pId === selProjectIs.uid)
        )
    }
  }, [unitsFetchData, selProjectIs])

  const getProjectsListFun = () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.projectName
        })
        console.log('fetched proejcts list is', projectsListA)
        const z = [...projectsListA]
        setprojectList(z)
      },
      (error) => setprojectList([])
    )
    return unsubscribe
  }
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
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setVal(newValue)
  }
  return (
    <>

    {/* <div className='bg-white w-full h-f'>

    </div> */}
      <div className="bg-white max-w-7xl mx-auto ">
        <div className="">
          <div
            className="
             py-2"
          >

            {!ready && (
              <>
                    {fetchLeadsLoader &&
              [1, 2, 3].map((data, i) => <LogSkelton key={i} />)}
  {statusSepA[0]?.[value].length === 0 && (
              <div className="flex items-center py-6">
                <span
                  className="text-xs text-gray-500"
                  style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    // width: '50%',
                  }}
                >
                  No Records
                </span>
              </div>
            )}
            {statusSepA[0]?.[value].length != 0 && (
              <UnitSummaryTableBodyV1
                // data={filterTable}
                // data={filterTable}
                leadsTyper={leadsTyper}
                fetchLeadsLoader={fetchLeadsLoader}
                selStatus={value}
                rowsParent={statusSepA[0]}
                selUserProfileF={selUserProfileF}
                viewUnitStatusA={viewUnitStatusA}
                newArray={statusSepA[0]?.[value]}
                leadsFetchedData={filLeadsA}
                mySelRows={mySelRows}
                searchVal={searchVal}
              />
            )}
              </>
            )}

          </div>
        </div>
      </div>

      <SiderForm
        open={isImportLeadsOpen}
        setOpen={setisImportLeadsOpen}
        title={'unitDetails_crm_view'}
        customerDetails={selUserProfile}
        widthClass="max-w-7xl"
        transactionData={selUserProfile}
        unitsViewMode={false}
        selCustomerPayload={selUserProfile}
        selSubMenu={selSubMenu}
        selSubMenu2={selSubMenu1}
        setSelUnitDetails={setSelUserProfile}
      />
    </>
  )
}

export default UnitBookingSummaryHomePage1
