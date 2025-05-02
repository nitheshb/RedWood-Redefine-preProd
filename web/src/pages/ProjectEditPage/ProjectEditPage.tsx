import { useEffect, useState } from 'react'
import { useParams } from '@redwoodjs/router'
import SlimSideMenuBar from 'src/components/A_SideMenu/slimSideMenu'
import HeadNavBar2 from 'src/components/HeadNavBar/HeadNavBar2'
import { getProjectByUid } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import DummyBodyLayout from '../../components/DummyBodyLayout/DummyBodyLayout'
import ProjPhaseHome from '../../components/ProjPhaseHome/ProjPhaseHome'
import SiderForm from '../../components/SiderForm/SiderForm'
import EachProjectDashboard from 'src/components/A_ProjModule/EachProjectDashboard'

const ProjectEditPage = ({
  selModule,
  setSelModule,
  viewable,
  setViewable,
}) => {
  const [isAddPhaseOpen, setIsAddPhaseOpen] = useState(false)
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false)

  const [project, setProject] = useState({
    projectName: '',
  })
  const handleAddPhaseOnClose = () => setIsAddPhaseOpen(false)
  const handleEditProjectClose = () => setIsEditProjectOpen(false)
  const { uid } = useParams()
  const { user } = useAuth()

  const { orgId } = user

  const getProjectDetails = async (id) => {
    const unsubscribe = await getProjectByUid(
      orgId,
      id,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setProject(projects[0])
        console.log('set project value is ', projects[0])
      },
      () =>
        setProject({
          projectName: '',
        })
    )
    return unsubscribe
  }
  useEffect(() => {
    getProjectDetails(uid)
  }, [uid])
  return (
    <>
      <div className="flex w-screen h-screen text-gray-700">
        {/* <HeadSideBar /> */}
        <div className="flex flex-col flex-grow">
          {/* <HeadNavBar /> */}
          <div className="flex overflow-y-hidden flex-row overflow-auto h-[100vh]  text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
            <SlimSideMenuBar
              pgName={'projectModule'}
              sourceLink={'projectModule'}
              showSideView1={undefined}
              setViewable={setViewable}
              viewable={viewable}
            />
            <div className="flex-grow   items-center overflow-y-auto no-scrollbar  h-[98%]  px-300  pt-300">
              <HeadNavBar2
                selModule={''}
                setSelModule={''}
                setViewable={setViewable}
              />
              <div className="mx-1 mt-1">
                {project?.projectName ? (
                  <>
                    <EachProjectDashboard
                      project={project}
                      isEdit
                      onSliderOpen={() => {
                        setIsEditProjectOpen(true)
                      }}
                    />
                    {/* <ProjectsMHomeBody
                      project={project}
                      isEdit
                      onSliderOpen={() => {
                        setIsEditProjectOpen(true)
                      }}
                    /> */}
                    <ProjPhaseHome
                      projectDetails={project}
                      source="projectManagement"
                    />
                  </>
                ) : (
                  <DummyBodyLayout />
                )}
              </div>
              <SiderForm
                open={isAddPhaseOpen}
                setOpen={handleAddPhaseOnClose}
                title="Add Phase"
                data={{}}
                widthClass="max-w-4xl"
              />
              <SiderForm
                open={isEditProjectOpen}
                setOpen={handleEditProjectClose}
                title="Edit Project"
                data={project}
                widthClass="max-w-4xl"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectEditPage
