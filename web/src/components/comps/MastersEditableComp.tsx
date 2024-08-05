import React, { useState, useEffect } from 'react'

import { Dialog } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { Select as SelectMAT, MenuItem } from '@material-ui/core'
import { Rowing, Widgets } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { gridColumnsTotalWidthSelector } from '@mui/x-data-grid'
import { useSnackbar } from 'notistack'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid'


import { useRef } from 'react';



// import unitTypeList from '../AddUnit';
// import facingTypeList from '../AddUnit';
// import bedRoomsList from '../AddUnit';
// import bathTypeList from '../AddUnit';
// import carParkingList from '../AddUnit';
// import statusList from '../AddUnit';

// import mortgageType from '../AddUnit';







import {
  approvalAuthority,
  bathTypeList,
  bedRoomsList,
  carParkingList,
  costSheetAdditionalChargesA,
  csSections,
  facingTypeList,
  gstValesA,
  mortgageType,
  paymentScheduleA,
  sourceListItems,
  statesList,
  statusList,
  unitsCancellation,
  unitTypeList,
  VillaCsSections,
} from 'src/constants/projects'
import {
  addCostSheetMaster,
  addPhasePartAtax,
  addPhaseFullCs,
  steamBankDetailsList,
  streamProjectMaster,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { formatIndianNumber } from 'src/util/formatIndianNumberTextBox'
import { MultiSelectMultiLineField } from 'src/util/formFields/selectBoxMultiLineField'

import { gstValesPartA } from '../../../../../RedefineV2/web/src/constants/projects'
// import WarnPopUpNew from '../SiderForm/WarnPopUp'

import WarningModel from './warnPopUp'
import WarnPopUp from './warnPopUp'

// import './styles.css'
const StyledSelect = styled(SelectMAT)(({ theme }) => ({
  // width: '170px',
  fontSize: '13px',
  '&.MuiInputBase-root': {
    width: '100%',
    fontSize: '13px', //
  },
  '&.MuiOutlinedInput-root': {
    width: '100%',
  },
  '&.MuiFilledInput-root': {
    width: '100%',
  },
  '& .MuiSelect-select': {
    borderBottom: 'none',
    paddingRight: '32px',
    fontSize: '13px', //
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSelect-icon': {
    right: 0,
    width: '32px',
    pointerEvents: 'none',
  },
  '& .MuiInput-underline:before': {
    borderBottom: 'none',
  },
  '& .MuiInput-underline:after': {
    borderBottom: 'none',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottom: 'none',
  },
  '& .MuiMenuItem-root': {
    fontSize: '13px', // Set font size for menu items
  },
}))
const EditableTablex = () => {
  const [rows, setRows] = useState([
    { id: '1', col1: 'option1', col2: '', col3: '' },
  ])

  const onDragEnd = (result) => {
    if (!result.destination) return

    const newRows = Array.from(rows)
    const [reorderedItem] = newRows.splice(result.source.index, 1)
    newRows.splice(result.destination.index, 0, reorderedItem)

    setRows(newRows)
  }

  const handleChange = (id, column, value) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [column]: value } : row))
    )
  }

  const addRow = () => {
    const uid = uuidv4()

    const newRow = {
      id: uid,
      col1: 'option1',
      col2: '',
      col3: '',
    }
    setRows([...rows, newRow])
  }



  return (
    <div className="container mx-auto p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-[#e0e0e0] p-2 text-left">
                Column 1 (Dropdown)
              </th>
              <th className="border border-[#e0e0e0] p-2 text-left">
                Column 2 (Text)
              </th>
              <th className="border border-[#e0e0e0] p-2 text-left">
                Column 3 (Number)
              </th>
            </tr>
          </thead>
          <Droppable droppableId="table">
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {rows.map((row, index) => (
                  <Draggable key={row.id} draggableId={row.id} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="hover:bg-gray-100 transition-colors duration-150 ease-in-out"
                      >
                        <td className="border border-[#e0e0e0] p-2">
                          <select
                            value={row.col1}
                            onChange={(e) =>
                              handleChange(row.id, 'col1', e.target.value)
                            }
                            className="w-full p-1 border border-[#e0e0e0] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                          </select>
                        </td>
                        <td className="border border-[#e0e0e0] p-2">
                          <input
                            type="text"
                            value={row.col2}
                            onChange={(e) =>
                              handleChange(row.id, 'col2', e.target.value)
                            }
                            className="w-full p-1 border border-[#e0e0e0] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="border border-[#e0e0e0] p-2">
                          <input
                            type="number"
                            value={row.col3}
                            onChange={(e) =>
                              handleChange(row.id, 'col3', e.target.value)
                            }
                            className="w-full p-1 border border-[#e0e0e0] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </DragDropContext>
      <button
        onClick={addRow}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
      >
        Add Row
      </button>
    </div>
  )
}

const MastersEditableTable = ({ phase, partAData, fullCs, source, type }) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()
  const [csCategoryOptionsA, setCsCategoryOptionsA] = useState([])
  const [data, setData] = useState([
    {
      id: 1,
      category: { value: 'addNewOption', label: 'Add New' },
      unit: 'kg',
      value: 10,
    },
    {
      id: 2,
      category: { value: '123', label: 'Apple' },
      unit: 'liter',
      value: 5,
    },
    {
      id: 3,
      category: { value: '124', label: 'Bat' },
      unit: 'piece',
      value: 2,
    },
  ])
  const [bankDetailsA, setBankDetailsA] = useState([])

  const [errors, setErrors] = useState({})
  const [costPerSqft, setCostPerSqft] = useState(1000)
  const [constructionPerSqft, setConstructionPerSqft] = useState(1200)
  const [gst, setGST] = useState(12)
  const [constGst, setConstGST] = useState(12)
  const [open, setOpen] = useState(false)
  const [saveWarn, setSaveWarn] = useState(false)
  const [selcDelRow, SetSelDelRow] = useState({})

  useEffect(() => {
    if (source === 'project') {
      console.log('hello', fullCs)
      const costSqftA = fullCs.filter(
        (row) => row.component.value === 'sqft_cost_tax'
      )
      const costConstructSqftA = fullCs.filter(
        (row) => row.component.value === 'sqft_construct_cost_tax'
      )
      if (costSqftA.length > 0) {
        console.log('setUpData', costSqftA)
        const x = costSqftA[0]
        setCostPerSqft(x?.charges)
        setGST(x?.gst.value)
      }
      if (costConstructSqftA.length > 0) {
        console.log('setUpData', costSqftA)
        const x = costConstructSqftA[0]
        setConstructionPerSqft(x?.charges)
        setConstGST(x?.gst.value)
      }
      setRows(fullCs)
    } else {
      const unsubscribe = streamProjectMaster(
        orgId,
        (querySnapshot) => {
          const addNewSetUp = [{ value: 'addNewOption', label: 'Add New' }]
          const bankA = querySnapshot.docs.map((docSnapshot) => {
            const x = docSnapshot.data()
            x.id = docSnapshot.id
            return x
          })
          // fullCs
          bankA.map((user) => {
            user.label = user?.accountName
            user.value = user?.accountNo
          })
          console.log('fetched users list is', bankA)
          if (bankA?.length > 0) {
            const y = bankA.filter((item) => item.type == type)
            console.log('matched is ', y)
            const x = y[0]['fullCs']
            // setBankDetailsA([...addNewSetUp, ...bankA])
            setRows(x)
          }
        },
        (error) => setRows([])
      )

      return unsubscribe
    }
  }, [fullCs])
  useEffect(() => {
    if (phase?.projectType?.name === 'Villas') {
      setCsCategoryOptionsA(VillaCsSections)
    } else {
      setCsCategoryOptionsA(csSections)
    }
  }, [phase])
  const categories = ['Food', 'Drink', 'Electronics', 'Clothing']

  const handleChange = (id, field, value) => {
    // if (field === 'category') {
    //   const isDuplicate = data.some(
    //     (item) => item.id !== id && item.category === value
    //   )
    //   if (isDuplicate) {
    //     setErrors((prev) => ({
    //       ...prev,
    //       [id]: 'This category is already in use',
    //     }))
    //   } else {
    //     setErrors((prev) => {
    //       const newErrors = { ...prev }
    //       delete newErrors[id]
    //       return newErrors
    //     })
    //   }
    // }

    setData(
      data.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    )
  }

  const WarnDeletion = (id) => {
    setOpen(true)
    SetSelDelRow(id)
  }
  const yesDelete = () => {
    setOpen(false)
    saveSetup()
  }
  const handleDelete = async () => {
    console.log('delete operatin is', selcDelRow)
    const id = selcDelRow?.id
    await setRows(rows.filter((item) => item.id !== id))

    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[id]
      return newErrors
    })
    await handleCostSheetSave()
  }

  const handleAdd = () => {
    const newId = Math.max(...data.map((item) => item.id), 0) + 1
    setData([...data, { id: newId, category: 'Food', unit: '', value: 0 }])
  }

  const onDragEnd = (result) => {
    console.log('resulet is ', result)
    if (!result.destination) return

    const newRows = Array.from(rows)
    const [reorderedItem] = newRows.splice(result.source.index, 1)
    newRows.splice(result.destination.index, 0, reorderedItem)

    setRows(newRows)
  }

  const handleChange1 = (id, column, value) => {
    console.log('latest check', value)
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [column]: value } : row))
    )
  }

  const addRow = () => {
    // const newRow = {
    //   id: String(rows.length + 1),
    //   category: { label: 'Add new', value: 'addNewOption' },
    //   col2: '',
    //   col3: '',
    // }
    const uid = uuidv4()

    const newRow = {
      id: uid,
      myId: '2c7bcd74-d334-471e-9138-5de5c96ee484',
      section: {
        value: 'additionalCost',
        label: 'Additional Charges',
      },
      component: {
        value: 'carparking',
        label: 'Car Parking',
      },
      gst: {
        value: '5',
        label: '5%',
      },
      units: {
        label: 'Fixed cost',
        value: 'fixedcost',
      },
      description: 'Car parking',
      charges: '200000',
      tableData: {
        id: rows.length + 1,
      },
    }
    setRows([...rows, newRow])
  }
  const saveSetup = () => {
    setSaveWarn(true)
  }
  const handleCostSheetSave = () => {
    console.log('setUpData is ', rows, source)
    const data = { fullCs: rows, type: type }
    const { projectId, uid } = phase || {}
    if (source === 'project') {
      const myId = selcDelRow?.id
      if (myId) setRows(rows.filter((item) => item.id !== myId))
      const newSet = rows.filter((item) => item.id !== myId)
      addPhaseFullCs(orgId, uid, newSet, 'partATaxObj', enqueueSnackbar)
    } else {
      addCostSheetMaster(orgId, `${type}_cs`, data, enqueueSnackbar)
    }
  }






  const projectItems = [
    'Planning Authority',
    'State',
    'Charges For',
    'Category',
    'Cost Type',
    'Tax Rate',
    'Payment Stage',
    'Type',
    'Facing',
    'Type/BedRooms',
    'Bathrooms',
    'Car Parking',
    'Status',
    'Mortgage Type',
  ];

  const crmItems = ['Lead Source', 'Booking By'];



