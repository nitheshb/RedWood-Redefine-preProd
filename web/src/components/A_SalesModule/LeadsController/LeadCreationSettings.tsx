/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react'
import { useAuth } from 'src/context/firebase-auth-context'

import { CheckCircle, XCircle } from 'lucide-react'

const LeadCreationSettings = ({

}) => {
  const { user } = useAuth()
  const { orgId } = user

  const [uniqueLeadPh, setUniqueLeadPh]= useState(true)
  const [uniqueLeadPhPI, setUniqueLeadPhPI]= useState(true)

  return (
    <div className="bg-white  py-4  px-4 md:px-4 xl:px-6 rounded font-[Outfit] ">
    <section className='shadow-[0_0_0_1px_rgba(0,0,0,0.08)]  border-[0.5px] rounded-md  p-4'>
      <div className='flex flex-col space-y-1.5 p-6'>
          <div className='text-[#171717] text-lg  font-[Outfit] font-semibold leading-none tracking-tight'>Lead Creation Settings</div>
          {/* <span className='text-sm text-[#71717a] font-[Outfit]'>This settings will be applied on Add lead & Import Lead</span> */}
      </div>

      <div className='flex flex-col space-y-1.5 p-6 pt-0'>

          <section className=' border-b border-[#F3F2F9] pb-4'>
            <div  className="flex items-center justify-between">
                <div>Allow only one lead per phone number to avoid duplicates.
                </div>
                   <button
                    onClick={() => setUniqueLeadPh(!uniqueLeadPh)}
                    className={`ml-3 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      uniqueLeadPh
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                    aria-pressed={uniqueLeadPh}
                  >
                    <span className="sr-only">Toggle user status</span>
                    <span
                      className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        uniqueLeadPh
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    >
                      <span
                        className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                          uniqueLeadPh
                            ? 'opacity-0 duration-100 ease-out'
                            : 'opacity-100 duration-200 ease-in'
                        }`}
                        aria-hidden="true"
                      >
                        <XCircle size={12} className="text-gray-400" />
                      </span>
                      <span
                        className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                          uniqueLeadPh
                            ? 'opacity-100 duration-200 ease-in'
                            : 'opacity-0 duration-100 ease-out'
                        }`}
                        aria-hidden="true"
                      >
                        <CheckCircle
                          size={12}
                          className="text-blue-600"
                        />
                      </span>
                    </span>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-[3px]">
                <span
                  className={` inline-flex text-xs leading-5 font-normal rounded-full text-[#71717a]


                    `
                  }
                >
                  {uniqueLeadPh ? 'Creation of multiple leads using the same phone number is blocked now  ' : 'Creation of multiple leads using the same phone number is allowed'}
                </span>



              </div>
          </section>
          <section className=' border-b border-[#F3F2F9] pb-4 pt-2'>
            <div  className="flex items-center justify-between">
                <div>Allow only one lead per phone number with in each project to avoid duplicates.</div>
                   <button
                    onClick={() => setUniqueLeadPhPI(!uniqueLeadPhPI)}
                    className={`ml-3 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      uniqueLeadPhPI
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                    aria-pressed={uniqueLeadPhPI}
                  >
                    <span className="sr-only">Toggle user status</span>
                    <span
                      className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        uniqueLeadPhPI
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    >
                      <span
                        className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                          uniqueLeadPhPI
                            ? 'opacity-0 duration-100 ease-out'
                            : 'opacity-100 duration-200 ease-in'
                        }`}
                        aria-hidden="true"
                      >
                        <XCircle size={12} className="text-gray-400" />
                      </span>
                      <span
                        className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                          uniqueLeadPhPI
                            ? 'opacity-100 duration-200 ease-in'
                            : 'opacity-0 duration-100 ease-out'
                        }`}
                        aria-hidden="true"
                      >
                        <CheckCircle
                          size={12}
                          className="text-blue-600"
                        />
                      </span>
                    </span>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-[4px]">
                <span
                  className={` inline-flex text-xs leading-5 font-normal rounded-full text-[#71717a]


                    `
                  }
                >
                  {uniqueLeadPhPI ? 'Creation of multiple leads using the same phone number within a each project is blocked now  ' : 'Creation of multiple leads using the same phone number within a each project is allowed now '}
                </span>



              </div>
          </section>
      </div>
    </section>
  </div>
  )
}
export default LeadCreationSettings
