import React, { useEffect, useState } from 'react'
import {
  Box,
  Checkbox,
  styled,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { useSnackbar } from 'notistack'
import { EyeIcon } from '@heroicons/react/outline'
import {
  getAllRoleAccess,
  updateAccessRoles,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { getPagesBasedonRoles } from 'src/util/PagesBasedOnRoles'
import StyledButton from 'src/components/RoundedButton'
import { Check } from 'lucide-react'

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  borderTop: '1px solid rgba(224, 224, 224, 1)',
  borderBottom: '1px solid rgba(224, 224, 224, 1)',
}))

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 900,
    fontSize: 12,
    paddingTop: '1rem',
    paddingBottom: '1rem',
    letterSpacing: 0.8,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    textAlign: 'center',
    borderBottom: 0,
    '&:first-child': {
      textAlign: 'left',
    },
  },
}))

const StickyTableCell = styled(TableCell)(({ theme }) => ({
  minWidth: '50px',
  left: 0,
  //position: 'sticky',
  zIndex: theme.zIndex.appBar + 1,
  borderBottom: 0,
  backgroundColor: '#F5F5F5',
}))

const StickyHeaderCell = styled(TableCell)(({ theme }) => ({
  minWidth: '50px',
  left: 0,
  //position: 'sticky',
  zIndex: theme.zIndex.appBar + 2,
  borderBottom: 0,
  backgroundColor: '#F5F5F5',
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
    backgroundColor: '#F5F5F5',
  },
}))

const StyledCheckBox = styled(Checkbox)(() => ({
  padding: 0,
}))

const UserAccessTable = ({showCompletedTasks}) => {
  const [category, setCategory] = useState('all')
  const [settings, setSettings] = useState([])
  const [filterData, setFilterData] = useState([])
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()

  const getAllRoleAccessDocs = async () => {
    const data = await getAllRoleAccess(orgId)
    setSettings(data)
  }
  useEffect(() => {
    getAllRoleAccessDocs()
    setCategory('all')
  }, [])

  useEffect(() => {
    if (category === 'all') {
      console.log('filters are', settings)
      setFilterData(settings)
    } else {
      const updatedData = settings.map((item) => {
        return {
          ...item,
          access: item.access.filter((access) =>
            getPagesBasedonRoles(category).includes(access.key)
          ),
        }
      })
      console.log('filters are', updatedData)

      setFilterData(updatedData)
    }
  }, [category, settings])

  const onRoleChangeListener = async (role, element) => {
    let newAccess = {}
    const newSettings = settings.map((item) => {
      if (item.uid === role.uid) {
        newAccess = item.access.map((accessRole) => {
          if (accessRole.key === element.key) {
            return {
              ...accessRole,
              checked: !element.checked,
            }
          }
          return accessRole
        })
        item.access = newAccess
        return item
      }
      return item
    })
    setSettings(newSettings)
    await updateAccessRoles(orgId,role, newAccess, user, enqueueSnackbar, element)
  }
  return (

    <>
    <div className="h-screen w-full p-4 flex flex-col">
  <Box className="flex  mb-[0.5px] bg-white py-4">
        <StyledButton
          variant="outlined"
          size="small"
          isCategoryMatched={category === 'all'}
          onClick={() => setCategory('all')}
        >
          <EyeIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          All
        </StyledButton>
        <StyledButton
          variant="outlined"
          size="small"
          isCategoryMatched={category === 'admin'}
          onClick={() => setCategory('admin')}
        >
          ADMIN
        </StyledButton>

        <StyledButton
          variant="outlined"
          size="small"
          isCategoryMatched={category === 'crm'}
          onClick={() => setCategory('crm')}
        >
          CRM
        </StyledButton>
        <StyledButton
          variant="outlined"
          size="small"
          isCategoryMatched={category === 'hr'}
          onClick={() => setCategory('hr')}
        >
          HR
        </StyledButton>
        <StyledButton
          variant="outlined"
          size="small"
          isCategoryMatched={category === 'legal'}
          onClick={() => setCategory('legal')}
        >
          LEGAL
        </StyledButton>
        <StyledButton
          variant="outlined"
          size="small"
          isCategoryMatched={category === 'project'}
          onClick={() => setCategory('project')}
        >
          PROJECT
        </StyledButton>
        <StyledButton
          variant="outlined"
          size="small"
          isCategoryMatched={category === 'sales'}
          onClick={() => setCategory('sales')}
        >
          SALES
        </StyledButton>
        <StyledButton
          variant="outlined"
          size="small"
          isCategoryMatched={category === 'sales'}
          onClick={() => setCategory('sales')}
        >
          Admin Team
        </StyledButton>
      </Box>

      <div className="flex-1 mb-10 border rounded-lg shadow-sm overflow-hidden bg-white">
      <div className="h-full overflow-auto">
          {/* Table structure with fixed header and first column */}
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                {/* Fixed header for Roles column */}
                <th className="sticky left-0 top-0 z-20 w-40 bg-gray-50 p-4 text-left font-semibold text-[11px] text-gray-900 border-b border-r">
                  Roles
                </th>
                {/* Other header cells */}
                {
  //               [
  //   { id: 1, name: 'Manage Leads' },
  //   { id: 2, name: 'Display Leads' },
  //   { id: 3, name: 'Approve Documents' },
  // ]
  filterData?.[4]?.access.map(({ name, key })  => (
                  <th
                    key={key}
                    className="sticky top-0 z-10 bg-gray-50 p-4 text-center font-semibold text-[11px] text-gray-900 border-b min-w-[200px]"
                  >
                    {name}
                  </th>
                ))}

              </tr>
            </thead>
            <tbody className="divide-y">
              {
  //             [
  //   { id: 1, name: 'Admin' },
  //   { id: 2, name: 'Manager' },
  //   { id: 3, name: 'Team Lead' },
  //   { id: 4, name: 'Employee' },
  //   { id: 5, name: 'Intern' },
  //   { id: 2, name: 'Manager' },
  //   { id: 3, name: 'Team Lead' },
  //   { id: 4, name: 'Employee' },
  //   { id: 5, name: 'Intern' },
  // ]
  filterData
  .map(item => (
                <tr key={item.uid} className="hover:bg-gray-50">
                  {/* Fixed first column */}
                  <td className="sticky left-0 z-10 bg-white p-4 text-[12px] text-gray-900 border-r">
                    {item.type}
                  </td>
                  {/* Permission cells */}
                  {
  item?.access.map(element => (
                    <td
                      key={element.key}
                      className="p-4"
                    >
                      <div className="flex items-center justify-center">
                        <button
                          // onClick={() => togglePermission(role.id, permission.id)}
                          onClick={() => onRoleChangeListener(item, element)}
                          className={`w-5 h-5 rounded flex items-center justify-center ${
                            element.checked
                              ? 'bg-blue-500 text-white'
                              : 'border border-gray-300'
                          }`}
                        >
                          {element.checked && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                         {/* <StyledCheckBox
                      defaultChecked={element.checked}
                      onChange={() => onRoleChangeListener(item, element)}
                    /> */}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    </>
  )
}

export default UserAccessTable