const dataMap: { [key: string]: { label: string }[] } = {
  'Planning Authority': approvalAuthority,
  'State': statesList,
  'Charges For': costSheetAdditionalChargesA,
  'Category': csSections,
  'Cost Type': unitsCancellation,
  'Tax Rate': gstValesA,
  'Payment Stage': paymentScheduleA,
  'Type': unitTypeList,
  'Facing': facingTypeList,
  'Type/BedRooms': bedRoomsList,
  'Bathrooms': bathTypeList,
  'Car Parking': carParkingList,
  'Status': statusList,
  'Mortgage Type': mortgageType,
  'Lead Source': sourceListItems,
  'Booking By': []
};

const [activeItem, setActiveItem] = useState<string | null>(null);
const contentRefs = useRef<{ [key: string]: HTMLElement | null }>({});

const handleClick = (item: string) => {
  setActiveItem(item);
  if (contentRefs.current[item]) {
    contentRefs.current[item]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveItem(entry.target.id.replace(/-/g, ' '));
        }
      });
    },
    {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0.1
    }
  );

  Object.values(contentRefs.current).forEach(ref => {
    if (ref) observer.observe(ref);
  });

  return () => {
    Object.values(contentRefs.current).forEach(ref => {
      if (ref) observer.unobserve(ref);
    });
  };
}, []);





const SidebarItem: React.FC<{ item: string }> = ({ item }) => (
  <li className={`border-l-2 ${
    activeItem === item ? 'border-blue-600 border-l-4' : ' border-[#c1c1c1] hover:border-gray-800'
  }`}>
    <a
      href={`#${item.replace(/\s+/g, '-').toLowerCase()}`}
      className={`block pl-4 pr-4 py-2 ${
        activeItem === item
          ? 'text-blue-600  font-bold'
          : 'text-gray-700  hover:text-blue-600'
      }`}
      onClick={(e) => {
        e.preventDefault();
        handleClick(item);
      }}
    >
      {item}
    </a>
  </li>
);






















  const [rows, setRows] = useState([
    // {
    //   id: '1',
    //   category: { label: 'option1', value: 'addNewOption' },
    //   col2: '',
    //   col3: '',
    // },
    {
      id: '0',
      myId: '2c7bcd74-d334-471e-9138-5de5c96ee484',
      section: {
        value: 'additionalCost',
        label: 'Additional Charges',
      },
      component: {
        value: 'carparking',
        label: 'Car Parking',
      },
      gst: {
        value: '5',
        label: '5%',
      },
      units: {
        label: 'Fixed cost',
        value: 'fixedcost',
      },
      description: 'Car parking',
      charges: '200000',
      tableData: {
        id: 0,
      },
    },
    {
      id: '1',
      section: {
        value: 'additionalCost',
        label: 'Additional Charges',
      },
      gst: {
        label: '18%',
        value: '18',
      },
      component: {
        label: 'Club House Charges',
        value: 'clubhouse_charges',
      },
      description: 'club house charges',
      charges: '250',
      units: {
        value: 'costpersqft',
        label: 'Cost Per sqft',
      },
      myId: 'e95e001a-a2d3-4df9-b4a9-7339ef634d9d',
      tableData: {
        id: 1,
      },
    },
  ])
  const defaultValue = (options, value) => {
    console.log('vale is', value)
    return (
      (options
        ? options.find((option) => option.value === value?.value)
        : '') || ''
    )
  }
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      '&:hover': {
        border: 'none',
      },
      fontSize: '13px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    menu: (provided) => ({
      ...provided,
      position: 'absolute',
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  }
  const handleCostChange = (e) => {
    const inputValue = e.target.value

    const rawValue = e.target.value.replace(/,/g, '')
    const numValue = parseFloat(rawValue)
    if (!isNaN(numValue)) {
      setRows(
        rows.map((row) =>
          row.component.value === 'sqft_cost_tax'
            ? { ...row, ['charges']: numValue }
            : row
        )
      )
      setCostPerSqft(numValue)
    } else {
      setRows(
        rows.map((row) =>
          row.component.value === 'sqft_cost_tax'
            ? { ...row, ['charges']: 0 }
            : row
        )
      )
      setCostPerSqft(0)
    }
  }
  const handleConstructCostChange = (e) => {
    const inputValue = e.target.value
    setRows(
      rows.map((row) =>
        row.component.value === 'sqft_construct_cost_tax'
          ? { ...row, ['charges']: inputValue }
          : row
      )
    )
    setConstructionPerSqft(e.target.value)
  }
  const handleCostGSTChange = (e) => {
    const inputValue = e.target.value
    setRows(
      rows.map((row) =>
        row.component.value === 'sqft_cost_tax'
          ? { ...row, ['gst']: { value: inputValue, label: `${inputValue}%` } }
          : row
      )
    )
    setGST(e.target.value)
  }
  const handleConstCostGSTChange = (e) => {
    const inputValue = e.target.value
    setRows(
      rows.map((row) =>
        row.component.value === 'sqft_construct_cost_tax'
          ? { ...row, ['gst']: { value: inputValue, label: `${inputValue}%` } }
          : row
      )
    )
    setConstGST(e.target.value)
  }
  return (
    <>
      <div className=" m-2 p-4 bg-white rounded-xl">
        <div className="mb-4 ">
          <div className="inline">
            <div className="">
              <label className="font-semibold text-[#053219]  text-sm  mb-1  ">
                Data Masters<abbr title="required"></abbr>
              </label>
            </div>

            <div className="border-t-4 rounded-xl w-16 mt-1 border-[#57C0D0]"></div>
          </div>
        </div>

        <div className="flex h-screen">
      <div className="w-64 text-gray-900 bg-white p-4 overflow-auto">
        <div className="mb-6">
          <div className="mb-4 ">
          <div className="inline">
            <div className="">
              <label className="font-semibold text-[#053219]  text-sm  mb-1  ">
              Add Project<abbr title="required"></abbr>
              </label>
            </div>

            <div className="border-t-4 rounded-xl w-16 mt-1 border-[#57C0D0]"></div>
          </div>
        </div>
          <ul>
            {projectItems.map((item) => (
              <SidebarItem key={item} item={item} />
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-4 ">
          <div className="inline">
            <div className="">
              <label className="font-semibold text-[#053219]  text-sm  mb-1  ">
              CRM Module<abbr title="required"></abbr>
              </label>
            </div>

            <div className="border-t-4 rounded-xl w-16 mt-1 border-[#57C0D0]"></div>
          </div>
        </div>
          <ul>
            {crmItems.map((item) => (
              <SidebarItem key={item} item={item} />
            ))}
          </ul>
        </div>
      </div>





<div className="flex-1 p-6 overflow-auto mx-2 bg-white text-gray-300">
  <div className="max-w-[80rem] mx-auto">
    {Object.keys(dataMap).map((key) => (
      <div
        key={key}
        className="mb-8"
        ref={(el) => (contentRefs.current[key] = el)}
        id={key.replace(/\s+/g, '-').toLowerCase()}
      >
        <h3 className="text-blue-600  text-md font-bold mb-2">{key}</h3>
        <div className="bg-[#fff] rounded-lg border border-[#e1e1e1] overflow-hidden">
          <table className="w-full shadow-md text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e1e1e1]">
                <th className="py-3 px-4 text-xs font-bold  text-[#000]">Options</th>
                <th className="py-3 px-4 text-xs font-bold  text-[#000]">Description</th>
              </tr>
            </thead>
            <tbody>
              {dataMap[key].map((data, i) => (
                <tr key={i} className="border-b border-[#e1e1e1] last:border-b-0">
                  <td className="py-2 px-4  text-sm text-[#000]">{data.label}</td>
                  <td className="py-2 px-4  text-sm text-[#000]">NA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
        <div className="">
          <div className="mb-4 mt-2">
            <div className="inline">
              <div className="">
                <label className="font-semibold text-[#053219]  text-sm  mb-1  ">
                  More Charges<abbr title="required"></abbr>
                </label>
              </div>

              <div className="border-t-4 rounded-xl w-16 mt-1 border-[#57C0D0]"></div>
            </div>
          </div>




        </div>
      </div>



















    </>








  )
}

export default MastersEditableTable