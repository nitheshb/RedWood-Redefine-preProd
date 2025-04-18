/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'

import { Link } from '@redwoodjs/router'

import {
  getAllProjects,
  getBlocksByPhase,
  getPhasesByProject,
  getUnits,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

import 'flowbite'
import DropDownSearchBar from '../dropDownSearchBar'
import 'src/styles/myStyles.css'
import FloordetailsSearch from '../Floordetails/FloordetailsInSearch'

import A_Crm_Map from '../A_CrmModule/A_Crm_Map'




const UnitsInventoryHome = ({ project }) => {
  const { user } = useAuth()

  const { orgId } = user
  const [customerRawData, setCustomerRawData] = useState([])
  const [phases, setPhases] = useState([])
  const [filteredUnits, setFilteredUnits] = useState([])

  const [isOpenSideView, setIsOpenSideView] = useState(false)
  const [selPhaseName, setSelPhaseName] = useState('')
  const [myProjectDetails, setMyProjectDetails] = useState({ uid: '' })

  const [showCostSheetWindow, setShowCostSheetWindow] = useState(false)
  const [selMode, setSelMode] = useState('Detail View')
  const [selUnitDetails, setSelUnitDetails] = useState({})

  const [projectDetails, setProjectDetails] = useState()
  // phases

  const [phasesList, setPhasesList] = useState([])
  const [phaseViewFeature, setPhaseViewFeature] = useState('Blocks')

  // blocks
  const [blocks, setBlocks] = useState([])
  const [selPhaseIs, setSelPhaseIs] = useState('')
  const [selPhaseObj, setSelPhaseObj] = useState({})
  const [selBlock, setSelBlock] = useState({})
  const [selFloor, setSelFloor] = useState('All')

  const [unitsFeedA, setUnitsFeedA] = useState([])
  const [filUnitsFeedA, setFilUnitsFeedA] = useState([])


  const [phaseDetails, setPhaseDetails] = useState({
    projectName: '',
    uid: '',
    value: '',
  })

  const [availType, setAvailType] = useState({
    projectName: '',
    uid: '',
    value: 'any',
  })

  const [selUnitDimension, setUnitDimension] = useState({
    projectName: '',
    uid: '',
    value: 'any',
  })
  const [selFacing, setFacing] = useState({
    projectName: '',
    uid: '',
    value: 'any',
  })
  const [selsize, setSize] = useState({
    projectName: '',
    uid: '',
    value: 'any',
  })
  const setPhaseFun = (leadDocId, value) => {
    setSelPhaseName(value.name)
    setSelPhaseIs(value.value)
  }
  useEffect(() => {
    getUnitsFun()
    getPhases(projectDetails)
  }, [projectDetails])

  useEffect(() => {
    getUnitsFun()
  }, [selBlock])
  useEffect(() => {
    if (phases.length > 0) {
      getBlocks(phases[0]['uid'] || '')
    }
  }, [phases, projectDetails])
  useEffect(() => {
    // setFilUnitsFeedA

    filFun()
  }, [unitsFeedA, availType, selUnitDimension, selsize, selFacing])

  const filFun = () => {

    const filData = unitsFeedA?.filter((da) => {
      const statusMatch =
        availType.value === 'any' ? true : da?.status == availType.value
      const dimensionMatch =
        selUnitDimension.value === 'any'
          ? true
          : projectDetails?.projectType?.name ==='Apartment'? (String(da?.bedrooms_c)?.toLocaleLowerCase() || 0) ==
          selUnitDimension.value?.toLocaleLowerCase() : (String(da?.dimension)?.toLocaleLowerCase() || 0) ==
            selUnitDimension.value?.toLocaleLowerCase()

      const facingMatch =
        selFacing.value === 'any'
          ? true
          : da?.facing?.toLocaleLowerCase() == selFacing.value
       const sizeMatch =
       selsize.value === 'any'
          ? true
          : Number(da?.area) < Number(selsize.value)
      return statusMatch && facingMatch && dimensionMatch && sizeMatch
    })
    setFilUnitsFeedA(filData)
  }

  const getUnitsFun = async () => {
    const todoData = await getUnits(
      orgId,
      (querySnapshot) => {
        let pro
        const y = []
        setUnitsFeedA([])
        const projects = querySnapshot.docs.map(async (docSnapshot) => {
          const x = docSnapshot.data()
          x.uid = docSnapshot.id
          x.id = docSnapshot.id
          const { staDA } = x
          y.push(x)
        })
        y.sort((a, b) => a.unit_no - b.unit_no)
        setUnitsFeedA(y)
      },
      { pId: projectDetails?.uid, blockId: selBlock?.uid || 0, type: 'today' },
      (error) => {
        console.log('error', error)
      }
    )

    await console.log('what are we', todoData)
  }
  const getPhases = async (projectDetails) => {
    setMyProjectDetails(projectDetails)

    try {
      const unsubscribe = getPhasesByProject(
        orgId,
        projectDetails?.uid,
        (querySnapshot) => {
          const phases = querySnapshot.docs.map((docSnapshot) =>
            docSnapshot.data()
          )
          setPhases(phases)

          phases.map((user) => {
            user.name = user.phaseName
            user.label = user.phaseName
            user.value = user.uid
          })
          // setPhasesList(phases)
          if (phases.length > 0) {
            setSelPhaseName(phases?.[0].phaseName)
            setSelPhaseIs(phases?.[0].uid)
            setSelPhaseObj(phases?.[0])
          }
          console.log('myphases are', phases)
        },
        (e) => {
          console.log('error at getPhases', e)
          setPhases([])
        }
      )
      return unsubscribe
    } catch (error) {
      console.log('error at getting phases', error)
    }
  }
  useEffect(() => {
    if (blocks.length > 0) {
      setSelBlock(blocks[0])
    }
  }, [blocks])
  const getBlocks = async (phaseId) => {
    const unsubscribe = getBlocksByPhase(
      orgId,
      { projectId: myProjectDetails?.uid, phaseId },
      (querySnapshot) => {
        const response = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        response.sort((a, b) => {
          return a.blockName - b.blockName
        })
        setBlocks(response )
        console.log('myblocks are',response, blocks, myProjectDetails?.uid, phaseId)
      },
      (e) => {
        console.log('error at getBlocks', e)
        // setBlocks({ ...blocks, [phaseId]: [] })
        setBlocks([])
      }
    )
    return unsubscribe
  }
  const phasesA = [
    {
      label: 'Phase-I',
      projectName: 'Phase-I',
      value: 'demands',
    },
  ]

  const paymentsA = [
    {
      label: 'Demands',
      projectName: 'Demands',
      value: 'demands',
    },
    {
      label: 'Review',
      projectName: 'review',
      value: 'review',
    },
    {
      label: 'Received',
      projectName: 'received',
      value: 'received',
    },
    {
      label: 'Rejected',
      projectName: 'rejected',
      value: 'rejected',
    },
  ]
  const registerA = [
    {
      label: 'Booking',
      projectName: 'Blocked',
      value: 'booking',
    },
    {
      label: 'Booking',
      projectName: 'Booking',
      value: 'booking',
    },
    {
      label: 'Agreement',
      projectName: 'Agreement',
      value: 'agreement',
    },
    {
      label: 'Registered',
      projectName: 'registered',
      value: 'registered',
    },
    {
      label: 'Rejected',
      projectName: 'Released',
      value: 'rejected',
    },
  ]
  const availStatusA = [
    {
      label: 'All',
      projectName: 'All',
      value: 'any',
    },
    {
      label: 'Available',
      projectName: 'Available',
      value: 'available',
    },
    {
      label: 'Booked',
      projectName: 'Booked',
      value: 'booked',
    },
    {
      label: 'Blocked',
      projectName: 'Blocked',
      value: 'blocked',
    },
  ]
  const FacingA = [
    {
      label: 'East',
      projectName: 'All',
      value: 'any',
    },
    {
      label: 'East',
      projectName: 'East',
      value: 'east',
    },
    {
      label: 'West',
      projectName: 'West',
      value: 'west',
    },
    {
      label: 'South',
      projectName: 'South',
      value: 'south',
    },
    {
      label: 'North',
      projectName: 'North',
      value: 'north',
    },
    {
      label: 'North',
      projectName: 'South-East',
      value: 'south-east',
    },
    {
      label: 'North',
      projectName: 'South-West',
      value: 'south-west',
    },
    {
      label: 'north-east',
      projectName: 'North-East',
      value: 'north-east',
    },

    {
      label: 'North',
      projectName: 'North-West',
      value: 'north-west',
    },
  ]
  const typeA = [
    {
      label: 'East',
      projectName: 'All',
      value: 'any',
    },
    {
      label: 'East',
      projectName: '9.14X15.24',
      value: '9.14X15.24',
    },
    {
      label: 'West',
      projectName: '12.19X18.29',
      value: '12.19X18.29',
    },
    {
      label: 'South',
      projectName: '12.19X16.25',
      value: '12.19X16.25',
    },
    {
      label: '30X40',
      projectName: '30X40',
      value: '30X40',
    },
    {
      label: '30X50',
      projectName: '30X50',
      value: '30X50',
    },
    {
      label: 'North',
      projectName: '35X45',
      value: 's35X45',
    },
    {
      label: '30X50',
      projectName: '30X50',
      value: '30X50',
    },

    {
      label: '35X45',
      projectName: '35X45',
      value: '35X45',
    },
    {
      label: '40X40',
      projectName: '40X40',
      value: '40X40',
    },
    {
      label: '40X60',
      projectName: '40X60',
      value: '40X60',
    },
    {
      label: 'ODD',
      projectName: 'ODD',
      value: 'ODD',
    },
  ]
  const typeB = [
    {
      label: 'East',
      projectName: 'All',
      value: 'any',
    },
    {
      label: 'East',
      projectName: '1BHK',
      value: '1',
    },
    {
      label: 'West',
      projectName: '2BHK',
      value: '2',
    },
    {
      label: 'South',
      projectName: '3BHK',
      value: '3',
    },
    {
      label: 'West',
      projectName: '4BHK',
      value: '4',
    },
    {
      label: 'South',
      projectName: '5BHK',
      value: '5',
    },

  ]
  const sizeA = [
    {
      label: 'East',
      projectName: 'All',
      value: 'any',
    },
    {
      label: 'East',
      projectName: 'Less than 1,000 sqft',
      value: '1000',
    },
    {
      label: 'East',
      projectName: 'Less than 1,500 sqft',
      value: '1500',
    },
    {
      label: 'West',
      projectName: 'Less than 2,000 sqft',
      value: '2000',
    },
  ]
  useEffect(() => {
    getProjects()
  }, [])
  const getProjects = async () => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        projects.map((user) => {
          user.label = user?.projectName
          user.value = user?.uid
        })
        setCustomerRawData([...projects])
        console.log('project are ', projects)
      },
      () => setCustomerRawData([])
    )
    return unsubscribe
  }
  const selProjctFun = (project) => {
    setIsOpenSideView(!isOpenSideView)
    console.log('sel project is', project)
    setProjectDetails(project)
    setUnitDimension({
      projectName: '',
      uid: '',
      value: 'any',
    })

  }
  const selPhaseFun = (project) => {
    setPhaseDetails(project)
  }
  const selAvailFun = (project) => {
    setAvailType(project)
  }
  const selTypeFun = (project) => {
    setUnitDimension(project)
  }
  const selFacingFun = (project) => {
    setFacing(project)
  }
  const selSizeFun = (project) => {
    setSize(project)
  }
  const selStatusFun = (project) => {
    setAvailType(project)
  }

  return (
    <section className=" mt-1  py-6 mb-8 leading-7 text-gray-900 bg-white  rounded-lg  ">
      <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full  ">
        <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 flex flex-col justify-center items-center ">
          <div className="flex items-center flex-shrink-0  px-0  pl-0   mb-1">
            <Link
              className="flex items-center"
              // to={routes.projectEdit({ uid })}
            >
              <span className="relative z-10 flex items-center w-auto text-md font-bold leading-none pl-0">
                Inventory
              </span>
            </Link>
          </div>
        </div>
        <div className=" ">
          {/* <form className=""> */}
          <div className="flex justify-center items-center  flex flex-col">
            <div className="relative  p-2.5 pb-6">
              <section className=" top-0 left-0  flex flex-row  border bg-white border-[#dddddd] rounded-full custom-shadow">
                <DropDownSearchBar
                  label={'Projects'}
                  type={'Select Project'}
                  id={'id'}
                  setStatusFun={{}}
                  viewUnitStatusA={[]}
                  pickCustomViewer={selProjctFun}
                  selProjectIs={projectDetails}
                  dropDownItemsA={customerRawData}
                />

                <DropDownSearchBar
                  label={'Availablity'}
                  type={'All Status'}
                  id={'id'}
                  setStatusFun={{}}
                  viewUnitStatusA={[]}
                  pickCustomViewer={selStatusFun}
                  selProjectIs={availType}
                  dropDownItemsA={availStatusA}
                />

                <DropDownSearchBar
                  label={'Dimension'}
                  type={'All'}
                  id={'id'}
                  setStatusFun={{}}
                  viewUnitStatusA={[]}
                  pickCustomViewer={selTypeFun}
                  selProjectIs={selUnitDimension}
                  dropDownItemsA={projectDetails?.projectType?.name ==='Apartment'? typeB: typeA}
                />
                <DropDownSearchBar
                  label={'Facing'}
                  type={'All Facings'}
                  id={'id'}
                  setStatusFun={{}}
                  viewUnitStatusA={[]}
                  pickCustomViewer={selFacingFun}
                  selProjectIs={selFacing}
                  dropDownItemsA={FacingA}
                />
                <DropDownSearchBar
                  label={'Unit Size'}
                  type={'All Status'}
                  id={'id'}
                  setStatusFun={{}}
                  viewUnitStatusA={[]}
                  pickCustomViewer={selSizeFun}
                  selProjectIs={selsize}
                  dropDownItemsA={sizeA}
                  noBorder={true}
                />

              </section>
            </div>
          </div>
        </div>


        {/* <div>
          <A_Crm_Map filteredUnits={filteredUnits} />
        </div> */}


        {projectDetails == undefined && (
          <div className="py-8 px-8 mt-10 flex flex-col  items-center bg-red-100 rounded">
            <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
              <img
                className="w-[180px] h-[180px] inline"
                alt=""
                src="/templates.svg"
              />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-gray-900">
              No Units Found
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              <span className="text-blue-600"></span>
            </time>
          </div>
        )}

        {projectDetails != undefined && (
          <div className="mt-4 ">

              <FloordetailsSearch
              pId={projectDetails?.uid}
              projectDetails={projectDetails}
              phaseFeed={phases}
              unitsFeedA={unitsFeedA}
              filUnitsFeedA={filUnitsFeedA}
              filteredUnits={filteredUnits}
              setFilteredUnits = {setFilteredUnits}
              BlockFeed={blocks}
              selBlock={selBlock}
              setSelBlock={setSelBlock}
              source={undefined}
              setShowCostSheetWindow={setShowCostSheetWindow}
              setSelUnitDetails={setSelUnitDetails}
              setSelMode={setSelMode}
              leadDetailsObj={{}}
              setPhaseFun={setPhaseFun}
              selPhaseName={selPhaseName}

            />
          </div>
        )}





      </div>
    </section>
  )
}

export default UnitsInventoryHome
