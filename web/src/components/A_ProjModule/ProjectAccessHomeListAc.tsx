/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect } from 'react'
import { TrashIcon } from '@heroicons/react/solid'
import { Card } from '@mui/material'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'
import { ProjectAccessFolder, ProjectFolders } from 'src/constants/projects'
import {
  AuditProjectComputedData,
  deleteProject,
  editPlotStatusAuditUnit,
  getAllUnitsByProject,
  getPlanDiagramByPhase,
  updateMoreDetails,
  updateProjectComputedData,
} from 'src/context/dbQueryFirebase'
import { getAllProjects } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import WarningModel from '../comps/warnPopUp'
import SiderForm from '../SiderForm/SiderForm'

const ProjectAccessHomeList = ({
  title,
  dialogOpen,
  data,
  source,
  projectDetails,
  pId,
}) => {
  const { user } = useAuth()
  const { orgId } = user
  const [loading, setLoading] = useState(false)

  const [subView, setSubView] = useState('salesAccess')
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [isOpenSideView, setIsOpenSideView] = useState(false)
  const [viewDocData, setViewDocData] = useState({})
  const [isDocViewOpenSideView, setIsDocViewOpenSideView] = useState(false)
  const [isAccessSideView, setIsAccessSideView] = useState(false)
  const [planDiagramsA, setPlanDiagramsA] = useState([])
  const [unitDetailsA, setUnitDetailsA] = useState([])
  useEffect(() => {
    getPlanDiagrams(data?.uid, 'plan_diagram')
    console.log('plan_diagram', data, projectDetails)
  }, [pId, data])
  const getPlanDiagrams = async (phaseId, type) => {
    const unsubscribe = getPlanDiagramByPhase(
      orgId,
      { pId: data?.phase.projectId, phaseId: data?.phase.uid, type: type },
      (querySnapshot) => {
        const response = querySnapshot.docs.map((docSnapshot) => {
          return { ...docSnapshot.data(), ...{ docId: docSnapshot.id } }
        })
        console.log('plan_diagram data is ', response)
        setPlanDiagramsA(response)
      },
      (e) => {
        console.log('error', e)
      }
    )
    return unsubscribe
  }
  useEffect(() => {
    getProjects()
  }, [])

  const auditFun = async () => {
    console.log('audit begin')
    setLoading(true)
    await setInvalidUnitStatus()
    await setProjectComputedCounts()
  }

  const setInvalidUnitStatus = async () => {
    console.log('login role detials', user)
    const { access, uid } = user

    if (access?.includes('manage_leads')) {
      const unsubscribe = getAllUnitsByProject(
        orgId,
        async (querySnapshot) => {
          const usersListA = querySnapshot.docs.map((docSnapshot) => {
            const x = docSnapshot.data()
            x.id = docSnapshot.id

            return x
          })
          usersListA.sort((a, b) => {
            return b?.booked_on || 0 - b?.booked_on || 0
          })

          usersListA.map(async (data) => {
            if (data?.status === '') {
              const statusObj = { status: 'available' }
              try {
                await editPlotStatusAuditUnit(
                  orgId,
                  data?.id,
                  statusObj,
                  user?.email,
                  `Unit Status Marked by Audit`,
                  enqueueSnackbar
                )
              } catch (error) {
                enqueueSnackbar('Plot details Updation Failed', {
                  variant: 'success',
                })
              }
            }
          })
          setLoading(false)
        },
        {
          projectId: projectDetails?.uid,
        },
        () => {}
      )
      return unsubscribe
    }

    // await console.log('leadsData', leadsData)
  }

  const setProjectComputedCounts = async () => {
    console.log('login role detials', user)
    const { access, uid } = user

    const unsubscribe = await getAllUnitsByProject(
      orgId,
      async (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id

          return x
        })
        usersListA.sort((a, b) => {
          return b?.booked_on || 0 - b?.booked_on || 0
        })

        console.log('total units are ', usersListA)
        setUnitDetailsA(usersListA)

        setLoading(false)
      },
      {
        projectId: projectDetails?.uid,
      },
      () => {}
    )
    const yo = {
      totalUnitCount: 0,
      availableCount: 0,
      bookUnitCount: 0,
      soldUnitCount: 0,
      blockedUnitCount: 0,
      management_blocked: 0,
      soldArea: 0,
      custBlockArea: 0,
      mangBlockArea: 0,
      blockedArea: 0,
      release_count: 0,
    }
    console.log('total units are ', unitDetailsA)

    await unitDetailsA.map((data) => {
      yo.totalUnitCount = yo.totalUnitCount + 1
      if (data?.status == 'available') {
        yo.availableCount = yo.availableCount + 1
      } else if (data?.status == 'customer_blocked') {
        yo.blockedUnitCount = yo.blockedUnitCount + 1
        yo.custBlockArea = yo.custBlockArea + (data?.area || 0)
        // yo.availableCount = yo.availableCount + 1
      } else if (data?.status == 'management_blocked') {
        yo.blockedUnitCount = yo.blockedUnitCount + 1
        yo.mangBlockArea = yo.mangBlockArea + (data?.area || 0)
        // yo.management_blocked = yo.management_blocked + 1
      } else if (data?.status == 'booked') {
        yo.bookUnitCount = yo.bookUnitCount + 1
      }

      if (
        [
          'sold',
          'ats_pipeline',
          'agreement_pipeline',
          'booked',
          'ATS',
          'registered',
        ].includes(data?.status)
      ) {
        yo.soldUnitCount = yo.soldUnitCount + 1
        yo.soldArea = yo.soldArea + (data?.area || 0)
      }

      if (['customer_blocked', 'management_blocked'].includes(data?.status)) {
        yo.blockedArea = yo.blockedArea + (data?.area || 0)
      }
      if (['released', 'yes'].includes(data?.release_status || '')) {
        yo.release_count = yo.release_count + 1
      }
    })

    console.log('Total Unit details are ', yo)
    await AuditProjectComputedData(orgId, projectDetails?.uid, yo)
    return unsubscribe

    // await console.log('leadsData', leadsData)
  }
  const onSubmit = async (formData, resetForm) => {
    const updatedData = {
      ...formData,
      editMode: true,
    }
    setLoading(true)
    await updateMoreDetails(data?.phase?.uid, updatedData, enqueueSnackbar)
    setLoading(false)
    resetForm()
    dialogOpen(false)
  }

  const initialState = {
    highlights: data?.phase?.moreDetails?.highlights || '',
    amenities: data?.phase?.moreDetails?.amenities || '',
    remarks: data?.phase?.moreDetails?.remarks || '',
  }

  const schema = Yup.object({
    highlights: Yup.string().required('Required'),
  })
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
        setProjects([...projects])
        console.log('project are ', projects)
      },
      () => setProjects([])
    )
    return unsubscribe
  }
  const handleDelete = async () => {
    if (
      projectDetails?.bookUnitCount == undefined ||
      projectDetails?.bookUnitCount == 0
    ) {
      deleteProject(
        orgId,
        projectDetails.uid,
        user?.email,
        projectDetails,
        enqueueSnackbar
      )
    } else {
      enqueueSnackbar(
        `Cannot delete: ${projectDetails?.bookUnitCount} Booked unit exists `,
        {
          variant: 'error',
        }
      )
    }

    dialogOpen(false)
  }
  const dispDoc = (docData, type) => {
    setViewDocData(docData)
    setSubView(type)
    setIsDocViewOpenSideView(!isDocViewOpenSideView)
  }
  const dispAccess = (docData, type) => {
    setViewDocData(docData)
    setSubView(type)
    setIsAccessSideView(!isAccessSideView)
  }
  return (
    <div className="h-full flex flex-col py-2  rounded-2xl  mx-4 my-4 ">
      {/* documents page */}
      <div className="mx-4 my-4 py-2  bg-white  rounded-2xl flex flex-col justify-between">
        <div className="ml-3 my-2 font-medium text-[12px] leading-[100%] tracking-[0.06em] uppercase text-[#606062]">
          Project Documents
        </div>
        <ul className="">
          <li className="">
            <section className="flex flex-row mt- grid grid-cols-4 ">
              {ProjectFolders?.map((project, i) => (
                <>
                  {project.type === 'folder' ? (
                    <>
                      <div
                        key={i}
                        className=" cursor-pointer relative mx-auto break-words bg-white  mb-2  rounded-2xl  transition duration-300 ease-in-out  "
                        onClick={() => dispDoc(project, project.category)}
                      >
                        <Card
                          sx={{
                            borderRadius: 4,
                          }}
                          variant="outlined"
                          className="w-[180px] m-1 p-2 flex flex-row"
                        >
                          <img
                            alt=""
                            className="h-6 w-5 bg-white "
                            src={project.img}
                          />
                          <div className="font-semibold text-[12px] ml-2 mt-[-1.5px]">
                            {project.name}
                          </div>
                        </Card>
                      </div>
                    </>
                  ) : null}
                </>
              ))}
            </section>
          </li>
        </ul>
      </div>
      <div className="mx-4   py-2 bg-white rounded-2xl flex flex-col justify-between">
        <div className="ml-3 my-2 font-medium text-[12px] leading-[100%] tracking-[0.06em] uppercase text-[#606062]">
          Module Access Management
        </div>
        <ul className="">
          <li className="">
            <section className="flex flex-row mt- grid grid-cols-4 ">
              {ProjectAccessFolder?.map((project, i) => (
                <>
                  {project.type === 'ppt' ? (
                    <>
                      <div
                        key={i}
                        className=" cursor-pointer relative mx-auto break-words bg-white  mb-4  rounded-2xl  transition duration-300 ease-in-out  "
                        onClick={() => dispAccess(project, project.category)}
                      >
                        <Card
                          sx={{
                            borderRadius: 4,
                          }}
                          variant="outlined"
                          className="w-[180px] m-1 p-2 flex flex-row"
                        >
                          <img
                            alt=""
                            className="h-6 w-5 bg-white "
                            src={project.img}
                          />
                          <div className="font-semibold	text-[12px] ml-2 mt-[-1.5px]">
                            {project.name}
                          </div>
                        </Card>
                      </div>
                    </>
                  ) : null}
                </>
              ))}
            </section>
          </li>
        </ul>
      </div>
      <div className="mx-4 my-4 p-4 rounded-2xl  bg-white flex flex-row justify-between">
        <section className="flex flex-col">
          <h2 className="font-medium text-[12px] leading-[100%] tracking-[0.06em] uppercase text-[#606062]">
            Project Audit
          </h2>

          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              This action will recalculate the counts of units and other KPI's
            </div>
          </div>
        </section>
        <section className="">
          <WarningModel
            type={'Danger'}
            open={open}
            setOpen={setOpen}
            proceedAction={handleDelete}
            title={'Are you sure you want to delete this project?'}
            subtext={
              'This Project will be permanently removed. This action cannot be undone.'
            }
            actionBtnTxt={'Delete project'}
          />
          <button
            type="button"
            onClick={() => {
              auditFun()
            }}
            className={`inline-flex w-full justify-center rounded-sm mt-3 px-3 py-2 bg-cyan-600 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto`}
          >
            <TrashIcon
              className="h-4 w-4 mr-1 ml- mt-[1px] inline text-white"
              aria-hidden="true"
            />{' '}
            Audit
          </button>
        </section>
      </div>
      <div className="mx-4 mb-2 p-4 rounded-2xl bg-white  flex flex-row justify-between">
        <section className="flex flex-col">
          <h2 className="font-medium text-[12px] leading-[100%] tracking-[0.06em] uppercase text-[#606062]">
            Danger Zone
          </h2>

          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              Irreversible and destructive action
            </div>
          </div>
        </section>
        <section className="">
          <WarningModel
            type={'Danger'}
            open={open}
            setOpen={setOpen}
            proceedAction={handleDelete}
            title={'Are you sure you want to delete this project?'}
            subtext={
              'This Project will be permanently removed. This action cannot be undone.'
            }
            actionBtnTxt={'Delete project'}
          />
          <button
            type="button"
            onClick={() => {
              setOpen(true)
            }}
            className={`inline-flex w-full justify-center rounded-sm mt-3 px-3 py-2 bg-cyan-600 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto`}
          >
            <TrashIcon
              className="h-4 w-4 mr-1 ml- mt-[1px] inline text-white"
              aria-hidden="true"
            />{' '}
            Delete Project
          </button>
        </section>
      </div>
      <SiderForm
        open={isOpenSideView}
        setOpen={setIsOpenSideView}
        title={'upload_legal_docs'}
        projectDetails={projectDetails}
        unitsViewMode={false}
        widthClass="max-w-2xl"
        projectsList={projects}
      />

      <SiderForm
        open={isDocViewOpenSideView}
        setOpen={setIsDocViewOpenSideView}
        title={'disp_project_docs'}
        subView={subView}
        projectDetails={projectDetails}
        unitsViewMode={false}
        widthClass="max-w-xl"
        projectsList={projects}
        viewLegalDocData={viewDocData}
      />
      <SiderForm
        open={isAccessSideView}
        setOpen={setIsAccessSideView}
        title={'disp_project_access'}
        subView={subView}
        phaseDetails={data}
        projectDetails={projectDetails}
        unitsViewMode={false}
        widthClass="max-w-xl"
        projectsList={projects}
        viewLegalDocData={viewDocData}
      />
    </div>
  )
}

export default ProjectAccessHomeList
