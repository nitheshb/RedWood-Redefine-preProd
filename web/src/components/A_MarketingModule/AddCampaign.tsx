/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from 'react'
import { CalendarIcon } from '@heroicons/react/outline'
import { FireIcon } from '@heroicons/react/solid'
import { setHours, setMinutes } from 'date-fns'
import { Form, Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'

import {
  sourceList,
} from 'src/constants/projects'
import {
  addCampaign,
  checkIfCampaignAlreadyExists,
  getAllProjects,
  steamUsersList,
  updateCampaign,
} from 'src/context/dbQueryFirebase'
import { useAuth } from 'src/context/firebase-auth-context'
import { CustomSelect } from 'src/util/formFields/selectBoxField'
import { CustomSelectNew } from 'src/util/formFields/selectBoxFieldNew'
import { TextField } from 'src/util/formFields/TextField'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'

const people = [
  { name: 'Priority 1' },
  { name: 'Priority 2' },
  { name: 'Priority 3' },
  { name: 'Priority 4' },
]

const AddCampaignForm = ({ mode, dialogOpen, campaignPaylaod }) => {
  const { user } = useAuth()
  const { orgId } = user
  const d = new window.Date()
  const [fetchedUsersList, setfetchedUsersList] = useState([])
  const [usersList, setusersList] = useState([])
  const [projectList, setprojectList] = useState([])
  const [startDate, setStartDate] = useState(setHours(setMinutes(d, 30), 16))
  const [endDate, setEndDate] = useState(setHours(setMinutes(d, 30), 16))

  const [selected1, setSelected1] = useState(people[0])
  const [prior, setPrior] = useState(false)
  const [userIs, setUser] = useState(user)
  useEffect(() => {
    const usrObj = user
    usrObj.label = user.displayName || user.name
    usrObj.value = user.uid
    setUser(usrObj)
    const unsubscribe = steamUsersList(
      orgId,
      (querySnapshot) => {
        const usersListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setfetchedUsersList(usersListA)
        usersListA.map((user) => {
          user.label = user.displayName || user.name
          user.value = user.uid
          user.dept = user?.roles[0]
        })
        console.log('fetched users list is', usersListA)

        setusersList(usersListA)
      },
      () => setfetchedUsersList([])
    )

    return unsubscribe
  }, [])
  useEffect(() => {
    const unsubscribe = getAllProjects(
      orgId,
      (querySnapshot) => {
        const projectsListA = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setfetchedUsersList(projectsListA)
        projectsListA.map((user) => {
          user.label = user.projectName
          user.value = user.projectName
        })
        console.log('fetched users list is', projectsListA)
        setprojectList(projectsListA)
      },
      () => setfetchedUsersList([])
    )

    return unsubscribe
  }, [])



  const devTypeA = [
    {
      name: 'Outright',
      img: '/apart.svg',
    },
    {
      name: 'Joint',
      img: '/apart1.svg',
    },
  ]
  const [takTitle, setTakTitle] = useState('')

  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [selected, setSelected] = useState({})
  const [devType, setdevType] = useState(devTypeA[0])
  const [files, setFiles] = useState([])
  const { enqueueSnackbar } = useSnackbar()

  const onSubmitFun = async (data, resetForm) => {
    // todo: check if campaign exists
    // const foundLength = await checkIfLeadAlreadyExists('spark_leads', mobileNo)
    if(mode === 'add'){

    const { campaignTitle } = data
    const foundLength = await checkIfCampaignAlreadyExists(orgId, campaignTitle)
    if (foundLength?.length > 0) {
      console.log('foundLENGTH IS ', foundLength)
      // setFoundDocs(foundLength)
      setFormMessage('Campaign name already Exists')
      setLoading(false)
    } else {
      data.start_date = startDate.getTime()
      data.end_date = endDate.getTime()

      data.priorities = prior ? 'high' : 'medium'
      setLoading(true)
      await addCampaign(orgId, data, user.email, 'msg')


      await resetForm()
      await setFormMessage('Campaign Created..!')
      await setLoading(false)
      await dialogOpen(false)
      return
    }
  }else {
    data.start_date = startDate.getTime()
      data.end_date = endDate.getTime()

      data.priorities = prior ? 'high' : 'medium'
      setLoading(true)
      await updateCampaign(orgId, campaignPaylaod?.docId, data, enqueueSnackbar)


      await resetForm()
      await setFormMessage('Campaign Created..!')
      await setLoading(false)
      await dialogOpen(false)
      return
  }
  }

  const validate = Yup.object({
    campaignTitle: Yup.string().required('Campaign Title is Required'),

    assignedTo: Yup.string().required('Required'),
   
  })
  return (
    <div className="h-full flex flex-col pb-6 bg-white shadow-xl overflow-y-scroll no-scrollbar bg-gradient-to-r from-blue-200 to-cyan-200">

      <div className="">
        <section className="flex flex-row justify-between mx-4 pt-2 pb-2">
          <span className="ml-1 mt-[1px] ">
            <label className="font-semibold text-[#053219]  text-[18px]  mb-1  ">
              {mode === 'add' ? 'Add New Campaign' : 'Edit Campaign'} 🍉
              <abbr title="required"></abbr>
            </label>
          </span>
        </section>
      </div>
      {formMessage === 'Saved Successfully..!' && (
        <p className=" flex text-md text-slate-800  my-3">
          <img className="w-[40px] h-[40px] inline mr-2" alt="" src="/ok.gif" />
          <span className="mt-2">{formMessage}</span>
        </p>
      )}
      {formMessage === 'Campaign name already Exists' && (
        <p className=" flex text-md text-pink-800  my-3">
          <img
            className="w-[40px] h-[40px] inline mr-2"
            alt=""
            src="/error.gif"
          />
          <span className="mt-2">{formMessage}</span>
        </p>
      )}
      <div className="grid  gap-8 grid-cols-1 ">
        <div className="flex flex-col  ">
          <div className="mt-0">
            {/* new one */}

            <Formik
              enableReinitialize={true}
              initialValues={{
                campaignTitle: campaignPaylaod?.campaignTitle || '',
                campaignDesc: campaignPaylaod?.campaignDesc || '',
                assignedTo: campaignPaylaod?.assignedTo || userIs.value,
                assignedToObj: campaignPaylaod?.assignedToObj || userIs,
                source: campaignPaylaod?.source || '',
                project: campaignPaylaod?.project || '',
                projectId: campaignPaylaod?.projectId || '',
                budget: campaignPaylaod?.budget || 0,
              }}
              validationSchema={validate}
              onSubmit={(values, { resetForm }) => {
                console.log('ami submitted', values)
                console.log('ami submitted 1', values.assignedTo === '')

                onSubmitFun(values, resetForm)
              }}
            >
              {(formik) => (
                <Form>
                  <div className="mt-  rounded-lg bg-white mx-4 py-1">
                    <div className="flex flex-col pt-0 my-10 mx-4 mt-[10px] rounded">
                      <div className="  outline-none">
                        <div className="flex flex-row border-b border-gray border-b pb-1 border-[#edeef0]">
                          <div className="w-full flex flex-col mt-1 ">
                            <Field
                              name="taskTitle"
                              type="text"
                              value={formik?.values?.campaignTitle}
                              onChange={(value) => {
                                console.log('vaue is ', value.target.value)
                                formik.setFieldValue(
                                  'campaignTitle',
                                  value.target.value
                                )
                              }}
         
                              placeholder="Campaign name"
                              className={`w-full  pb-2 pt-1 outline-none text-[18px] font-bodyLato focus:border-blue-600 hover:border-blue-600  ${
                                true ? ' text-[33475b] ' : ' text-[33475b]'
                              } bg-white`}
                            ></Field>
                          </div>
                          <div className="flex flex-row">
                            <input
                              data-bx-id="task-edit-priority-cb"
                              type="checkbox"
                              name="priorities"
                              value={prior}
                              className="mb-[5px]"
                              onChange={() => {
                                setPrior(!prior)
                                const priorTxt = prior ? 'high' : 'medium'
                                formik.setFieldValue('priorities', priorTxt)
                                console.log('is this checked ', priorTxt)
                              }}
                            />
                            <div className="w-[85px] ml-1 mt-[8px] text-sm text-[#00000080]">
                              High Priority
                            </div>
                            <FireIcon
                              className={`w-4 h-4 mt-[11px] ${
                                prior ? 'text-[#f36b00]' : 'text-[#00000080] '
                              } `}
                            />
                          </div>
                        </div>

                        <ErrorMessage
                          component="div"
                          name={'campaignTitle'}
                          className="error-message text-red-700 text-xs mt-[1px]  "
                        />
                        <div className="flex flex-row border-b border-gray border-b pb-1 border-[#edeef0]">
                          {/* taskdesc */}
                          <textarea
                            name="campaignDesc"
                            type="text"
                            value={formik?.values?.campaignDesc}
                            onChange={(value) => {
                              console.log('vaue is ', value.target.value)
                              formik.setFieldValue(
                                'campaignDesc',
                                value.target.value
                              )
                            }}
                            placeholder="Description"
                            className={`w-full h-[170px] pb-2 pt-2 outline-none text-[14px] font-bodyLato focus:border-blue-600 hover:border-blue-600  ${
                              true ? ' text-[33475b] ' : ' text-[33475b]'
                            } bg-white`}
                          ></textarea>
                        </div>
                        <section className="mt-1 px-4 rounded-lg bg-[#f8f9fa] border border-gray-100 ">
                          <div className="md:flex md:flex-row md:space-x-4 w-full text-xs ">
                            <div className="w-full flex flex-col mb-3 mt-2">
                              <CustomSelect
                                name="source"
                                label="Lead Source*"
                                className="input mt-3"
                                onChange={(value) => {
                                  formik.setFieldValue('source', value.value)
                                }}
                                value={formik.values.source}
                                options={sourceList}
                              />
                            </div>

                            <div className="w-full flex flex-col mb-3 mt-2">
                              <CustomSelect
                                name="project"
                                label="Select Project"
                                className="input mt-3"
                                onChange={(value) => {
                                  console.log('value of project is ', value)
                                  formik.setFieldValue('projectId', value.uid)
                                  formik.setFieldValue('project', value.value)
                                }}
                                value={formik.values.project}
                                // options={aquaticCreatures}
                                options={projectList}
                              />
                            </div>
                          </div>
                          <div className="md:flex md:flex-row md:space-x-4 w-full text-xs ">
                            <div className="w-full flex flex-col mb-3 mt-2">
                              <label className="label mt-3 font-regular text-[12px] block mb-1 text-gray-700">
                                {'Start Date'}
                              </label>
                              <div className="bg-green border  pl-2 rounded flex flex-row h-[32px]  ">
                                <CalendarIcon className="w-4  inline text-[#058527]" />
                                <span className="inline">
                                  <CustomDatePicker
                                    className="mt-[5px] pl- px-2  inline text-sm "
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    injectTimes={[
                                      setHours(setMinutes(d, 1), 0),
                                      setHours(setMinutes(d, 5), 12),
                                      setHours(setMinutes(d, 59), 23),
                                    ]}
                                    //dateFormat="MMMM d, yyyy"
                                    dateFormat="MMM dd, yyyy"
                                  />
                                </span>
                              </div>
                            </div>

                            <div className="w-full flex flex-col mb-3 mt-2">
                              <label className="label mt-3 font-regular text-[12px] block mb-1 text-gray-700">
                                {'End Date*'}
                              </label>
                              <div className="bg-green border  pl-2 rounded flex flex-row h-[32px]  ">
                                <CalendarIcon className="w-4  inline text-[#058527]" />
                                <span className="inline">
                                  <CustomDatePicker
                                    className="mt-[5px] pl- px-2  inline text-sm "
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    injectTimes={[
                                      setHours(setMinutes(d, 1), 0),
                                      setHours(setMinutes(d, 5), 12),
                                      setHours(setMinutes(d, 59), 23),
                                    ]}
                                    //dateFormat="MMMM d, yyyy"
                                    dateFormat="MMM dd, yyyy"
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="md:flex md:flex-row md:space-x-4 w-full text-xs ">
                            <div className="w-full flex flex-col mb-3 mt-2">
                              <div className="mb-3 mt-3 space-y-2 w-full text-xs">
                                <TextField
                                  label="Campaign Budget"
                                  name="budget"
                                  type="text"
                                  value={formik.values.budget}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/^0+/, '');
                                    formik.setFieldValue('budget', value);
                                  }}
                                />
                              </div>
                            </div>

                            <div className="w-full flex flex-col mb-3 mt-2">
                              <label className="label mt-3 font-regular text-[12px] block mb-1 text-gray-700">
                                {'Responsible person*'}
                              </label>
                              <div className=" w-full min-w-full rounded flex flex-row h-[32px]  ">
                                <CustomSelectNew
                                  name="assignedTo"
                                  label="Assigned To"
                                  showLabel={false}
                                  placeholder="Name"
                                  className="input mt-[3px] w-full"
                                  onChange={(value) => {
                                    formik.setFieldValue(
                                      'assignedTo',
                                      value.value
                                    )
                                    formik.setFieldValue('assignedToObj', value)
                                  }}
                                  value={formik.values.assignedTo}
                                  // options={aquaticCreatures}
                                  options={usersList}
                                />
                              </div>
                            </div>
                          </div>

                          <div className=" mt-3"></div>
                        </section>
     
                      </div>
       
                    </div>
                  </div>
                  <div className="z-10 flex flex-row justify-between mt-4 pb-2 pr-6 bg-white shadow-lg absolute bottom-0  w-full">
                    <section></section>
                    <section className="flex flex-row ">
                      {formMessage === 'Task Created..!' && (
                        <p className=" flex text-md text-slate-800 mt-4">
                          <img
                            className="w-[18px] h-[18px] inline mr-2"
                            alt=""
                            src="/ok.gif"
                          />
                          <span className="mt-[.2px] text-[12px]">
                            {formMessage}
                          </span>
                        </p>
                      )}
                      <button
                        className={`flex mt-2 ml-4 cursor-pointer rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium  text-[#fff]  bg-[#0891B2]   hover:shadow-lg `}
                      >
                        <span className="ml-1 ">Add Campaign</span>
                      </button>
        

                      <button

                        onClick={() => dialogOpen(false)}
                        className={`flex mt-2 ml- rounded items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium `}
                      >
                        <span className="ml-1 ">Cancel</span>
                      </button>
                    </section>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCampaignForm
