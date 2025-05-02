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
  zIndex: theme.zIndex.appBar + 1,
  borderBottom: 0,
  backgroundColor: '#F5F5F5',
}))

const StickyHeaderCell = styled(TableCell)(({ theme }) => ({
  minWidth: '50px',
  left: 0,
  zIndex: theme.zIndex.appBar + 2,
  borderBottom: 0,
  backgroundColor: '#F5F5F5',
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
    backgroundColor: '#F5F5F5',
  },
}))

const StyledCheckBox = styled(Checkbox)(() => ({
  padding: 0,
}))

const UserAccessTable = ({ showCompletedTasks }) => {
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
    await updateAccessRoles(
      orgId,
      role,
      newAccess,
      user,
      enqueueSnackbar,
      element
    )
  }
  return (
    <>
      <div className="p-1 rounded-lg ">
        <div className="h-screen w-full bg-white rounded-lg  flex flex-col">
          <div className="flex flex-row mt-3 ml-6">
            <div className="flex flex-row mt-1 mr-2">
              <span className="ml-2 text-md font-semibold text-black leading-none font-Playfair">
                Feature Access Control{' '}
              </span>
              {/* Access Control Table */}
            </div>
          </div>

          {/* <Box className="flex  mb-[0.5px] bg-white rounded-lg  py-4">
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
      </Box> */}

          <div className="mt-10">
            <Box className="flex items-center mb-[0.5px] bg-white border-b rounded-lg ">
              {[
                {
                  key: 'all',
                  label: 'All',
                  icon: <EyeIcon className="h-5 w-5 mr-1" />,
                },
                { key: 'admin', label: 'Admin' },
                { key: 'crm', label: 'Crm' },
                { key: 'hr', label: 'Hr' },
                { key: 'legal', label: 'Legal' },
                { key: 'project', label: 'Project' },
                { key: 'sales', label: 'Sales' },
                { key: 'admin-team', label: 'Admin Team' },
              ].map(({ key, label, icon }) => (
                <a
                  key={key}
                  // variant="outlined"
                  // size="small"
                  // isCategoryMatched={category === key}
                  onClick={() => setCategory(key)}
                  className={`px-3 py-1 mx-1 capitalize flex items-center text-sm font-medium ${
                    // category === key ? 'border-b-2 border-blue-500' : ''
                    category === key
                      ? 'border-b-2 border-black text-green-800 font-semibold'
                      : 'text-gray-500 hover:text-black'
                  }transition-all duration-200 hover:text-grey-500`}
                >
                  {/* {icon} */}
                  <img alt="" src="/temp2.png" className="h-5 w-5 mr-2" />

                  {/* {label} */}
                  <span className="whitespace-nowrap">{label}</span>
                </a>
              ))}
            </Box>

            <div className="flex-1 mb-10 mt-4  shadow-sm bg-white">
              <div className="h-full ">
                <table className="w-full border-collapse table-fixed  whitespace-nowrap ">
                  <thead className="bg-[#E8E6FE] ">
                    <tr>
                      <th className="sticky left-0 top-0 z-20 w-40  px-4 py-2 text-left font-semibold text-[11px] text-gray-900 border-b border-r">
                        Roles
                      </th>
                      {filterData?.[4]?.access.map(({ name, key }) => (
                        <th
                          key={key}
                          className="sticky top-0 z-10  px-4 py-2 text-center font-semibold text-[11px] text-gray-900 border-b min-w-[200px]"
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filterData.map((item) => (
                      <tr key={item.uid} className="hover:bg-gray-50">
                        <td className="sticky left-0 z-10 bg-white px-4 py-2 text-[12px] text-gray-900 border-r">
                          {item.type}
                        </td>
                        {item?.access.map((element) => (
                          <td key={element.key} className="">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() =>
                                  onRoleChangeListener(item, element)
                                }
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
        </div>
      </div>
    </>
  )
}

export default UserAccessTable
