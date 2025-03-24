/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { EyeIcon, PencilIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { deleteUser, steamUsersList, steaminactiveUsersList } from 'src/context/dbQueryFirebase'
import { TrashIcon } from '@heroicons/react/outline'
import StyledButton from 'src/components/RoundedButton'
import { useAuth } from 'src/context/firebase-auth-context'

const AssetsManageTable = ({ editEmployeeFun, showCompletedTasks }) => {
  const { user } = useAuth()

  const { orgId } = user
  const [leadsFetchedData, setLeadsFetchedData] = useState([])
  const [filterData, setFilterData] = useState([])
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
  const getLeadsDataFun = async () => {
    if(showCompletedTasks) {
      const unsubscribe = steaminactiveUsersList(
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
    }else {
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
      <div className="-my-2  px-1 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <section className="flex ml-auto mt-[18px]  bg-white  py-4 rounded-t-xl px-3 ">
            {[
              { label: 'All', val: 'all' },
              { label: 'Laptop', val: 'admin' },
              { label: 'Mobile', val: 'crm' },
              { label: 'Sim', val: 'marketing' },
              { label: 'Mouse', val: 'project' },
              { label: 'Keyboard', val: 'legal' },
              { label: 'Tab', val: 'sales' },
              { label: 'Car', val: 'hr' },
              { label: 'Locker Keys', val: 'finance' },
              { label: 'AccessCard', val: 'construction' },
              { label: 'Headset', val: 'admin_support' },
              { label: 'Two Wheeler', val: 'admin_support' },


            ].map((dat, index) => (
              <a
                key={index}
                className={``}
                onClick={() => showOnlyDept(dat.val)}
              >
                <div
                  className={`py-1 px-6 flex border-b whitespace-nowrap  ${
                    selDept.includes(dat.val)
                      ? 'border-b-2 border-black text-green-800'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  <img alt="" src="/temp2.png" className="h-5 w-5 mr-1" />

                  {dat.label}
                </div>
              </a>
            ))}
          </section>
          <div className="shadow overflow-hidden border-b border-gray-200  bg-white pb-4  px-4">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-[#E8E6FE]">
                <tr className=''>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left rounded-tl-md text-xs font-semibold text-[#0D027D]  capitalize  tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-[#0D027D]  capitalize  tracking-wider"
                  >
                    Emp Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-[#0D027D]  capitalize  tracking-wider"
                  >
                    Dept
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-[#0D027D]  capitalize  tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-[#0D027D]  capitalize  tracking-wider"
                  >
                    Status
                  </th>
                  {/* <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th> */}
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-[#0D027D] capitalize tracking-wider rounded-tr-md">
                    Edit
                   </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 ">
                {filterData.map((person) => (
                  <motion.tr key={person.email}  className='cursor-pointer border-b border-dashed ' >
                    <td className="px-6 py-1 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={
                              '/avatar_1.png'
                            }
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
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize text-[#0ABC31]">
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
                        onClick={() =>
                          deleteUser(
                            orgId,
                            person?.uid,
                            'nithe.nithesh@gmail.com',
                            person?.email,
                            person?.roles
                          )
                        }
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

export default AssetsManageTable
