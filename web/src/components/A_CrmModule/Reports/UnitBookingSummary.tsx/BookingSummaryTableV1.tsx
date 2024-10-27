

/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import * as React from 'react'
import {
  Rating,
} from '@mui/material'
import Section from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import PropTypes from 'prop-types'



import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { useAuth } from 'src/context/firebase-auth-context'
import {
  prettyDate,
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
} from 'src/util/dateConverter'

import 'react-datepicker/dist/react-datepicker.css'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import { visuallyHidden } from '@mui/utils'
import Highlighter from 'react-highlight-words'

import CSVDownloader from 'src/util/csvDownload'
import DropCompUnitStatus from 'src/components/dropDownUnitStatus'
import { computeTotal } from 'src/util/computeCsTotals'
// import { prettyDate } from '../../util/dateConverter'
// import DropCompUnitStatus from '../dropDownUnitStatus'



// function createData(
//   Date,
//   Name,
//   Mobile,
//   Email,
//   Project,
//   Source,
//   Empmobile,
//   Note
// ) {
//   return {
//     Date,
//     Name,
//     Mobile,
//     Email,
//     Project,
//     Source,
//     Empmobile,
//     Note,
//   }
// }

function descendingComparator(a, b, orderBy) {
  if ((b[orderBy] || b['stsUpT'] || b['Date']) < (a[orderBy] || a['stsUpT'] || a['Date'])) {
    return -1
  }
  if ((b[orderBy] || b['stsUpT'] || b['Date']) > (a[orderBy] || a['stsUpT'] || a['Date'])) {
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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
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
    align: 'left',
    label: 'Customer Details',
  },
  {
    id: 'AssignedOn',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Unit',
  },
  {
    id: 'Project',
    numeric: false,
    disablePadding: false,
    align: 'left',
    label: 'Project',
  },
  {
    id: 'Clientdetails',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Status',
  },

  // {
  //   id: 'bmrda_strr',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'center',
  //   label: 'BMRDA/STRR',
  // },

  {
    id: 'booked',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Booked',
  },
  {
    id: 'partA',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Land',
  },{
    id: 'partB',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Charges-I',
  },{
    id: 'partC',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Construction',
  },{
    id: 'partD',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Charges-II',
  },
  // {
  //   id: 'infra',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'right',
  //   label: 'Infrastructure',
  // },
  // {
  //   id: 'club',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'right',
  //   label: 'ClubHouse Charges',
  // },
  // {
  //   id: 'maintenance',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'right',
  //   label: 'Maintenance Charges',
  // },
  // {
  //   id: 'legal',
  //   numeric: false,
  //   disablePadding: false,
  //   align: 'right',
  //   label: 'Legal Charges',
  // },
  {
    id: 'sale',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Sale Value',
  },
  {
    id: 'avgsft',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Sft Cost',
  },
  {
    id: 'sv_sft',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Sv/Sft',
  },
  {
    id: 'received',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Received',
  },
  {
    id: 'balance',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Balance',
  },
  {
    id: 'partE',
    numeric: false,
    disablePadding: false,
    align: 'right',
    label: 'Possession',
  },
  {
    id: 'crm_executive',
    numeric: false,
    disablePadding: true,
    align: 'left',
    label: 'CRM Executive',
  },
  {
    id: 'sale_executive',
    numeric: false,
    disablePadding: true,
    align: 'left',
    label: 'Sale Executive',
  },
  {
    id: 'Notes',
    numeric: true,
    disablePadding: false,
    label: 'Comments',
  },
]



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
  // React.useEffect(() => {
  //  console.log('calendar state', isOpened, startDate?.getTime())
  //  if(startDate !== null && endDate !=null){
  //   console.log('inside you1')
  //   let rowsR = rows.filter((item) => {
  //    return item.Date >=startDate.getTime() && item.Date <=endDate.getTime()
  //   })
  //   setRowsAfterSearchKey(rowsR)
  //  }else if(startDate !==null) {
  //   console.log('inside you')
  //   let rowsR = rows.filter((item) => {
  //     console.log('inside you wjat os tjo filter', item.Date>= startDate.getTime() && item.Date <= startDate.getTime()+ 86400000,startDate.getTime()+ 86399999,startDate.getTime(),   item.Name)
  //     return item.Date>= startDate.getTime() && item.Date <= startDate.getTime()+ 86400000
  //    })
  //    console.log('inside you wjat os tjo filter', rowsR.length)
  //    setRowsAfterSearchKey(rowsR)
  //    console.log('inside you wjat os tjo filter 1', rowsAfterSearchKey)
  //  }
  // }, [startDate,endDate ])

  React.useEffect(() => {
    const downRows = []
    rowsAfterSearchKey?.map((data) => {
      const row = {}
      let remark
      if (data?.Remarks) {
        remark =
          data?.Remarks?.charAt(0) == '-'
            ? data?.Remarks.substring(1)
            : data?.Remarks
      } else {
        remark = data?.Remarks
      }
      row.Date = prettyDate(data?.Date).toLocaleString()
      row.Name = data?.Name
      row.CountryCode = data['Country Code']
      row.Mobile = data?.Mobile
      row.Email = data?.Email
      row.AssignedTo = data?.assignedToObj?.name
      row.Source = data?.Source
      row.Status = data?.Status
      row.Project = data?.Project
      row.Remarks = remark

      downRows.push(row)
    })

    setDownloadFormatRows(downRows)
  }, [rowsAfterSearchKey])
React.useEffect(()=>{
  setSearchKey(searchVal)
  // searchKeyField({target:{value:searchVal}})
},[searchVal])
  const searchKeyField = (e) => {
    // console.log('searched values is ', e.target.value)
    setSearchKey(e.target.value)
    const searchString = e.target.value

    const rowsR = leadsFetchedData.filter((item) => {
      if (searchString == '' || !searchString) {
        console.log('ami here')
        return item
      } else if (
        // item.Assignedto.toLowerCase().includes(searchString.toLowerCase()) ||
        // item.Date.toLowerCase().includes(searchString.toLowerCase()) ||
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
    <section className="flex flex-row justify-between pb pt-1 px-3 ">
      {/* <span className="flex flex-row">
        <span className="relative  p- border rounded h-7">
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
            // onChange={searchKeyField}
            value={searchKey}
            className="ml-6 bg-transparent text-xs focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none"
          />
        </span>

      </span> */}


      <span style={{ display: 'flex' }}>
        <section className="pt-1">
          <DropCompUnitStatus
            type={'Show Fields'}
            id={'id'}
            setStatusFun={{}}
            viewUnitStatusA={viewUnitStatusA}
            pickCustomViewer={pickCustomViewer}
          />
        </section>
        {/* <Tooltip title={`Download ${rowsAfterSearchKey.length} Rows`}>

          <IconButton className="bg-gray-200 ">
            <EventNoteTwoToneIcon
              className="h-[20px] w-[20px]"
              style={{ height: '20px', width: '20px' }}
            />
          </IconButton>
        </Tooltip> */}

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
            {/* <IconButton>
            <FileDownloadIcon />
            <CSVDownloader />
          </IconButton> */}

            <CSVDownloader
              className="mr-6 h-[20px] w-[20px]"
              downloadRows={leadsFetchedData}
              sourceTab="Booking Summary"
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
export default function UnitSummaryTableBodyV1({
  fetchLeadsLoader,
  selStatus,
  rowsParent,
  selUserProfileF,
  newArray,
  leadsFetchedData,
  mySelRows,
  searchVal,
  viewUnitStatusA,

}) {
  const { user } = useAuth()
  const [order, setOrder] = React.useState('desc')
  const [orderBy, setOrderBy] = React.useState('Date')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [rows, setRows] = React.useState([])
  const [searchKey, setSearchKey] = React.useState(searchVal?searchVal:'')
  const [dateRange, setDateRange] = React.useState([null, null])
  const [startDate, endDate] = dateRange



const [totalSaleValue, setTotalSaleValue] = React.useState(0);
const [totalLandValue, setTotalLandValue] = React.useState(0);

const [totalChargesIValue, setTotalChargesIValue] = React.useState(0);

const [totalChargesIIValue, setTotalChargesIIValue] = React.useState(0);
const [totalPossessionValue, setTotalPossessionValue] = React.useState(0);

const [totalConstructValue, setTotalConstructValue] = React.useState(0);

const [totalReceived, setTotalReceived] = React.useState(0);
const [selTotalBalance, setTotalBalance] = React.useState(0);

React.useEffect(() => {

  // const partACost =
  // row?.plotCS?.reduce(function (_this, val) {
  //     return _this + val.TotalNetSaleValueGsT
  //   }, 0) || 0

  // const partBCost =
  // row?.addChargesCS?.reduce(
  //     (partialSum, obj) =>
  //       partialSum +
  //       Number(
  //         computeTotal(obj, row?.super_built_up_area || row?.area)
  //       ),
  //     0
  //   ) || 0
  console.log('valure are', leadsFetchedData)
  const totalSale = leadsFetchedData.reduce((total, row) => total + Number(row?.T_total || 0), 0);
  setTotalSaleValue(totalSale);

  const totalLand = leadsFetchedData.reduce((total, row) => total + Number(row?.T_A || 0), 0);
  setTotalLandValue(totalLand);
  const totalChargesI = leadsFetchedData.reduce((total, row) => total + Number(row?.T_B || 0), 0);
  setTotalChargesIValue(totalChargesI);
  const totalConstruction = leadsFetchedData.reduce((total, row) => total + Number(row?.T_C || 0), 0);
  setTotalConstructValue(totalConstruction);
  const totalChargesII = leadsFetchedData.reduce((total, row) => total + Number(row?.T_D || 0), 0);
  setTotalChargesIIValue(totalChargesII);
  const totalPossessionII = leadsFetchedData.reduce((total, row) => total + Number(row?.T_E || 0), 0);
  setTotalPossessionValue(totalPossessionII);

  const totalReceived = leadsFetchedData.reduce((total, row) => total + Number(row.T_approved || 0), 0);
  setTotalReceived(totalReceived);
  const totalBalance = leadsFetchedData.reduce((total, row) => total + Number(row.T_balance || 0), 0);
  setTotalBalance(totalBalance);
}, [leadsFetchedData]);










  React.useEffect(() => {
  }, [selStatus, rowsParent])
  console.log(searchKey, "cdsvfeg", leadsFetchedData)
  React.useEffect(() => {
    filterSearchString(rows)
  }, [searchKey])

  const filterStuff = async (parent) => {
    console.log('filter value stuff', parent)


    const x = selStatus === 'all'
      ? parent['all'] : selStatus === 'archieve_all' ? parent['archieve_all'] : parent[selStatus]

    await setRows(newArray)
  }
  const filterByDate = () => {
    rows.filter((item) => {
      {
        /* console.log('inside xxxx ==>', item?.Date>= startDate.getTime() && item.Date <= startDate.getTime()+ 86400000,startDate.getTime()+ 86399999,startDate.getTime(),   item.Name) */
      }
      if (startDate !== null && endDate != null) {
        console.log('inside you1', startDate, endDate, item)
        const x = rows.filter((item) => {
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

        const x = rows.filter((item) => {
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
    const x = await parent.filter((item) => {
      if (item.Source.toLowerCase().includes(selStatus.toLowerCase())) {
        return item
      }
      //  else if (item.Status.toLowerCase() === selStatus.toLowerCase()) {
      //   console.log('All1', item)
      //   return item
      // } else if (item.Source.toLowerCase().includes(selStatus.toLowerCase())) {
      //   return item
      // }
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
    // const selectedIndex = selected.indexOf(name)
    const newSelected = []

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, name)
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1))
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1))
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1)
    //   )
    // }
    selUserProfileF('User Profile', row)
    setSelected(newSelected)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const [selBlock, setSelBlock] = React.useState({})



  {/* today */}


function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    searchKey,
    viewUnitStatusA,
  } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  const displayHeadersFun = (headCell) => {

    if(['partA','partB','partC','partD','partE', 'legal', 'maintenance', 'club', 'infra'].includes(headCell)){
      return viewUnitStatusA.includes('Cost Split') ? '' : 'none'
    }  else if(['avgsft', 'sv_sft', 'bmrda_strr'].includes(headCell)){
      return viewUnitStatusA.includes('Avg sqft Cost') ? '' : 'none'
    } else if(['crm_executive'].includes(headCell)){
      return viewUnitStatusA.includes('CRM Executive') ? '' : 'none'
    }else if(['sale_executive'].includes(headCell)){
      return viewUnitStatusA.includes('Sales Executive') ? '' : 'none'
    }else if(['Notes'].includes(headCell)){
      return viewUnitStatusA.includes('Remarks') ? '' : 'none'
    }
    else {
      return ''
    }

    //   if(viewUnitStatusA.includes('Assigned To') &&
    //   headCell === 'Assigned'){
    //   return ''
    //   }else{
    //     return 'none'
    //   }
    // }else {
    //   return ''
    // }


  }
  return (
    <TableHead style={{ height: '10px', borderRadius: '2xl' }}>
      <TableRow selected={true}>
        <TableCell
          align="center"
          component="th"
          scope="row"
          padding="none"
          size="small"
          style={{
            backgroundColor: '#61787B',
            color: '#1a91eb',
            maxHeight: '10px',
            height: '10px',
            lineHeight: '10px',
            maxWidth: '52px',
            minWidth: '25px',
            padding: '0px',
borderRadius: '2xl',
borderBottom: '0.2px solid #4c787d',

            paddingLeft: '14px',
            paddingRight: '29px',
            marginRight: '10px',
          }}
        >
          {/* <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          /> */}



          <TableSortLabel style={{backgroundColor: '#61787B',borderRight: '0.2px solid #e7e5e4', color: '#fff',fontWeight: '600' }}>S.No</TableSortLabel>
        </TableCell>
        {headCells.map((headCell) => (
          <>
            <TableCell
              key={headCell.id}
              align={headCell?.align ||  'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{
                backgroundColor: '#61787B',
                color: '#33393d',

                fontWeight: '600',
                height: '10px',
                maxHeight: '10px',
                lineHeight: '7px',
                padding: '8px 7px 8px 10px',
                borderRight: '0.2px solid #4c787d',
                borderBottom: '0.2px solid #4c787d',

                display: displayHeadersFun(headCell.id)
              }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                style={{
                  backgroundColor: '#61787B',
                  color: '#33393d',
                  fontFamily: 'inherit',
                }}
              >
                <span className="text-[#fff] whitespace-nowrap">
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
      </TableRow>  <TableRow selected={true}>
        <TableCell
          align="center"
          component="th"
          scope="row"
          padding="none"
          size="small"
          style={{
            backgroundColor: '#61787B',
            color: '#1a91eb',
            maxHeight: '12px',
            height: '12px',
            lineHeight: '12px',
            maxWidth: '52px',
            minWidth: '25px',
            padding: '0px',

            paddingLeft: '14px',
            paddingRight: '29px',
            marginRight: '10px',
          }}
        >
          {/* <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          /> */}



          <TableSortLabel style={{backgroundColor: '#61787B', color: '#000',fontWeight: '500' }}></TableSortLabel>
        </TableCell>
        {headCells.map((headCell) => (
          <>
            <TableCell
              key={headCell.id}
              align={headCell?.align ||  'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{
                backgroundColor: ['partA','partB','partC','partD','partE', 'sale', 'received', 'balance'].includes(headCell.id) ? '#61787B': '#61787B',
                color: '#33393d',
                height: '6px',
                maxHeight: '10px',
                lineHeight: '7px',
                fontWeight: '500',
                padding: '6px 1px 6px 10px',

                borderRight: '0.2px solid #4c787d',

                display: displayHeadersFun(headCell.id)
              }}
            >



              {headCell.id === 'partA' && (

<div style={{  }}>
<div className="bg-[#61787B]  flex items-center justify-end py-2 pr-1">
  <span className="text-[#fff] text-[14px] ">₹{totalLandValue.toLocaleString('en-IN')}</span>
</div>
</div>



              )}
                 {headCell.id === 'partB' && (

<div style={{  }}>
<div className="bg-[#61787B]  flex items-center justify-end py-2 pr-1">
  <span className="text-[#fff] text-[14px] ">₹{totalChargesIValue.toLocaleString('en-IN')}</span>
</div>
</div>



              )}

               {headCell.id === 'partC' && (

<div style={{  }}>
<div className="bg-[#61787B]  flex items-center justify-end py-2 pr-1">
  <span className="text-[#fff] text-[14px] ">₹{totalConstructValue.toLocaleString('en-IN')}</span>
</div>
</div>



              )}

{headCell.id === 'partD' && (

<div style={{  }}>
<div className="bg-[#61787B]  flex items-center justify-end py-1 pr-1">
  <span className="text-[#fff] text-[14px] ">₹{totalChargesIIValue.toLocaleString('en-IN')}</span>
</div>
</div>



              )}
              {headCell.id === 'partE' && (

<div style={{  }}>
<div className="bg-[#61787B]  flex items-center justify-end py-1 pr-1">
  <span className="text-[#fff] text-[14px] ">₹{totalPossessionValue.toLocaleString('en-IN')}</span>
</div>
</div>



              )}


              {headCell.id === 'sale' && (

<div className="bg-[#61787B] flex items-center justify-end py-1 pr-1">
  <span className="text-[#fff] text-[14px] ">₹{totalSaleValue.toLocaleString('en-IN')}</span>
</div>



  )}


            {headCell.id === 'received' && (

<div style={{  }}>
<div className="bg-[#61787B]  flex items-center justify-end py-1 pr-1">
  <span className="text-[#fff] text-[14px] ">₹{totalReceived.toLocaleString('en-IN')}</span>
</div>
</div>



              )}

{headCell.id === 'balance' && (

<div style={{  }}>
<div className="bg-[#61787B] flex items-center justify-end py-1 pr-1">
  <span className="text-[#fff] text-[14px] ">₹{selTotalBalance.toLocaleString('en-IN')}</span>
</div>
</div>



              )}









            </TableCell>
          </>
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

{ /* today */}











  return (
    <div className="border rounded-2xl  mx-2 shadow">
      {/* <EnhancedTableToolbar
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
      /> */}
      <section
        style={{ borderTop: '1px solid #efefef', background: '#fefafb', borderRadius: '15px' }}
      >
        <TableContainer sx={{ maxHeight: 640, borderRadius: '15px' }}>
          <Table
            sx={{ minWidth: 750, minHeight: 260, width: 'auto', borderRadius: '15px' }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            stickyHeader
            aria-label="sticky table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
              searchkey={searchKey}
              viewUnitStatusA={viewUnitStatusA}
            />
               {/* <EnhancedTotalTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
              searchkey={searchKey}
              viewUnitStatusA={viewUnitStatusA}
            /> */}

            <TableBody>
              {

                leadsFetchedData
                  ?.filter((item) => {
                    if (searchKey == '' || !searchKey) {
                      return item
                    }
                    else if (
                      item.Email.toLowerCase().includes(
                        searchKey.toLowerCase()
                      ) ||
                      item.Mobile.toLowerCase().includes(
                        searchKey.toLowerCase()
                      ) ||
                      item.Name.toLowerCase().includes(searchKey.toLowerCase()) ||
                      item.Source.toLowerCase().includes(
                        searchKey.toLowerCase()
                      )
                    ) {
                      return item
                    }
                  })


                  .sort(getComparator(order, orderBy))
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.Name)
                    const labelId = `enhanced-table-checkbox-${index}`
                    const legalCharge = row?.addChargesCS?.reduce((sum, item) => {
                      if (item.myId === '83d81de3-1294-4e96-84bf-07294011b15e') {
                        return sum + Number(item.charges)
                      }
                      return sum
                    }, 0)
                    const clubHouseCharges = row?.addChargesCS?.reduce((sum, item) => {
                      if (item.myId === 'eceb862f-3977-4e0f-a256-8c372af8cd71') {
                        return sum + Number(item.charges)
                      }
                      return sum
                    }, 0)
                    const maintenanceCharges = row?.addChargesCS?.reduce((sum, item) => {
                      if (item.myId === '27ee5bf1-0a4e-4b01-90db-39f23b7af804') {
                        return sum + Number(item.charges)
                      }
                      return sum
                    }, 0)
                    const infraCharges = row?.addChargesCS?.reduce((sum, item) => {
                      if (item.myId === '38bdfbbf-e4df-4b83-b7c1-086f084f8696') {
                        return sum + Number(item.charges)
                      }
                      return sum
                    }, 0)

                    const partACost =
                    row?.plotCS?.reduce(function (_this, val) {
                        return _this + val.TotalNetSaleValueGsT
                      }, 0) || 0

                    const partBCost =
                    row?.addChargesCS?.reduce(
                        (partialSum, obj) =>
                          partialSum +
                          Number(
                            computeTotal(obj, row?.super_built_up_area || row?.area?.toString()?.replace(',', ''))
                          ),
                        0
                      ) || 0
                      const partCCost =
                      row?.addOnCS?.reduce(
                        (partialSum, obj) =>
                          partialSum +
                          Number(
                            computeTotal(
                              obj,
                              row?.super_built_up_area ||
                              row?.area?.toString()?.replace(',', '')
                            )
                          ),
                        0
                      ) || 0
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
                          sx={{width: '60px', whiteSpace: 'nowrap', background: '#fff',   }}
                        >
                          {index + 1}
                        </TableCell>

                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          sx={{ width: '142px',whiteSpace: 'nowrap', background: '#fff',  paddingRight: '6px' , paddingLeft: '6px',   borderLeft: '0.2px solid #e7e5e4' , }}

                        >
                          <section>
                            <div className="font-bodyLato text-[#33393d]">
                            {row?.customerDetailsObj?.customerName1?.toString()}
                            </div>
                            {/* <div className="font-bodyLato">
                            {row?.customerDetailsObj?.email1?.toString()}
                            </div> */}

                          </section>
                        </TableCell>


                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="center"
                          sx={{width: '142px',background: '#fff', paddingTop: '4px', paddingBottom:'4px',  borderLeft: '0.2px solid #e7e5e4' , }}

                        >
                          <section>
                            <span className="font-bodyLato">
                            {row?.unit_no}
                            </span>
                          </section>
                        </TableCell>
                          <TableCell
                          align="left"
                          style={{ width: '142px',maxWidth:'80px', maxHeight: '40px',  borderLeft: '0.2px solid #e7e5e4' , textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '8px' , paddingLeft: '8px', paddingTop: '4px', paddingBottom:'4px', background: "#fff",}}
                          padding='none'
                        >

                          <span className="font-bodyLato" style={{width: '142px',maxHeight: '40px', textOverflow: 'ellipsis', fontSize: '13px' }}>{row.projName}</span>
                        </TableCell>
                        <TableCell align="center" sx={{width: '142px',background: "#FFFF",  borderLeft: '0.2px solid #e7e5e4', }} padding="none">
                        <span className="px-2 uppercase inline-flex text-[10px] leading-5 font-semibold rounded-full bg-[#CCFBF1] text-[#115e59]">
                          <HighlighterStyle
                            searchKey={searchKey}
                            source={row?.unitStatus?.toString() || row.status.toString()}
                          />
                        </span>
                        </TableCell>

                        <TableCell align="center" sx={{width: '142px', whiteSpace: 'nowrap', background: "#fff", borderLeft: '0.2px solid #e7e5e4' , fontSize:'13px'  }} padding="none">
          {prettyDate(row?.booked_on)}
        </TableCell>
        {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', borderLeft: '0.2px solid #e7e5e4' , fontSize: '13px', paddingRight: '6px', color: '#0ea5e9',    '& span': {
      display: 'inline-block',
      borderBottom: '1px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    } }} padding="none">
          <span

  >
    ₹{row?.T_A?.toLocaleString('en-IN')}
  </span>
        </TableCell>)} {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', paddingRight: '6px', color: '#0ea5e9',borderLeft: '0.2px solid #e7e5e4'  , fontSize: '13px',   '& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    }  }} padding="none">

  <span

  >
    ₹{row?.T_B?.toLocaleString('en-IN')}
  </span>
        </TableCell>)} {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap',  paddingRight: '6px',color: '#0ea5e9',borderLeft: '1px solid #e0e0e0' , fontSize: '13px',  '& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    } }} padding="none">
          <span>₹{row?.T_C?.toLocaleString('en-IN')}</span>
        </TableCell>)} {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap',  paddingRight: '6px',color: '#0ea5e9',borderLeft: '1px solid #e0e0e0' ,fontSize: '13px',    '& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    } }} padding="none">
          <span>₹{row?.T_D?.toLocaleString('en-IN')}</span>
        </TableCell>)}

        {/* {viewUnitStatusA.includes('Cost Split') && (<TableCell align="right" sx={{ whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px' }} padding="none">
        ₹{infraCharges?.toLocaleString('en-IN')}
        </TableCell>)}
       {viewUnitStatusA.includes('Cost Split') && (<TableCell align="right" sx={{ whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px' }} padding="none">
        ₹{clubHouseCharges?.toLocaleString('en-IN')}
        </TableCell>)}
        {viewUnitStatusA.includes('Cost Split') && (<TableCell align="right" sx={{ whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px' }} padding="none">
        ₹{maintenanceCharges?.toLocaleString('en-IN')}
        </TableCell>)}
        {viewUnitStatusA.includes('Cost Split') && (<TableCell align="right" sx={{ whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px'  }} padding="none">
        ₹{legalCharge?.toLocaleString('en-IN')}
        </TableCell>)} */}
       <TableCell align="right" sx={{width: '142px', whiteSpace: 'nowrap', background: "#fff", borderLeft: '0.2px solid #e7e5e4', paddingRight: '6px', fontSize: '13px' }} padding="none" >
        ₹{row?.T_total?.toLocaleString('en-IN')}
        </TableCell>
        {viewUnitStatusA.includes('Avg sqft Cost') && (<TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px', fontSize: '13px' }} padding="none">
        ₹{row?.sqft_rate?.toLocaleString('en-IN')}
        </TableCell>)}
        {viewUnitStatusA.includes('Avg sqft Cost') && (<TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', background: "#d1d1fb", paddingRight: '6px', fontSize: '13px' }} padding="none">
        ₹{row?.sqft_rate?.toLocaleString('en-IN')}
        </TableCell>)}
        <TableCell align="right" sx={{ width: '142px',whiteSpace: 'nowrap', background: "#fff", borderLeft: '0.2px solid #e7e5e4', paddingRight: '6px', fontSize: '13px' }} padding="none">
        ₹{row?.T_approved?.toLocaleString('en-IN')}


        </TableCell>
      <TableCell align="right" sx={{width: '142px', whiteSpace: 'nowrap',  borderLeft: '0.2px solid #e7e5e4' ,  borderRight: '0.2px solid #e7e5e4', paddingRight: '6px', fontSize: '13px' ,'& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    }, '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    } }} padding="none">
        ₹{row?.T_balance?.toLocaleString('en-IN')}
        </TableCell>
        {viewUnitStatusA.includes('Cost Split') && (  <TableCell align="right" sx={{width: '142px', whiteSpace: 'nowrap',  paddingRight: '6px',color: '#0ea5e9',borderLeft: '0.2px solid #e7e5e4', borderRight: '0.2px solid #e7e5e4' ,fontSize: '13px',   '& span': {
      display: 'inline-block',
      borderBottom: '0.5px solid transparent',
      transition: 'border-bottom 0.3s ease',
    },
    '& span:hover': {
      borderBottom: '0.2px solid #e7e5e4', // Apply border on hover
    } }} padding="none">
          ₹{row?.T_E?.toLocaleString('en-IN')}
        </TableCell>)}

        {viewUnitStatusA.includes('CRM Executive') && <TableCell sx={{ whiteSpace: 'nowrap',  paddingRight: '8px' , paddingLeft: '8px', background: "#d1d1fb", fontSize: '13px' }} padding="none">{row?.assignedToObj?.email}</TableCell>}

       {viewUnitStatusA.includes('Sales Executive') && <TableCell sx={{ whiteSpace: 'nowrap',  paddingRight: '8px' , paddingLeft: '8px', background: "#d1d1fb",fontSize: '13px'  }} padding="none">{row?.by}</TableCell>}

                        {viewUnitStatusA.includes('Remarks') && (
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            sx={{ whiteSpace: 'nowrap',  paddingRight: '8px' , paddingLeft: '8px', background: "#d1d1fb",fontSize: '13px'  }}
                          >
                            <>
                              {/* <span className="font-bodyLato">
                          {prettyDate(row?.stsUpT || row.Date).toLocaleString()}
                        </span> */}
                              <span className="px- py-[1px]  min-w-[100px] inline-flex text-xs leading-5 tracking-wide  rounded-full  text-green-800">
                                {Math.abs(
                                  getDifferenceInMinutes(
                                    (row?.leadUpT || row?.stsUpT),
                                    ''
                                  )
                                ) > 60
                                  ? Math.abs(
                                    getDifferenceInMinutes(
                                      (row?.leadUpT || row?.stsUpT),
                                      ''
                                    )
                                  ) > 1440
                                    ? `${Math.abs(getDifferenceInDays(
                                      (row?.leadUpT || row?.stsUpT),
                                      ''
                                    ))} Days `
                                    : `${Math.abs(getDifferenceInHours(
                                      (row?.leadUpT || row?.stsUpT),
                                      ''
                                    ))} Hours `
                                  : `${Math.abs(getDifferenceInMinutes(
                                    (row?.leadUpT || row?.stsUpT),
                                    ''
                                  )) || 0} Min`}{' '}
                                  {/* in above line I have added 0 to take Nan value */}
                                {getDifferenceInMinutes(
                                  (row?.leadUpT || row?.stsUpT),
                                  ''
                                ) < 0
                                  ? 'ago'
                                  : 'Left'}
                              </span>
                            </>
                          </TableCell>)}
                        {viewUnitStatusA.includes('Next Sch') && <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          sx={{ whiteSpace: 'nowrap',  paddingRight: '8px' , paddingLeft: '8px', background: "#d1d1fb", fontSize: '13px' }}
                        >
                          <>
                            {/* <span className="font-bodyLato">
                          {prettyDate(row?.stsUpT || row.Date).toLocaleString()}
                        </span> */}
                            <span className="px- py-[1px]  min-w-[100px] inline-flex text-xs leading-5 tracking-wide  rounded-full  text-green-800">
                              {Math.abs(
                                getDifferenceInMinutes(
                                  (row?.schTime),
                                  ''
                                )
                              ) > 60
                                ? Math.abs(
                                  getDifferenceInMinutes(
                                    (row?.schTime),
                                    ''
                                  )
                                ) > 1440
                                  ? `${Math.abs(getDifferenceInDays(
                                    (row?.schTime),
                                    ''
                                  ))} Days `
                                  : `${Math.abs(getDifferenceInHours(
                                    (row?.schTime),
                                    ''
                                  ))} Hours `
                                : `${Math.abs(getDifferenceInMinutes(
                                  (row?.schTime),
                                  ''
                                ))} Min`}{' '}
                              {getDifferenceInMinutes(
                                (row?.schTime),
                                ''
                              ) < 0
                                ? 'ago'
                                : 'Left'}
                            </span>
                          </>
                        </TableCell>
                        }

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
    </div>
  )
}
