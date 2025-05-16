/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react'
import { useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { alpha } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { visuallyHidden } from '@mui/utils'
import PropTypes from 'prop-types'
import Highlighter from 'react-highlight-words'

import {
  getAllProjects,
  steamUsersListByRole,
  steamUserTodayProgress,
  streamSaleUserActivityLog,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import CSVDownloader from 'src/util/csvDownload'
import {
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
} from 'src/util/dateConverter'

import RecentActivity from './Charts_Graphs/RecentActivity'
import TaskProgress from './Charts_Graphs/TaskProgress'
import LogSkelton from './shimmerLoaders/logSkelton'
import SiderForm from './SiderForm/SiderForm'
import TodoListView from './todoList'
import ActivityLogComp from './A_SalesModule/LeadProfileSideView/activityLog'
import UserActivityLogHomeSlim from './A_SalesModule/LeadProfileSideView/userActivityLogHomeSlim'

const headCells = [
  {
    id: 'Date',
    numeric: false,
    disablePadding: true,
    label: 'Date',
  },
  {
    id: 'Clientdetails',
    numeric: false,
    disablePadding: false,
    label: 'Client Details',
  },
  {
    id: 'Assigned',
    numeric: false,
    disablePadding: false,
    label: 'Assigned',
  },
  {
    id: 'Source',
    numeric: false,
    disablePadding: false,
    label: 'Source',
  },
  {
    id: 'Project',
    numeric: false,
    disablePadding: false,
    label: 'Project',
  },
  {
    id: 'Currentstatus',
    numeric: true,
    disablePadding: false,
    label: 'Current Status',
  },
  {
    id: 'Notes',
    numeric: true,
    disablePadding: false,
    label: 'Notes',
  },
]

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    searchKey,
  } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  searchkey: PropTypes.number.isRequired || PropTypes.string.isRequired,
}

const EnhancedTableToolbar = (props) => {
  const { numSelected, selStatus, filteredData, setSearchKey, rows } = props

  const [rowsAfterSearchKey, setRowsAfterSearchKey] = React.useState(rows)
  const [settimeMilli, setTimeMilli] = React.useState('')

  React.useEffect(() => {
    setRowsAfterSearchKey(rows)
  }, [rows])

  const searchKeyField = (e) => {
    // console.log('searched values is ', e.target.value)
    setSearchKey(e.target.value)
    const searchString = e.target.value

    const rowsR = rows.filter((item) => {
      if (searchString == '' || !searchString) {
        console.log('ami here')
        return item
      } else if (
        // item.Assignedto.toLowerCase().includes(searchString.toLowerCase()) ||

        item.Email.toLowerCase().includes(searchString.toLowerCase()) ||
        item.Mobile.toLowerCase().includes(searchString.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchString.toLowerCase()) ||
        item.Project.toLowerCase().includes(searchString.toLowerCase()) ||
        item.Source.toLowerCase().includes(searchString.toLowerCase()) ||
        item.Status.toLowerCase().includes(searchString.toLowerCase())
      ) {
        return item
      }
    })
    setRowsAfterSearchKey(rowsR)
    // setRows(rowsR)
  }
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 2, sm: 2 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <span className="relative  p-1 border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 absolute left-0 ml-1 mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder={`Search...${selStatus}`}
          onChange={searchKeyField}
          className="ml-6 bg-transparent focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none"
        />
      </span>

      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {' '}
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="subtitle2"
          id="tableTitle"
          component="div"
        >
          <span className="ml-3">Showing {rowsAfterSearchKey.length}</span>
        </Typography>
      )}
      <span style={{ display: 'flex' }}>
        <Tooltip title={`Download ${rowsAfterSearchKey.length} Rows`}>
          {/* <IconButton>
            <FileDownloadIcon />
            <CSVDownloader />
          </IconButton> */}
          <IconButton className="bg-gray-200">
            <EventNoteTwoToneIcon />
          </IconButton>
        </Tooltip>

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton className="bg-gray-200">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={`Download ${rowsAfterSearchKey.length} Rows`}>
            {/* <IconButton>
            <FileDownloadIcon />
            <CSVDownloader />
          </IconButton> */}

            <CSVDownloader className="mr-6" downloadRows={rowsAfterSearchKey} />
          </Tooltip>
        )}
      </span>
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selStatus: PropTypes.string.isRequired,
  filteredData: PropTypes.array.isRequired,
  searchKey: PropTypes.string || PropTypes.number,
}

