import React, { useState, useEffect } from 'react'
import { ErrorMessage, Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { v4 as uuidv4 } from 'uuid'
import CustomDatePicker from 'src/util/formFields/CustomDatePicker'
import { setHours, setMinutes } from 'date-fns'
import { supabase } from 'src/context/supabase'
import { useAuth } from 'src/context/firebase-auth-context'
import { prettyDateTime } from 'src/util/dateConverter'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { addLegalClarificationTicket, steamUnitTasks } from './Query'

const ToDoList = ({ selUnitPayload }) => {
  const d = new window.Date()
  const { user } = useAuth()
  const { orgId } = user
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: 'Need to call contractor and update about Plastering and budget',
      date: '20 Mar 2025',
      priority: 'High Priority',
      completed: false,
    },
    {
      id: 2,
      text: 'Need to call contractor and update about Plastering and budget',
      date: '20 Mar 2025',
      priority: 'High Priority',
      completed: false,
    },
    {
      id: 3,
      text: 'Need to call contractor and update about Plastering and budget',
      date: '20 Mar 2025',
      priority: 'High Priority',
      completed: false,
    },
    {
      id: 4,
      text: 'Need to call contractor and update about Plastering and budget',
      date: '20 Mar 2025',
      priority: 'High Priority',
      completed: false,
    },
    {
      id: 5,
      text: 'Need to call contractor and update about Plastering and budget',
      date: '20 Mar 2025',
      priority: 'High Priority',
      completed: false,
    },
    {
      id: 6,
      text: 'Need to call contractor and update about Plastering and budget',
      date: '20 Mar 2025',
      priority: 'High Priority',
      completed: false,
    },
  ])

  const [startDate, setStartDate] = useState(d.getTime() + 60000)
  const [activeTab, setActiveTab] = useState('ALL')
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('High Priority')
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [takTitle, setTakTitle] = useState('')
  const [takNotes, setNotesTitle] = useState('')
  const [fbNotes, setfbNotes] = useState('')
  const [attachType, setAttachType] = useState('')
  const [tempLeadStatus, setLeadStatus] = useState('')
  const [prior, setPrior] = useState(false)
  const [streamCurrentStatus, setStreamCurrentStatus] = useState('new')
  const [unitFetchedActivityData, setUnitFetchedActivityData] = useState([])
  const [selFilterVal, setSelFilterVal] = useState('pending')
  const [leadSchFetchedData, setLeadsFetchedSchData] = useState([])

  const priorityOptions = [
    { value: 'High Priority', color: 'bg-red-100 text-red-800' },
    { value: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Low Priority', color: 'bg-green-100 text-green-800' },
    { value: 'No Priority', color: 'bg-gray-100 text-gray-800' },
  ]
  useEffect(() => {
    boot()
    const channel = supabase
      .channel('unit-tasks-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: `${orgId}_unit_tasks`,
        },
        (payload) => {
          console.log('account records', payload)
          const updatedData = payload.new
          const { id } = payload.old
          const eventType = payload.eventType
          console.log('account records', updatedData.Uuid, selUnitPayload?.id)

          if (updatedData.Uuid === selUnitPayload?.id) {
            if (updatedData.Uuid === selUnitPayload?.id) {
              console.log(
                'account records',
                updatedData.Uuid,
                selUnitPayload?.id
              )
              setUnitFetchedActivityData((prevLogs) => {
                const existingLog = prevLogs.find((log) => log.id === id)
                console.log(
                  'account records',
                  prevLogs,
                  existingLog,
                  id,
                  payload.old,
                  id
                )
                if (existingLog) {
                  console.log('Existing record found!')
                  if (payload.new.status === 'Done') {
                    const updatedLogs = prevLogs.filter((log) => log.id != id)
                    return [...updatedLogs]
                  } else {
                    const updatedLogs = prevLogs.map((log) =>
                      log.id === id ? payload.new : log
                    )
                    return [...updatedLogs]
                  }
                } else {
                  console.log('New record added!')
                  return [payload.new, ...prevLogs]
                }
              })
            } else {
              if (
                updatedData.by_uid === user?.uid ||
                updatedData?.to_uid === user?.uid
              ) {
                setUnitFetchedActivityData((prevLogs) => {
                  const existingLog = prevLogs.find((log) => log.id === id)

                  if (existingLog) {
                    console.log('Existing record found!')
                    if (payload.new.status === 'Done') {
                      const updatedLogs = prevLogs.filter((log) => log.id != id)
                      return [...updatedLogs]
                    } else {
                      const updatedLogs = prevLogs.map((log) =>
                        log.id === id ? payload.new : log
                      )
                      return [...updatedLogs]
                    }
                  } else {
                    console.log('New record added!')
                    return [payload.new, ...prevLogs]
                  }
                })
              }
            }
          }
        }
      )
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  const boot = async () => {
    const unsubscribe = steamUnitTasks(orgId, {
      uid: selUnitPayload?.id,
      pId: selUnitPayload?.pId,
    })

    const y = await unsubscribe
    setUnitFetchedActivityData(y)
    await console.log('new setup ', unitFetchedActivityData)
    await console.log('new setup ', y)
  }
  const getPriorityColor = (priority) => {
    const option = priorityOptions.find((opt) => opt.value === priority)
    return option ? option.color : 'bg-red-100 text-red-800'
  }

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }
  const setTitleFun = (e) => {
    setTakTitle(e.target.value)
  }

  const addNewTask = () => {
    if (newTaskText.trim() === '') return

    const newTask = {
      id: tasks.length + 1,
      text: newTaskText,
      date: new Date()
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .replace(',', ''),
      priority: newTaskPriority,
      completed: false,
    }

    setTasks([...tasks, newTask])
    setNewTaskText('')
    setNewTaskPriority('High Priority')
    setIsAddingTask(false)
  }

  const editTaskPriority = (id, priority) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, priority } : task))
    )
  }

  const initialState = {
    taskTitle: takTitle || '',
  }
  const validateSchema = Yup.object({
    taskTitle: Yup.string()
      .max(180, 'Must be 180 characters or less')
      .required('Task Title Required'),
  })

  const updateTaskStatus = (d) => {
    // write query to update task status in supabase
  }
  return (
    <div className="overflow-y-scroll max-h-screen scroll-smooth scrollbar-thin scrollbar-thumb-gray-300">
      <div className="relative min-h-screen mr-6">
        <div className="relative z-0">
          <h1 className="text-[#606062] font-outfit mb-1   mx-auto w-full  tracking-[0.06em] font-heading font-medium text-[12px] uppercase mb-0">
            Unit Tasks
          </h1>

          <img
            alt="CRM Background"
            src="/crmfinal.svg"
            className="w-full h-auto object-cover"
          />

          <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  ">

              {/* <div className="text-center space-y-2">
                <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                  Last Task
                </p>
                <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                  No Data
                </h2>
              </div>
              <div className="text-center space-y-2">
                <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                  Next Task
                </p>
                <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                  No Data
                </h2>
              </div>
              <div className="text-center space-y-2">
                <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                  
                </p>
                <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                  No Data
                </h2>
              </div> */}


              <div className="text-center space-y-2">
                <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                  Last Completed
                </p>
                <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                  {unitFetchedActivityData?.filter(t => t.status === 'Done').length > 0
                    ? unitFetchedActivityData
                      .filter(t => t.status === 'Done')
                      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]?.title?.substring(0, 15) + '...' || 'Completed Task'
                    : 'No Data'}
                </h2>
              </div>
              <div className="text-center space-y-2">
                <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                  Next Due Task
                </p>
                <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                  {unitFetchedActivityData?.filter(t => t.status !== 'Done' && t.due_date).length > 0
                    ? unitFetchedActivityData
                      .filter(t => t.status !== 'Done' && t.due_date)
                      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0]?.title?.substring(0, 15) + '...' || 'Upcoming Task'
                    : 'No Data'}
                </h2>
              </div>
              <div className="text-center space-y-2">
                <p className="font-outfit font-normal text-[12px] leading-[100%] tracking-[0.72px] text-[#606062]">
                  Urgent Tasks
                </p>
                <h2 className="font-outfit font-medium text-[22px] leading-[100%] tracking-[1.32px]">
                  {unitFetchedActivityData?.filter(t => t.priorities === 'high').length || '0'}
                </h2>
              </div>











            </div>
          </div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 mt-[-70px] z-10">
          <div className="bg-white rounded-2xl p-6">
            <section className="flex flex-row justify-between">
              {/* <h1 className="text-2xl font-bold text-gray-800 mb-6">Unit Tasks</h1> */}
            </section>

            <div className="flex flex-row justify-between ">
              <div className="flex flex-row bg-white rounded-xl border ">
                <div
                  className={` py-1 pr-4 pl-4 pt-0 min-w-[62px] ${selFilterVal === 'all' ? 'bg-[#EDE9FE]' : ''
                    } rounded-xl rounded-r-none`}
                  onClick={() => setSelFilterVal('all')}
                >
                  <span className="mr-1 text-[13px] ">All</span>

                  <span className="mr-1 text-[12px] ">
                    {
                      unitFetchedActivityData.filter(
                        (d) => d?.due_date != undefined
                      ).length
                    }
                  </span>
                </div>
                <div
                  className={` py-1 pr-4 pl-4  pt-0 min-w-[62px] border-x ${selFilterVal === 'pending' ? 'bg-[#EDE9FE]' : ''
                    } `}
                  onClick={() => setSelFilterVal('pending')}
                >
                  {/* <CheckCircleIcon className="w-4 h-4  inline text-[#cdcdcd]" /> */}
                  <span className="mr-1 text-[13px] ">Pending</span>
                  <span className=" text-[12px] ">
                    {' '}
                    {
                      unitFetchedActivityData?.filter(
                        (d) => d?.status === 'InProgress'
                      ).length
                    }
                  </span>
                </div>
                <div
                  className={` py-1 pr-4 pt-0 pl-4 min-w-[62px] ${selFilterVal === 'completed' ? 'bg-[#EDE9FE]' : ''
                    }  rounded-xl rounded-l-none`}
                  onClick={() => setSelFilterVal('completed')}
                >
                  {/* <CheckCircleIcon className="w-4 h-4 inline text-[#058527]" /> */}
                  <span className="mr-1 text-[12px]  ">Completed</span>

                  <span className="mr-1 text-[12px] ">
                    {' '}
                    {
                      leadSchFetchedData?.filter((d) => d?.sts === 'completed')
                        .length
                    }
                  </span>
                </div>
              </div>
              <section>
                {!showAddTask && (
                  <span
                    className="ml-2 mt-1 text-[#0E0A1F] cursor-pointer "
                    onClick={() => {
                      setShowAddTask(!showAddTask)
                    }}
                  >
                    Create Task
                  </span>
                )}
                {showAddTask && (
                  <span
                    className="ml-2 mt-1 text-blue-800 cursor-pointer"
                    onClick={() => {
                      setShowAddTask(!showAddTask)
                    }}
                  >
                    Close Task
                  </span>
                )}
              </section>
            </div>

            {showAddTask && (
              <div className="flex flex-col pt-0 my-10  mt-4 ">
                <Formik
                  enableReinitialize={true}
                  initialValues={initialState}
                  validationSchema={validateSchema}
                  onSubmit={async (data, { resetForm }) => {
                    data.due_date = startDate
                    data.priorities = prior ? 'high' : 'medium'
                    // data.attachments = files
                    data.Uuid = selUnitPayload?.id
                    await addLegalClarificationTicket(orgId, data, user)
                    setShowAddTask(false)
                    return
                  }}
                >
                  {(formik) => (
                    <Form>
                      <div className=" form outline-none border rounded-lg  py-4">
                        <section className=" px-4">
                          <div className="text-xs font-bodyLato text-[#516f90] mb-[4px]">
                            Task Title
                            <ErrorMessage
                              component="div"
                              name="taskTitle"
                              className="error-message text-red-700 text-xs p-1"
                            />
                          </div>
                          <input
                            autoFocus
                            name="taskTitle"
                            type="text"
                            value={takTitle}
                            onChange={(e) => {
                              formik.setFieldValue('taskTitle', e.target.value)
                              setTitleFun(e)
                            }}
                            placeholder="Enter a short title"
                            className="w-full h-full pb-1 outline-none text-sm font-bodyLato focus:border-blue-600 hover:border-blue-600  border-b border-[#cdcdcd] text-[33475b]  "
                          ></input>
                          <div className="flex flex-row ">
                            <div className="flex flex-row mt-3">
                              <section>
                                <span className="text-xs font-bodyLato text-[#516f90]">
                                  <span className="">
                                    {tempLeadStatus.charAt(0).toUpperCase() +
                                      tempLeadStatus.slice(1)}{' '}
                                  </span>
                                  Due Date
                                </span>
                                <div className="bg-green   pl-   flex flex-row ">
                                  <span className="inline">
                                    <CustomDatePicker
                                      className=" mt-[2px] pl- px- min-w-[240px] inline text-xs text-[#0091ae] "
                                      selected={startDate}
                                      onChange={(date) => setStartDate(date)}
                                      showTimeSelect
                                      timeFormat="HH:mm"
                                      injectTimes={[
                                        setHours(setMinutes(d, 1), 0),
                                        setHours(setMinutes(d, 5), 12),
                                        setHours(setMinutes(d, 59), 23),
                                      ]}
                                      dateFormat="MMM d, yyyy h:mm aa"
                                    />
                                  </span>
                                </div>
                              </section>
                            </div>
                            <div className="flex flex-row mt-3">
                              <section>
                                <span className="text-xs font-bodyLato text-[#516f90]">
                                  <span className="">
                                    {tempLeadStatus.charAt(0).toUpperCase() +
                                      tempLeadStatus.slice(1)}{' '}
                                  </span>
                                  Priority
                                </span>
                                <div className="bg-green   pl-   flex flex-row  ">
                                  <span className="inline">
                                    <input
                                      data-bx-id="task-edit-priority-cb"
                                      type="checkbox"
                                      name="priorities"
                                      value={prior}
                                      className="mb-[5px]"
                                      onChange={(value) => {
                                        setPrior(!prior)
                                        const priorTxt = prior
                                          ? 'high'
                                          : 'medium'
                                        formik.setFieldValue(
                                          'priorities',
                                          priorTxt
                                        )
                                        console.log(
                                          'is this checked ',
                                          priorTxt
                                        )
                                      }}
                                    />
                                  </span>
                                  <div className="w-[85px] ml-1 mt-[1px] text-sm text-[#00000080]">
                                    High Priority
                                  </div>
                                </div>
                              </section>
                            </div>
                          </div>
                        </section>
                        <div className="flex flex-row mt-4 justify-between pr-4 border-t pt-1">
                          <section>
                            <span>{''}</span>
                          </section>
                          <section className="flex">
                            <button
                              type="submit"
                              className={`flex mt-2 cursor-pointer rounded-xs text-bodyLato items-center  pl-2 h-[36px] pr-4 py-2 text-sm font-medium  bg-[#FF7A53] bg-[#ECE9FE] text-[#0E0A1F] rounded-lg hover:bg-gray-700 hover:text-white  `}
                            >
                              <span className="ml-1 ">
                                Create{' '}
                                {tempLeadStatus != streamCurrentStatus &&
                                  tempLeadStatus}{' '}
                                Task
                              </span>
                            </button>
                            <button
                              // onClick={() => cancelResetStatusFun()}
                              className={`flex mt-2 ml-4 rounded-lg items-center text-bodyLato pl-2 h-[36px] pr-4 py-2 text-sm font-medium border text-[#0E0A1F]  hover:bg-gray-700 hover:text-white `}
                            >
                              <span className="ml-1 ">Cancel</span>
                            </button>
                          </section>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
            <div className="">
              {unitFetchedActivityData.map((task) => (
                <div key={task.id} className="p-4 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div
                        className={`text-md font-medium ${task?.completed
                            ? 'line-through text-gray-400'
                            : 'text-gray-800'
                          }`}
                      >
                        {task?.title}
                      </div>
                      <section className="flex flex-row mt-[3px]">
                        <div className="text-xs text-gray-500 ">
                          Due:{prettyDateTime(task?.due_date)}
                        </div>
                        <div className="w-[2px] mx-2 mt-[4px] h-[8px] border-0 border-r"></div>
                        <div className="text-xs  text-gray-500">
                          CreatedBy:{task?.by_name || 'NA'}
                        </div>
                        <div className="w-[2px] mx-2 mt-[4px] h-[8px] border-0 border-r"></div>
                        <div className="text-xs  text-gray-500">
                          AssignedTo:{task?.to_name || 'NA'}
                        </div>
                      </section>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="relative group">
                        <span
                          className={`${getPriorityColor(
                            task.priority
                          )} text-xs px-3 py-1 rounded-full cursor-pointer`}
                        >
                          {task.priority}
                        </span>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                          <div className="py-1">
                            {priorityOptions.map((option) => (
                              <button
                                key={option.value}
                                className={`${option.color} block w-full text-left px-4 py-2 text-sm`}
                                onClick={() =>
                                  editTaskPriority(task.id, option.value)
                                }
                              >
                                {option.value}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => updateTaskStatus(d1)}
                        className="h-5 w-5 text-black accent-black  border-gray-300 rounded focus:ring-black"
                      />
                      <div
                        className={`w-6 h-6 border-2 rounded cursor-pointer ${task.completed
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                          }`}
                        onClick={() => toggleTaskCompletion(task.id)}
                      >
                        {task.completed && (
                          <input
                            type="checkbox"
                            checked={false}
                            //  onChange={() => triggerPaymentScheudlefun(d1)}
                            className="h-5 w-5 text-black accent-black  border-gray-300 rounded focus:ring-black"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {!showAddTask && (
                <button
                  className="w-full p-3 border mt-4 border-dashed border-gray-300 text-gray-500 rounded-lg flex items-center justify-center"
                  onClick={() => setShowAddTask(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add New Task
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToDoList
