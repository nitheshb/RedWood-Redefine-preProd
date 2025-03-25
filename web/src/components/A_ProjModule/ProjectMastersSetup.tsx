/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { useAuth } from 'src/context/firebase-auth-context'
import EditableTable from '../comps/EditableComp'
import SiderForm from '../SiderForm/SiderForm'
import MastersEditableTable from '../comps/MastersEditableComp'
import TermsConditionsEditableTable from '../comps/TermsConditionsEditableComp'

const ProjectMastersSetupHome = ({ title, pId, data }) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()
  const [isOpenSideView, setIsOpenSideView] = useState(false)
  const [testPhNo, setTestPhNo] = useState('')
  const [wbSelPayload, setWbSelPayload] = useState({})
  const [selCat, setSelCat] = useState('Apartment')

  const [sliderInfo, setSliderInfo] = useState({
    open: false,
    title: 'Bank Account',
    sliderData: {},
    widthClass: 'max-w-xl',
  })

  const phKeyFieldFun = (e) => {
    setTestPhNo(e.target.value)
  }
  const triggerWhatsAppFun = (data) => {
    setIsOpenSideView(true)

    console.log('i was here', data, isOpenSideView)
    const { event } = data
    const payload = {
      event: event,
      target: 'customer',
      type: 'wa',
      scope: 'allProjects',
    }

    setWbSelPayload(payload)
  }

  const triggerEmailFun = (txt) => {}

  return (
    <>
       <div className="flex justify-between items-center mb-6">
          {/* <div>
            <h1 className="text-2xl text-[#33475B]  font-semibold mb-2">Masters Setup</h1>
            <p className="text-gray-600">This area is usually used to setting up values for the dropdowns and other resuable options</p>
          </div> */}

<div className="flex flex-col">
  
  <div className="flex items-center gap-2">
    <img
      src="/iconheading.svg"
      alt="Icon Heading"
      width={30} 
      height={30}
    />
    <h1 className="text-2xl text-[#33475B] font-semibold">
      Masters Setup
    </h1>
  </div>


  <p className="text-gray-600 ml-10">
    This area is usually used to set up values for the dropdowns and other reusable options.
  </p>
</div>

        </div>


      <div className="flex items-center space-x-1 mb-6 border-b">
          {[
           { label: 'Apartment', value: 'Apartment' },
           { label: 'Plot', value: 'Plots' },
           { label: 'Villa', value: 'Villas' },
           { label: 'Weekend Villas', value: 'WeekendVillas' },
           { label: 'Terms & Conditions', value: 'TermsConditions' },
           { label: 'Masters', value: 'Masters' },


        ].map((data, i) => (
            <button
              key={i}
              onClick={() =>     setSelCat(data.value)}
              className={`px-4 py-2 ${
                selCat === data.value
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
               <span
                  className={`flex items-center   text-sm   ${
                    selCat === data.value
                      ? 'font-semibold text-green-800 '
                      : 'font-medium text-black-100 '
                  }  rounded-full`}
                >
                  {/* <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" /> */}
                  <img alt="" src="/temp2.png" className="h-5 w-5 mr-1" />
                  {data?.label}
                </span>
            </button>
          ))}
        </div>
      {selCat === 'Apartment' && (
        <div className="w-full   flex-row">
          <section className="m-4 inline-block">
            <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
              <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                {`${selCat} Cost Setup Templete`}
              </h2>
              <EditableTable type={'Apartment'} source={'Masters'} />
            </div>
          </section>
        </div>
      )}
       {selCat === 'TermsConditions' && (
        <div className="w-full   flex-row">
          <section className="m-4 inline-block">
            <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
              <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                {`${selCat} Setup`}
              </h2>
              <TermsConditionsEditableTable type={'TermsConditions'} />
            </div>
          </section>
        </div>
      )}
       {selCat === 'Masters' && (
        <div className="w-full   flex-row">
          <section className="m-4 inline-block">
            <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
              <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                {`${selCat} Setup`}
              </h2>
              <MastersEditableTable type={'Masters'} source={'Masters'} />
            </div>
          </section>
        </div>
      )}
      {selCat === 'Plots' && (
        <div className="w-full   flex-row">
          <section className="m-4 inline-block">
            <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
              <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                {`${selCat} Cost Setup Templete`}
              </h2>
              <EditableTable type={'Plots'} source={'Masters'} />
            </div>
          </section>
        </div>
      )}
        {selCat === 'Villas' && (
        <div className="w-full   flex-row">
          <section className="m-4 inline-block">
            <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
              <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                {`${selCat} Cost Setup Templete`}
              </h2>
              <EditableTable type={'Villas'} source={'Masters'} />
            </div>
          </section>
        </div>
      )}
      {selCat === 'WeekendVillas' && (
        <div className="w-full   flex-row">
          <section className="m-4 inline-block">
            <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
              <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                {`${selCat} Cost Setup Templete`}
              </h2>
              <EditableTable type={'WeekendVillas'}  source={'Masters'}/>
            </div>
          </section>
        </div>
      )}


      <SiderForm
        open={isOpenSideView}
        setOpen={setIsOpenSideView}
        title={'Notification Setup'}
        widthClass="max-w-2xl"
        wbPayload={wbSelPayload}
      />
    </>
  )
}

export default ProjectMastersSetupHome
