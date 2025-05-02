/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import SiderForm from '../SiderForm/SiderForm'
import ProjectDocRow from './Docu_row'

export default function ProjectsDocsListView({
  title,
  pId,
  myPhase,
  myBlock,
  projectsList,
  viewLegalDocData,
}) {
  const [existingCols, setexistingCols] = useState([])
  const [selFeature, setFeature] = useState('documents')
  const [sliderInfo, setSliderInfo] = useState({
    open: false,
    title: 'legal_doc',
    sliderData: {},
    widthClass: 'max-w-xl',
  })
  const handleSliderClose = () => {
    setSliderInfo({
      open: false,
      title: '',
      sliderData: {},
      widthClass: 'max-w-xl',
    })
  }

  const initialState = {
    amount: '',
    towardsBankDocId: '',
    mode: 'cheque',
    payto: '',
    bookingSource: '',
    bookedBy: '',
  }

  const validateSchema = Yup.object({})

  return (
    <div className="h-full flex flex-col pb-6 bg-white  overflow-y-scroll overflow-auto no-scrollbar">
      <div className="grid gap-8 grid-cols-1">
        <div className="flex flex-col rounded-lg bg-white mt-">
          <div className="mt-0">
            <Formik
              enableReinitialize={true}
              initialValues={initialState}
              validationSchema={validateSchema}
              onSubmit={(values, { resetForm }) => {}}
            >
              {(formik) => (
                <Form>
                  <div className="form">
                    <section className="  bg-blueGray-50">
                      <div className="w-full mx-auto ">
                        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-[#F9FBFB] border-0">
                          <div className="rounded-t bg-[#F1F5F9] mb-0 px-3 py-2">
                            <div className="flex flex-row justify-between">
                              <div className="flex flex-col justify-between">
                                <p className="text-md font-bold tracking-tight uppercase font-body my-[2px]  ml-2">
                                  {'unit_no'}
                                  ,PHASE-I,
                                </p>
                                <p className="text-md font-bold tracking-tight uppercase font-body my-[2px]  ml-2">
                                  {'projectName'}
                                </p>
                              </div>
                              <div className="text-center items-center mr-2 mt-3">
                                <div className="text-center items-center align-middle text-blue-500 text-xs cursor-pointer hover:underline">
                                  {'status'}
                                </div>
                              </div>
                            </div>
                          </div>
                          {selFeature === 'summary' && (
                            <div className="flex-auto px-2 py-4 ">
                              <section
                                className="bg-[#fff] p-4 rounded-md "
                                style={{
                                  boxShadow: '0 1px 12px #f2f2f2',
                                }}
                              >
                                <h6 className="text-blueGray-400 text-sm mt-3 ml-0 mb-2 font-bold uppercase">
                                  Document Details
                                </h6>
                                <section className="flex flex-col bg-[#F6F7FF] p-3 border border-[#e5e7f8] rounded-md ">
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-700 tracking-wide">
                                      Project
                                    </div>
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      {12000}
                                    </div>
                                  </section>
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-500  tracking-wide">
                                      Phase
                                    </div>
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      {1200}
                                    </div>
                                  </section>
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-500  tracking-wide">
                                      Document Name
                                    </div>
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      {'facing'}
                                    </div>
                                  </section>
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-500  tracking-wide">
                                      Document Category
                                    </div>
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      {'kathaId'}
                                    </div>
                                  </section>
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-500  tracking-wide">
                                      Size
                                    </div>
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      {'kathaId'}
                                    </div>
                                  </section>
                                </section>
                                <section className="flex flex-col bg-[#F6F7FF] p-3 border border-[#e5e7f8] rounded-md mt-3">
                                  <section className="flex flow-row items-baseline justify-between mb-1">
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      Document Name
                                    </div>

                                    <div>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5 inline"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
                                        />
                                      </svg>

                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5 inline ml-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                        />
                                      </svg>
                                    </div>
                                  </section>
                                </section>
                                <section className="flex flex-col bg-[#F6F7FF] p-3 border border-[#e5e7f8] rounded-md mt-3">
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-700 tracking-wide">
                                      Description
                                    </div>
                                  </section>
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      NA
                                    </div>
                                  </section>
                                </section>
                                <section className="flex flex-col bg-[#F6F7FF] p-3 border border-[#e5e7f8] rounded-md mt-3">
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-700 tracking-wide">
                                      Created By
                                    </div>
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      {12000}
                                    </div>
                                  </section>
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-500  tracking-wide">
                                      Owner
                                    </div>
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      {1200}
                                    </div>
                                  </section>
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-500  tracking-wide">
                                      Created
                                    </div>
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      {'facing'}
                                    </div>
                                  </section>
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-500  tracking-wide">
                                      Opened
                                    </div>
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      {'kathaId'}
                                    </div>
                                  </section>
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-500  tracking-wide">
                                      Modified
                                    </div>
                                    <div className="font-md text-xs tracking-wide font-semibold text-slate-900 ">
                                      {'kathaId'}
                                    </div>
                                  </section>
                                </section>
                                <section className="flex flex-col bg-[#F6F7FF] p-3 border border-[#e5e7f8] rounded-md mt-3">
                                  <section className="flex flow-row justify-between mb-1">
                                    <div className="font-md text-xs text-gray-700 tracking-wide">
                                      Access
                                    </div>
                                  </section>
                                </section>

                                <hr className="mt-6 border-b-1 border-blueGray-300" />
                              </section>
                            </div>
                          )}

                          {selFeature === 'timeline' && (
                            <div className="py-8 px-8  border bg-[#F6F7FF]">
                              {[].length == 0 && (
                                <div className="py-8 px-8 flex flex-col items-center">
                                  <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                                    <img
                                      className="w-[80px] h-[80px] inline"
                                      alt=""
                                      src="/templates.svg"
                                    />
                                  </div>
                                  <h3 className="mb-1 text-xs font-semibold text-gray-900 ">
                                    Timeline is Empty
                                  </h3>
                                  <time className="block mb-2 text-xs font-normal leading-none text-gray-400 ">
                                    This scenario is very rare to view
                                  </time>
                                </div>
                              )}
                            </div>
                          )}

                          {selFeature === 'tasks' && (
                            <div className="py-8 px-8 flex flex-col items-center">
                              <div className="font-md font-medium text-xs mb-4 text-gray-800 items-center">
                                <img
                                  className="w-[200px] h-[200px] inline"
                                  alt=""
                                  src="/all-complete.svg"
                                />
                              </div>
                              <h3 className="mb-1 text-sm font-semibold text-gray-900 ">
                                You are clean
                              </h3>
                              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                                Sitback & Relax{' '}
                                <span className="text-blue-600">Add Task</span>
                              </time>
                            </div>
                          )}
                          {selFeature === 'documents' && (
                            <section className="bg-white w-full md:px-10 md:mb-20">
                              <div className="max-w-3xl mx-auto py-4 text-sm text-gray-700">
                                <div className="flex p-4 items-center justify-between">
                                  <div className="flex flex-row">
                                    <h2 className="font-medium flex-grow">
                                      Unit Document
                                    </h2>
                                    1000
                                  </div>
                                  <p className="mr4">Date Created</p>
                                </div>
                              </div>
                              {[
                                { id: 1234, name: 'EC', time: '22-Nov-2022' },
                                {
                                  id: 1235,
                                  name: 'Agreement',
                                  time: '24-Nov-2022',
                                },
                                {
                                  id: 1236,
                                  name: 'Register Doc',
                                  time: '2-Dec-2022',
                                },
                              ].length === 0 ? (
                                <div className="w-full text-center py-5">
                                  No documents
                                </div>
                              ) : (
                                ''
                              )}
                              {[
                                { id: 1234, name: 'EC', time: '22-Nov-2022' },
                                {
                                  id: 1235,
                                  name: 'Agreement',
                                  time: '24-Nov-2022',
                                },
                                {
                                  id: 1236,
                                  name: 'Register Doc',
                                  time: '2-Dec-2022',
                                },
                              ]?.map((doc, i) => (
                                <section
                                  key={i}
                                  onClick={() => {
                                    setSliderInfo({
                                      open: true,
                                      title: 'viewDocx',
                                      sliderData: {},
                                      widthClass: 'max-w-xl',
                                    })
                                  }}
                                >
                                  <ProjectDocRow
                                    id={doc?.id}
                                    fileName={doc?.name}
                                    date={doc?.time}
                                  />
                                </section>
                              ))}
                            </section>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <SiderForm
        open={sliderInfo.open}
        setOpen={handleSliderClose}
        title={sliderInfo.title}
        data={sliderInfo.sliderData}
        widthClass={sliderInfo.widthClass}
        pId={pId}
        phaseDetails={myPhase}
      />
    </div>
  )
}
