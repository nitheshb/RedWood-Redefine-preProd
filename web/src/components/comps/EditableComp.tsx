import React, { useState, useEffect } from 'react'

import { steamBankDetailsList } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { MultiSelectMultiLineField } from 'src/util/formFields/selectBoxMultiLineField'

const EditableTable = () => {
  const { user } = useAuth()
  const { orgId } = user
  const [data, setData] = useState([
    { id: 1, category: 'Food', unit: 'kg', value: 10 },
    { id: 2, category: 'Drink', unit: 'liter', value: 5 },
    { id: 3, category: 'Electronics', unit: 'piece', value: 2 },
  ])
  const [bankDetailsA, setBankDetailsA] = useState([])

  const [errors, setErrors] = useState({})
  const [addNewBankStuff, setAddNewBankStuff] = useState(false)

  useEffect(() => {
    const unsubscribe = steamBankDetailsList(
      orgId,
      (querySnapshot) => {
        const addNewSetUp = [{ value: 'addNewOption', label: 'Add New' }]
        const bankA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })
        bankA.map((user) => {
          user.label = user?.accountName
          user.value = user?.accountNo
        })
        console.log('fetched users list is', bankA)
        setBankDetailsA([...addNewSetUp, ...bankA])
      },
      (error) => setBankDetailsA([])
    )

    return unsubscribe
  }, [])
  const categories = ['Food', 'Drink', 'Electronics', 'Clothing']

  const handleChange = (id, field, value) => {
    if (field === 'category') {
      const isDuplicate = data.some(
        (item) => item.id !== id && item.category === value
      )
      if (isDuplicate) {
        setErrors((prev) => ({
          ...prev,
          [id]: 'This category is already in use',
        }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[id]
          return newErrors
        })
      }
    }

    setData(
      data.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === 'value' ? parseInt(value) || 0 : value,
            }
          : item
      )
    )
  }

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id))
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

  return (
    <div className="container mx-auto mt-10 p-4 bg-gray-100">
      <table className="w-full border-collapse bg-white shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="excel-cell font-semibold">Charges For</th>
            <th className="excel-cell font-semibold">Unit</th>
            <th className="excel-cell font-semibold">Price</th>
            <th className="excel-cell font-semibold">GST</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="excel-cell">
                <div className="flex flex-col">
                  
                  <MultiSelectMultiLineField
                    label=""
                    name="builderBankDocId"
                    onChange={(payload) => {
                      console.log('changed value is ', payload)
                    }}
                    value={'c'}
                    options={bankDetailsA}
                    setAddNewBankStuff={setAddNewBankStuff}
                  />
                  {/* <select
                    value={item.category}
                    onChange={(e) => handleChange(item.id, 'category', e.target.value)}
                    className={`w-full bg-transparent focus:outline-none ${errors[item.id] ? 'border-red-500' : ''}`}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select> */}
                 {/* {errors[item.id] && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors[item.id]}
                    </span>
                  )} */}
                </div>
              </td>
              <td className="excel-cell">
                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) =>
                    handleChange(item.id, 'unit', e.target.value)
                  }
                  className="w-full bg-transparent focus:outline-none"
                />
              </td>
              <td className="excel-cell">
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) =>
                    handleChange(item.id, 'value', e.target.value)
                  }
                  className="w-full bg-transparent focus:outline-none"
                />
              </td>
              <td className="excel-cell">
                <button
                  onClick={() => handleDelete(item.id)}
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
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <style>{`
        .excel-cell {
          border: 1px solid #e2e8f0;
          padding: 8px;
          position: relative;
        }
        .excel-cell:focus-within {
          outline: 2px solid #4299e1;
          outline-offset: -2px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  )
}

export default EditableTable
