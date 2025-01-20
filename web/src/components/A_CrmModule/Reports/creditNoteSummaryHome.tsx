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
  steamUsersCreditNotesList,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { SlimSelectBox } from 'src/util/formFields/slimSelectBoxField'
import CreditNoteSummaryTableLayout from './CreditNoteSummary/CreditNoteSummaryTableLayout'
import { ArrowUpDown, MoveDown, MoveUp } from 'lucide-react'

const CreditNoteSummaryHomePage = ({
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
  }, [])



//   useEffect(() => {
//     setSearchValue(searchVal)
//   }, [searchVal])
//   const searchData = useSelector((state: RootStateOrAny) => state.searchData)
//   useEffect(() => {
//     Object.keys(searchData).length &&
//       isClicked &&
//       selUserProfileF('User Profile', searchData)
//   }, [searchData, isClicked])



  const selUserProfileF = (title, data) => {
    setAddLeadsTypes(title)
    setUnitsViewMode(false)
    setisImportLeadsOpen(true)
    setSelUserProfile(data)
  }



  const boot = async () => {
    await getProjectsListFun()
    const unsubscribe = await steamUsersCreditNotesList(
      orgId,
      async (querySnapshot) => {
        console.log(',my prject sel is  ===> ', querySnapshot.docs)
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
        console.log('values are',usersListA )
        await setUnitsFetchData(usersListA)

      },
      {
        status: ['booked', 'agreement_pipeline', 'sd_pipeline', 'registered'],
      },
      () => setUnitsFetchData([])
    )
    return unsubscribe
  }
  useEffect(() => {
// unitsFetchData
console.log('values are', unitsFetchData.length, selProjectIs?.uid)
switch (selProjectIs?.value) {
  case 'allprojects':
    return setTableData(unitsFetchData)
  default :
    return setTableData(unitsFetchData.filter((dat) => dat?.pId === selProjectIs?.uid))

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
//   useEffect(() => {
//     const unsubscribe = getMyProjects(
//       orgId,
//       { projAccessA: projAccessA },
//       (querySnapshot) => {
//         const projectsListA = querySnapshot.docs.map((docSnapshot) =>
//           docSnapshot.data()
//         )

//         projectsListA.map((user) => {
//           user.label = user.projectName
//           user.value = user.projectName
//         })
//         if (user?.role?.includes(USER_ROLES.ADMIN)) {
//           setprojectList(projectsListA)
//         } else {
//           setprojectList(
//             projectsListA.filter((d) => projAccessA.includes(d.uid))
//           )
//         }
//       },
//       (error) => {
//         console.log('error at bro', error)
//         setprojectList([])
//       }
//     )

//     return unsubscribe


//   }, [])




const [projects, setProjects] = useState([
  { name: 'z', totalUnits: 100, available: 20, sold: 60, blocked: 10, mortgaged: 10 },
  { name: 'A', totalUnits: 80, available: 10, sold: 50, blocked: 15, mortgaged: 5 },
  { name: 'B', totalUnits: 90, available: 30, sold: 40, blocked: 10, mortgaged: 10 },
  { name: 'C', totalUnits: 75, available: 25, sold: 40, blocked: 5, mortgaged: 5 },
  { name: 'D', totalUnits: 110, available: 35, sold: 50, blocked: 15, mortgaged: 10 },
  { name: 'E', totalUnits: 95, available: 20, sold: 55, blocked: 10, mortgaged: 10 },
  { name: 'F', totalUnits: 85, available: 15, sold: 50, blocked: 15, mortgaged: 5 },
  { name: 'G', totalUnits: 70, available: 10, sold: 50, blocked: 5, mortgaged: 5 },
  { name: 'H', totalUnits: 60, available: 15, sold: 30, blocked: 10, mortgaged: 5 },
  { name: 'I', totalUnits: 100, available: 20, sold: 60, blocked: 15, mortgaged: 5 },
]);

const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

const sortedProjects = React.useMemo(() => {
  if (!sortConfig.key) return projects;

  return [...projects].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
}, [projects, sortConfig]);

const handleSort = (key) => {
  setSortConfig((prev) => ({
    key,
    direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
  }));
};

















  return (
    <>
      <div className="bg-white rounded-xl mt-1">
        <div className="">
          <div
            className="
            px-3 py-6"
          >
            {/* <div className="flex items-center flex-row flex-wrap py-1 pb-5 justify-between">
              <h2 className="text-lg font-semibold text-black leading-light font-Playfair">
                Credit Note Summary
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
                      // formik.setFieldValue('project', value.value)
                    }}
                    value={selProjectIs?.value}
                    // options={aquaticCreatures}
                    options={[
                      ...[{ label: 'All Projects', value: 'allprojects' }],
                      ...projectList,
                    ]}
                  />
                </div>


              </div>
            </div> */}



            <div className="p-4 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-800">Credit Note Summary</h1>



        <div className="flex">
                <div className=" flex flex-col mr-5  w-40">
                  <SlimSelectBox
                    name="project"
                    label=""
                    className="input "
                    onChange={(value) => {
                      console.log('changed value is ', value.value)
                      setSelProject(value)
                      // formik.setFieldValue('project', value.value)
                    }}
                    value={selProjectIs?.value}
                    // options={aquaticCreatures}
                    options={[
                      ...[{ label: 'All Projects', value: 'allprojects' }],
                      ...projectList,
                    ]}
                  />
                </div>


              </div>
      </div>

      <div className="w-full bg-white rounded-lg overflow-hidden shadow-md">
        <div className="bg-[#F8F9FC] p-4 rounded-t-lg">
          <h2 className="text-lg text-center font-medium text-[#000000]">
          Credit Note Summary By Project
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse rounded-lg">
            <thead>
              <tr className="bg-[#F8F9FC] border-t border-b border-[#E8ECF4]">
                {['name', 'totalUnits', 'available', 'sold', 'blocked', 'mortgaged'].map((key) => (
                  <th
                    key={key}
                    className="text-left p-2 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4] cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    {key === 'name' ? 'Project Name' : key.charAt(0).toUpperCase() + key.slice(1)}
                    <span className="inline-block ml-2">
                      {sortConfig.key === key ? (
                        sortConfig.direction === 'asc' ? (
                          <MoveUp  className="w-4 h-4 text-gray-600" />
                        ) : (
                          <MoveDown  className="w-4 h-4 text-gray-600" />
                        )
                      ) : (
                        <ArrowUpDown  className="w-4 h-4 text-gray-400" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((project, index) => (
                <tr
                  key={`${project.name}-${index}`} // Unique key
                  className="hover:bg-gray-50 border-b border-[#E8ECF4]"
                >
                  <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{project.name}</td>
                  <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">
                    {project.totalUnits}
                  </td>
                  <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">
                    {project.available}
                  </td>
                  <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{project.sold}</td>
                  <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{project.blocked}</td>
                  <td className="p-4 text-gray-700">{project.mortgaged}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>






















            <MetaTags title="ExecutiveHome" description="ExecutiveHome page" />
            {!ready && (
              <CreditNoteSummaryTableLayout
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
        title={addLeadsTypes}
        widthClass="max-w-4xl"
        customerDetails={selUserProfile}
        unitsViewMode={unitsViewMode}
        setUnitsViewMode={setUnitsViewMode}
        setIsClicked={setIsClicked}
      />
       <SiderForm
        open={isImportLeadsOpen}
        setOpen={setisImportLeadsOpen}
        title={'unitDetails_crm_view'}
        customerDetails={selUserProfile}
        widthClass="max-w-7xl"
        transactionData={selUserProfile}
        unitsViewMode={false}
        selCustomerPayload={selUserProfile}
        selSubMenu={'unit_information'}
        selSubMenu2={'unit_information'}
      />
    </>
  )
}

export default CreditNoteSummaryHomePage