const HighlighterStyle = (props) => {
  const { searchKey, source } = props
  return (
    <Highlighter
      highlightStyle={{
        backgroundColor: '#ffc069',
        padding: 0,
      }}
      searchWords={[searchKey]}
      autoEscape
      textToHighlight={source}
    />
  )
}
export default function TodayLeadsActivitySearchView({
  moduleName,
  selStatus,
  rowsParent,
  todaySch,
  schLoading,
  taskType,
  searchKey,
  setSearchKey,
}) {
  const { user } = useAuth()
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('calories')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [rows, setRows] = React.useState([])

  const [isImportLeadsOpen, setisImportLeadsOpen] = React.useState(false)

  const [isImportLeadsOpen1, setisImportLeadsOpen1] = React.useState(false)
  const [isViewTaskMan, setisViewTaskMan] = React.useState(false)
  const [addLeadsTypes, setAddLeadsTypes] = React.useState('')
  const [selUserProfile, setSelUserProfile] = React.useState({})
  const [selTaskMan, setSelTaskMan] = React.useState({})
  const [schFetData, setSchFetData] = React.useState([])
  const [schFetCleanData, setSchFetCleanData] = React.useState([])
  const [leadByViewLayout, setLeadByViewLayout] = React.useState(false)
  const [projectList, setprojectList] = useState([])
  const [usersList, setusersList] = useState([])
  const [sortType, setSortType] = useState('Latest')

  const [userTodayPerfA, setUserTodayPerfA] = useState({})
  const [userActivityA, setUserActivityA] = useState([])


  const [selProjectIs, setSelProject] = useState({
    label: 'All Projects',
    value: 'allprojects',
  })
  const [selLeadsOf, setSelLeadsOf] = useState({
    label: 'My Tasks Leads',
    value: 'mytasks',
  })
  React.useEffect(() => {
    console.log('send values is', rowsParent)
    filterStuff(rowsParent)
  }, [selStatus, rowsParent])
  useEffect(() => {
    getMyTodayProgress()
    getMyTodayActivity()
  }, [])

  const getMyTodayProgress = async () => {
    const unsubscribe = steamUserTodayProgress(
      user?.orgId,
      (doc) => {
        const myTaskA = doc.data()

        console.log('fetched users activity is', myTaskA)

        setUserTodayPerfA(myTaskA)
      },
      { uid: user?.uid },
      (error) => setUserTodayPerfA([])
    )

    return
  }

  useEffect(() => {
    const unsubscribe = getAllProjects(
      user?.orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.uid
        })
        console.log('fetched projects list is', projectsListA)
        setprojectList(projectsListA)
      },
      (error) => setprojectList([])
    )

    return
  }, [])

  useEffect(() => {
    const unsubscribe = steamUsersListByRole(
      user?.orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )

        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })
        console.log('fetched users list is', usersListA)

        setusersList(usersListA)
      },
      (error) => setusersList([])
    )

    return
  }, [])

  const sorterFilterFun = async (todaySch) => {
    console.log('max check it my value is ', todaySch)
    const streamedTodo = []
    let y = []

    let TaskStatusReq = []
    if (searchKey.includes('upcoming')) {
      TaskStatusReq = ['pending']
    } else {
      TaskStatusReq = searchKey
    }

    y = await todaySch?.filter((item) => {
      console.log('yo you', item?.staA, searchKey, TaskStatusReq)
      if (selLeadsOf?.value == 'mytasks') {
        return (
          item?.staA.some((r) => TaskStatusReq.includes(r)) &&
          item?.assignedTo === user?.uid
        )
      } else if (selLeadsOf?.value === 'teamtasks') {
        return item?.staA.some((r) => TaskStatusReq.includes(r))
      } else {
        return (
          item?.staA.some((r) => TaskStatusReq.includes(r)) &&
          item?.assignedTo === selLeadsOf?.value
        )
      }
    })

    await setSchFetData(y)
    console.log('full today data 0', todaySch.length)
    const z = todaySch.map((data1) => {
      data1['staDA'].map((data2) => {
        const y = data1[data2]

        if (
          searchKey.length == 1 &&
          searchKey.includes('pending') &&
          y['sts'] === 'pending'
        ) {
          // make sure if date less than tomorrow is added
          if (y['schTime'] < torrowDate) {
            y.uid = data1.uid
            y.id = data1.uid
            y.leadUser = data1.leadUser
            streamedTodo.push(y)
            console.log('full today data 1', torrowDate, streamedTodo.length)
            return y
          } else {
            return
          }
        }

        if (searchKey.length == 1 && searchKey.includes('upcoming')) {
          // make sure if date greater than tomorrow is added
          if (y['schTime'] > torrowDate) {
            y.uid = data1.uid
            y.leadUser = data1.leadUser
            streamedTodo.push(y)
            console.log('my value is 1', y)
            return y
          } else {
            return
          }
        }

        y.uid = data1.uid
        y.id = data1.uid
        y.leadUser = data1.leadUser
        streamedTodo.push(y)
        console.log('my value is 1', y)
        return y
      })
    })
    // this is for list view
    if (sortType === 'Latest') {
      streamedTodo.sort((a, b) => {
        return b.schTime - a.schTime
      })
    } else {
      streamedTodo.sort((a, b) => {
        return a.schTime - b.schTime
      })
    }
    setSchFetCleanData(streamedTodo)
    console.log('my value is 1', searchKey, z, streamedTodo)
  }

  React.useEffect(() => {
    if (sortType === 'Latest') {
      schFetCleanData.sort((a, b) => {
        return a.schTime - b.schTime
      })
      setSchFetCleanData(schFetCleanData)
    } else {
      console.log('inside oldest', sortType)
      schFetCleanData.sort((a, b) => {
        return b.schTime - a.schTime
      })
      setSchFetCleanData(schFetCleanData)
    }
  }, [sortType])
  React.useEffect(() => {
    if (todaySch) {
      const z = todaySch?.filter((item) => {
        if (selLeadsOf?.value == 'mytasks') {
          return item
        } else if (selLeadsOf?.value === 'teamtasks') {
          console.log('zoro i s teamtasks')
          console.log('zoro condition', selProjectIs?.value)
          return selProjectIs?.value === 'allprojects'
            ? item
            : item?.leadUser.ProjectId === selProjectIs?.value
        } else {
          console.log('zoro i s else statement')
          console.log(
            'zoro condition 1',
            selProjectIs?.value,
            selLeadsOf?.value
          )
          if (selProjectIs?.value === 'allprojects') {
            return item?.leadUser?.assignedTo === selLeadsOf?.value
          } else {
            return (
              item?.assignedTo === selLeadsOf?.value &&
              item?.leadUser?.ProjectId === selProjectIs?.value
            )
          }
        }
      })
      console.log('zoro i s', z, todaySch)
      sorterFilterFun(z)
    } else {
      console.log('my value is ', todaySch)
    }
  }, [todaySch, searchKey, selLeadsOf, selProjectIs])

  const filterScheduleArry = (staDA, data1) => {
    const streamedTodoLeadsFormat = []
    staDA.map((data2) => {
      const y = data1[data2]

      if (
        searchKey.length == 1 &&
        searchKey.includes('pending') &&
        y['sts'] === 'pending'
      ) {
        // make sure if date less than tomorrow is added

        if (y['schTime'] < torrowDate) {
          console.log('insertion 1', data2)
          streamedTodoLeadsFormat.push(data2)
          console.log('my value is 1', y)
          return y
        } else {
          return
        }
      }

      if (searchKey.length == 1 && searchKey.includes('upcoming')) {
        // make sure if date greater than tomorrow is added
        if (y['schTime'] > torrowDate) {
          console.log('insertion 2', data2)
          streamedTodoLeadsFormat.push(data2)
          return
        } else {
          return
        }
      }
      // if searchKey pending

      console.log('insertion 3', data2)
      if (searchKey.includes(y['sts'])) {
        streamedTodoLeadsFormat.push(data2)
      }
      return y
    })

    return streamedTodoLeadsFormat
  }

  const filterStuff = async (parent) => {
    const x = await parent.filter((item) => {
      if (selStatus === 'all') {
        return item
      } else if (item.Status.toLowerCase() === selStatus.toLowerCase()) {
        console.log('All1', item)
        return item
      }
    })
    await setRows(x)
    await console.log('xo', x, parent, selStatus)
  }
  const filterSearchString = async (parent) => {
    return
    const x = await parent.filter((item) => {
      if (item.Source.toLowerCase().includes(selStatus.toLowerCase())) {
        return item
      }
    })
    await setRows(x)
    await console.log('xo', x)
  }
  const selUserProfileF = (title, data) => {
    console.log('data is', data)
    setAddLeadsTypes(title)
    setisImportLeadsOpen(true)
    setSelUserProfile(data)
  }
  const selTaskManObjF = (data) => {
    setisViewTaskMan(true)
    setSelTaskMan(data)
  }
  const handleSortDrop = (e) => {
    setSortType(e.target.value)
  }

  const openingTaskAddWindow = () => {
    console.log('i was clicked')
    setisImportLeadsOpen1(true)
  }
  const isSelected = (name) => selected.indexOf(name) !== -1

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  console.log('what is here', todaySch)
  const torrowDate = new Date(
    +new Date().setHours(0, 0, 0, 0) + 86400000
  ).getTime()

  const myDate = new Date()
  const hrs = myDate.getHours()

  let greet

  if (hrs < 12) greet = 'Good Morning'
  else if (hrs >= 12 && hrs <= 17) greet = 'Good Afternoon'
  else if (hrs >= 17 && hrs <= 24) greet = 'Good Evening'

  const getMyTodayActivity = async () => {
    const unsubscribe = await streamSaleUserActivityLog(
      user?.orgId,
    'snap',
      { email: user?.email },
      (error) => setUserActivityA([])
    )
    setUserActivityA(unsubscribe)

    return
  }
  return (
    <>
      <div className="mt-1">
        {/* <Header /> */}
        <div className="flex justify-center items-center text-gray-900"></div>
        <div className=" justify-center items-center text-gray-900">
          {schLoading &&
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((data, i) => (
              <LogSkelton key={i} />
            ))}

          {!schLoading && !leadByViewLayout && todaySch && (
            <>
              <div className=" ">
                <div className="flex flex-wrap">
                  <div className="w-10/12">
                    <TodoListView
                      moduleName={moduleName}
                      taskListA={schFetCleanData}
                      setisImportLeadsOpen={setisImportLeadsOpen}
                      selUserProfileF={selUserProfileF}
                      selTaskManObjF={selTaskManObjF}
                      leadsFetchedData={undefined}
                      leadsTyper={undefined}
                      leadByViewLayout={leadByViewLayout}
                      setLeadByViewLayout={setLeadByViewLayout}
                      searchKey={searchKey}
                      setSearchKey={setSearchKey}
                    />
                  </div>
                  <div className="w-2/12 flex flex-col">
                    <section className="bg-white rounded-lg  flex flex-col p-4 ml-1 mb-1 w-100 ">
                      <h5 className="text-sm">{greet}...!🖐</h5>
                      <h2 className="text-md font-semibold text-black leading-light font-Playfair pb-1">
                        {user?.displayName?.toLocaleUpperCase()}
                      </h2>
                    </section>
                    <section className="ml-1">
                      <TaskProgress userTodayPerfA={userTodayPerfA} />
                      <div className="mt-1">
                        <RecentActivity
                          title={'My Activity'}
                          userTodayPerfA={userTodayPerfA}
                        />
                      </div>
                      <div className="mt-1">
                      <section className="bg-white rounded-lg  flex flex-col p-4 w-100 max-h-[400px] overflow-y-scroll">
                      <h5 className="font-bodyLato text-md">Activity Log</h5>
                        <UserActivityLogHomeSlim
                          usersList={usersList}
                          filterData={userActivityA}
                        />
                      </section>
                      </div>
                      <div className="mt-1">
                        <RecentActivity
                          title={'Team Activity'}
                          userTodayPerfA={userTodayPerfA}
                        />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </>
          )}

          {leadByViewLayout && todaySch && (
            <div className=" w-full">
              <div className="bg-white py-4 md:py-7 px-4 md:px-4 xl:px-6 rounded">
                <div className="sm:flex items-center justify-between">
                  <div className="flex items-center">
                    <a
                      className={`rounded-full focus:outline-none focus:ring-2  focus:bg-indigo-50 focus:ring-indigo-800`}
                      onClick={() => setSearchKey(['completed', 'pending'])}
                    >
                      <div
                        className={`py-2 px-8 rounded-full hover:text-indigo-700 hover:bg-indigo-100  ${
                          searchKey.includes('completed') &&
                          searchKey.includes('pending')
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600'
                        }`}
                      >
                        <p>All</p>
                      </div>
                    </a>
                    <a
                      className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
                      href="javascript:void(0)"
                      onClick={() => setSearchKey(['completed'])}
                    >
                      <div
                        className={`py-2 px-8 rounded-full hover:text-indigo-700 hover:bg-indigo-100  ${
                          searchKey.includes('completed') &&
                          searchKey.length === 1
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600'
                        }`}
                      >
                        <p>Done</p>
                      </div>
                    </a>

                    <a
                      className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
                      href="javascript:void(0)"
                      onClick={() => setSearchKey(['pending'])}
                    >
                      <div
                        className={`py-2 px-8 rounded-full hover:text-indigo-700 hover:bg-indigo-100  ${
                          searchKey.includes('pending') &&
                          searchKey.length === 1
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600'
                        }`}
                      >
                        <p>Todo</p>
                      </div>
                    </a>
                    <a
                      className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
                      href="javascript:void(0)"
                      onClick={() => setSearchKey(['upcoming'])}
                    >
                      <div
                        className={`py-2 px-8 rounded-full hover:text-indigo-700 hover:bg-indigo-100  ${
                          searchKey.includes('upcoming') &&
                          searchKey.length === 1
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600'
                        }`}
                      >
                        <p>Up Coming</p>
                      </div>
                    </a>
                  </div>
                  <button
                    onClick={() => openingTaskAddWindow()}
                    className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
                  >
                    <p className="text-sm font-medium leading-none text-white">
                      Add Tasks1
                    </p>
                  </button>
                </div>
                {todaySch && schFetData.length === 0 && (
                  <div className="py-8 px-8 mt-10 flex flex-col items-center sale_empty_page_bg_color rounded">
                    <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                      <img
                        className="w-[180px] h-[180px] inline"
                        alt=""
                        src="../note-widget.svg"
                      />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-900">
                      No Tasks Found
                    </h3>
                    {/* <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      <span className="text-blue-600"> Add New Task</span>
                    </time> */}
                  </div>
                )}
                <div className="mt-6">
                  {schFetData.map((dat, index) => {
                    console.log('what am i', dat)
                    const { leadUser, staDA, staA, uid } = dat
                    if (leadUser) {
                      leadUser.id = uid
                    }
                    return (
                      <>
                        <div
                          key={index}
                          className="flex-1 px-4 py-2 mt-2  bg-white  cursor-pointer focus:outline-none border border-gray-100 rounded "
                          onClick={() => {
                            console.log('macho 0', leadUser)
                            selUserProfileF('Lead Profile', leadUser)
                          }}
                        >
                          <div className="flex  w-full mx-4 py-2 border-b mt-4 ">
                            <label className="font-semibold text-[#053219] px-4 py-[4px] bg-green-100  text-2xl  mb-1 mr-2  ">
                              {index + 1}
                            </label>

                            <section className="mt-2">
                              <span className="inline-flex mr-4">
                                <span className="text-sm  font-light  font text-gray-700 ">
                                  {' '}
                                  {'Client Name'}:{'  '}
                                </span>
                                <span className="text-sm ml-1 font-semibold">
                                  {''}
                                  {leadUser?.Name}
                                </span>
                              </span>
                              <span className="inline-flex mr-4">
                                <span className="text-sm  font-light  font text-gray-700 ">
                                  {' '}
                                  {'Phone No'}:{'  '}
                                </span>
                                <span className="text-sm ml-1 font-semibold">
                                  {''}
                                  {leadUser?.Mobile.toString().replace(
                                    /(\d{3})(\d{3})(\d{4})/,
                                    '$1-$2-$3'
                                  )}
                                </span>
                              </span>
                              <span className="inline-flex mr-4">
                                <span className="text-sm  font-light  font text-gray-700 ">
                                  {' '}
                                  {'Email'}:{'  '}
                                </span>
                                <span className="text-sm ml-1 font-semibold">
                                  {''}
                                  {leadUser?.Email}
                                </span>
                              </span>
                              <span className="inline-flex mr-4">
                                <span className="text-sm  font-light  font text-gray-700 ">
                                  {' '}
                                  {'Status'}:{'  '}
                                </span>
                                <span className="text-sm ml-1 font-semibold">
                                  {''}
                                  {leadUser?.Status}
                                </span>
                              </span>
                              <span className="inline-flex mr-4">
                                <span className="text-sm  font-light  font text-gray-700 ">
                                  {' '}
                                  {'Project'}:{'  '}
                                </span>
                                <span className="text-sm ml-1 font-semibold">
                                  {''}
                                  {leadUser?.Project}
                                </span>
                              </span>
                              <span className="inline-flex mr-4">
                                <span className="text-sm  font-light  font text-gray-700 ">
                                  {' '}
                                  {'Project'}:{'  '}
                                </span>
                                <span className="text-sm ml-1 font-semibold">
                                  {''}
                                  {leadUser?.assignedToObj?.name}
                                </span>
                              </span>
                            </section>
                          </div>
                          <div className="flex flex-grow flex-row items-center justify-between p-4 mt-4">
                            <div className="flex flex-row  w-full ">
                              <div className="flex flex-col   w-full  ">
                                {filterScheduleArry(staDA, dat).map(
                                  (ts, inx) => {
                                    return (
                                      <>
                                        <section
                                          className="border-b pb-3 pointer w-100 flex flex-col"
                                          key={inx}
                                          onClick={() =>
                                            selUserProfileF(
                                              'Lead Profile',
                                              leadUser
                                            )
                                          }
                                        >
                                          <section className="flex  mt-[4px]  items-center justify-between   ">
                                            <section>
                                              <span className="px- py-[1px]  min-w-[100px] inline-flex text-xs leading-5 tracking-wide font-bold rounded-full  text-green-800">
                                                {Math.abs(
                                                  getDifferenceInMinutes(
                                                    dat[ts]['schTime'],
                                                    ''
                                                  )
                                                ) > 60
                                                  ? Math.abs(
                                                      getDifferenceInMinutes(
                                                        dat[ts]['schTime'],
                                                        ''
                                                      )
                                                    ) > 1440
                                                    ? `${getDifferenceInDays(
                                                        dat[ts]['schTime'],
                                                        ''
                                                      )} Days `
                                                    : `${getDifferenceInHours(
                                                        dat[ts]['schTime'],
                                                        ''
                                                      )} Hours `
                                                  : `${getDifferenceInMinutes(
                                                      dat[ts]['schTime'],
                                                      ''
                                                    )} Min`}{' '}
                                                {getDifferenceInMinutes(
                                                  dat[ts]['schTime'],
                                                  ''
                                                ) < 0
                                                  ? 'Due'
                                                  : 'Left'}
                                              </span>

                                              <span className="font-brand  text-md text-blue-800 tracking-wider">
                                                {' '}
                                                {dat[ts]['notes']}
                                              </span>
                                            </section>
                                            <section>
                                              <span className="px-4 py-[4px] bg-green-100 inline-flex text-xs leading-5 font-semibold rounded-full text-green-800">
                                                {dat[ts]['pri']}
                                              </span>
                                              <span className="ml-4 px-4 py-[4px] inline-flex text-xs leading-5 font-semibold rounded-full  text-green-800">
                                                {dat[ts]['sts']}
                                              </span>
                                            </section>
                                          </section>
                                        </section>
                                      </>
                                    )
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <SiderForm
        open={isImportLeadsOpen}
        setOpen={setisImportLeadsOpen}
        title={addLeadsTypes}
        customerDetails={selUserProfile}
        widthClass="max-w-4xl"
      />
      <SiderForm
        open={isImportLeadsOpen1}
        setOpen={setisImportLeadsOpen1}
        title={'Add Task'}
        customerDetails={selUserProfile}
        widthClass="max-w-4xl"
      />
      <SiderForm
        open={isViewTaskMan}
        setOpen={setisViewTaskMan}
        title={'view_task_man'}
        taskManObj={selTaskMan}
        widthClass="max-w-4xl"
      />
    </>
  )
}
