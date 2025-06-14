/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'
import SiderForm from 'src/components/SiderForm/SiderForm'
import { getAllProjects, getPhasesByProject } from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import 'flowbite'
import DropDownSearchBar from 'src/components/dropDownSearchBar'
import { PlusIcon } from '@heroicons/react/outline'
import ProjPhaseHome from '../ProjPhaseHome/ProjPhaseHome'
import ConstructProjectUnitsDisplay from './Const_ProjectUnitsDisplay'
const ConstructUnitsHome = ({ project }) => {
  const { projectName } = project
  const { user } = useAuth()

  const { orgId } = user
  const [projects, setProjects] = useState([])
  const [isOpenSideView, setIsOpenSideView] = useState(false)
  const [isDocViewOpenSideView, setIsDocViewOpenSideView] = useState(false)
  const [projectDetails, setProjectDetails] = useState({})
  const [viewDocData, setViewDocData] = useState({})
  const [phasesList, setPhasesList] = useState([])
  const [filteredUnits, setFilteredUnits] = useState([])
  const [filStatus, setFilStatus] = useState(['available', 'booked', 'blocked'])
  const [myProjectDetails, setMyProjectDetails] = useState({ uid: '' })
  const [selPhaseObj, setSelPhaseObj] = useState({})

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
        const allProA = [
          {
            label: 'All Projects',
            value: 'allprojects',
          },
        ]
        setProjects([...allProA, ...projects])
        console.log('project are ', projects)
      },
      () => setProjects([])
    )
    return unsubscribe
  }
  const selProjctFun = (project) => {
    setProjectDetails(project)
  }
  const selPhaseFun = (phaseDat) => {
    setIsOpenSideView(!isOpenSideView)
    setSelPhaseObj(phaseDat)
  }

  const dispDoc = (docData) => {
    console.log('i as clicked here 1')
    setViewDocData(docData)
    setIsDocViewOpenSideView(!isDocViewOpenSideView)
  }
  useEffect(() => {
    getPhases(projectDetails)
  }, [projectDetails])

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
          // setPhases(phases)

          phases.map((user) => {
            user.name = user.phaseName
            user.label = user.phaseName
            user.value = user.uid
          })
          setPhasesList(phases)
          if (phases.length > 0) {

            setSelPhaseObj(phases?.[0])
          }
          console.log('myphases are', phases)
        },
        (e) => {
          console.log('error at getPhases', e)
          // setPhases([])
          setPhasesList([])
        }
      )
      return unsubscribe
    } catch (error) {
      console.log('error at getting phases', error)
    }
  }

  return (
    <div>
      <section className=" m-1 py-4   leading-7 text-gray-900 bg-white  rounded-lg  ">
        <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full ">


          <div className="   ">
            <form className="">
              <div className="flex flex-row justify-between">
                <span className="relative flex  items-center w-auto text-xl  leading-none pl-0">
                  Projects
                </span>
                <div className="relative w-[286px]">
                  <input
                    type="search"
                    id="search-dropdown"
                    className="block p-2.5 py-1 w-[120px] z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg rounded-l-lg border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                    placeholder={`Unit No`}
                    required
                  />
                  <section className="absolute top-0 right-0  flex flex-row">
                    <DropDownSearchBar
                      type={'All Projects'}
                      id={'id'}
                      setStatusFun={{}}
                      viewUnitStatusA={filteredUnits}
                      pickCustomViewer={selProjctFun}
                      selProjectIs={projectDetails}
                      dropDownItemsA={projects}
                    />

                    <button
                      type="submit"
                      className="px-2.5 py-1 px- text-sm font-medium text-white bg-[#734CDF] rounded-r-lg border border-[#734CDF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                      <span className="sr-only">Search</span>
                    </button>
                  </section>
                </div>
              </div>
            </form>
          </div>
          {projectDetails.uid === undefined && (
            <section className="w-full">
              <ProjPhaseHome
                projectDetails={projectDetails}
                source={'ConstructModule'}
                unitDetails={undefined}
              />
            </section>
          )}
          {projectDetails.uid === undefined && (
            <section className="grid justify-center md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7 my-10 ">
              <div
                className="cursor-pointer  z-10 flex flex-col  max-w-md p-2 my-0  mx-4 rounded-sm inline-block  min-h-[50px]  min-w-[100px] border border-dotted border-black rounded-md"
                onClick={() => {
                  setSliderInfo({
                    open: true,
                    title: ['Apartments'].includes(
                      projectDetails?.projectType?.name
                    )
                      ? 'Import Units'
                      : 'Import Apartment Units',
                    sliderData: {
                      phase: {},
                      block: {},
                    },
                    widthClass: 'max-w-6xl',
                  })
                }}
              >
                <div
                  className="flex flex-col items-center justify-between"
                  onClick={() => setIsOpenSideView(!isOpenSideView)}
                >
                  <PlusIcon className="h-8 w-8 mr-1 mt-14" aria-hidden="true" />
                  <h3 className="m-0  text-sm  mt-1 font-semibold  leading-tight tracking-tight text-black border-0 border-gray-200 text-xl ">
                    Upload Document
                  </h3>
                </div>
                <div className="flex flex-row justify-between px-2">
                  <span className="flex flex-row items-center justify-between mr-2">
                    <span className="text-sm font-"></span>
                  </span>
                </div>
              </div>
              {projects.length > 0 ? (
                projects.map((project, i) => (
                  <>
                    <div
                      key={i}
                      className=" cursor-pointer relative max-w-md mx-auto md:max-w-2xl  min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl  mr-8 transition duration-300 ease-in-out hover:scale-105 hover:drop-shadow-2xl bg-white bg-opacity-50 shadow-xl bg-gradient-to-br from-green-50 to-cyan-100"
                      onClick={() => dispDoc(project)}
                    >
                      <div className="px-4 py-2 mb-4 flex flex-col">
                        <span>#103459</span>

                        <h3 className="text-lg text-slate-700 font-bold  leading-normal mb-1 mt-">
                          {project?.projectName}
                        </h3>
                        <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                          Nithesh B 31/11/2022
                        </div>
                        <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                          Sale Agreement
                        </div>
                      </div>
                    </div>
                  </>

                ))
              ) : (
                <></>
              )}
            </section>
          )}
          <ConstructProjectUnitsDisplay
            pId={projectDetails?.uid}
            selBlock={{}}
            dispSideView={dispDoc}
          />


        </div>
      </section>
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
        title={'disp_unit_constDetails'}
        projectDetails={projectDetails}
        unitsViewMode={false}
        widthClass="max-w-4xl"
        projectsList={projects}
        viewUnitConstData={viewDocData}
      />
    </div>
  )
}

export default ConstructUnitsHome
