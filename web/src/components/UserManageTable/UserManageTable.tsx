/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react'
import { PencilIcon } from '@heroicons/react/outline'
import { TrashIcon } from '@heroicons/react/outline'
import { motion } from 'framer-motion'
import {
  deleteUser,
  steamUsersList,
  steaminactiveUsersList,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import WarningModel from '../comps/warnPopUp'

const UserManageTable = ({ editEmployeeFun, showCompletedTasks }) => {
  const { user } = useAuth()

  const { orgId } = user
  const [leadsFetchedData, setLeadsFetchedData] = useState([])
  const [filterData, setFilterData] = useState([])
  const [open, setOpen] = useState(false)
  const [selDelUser, setSelDelUser] = useState({})

  const [selDept, setSelDept] = useState('')
  useEffect(() => {
    getLeadsDataFun()
    setSelDept('all')
  }, [showCompletedTasks])
  useEffect(() => {
    if (selDept === 'all') {
      setFilterData(leadsFetchedData)
    } else {
      console.log(
        ' what am i ',
        selDept,
        leadsFetchedData.filter((userD) => userD.department === selDept)
      )
      setFilterData(
        leadsFetchedData.filter(
          (userD) =>
            userD.department === selDept || userD?.department?.includes(selDept)
        )
      )
    }
  }, [selDept, leadsFetchedData])
  const handleDelete =  () => {
  console.log('delte user is ')

    deleteUser(orgId, selDelUser?.uid, user?.email, selDelUser?.email, selDelUser?.roles)
    setSelDelUser({})
  }
  const getLeadsDataFun = async () => {
    if (showCompletedTasks) {
      const unsubscribe = steaminactiveUsersList(
        orgId,
        (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) =>
            docSnapshot.data()
          )
          console.log('user list is ', usersListA)
          setLeadsFetchedData(usersListA)
        },
        () => setLeadsFetchedData([])
      )
      return unsubscribe
    } else {
      const unsubscribe = steamUsersList(
        orgId,
        (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) =>
            docSnapshot.data()
          )
          setLeadsFetchedData(usersListA)
        },
        () => setLeadsFetchedData([])
      )
      return unsubscribe
    }
  }

  const showOnlyDept = async (category) => {
    setSelDept(category)
  }
  return (
    <div className="flex flex-col">
      <div className="-my-2 px-1 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <section className="flex ml-auto mt-[18px]  bg-white  border-gray-100 py-4 rounded-t-xl px-5 ">
            {[
              { label: 'All', val: 'all' },
              { label: 'Super User', val: 'admin' },
              { label: 'Crm', val: 'crm' },
              { label: 'Marketing', val: 'marketing' },
              { label: 'Project', val: 'project' },
              { label: 'Legal', val: 'legal' },
              { label: 'Sales', val: 'sales' },
              { label: 'Hr', val: 'hr' },
              { label: 'Finance', val: 'finance' },
              { label: 'Construction', val: 'construction' },
              { label: 'Admin Support', val: 'admin_support' },
            ].map((dat, index) => (
              <a
                key={index}
                className={`rounded-full focus:outline-none focus:ring-2  focus:bg-indigo-50 ml-2 focus:ring-indigo-800 mx-1`}
                onClick={() => showOnlyDept(dat.val)}
              >
                <div
                  className={`py-1 px-8 rounded-full font-semibold	  hover:text-[#0ABC31] hover:bg-indigo-100  ${
                    selDept.includes(dat.val)
                      ? 'bg-indigo-100 text-[#0ABC31]'
                      : 'text-gray-600'
                  }`}
                >
                  {dat.label}
                </div>
              </a>
            ))}
          </section>
          <WarningModel
                        type={'Danger'}
                        open={open}
                        setOpen={setOpen}
                        proceedAction={handleDelete}
                        title={'Are you sure you want to delete this user?'}
                        subtext={
                          'This User will be permanently removed. This action cannot be undone.'
                        }
                        actionBtnTxt={'Delete User'}
                      />
          <div className="shadow overflow-hidden border-b border-gray-200  bg-white pb-4  px-2  xl:px-10">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Emp Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dept
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterData.map((person) => (
                  <motion.tr key={person.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={'/avatar_1.png'}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {person.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {person.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {person.empId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {person.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {person.department}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.roles}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 capitalize  font-semibold rounded-full  text-[#0ABC31]">
                        {person?.userStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <PencilIcon
                        className="w-5 h-5 ml-[6px] mb-[4px] inline cursor-pointer"
                        onClick={() => editEmployeeFun(person)}
                      />

                      <TrashIcon
                        className="w-5 h-5 ml-[18px] mb-[4px] inline cursor-pointer"
                        onClick={() =>{
                          setSelDelUser(person)
                          setOpen(true)}}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManageTable
