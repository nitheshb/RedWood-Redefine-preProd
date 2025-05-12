/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react'
import '../../styles/myStyles.css'
import { Rating } from '@mui/material'
import Section from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import PropTypes from 'prop-types'

import { useAuth } from 'src/context/firebase-auth-context'
import {
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
} from 'src/util/dateConverter'

import 'react-datepicker/dist/react-datepicker.css'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import { visuallyHidden } from '@mui/utils'
import Highlighter from 'react-highlight-words'

import CSVDownloader from '../../util/csvDownload'
import { prettyDate } from '../../util/dateConverter'
import DropCompUnitStatus from '../dropDownUnitStatus'

function descendingComparator(a, b, orderBy) {
  if (
    (b[orderBy] || b['stsUpT'] || b['Date']) <
    (a[orderBy] || a['stsUpT'] || a['Date'])
  ) {
    return -1
  }
  if (
    (b[orderBy] || b['stsUpT'] || b['Date']) >
    (a[orderBy] || a['stsUpT'] || a['Date'])
  ) {
    return 1
  }
  return 0
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

function EnhancedTableHead(props) {
  const {
    leadsTyper,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    searchKey,
    viewUnitStatusA,
  } = props

  const headCells = [
    // {
    //   id: 'S.No',
    //   numeric: true,
    //   disablePadding: false,
    //   label: 'S.No',
    // },
    {
      id: 'Date',
      numeric: false,
      disablePadding: true,
      label: 'Created On',
    },
    {
      id: 'AssignedOn',
      numeric: false,
      disablePadding: true,
      label: 'Assigned On',
    },

    {
      id: 'Clientdetails',
      numeric: false,
      disablePadding: false,
      label: 'Client Details',
    },
    {
      id: 'Project',
      numeric: false,
      disablePadding: false,
      label: 'Project',
    },

    {
      id: 'Assigned',
      numeric: false,
      disablePadding: false,
      label: 'Assigned To',
    },
    {
      id: 'Source',
      numeric: false,
      disablePadding: false,
      label: 'Source',
    },
    {
      id: 'Currentstatus',
      numeric: false,
      disablePadding: false,
      label: 'Status',
    },
    {
      id: 'leadUpT',
      numeric: false,
      disablePadding: true,
      label: 'Last Activity',
    },
    {
      id: 'schTime',
      numeric: false,
      disablePadding: true,
      label: 'Next Sch',
    },

    {
      id: 'Notes',
      numeric: true,
      disablePadding: false,
      label: 'Comments',
    },
  ]

  const bookingCells = [
    // {
    //   id: 'S.No',
    //   numeric: true,
    //   disablePadding: false,
    //   label: 'S.No',
    // },
    {
      id: 'Date',
      numeric: false,
      disablePadding: true,
      label: 'Created On',
    },
    {
      id: 'AssignedOn',
      numeric: false,
      disablePadding: true,
      label: 'Assigned On',
    },

    {
      id: 'Clientdetails',
      numeric: false,
      disablePadding: false,
      label: 'Client Details',
    },
    {
      id: 'Project',
      numeric: false,
      disablePadding: false,
      label: 'Project',
    },

    {
      id: 'UnitNo',
      numeric: false,
      disablePadding: false,
      label: 'UnitNo',
    },

    {
      id: 'Assigned',
      numeric: false,
      disablePadding: false,
      label: 'Assigned To',
    },
    {
      id: 'Source',
      numeric: false,
      disablePadding: false,
      label: 'Source',
    },
    {
      id: 'Currentstatus',
      numeric: false,
      disablePadding: false,
      label: 'Status',
    },
    {
      id: 'leadUpT',
      numeric: false,
      disablePadding: true,
      label: 'Last Activity',
    },
    {
      id: 'schTime',
      numeric: false,
      disablePadding: true,
      label: 'Next Sch',
    },

    {
      id: 'Notes',
      numeric: true,
      disablePadding: false,
      label: 'Comments',
    },
  ]
  const [headers, setHeaders] = React.useState(headCells)
  React.useEffect(() => {
    if (leadsTyper === 'booked') {
      setHeaders(bookingCells)
    } else {
      setHeaders(headCells)
    }
  }, [leadsTyper])

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  const displayHeadersFun = (headCell) => {
    if (['Assigned', 'schTime', 'leadUpT'].includes(headCell)) {
      switch (headCell) {
        case 'Assigned':
          return viewUnitStatusA.includes('Assigned To') ? '' : 'none'
        case 'leadUpT':
          return viewUnitStatusA.includes('Last Activity') ? '' : 'none'
        case 'schTime':
          return viewUnitStatusA.includes('Next Sch') ? '' : 'none'
        default:
          break
      }
    } else {
      return ''
    }
  }
  return (
    <TableHead style={{ height: '10px' }}>
      <TableRow selected={true}>
        <TableCell
          align="center"
          component="th"
          scope="row"
          padding="none"
          size="small"
          style={{
            // backgroundColor: '#F7F9FB',
            color: '#1a91eb',
            maxHeight: '10px',
            height: '10px',
            lineHeight: '10px',
            maxWidth: '52px',
            minWidth: '25px',
            paddingLeft: '14px',
            paddingRight: '29px',
            marginRight: '10px',
          }}
        >
          <TableSortLabel
            style={{
              color: '#2B2B2B',
            }}
          >
            S.No
          </TableSortLabel>
        </TableCell>
        {headers.map((headCell) => (
          <>
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'center' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{
                color: '#1a91eb',
                height: '10px',
                maxHeight: '10px',
                lineHeight: '7px',
                borderLeft: 'none',
                borderRight: 'none',

                display: displayHeadersFun(headCell.id),
              }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                style={{
                  color: '#1a91eb',
                  fontFamily: 'inherit',
                }}
              >
                <span className="text-black font-outfit whitespace-nowrap">
                  {headCell.label}
                </span>
                {orderBy === headCell.id ? (
                  <Section component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Section>
                ) : null}
              </TableSortLabel>
            </TableCell>
          </>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  leadsTyper: PropTypes.string.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  searchkey: PropTypes.number.isRequired || PropTypes.string.isRequired,
}

const EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    selStatus,
    filteredData,
    setSearchKey,
    rows,
    viewUnitStatusA,
    pickCustomViewer,
    setViewUnitStatusA,
    startDate,
    endDate,
    setDateRange,
    leadsFetchedData,
    searchVal,
    searchKey,
  } = props
  const d = new window.Date()
  const [rowsAfterSearchKey, setRowsAfterSearchKey] = React.useState(rows)
  const [downloadFormatRows, setDownloadFormatRows] = React.useState([])
  const [cutOffDate, setCutOffDate] = React.useState(d.getTime() + 60000)

  const [isOpened, setIsOpened] = React.useState(false)
  React.useEffect(() => {
    setRowsAfterSearchKey(rows)
  }, [rows])

  React.useEffect(() => {
    let downRows = []
    rowsAfterSearchKey?.map((data) => {
      let row = {}
      let remark
      if (data?.Remarks) {
        remark =
          data?.Remarks?.charAt(0) == '-'
            ? data?.Remarks.substring(1)
            : data?.Remarks
      } else {
        remark = data?.Remarks
      }
      row.Date = prettyDate(data?.Date)?.toLocaleString()
      row.Name = data?.Name
      row.countryCode = data?.countryCode
      row.Mobile = data?.Mobile
      row.Email = data?.Email
      row.AssignedTo = data?.assignedToObj?.name
      row.Source = data?.Source
      row.strength = data?.leadstrength || 0
      row.Status = data?.Status
      row.Project = data?.Project
      row.Remarks = remark

      downRows.push(row)
    })

    setDownloadFormatRows(downRows)
  }, [rowsAfterSearchKey])
  React.useEffect(() => {
    setSearchKey(searchVal)
  }, [searchVal])
  const searchKeyField = (e) => {
    setSearchKey(e.target.value)
    let searchString = e.target.value

    let rowsR = leadsFetchedData.filter((item) => {
      if (searchString == '' || !searchString) {
        console.log('ami here')
        return item
      } else if (
        item?.Email?.toLowerCase().includes(searchString?.toLowerCase()) ||
        item?.Mobile?.toLowerCase().includes(searchString?.toLowerCase()) ||
        item?.Name?.toLowerCase().includes(searchString?.toLowerCase()) ||
        item?.Project?.toLowerCase().includes(searchString?.toLowerCase()) ||
        item?.Source?.toLowerCase().includes(searchString?.toLowerCase()) ||
        item?.Status?.toLowerCase().includes(searchString?.toLowerCase())
      ) {
        return item
      }
    })
    setRowsAfterSearchKey(rowsR)
  }
  return (
    <section className="flex flex-row justify-between pb py-1 rounded px-3 bg-gray-50 mb-1">
      <span className="flex flex-row">
        <span className="relative  border rounded h-7 mt-1 px-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 absolute left-0 ml-1 mt-2"
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
            value={searchKey}
            className="pl-6 pr-2 bg-transparent text-xs focus:outline-none w-auto min-w-[180px] rounded-lg max-w-full"
          />
        </span>
      </span>

      <span style={{ display: 'flex' }}>
        <section className="pt-1">
          <DropCompUnitStatus
            type={'show'}
            id={'id'}
            setStatusFun={{}}
            viewUnitStatusA={viewUnitStatusA}
            pickCustomViewer={pickCustomViewer}
          />
        </section>

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton className="bg-gray-200">
              <DeleteIcon
                className="h-[20px] w-[20px]"
                style={{ height: '20px', width: '20px' }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={`Download ${leadsFetchedData?.length} Row`}>
            <CSVDownloader
              className="mr-6 h-[20px] bg-[#FDEFE7] w-[20px]"
              downloadRows={leadsFetchedData}
              sourceTab={'leadsList'}
              style={{ height: '20px', width: '20px' }}
            />
          </Tooltip>
        )}
      </span>
    </section>
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
export default function LLeadsTableBody({
  fetchLeadsLoader,
  leadsTyper,
  selStatus,
  rowsParent,
  selUserProfileF,
  newArray,
  leadsFetchedData,
  mySelRows,
  searchVal,
}) {
  const { user } = useAuth()
  const [order, setOrder] = React.useState('desc')
  const [orderBy, setOrderBy] = React.useState('Date')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [rows, setRows] = React.useState([])
  const [searchKey, setSearchKey] = React.useState(searchVal ? searchVal : '')
  const [dateRange, setDateRange] = React.useState([null, null])
  const [startDate, endDate] = dateRange
  React.useEffect(() => {}, [selStatus, rowsParent])
  console.log(searchKey, 'cdsvfeg')
  React.useEffect(() => {
    filterSearchString(rows)
  }, [searchKey])

  const filterStuff = async (parent) => {
    console.log('filter value stuff', parent)

    let x =
      selStatus === 'all'
        ? parent['all']
        : selStatus === 'archieve_all'
        ? parent['archieve_all']
        : parent[selStatus]

    await setRows(newArray)
  }
  const filterByDate = () => {
    rows.filter((item) => {
      {
      }
      if (startDate !== null && endDate != null) {
        console.log('inside you1', startDate, endDate, item)
        let x = rows.filter((item) => {
          return (
            item?.Date >= startDate?.getTime() &&
            item?.Date <= endDate?.getTime()
          )
        })
        setRows(x)
      } else if (startDate !== null) {
        console.log('inside you1 x')
        console.log(
          'iinside you1 x',
          item?.Date >= startDate?.getTime() &&
            item?.Date <= startDate?.getTime() + 86400000,
          startDate?.getTime() + 86399999,
          startDate?.getTime(),
          item.Name
        )

        let x = rows.filter((item) => {
          console.log(
            'inside you wjat os tjo filter',
            item?.Date >= startDate?.getTime() &&
              item?.Date <= startDate?.getTime() + 86400000,
            startDate?.getTime() + 86399999,
            startDate?.getTime(),
            item.Name
          )
          return (
            item?.Date >= startDate?.getTime() &&
            item?.Date <= startDate?.getTime() + 86400000
          )
        })
        setRows(x)
      } else {
        return item
      }
    })
  }
  const filterSearchString = async (parent) => {
    return
    let x = await parent.filter((item) => {
      if (item.Source.toLowerCase().includes(selStatus.toLowerCase())) {
        return item
      }
    })
    await setRows(x)
    await console.log('xo', x)
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    console.log('property is', property)
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, row) => {
    let newSelected = []

    selUserProfileF('Lead Profile', row)
    setSelected(newSelected)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const [selBlock, setSelBlock] = React.useState({})
  const [viewUnitStatusA, setViewUnitStatusA] = React.useState([
    'Phone No',
    'Last Activity',
  ])
  React.useEffect(() => {
    if (user) {
      const { role } = user

      if (role[0] === 'sales-manager') {
        setViewUnitStatusA(['Phone No', 'Assigned To'])
      }
    }
  }, [user])

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

  return (
    <Section sx={{ width: '100%' }} style={{ border: 'none', radius: 0 }}>
      <EnhancedTableToolbar
        numSelected={selected.length}
        selStatus={selStatus}
        filteredData={rows}
        searchKey={searchKey}
        startDate={startDate}
        endDate={endDate}
        setDateRange={setDateRange}
        setSearchKey={setSearchKey}
        rows={rows}
        viewUnitStatusA={viewUnitStatusA}
        pickCustomViewer={pickCustomViewer}
        setViewUnitStatusA={setViewUnitStatusA}
        leadsFetchedData={leadsFetchedData}
        searchVal={searchVal}
      />
      <section
        style={{ borderTop: '1px solid #efefef', background: '#fefafb' }}
      >
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table
            sx={{ minWidth: 750, minHeight: 260, marginBottom: 30 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            stickyHeader
            aria-label="sticky table"
          >
            <EnhancedTableHead
              leadsTyper={leadsTyper}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
              searchkey={searchKey}
              viewUnitStatusA={viewUnitStatusA}
            />

            <TableBody>
              {leadsFetchedData
                ?.filter((item) => {
                  if (searchKey == '' || !searchKey) {
                    return item
                  } else if (
                    item?.Email?.toLowerCase().includes(
                      searchKey?.toLowerCase()
                    ) ||
                    item?.Mobile?.toLowerCase().includes(
                      searchKey?.toLowerCase()
                    ) ||
                    item?.Name?.toLowerCase().includes(
                      searchKey?.toLowerCase()
                    ) ||
                    item?.Source?.toLowerCase().includes(
                      searchKey?.toLowerCase()
                    )
                  ) {
                    return item
                  }
                })

                .sort(getComparator(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row.Name)
                  const labelId = `enhanced-table-checkbox-${index}`
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        align="center"
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        size="small"
                      >
                        {index + 1}
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <section>
                          <span className="font-outfit">
                            {prettyDate(row?.Date)?.toLocaleString()}
                          </span>
                        </section>
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <section>
                          <span className="font-outfit">
                            {row.assignT != undefined
                              ? prettyDate(row?.assignT)
                              : prettyDate(row?.Date)}
                          </span>
                        </section>
                      </TableCell>

                      <TableCell align="left">
                        <section>
                          <div>
                            <div
                              className="relative flex flex-col  group"
                              // style={{ alignItems: 'end' }}
                            >
                              <div
                                className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex"
                                // style={{  width: '300px' }}
                                style={{ zIndex: '9' }}
                              >
                                <span
                                  className="rounded italian relative mr-2 z-100000 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
                                  style={{
                                    color: '#94B5ED',
                                    background: '#FCE6D9',
                                    maxWidth: '300px',
                                  }}
                                >
                                  <div className="italic flex flex-col">
                                    <div className="font-outfit">
                                      <HighlighterStyle
                                        searchKey={searchKey}
                                        source={row.Name.toString()}
                                      />
                                    </div>
                                    <div className="font-outfit">
                                      <HighlighterStyle
                                        searchKey={searchKey}
                                        source={row.Email.toString()}
                                      />
                                    </div>
                                    <div>
                                      <span className="font-outfit">
                                        <HighlighterStyle
                                          searchKey={searchKey}
                                          source={row?.countryCode}
                                        />
                                      </span>{' '}
                                      <span className="font-outfit">
                                        <HighlighterStyle
                                          searchKey={searchKey}
                                          source={row?.Mobile?.toString()?.replace(
                                            /(\d{3})(\d{3})(\d{4})/,
                                            '$1-$2-$3'
                                          )}
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </span>
                                <div
                                  className="w-3 h-3  -mt-2 rotate-45 bg-black"
                                  style={{
                                    background: '#FCE6D9',
                                    marginRight: '12px',
                                  }}
                                ></div>
                              </div>
                              <span className="font-outfit">
                                <HighlighterStyle
                                  searchKey={searchKey}
                                  source={row.Name.toString()}
                                />
                              </span>
                            </div>
                          </div>
                          {viewUnitStatusA.includes('Email Id') && (
                            <div>
                              <span className="font-outfit">
                                <HighlighterStyle
                                  searchKey={searchKey}
                                  source={row.Email.toString()}
                                />
                              </span>
                            </div>
                          )}
                          {viewUnitStatusA.includes('Phone No') && (
                            <div>
                              <span className="font-outfit">
                                <HighlighterStyle
                                  searchKey={searchKey}
                                  source={row?.countryCode}
                                />
                              </span>{' '}
                              <span className="font-outfit">
                                <HighlighterStyle
                                  searchKey={searchKey}
                                  source={row?.Mobile?.toString()?.replace(
                                    /(\d{3})(\d{3})(\d{4})/,
                                    '$1-$2-$3'
                                  )}
                                />
                              </span>
                            </div>
                          )}
                        </section>
                      </TableCell>

                      <TableCell align="left">{row.Project}</TableCell>
                      {leadsTyper === 'booked' && (
                        <TableCell align="left">{row?.UnitNo}</TableCell>
                      )}

                      {viewUnitStatusA.includes('Assigned To') && (
                        <TableCell align="left">
                          <span className="font-outfit">
                            {row?.assignedToObj?.label}
                          </span>
                        </TableCell>
                      )}

                      <TableCell align="center">
                        <section className="flex flex-col">
                          <span className="px-2 uppercase inline-flex text-[11px] text-black-900  ">
                            {row?.Source?.toString() || 'NA'}
                          </span>
                          <Rating
                            name="size-small half-rating-read"
                            value={(row?.leadstrength / 100) * 5}
                            size="small"
                            precision={0.5}
                            readOnly
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#FF9529',
                              },
                              '& .MuiRating-iconHover': {
                                color: '#FF9529',
                              },
                            }}
                          />
                        </section>
                      </TableCell>

                      <TableCell align="left">
                        <span className="px-3 py-2 uppercase inline-flex  font-[500] text-[12px] leading-[100%] tracking-[0%] font-outfit rounded-[13px] leading-5  bg-[#FDEFE7] sale_text_color">
                          <HighlighterStyle
                            searchKey={searchKey}
                            source={row.Status.toString()}
                          />
                        </span>
                      </TableCell>
                      {viewUnitStatusA.includes('Last Activity') && (
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          <>
                            <span className="px- py-[1px]  min-w-[100px] inline-flex text-xs leading-5 tracking-wide  rounded-full  text-green-800">
                              {Math.abs(
                                getDifferenceInMinutes(
                                  row?.leadUpT || row?.stsUpT,
                                  ''
                                )
                              ) > 60
                                ? Math.abs(
                                    getDifferenceInMinutes(
                                      row?.leadUpT || row?.stsUpT,
                                      ''
                                    )
                                  ) > 1440
                                  ? `${Math.abs(
                                      getDifferenceInDays(
                                        row?.leadUpT || row?.stsUpT,
                                        ''
                                      )
                                    )} Days `
                                  : `${Math.abs(
                                      getDifferenceInHours(
                                        row?.leadUpT || row?.stsUpT,
                                        ''
                                      )
                                    )} Hours `
                                : `${
                                    Math.abs(
                                      getDifferenceInMinutes(
                                        row?.leadUpT || row?.stsUpT,
                                        ''
                                      )
                                    ) || 0
                                  } Min`}{' '}
                              {/* in above line I have added 0 to take Nan value */}
                              {getDifferenceInMinutes(
                                row?.leadUpT || row?.stsUpT,
                                ''
                              ) < 0
                                ? 'ago'
                                : 'Left'}
                            </span>
                          </>
                        </TableCell>
                      )}
                      {viewUnitStatusA.includes('Next Sch') && (
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          <>
                            <span className="px- py-[1px]  min-w-[100px] inline-flex text-xs leading-5 tracking-wide  rounded-full  text-green-800">
                              {Math.abs(
                                getDifferenceInMinutes(row?.schTime, '')
                              ) > 60
                                ? Math.abs(
                                    getDifferenceInMinutes(row?.schTime, '')
                                  ) > 1440
                                  ? `${Math.abs(
                                      getDifferenceInDays(row?.schTime, '')
                                    )} Days `
                                  : `${Math.abs(
                                      getDifferenceInHours(row?.schTime, '')
                                    )} Hours `
                                : `${Math.abs(
                                    getDifferenceInMinutes(row?.schTime, '')
                                  )} Min`}{' '}
                              {getDifferenceInMinutes(row?.schTime, '') < 0
                                ? 'ago'
                                : 'Left'}
                            </span>
                          </>
                        </TableCell>
                      )}
                      <TableCell
                        align="left"
                        style={{
                          maxWidth: '100px',
                          maxHeight: '100px',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {' '}
                        <span
                          className="font-outfit"
                          style={{
                            maxWidth: '100px',
                            maxHeight: '100px',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {row.Remarks}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </Section>
  )
}
