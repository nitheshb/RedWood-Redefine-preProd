/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// import { Link, routes } from '@redwoodjs/router'
import { useState, useEffect } from 'react'

import { useSnackbar } from 'notistack'
import { RootStateOrAny, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { MetaTags } from '@redwoodjs/web'
import SiderForm from 'src/components/SiderForm/SiderForm'
import { USER_ROLES } from 'src/constants/userRoles'
import {
  getAllProjects,
  getBookedUnitsByProject,
  getMyProjects,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { SlimSelectBox } from 'src/util/formFields/slimSelectBoxField'
import UnitBookingSummaryTableLayout from './UnitBookingSummary.tsx/bookingSummaryTableLayout'

const UnitBookingSummaryHomePage = ({
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
  const [ready, setReady] = useState(false)
  const [boardData, setBoardData] = useState([])

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



  const boot = async () => {
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

        console.log('values are',usersListA )
        await setUnitsFetchData(usersListA)

      },
      {
        status: ['booked', 'Booked','agreement_pipeline', 'ATS','sd_pipeline', 'Registered', 'agreement','registered', 'construction', 'possession'],
      },
      () => setTableData([])
    )
    return unsubscribe
  }
  useEffect(() => {
console.log('values are', unitsFetchData.length, selProjectIs.uid)
switch (selProjectIs.value) {
  case 'allprojects':
    return setTableData(unitsFetchData)
  default :
    return setTableData(unitsFetchData.filter((dat) => dat?.pId === selProjectIs.uid))

}
  }, [unitsFetchData,selProjectIs])

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
        let z = [ ...projectsListA]
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

  return (
    <>
      <div className="bg-white ">
        <div className="">
          <div
            className="
             py-2"
          >
            <div className="flex items-center flex-row flex-wrap py-1 pb-2 px-2 justify-between">
              <h2 className="text-lg font-semibold text-black leading-light">
                Booked Units Summary
              </h2>

              <div className="flex">
                <div className=" flex flex-col mr-5  w-40">
                  <SlimSelectBox
                    name="project"
                    label=""
                    className="input "
                    onChange={(value) => {
                      console.log('changed value is ', value.value)
                      setSelProject(value)
                    }}
                    value={selProjectIs?.value}
                    options={[
                      ...[{ label: 'All Projects', value: 'allprojects' }],
                      ...projectList,
                    ]}
                  />
                </div>


              </div>
            </div>

            <MetaTags title="ExecutiveHome" description="ExecutiveHome page" />
            {!ready && (
              <UnitBookingSummaryTableLayout
                setFetchLeadsLoader={setFetchLeadsLoader}
                fetchLeadsLoader={fetchLeadsLoader}
                leadsFetchedData={tableData}
                setisImportLeadsOpen={setisImportLeadsOpen}
                selUserProfileF={selUserProfileF}
                leadsTyper={leadsTyper}
                searchVal={searchValue}
              />
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

export default UnitBookingSummaryHomePage
