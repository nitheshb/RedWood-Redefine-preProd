/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from 'react'

import { PlusCircleIcon, TrashIcon } from '@heroicons/react/outline'
import PencilIcon from '@heroicons/react/solid/PencilIcon'
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone'
import { useSnackbar } from 'notistack'

import { sourceListItems } from 'src/constants/projects'
import {
  deleteBankAccount,
  steamBankDetailsList,
  steamVirtualAccountsList,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { sendWhatAppTextSms1 } from 'src/util/axiosWhatAppApi'

import EditableTable from '../comps/EditableComp'
import SiderForm from '../SiderForm/SiderForm'

import SourceAddTemplate from './SourceAddTemplate'
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
      <div className="flex overflow-x-auto ml-2  border-b pb-2">
        <section className="mt-4">Templates</section>
        {[
          { label: 'Apartment', value: 'Apartment' },
          { label: 'Plot', value: 'Plots' },
          { label: 'Villa', value: 'Villas' },
          { label: 'Weekend Villas', value: 'WeekendVillas' },
          { label: 'Terms & Conditions', value: 'TermsConditions' },
          { label: 'Masters', value: 'Masters' },

        ].map((data, i) => {
          return (
            <section
              key={i}
              className="flex  mt-[18px]"
              onClick={() => {
                console.log('am i clicked', data.value)
                setSelCat(data.value)
              }}
            >
              <button>
                <span
                  className={`flex ml-2 items-center h-[30] py-1 px-3 text-sm   ${
                    selCat === data.value
                      ? 'font-semibold text-green-800 bg-[#FFEDEA]'
                      : 'font-medium text-black-100 bg-[#f0f8ff]'
                  }  rounded-full`}
                >
                  {/* <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" /> */}
                  <img alt="" src="/temp2.png" className="h-5 w-5 mr-1" />
                  {data?.label}
                </span>
              </button>
            </section>
          )
        })}
      </div>
      {selCat === 'Apartment' && (
        <div className="w-full   flex-row">
          <section className="m-4 inline-block">
            <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
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
            <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
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
            <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
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
            <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
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
            <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
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
            <div className="bg-[#FFEDEA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
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
