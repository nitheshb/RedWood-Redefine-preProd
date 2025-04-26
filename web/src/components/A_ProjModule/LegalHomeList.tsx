import { useState } from 'react'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'
import { updateMoreDetails } from 'src/context/dbQueryFirebase'
import PaymentLeadAccess from '../PaymentScheduleForm/ProjectLeadAccess'
import PlanDiagramView from '../planDiagramView'

const LegalHomeList = ({
  title,
  dialogOpen,
  data,
  setSubView,
  subView,
  source,
  projectDetails,
  pId,
}) => {
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

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

  return (
    <div className="h-full flex flex-col  bg-white shadow-xl overflow-y-scroll">
      <div className="  z-10">
        <div className="flex flex-row">
          {subView === 'legalTeamAccess' && (
            <PaymentLeadAccess
              title={'Leads Access'}
              data={{ phase: data, project: projectDetails }}
              source={source}
            />
          )}
          {subView === 'projectApprovals' && (
            <PlanDiagramView
              title={'Approvals'}
              data={data}
              blocks={[]}
              pId={pId}
              source={source}
              category={subView}
            />
          )}{' '}
          {subView === 'legalDocs' && (
            <PlanDiagramView
              title={'LegalDocs'}
              data={data}
              blocks={[]}
              pId={pId}
              source={source}
              category={subView}
            />
          )}
          {subView === 'planDiagram' && (
            <PlanDiagramView
              title={'Plan Diagram'}
              data={data}
              blocks={[]}
              pId={pId}
              source={source}
              category={subView}
            />
          )}
          {subView === 'Brouchers' && (
            <PlanDiagramView
              title={'Brouchers'}
              data={data}
              blocks={[]}
              pId={pId}
              source={source}
              category={subView}
            />
          )}
          {subView === 'others' && (
            <PlanDiagramView
              title={'Plan Diagram'}
              data={data}
              blocks={[]}
              pId={pId}
              source={source}
              category={subView}
            />
          )}
        </div>
        <div className="grid  gap-8 grid-cols-1">
          <div className="flex flex-col m-4">
            <div className="mt-0"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalHomeList
