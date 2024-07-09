import React, { useState, useEffect } from 'react'

import { Rowing } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid'

import {
  costSheetAdditionalChargesA,
  csSections,
  gstValesA,
  unitsCancellation,
} from 'src/constants/projects'
import {
  addCostSheetMaster,
  addPhasePartAtax,
  addPhaseFullCs,
  steamBankDetailsList,
  streamProjectMaster,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { MultiSelectMultiLineField } from 'src/util/formFields/selectBoxMultiLineField'

import { gstValesPartA } from '../../../../../RedefineV2/web/src/constants/projects'
// import './styles.css'

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

const EditableTable = ({ phase, partAData, fullCs, source, type }) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()
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
  const [gst, setGST] = useState(12)

  useEffect(() => {
    if (source === 'project') {
      console.log('hello', fullCs)
      const costSqftA = fullCs.filter(
        (row) => row.component.value === 'sqft_cost_tax'
      )
      if (costSqftA.length > 0) {
        console.log('setUpData', costSqftA)
        const x = costSqftA[0]
        setCostPerSqft(x?.charges)
        setGST(x?.gst.value)
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

  const handleDelete = (id) => {
    setRows(rows.filter((item) => item.id !== id))
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[id]
      return newErrors
    })
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
    console.log('setUpData is ', rows, source)
    const data = { fullCs: rows, type: type }
    const { projectId, uid } = phase || {}
    if (source === 'project') {
      addPhaseFullCs(orgId, uid, rows, 'partATaxObj', enqueueSnackbar)
    } else {
      addCostSheetMaster(orgId, `${type}_cs`, data, enqueueSnackbar)
    }
  }
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
    setRows(
      rows.map((row) =>
        row.component.value === 'sqft_cost_tax'
          ? { ...row, ['charges']: inputValue }
          : row
      )
    )
    setCostPerSqft(e.target.value)
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
  return (
    <div className="container mx-auto mt-10 p-4 bg-white rounded-xl">
      <section className="flex flex-row space-x-4 mx-4">
        <div className="mb-3 w-[140px]">
          <label htmlFor="area" className="label font-medium text-sm">
            Basic Cost per sqft*
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              {/* <svg
              className="w-4 h-4 text-gray-500 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg> */}
              Rs
            </span>
            <input
              type="text"
              id="website-admin"
              className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-none focus:border-none block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
              placeholder="cost/sqft"
              value={costPerSqft}
              onChange={handleCostChange}
            />
          </div>
        </div>
        <div className="mb-3 w-[120px]">
          <label htmlFor="area" className="label font-medium text-sm">
            Default Tax Rate*
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              {/* <svg
              className="w-4 h-4 text-gray-500 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg> */}
              %
            </span>
            <input
              type="text"
              id="website-admin"
              className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-none focus:border-none block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
              placeholder="GST"
              value={gst}
              onChange={handleCostGSTChange}
            />
          </div>
        </div>
      </section>
      <p className="text-xs text-red-400 text-left my-3 mt-1 mx-3">
        <abbr title="Required field">*</abbr> PLC value will be picked from each
        unit entry
      </p>
      <div className="container mx-auto p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <table className="w-full border-collapse rounded-md">
            <thead>
              <tr className="bg-white rounded-xl">
                <th className="border border-[#e0e0e0] p-1 pl-2 text-left rounded-tl-sm rounded-xl text-md">
                  Charges For
                </th>
                <th className="border border-[#e0e0e0] p-1 pl-2 text-left">
                  Category
                </th>
                <th className="border border-[#e0e0e0] p-1 pl-2 text-left">
                  Cost Type
                </th>
                <th className="border border-[#e0e0e0] p-1 pl-2 text-right">
                  Amount
                </th>
                <th className="border border-[#e0e0e0] p-1 pl-2 text-left">
                  Tax Rate
                </th>
                {/* <th className="border border-[#e0e0e0] p-2 text-left">
                  Description
                </th> */}
                <th className="border border-[#e0e0e0] p-1 pl-2 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <Droppable droppableId="table">
              {(provided) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {rows
                    .filter((row) => row.section.value != 'unitCost')
                    .map((row, index) => (
                      <Draggable
                        key={row.id}
                        draggableId={row.id}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="hover:bg-gray-100 transition-colors duration-150 ease-in-out"
                          >
                            <td className="border border-[#e0e0e0] ">
                              {/* <select
                              value={row.col1}
                              onChange={(e) =>
                                handleChange1(row.id, 'col1', e.target.value)
                              }
                              className="w-full p-1 border border-[#e0e0e0] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="option1">Option 1</option>
                              <option value="option2">Option 2</option>
                              <option value="option3">Option 3</option>
                            </select> */}
                              {/* <MultiSelectMultiLineField
                              label=""
                              name="builderBankDocId"
                              onChange={(payload) => {
                                console.log('changed value is ', payload)

                                handleChange1(row.id, 'category', payload)
                              }}
                              value={row.category.value}

                              // value={'optionx'}
                              options={costSheetAdditionalChargesA}
                              setAddNewBankStuff={setAddNewBankStuff}
                            /> */}
                              <Select
                                name="Chargesdropdown"
                                onChange={(e) => {
                                  // onChange(value_x)
                                  // handleChange(row.id, 'value', e.value)
                                  handleChange1(row.id, 'component', e)
                                }}
                                options={costSheetAdditionalChargesA}
                                // value={defaultValue(costSheetAdditionalChargesA, row.component.value)}
                                value={row.component}
                                styles={customStyles}
                                className="text-md mr-2"
                              />
                            </td>
                            <td className="border border-[#e0e0e0]">
                              {/* <input
                              type="text"
                              value={row.unit}
                              onChange={(e) =>
                                handleChange(row.id, 'unit', e.target.value)
                              }
                              className="w-full p-1 border border-[#e0e0e0] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            /> */}

                              <Select
                                name="Chargesdropdown"
                                onChange={(e) => {
                                  // onChange(value_x)
                                  // handleChange(row.id, 'value', e.value)
                                  // handleChange(row.id, 'unit', e.target.value)
                                  handleChange1(row.id, 'section', e)
                                }}
                                options={csSections}
                                styles={customStyles}
                                // value={defaultValue(gstValesA, item.unit)}
                                value={row.section}
                                className="text-md mr-2 border-0"
                              />
                            </td>
                            <td className="border border-[#e0e0e0]">
                              {/* <input
                              type="number"
                              value={row.unit}
                              onChange={(e) =>
                                handleChange(row.id, 'unit', e.target.value)
                              }
                              className="w-full p-1 border border-[#e0e0e0] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            /> */}
                              <Select
                                name="Chargesdropdown"
                                onChange={(e) => {
                                  // onChange(value_x)
                                  // handleChange(row.id, 'value', e.value)
                                  // handleChange(row.id, 'unit', e.target.value)
                                  handleChange1(row.id, 'units', e)
                                }}
                                options={unitsCancellation}
                                styles={customStyles}
                                value={row.units}
                                // value={defaultValue(gstValesA, item.unit)}
                                className="text-md mr-2"
                              />
                            </td>
                            <td className="border border-[#e0e0e0]">
                              <input
                                type="number"
                                value={row?.charges}
                                onChange={(e) =>
                                  // handleChange(row.id, 'unit', e.target.value)
                                  handleChange1(
                                    row.id,
                                    'charges',
                                    e.target.value
                                  )
                                }
                                className="w-full p-1 border text-right border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                            <td className="border border-[#e0e0e0] ">
                              {/* <input
                              type="number"
                              value={row.unit}
                              onChange={(e) =>
                                handleChange(row.id, 'unit', e.target.value)
                              }
                              className="w-full p-1 border border-[#e0e0e0] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            /> */}
                              <Select
                                name="Chargesdropdown"
                                onChange={(e) => {
                                  // onChange(value_x)
                                  // handleChange(row.id, 'value', e.value)
                                  // handleChange(row.id, 'unit', e.target.value)
                                  handleChange1(row.id, 'gst', e)
                                }}
                                options={gstValesA}
                                value={row.gst}
                                // value={defaultValue(gstValesA, item.unit)}
                                styles={customStyles}
                                className="text-md mr-2 text-right"
                              />
                            </td>
                            {/* <td className="border border-[#e0e0e0] p-2">
                            <input
                              type="text"
                              // value={row.unit}
                              onChange={(e) =>
                                handleChange(row.id, 'unit', e.target.value)
                              }
                              className="w-full p-1 border border-[#e0e0e0] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                          </td> */}
                            <td className="border border-[#e0e0e0] ">
                              <button
                                onClick={() => handleDelete(row.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
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
        <div className="flex justify-between">
          <button
            onClick={addRow}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-md py-1 px-2 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
          >
            + Row
          </button>
          <button
            onClick={saveSetup}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-md py-1 px-2 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditableTable
