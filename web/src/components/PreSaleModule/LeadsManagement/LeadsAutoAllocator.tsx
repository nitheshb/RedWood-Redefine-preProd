import { useState, useEffect } from 'react'
import {
  ArrowUp,
  ArrowDown,
  GripVertical,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { steamUsersListByRole } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import {
  getLeadsAllocationOrder,
  upsertLeadsAllocator,
} from './LeadsAutoAllocator/Query'

export default function L_AutoAllocator() {
  const { user } = useAuth()
  const { orgId } = user
  const [usersList, setusersList] = useState([])

  const [data, setData] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])
  // Sort inactive users to bottom initially when component mounts
  useEffect(() => {
    setData(sortInactiveToBottom([...data]))
  }, [])
  const fetchUsers = async () => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        const x = await Promise.all(
          usersListA.map(async (user, i) => {
            user.label = user.displayName || user.name
            user.value = user.uid
            user.role = user.roles.length > 0 ? user.roles[0] : 'N/A'
            user.id = i
            const allocationOrder = await getLeadsAllocationOrder(
              orgId,
              user.uid
            )
            const y = await allocationOrder
            user.order = y?.order || 999999
            user.status = y?.status || 'inactive'
            return user
            //  get the order details from the different collection and add it to the user object
          })
        )

        //  replace it with default order

        console.log('fetched users list is', usersListA)
        x.sort((a, b) => {
          if (a.order > b.order) return 1
          if (a.order < b.order) return -1
          return 0
        })
        setData(x)
      },
      (error) => setData([])
    )

    return
  }
  // Function to toggle user status
  const toggleUserStatus = (id) => {
    setData((prevData) => {
      const updatedData = prevData.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === 'active' ? 'inactive' : 'active',
            }
          : user
      )

      // Sort to move inactive users to the bottom
      return sortInactiveToBottom(updatedData)
    })
  }

  // Function to sort inactive users to the bottom
  const sortInactiveToBottom = (dataArray) => {
    let sortedList = [...dataArray].sort((a, b) => {
      if (a.status === 'inactive' && b.status !== 'inactive') return 1
      if (a.status !== 'inactive' && b.status === 'inactive') return -1
      return 0
    })
    sortedList.map((item, index) => {
      let x = item
      item.order = index + 1
      upsertLeadsAllocator(orgId, item.uid, {
        order: index + 1,
        status: item.status,
      })
      return item
    })
    fetchUsers()
    return sortedList
  }

  const [draggedItem, setDraggedItem] = useState(null)
  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')

  // Handle drag start
  const handleDragStart = (e, index) => {
    setDraggedItem(data[index])
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.parentNode)
    e.target.style.opacity = '0.4'
  }

  // Handle drag over
  const handleDragOver = (e, index) => {
    e.preventDefault()
    const draggedOverItem = data[index]

    // If item is dragged over itself, ignore
    if (draggedItem === draggedOverItem) {
      return
    }

    // Filter out the currently dragged item
    let newItems = data.filter((item) => item !== draggedItem)

    // Add the dragged item at the right position
    newItems.splice(index, 0, draggedItem)

    setData(newItems)
  }

  // Handle drag end
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    setDraggedItem(null)

    // Apply the sorting to keep inactive users at the bottom
    setData((prevData) => sortInactiveToBottom(prevData))
  }

  // Handle sorting
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc'
    setSortDirection(isAsc ? 'desc' : 'asc')
    setSortField(field)

    let sortedData = [...data].sort((a, b) => {
      if (a[field] < b[field]) return isAsc ? 1 : -1
      if (a[field] > b[field]) return isAsc ? -1 : 1
      return 0
    })

    // If we're not sorting by status, still keep inactive users at the bottom
    if (field !== 'status') {
      sortedData = sortInactiveToBottom(sortedData)
    }

    setData(sortedData)
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ArrowUp size={16} />
    ) : (
      <ArrowDown size={16} />
    )
  }

  return (
    <div className="flex flex-col w-full">
      <div className="shadow rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-12 px-3 py-3"></th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Order</span>
                    {getSortIcon('role')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    {getSortIcon('department')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {getSortIcon('status')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((person, index) => (
                <tr
                  key={person?.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
                    person?.status === 'inactive' ? 'bg-gray-50' : ''
                  }`}
                >
                  <td className="px-3 py-4">
                    <div className="flex items-center">
                      <GripVertical
                        size={18}
                        className="text-gray-400 cursor-grab"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {person?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{person?.order}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{person?.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            person?.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : person?.status === 'inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {person?.status}
                      </span>
                      {person?.status !== 'On Leave' && (
                        <button
                          onClick={() => toggleUserStatus(person?.id)}
                          className={`ml-3 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            person?.status === 'active'
                              ? 'bg-blue-600'
                              : 'bg-gray-200'
                          }`}
                          aria-pressed={person?.status === 'active'}
                        >
                          <span className="sr-only">Toggle user status</span>
                          <span
                            className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              person?.status === 'active'
                                ? 'translate-x-5'
                                : 'translate-x-0'
                            }`}
                          >
                            <span
                              className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                                person?.status === 'active'
                                  ? 'opacity-0 duration-100 ease-out'
                                  : 'opacity-100 duration-200 ease-in'
                              }`}
                              aria-hidden="true"
                            >
                              <XCircle size={12} className="text-gray-400" />
                            </span>
                            <span
                              className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                                person?.status === 'active'
                                  ? 'opacity-100 duration-200 ease-in'
                                  : 'opacity-0 duration-100 ease-out'
                              }`}
                              aria-hidden="true"
                            >
                              <CheckCircle
                                size={12}
                                className="text-blue-600"
                              />
                            </span>
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>• Drag rows using the grip handle to reorder</p>
        <p>• Click column headers to sort</p>
        <p>• Use the toggle switch to activate or deactivate users</p>
        <p>
          • inactive users will automatically move to the bottom of the table
        </p>
      </div>
    </div>
  )
}
