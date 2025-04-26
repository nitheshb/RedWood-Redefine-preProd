import React, { useEffect, useState } from 'react'
import { Select as SelectMAT, MenuItem } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import Select from 'react-select'
import EditableTable from 'src/components/comps/EditableComp'
import {
  costSheetAdditionalChargesA,
  csConstruAdditionalChargesA,
  csPartATax,
  gstValesPartA,
  gstValesA,
  unitsCancellation,
  costSheetPartcChargesA,
} from 'src/constants/projects'
import {
  addPhaseAdditionalCharges,
  addPhasePartAtax,
  updatePhaseAdditionalCharges,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { ToastBar } from 'react-hot-toast'

const AdditionalChargesForm = ({ title, data, source, blocksViewFeature }) => {
  const { user } = useAuth()

  const { orgId } = user
  const [tableData, setTableData] = useState([])
  const [fullCs, setFullCs] = useState([])
  const [partAData, setPartAData] = useState([])
  const [partCData, setPartCData] = useState([])
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const [editOpitionsObj, setEditOptions] = useState({})
  const [editOpitionsObjPartA, setEditOptionsPartA] = useState({})
  const [editOpitionsObjPartC, setEditOptionsPartC] = useState({})

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
    if (['projectManagement', 'projectOnboard'].includes(source)) {
      setEditOptionsPartC({
        onRowAdd: async (newData) => await handleRowAddPartC(newData),
        onRowUpdate: async (newData, oldData) =>
          await handleRowUpdatePartC(newData, oldData),
        onRowDelete: async (oldData) => await handleRowDeletePartC(oldData),
      })
    }
  }, [source, data, tableData, partCData])
  useEffect(() => {
    console.log('partAData', partAData)
    if (['projectManagement', 'projectOnboard'].includes(source)) {
      setEditOptionsPartA({
        onRowAdd: async (newData) => await handleRowAddPartA(newData),
        onRowUpdate: async (newData, oldData) =>
          await handleRowUpdatePartA(newData, oldData),
        onRowDelete: async (oldData) => await handleRowDeletePartA(oldData),
      })
    }
  }, [source, data, tableData, partAData])

  useEffect(() => {
    const { phase } = data

    const { additonalChargesObj, ConstructOtherChargesObj } = phase
    const x =
      blocksViewFeature === 'Construction_Other_Charges'
        ? ConstructOtherChargesObj
        : additonalChargesObj
    setTableData(x)
    console.log('helolo', phase?.fullCs)
    setFullCs(phase?.fullCs || [])
    setPartAData(phase?.partATaxObj || [])
    setPartCData(phase?.partCTaxObj || [])

    console.log('phase is ', phase, x)
  }, [data, blocksViewFeature])

  const { enqueueSnackbar } = useSnackbar()
  const defaultValue = (options, value) => {
    console.log('vale is', value)
    return (
      (options
        ? options.find((option) => option.value === value?.value)
        : '') || ''
    )
  }

  const defaultValueNew = (options, value) => {
    console.log('vale is', value)
    return (
      (options ? options.find((option) => option.value === value) : value) || ''
    )
  }

  // Part-1
  // paymentScheduleA
  const columns = [
    {
      title: 'Charges For*',
      field: 'component',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => {
        return rowData?.component?.label
      },
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <SelectMAT
            defaultValue={'Car Parking'}
            onChange={(e) => {
              const selectedOptionObject =
                blocksViewFeature === 'Construction_Other_Charges'
                  ? csConstruAdditionalChargesA
                  : costSheetAdditionalChargesA.find(
                      (option) => option.value === e.target.value
                    )
              console.log(
                'value is ',
                selectedOptionObject,
                e.target,
                e.target.value,
                value,
                rowData
              )

              onChange(selectedOptionObject)
            }}
          >
            {blocksViewFeature === 'Construction_Other_Charges'
              ? csConstruAdditionalChargesA
              : costSheetAdditionalChargesA.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
          </SelectMAT>
        )
      },
    },
    {
      title: 'Units*',
      field: 'units',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => rowData?.units?.label,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="Chargesdropdown"
            onChange={(value) => {
              console.log('onchane ', value)
              onChange(value)
            }}
            options={unitsCancellation}
            value={defaultValue(unitsCancellation, value)}
            className="text-md mr-2"
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 9,
                position: 'absolute',
              }),
            }}
          />
        )
      },
    },
    {
      title: 'Charges*',
      field: 'charges',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) =>
        rowData?.units?.value === 'percentage'
          ? `${rowData?.charges} %`
          : `₹ ${rowData?.charges?.toLocaleString('en-IN')}`,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <input
            placeholder="Charges"
            className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
            autoComplete="off"
            onChange={(e) =>
              rowData?.units?.value === 'percentage'
                ? onChange(
                    parseInt(e.target.value) > 100 ? 100 : e.target.value
                  )
                : onChange(e.target.value)
            }
            value={value}
            type="number"
            max="100"
          />
        )
      },
    },
    {
      title: 'GST*',
      field: 'gst',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
        padding: '0.25rem',
      },
      render: (rowData) => rowData?.gst?.label,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="Chargesdropdown"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={gstValesA}
            value={defaultValue(gstValesA, value)}
            className="text-md mr-2"
          />
        )
      },
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

  const partAcolumns = [
    {
      title: 'Charges For*',
      field: 'component',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => {
        return rowData?.component?.label
      },
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="component"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={
              blocksViewFeature === 'Construction_Other_Charges'
                ? csPartATax
                : csPartATax
            }
            value={defaultValue(
              blocksViewFeature === 'Construction_Other_Charges'
                ? csPartATax
                : csPartATax,
              value
            )}
            className="text-md mr-2"
          />
        )
      },
    },
    {
      title: 'GST*',
      field: 'gst',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => rowData?.gst?.label,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="Chargesdropdown"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={gstValesPartA}
            value={defaultValue(gstValesPartA, value)}
            className="text-md mr-2"
          />
        )
      },
    },
  ]

  const partCcolumns = [
    {
      title: 'Charges For*',
      field: 'component',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => {
        return rowData?.component?.label
      },
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="component"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={
              blocksViewFeature === 'Construction_Other_Charges'
                ? csConstruAdditionalChargesA
                : costSheetPartcChargesA
            }
            value={defaultValue(
              blocksViewFeature === 'Construction_Other_Charges'
                ? csConstruAdditionalChargesA
                : costSheetPartcChargesA,
              value
            )}
            className="text-md mr-2"
          />
        )
      },
    },
    {
      title: 'Units*',
      field: 'units',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => rowData?.units?.label,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="Chargesdropdown"
            onChange={(value) => {
              onChange(value)
            }}
            options={unitsCancellation}
            value={defaultValue(unitsCancellation, value)}
            className="text-md mr-2"
          />
        )
      },
    },
    {
      title: 'Charges*',
      field: 'charges',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) =>
        rowData?.units?.value === 'percentage'
          ? `${rowData.charges} %`
          : `₹ ${rowData?.charges?.toLocaleString('en-IN')}`,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <input
            placeholder="Charges"
            className="w-full min-w-full flex bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 px-2"
            autoComplete="off"
            onChange={(e) =>
              rowData?.units?.value === 'percentage'
                ? onChange(
                    parseInt(e.target.value) > 100 ? 100 : e.target.value
                  )
                : onChange(e.target.value)
            }
            value={value}
            type="number"
            max="100"
          />
        )
      },
    },
    {
      title: 'GST*',
      field: 'gst',
      headerStyle: {
        padding: '0.25rem',
      },
      cellStyle: {
        padding: '0.25rem',
      },
      render: (rowData) => rowData?.gst?.label,
      editComponent: ({ value, onChange, rowData }) => {
        return (
          <Select
            name="Chargesdropdown"
            onChange={(value_x) => {
              onChange(value_x)
            }}
            options={gstValesA}
            value={defaultValue(gstValesA, value)}
            className="text-md mr-2"
          />
        )
      },
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

  const errors = (formData) => {
    const errorList = []
    if (!formData.component) {
      errorList.push("Try Again, You didn't enter the Charges For field")
    }
    if (!formData.units) {
      errorList.push("Try Again, You didn't enter the Units field")
    }
    if (!formData.charges) {
      errorList.push("Try Again, You didn't enter the Charges field")
    }
    if (!formData.gst) {
      errorList.push("Try Again, You didn't enter the gst field")
    }

    return errorList
  }
  const partAerrors = (formData) => {
    const errorList = []
    if (!formData.component) {
      errorList.push("Try Again, You didn't enter the Charges For field")
    }

    if (!formData.gst) {
      errorList.push("Try Again, You didn't enter the gst field")
    }

    return errorList
  }

  const handleRowUpdate = async (newData, oldData) => {
    const { uid, additonalChargesObj } = data?.phase || {}

    console.log('check this stuff', tableData, additonalChargesObj)
    const c = await tableData.map((e) => {
      console.log(e.myId, oldData.myId, e.myId === oldData.myId)
      if (e.myId === oldData.myId) {
        return newData
      }
      return e
    })
    console.log('check this stuff', tableData, c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      blocksViewFeature === 'Construction_Other_Charges'
        ? 'ConstructOtherChargesObj'
        : 'additonalChargesObj',
      enqueueSnackbar
    )
  }
  const handleRowUpdatePartA = async (newData, oldData) => {
    const { uid, additonalChargesObj } = data?.phase || {}

    console.log('check this stuff', partAData, additonalChargesObj)
    const c = await partAData.map((e) => {
      console.log(
        'check this stuff',
        e.myId,
        oldData.myId,
        e.myId === oldData.myId,
        newData
      )
      if (e.myId === oldData.myId) {
        return newData
      }
      return e
    })
    console.log('check this stuff', tableData, c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      'partATaxObj',
      enqueueSnackbar
    )
  }

  const handleRowUpdatePartC = async (newData, oldData) => {
    const { uid, additonalChargesObj } = data?.phase || {}

    console.log('check this stuff', partAData, additonalChargesObj)
    const c = await partAData.map((e) => {
      console.log(
        'check this stuff',
        e.myId,
        oldData.myId,
        e.myId === oldData.myId,
        newData
      )
      if (e.myId === oldData.myId) {
        return newData
      }
      return e
    })
    console.log('check this stuff', tableData, c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      'partCTaxObj',
      enqueueSnackbar
    )
  }

  const handleRowDelete = async (oldData) => {
    const { uid } = data?.phase || {}
    const c = tableData.filter((e) => e.myId != oldData.myId)
    console.log('check this stuff', c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      blocksViewFeature === 'Construction_Other_Charges'
        ? 'ConstructOtherChargesObj'
        : 'additonalChargesObj',
      enqueueSnackbar
    )
  }
  const handleRowDeletePartA = async (oldData) => {
    const { uid } = data?.phase || {}
    const c = partAData.filter((e) => e.myId != oldData.myId)
    console.log('check this stuff', c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      'partATaxObj',
      enqueueSnackbar
    )
  }
  const handleRowDeletePartC = async (oldData) => {
    const { uid } = data?.phase || {}
    const c = partAData.filter((e) => e.myId != oldData.myId)
    console.log('check this stuff', c)
    await updatePhaseAdditionalCharges(
      orgId,
      uid,
      c,
      'partCTaxObj',
      enqueueSnackbar
    )
  }

  const handleRowAdd = async (newData) => {
    setIserror(false)
    setErrorMessages([])
    const errorList = errors(newData)
    if (errorList.length < 1) {
      const { projectId, uid } = data?.phase || {}

      const additonalChargesObj = {
        ...newData,
      }
      await addPhaseAdditionalCharges(
        orgId,
        uid,
        additonalChargesObj,
        blocksViewFeature === 'Construction_Other_Charges'
          ? 'ConstructOtherChargesObj'
          : 'additonalChargesObj',
        // enqueueSnackbar
        ToastBar
      )
    } else {
      setErrorMessages(errorList)
      setIserror(true)
    }
  }
  const handleRowAddPartA = async (newData) => {
    console.log('newData is', newData)
    setIserror(false)
    setErrorMessages([])
    const errorList = partAerrors(newData)
    if (errorList.length < 1) {
      console.log('newData is inside yo', newData)
      const { projectId, uid } = data?.phase || {}

      const additonalChargesObj = {
        ...newData,
      }
      await addPhasePartAtax(
        orgId,
        uid,
        additonalChargesObj,
        'partATaxObj',
        // enqueueSnackbar
        ToastBar
      )
    } else {
      setErrorMessages(errorList)
      setIserror(true)
    }
  }
  const [data1, setData] = useState([
    { id: 1, name: 'John Doe', sex: 'Male', class: '10th' },
    { id: 2, name: 'Jane Smith', sex: 'Female', class: '12th' },
  ])

  const handleEdit = (id, field, value) => {
    setData(
      data.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  const genders = ['Male', 'Female', 'Other']
  const handleRowAddPartC = async (newData) => {
    setIserror(false)
    setErrorMessages([])
    const errorList = errors(newData)
    if (errorList.length < 1) {
      const { projectId, uid } = data?.phase || {}

      const additonalChargesObj = {
        ...newData,
      }
      await addPhaseAdditionalCharges(
        orgId,
        uid,
        additonalChargesObj,
        'partCTaxObj',
        // enqueueSnackbar
        ToastBar
      )
    } else {
      setErrorMessages(errorList)
      setIserror(true)
    }
  }

  const [currentStep, setCurrentStep] = useState(0)

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex)
  }

  const prevStep = () => {
    setCurrentStep((prevStep) => (prevStep === 0 ? 2 : prevStep - 1))
  }

  const nextStep = () => {
    setCurrentStep((prevStep) => (prevStep === 2 ? 0 : prevStep + 1))
  }

  const headerStyles = (index) => ({
    borderTopLeftRadius: index === 0 ? '12px' : '0px',
    borderTopRightRadius: index === partAcolumns.length - 1 ? '12px' : '0px',
    borderBottomWidth: '2px',
    background: '#fff',
    fontWeight: '600',
    padding: '13px',
  })

  return (
    <section className="">
      <div className="py-2 px-4  rounded-2xl bg-[#FFFFFF]  mx-4 my-4">
        <EditableTable
          phase={data?.phase || {}}
          partAData={partAData}
          fullCs={fullCs}
          source={'project'}
          type={data?.phase?.projectType.name}
        />
      </div>

      {/* <div className="h-full shadow-xl flex flex-col  mb-6 bg-[#F1F5F9] rounded-t overflow-y-scroll"></div> */}
    </section>
  )
}

export default AdditionalChargesForm
