import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { MetaTags } from '@redwoodjs/web'
import HrModuleHome from 'src/components/A_HrModule/HrModuleHome'
import SlimSideMenuBar from 'src/components/A_SideMenu/slimSideMenu'
import HeadNavBar2 from 'src/components/HeadNavBar/HeadNavBar2'
import MyActivityHome from 'src/components/MyActivityHome/MyActivityHome'
import SUserSignup from 'src/components/SUserSignup/SUserSignup'
import UserAccessTable from 'src/components/UserAccessTable/UserAccessTable'
import UserManageTable from 'src/components/UserManageTable/UserManageTable'
import AssetsManageTable from 'src/components/A_HrModule/AssetsManagementTable'
import HrSummaryReport from 'src/components/A_HrModule/HrSummaryReport'
import SiderForm from 'src/components/SiderForm/SiderForm'
import ProfileSummary from 'src/components/A_SalesModule/Reports/profileSummary'
import { useAuth } from 'src/context/firebase-auth-context'
import CompanySignup from 'src/components/SCompanySignup/SCompanySignup'



const UsersAdminPage = () => {
  const { user } = useAuth()
  const [isEmpDetailsOpen, setIsEmpDetailsOpen] = useState(false)
  const [isCompanyDetailsOpen, setIsCompanyDetailsOpen] = useState(false)
  const [isAssetViewer, setAssetViewerOpen] = useState(false)
  const handleEmployeeOnClose = () => setIsEmpDetailsOpen(false)
  const handleAssetOnClose = () => setAssetViewerOpen(false)
  const [viewable, setViewable] = useState('User Management')
  const [empData, setEmpData] = useState({})
  const [assetData, setAssetData] = useState({})
  const [selModule, setSelModule] = useState('HR')
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)

  const changeFun = () => {
    setShowCompletedTasks(!showCompletedTasks)
  }
  const editEmployeeFun = (empData) => {
    setEmpData(empData)
    setIsEmpDetailsOpen(true)
  }

  const addCompanyFun = (empData) => {
    setEmpData(empData)
    setIsCompanyDetailsOpen(true)
  }
  const addEditAsset = (assetPayload) => {
    setAssetData(assetPayload)
    setAssetViewerOpen(true)
  }
  return (
    <>
      <MetaTags title="UsersAdmin" description="UsersAdmin page" />

      <div className="flex overflow-y-hidden flex-row overflow-auto h-[100vh]   text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
        <SlimSideMenuBar
          pgName={'hrModule'}
          sourceLink={'hrModule'}
          showSideView1={undefined}
          setViewable={setViewable}
          viewable={viewable}
        />

        <div className="flex-grow   items-center overflow-y-auto no-scrollbar  h-[98%]  px-300  pt-300">
          {/* <HeadNavBar /> */}
          <HeadNavBar2 selModule={selModule} setSelModule={setSelModule} setViewable={setViewable} />
          <div className='mt-1 mx-1 rou'>

          <div className="flex-grow overflow-hidden overflow-auto no-scrollbar bg-white rounded-lg  text-gray-700 ">
            <div className="flex flex-row justify-between items-center flex-shrink-0  px-0  pl-0  ">
              {/* <h1 className="text-lg font-medium">redefine.</h1> */}


              {viewable === 'User Management' && (
                <div className="flex justify-between flex-row mt-3  w-full mr-6   ml-6">
                  <div className="flex flex-row mt-2 mr-2">
                    <span className="ml-2  text-md font-semibold text-black leading-none font-Playfair">Active - Inactive</span>
                     <div className='ml-2'>
                     <Switch
                      checked={showCompletedTasks}
                      onChange={changeFun}
                      className={`${
                        showCompletedTasks ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span
                        className={`${
                          showCompletedTasks ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                     </div>
                  </div>

                  <button
                    onClick={() => editEmployeeFun({})}
                    className="flex items-center justify-center h-10 px-4  bg-gray-200 ml-auto text-sm font-medium rounded hover:bg-gray-300"
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="ml-1 leading-none">Add Employee</span>
                  </button>
                  { ['nithe.nithesh@gmail.com'].includes(user?.email) &&
                  <button
                    onClick={() => addCompanyFun({})}
                    className=" flex items-center justify-center h-10 px-4  bg-gray-200  text-sm font-medium rounded hover:bg-gray-300 ml-2"
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="ml-1 leading-none">Add Company</span>
                  </button>
}
                </div>
              )}
              {viewable === 'AssetsManagement' && (
                <div className="flex flex-row justify-between mt-3 w-full mr-6   ml-6">
                  <div className="flex flex-row mt-2  mr-2">
                    <span className="ml-2 text-md font-semibold text-black leading-none font-Playfair">Active - Inactive</span>
                     <div className='ml-2'>
                     <Switch
                      checked={showCompletedTasks}
                      onChange={changeFun}
                      className={`${
                        showCompletedTasks ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span
                        className={`${
                          showCompletedTasks ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                     </div>
                  </div>

                  <button
                    onClick={() => addEditAsset({})}
                    className="flex items-center justify-center h-10 px-4  bg-gray-200 ml-auto text-sm font-medium rounded hover:bg-gray-300"
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="ml-1 leading-none">Add Asset</span>
                  </button>
                </div>
              )}
            </div>
            {viewable === 'AssetsManagement' && (
              <AssetsManageTable
                editEmployeeFun={editEmployeeFun}
                showCompletedTasks={showCompletedTasks}
              />
            )}
            {viewable === 'User Management' && (
              <UserManageTable
                editEmployeeFun={editEmployeeFun}
                showCompletedTasks={showCompletedTasks}
              />
            )}
            {viewable === 'MyHR' && <HrModuleHome leadsTyper={undefined} />}
            {viewable === 'Roles Management' && (
              <>
                <UserAccessTable showCompletedTasks={showCompletedTasks} />
              </>
            )}
              {viewable === 'userProfile' && <ProfileSummary />}

            {viewable === 'My Activity' && (
              <>
                <MyActivityHome source={'individual'} />
              </>
            )}

            {viewable === 'Team Activity' && (
              <>
                <MyActivityHome source={'team'} />
              </>
            )}


            {viewable === 'projectReports' && (
              <>
              <HrSummaryReport/>
              </>
            )}






            <SUserSignup
              open={isEmpDetailsOpen}
              setOpen={handleEmployeeOnClose}
              title="User"
              empData={empData}
            />

            <CompanySignup
              open={isCompanyDetailsOpen}
              setOpen={setIsCompanyDetailsOpen}
              title="User"
              empData={empData}
            />
            {/* Import Assets */}

            <SiderForm
        open={isAssetViewer}
        setOpen={handleAssetOnClose}
        title="ImportAssets"
        widthClass="max-w-4xl"
      />
          </div>

          </div>
  
        </div>
      </div>
    </>
  )
}

export default UsersAdminPage
