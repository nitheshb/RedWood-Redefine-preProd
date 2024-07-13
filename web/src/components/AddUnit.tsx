/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from 'react'

import { Dialog } from '@headlessui/react'
import { RadioGroup } from '@headlessui/react'
import Divider from '@mui/material/Divider'
import { Timestamp } from 'firebase/firestore'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import NumberFormat from 'react-number-format'
import Select from 'react-select'
import * as Yup from 'yup'

import { Label, InputField, TextAreaField, FieldError } from '@redwoodjs/forms'
import { useRouterStateSetter } from '@redwoodjs/router/dist/router-context'

import {
  addUnit,
  addPlotUnit,
  checkIfUnitAlreadyExists,
  getAllProjects,
  steamUsersListByRole,
  editPlotUnit,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import {
  sendWhatAppMediaSms,
  sendWhatAppTextSms,
} from 'src/util/axiosWhatAppApi'
import { PhoneNoField } from 'src/util/formFields/phNoField'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { TextField } from 'src/util/formFields/TextField'

import Loader from './Loader/Loader'
import { validate_AddUnit } from './Schemas'

const AddUnit = ({
  title,
  dialogOpen,
  BlockFeed,
  phaseFeed,
  projectDetails,
  phaseDetails,
  blockDetails,
  data,
}) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()

  const [fetchedUsersList, setfetchedUsersList] = useState([])
  const [usersList, setusersList] = useState([])
  const [projectList, setprojectList] = useState([])
  const [phaseList, setphaseList] = useState([])
  const [blockList, setblockList] = useState([])
  const [defaultCost, setDefaultCost] = useState({})
  const [unitDetails, setUnitDetails] = useState({})
  console.log('inside it ', {
    title,
    dialogOpen,
    BlockFeed,
    phaseFeed,
    projectDetails,
    phaseDetails,
    blockDetails,
    data,
  })

  useEffect(() => {
    const unsubscribe = steamUsersListByRole(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setfetchedUsersList(usersListA)
        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
        })
        console.log('fetched users list is', usersListA)

        setusersList(usersListA)
      },
      (error) => setfetchedUsersList([])
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    setUnitDetails(data?.unitDetail || {})
  }, [])
  useEffect(() => {
    // sqft_construct_cost_tax plc_tax ,
    // let defaultValues = {
    //   sqft_cost_tax: 10,
    //   sqft_cost_gst: 0,
    //   sqft_construct_cost_tax: 0,
    //   sqft_construct_gst: 0,
    //   plc_tax: 0,
    //   plc_gst: 0,
    // }
    // phaseDetails?.fullcs?.forEach((item) => {
    //   if (item.component.value === 'sqft_cost_tax') {
    //     defaultValues.sqft_cost_tax = parseFloat(item.charges) || 10
    //     defaultValues.sqft_cost_gst = parseFloat(item.gst.value) || 0
    //   } else if (item.component.value === 'sqft_construct_cost_tax') {
    //     defaultValues.sqft_construct_cost_tax = parseFloat(item.charges) || 0
    //     defaultValues.sqft_construct_gst = parseFloat(item.gst.value) || 0
    //   } else if (item.component.value === 'plc_tax') {
    //     defaultValues.plc_tax = parseFloat(item.charges) || 0
    //     defaultValues.plc_gst = parseFloat(item.gst.value) || 0
    //   }
    // })
    // setDefaultCost(

    //   defaultValues
    // )

  }, [])

  useEffect(() => {
    const extractDefaultValues = async () => {
      const defaultValues = {
        sqft_cost_tax: 0,
        sqft_cost_gst: 0,
        sqft_construct_cost_tax: 0,
        sqft_construct_gst: 0,
        plc_tax: 0,
        plc_gst: 0,
      }

      // Simulating asynchronous operation
      await new Promise(resolve => setTimeout(resolve, 0));

      phaseDetails?.fullcs?.forEach((item) => {
        if (item.component.value === 'sqft_cost_tax') {
          defaultValues.sqft_cost_tax = parseFloat(item.charges) || 0
          defaultValues.sqft_cost_gst = parseFloat(item.gst.value) || 0
        } else if (item.component.value === 'sqft_construct_cost_tax') {
          defaultValues.sqft_construct_cost_tax = parseFloat(item.charges) || 0
          defaultValues.sqft_construct_gst = parseFloat(item.gst.value) || 0
        } else if (item.component.value === 'plc_tax') {
          defaultValues.plc_tax = parseFloat(item.charges) || 0
          defaultValues.plc_gst = parseFloat(item.gst.value) || 0
        }
      })

      setDefaultCost(defaultValues);
    };

    extractDefaultValues();
  }, [phaseDetails])

  useEffect(() => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setfetchedUsersList(projectsListA)
        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.projectName
        })
        console.log('fetched users list is', projectsListA)
        setprojectList(projectsListA)
      },
      (error) => setfetchedUsersList([])
    )

    return unsubscribe
  }, [])
  useEffect(() => {
    phaseFeed.map((user) => {
      user.label = user.phaseName
      user.value = user.phaseName
    })
    console.log('fetched users list is', phaseFeed)
    setphaseList(phaseFeed)
  }, [])

  useEffect(() => {
    if (BlockFeed) {
      BlockFeed?.map((user) => {
        user.label = user.blockName
        user.value = user.blockName
      })
      console.log('fetched users list is', phaseFeed)
      setblockList(BlockFeed)
    }
  }, [])

  const aquaticCreatures = [
    { label: 'Select the Project', value: '' },
    { label: 'Subha Ecostone', value: 'subhaecostone' },
    { label: 'Esperanza', value: 'esperanza' },
    { label: 'Nakshatra Township', value: 'nakshatratownship' },
  ]
  // const usersList = [
  //   { label: 'User1', value: 'User1' },
  //   { label: 'User2', value: 'User2' },
  //   { label: 'User3', value: 'User3' },
  // ]
  const budgetList = [
    { label: 'Select Customer Budget', value: '' },
    { label: '5 - 10 Lacs', value: 'Bangalore,KA' },
    { label: '10 - 20 Lacs', value: 'Cochin,KL' },
    { label: '20 - 30 Lacs', value: 'Mumbai,MH' },
    { label: '30 - 40 Lacs', value: 'Mumbai,MH' },
    { label: '40 - 50 Lacs', value: 'Mumbai,MH' },
    { label: '50 - 60 Lacs', value: 'Mumbai,MH' },
    { label: '60 - 70 Lacs', value: 'Mumbai,MH' },
    { label: '70 - 80 Lacs', value: 'Mumbai,MH' },
    { label: '80 - 90 Lacs', value: 'Mumbai,MH' },
    { label: '90 - 100 Lacs', value: 'Mumbai,MH' },
    { label: '1.0 Cr - 1.1 Cr', value: 'Mumbai,MH' },
    { label: '1.1 Cr - 1.2 Cr', value: 'Mumbai,MH' },
    { label: '1.2 Cr - 1.3 Cr', value: 'Mumbai,MH' },
    { label: '1.3 Cr - 1.4 Cr', value: 'Mumbai,MH' },
    { label: '1.4 Cr - 1.5 Cr', value: 'Mumbai,MH' },
    { label: '1.5 + Cr', value: 'Mumbai,MH' },
  ]

  const plans = [
    {
      name: 'Apartment',
      img: '/apart1.svg',
    },
    {
      name: 'Plots',
      img: '/plot.svg',
    },
    {
      name: 'WeekendVillas',
      img: '/weekend.svg',
    },
    {
      name: 'Villas',
      img: '/villa.svg',
    },
  ]

  const devTypeA = [
    {
      name: 'Outright',
      img: '/apart.svg',
    },
    {
      name: 'Joint',
      img: '/apart1.svg',
    },
  ]
  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [selected, setSelected] = useState({})
  const [devType, setdevType] = useState(devTypeA[0])
  const phoneRegExp =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

  const typeSel = async (sel) => {
    await console.log('value is', selected)
    await setSelected(sel)
    await console.log('thsi si sel type', sel, selected)
  }
  const devTypeSel = async (sel) => {
    await setdevType(sel)
  }

  const onSubmitFun = async (data, resetForm) => {
    console.log(data)
    setLoading(true)

    // const {
    //   area,
    //   bathrooms,
    //   bedRooms,
    //   buildup_area,
    //   carpet_area,
    //   facing,
    //   sqft_rate,
    //   floor,
    //   super_build_up_area,
    //   unit_no,
    // } = data

    const {
      unit_no,
      survey_no,
      Katha_no,
      PID_no,
      area,
      sqft_rate,
      plc_per_sqft,
      size,
      facing,
      unit_d,
      east_d,
      west_d,
      north_d,
      south_d,
      east_west_d,
      north_south_d,

      east_sch_by,
      west_sch_by,
      status,

      release_status,
      mortgage_type,
    } = data
    // updateUserRole(uid, deptVal, myRole, email, 'nitheshreddy.email@gmail.com')

    const foundLength = await checkIfUnitAlreadyExists(
      `${orgId}_units`,
      projectDetails?.uid,
      phaseDetails?.uid || 1,
      blockDetails?.uid || 1,
      unit_no

      // myBlock?.uid,
      // dRow['unit_no']
    )
    const plotData1 = {
      pId: projectDetails?.uid,
      phaseId: phaseDetails?.uid || 1,
      blockId: blockDetails?.uid || 1,
      Date: Timestamp.now().toMillis(),
      unit_no: unit_no,
      survey_no: survey_no,

      Katha_no: Katha_no,
      PID_no: PID_no,
      area: area,
      sqft_rate: sqft_rate,
      plc_per_sqft: plc_per_sqft,
      size: size,
      facing: facing,
      unit_d: unit_d,
      east_d: east_d,
      west_d: west_d,
      north_d: north_d,
      south_d: south_d,
      east_west_d: east_west_d,
      north_south_d: north_south_d,
      east_sch_by: east_sch_by,
      west_sch_by: west_sch_by,
      status: status,
      release_status: release_status,
      mortgage_type: mortgage_type,
      intype: 'Form',
      unit_type: 'plot',
      by: user?.email,
    }
    console.log('user is ', user)
    if (foundLength?.length > 0) {
      console.log('foundLENGTH IS ', foundLength)
      setFormMessage('Unit Already Exists')
      setLoading(false)
    } else {
      console.log('foundLENGTH IS empty ', foundLength)

      // proceed to copy
      await addPlotUnit(orgId, plotData1, user?.email, `Unit Created by form `)

      // msg2
      resetForm()
      setFormMessage('Unit Added Successfully.')
      setLoading(false)
    }
    return
    setLoading(true)

    // updateUserRole(uid, deptVal, myRole, email, 'nitheshreddy.email@gmail.com')

    const leadData = {
      Date: Timestamp.now().toMillis(),
      bed_rooms: bedRooms,
      builtup_area: buildup_area,
      builtup_area_uom: 'sqft',
      carpet_area: carpet_area,
      carpet_area_uom: 'sqft',
      facing: facing,
      floor: floor,
      intype: 'Form',
      mode: '',
      pId: projectDetails?.uid,
      phaseId: phaseDetails?.uid,
      blockId: blockDetails?.uid,
      Status: 'available',
      rate_per_sqft: sqft_rate,
      super_built_up_area: super_build_up_area,
      super_built_up_area_uom: 'sqft',
      undivided_share: '',
      unit_no: unit_no,
      unit_type: '',
      by: user?.email,
    }
    console.log('user is ', user)
    if (foundLength?.length > 0) {
      console.log('foundLENGTH IS ', foundLength)
      setFormMessage('Unit Already Exists')
      setLoading(false)
    } else {
      console.log('foundLENGTH IS empty ', foundLength)

      // proceed to copy
      await addUnit(orgId, leadData, user?.email, `Unit Created by form `)

      // msg2
      resetForm()
      setFormMessage('Saved Successfully..!')
      setLoading(false)
    }
  }
  const onSubmitEditUnitFun = async (data, resetForm) => {
    console.log(data)
    setLoading(true)

    const {
      unit_no,
      survey_no,
      Katha_no,
      PID_no,
      area,
      sqft_rate,
      plc_per_sqft,
      size,
      facing,
      unit_d,
      east_d,
      west_d,
      north_d,
      south_d,
      east_west_d,
      north_south_d,

      east_sch_by,
      west_sch_by,
      status,

      release_status,
      mortgage_type,
    } = data
    // updateUserRole(uid, deptVal, myRole, email, 'nitheshreddy.email@gmail.com')

    const plotData1 = {
      pId: projectDetails?.uid,
      phaseId: phaseDetails?.uid || 1,
      blockId: blockDetails?.uid || 1,
      Date: Timestamp.now().toMillis(),
      unit_no: unit_no,
      survey_no: survey_no,

      Katha_no: Katha_no,
      PID_no: PID_no,
      area: area,
      sqft_rate: sqft_rate,
      plc_per_sqft: plc_per_sqft,
      size: size,
      facing: facing,
      unit_d,
      east_d: east_d,
      west_d: west_d,
      north_d: north_d,
      south_d: south_d,
      east_west_d: east_west_d,
      north_south_d: north_south_d,
      east_sch_by: east_sch_by,
      west_sch_by: west_sch_by,
      status: status,
      release_status: release_status,
      mortgage_type: mortgage_type,
      intype: 'Form',
      unit_type: 'plot',
      by: user?.email,
    }
    console.log('user is ', user)
    // proceed to copy
    await editPlotUnit(
      orgId,
      unitDetails?.uid,
      plotData1,
      user?.email,
      `Unit Created by form `,
      enqueueSnackbar
    )

    // msg2
    await resetForm()
    await setFormMessage('Unit Saved Successfully..!')
    await setLoading(false)
    return
  }

  const unitTypeList = [
    { label: 'Select Count', value: '' },
    { label: '1 Bhk', value: 1 },
    { label: '2 Bhk', value: 2 },
    { label: '3 Bhk', value: 3 },
    { label: '4 Bhk', value: 4 },
    { label: '5 Bhk', value: 5 },
  ]
  const bathTypeList = [
    { label: 'Select Count', value: '' },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ]
  const facingTypeList = [
    { label: 'Select the Facing', value: '' },
    { label: 'East', value: 'East' },
    { label: 'West', value: 'West' },
    { label: 'North', value: 'North' },
    { label: 'South', value: 'South' },
    { label: 'South-East', value: 'South-East' },
    { label: 'South-West', value: 'South-West' },
    { label: 'North-East', value: 'North-East' },
    { label: 'North-West', value: 'North-West' },
  ]
  const statusList = [
    { label: 'Select the Status', value: '' },
    { label: 'Available', value: 'available' },
    { label: 'Blocked by Customer', value: 'customer_blocked' },
    { label: 'Blocked by Management', value: 'management_blocked' },
    { label: 'Sold', value: 'sold' },
  ]

  const releaseStausList = [
    { label: 'Release Status', value: '' },
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'No' },
  ]
  const mortgageType = [
    { label: 'Select Mortgage', value: '' },
    { label: 'NA', value: 'NA' },
    { label: 'Bank', value: 'bank' },
    { label: '3rd Party Investor', value: '3rd_party_investor' },
  ]
  // const validate = Yup.object({

  // unit_no: Yup.string()
  // .max(15, 'Must be 15 characters or less')
  // .required('Unit_no is Required'),
  // lastName: Yup.string()
  //   .max(20, 'Must be 20 characters or less')
  //   .required('Required'),
  // sqft_rate: Yup.number().required('sqft rate is required'),
  // bedRooms:
  //   projectDetails?.projectType?.name === 'Apartment'
  //     ? Yup.string().required('bedRooms is required')
  //     : Yup.string().notRequired(),
  // floor: Yup.number().required('floor is required'),
  // bathrooms:
  //   projectDetails?.projectType?.name === 'Apartment'
  //     ? Yup.string().required('bathrooms is required')
  //     : Yup.string().notRequired(),
  // // bathrooms: Yup.string().required('bathrooms is required'),
  // area:
  //   projectDetails?.projectType?.name === 'Plots'
  //     ? Yup.number().required('area is required')
  //     : Yup.number().notRequired(),

  // facing: Yup.string().required('facing is required'),
  // carpet_area: Yup.number().required('Carpet Area is required'),
  // buildup_area: Yup.number().required('Buildup Area is required'),
  // super_build_up_area: Yup.number().required('Sqft Rate is required'),
  // })
  const resetter = () => {
    setSelected({})
    setFormMessage('')
  }
  return (
    <div className="h-full flex flex-col pb-6 bg-white shadow-xl overflow-y-scroll">
      {/* <div className="border-b py-3">
        <div className="px-2 sm:px-6  z-10 flex items-center justify-between">
          <Dialog.Title className=" font-semibold text-xl mr-auto  text-[#053219]">
            {title}
          </Dialog.Title>
        </div>
      </div> */}

      <div className="grid  gap-8 grid-cols-1">
        <div className="flex flex-col ">
          <div className="mt-0">
            {/* new one */}

            <Formik
              enableReinitialize={true}
              initialValues={{
                unit_no: unitDetails?.unit_no || '',
                survey_no: unitDetails?.survey_no || '',
                Katha_no: unitDetails?.Katha_no || '',
                PID_no: unitDetails?.PID_no || '',
                area: unitDetails?.area || 0,
                sqft_rate: unitDetails?.sqft_rate ||
                 defaultCost?.sqft_cost_gst || 0,
                plc_per_sqft: unitDetails?.plc_per_sqft || 0,
                size: unitDetails?.size || '',
                facing: unitDetails?.facing || '',
                unit_d: unitDetails?.unit_d || '',
                min_rate_per_sqft:
                  unitDetails?.min_rate_per_sqft || unitDetails?.sqft_rate || 0,
                east_d: unitDetails?.east_d || 0,
                west_d: unitDetails?.west_d || 0,
                north_d: unitDetails?.north_d || 0,
                south_d: unitDetails?.south_d || 0,
                east_west_d: unitDetails?.east_west_d || 0,
                north_south_d: unitDetails?.north_south_d || 0,
                east_sch_by: unitDetails?.east_sch_by || '',
                west_sch_by: unitDetails?.west_sch_by || '',
                status: unitDetails?.status || '',
                release_status: unitDetails?.release_status || '',
                mortgage_type: unitDetails?.mortgage_type || '',
                // bathrooms: '',
                // carpet_area: 0,
                // buildup_area: 0,
                // super_build_up_area: 0,
              }}
              validationSchema={validate_AddUnit}
              onSubmit={(values, { resetForm }) => {
                console.log('ami submitted', values)
                if (title === 'Edit Plot') {
                  onSubmitEditUnitFun(values, resetForm)
                } else {
                  onSubmitFun(values, resetForm)
                }
              }}
            >
              {(formik) => (
                <div className="">
                  <section className=" rounded-lg bg-white  ">
                    <Form>
                      <div className="">
                        <div className="inline ">
                          <div className="bg-gradient-to-r from-blue-200 to-cyan-200">
                            <section className="flex flex-row mx-4 py-4">
                              <span className="ml-2 mt-[1px] ">
                                <label className="font-semibold text-[#053219]  text-[18px]  mb-1  ">
                                  {title}
                                  <abbr title="required"></abbr>
                                </label>
                              </span>
                            </section>
                          </div>
                        </div>
                      </div>

                      <section className="my-10 mx-3  my-4 mt-4">
                        <section className="mt-1 px-4 rounded-lg bg-white border border-gray-100 shadow">
                          <section className="flex flex-row  pt-2 ">
                            <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-cyan-200"></div>
                            <span className="ml-1 leading-[15px] ">
                              <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                                Unit<abbr title="required"></abbr>
                              </label>
                            </span>
                          </section>
                          <div className="md:flex flex-row md:space-x-4 w-full text-xs  ">
                            <div className=" space-y-2 w-full text-xs mt-2">
                              <TextField
                                label="Unit no*"
                                name="unit_no"
                                type="text"
                              />
                            </div>
                            <div className="mb-3 space-y-2 w-full text-xs mt-2">
                              <TextField
                                label="Type*"
                                name="size"
                                type="text"
                              />
                            </div>
                            <div className="w-full flex flex-col mt-2">
                              <CustomSelect
                                name="facing"
                                label="Facing*"
                                className="input mt-"
                                onChange={(value) => {
                                  formik.setFieldValue('facing', value.value)
                                }}
                                value={formik.values.facing}
                                // options={aquaticCreatures}
                                options={facingTypeList}
                              />
                            </div>

                            <div className="space-y-2 w-full text-xs mt-2">
                              <TextField
                                label="Area Sqft*"
                                name="area"
                                type="number"
                              />
                            </div>
                          </div>
                        </section>

                        <section className="mt-1 px-4 rounded-lg bg-white border border-gray-100 shadow">
                          <section className="flex flex-row  pt-2 ">
                            <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-cyan-200"></div>
                            <span className="ml-1 leading-[15px] ">
                              <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                                Pricing<abbr title="required"></abbr>
                              </label>
                            </span>
                          </section>
                          <div className="md:flex flex-row md:space-x-4 w-full text-xs mt-2 ">
                            <div className=" space-y-2 w-full text-xs mt-">
                              <TextField
                                label="Rate per Sqft *"
                                name="sqft_rate"
                                type="number"
                              />
                            </div>
                            <div className="space-y-2 w-full text-xs mt-">
                              <TextField
                                label="PLC per sqft*"
                                name="plc_per_sqft"
                                type="number"
                              />
                            </div>

                            <div className="mb-3 space-y-2 w-full text-xs mt-">
                              <TextField
                                label="Min Rate per Sqft"
                                name="min_rate_per_sqft"
                                type="text"
                              />
                            </div>
                          </div>
                        </section>

                        <section className="mt-1 px-4 rounded-lg bg-white border border-gray-100 shadow">
                          <section className="flex flex-row  pt-2 ">
                            <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-cyan-200"></div>

                            <span className="ml-1 leading-[15px] ">
                              <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                                Dimensions<abbr title="required"></abbr>
                              </label>
                            </span>
                          </section>
                          <div className="md:flex flex-row md:space-x-4 w-full text-xs mt-2 ">
                            <div className="mb-3 space-y-2 w-full text-xs mt-">
                              <TextField
                                label="East"
                                name="east_d"
                                type="text"
                              />
                            </div>
                            <div className="mb-3 space-y-2 w-full text-xs">
                              <TextField
                                label="West"
                                name="west_d"
                                type="text"
                              />
                            </div>

                            {projectDetails?.projectType?.name !=
                              'Apartment' && (
                              <div className="mb-3 space-y-2 w-full text-xs ">
                                <TextField
                                  label="North"
                                  name="north_d"
                                  type="number"
                                />
                              </div>
                            )}
                            <div className="mb-3 space-y-2 w-full text-xs ">
                              <TextField
                                label="South"
                                name="south_d"
                                type="number"
                              />
                            </div>
                            <div className="mb-3 space-y-2 w-full text-xs mt-">
                              <TextField
                                label="East-West"
                                name="east_west_d"
                                type="number"
                              />
                            </div>
                            <div className="mb-3 space-y-2 w-full text-xs">
                              <TextField
                                label="North-South"
                                name="north_south_d"
                                type="number"
                              />
                            </div>
                          </div>
                        </section>

                        <section className="mt-1 px-4 rounded-lg bg-white border border-gray-100 shadow">
                          <section className="flex flex-row  pt-2 ">
                            <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-cyan-200"></div>

                            <span className="ml-1 leading-[15px] ">
                              <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                                Schedule<abbr title="required"></abbr>
                              </label>
                            </span>
                          </section>
                          <div className="md:flex flex-row md:space-x-4 w-full text-xs mt-2 ">
                            <div className="mb-3 space-y-2 w-full text-xs mt-">
                              <TextField
                                label="East by"
                                name="east_sch_by"
                                type="text"
                              />
                            </div>
                            <div className="mb-3 space-y-2 w-full text-xs">
                              <TextField
                                label="West by"
                                name="west_sch_by"
                                type="text"
                              />
                            </div>
                            <div className="mb-3 space-y-2 w-full text-xs ">
                              <TextField
                                label="North by"
                                name="north_sch_by"
                                type="text"
                              />
                            </div>

                            <div className="mb-3 space-y-2 w-full text-xs ">
                              <TextField
                                label="South by"
                                name="south_sch_by"
                                type="text"
                              />
                            </div>
                          </div>
                        </section>

                        <section className="mt-1 px-4 rounded-lg bg-white border border-gray-100 shadow">
                          <section className="flex flex-row  pt-2 ">
                            <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-cyan-200"></div>

                            <span className="ml-1 leading-[15px] ">
                              <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                                Status<abbr title="required"></abbr>
                              </label>
                            </span>
                          </section>
                          <div className="md:flex flex-row md:space-x-4 w-full text-xs mt-2">
                            <div className="w-full flex flex-col mb-3">
                              <CustomSelect
                                name="status"
                                label="Status*"
                                className="input mt-"
                                onChange={(value) => {
                                  formik.setFieldValue('status', value.value)
                                }}
                                value={formik.values.status}
                                // options={aquaticCreatures}
                                options={statusList}
                              />
                            </div>
                            <div className="w-full flex flex-col mb-3">
                              <CustomSelect
                                name="release_status"
                                label="Release Status*"
                                className="input mt-"
                                onChange={(value) => {
                                  formik.setFieldValue(
                                    'release_status',
                                    value.value
                                  )
                                }}
                                value={formik.values.release_status}
                                // options={aquaticCreatures}
                                options={releaseStausList}
                              />
                            </div>
                          </div>
                          <div className="md:flex flex-row md:space-x-4 w-full text-xs mt-1">
                            <div className="w-full flex flex-col mb-3 mt-1">
                              <CustomSelect
                                name="mortgage_type"
                                label="Mortgage Type*"
                                className="input mt-"
                                onChange={(value) => {
                                  formik.setFieldValue(
                                    'mortgage_type',
                                    value.value
                                  )
                                }}
                                value={formik.values.mortgage_type}
                                // options={aquaticCreatures}
                                options={mortgageType}
                              />
                            </div>
                          </div>
                        </section>

                        <section className="mt-1 px-4 rounded-lg bg-white border border-gray-100 shadow">
                          <section className="flex flex-row  pt-2 ">
                            <div className="border-2  h-3 rounded-xl  mt-[2px] w-1  border-cyan-200"></div>

                            <span className="ml-1 leading-[15px] ">
                              <label className="font-semibold text-[#053219]  text-[13px] leading-[15px] mb-1  ">
                                Additonal Details<abbr title="required"></abbr>
                              </label>
                            </span>
                          </section>
                          <div className="md:flex flex-row md:space-x-4 w-full text-xs mt-2 ">
                            <div className=" space-y-2 w-full text-xs ">
                              <TextField
                                label="Survey No"
                                name="survey_no"
                                type="text"
                              />
                            </div>
                            <div className=" space-y-2 w-full text-xs ">
                              <TextField
                                label="Katha No"
                                name="Katha_no"
                                type="text"
                              />
                            </div>
                            <div className=" space-y-2 w-full text-xs ">
                              <TextField
                                label="PID No"
                                name="PID_no"
                                type="text"
                              />
                            </div>
                          </div>
                        </section>
                      </section>
                      {/* 6 */}

                      <div className=" z-10 flex flex-row justify-between mt-4 pb-2 pr-6 bg-white shadow-lg absolute bottom-0  w-full">
                        <p className="text-xs text-red-400 text-right my-3 mt-10 mx-3">
                          <abbr title="Required field">*</abbr> fields are
                          mandatory
                        </p>
                        {['Unit Added Successfully.','Saved Successfully..!','Unit Saved Successfully..!'].includes(formMessage) && (
                          <p className=" flex text-md text-slate-800 text-right my-3">
                            <img
                              className="w-[40px] h-[40px] inline mr-2"
                              alt=""
                              src="/ok.gif"
                            />
                            <span className="mt-2">{formMessage}</span>
                          </p>
                        )}
                        {formMessage === 'Unit Already Exists' && (
                          <p className=" flex text-md text-pink-800 text-right my-3">
                            <img
                              className="w-[40px] h-[40px] inline mr-2"
                              alt=""
                              src="/error.gif"
                            />
                            <span className="mt-2">{formMessage}</span>
                          </p>
                        )}
                        <div className="mt-5 mt-8 text-right md:space-x-3 md:block flex flex-col-reverse">
                          <button
                            className="mb-4 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-lg hover:shadow-lg hover:bg-gray-100"
                            type="reset"
                            onClick={() => resetter()}
                          >
                            Reset
                          </button>
                          <button
                            className="mb-2 pb-[5px] md:mb-0 bg-gradient-to-r from-indigo-400 to-cyan-400 px-5 py-1 text-sm shadow-sm font-medium tracking-wider text-white  rounded-lg hover:shadow-lg hover:bg-green-500"
                            type="submit"
                            disabled={loading}
                          >
                            {loading && <Loader />}
                            <span>
                              {' '}
                              {title === 'Edit Plot' ? 'Edit Unit' : 'Add Unit'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </Form>
                  </section>
                </div>
              )}
            </Formik>
          </div>
        </div>

        <div className="flex flex-col  my-10 rounded-lg bg-white border border-gray-100 px-4 m-4 mt-4"></div>
      </div>
    </div>
  )
}

export default AddUnit
