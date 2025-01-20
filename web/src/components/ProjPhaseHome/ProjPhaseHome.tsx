import { useState, useEffect } from 'react'

import {
  PlusIcon,
} from '@heroicons/react/outline'
import { useParams } from '@redwoodjs/router'
import Blockdetails from 'src/components/Blockdetails/Blockdetails'
import DummyBodyLayout from 'src/components/DummyBodyLayout/DummyBodyLayout'
import SiderForm from 'src/components/SiderForm/SiderForm'
import {
  getPhasesByProject,
  getBlocksByPhase,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import ConstructHomeList from '../A_ProjModule/ConstructHomeList'
import CRMHomeList from '../A_ProjModule/CRMHomeList'
import LegalHomeList from '../A_ProjModule/LegalHomeList'
import MarketingHomeList from '../A_ProjModule/MarketingHomeList'
import ProjectAccessHomeList from '../A_ProjModule/ProjectAccessHomeListAc'
import ProjectAuditHome from '../A_ProjModule/ProjectAuditHome'
import TemplatesHomeList from '../A_ProjModule/TemplatesHomeList'
import CostBreakUpSheet from '../costBreakUpSheet'
import CostSheetSetup from '../costSheetSetup'
import Floordetails from '../Floordetails/Floordetails'
import MoreDetailsPhaseForm from '../MoreDetailsPhaseForm/MoreDetailsPhaseForm'
import PaymentScheduleForm from '../PaymentScheduleForm/PaymentScheduleForm'
import PaymentLeadAccess from '../PaymentScheduleForm/ProjectLeadAccess'
import PaymentScheduleSetup from '../paymentScheduleSetup'
import PlanDiagramView from '../planDiagramView'

const ProjPhaseHome = ({
  ref,
  projectDetails,
  source,
  unitDetails,
  leadDetailsObj,
  selFlow,
}) => {
  const { user } = useAuth()

  const { orgId } = user
  const [myProjectDetails, setMyProjectDetails] = useState({ uid: '' })
  const [leadDetailsObj1, setLeadDetailsObj1] = useState({})
  // phases
  const [phases, setPhases] = useState([])
  const [phasesList, setPhasesList] = useState([])
  const [phaseViewFeature, setPhaseViewFeature] = useState('Blocks')

  // blocks
  const [selPhaseIs, setSelPhaseIs] = useState('')
  const [selPhaseName, setSelPhaseName] = useState('')
  const [selPhaseObj, setSelPhaseObj] = useState({})

  const [blocks, setBlocks] = useState({})
  const [showCostSheetWindow, setShowCostSheetWindow] = useState(false)
  const [selMode, setSelMode] = useState('Detail View')
  const [selUnitDetails, setSelUnitDetails] = useState({})
  // Set button id
  const [buttonId, setButtonId] = useState({})
  const [sliderInfo, setSliderInfo] = useState({
    open: false,
    title: '',
    sliderData: {},
    widthClass: 'max-w-2xl',
  })

  const [subView, setSubView] = useState('')
  const setPhaseFun = (leadDocId, value) => {
    setSelPhaseName(value.name)
    setSelPhaseIs(value.value)
  }
  const handleSliderClose = () => {
    setSliderInfo({
      open: false,
      title: '',
      sliderData: {},
      widthClass: 'max-w-2xl',
    })
  }

  const { uid } = useParams()
  let projId
  useEffect(() => {
    console.log('selValue are', selFlow)
    if (selFlow) {
      selCat(selFlow, '')
    } else {
      selCat('Blocks', '')
    }
  }, [selFlow])

  useEffect(() => {
    console.log(
      'new customer object selecton is',
      projectDetails,
      leadDetailsObj
    )
    setLeadDetailsObj1(leadDetailsObj)
  }, [leadDetailsObj])

  useEffect(() => {
    if (uid) {
      projId = uid
    } else {
      setMyProjectDetails(projectDetails)
      projId = projectDetails?.uid
    }
    console.log('projectDetails', projectDetails)
  }, [projectDetails])

  const getPhases = async (projectDetails) => {
    setMyProjectDetails(projectDetails)

    try {
      const unsubscribe = getPhasesByProject(
        orgId,
        uid || projectDetails?.uid,
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
          setPhasesList(phases)
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

  const getBlocks = async (phaseId) => {
    const unsubscribe = getBlocksByPhase(
      orgId,
      { projectId: uid || myProjectDetails?.uid, phaseId: phaseId },
      (querySnapshot) => {
        const response = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        response.sort((a, b) => {
          return a.created - b.created
        })
        setBlocks({ ...blocks, [phaseId]: response })
        console.log(
          'myblocks are',
          response.sort((a, b) => a.blockName.localeCompare(b.blockName)),
          blocks,
          uid || myProjectDetails?.uid,
          phaseId
        )
      },
      (e) => {
        console.log('error at getBlocks', e)
        setBlocks({ ...blocks, [phaseId]: [] })
      }
    )
    return unsubscribe
  }

  useEffect(() => {
    console.log('project details are ==>', projectDetails)
    console.log('project details are ==> 0', myProjectDetails)
    getPhases(projectDetails)
  }, [projectDetails])

  useEffect(() => {
    // if (phases.length > 0) {
    //   getBlocks(phases[0]['uid'] || '')
    // }
    getBlocks('phaseId')
  }, [phases, projectDetails])

  const selCat = (cat, subCat) => {
    setPhaseViewFeature(cat)
    setSubView(subCat || '')
  }

  return (
    <div>
      {phases
        ?.filter((dd) => dd.uid === selPhaseIs)
        .map((phase) => {
          const aprtConfig = [
            {
              k: 'Phase Area',
              v: `${phase?.phaseArea} sqft`,
              pic: '/builder2.png',
            },
            {
              k: 'Sellable Area',
              v: `${phase?.sellableArea} sqft`,
              pic: '/a1.png',
            },
            {
              k: 'Selling Rate /Sqft',
              v: `₹ ${phase?.sellingRate}`,
              pic: '/map.png',
            },
            {
              k: 'Project Start Date',
              v: phase?.startDate || 'N/A',
              pic: '/p1.png',
            },
            {
              k: 'Project End Date',
              v: phase?.endDate || 'N/A',
              pic: '/p1.png',
            },
          ]
          const reraConfig = [
            { k: 'RERA No', v: phase?.reraNo || 'N/A', pic: '/x.png' },
            {
              k: 'RERA Start Date',
              v: phase?.reraStartDate || 'N/A',
              pic: '/p1.png',
            },
            {
              k: 'RERA End Date',
              v: phase?.reraEndDate || 'N/A',
              pic: '/p1.png',
            },
            { k: 'Blocks', v: phase?.blocks || 0, pic: '/p1.png' },
            {
              k: 'Brokrege',
              v: `${phase?.brokerage} %` || 'N/A',
              pic: '/p1.png',
            },
            {
              k: 'Unit Cancellation',
              v: (() => {
                if (phase?.unitsCancel === 'percentage') {
                  return `${phase?.unitCancellation} %`
                }
                if (phase?.unitsCancel === 'fixedcost') {
                  return `₹ ${phase?.unitCancellation}`
                }
                return 0
              })(),
              pic: '/p1.png',
            },
          ]

          return (
            <>
              {showCostSheetWindow && (
                <CostBreakUpSheet
                  selMode={selMode}
                  title="Cost Break Up Sheetx"
                  leadDetailsObj1={leadDetailsObj1}
                  setLeadDetailsObj1={setLeadDetailsObj1}
                  selPhaseObj={selPhaseObj}
                  unitDetails={unitDetails}
                  projectDetails={myProjectDetails}
                  setShowCostSheetWindow={setShowCostSheetWindow}
                  selUnitDetails={selUnitDetails}
                />
              )}
              {/* {<AddBookingForm title="Booking Form" />} */}
              {/* <BlockingUnitForm title="Blocking Form" /> */}

              {!showCostSheetWindow && (
                <section
                  key={phase?.uid}
                  className=" mb-8 leading-7 text-gray-900 bg-white  rounded-b-lg"
                >
                  <div className="box-border mx-auto border-solid max-w-full ">
                    <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
                      {source === 'projectManagement' && (
                        <div className="flex flex-row border-b justify-between border-grey  mb-2 ">
                          <div className=" border-gray-800 ">
                            <ul
                              className="flex justify-  rounded-t-lg"
                              id="myTab"
                              data-tabs-toggle="#myTabContent"
                              role="tablist"
                            >
                              {[
                                {
                                  lab: 'Cost Sheet & More...',
                                  val: 'CostDetails',
                                  subval: 'costSheet',
                                },
                                { lab: 'Units', val: 'Blocks' },

                                {
                                  lab: 'Documents',
                                  val: 'projectDocuments',
                                  subval: 'projectApprovals',
                                },
                                {
                                  lab: 'Access Permissions',
                                  val: 'projectAccess',
                                  subval: 'accessDetails',
                                },
                                // { lab: 'Report', val: 'Report' },

                                { lab: 'Templates', val: 'Templates' },
                                {
                                  lab: 'Audit',
                                  val: 'audit',
                                },
                              ].map((d, i) => {
                                return (
                                  <li
                                    key={i}
                                    className="mr-2"
                                    role="presentation"
                                  >
                                    <button
                                      className={`inline-block py-3 px-4 text-sm font-medium text-center rounded-t-lg border-b-2  hover:text-blue hover:border-gray-300   ${
                                        phaseViewFeature === d.val
                                          ? 'border-black border-b-3'
                                          : 'border-transparent'
                                      }`}
                                      type="button"
                                      role="tab"
                                      onClick={() => selCat(d.val, d?.subval)}
                                    >
                                      {`${d.lab} `}
                                      {/* <span className="bg-gray-100 px-2 py-1 rounded-full">
                          {/* {rowsCounter(leadsFetchedData, d.val).length} */}
                                    </button>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>

                          <div className="flex items-center flex-shrink-0  px-0  pl-0 ">
                            <img
                              className="w-8 h-8 mr-2"
                              alt=""
                              src="/m3.png"
                            ></img>
                            {/* <span className="relative z-10 flex items-center w-auto text-md font-bold leading-none pl-0 mt-[px]">

                              <AssigedToDropComp
                                assignerName={selPhaseName}
                                id={'id'}
                                setAssigner={setPhaseFun}
                                usersList={phasesList}
                              />
                            </span> */}

                            {/* <section className="flex ml-auto mt-[18px] mb-3">
                    <button
                      onClick={() => {
                        setButtonId({
                          ...buttonId,
                          [`add-block-${phase.uid}`]:
                            !buttonId[`add-block-${phase.uid}`],
                        })
                        !buttonId[`add-block-${phase.uid}`] &&
                          getBlocks(phase.uid)
                      }}
                      className={
                        'flex ml-2 items-center h-6 px-3 text-xs font-semibold  rounded-full hover:bg-pink-200 hover:text-pink-800 ' +
                        (buttonId[`add-block-${phase.uid}`]
                          ? 'text-pink-800 bg-pink-200'
                          : 'text-green-800 bg-green-200')
                      }
                    >
                      {buttonId[`add-block-${phase.uid}`] ? (
                        <EyeIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      ) : (
                        <EyeOffIcon
                          className="h-3 w-3 mr-1"
                          aria-hidden="true"
                        />
                      )}
                      View Block Details
                    </button>

                    <button
                      onClick={() => {
                        setSliderInfo({
                          open: true,
                          title: 'Edit Phase',
                          sliderData: phase,
                          widthClass: 'max-w-2xl',
                        })
                      }}
                      className={
                        'flex ml-2  cursor-pointer items-center h-6 px-3 text-xs font-semibold  rounded-full hover:bg-pink-200 hover:text-pink-800 text-green-800 bg-green-200'
                      }
                    >
                      <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      Edit Phase
                    </button>
                    <button
                      onClick={() => {
                        setSliderInfo({
                          open: true,
                          title: 'Add Block',
                          sliderData: {
                            phase,
                            block: {},
                          },
                          widthClass: 'max-w-2xl',
                        })
                      }}
                      className={
                        'flex ml-2  cursor-pointer items-center h-6 px-3 text-xs font-semibold  rounded-full hover:bg-pink-200 hover:text-pink-800 text-green-800 bg-green-200'
                      }
                    >
                      <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      Add block
                    </button>
                    <button
                      onClick={() => {
                        setSliderInfo({
                          open: true,
                          title: 'Additional Charges',
                          sliderData: {
                            phase,
                          },
                          widthClass: 'max-w-6xl',
                        })
                      }}
                      className={
                        'flex ml-2  cursor-pointer items-center h-6 px-3 text-xs font-semibold  rounded-full hover:bg-pink-200 hover:text-pink-800 text-green-800 bg-green-200'
                      }
                    >
                      <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      Additional Charges
                    </button>
                    <button
                      onClick={() => {
                        setSliderInfo({
                          open: true,
                          title: 'Payment Schedule',
                          sliderData: {
                            phase,
                          },
                          widthClass: 'max-w-6xl',
                        })
                      }}
                      className={
                        'flex ml-2  cursor-pointer items-center h-6 px-3 text-xs font-semibold  rounded-full hover:bg-pink-200 hover:text-pink-800 text-green-800 bg-green-200'
                      }
                    >
                      <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      Payment Schedule
                    </button>
                    <button
                      onClick={() => {
                        setSliderInfo({
                          open: true,
                          title: 'More Details',
                          sliderData: {
                            phase,
                          },
                          widthClass: 'max-w-2xl',
                        })
                      }}
                      className={
                        'flex ml-2  cursor-pointer items-center h-6 px-3 text-xs font-semibold  rounded-full hover:bg-pink-200 hover:text-pink-800 text-green-800 bg-green-200'
                      }
                    >
                      <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      More Details
                    </button>
                  </section> */}
                          </div>
                        </div>
                      )}

                      {phaseViewFeature === 'Report' && (
                        <>
                          <div className="grid grid-cols-6 grid-flow-col gap-2 mt-6">
                            {aprtConfig.map((data, i) => {
                              return (
                                <span key={i} className="inline-flex mb-2">
                                  <span className="text-sm font-medium text-gray-500 ">
                                    {' '}
                                    {data.k}:{'  '}
                                  </span>
                                  <span className="text-sm ml-1">
                                    {' '}
                                    {data.v}
                                  </span>
                                </span>
                              )
                            })}
                          </div>

                          <div className="grid grid-cols-6 grid-flow-col gap-2">
                            {reraConfig.map((data, i) => {
                              return (
                                <span key={i} className="inline-flex mb-2">
                                  <span className="text-sm font-medium text-gray-500 ">
                                    {' '}
                                    {data.k}:{'  '}
                                  </span>
                                  <span className="text-sm ml-1">
                                    {' '}
                                    {data.v}
                                  </span>
                                </span>
                              )
                            })}
                          </div>
                        </>
                      )}
                      {phaseViewFeature === 'Cost Sheet' && (
                        <CostSheetSetup phase={phase} source={source} />
                      )}
                      {phaseViewFeature === 'Payment Schedule' && (
                        <PaymentScheduleSetup phase={phase} source={source} />
                      )}
                       {/* {phaseViewFeature === 'projectDetails' && (
                        <DialogFormBody
                        ref={ref}
                        title={'Create Project'}
                        // dialogOpen={(=>())}
                        project={phase}
                      />
                      )} */}


                      {phaseViewFeature === 'Blocks' &&
                        (selPhaseObj?.projectType?.name == 'Plots' ? (
                          <Floordetails
                            pId={projectDetails?.uid}
                            projectDetails={projectDetails}
                            phaseFeed={phases}
                            selBlock={{
                              totalValue: 0,
                              soldValue: 0,
                              availValue: 0,
                              bookValue: 0,
                              blockValue: 0,
                              holdValue: 0,
                              totalArea: 0,
                              soldArea: 0,
                              availArea: 0,
                              bookArea: 0,
                              blockArea: 0,
                              holdArea: 0,
                              totalUnitCount: 0,
                              soldUnitCount: 0,
                              availableCount: 0,
                              bookUnitCount: 0,
                              blockUnitCount: 0,
                            }}
                            source={source}
                            setShowCostSheetWindow={setShowCostSheetWindow}
                            setSelUnitDetails={setSelUnitDetails}
                            setSelMode={setSelMode}
                            leadDetailsObj={leadDetailsObj1}
                            setPhaseFun={setPhaseFun}
                            selPhaseName={selPhaseName}
                          />
                        ) : blocks['phaseId']?.length ? (
                          <Blockdetails
                            blocks={blocks['phaseId']}
                            blockPayload={blocks}
                            phaseFeed={phases}
                            pId={uid || myProjectDetails?.uid}
                            projectDetails={myProjectDetails}
                            phaseDetails={phase}
                            source={source}
                            setShowCostSheetWindow={setShowCostSheetWindow}
                            setSelUnitDetails={setSelUnitDetails}
                            setSelMode={setSelMode}
                            leadDetailsObj={leadDetailsObj}
                          />
                        ) : !blocks['phaseId'] ? (
                          <DummyBodyLayout />
                        ) : (
                          <div className="flex justify-center items-center font-semibold mt-3">
                            <img
                              className="w-12 h-12 mr-2"
                              alt=""
                              src="/l1.png"
                            ></img>
                            Blocks are not created yet{' '}
                            {/* {source === 'projectManagement' && ( */}
                              <button
                                onClick={() => {
                                  setSliderInfo({
                                    open: true,
                                    title: 'Add Block',
                                    sliderData: {
                                      phase,
                                      block: {},
                                    },
                                    widthClass: 'max-w-2xl',
                                  })
                                }}
                                className={
                                  'flex ml-2  cursor-pointer items-center h-6 px-3 text-xs font-semibold  rounded-full bg-pink-200 hover:bg-pink-300 hover:text-pink-800 text-pink-800 '
                                }
                              >
                                <PlusIcon
                                  className="h-3 w-3 mr-1"
                                  aria-hidden="true"
                                />
                                Add block
                              </button>
                            {/* )} */}
                          </div>
                        ))}

                      {phaseViewFeature === 'Plan Diagram' && (
                        <PlanDiagramView
                          title={'Plan Diagram'}
                          data={phase}
                          blocks={[]}
                          pId={uid || myProjectDetails?.uid}
                          source={source}
                        />
                      )}
                      {phaseViewFeature === 'Brouchers' && (
                        <PlanDiagramView
                          title={'Brouchers'}
                          data={phase}
                          blocks={[]}
                          pId={uid || myProjectDetails?.uid}
                          source={source}
                        />
                      )}
                      {phaseViewFeature === 'Approvals' && (
                        <PlanDiagramView
                          title={'Approvals'}
                          data={phase}
                          blocks={[]}
                          pId={uid || myProjectDetails?.uid}
                          source={source}
                        />
                      )}
                      {phaseViewFeature === 'Bank Details' && (
                        <PaymentScheduleForm
                          title={'Payment Schedule'}
                          data={{ phase: phase }}
                          source={source}
                        />
                      )}

                      {phaseViewFeature === 'Lead Access' && (
                        <PaymentLeadAccess
                          title={'Leads Access c'}
                          data={{ phase: phase, project: projectDetails }}
                          source={source}
                        />
                      )}

                      {phaseViewFeature === 'projectDocuments' && (
                        <LegalHomeList
                          title={'Finance'}
                          dialogOpen={'false'}
                          data={phase}
                          source={source}
                          setSubView={setSubView}
                          subView={subView}
                          projectDetails={projectDetails}
                          pId={uid || myProjectDetails?.uid}
                        />
                      )}

                      {phaseViewFeature === 'CostDetails' && (
                        <CRMHomeList
                          title={'Finance'}
                          dialogOpen={'false'}
                          data={{ phase: phase }}
                          source={source}
                          setSubView={setSubView}
                          subView={subView}
                          projectDetails={projectDetails}
                          pId={uid || myProjectDetails?.uid}
                        />
                      )}
                      {phaseViewFeature === 'Construction' && (
                        <ConstructHomeList
                          title={'Finance'}
                          dialogOpen={'false'}
                          data={{ phase: phase }}
                          source={source}
                        />
                      )}
                      {phaseViewFeature === 'marketing' && (
                        <MarketingHomeList
                          title={'Marketing'}
                          dialogOpen={'false'}
                          data={{ phase: phase }}
                          source={source}
                        />
                      )}
                      {phaseViewFeature === 'projectAccess' && (
                        <ProjectAccessHomeList
                          title={'Project Access'}
                          dialogOpen={'false'}
                          data={{ phase: phase }}
                          projectDetails={projectDetails}
                          source={source}
                        />
                      )}

                      {phaseViewFeature === 'Templates' && (
                        <TemplatesHomeList
                          title={'Templates'}
                          dialogOpen={'false'}
                          data={{ phase: phase }}
                          source={source}
                        />
                      )}
                      {phaseViewFeature === 'More Details' && (
                        <MoreDetailsPhaseForm
                          title={'More Details'}
                          dialogOpen={'false'}
                          data={{ phase: phase }}
                          source={source}
                        />
                      )}
                      {phaseViewFeature === 'audit' && (
                        <ProjectAuditHome
                          title={'Templates'}
                          projectDetails={projectDetails}
                          dialogOpen={'false'}
                          data={{ phase: phase }}
                          source={source}
                        />
                      )}
                    </div>
                  </div>
                </section>
              )}
            </>
          )
        })}
      <SiderForm
        open={sliderInfo.open}
        setOpen={handleSliderClose}
        title={sliderInfo.title}
        data={sliderInfo.sliderData}
        widthClass={sliderInfo.widthClass}
        pid={uid || myProjectDetails?.uid}
      />
    </div>
  )
}

export default ProjPhaseHome
