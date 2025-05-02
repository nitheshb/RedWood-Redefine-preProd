/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
// import { useState } from 'react'
// import ProjectStatsCard from '../ProjectStatsCard/ProjectStatsCard'
// import PhaseDetailsCard from '../PhaseDetailsCard/PhaseDetailsCard'
import { useState, useEffect } from 'react'
import { Link } from '@redwoodjs/router'
import { getAllProjects } from 'src/context/dbQueryFirebase'
import DummyBodyLayout from './DummyBodyLayout/DummyBodyLayout'
import SiderForm from './SiderForm/SiderForm'
import { useAuth } from 'src/context/firebase-auth-context'

const projectFeedData = [
  { k: 'Total', v: 125, pic: '' },
  { k: 'Sold', v: 5, pic: '' },
  { k: 'Booked', v: 25, pic: '' },
  { k: 'Available', v: 85, pic: '' },
  { k: 'Hold', v: 10, pic: '' },
]
const unitFeedData = [
  { k: 'Total', v: 137500, pic: '' },
  { k: 'Sold', v: 5500, pic: '' },
  { k: 'Booked', v: 27500, pic: '' },
  { k: 'Available', v: 93500, pic: '' },
  { k: 'Hold', v: 11000, pic: '' },
]
const valueFeedData = [
  { k: 'Jan-2022', v: 4, pic: '' },
  { k: 'Feb-2022', v: 59, pic: '' },
  { k: 'Mar-2022', v: 6, pic: '' },
  { k: 'Apr-2022', v: 12, pic: '' },
]

const ProjectsUnitInventory = ({
  project,
  onSliderOpen = () => {},
  isEdit,
}) => {
  const {
    area,
    builderName,
    location,
    projectName,
    projectType,
    uid = 0,
  } = project
  const { user } = useAuth()

  const { orgId } = user
  const [projects, setProjects] = useState([])
  const [isOpenSideView, setIsOpenSideView] = useState(false)
  const [projectDetails, setProjectDetails] = useState({})
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
        setProjects(projects)
      },
      () => setProjects([])
    )
    return unsubscribe
  }
  const selProjctFun = (project) => {
    setIsOpenSideView(!isOpenSideView)
    setProjectDetails(project)
  }
  return (
    <div>
      <section className="py-8 mb-8 leading-7 text-gray-900 bg-white sm:py-12 md:py-16 lg:py-18 rounded-lg  ">
        <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">
          <div className="flex flex-col  leading-7  text-gray-900 border-0 border-gray-200 ">
            <div className="flex items-center flex-shrink-0  px-0  pl-0 border-b border-grey  mb-2">
              <Link className="flex items-center">
                <img className="w-16 h-16" alt="" src="/apart.svg"></img>
                <span className="relative z-10 flex items-center w-auto text-3xl font-bold leading-none pl-0 mt-[18px]">
                  {projectName}
                </span>
              </Link>
            </div>
          </div>

          <section className="grid justify-center md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7 my-10 ">
            {projects.length > 0 ? (
              projects.map((project, i) => (
                <>
                  <div
                    key={i}
                    className=" cursor-pointer relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16 mr-8 transition duration-300 ease-in-out hover:scale-105 hover:drop-shadow-2xl bg-white bg-opacity-50 shadow-xl bg-gradient-to-br from-green-50 to-cyan-100"
                    onClick={() => selProjctFun(project)}
                  >
                    <div className="px-6 mb-4">
                      <div className="flex flex-wrap justify-center">
                        <div className="-mb-35 -translate-y-1/2 transform">
                          <img
                            src={
                              project?.projectType?.name === 'Apartment'
                                ? '/apart1.svg'
                                : project?.projectType?.name === 'Plots'
                                ? '/plot.svg'
                                : project?.projectType?.name === 'WeekendVillas'
                                ? '/weekend.svg'
                                : `/villa.svg`
                            }
                            alt="Kobe Bryant"
                            title="Kobe Bryant"
                            className="py-3 bg-teal-100 mx-auto my-auto w-16 h-16 shadow-xl rounded-full align-middle border-none"
                          />
                        </div>
                        <div className="w-full text-center mt-[-10px]">
                          <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1 mt-">
                            {project?.projectName}
                          </h3>
                          <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                            <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>
                            {project?.location},{project?.pincode}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))
            ) : (
              <DummyBodyLayout />
            )}
          </section>
        </div>
      </section>
      <SiderForm
        open={isOpenSideView}
        setOpen={setIsOpenSideView}
        title={'Project Inventory'}
        projectDetails={projectDetails}
        unitsViewMode={true}
      />
    </div>
  )
}

export default ProjectsUnitInventory
