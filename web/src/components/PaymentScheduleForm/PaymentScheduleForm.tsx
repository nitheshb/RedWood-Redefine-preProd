import React, { useEffect, useState } from 'react'
import { Alert, AlertTitle } from '@mui/lab'
import { format, isDate } from 'date-fns'
import { useSnackbar } from 'notistack'
import Select from 'react-select'

import {
  paymentScheduleA,
  paymetScheduleConstruct,
} from 'src/constants/projects'
import {
  addPhasePaymentScheduleCharges,
  updatePaymentScheduleCharges,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

import EditablePaymentTable from '../comps/EditablePaymentComp'

const PaymentScheduleForm = ({ title, data, source, blocksViewFeature }) => {
  const { user } = useAuth()

  const { orgId } = user
  const [tableData, setTableData] = useState([])
  const [constructSchedule, setConstructSchedule] = useState([])
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const [editOpitionsObj, setEditOptions] = useState({})

  useEffect(() => {
    if (['projectManagement', 'projectOnboard'].includes(source)) {
      setEditOptions({
        onRowAdd: async (newData) => await handleRowAdd(newData),
        onRowUpdate: async (newData, oldData) =>
          await handleRowUpdate(newData, oldData),
        onRowDelete: async (oldData) => await handleRowDelete(oldData),
      })
    }
  }, [source, data, tableData])
  useEffect(() => {
    const { phase } = data

    const { paymentScheduleObj, ConstructPayScheduleObj } = phase
    const x =
      blocksViewFeature === 'Construction_Payment_Schedule'
        ? ConstructPayScheduleObj || data?.phase?.phase?.ConstructPayScheduleObj
        : paymentScheduleObj || data?.phase?.phase?.paymentScheduleObj

    setTableData(x)
    const y =
      ConstructPayScheduleObj ||
      data?.phase?.phase?.ConstructPayScheduleObj ||
      []

    setConstructSchedule(y)
    console.log('payment', paymentScheduleObj)
  }, [data, blocksViewFeature])

  const defaultValue = (options, value) => {
    return (
      (options
        ? options.find((option) => option.value === value?.value)
        : '') || ''
    )
  }
  const columns = [
    {
      title: 'Stage*',
      field: 'stage',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => {
        return rowData?.stage?.label
      },
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="component"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={
              blocksViewFeature === 'Plot_Payment_Schedule'
                ? paymentScheduleA
                : paymetScheduleConstruct
            }
            value={defaultValue(
              blocksViewFeature === 'Plot_Payment_Schedule'
                ? paymentScheduleA
                : paymetScheduleConstruct,
              value
            )}
            className="text-md mr-2 z-50"
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        )
      },
    },
    {
      title: 'Cost Type',
      field: 'percentage',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      editComponent: ({ value, onChange }) => (
        <>
          <input
            placeholder="percentage"
            className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
            autoComplete="off"
            onChange={(e) => onChange(e.target.value)}
            value={value}
            type="number"
            max="100"
          />
        </>
      ),
    },
    {
      title: 'Zero Day*',
      field: 'zeroDay',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      editComponent: ({ value, onChange }) => (
        <input
          placeholder="Days"
          className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          value={value}
          type="number"
          max="100"
        />
      ),
    },
    {
      title: 'Description*',
      field: 'description',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      editComponent: ({ value, onChange }) => (
        <input
          placeholder="Description"
          className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
      ),
    },
  
  ]

 

  const errors = (formData, isEdit) => {
    const errorList = []
    if (!formData.stage) {
      errorList.push("Try Again, You didn't enter the stage field")
    }
    if (!formData.percentage) {
      errorList.push("Try Again, You didn't enter the Percentage field")
    }


    return errorList
  }
  const handleRowUpdate = async (newData, oldData) => {
    const errorList = errors(newData, true)
    if (errorList.length < 1) {
      const { uid, paymentScheduleObj } = data?.phase || {}
      const update = {
        ...newData,
        dueDate: isDate(newData.dueDate)
          ? format(newData.dueDate, 'dd/MM/yyyy')
          : newData.dueDate || null,
      }

      console.log('check this stuff', tableData, paymentScheduleObj)
      const c = await tableData.map((e) => {
        console.log(e.myId, oldData.myId, e.myId === oldData.myId)
        if (e.myId === oldData.myId) {
          return update
        }
        const { tableData, ...rest } = e
        return rest
      })

      console.log('check this stuff it', c)
      await updatePaymentScheduleCharges(
        orgId,
        uid || data?.phase?.phase?.uid,
        c,
        blocksViewFeature === 'Construction_Payment_Schedule'
          ? 'ConstructPayScheduleObj'
          : 'paymentScheduleObj',
        enqueueSnackbar
      )
    } else {
      setErrorMessages(errorList)
      setIserror(true)
    }
  }

  const handleRowDelete = async (oldData) => {
    const { uid } = data?.phase || {}
    const c = tableData.filter((e) => e.myId != oldData.myId)
    const newArray = c.map((obj) => {
      const { tableData, ...rest } = obj
      return rest
    })
    console.log('check this stuff', c)
    await updatePaymentScheduleCharges(
      orgId,
      uid || data?.phase?.phase?.uid,
      newArray,
      blocksViewFeature === 'Construction_Payment_Schedule'
        ? 'ConstructPayScheduleObj'
        : 'paymentScheduleObj',
      enqueueSnackbar
    )
  }

  const handleRowAdd = async (newData) => {
    setIserror(false)
    setErrorMessages([])
    const errorList = errors(newData, false)
    if (errorList.length < 1) {
      console.log('data ai s', newData, data, data?.phase?.phase)
      const { projectId, uid } = data?.phase || {}
      const update = {
        ...newData,
      }
     

      await addPhasePaymentScheduleCharges(
        orgId,
        uid || data?.phase?.phase?.uid,
        update,
        blocksViewFeature === 'Construction_Payment_Schedule'
          ? 'ConstructPayScheduleObj'
          : 'paymentScheduleObj',
        enqueueSnackbar
      )
    } else {
      setErrorMessages(errorList)
      setIserror(true)
    }
  }

  return (
    <div className="h-full w-full shadow-xl flex flex-col mb-2  rounded-t overflow-y-scroll">
      <div className="">
        <EditablePaymentTable
          blocksViewFeature={'Plot_Payment_Schedule'}
          title={
            data?.projectType?.name === 'Apartment' || data?.phase?.projectType?.name === 'Apartment'
              ? 'Flat Payment Schedule'
              : 'Plot Payment Schedule'
          }
          dataPayload={tableData}
          projData={data}
        />
        {data?.projectType?.name === 'Villas' ||
          (data?.phase?.projectType?.name === 'Villas' && (
            <EditablePaymentTable
              blocksViewFeature={'Construction_Payment_Schedule'}
              title={'Construction Payment Schedule'}
              dataPayload={constructSchedule}
              projData={data}
            />
          ))}
     
        <div>
          {iserror && (
            <Alert severity="error">
              <AlertTitle>ERROR</AlertTitle>
              {errorMessages.map((msg, i) => {
                return <div key={i}>{msg}</div>
              })}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentScheduleForm
