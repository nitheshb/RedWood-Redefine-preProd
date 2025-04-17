/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline'
import { useSnackbar } from 'notistack'
import Loader from 'src/components/Loader/Loader'
import {
  projectDetailFlow,
} from 'src/constants/projects'
import {
  steamBankDetailsList,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'

import DialogFormBody from '../DialogFormBody/DialogFormBody'
import ProjPhaseHome from '../ProjPhaseHome/ProjPhaseHome'


const ProjectDetailsFlowBody = ({ setProject, title, dialogOpen, project }) => {
  const formikRef = useRef()
  // const { submitForm } = useFormikContext();

  const d = new window.Date()
  const { user } = useAuth()
  const { orgId } = user
  const [selOptionalItem, setoptionalItem] = useState('Blocks')
  const [loading, setLoading] = useState(false)
  const [submitter, setSubmitter] = useState(0)
  const { enqueueSnackbar } = useSnackbar()

  const [bankDetailsA, setBankDetailsA] = useState([])
  const [selFlow, setSelFlow] = useState({
    name: 'Project Details',
    value: 'projectDetails',
    img: '/apart1.svg',
    indx: 0,
  })
  const setSub = () => {
    setSubmitter(2)
  }
  const setLoading1 = (x) => {
    setLoading(x)
  }
  useEffect(() => {
    const unsubscribe = steamBankDetailsList(
      orgId,
      (querySnapshot) => {
        const addNewSetUp = [{ value: 'addNewOption', label: 'Add New' }]
        const bankA = querySnapshot.docs.map((docSnapshot) => {
          const x = docSnapshot.data()
          x.id = docSnapshot.id
          return x
        })
        bankA.map((user) => {
          user.label = user?.accountName
          user.value = user?.accountNo
        })
        console.log('fetched users list is', bankA)
        setBankDetailsA([...addNewSetUp, ...bankA])
      },
      (error) => setBankDetailsA([])
    )

    return unsubscribe
  }, [])
  const goToNext = () => {
    setSelFlow(
      selFlow.indx === projectDetailFlow.length - 1
        ? projectDetailFlow[0]
        : projectDetailFlow[selFlow.indx + 1]
    )
  }

  const goToPrevious = () => {
    setSelFlow(
      selFlow.indx === 0
        ? projectDetailFlow[projectDetailFlow.length - 1]
        : projectDetailFlow[selFlow.indx - 1]
    )
  }
  const submitForm1 = () => {
    console.log('selected value is', formikRef)

    if (formikRef.current) {
      console.log('selected value is')
      formikRef?.current?.submitForm()
    }
  }
  // const { submitForm } = useFormikContext();
  const submitMyForm = null

  const handleSubmitMyForm = (e) => {
    if (submitMyForm) {
      submitMyForm(e)
    }
  }

  const bindSubmitForm = (submitFormFunction: () => void) => {
    return

  }
  return (

    <>


    <div className='flex flex-col h-screen relative overflow-hidden bg-[linear-gradient(to_bottom,_#D3F0F8,_#F6F5F8)]'>

    <div className="sticky top-0 z-30 p-4 py-2 bg-[linear-gradient(to_bottom,_#D3F0F8,_#F6F5F8)]">
        <Dialog.Title className="font-medium text-[#0E0A1F] text-[16px] leading-[100%] tracking-[0.06em] uppercase py-4">
          Project Information
        </Dialog.Title>

        <div className="flex flex-row mt-1 ">
          {projectDetailFlow.map((option) => (
            <>
              <div
                className={`w-[200px] border  flex justify-between rounded-lg mx-1 py-2 px-2 ${
                  selFlow.value === option.value ? '' : ''
                } `}
                onClick={() => {
                  if (project?.uid) {
                    setoptionalItem(option?.value)
                    setSelFlow(option)
                  } else {
                    enqueueSnackbar('Please create project to proceed..!', {
                      variant: 'warning',
                    })
                  }
                }}
              >
                <div className="w-full">
                  <div className="flex col-span-2 flex-row  justify-between items-center">

        
                    <label
                      className={`font-medium flex flex-col py-2   ${
                        selFlow.value == option.value
                          ? 'text-gray-900'
                          : 'text-gray-900'
                      }`}
                    >


                      <div className='flex flex-col justify-between w-full '>
                      <div className=" inline text-[#606062] font-[Outfit] mb-2 font-normal text-[12px] leading-[100%] tracking-[0%]">
                        {option.name}
                      </div>

                      <section className="row-span-2 flex flex-row justify-between">

                      <div
                          className={`${
                            selFlow.value == option.name
                              ? 'flex-shrink-0 text-white '
                              : 'flex-shrink-0 text-black '
                          } mt-1 font-light`}
                        >
                          <ArrowRightIcon
                            className={`${
                              selFlow.value === option.value
                                ? 'text-[#57C0D0]'
                                : 'text-[#6e6464]'
                            } w-4 h-4`}
                          />

                        </div>
                      </section>{' '}
                      </div>


           
                    </label>

                    <div>
                        {option.img && (
                          <img
                            className="w-[65px] h-auto inline"
                            alt=""
                            src={option.img}
                          ></img>
                        )}

                        </div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>








      <div className="flex-1 overflow-y-auto  scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 pb-2">

<div className="grid  gap-8 grid-cols-1 ">
<div className="flex flex-col ">
<div className="">
  {selFlow.value === 'projectDetails' && (
    <DialogFormBody
      ref={formikRef}

      title={'Create Project'}
      // dialogOpen={(=>())}
      moveNext={goToNext}
      project={project}
      bindSubmitForm={bindSubmitForm}
      setSubmitter={setSub}
      submitter={submitter}
      loading1={loading}
      setLoading1={setLoading1}
      setProject={setProject}
    />
  )}
  <ProjPhaseHome
    projectDetails={project}
    source="projectOnboard"
    selFlow={selFlow.value}
    ref={formikRef}
  />
</div>
</div>
</div>
</div>



<div className="sticky bottom-0 z-30 flex flex-row justify-between pr-6 bg-white  w-full">
  <div className="mt-5  md:space-x-3 md:block ml-3 w-full">
    <button
      // onClick={() => dialogOpen(false)}
      onClick={() => goToPrevious()}
      type="button"
      className="mb-4 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-sm hover:shadow-lg hover:bg-gray-100"
    >
      <section className="flex flex-row">
        <ArrowLeftIcon className={` w-4 h-4 mt-[2px] mr-1`} />
        Back
      </section>
    </button>
  </div>
  <section className="w-[300px] mt-6 text-center flex flex-row text-red-400 ">
    {selFlow?.indx + 1} of {projectDetailFlow.length} steps
  </section>

  <div className="mt-5 w-full text-right md:space-x-3 md:block flex flex-row mb-6 justify-between w-full ">
    {selFlow.value === 'projectDetails' && (
      <button
        className="mb-2 md:mb-0 bg-cyan-600 px-5 py-2 text-sm shadow-sm font-medium mr- tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-green-500 "
        type="submit"
        onClick={
          () => {
            setLoading(true)
            setSubmitter(1)
          }

        }
      >
        {loading && <Loader />}
        Save
      </button>
    )}



{selFlow?.indx+1 === projectDetailFlow.length && (
      <button
        className="mb-2 md:mb-0 bg-cyan-600 px-5 py-2 text-sm shadow-sm font-medium mr- tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-green-500 "
        type="submit"


        onClick={
          () => {
            dialogOpen(false)
          }

        }
      >

        Close
      </button>
    )}


    <button
      className={` ${selFlow?.indx+1 === projectDetailFlow.length ? 'hidden': '' }   mb-2 md:mb-0  bg-cyan-600 px-5 py-2 text-sm shadow-sm font-medium  tracking-wider text-white  rounded-sm hover:shadow-lg `}
      disabled={loading}
      onClick={() => {
        if (project?.uid) {
          goToNext()
        } else {
          enqueueSnackbar('Please create project to proceed..!', {
            variant: 'warning',
          })
        }
      }}
    >
      <section className="flex flex-row">
        Next:
        {selFlow.indx === projectDetailFlow.length - 1
          ? projectDetailFlow[0]['name']
          : projectDetailFlow[selFlow.indx + 1]['name']}
        <ArrowRightIcon className={` w-4 h-4 mt-1 ml-1`} />
      </section>
    </button>
  </div>
</div>










    </div>




     





      

    
    </>





  )
}

export default ProjectDetailsFlowBody
