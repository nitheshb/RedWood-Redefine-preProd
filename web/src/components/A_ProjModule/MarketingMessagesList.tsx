/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react'
import PencilIcon from '@heroicons/react/solid/PencilIcon'
import { useSnackbar } from 'notistack'
import { sourceListItems } from 'src/constants/projects'
import { useAuth } from 'src/context/firebase-auth-context'
import SiderForm from '../SiderForm/SiderForm'
import SourceAddTemplate from './SourceAddTemplate'
const MarkeingMessagesList = ({ title, pId, data }) => {
  const { user } = useAuth()
  const { orgId } = user
  const { enqueueSnackbar } = useSnackbar()
  const [isOpenSideView, setIsOpenSideView] = useState(false)
  const [testPhNo, setTestPhNo] = useState('')
  const [wbSelPayload, setWbSelPayload] = useState({})
  const [selCat, setSelCat] = useState('enquiry_journey_status')

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
      <div className="">
        {/* 
<div className="fixed top-1 right-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <svg
          className="absolute right-0 top-0 h-full w-[400px]"
          preserveAspectRatio="none"
          viewBox="0 0 510 832"
        >
          <path
            d="M365.868 0.000541687C481.144 -73.4421 715.868 0.000541687 715.868 0.000541687V850.001C715.868 850.001 119.675 1044.5 26.3676 850.001C-66.94 655.501 105.429 503.664 261.73 442.481C415.319 382.36 216.15 95.3857 365.868 0.000541687Z"
            fill="#FCF4EB"
          ></path>
        </svg>
      </div> */}

        <div className="relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
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
                  This area is usually used to set up values for the dropdowns
                  and other reusable options.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 mb-6 border-b">
              {[
                {
                  label: 'Enquiry Journey Status',
                  value: 'enquiry_journey_status',
                },
                { label: 'CRM', value: 'CRM_status' },
                { label: 'Legal', value: 'Legal_status' },
                { label: 'Finance', value: 'Finance_status' },
                { label: 'HR', value: 'hr_status' },
                { label: 'Sources', value: 'source' },
              ].map((data, i) => (
                <button
                  key={i}
                  onClick={() => setSelCat(data.value)}
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
            {selCat === 'source' && (
              <div className="w-full   flex-row">
                <section className="m-4 inline-block">
                  <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200">
                    <h2 className="text-sm font-semibold pb-2  border-grey">
                      {'Source List'}
                    </h2>
                    <SourceAddTemplate phase={{}} source={sourceListItems} />
                    <table className="w-full whitespace-nowrap">
                      <thead>
                        <tr className="border-b">
                          <th></th>
                          <th className="text-left p-[10px] pr-[12px] pl-0 text-xs text-green-800 ">
                            Source Name
                          </th>
                          <th className="text-center p-[10px] pl-[20px] text-xs text-green-800">
                            {' '}
                            Tags List
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sourceListItems.map((data, i) => {
                          return (
                            <tr key={i} className="mt-4">
                              <td className=" w-[34px]">
                                <div className="ml-5">
                                  <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center text-xs relative">
                                    {i + 1}
                                    {')'}
                                  </div>
                                </div>
                              </td>
                              <td className="py-2 pr-2  font-medium text-xs leading-6  whitespace-nowrap">
                                {data.label}
                              </td>
                              <td className="ml-2 pl-6">
                                {data.rep.map((d, i) => (
                                  <span
                                    key={i}
                                    className=" items-center cursor-pointer h-6  text-xs  text-green-800"
                                  >
                                    {d}
                                    {','}
                                  </span>
                                ))}
                              </td>

                              <td className="ml-2 pl-6">
                                <span
                                  className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                  onClick={() => {
                                    triggerWhatsAppFun(data)
                                  }}
                                >
                                  <img
                                    className="w-[25px] h-[25px] inline mr-"
                                    alt=""
                                    src="/wa3.png"
                                  />
                                </span>
                                <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                  <img
                                    className="w-[20px] h-[20px] inline mr-2"
                                    alt=""
                                    src="/g1.png"
                                  />
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}
            {selCat === 'enquiry_journey_status' && (
              <>
                <div className="w-full   flex-row">
                  <section className="m-4 inline-block">
                    <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200">
                      <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                        {'Sales Executive Notifications'}
                      </h2>
                      <table className="w-full whitespace-nowrap">
                        <thead>
                          <tr className="border-b">
                            <th></th>
                            <th className="text-left p-[10px] pr-[12px] pl-0 text-xs text-green-800 ">
                              Event
                            </th>
                            <th className="text-center p-[10px] pl-[20px] text-xs text-green-800">
                              {' '}
                              Customer
                            </th>
                            <th className="text-center p-[10px] text-xs text-green-800">
                              Sales Executive
                            </th>
                            <th className="text-center p-[10px] text-xs text-green-800">
                              Sales Manager
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              btnTxt: 'On Enquiry',
                              target: 'customer',
                              event: 'on_enquiry',
                            },
                            {
                              btnTxt: 'Lead Assigned',
                              target: 'customer',
                              event: 'on_lead_assign',
                            },
                            {
                              btnTxt: 'Lead Re-Assigned',
                              target: 'customer',
                              event: 'on_reassign',
                            },
                            {
                              btnTxt: 'On Site Visit fix',
                              target: 'customer',
                              event: 'on_sitevisit_fix',
                            },
                            {
                              btnTxt: 'On Site Visit Reschedule',
                              target: 'customer',
                              event: 'on_sitevisit_reschedule',
                            },
                            {
                              btnTxt: 'On Site Visit Cancellation',
                              target: 'customer',
                              event: 'on_sitevisit_cancel',
                            },
                            {
                              btnTxt: 'On Site Visit Completion',
                              target: 'customer',
                              event: 'on_sitevisit_done',
                            },
                            {
                              btnTxt: 'On Lead Not-Interested',
                              target: 'customer',
                              event: 'on_not_interested',
                            },
                            {
                              btnTxt: 'On Booking',
                              target: 'customer',
                              event: 'on_booking',
                            },
                          ].map((data, i) => (
                            <tr key={i} className="mt-4">
                              <td className=" w-[34px]">
                                <div className="ml-5">
                                  <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center text-xs relative">
                                    {i + 1}
                                  </div>
                                </div>
                              </td>
                              <td className="py-2 pr-2  font-medium text-xs leading-6  whitespace-nowrap">
                                {data.btnTxt}
                              </td>
                              <td className="ml-2 pl-6">
                                <span
                                  className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                  onClick={() => {
                                    console.log('iw as clicked')
                                    triggerWhatsAppFun(data)
                                  }}
                                >
                                  <img
                                    className="w-[25px] h-[25px] inline mr-"
                                    alt=""
                                    src="/wa3.png"
                                  />
                                </span>
                                <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                  <img
                                    className="w-[20px] h-[20px] inline mr-2"
                                    alt=""
                                    src="/g1.png"
                                  />
                                </span>
                              </td>

                              <td className="ml-2 pl-6">
                                <span
                                  className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                  onClick={() => {
                                    triggerWhatsAppFun(data)
                                  }}
                                >
                                  <img
                                    className="w-[25px] h-[25px] inline mr-"
                                    alt=""
                                    src="/wa3.png"
                                  />
                                </span>
                                <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                  <img
                                    className="w-[20px] h-[20px] inline mr-2"
                                    alt=""
                                    src="/g1.png"
                                  />
                                </span>
                              </td>
                              <td className="ml-2 pl-6">
                                <span
                                  className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                  onClick={() => {
                                    triggerWhatsAppFun(data)
                                  }}
                                >
                                  <img
                                    className="w-[25px] h-[25px] inline mr-"
                                    alt=""
                                    src="/wa3.png"
                                  />
                                </span>
                                <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                  <img
                                    className="w-[20px] h-[20px] inline mr-2"
                                    alt=""
                                    src="/g1.png"
                                  />
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </>
            )}

            {selCat === 'CRM_status' && (
              <div className="w-full   flex-row">
                <section className="m-4 inline-block">
                  <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200">
                    <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                      {'CRM Notifications'}
                    </h2>
                    <table className="w-full whitespace-nowrap">
                      <thead>
                        <tr className="border-b">
                          <th></th>
                          <th className="text-left p-[10px] pr-[12px] pl-0 text-xs text-green-800 ">
                            Event
                          </th>
                          <th className="text-center p-[10px] pl-[20px] text-xs text-green-800">
                            {' '}
                            CRM Customer
                          </th>
                          <th className="text-center p-[10px] text-xs text-green-800">
                            CRM Executive
                          </th>
                          <th className="text-center p-[10px] text-xs text-green-800">
                            CRM Manager
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            btnTxt: 'On Booking',
                            target: 'customer',
                            event: 'on_booking',
                          },

                          {
                            btnTxt: 'On Payment',
                            target: 'customer',
                            event: 'on_payment',
                          },
                          {
                            btnTxt: 'On Customer Assign',
                            target: 'customer',
                            event: 'on_customer_assign',
                          },
                          {
                            btnTxt: 'On Construction Update',
                            target: 'customer',
                            event: 'on_construction_update',
                          },
                          {
                            btnTxt: 'On Payment Approval',
                            target: 'customer',
                            event: 'on_payment_approval',
                          },
                          {
                            btnTxt: 'On Payment Rejected',
                            target: 'customer',
                            event: 'on_payment_rejected',
                          },

                          {
                            btnTxt: 'On Payment Request',
                            target: 'customer',
                            event: 'on_payment_request',
                          },
                          {
                            btnTxt: 'On Payment Receival',
                            target: 'customer',
                            event: 'on_payment_receival',
                          },
                          {
                            btnTxt: 'On Payment Accepted',
                            target: 'customer',
                            event: 'on_payment_accepted',
                          },
                          {
                            btnTxt: 'On CostSheet Approval',
                            target: 'customer',
                            event: 'on_costsheet_approval',
                          },
                          {
                            btnTxt: 'On Deletion',
                            target: 'customer',
                            event: 'on_deletion',
                          },
                        ].map((data, i) => (
                          <tr key={i} className="mt-4">
                            <td className=" w-[34px]">
                              <div className="ml-5">
                                <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center text-xs relative">
                                  {i + 1}
                                </div>
                              </div>
                            </td>
                            <td className="py-2 pr-2  font-medium text-xs leading-6  whitespace-nowrap">
                              {data.btnTxt}
                            </td>
                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   console.log('iw as clicked')
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>

                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>
                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {selCat === 'Finance_status' && (
              <div className="w-full   flex-row">
                <section className="m-4 inline-block">
                  <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
                    <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                      {'Finance Notifications'}
                    </h2>
                    <table className="w-full whitespace-nowrap">
                      <thead>
                        <tr className="border-b">
                          <th></th>
                          <th className="text-left p-[10px] pr-[12px] pl-0 text-xs text-green-800 ">
                            Event
                          </th>
                          <th className="text-center p-[10px] pl-[20px] text-xs text-green-800">
                            {' '}
                            Legal Team
                          </th>
                          <th className="text-center p-[10px] text-xs text-green-800">
                            Finance Executive
                          </th>
                          <th className="text-center p-[10px] text-xs text-green-800">
                            Finance Manager
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            btnTxt: 'On Enquiry Receival',
                            target: 'customer',
                            event: 'on_enquiry_receival',
                          },
                          {
                            btnTxt: 'On Sales Agent Assign',
                            target: 'customer',
                            event: 'on_sales_agent_assign',
                          },
                          {
                            btnTxt: 'Finance Customer',
                            target: 'customer',
                            event: 'on_finance_customer',
                          },
                          {
                            btnTxt: 'On Site Visit Fix',
                            target: 'customer',
                            event: 'on_site_visit_fix',
                          },
                          {
                            btnTxt: 'On Site Visit Completion',
                            target: 'customer',
                            event: 'on_site_visit_completion',
                          },
                          {
                            btnTxt: 'On Not Interested',
                            target: 'customer',
                            event: 'on_not_interested',
                          },
                          {
                            btnTxt: 'On Booking',
                            target: 'customer',
                            event: 'on_booking',
                          },
                          {
                            btnTxt: 'On Payment Request',
                            target: 'customer',
                            event: 'on_payment_request',
                          },
                          {
                            btnTxt: 'On Payment Receival',
                            target: 'customer',
                            event: 'on_payment_receival',
                          },
                          {
                            btnTxt: 'On Payment Accepted',
                            target: 'customer',
                            event: 'on_payment_accepted',
                          },
                          {
                            btnTxt: 'On CostSheet Approval',
                            target: 'customer',
                            event: 'on_costsheet_approval',
                          },
                        ].map((data, i) => (
                          <tr key={i} className="mt-4">
                            <td className=" w-[34px]">
                              <div className="ml-5">
                                <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center text-xs relative">
                                  {i + 1}
                                </div>
                              </div>
                            </td>
                            <td className="py-2 pr-2  font-medium text-xs leading-6  whitespace-nowrap">
                              {data.btnTxt}
                            </td>
                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   console.log('iw as clicked')
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>

                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>
                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {selCat === 'Legal_status' && (
              <div className="w-full   flex-row">
                <section className="m-4 inline-block">
                  <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200 ">
                    <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                      {'Legal Notifications'}
                    </h2>
                    <table className="w-full whitespace-nowrap">
                      <thead>
                        <tr className="border-b">
                          <th></th>
                          <th className="text-left p-[10px] pr-[12px] pl-0 text-xs text-green-800 ">
                            Event
                          </th>
                          <th className="text-center p-[10px] pl-[20px] text-xs text-green-800">
                            {' '}
                            Customer
                          </th>
                          <th className="text-center p-[10px] text-xs text-green-800">
                            Manager
                          </th>
                          <th className="text-center p-[10px] text-xs text-green-800">
                            Sales Executive
                          </th>
                          <th className="text-center p-[10px] text-xs text-green-800">
                            Administrator
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            btnTxt: 'On Booking',
                            target: 'customer',
                            event: 'on_booking',
                          },
                          {
                            btnTxt: 'On Payment',
                            target: 'customer',
                            event: 'on_payment',
                          },
                          {
                            btnTxt: 'On Testing',
                            target: 'customer',
                            event: 'on_testing',
                          },
                          {
                            btnTxt: 'On Lead Assign',
                            target: 'customer',
                            event: 'on_lead_assign',
                          },
                          {
                            btnTxt: 'On Creation',
                            target: 'customer',
                            event: 'on_creation',
                          },
                          {
                            btnTxt: 'On Assignment',
                            target: 'customer',
                            event: 'on_assignment',
                          },
                          {
                            btnTxt: 'On Transfer',
                            target: 'customer',
                            event: 'on_transfer',
                          },
                          {
                            btnTxt: 'On De-assignment',
                            target: 'customer',
                            event: 'on_de_assignment',
                          },
                          {
                            btnTxt: 'On Next Follow Up',
                            target: 'customer',
                            event: 'on_next_follow_up',
                          },
                          {
                            btnTxt: 'On Delete Follow Up',
                            target: 'customer',
                            event: 'on_delete_follow_up',
                          },
                          {
                            btnTxt: 'On Cancel',
                            target: 'customer',
                            event: 'on_cancel',
                          },
                          {
                            btnTxt: 'On Complete',
                            target: 'customer',
                            event: 'on_complete',
                          },
                          {
                            btnTxt: 'On Update',
                            target: 'customer',
                            event: 'on_update',
                          },
                          {
                            btnTxt: 'On Transfer Charge',
                            target: 'customer',
                            event: 'on_transfer_charge',
                          },
                          {
                            btnTxt: 'On Block',
                            target: 'customer',
                            event: 'on_block',
                          },
                          {
                            btnTxt: 'On Payment Request',
                            target: 'customer',
                            event: 'on_payment_request',
                          },
                          {
                            btnTxt: 'On Payment Receival',
                            target: 'customer',
                            event: 'on_payment_receival',
                          },
                          {
                            btnTxt: 'On Delete Info',
                            target: 'customer',
                            event: 'on_delete_info',
                          },
                          {
                            btnTxt: 'On Status Change',
                            target: 'customer',
                            event: 'on_status_change',
                          },
                          {
                            btnTxt: 'On Re-assignment',
                            target: 'customer',
                            event: 'on_re_assignment',
                          },
                          {
                            btnTxt: 'On First Follow Up',
                            target: 'customer',
                            event: 'on_first_follow_up',
                          },
                          {
                            btnTxt: 'On Dead Status',
                            target: 'customer',
                            event: 'on_dead_status',
                          },
                          {
                            btnTxt: 'Bring To Live',
                            target: 'customer',
                            event: 'bring_to_live',
                          },
                          {
                            btnTxt: 'On Delete Booking',
                            target: 'customer',
                            event: 'on_delete_booking',
                          },
                          {
                            btnTxt: 'On Cancel Booking',
                            target: 'customer',
                            event: 'on_cancel_booking',
                          },
                          {
                            btnTxt: 'On Initialize Approve Reject',
                            target: 'customer',
                            event: 'on_initialize_approve_reject',
                          },
                          {
                            btnTxt: 'On Delete',
                            target: 'customer',
                            event: 'on_delete',
                          },
                          {
                            btnTxt: 'On Refund Pay',
                            target: 'customer',
                            event: 'on_refund_pay',
                          },
                          {
                            btnTxt: 'On Prepone',
                            target: 'customer',
                            event: 'on_prepone',
                          },
                          {
                            btnTxt: 'On Postpone',
                            target: 'customer',
                            event: 'on_postpone',
                          },
                          {
                            btnTxt: 'On Delete Payment',
                            target: 'customer',
                            event: 'on_delete_payment',
                          },
                          {
                            btnTxt: 'On Refund Delete',
                            target: 'customer',
                            event: 'on_refund_delete',
                          },
                        ].map((data, i) => (
                          <tr key={i} className="mt-4">
                            <td className=" w-[34px]">
                              <div className="ml-5">
                                <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center text-xs relative">
                                  {i + 1}
                                </div>
                              </div>
                            </td>
                            <td className="py-2 pr-2  font-medium text-xs leading-6  whitespace-nowrap">
                              {data.btnTxt}
                            </td>
                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   console.log('iw as clicked')
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>

                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>
                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>
                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {selCat === 'hr_status' && (
              <div className="w-full   flex-row">
                <section className="m-4 inline-block">
                  <div className="bg-[#F5F8FA] p-4 rounded-xl shadow-md shadow-neutral-200">
                    <h2 className="text-sm font-semibold pb-2 border-b border-grey">
                      {'Hr Notifications'}
                    </h2>
                    <table className="w-full whitespace-nowrap">
                      <thead>
                        <tr className="border-b">
                          <th></th>
                          <th className="text-left p-[10px] pr-[12px] pl-0 text-xs text-green-800 ">
                            Event
                          </th>
                          <th className="text-center p-[10px] pl-[20px] text-xs text-green-800">
                            {' '}
                            Employee
                          </th>
                          <th className="text-center p-[10px] text-xs text-green-800">
                            HR Manager
                          </th>
                          <th className="text-center p-[10px] text-xs text-green-800">
                            Department Head
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            btnTxt: 'On Assignment',
                            target: 'hr_team',
                            event: 'on_assignment',
                          },
                          {
                            btnTxt: 'On Re-assignment',
                            target: 'hr_team',
                            event: 'on_re_assignment',
                          },
                          {
                            btnTxt: 'On Probation Completion',
                            target: 'hr_team',
                            event: 'on_probation_complete',
                          },
                          {
                            btnTxt: 'On Resignation',
                            target: 'hr_team',
                            event: 'on_resignation',
                          },
                          {
                            btnTxt: 'On Termination',
                            target: 'hr_team',
                            event: 'on_termination',
                          },
                          {
                            btnTxt: 'On Leave Request',
                            target: 'hr_team',
                            event: 'on_leave_request',
                          },
                          {
                            btnTxt: 'On Leave Approval',
                            target: 'hr_team',
                            event: 'on_leave_approval',
                          },
                          {
                            btnTxt: 'On Leave Rejection',
                            target: 'hr_team',
                            event: 'on_leave_rejection',
                          },
                          {
                            btnTxt: 'On Dead Status',
                            target: 'hr_team',
                            event: 'on_dead_status',
                          },
                          {
                            btnTxt: 'On Salary Processed',
                            target: 'hr_team',
                            event: 'on_salary_processed',
                          },
                          {
                            btnTxt: 'On Bonus/Incentive Approval',
                            target: 'hr_team',
                            event: 'on_bonus_approval',
                          },
                          {
                            btnTxt: 'On Expense Reimbursement',
                            target: 'hr_team',
                            event: 'on_expense_reimbursement',
                          },
                          {
                            btnTxt: 'On Training Assignment',
                            target: 'hr_team',
                            event: 'on_training_assignment',
                          },
                          {
                            btnTxt: 'On Compliance Review',
                            target: 'hr_team',
                            event: 'on_compliance_review',
                          },
                        ].map((data, i) => (
                          <tr key={i} className="mt-4">
                            <td className=" w-[34px]">
                              <div className="ml-5">
                                <div className="rounded-sm h-5 w-5 flex flex-shrink-0 justify-center items-center text-xs relative">
                                  {i + 1}
                                </div>
                              </div>
                            </td>
                            <td className="py-2 pr-2  font-medium text-xs leading-6  whitespace-nowrap">
                              {data.btnTxt}
                            </td>
                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   console.log('iw as clicked')
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>

                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>
                            <td className="ml-2 pl-6">
                              <span
                                className=" ml-2 items-center cursor-pointer text-xs  text-green-800"
                                // onClick={() => {
                                //   triggerWhatsAppFun(data)
                                // }}
                              >
                                <img
                                  className="w-[25px] h-[25px] inline mr-"
                                  alt=""
                                  src="/wa3.png"
                                />
                              </span>
                              <span className=" items-center cursor-pointer h-6 px-3 text-xs  text-green-800">
                                <img
                                  className="w-[20px] h-[20px] inline mr-2"
                                  alt=""
                                  src="/g1.png"
                                />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}
          </div>

          <SiderForm
            open={isOpenSideView}
            setOpen={setIsOpenSideView}
            title={'Notification Setup'}
            widthClass="max-w-2xl"
            wbPayload={wbSelPayload}
          />
        </div>
      </div>
    </>
  )
}

export default MarkeingMessagesList
