/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'
import { deleteProject, getPlanDiagramByPhase, updateMoreDetails, updateProjectPayload } from 'src/context/dbQueryFirebase'
import { getAllProjects } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import PaymentLeadAccess from '../PaymentScheduleForm/ProjectLeadAccess'
import SiderForm from '../SiderForm/SiderForm'
import { Checkbox } from '@mui/material'


const ProjectAccessSideView = ({
  title,
  dialogOpen,
  data,
  source,
  setSubView,
  subView,
  projectDetails,
  pId,
}) => {
  const { user } = useAuth()
  const { orgId } = user
  const [loading, setLoading] = useState(false)
  const [allowCrmStausOnDue, setAllowCrmStatusOnDue] = useState(false)
  const [allowSalesExCsEdit, setAllowSalesExCsEdit] = useState(false)

  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [isOpenSideView, setIsOpenSideView] = useState(false)
  const [viewDocData, setViewDocData] = useState({})
  const [isDocViewOpenSideView, setIsDocViewOpenSideView] = useState(false)
  const [isAccessSideView, setIsAccessSideView] = useState(false)
  const [planDiagramsA, setPlanDiagramsA] = useState([])

  useEffect(()=>{
    setAllowCrmStatusOnDue(projectDetails?.allowCrmStatusChangeOnDue || false)
    setAllowSalesExCsEdit(projectDetails?.allowSalesExCsEdit || false)

  }, [projectDetails])
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
    // projectDetails.uid
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
      // enqueueSnackbar('Deleted Successfully', {
      //   variant: 'success',
      // })
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
  const updateCrmStatusAcess = (status) => {

    updateProjectPayload(orgId, projectDetails?.uid, { allowCrmStatusChangeOnDue: status.target.checked })
    setAllowCrmStatusOnDue(status.target.checked )
  }
  const updateAllowSalesExCsEdit = (status) => {

    updateProjectPayload(orgId, projectDetails?.uid, { allowSalesExCsEdit: status.target.checked })
    setAllowSalesExCsEdit(status.target.checked )
  }
  return (
    <div className="h-full flex flex-col  bg-white shadow-xl">
      <div className="   z-10">
 

        <div className="flex flex-row ">
        <div className="flex flex-col w-full gap-4">
          {subView === 'salesAccess' && (
            <PaymentLeadAccess
              title={'Leads Access'}
              data={{ phase: data, project: projectDetails }}
              dept="sales"
              source={source}
            />
          )}
          {subView === 'salesAccess' && (  <div className='ml-4'>
                            <Checkbox
                              color="primary"
                              checked={allowSalesExCsEdit}
                              onChange={(e) => {

                                updateAllowSalesExCsEdit(e)
                              }}
                              inputProps={{
                                'aria-label': 'select all desserts',
                              }}
                            />
                            <span className="mt-1"> Allow Costsheet Edit feature for Sales Executive</span>
                          </div>)}

          {subView === 'creditNoteIssuers' && (
            <PaymentLeadAccess
              title={'Credit Note Issuers'}
              data={{ phase: data, project: projectDetails }}
              dept="admin"
              source={source}
            />
          )}

          {subView === 'marketingAccess' && (
            <PaymentLeadAccess
              title={'Marketing Access'}
              data={{ phase: data, project: projectDetails }}
              dept="marketing"
              source={source}
            />
          )}


          {subView === 'crmAccess' && (
            <PaymentLeadAccess
              title={'CRM Access'}
              data={{ phase: data, project: projectDetails }}
              dept="crm"
              source={source}
            />
          )}
                   {subView === 'crmAccess' && (  <div className='ml-4'>
                            <Checkbox
                              color="primary"
                              checked={allowCrmStausOnDue}
                              onChange={(e) => {
                                // console.log('earnet')
                                // addRemoveProjectAccessFun(salesPerson)
                                updateCrmStatusAcess(e)
                              }}
                              inputProps={{
                                'aria-label': 'select all desserts',
                              }}
                            />
                            <span className="mt-1"> Allow Unit status change on Elgible Balance exists</span>
                          </div>)}



          {subView === 'FinAccess' && (
            <PaymentLeadAccess
              title={'Finance Access'}
              data={{ phase: data, project: projectDetails }}
              dept="finance"
              source={source}
            />
          )}
          {subView === 'legalAccess' && (
            <PaymentLeadAccess
              title={'Legal Access'}
              data={{ phase: data, project: projectDetails }}
              dept="legal"
              source={source}
            />
          )}
          {subView === 'constructAccess' && (
            <PaymentLeadAccess
              title={'Contruction Access'}
              data={{ phase: data, project: projectDetails }}
              dept="construction"
              source={source}
            />
          )}
             </div>
        </div>
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

export default ProjectAccessSideView






