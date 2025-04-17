import React, { useState, useEffect } from 'react';
import { ErrorMessage, Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { v4 as uuidv4 } from 'uuid'
import { addLegalClarificationTicket, steamUnitTasks } from 'src/context/dbQueryFirebase';
import CustomDatePicker from 'src/util/formFields/CustomDatePicker';
import { setHours, setMinutes } from 'date-fns'
import { supabase } from 'src/context/supabase';
import { useAuth } from 'src/context/firebase-auth-context';
import { prettyDateTime } from 'src/util/dateConverter';
import { CheckCircleIcon } from '@heroicons/react/solid'

const ToDoList = ({selUnitPayload}) => {
  const d = new window.Date()
 const { user } = useAuth()
  const { orgId } = user
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
    { id: 2, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
    { id: 3, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
    { id: 4, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
    { id: 5, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
    { id: 6, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
  ]);

  const [startDate, setStartDate] = useState(d.getTime() + 60000)
  const [activeTab, setActiveTab] = useState('ALL');
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('High Priority');
  const [isAddingTask, setIsAddingTask] = useState(false);
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
    { value: 'No Priority', color: 'bg-gray-100 text-gray-800' }
  ];
  useEffect(() => {
    boot()
    const subscription = supabase
      .from(`${orgId}_unit_tasks`)
      .on('*', (payload) => {
        console.log('account records', payload)
        const updatedData = payload.new
        const { id } = payload.old
        const eventType = payload.eventType
        console.log('account records', updatedData.Uuid, selUnitPayload?.id)

        if (updatedData.Uuid === selUnitPayload?.id) {
          if (updatedData.Uuid === selUnitPayload?.id) {
            console.log('account records', updatedData.Uuid, selUnitPayload?.id)
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
                return [payload.new,...prevLogs]
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
                  return [payload.new,...prevLogs]
                }
              })
            }
          }
        }
      })
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeSubscription(subscription)
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
    const option = priorityOptions.find(opt => opt.value === priority);
    return option ? option.color : 'bg-red-100 text-red-800';
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  const setTitleFun = (e) => {
    setTakTitle(e.target.value)
  }

  const addNewTask = () => {
    if (newTaskText.trim() === '') return;

    const newTask = {
      id: tasks.length + 1,
      text: newTaskText,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', ''),
      priority: newTaskPriority,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setNewTaskPriority('High Priority');
    setIsAddingTask(false);
  };

  const editTaskPriority = (id, priority) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, priority } : task
      )
    );
  };

  const filteredTasks = () => {
    switch (activeTab) {
      case 'TO DO':
        return tasks.filter(task => !task.completed);
      case 'COMPLETED':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };
  const initialState = {
    taskTitle: takTitle || '',
  }
   const validateSchema = Yup.object({
      taskTitle: Yup.string()
        .max(180, 'Must be 180 characters or less')
        .required('Task Title Required'),
    })
  return (
    <div className="max-w-full mr-6 mx-auto p-6 bg-white rounded-2xl shadow-sm">
      <section className='flex flex-row justify-between'>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Unit Tasks</h1>
</section>


      <div className="flex flex-row justify-between ">
                <div className="flex flex-row bg-white rounded-xl border ">
                  <div
                    className={` py-1 pr-4 pl-4 pt-0 min-w-[62px] ${
                      selFilterVal === 'all' ? 'bg-[#c6fff0]' : ''
                    } rounded-xl rounded-r-none`}
                    onClick={() => setSelFilterVal('all')}
                  >
                    <span className="mr-1 text-[13px] ">All</span>

                    <span className="mr-1 text-[12px] ">{
                      leadSchFetchedData.filter((d) => d?.schTime != undefined)
                        .length
                    }</span>
                  </div>
                  <div
                    className={` py-1 pr-4 pl-4  pt-0 min-w-[62px] border-x ${
                      selFilterVal === 'pending' ? 'bg-[#c6fff0]' : ''
                    } `}
                    onClick={() => setSelFilterVal('pending')}
                  >
                    <CheckCircleIcon className="w-4 h-4  inline text-[#cdcdcd]" />
                    <span className="mr-1 text-[13px] ">Pending</span>
                    <span
                      className=" text-[12px] "
                    >
                      {' '}
                      {
                        leadSchFetchedData?.filter((d) => d?.sts === 'pending')
                          .length
                      }
                    </span>
                  </div>
                  <div
                    className={` py-1 pr-4 pt-0 pl-4 min-w-[62px] ${
                      selFilterVal === 'completed' ? 'bg-[#c6fff0]' : ''
                    }  rounded-xl rounded-l-none`}
                    onClick={() => setSelFilterVal('completed')}
                  >
                    <CheckCircleIcon className="w-4 h-4 inline text-[#058527]" />
                    <span className="mr-1 text-[12px]  ">Completed</span>

                    <span className="mr-1 text-[12px] ">  {
                      leadSchFetchedData?.filter((d) => d?.sts === 'completed')
                        .length
                    }</span>
                  </div>
                </div>
                <section>
                {!showAddTask && (
                  <span
                    className="ml-2 mt-1 text-blue-800 cursor-pointer "
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
        {unitFetchedActivityData.map(task => (
          <div key={task.id} className="p-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">

                <div className={`text-md font-medium ${task?.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task?.title}
                </div>
                <section className='flex flex-row mt-[3px]'>
                <div className="text-xs text-gray-500 ">Due:{prettyDateTime(task?.due_date)}</div>
                <div className="w-[2px] mx-2 mt-[4px] h-[8px] border-0 border-r"></div>
                <div className="text-xs  text-gray-500">CreatedBy:{task?.by_name || 'NA'}</div>
                <div className="w-[2px] mx-2 mt-[4px] h-[8px] border-0 border-r"></div>
                <div className="text-xs  text-gray-500">AssignedTo:{task?.to_name|| 'NA'}</div>

                </section>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <span className={`${getPriorityColor(task.priority)} text-xs px-3 py-1 rounded-full cursor-pointer`}>
                    {task.priority}
                  </span>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                    <div className="py-1">
                      {priorityOptions.map(option => (
                        <button
                          key={option.value}
                          className={`${option.color} block w-full text-left px-4 py-2 text-sm`}
                          onClick={() => editTaskPriority(task.id, option.value)}
                        >
                          {option.value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 border-2 rounded cursor-pointer ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  {task.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {!showAddTask && (<button
            className="w-full p-3 border mt-4 border-dashed border-gray-300 text-gray-500 rounded-lg flex items-center justify-center"
            onClick={() =>setShowAddTask(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Task
          </button>)}
      </div>

    </div>
  );
};

export default ToDoList;






























































// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   addDoc,
//   updateDoc,
//   doc,
//   getDocs,
//   query,
//   orderBy,
//   serverTimestamp,
//   deleteDoc
// } from 'firebase/firestore';
// import { db } from 'src/context/firebaseConfig';


// const ToDoList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [activeTab, setActiveTab] = useState('ALL');
//   const [newTaskText, setNewTaskText] = useState('');
//   const [newTaskPriority, setNewTaskPriority] = useState('High Priority');
//   const [isAddingTask, setIsAddingTask] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const priorityOptions = [
//     { value: 'High Priority', color: 'bg-red-100 text-red-800' },
//     { value: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
//     { value: 'Low Priority', color: 'bg-green-100 text-green-800' },
//     { value: 'No Priority', color: 'bg-gray-100 text-gray-800' }
//   ];

//   // Fetch tasks from Firestore on component mount
//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // Function to fetch tasks from Firestore
//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const tasksRef = collection(db, 'tasks');
//       const tasksQuery = query(tasksRef, orderBy('createdAt', 'desc'));
//       const querySnapshot = await getDocs(tasksQuery);

//       const tasksData = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         date: doc.data().date || new Date().toLocaleDateString('en-GB', {
//           day: '2-digit',
//           month: 'short',
//           year: 'numeric'
//         }).replace(',', '')
//       }));

//       setTasks(tasksData);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to add a new task to Firestore
//   const addNewTask = async () => {
//     if (newTaskText.trim() === '') return;

//     try {
//       const currentDate = new Date();
//       const formattedDate = currentDate.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric'
//       }).replace(',', '');

//       const newTask = {
//         text: newTaskText,
//         date: formattedDate,
//         priority: newTaskPriority,
//         completed: false,
//         createdAt: serverTimestamp()
//       };

//       const docRef = await addDoc(collection(db, 'tasks'), newTask);

//       // Add the new task to the state with the Firebase document ID
//       setTasks([
//         {
//           id: docRef.id,
//           ...newTask,
//           createdAt: new Date() // Use local date for immediate display
//         },
//         ...tasks
//       ]);

//       setNewTaskText('');
//       setNewTaskPriority('High Priority');
//       setIsAddingTask(false);
//     } catch (error) {
//       console.error("Error adding task:", error);
//     }
//   };

//   // Function to toggle task completion status in Firestore
//   const toggleTaskCompletion = async (id) => {
//     try {
//       const taskToUpdate = tasks.find(task => task.id === id);
//       if (!taskToUpdate) return;

//       const newCompletedStatus = !taskToUpdate.completed;

//       // Update in Firestore
//       await updateDoc(doc(db, 'tasks', id), {
//         completed: newCompletedStatus
//       });

//       // Update in local state
//       setTasks(
//         tasks.map(task =>
//           task.id === id ? { ...task, completed: newCompletedStatus } : task
//         )
//       );
//     } catch (error) {
//       console.error("Error toggling task completion:", error);
//     }
//   };

//   // Function to edit task priority in Firestore
//   const editTaskPriority = async (id, priority) => {
//     try {
//       // Update in Firestore
//       await updateDoc(doc(db, 'tasks', id), {
//         priority: priority
//       });

//       // Update in local state
//       setTasks(
//         tasks.map(task =>
//           task.id === id ? { ...task, priority } : task
//         )
//       );
//     } catch (error) {
//       console.error("Error updating task priority:", error);
//     }
//   };

//   // Function to delete a task from Firestore
//   const deleteTask = async (id) => {
//     try {
//       // Delete from Firestore
//       await deleteDoc(doc(db, 'tasks', id));

//       // Remove from local state
//       setTasks(tasks.filter(task => task.id !== id));
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   const getPriorityColor = (priority) => {
//     const option = priorityOptions.find(opt => opt.value === priority);
//     return option ? option.color : 'bg-red-100 text-red-800';
//   };

//   const filteredTasks = () => {
//     switch (activeTab) {
//       case 'TO DO':
//         return tasks.filter(task => !task.completed);
//       case 'COMPLETED':
//         return tasks.filter(task => task.completed);
//       default:
//         return tasks;
//     }
//   };

//   return (
//     <div className="max-w-full mr-6 mx-auto p-6 bg-white rounded-2xl shadow-sm">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">TO DO LIST</h1>

//       <div className="flex space-x-4 mb-8">
//         <div
//           className={`flex items-center space-x-2 cursor-pointer ${activeTab === 'ALL' ? 'text-violet-700' : 'text-gray-500'}`}
//           onClick={() => setActiveTab('ALL')}
//         >
//           <div className={`w-6 h-12 rounded ${activeTab === 'ALL' ? 'bg-violet-200' : 'bg-gray-200'}`}></div>
//           <span className="font-medium">ALL</span>
//           <span className="bg-violet-100 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
//             {tasks.length}
//           </span>
//         </div>

//         <div
//           className={`flex items-center space-x-2 cursor-pointer ${activeTab === 'TO DO' ? 'text-violet-700' : 'text-gray-500'}`}
//           onClick={() => setActiveTab('TO DO')}
//         >
//           <div className={`w-6 h-12 rounded ${activeTab === 'TO DO' ? 'bg-violet-200' : 'bg-gray-200'}`}></div>
//           <span className="font-medium">TO DO</span>
//           <span className="bg-violet-100 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
//             {tasks.filter(task => !task.completed).length}
//           </span>
//         </div>

//         <div
//           className={`flex items-center space-x-2 cursor-pointer ${activeTab === 'COMPLETED' ? 'text-violet-700' : 'text-gray-500'}`}
//           onClick={() => setActiveTab('COMPLETED')}
//         >
//           <div className={`w-6 h-12 rounded ${activeTab === 'COMPLETED' ? 'bg-violet-200' : 'bg-gray-200'}`}></div>
//           <span className="font-medium">COMPLETED</span>
//           <span className="bg-violet-100 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
//             {tasks.filter(task => task.completed).length}
//           </span>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-700"></div>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredTasks().length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No tasks found in this category
//             </div>
//           ) : (
//             filteredTasks().map(task => (
//               <div key={task.id} className="p-4 border-b">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="text-sm text-gray-500">{task.date}</div>
//                     <div className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
//                       {task.text}
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <div className="relative group">
//                       <span className={`${getPriorityColor(task.priority)} text-xs px-3 py-1 rounded-full cursor-pointer`}>
//                         {task.priority}
//                       </span>
//                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
//                         <div className="py-1">
//                           {priorityOptions.map(option => (
//                             <button
//                               key={option.value}
//                               className={`${option.color} block w-full text-left px-4 py-2 text-sm`}
//                               onClick={() => editTaskPriority(task.id, option.value)}
//                             >
//                               {option.value}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <button
//                       className="text-gray-400 hover:text-red-500"
//                       onClick={() => deleteTask(task.id)}
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                     </button>
//                     <div
//                       className={`w-6 h-6 border-2 rounded cursor-pointer ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
//                       onClick={() => toggleTaskCompletion(task.id)}
//                     >
//                       {task.completed && (
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                         </svg>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}

//           {isAddingTask ? (
//             <div className="p-4 border-b">
//               <div className="mb-4">
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded"
//                   placeholder="Enter task"
//                   value={newTaskText}
//                   onChange={(e) => setNewTaskText(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
//                   autoFocus
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
//                 <div className="flex flex-wrap gap-2">
//                   {priorityOptions.map(option => (
//                     <button
//                       key={option.value}
//                       className={`${option.color} px-3 py-1 rounded-full text-xs ${newTaskPriority === option.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
//                       onClick={() => setNewTaskPriority(option.value)}
//                     >
//                       {option.value}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button
//                   className="px-4 py-2 bg-gray-200 rounded"
//                   onClick={() => setIsAddingTask(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-blue-500 text-white rounded"
//                   onClick={addNewTask}
//                 >
//                   Add Task
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <button
//               className="w-full p-3 border-2 border-dashed border-gray-300 text-gray-500 rounded flex items-center justify-center"
//               onClick={() => setIsAddingTask(true)}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//               </svg>
//               Add New Task
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ToDoList;

























{/* not useing */}
// import React, { useState } from 'react';

// export default function TaskManagementDashboard() {
//   // State for navigation and view
//   const [currentView, setCurrentView] = useState('calendar');
//   const [viewMode, setViewMode] = useState('week');

//   // Calendar state
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date().getDate().toString());

//   // Task and event state
//   const [tasks, setTasks] = useState([
//     { id: 1, text: 'Prepare presentation for client meeting', completed: false },
//     { id: 2, text: 'Review new design mockups', completed: false },
//     { id: 3, text: 'Submit weekly report', completed: true }
//   ]);

//   const [events, setEvents] = useState([
//     { id: 1, title: 'Team Meeting', time: '09:00 - 10:30', date: '12', attendees: 3, category: 'work', color: 'bg-blue-100' },
//     { id: 2, title: 'Product Review', time: '11:00 - 12:30', date: '12', attendees: 4, category: 'work', color: 'bg-purple-100' },
//     { id: 3, title: 'Client Consultation', time: '14:00 - 15:00', date: '13', attendees: 2, category: 'client', color: 'bg-green-100' },
//     { id: 4, title: 'UX Design Workshop', time: '10:00 - 12:00', date: '14', attendees: 6, category: 'design', color: 'bg-yellow-100' },
//     { id: 5, title: 'Development Sprint', time: '13:00 - 16:00', date: '15', attendees: 5, category: 'development', color: 'bg-indigo-100' }
//   ]);

//   // Form states
//   const [newTaskText, setNewTaskText] = useState('');
//   const [showEventForm, setShowEventForm] = useState(false);
//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     time: '',
//     date: selectedDate,
//     attendees: 1,
//     category: 'work'
//   });

//   // Team data
//   const team = [
//     { id: 1, name: 'Alex Morgan', tasks: 12, avatar: '/api/placeholder/36/36' },
//     { id: 2, name: 'Jamie Wilson', tasks: 8, avatar: '/api/placeholder/36/36' },
//     { id: 3, name: 'Casey Taylor', tasks: 15, avatar: '/api/placeholder/36/36' },
//     { id: 4, name: 'Riley Johnson', tasks: 5, avatar: '/api/placeholder/36/36' }
//   ];

//   // Helper functions
//   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//   const currentMonth = months[currentDate.getMonth()];
//   const currentYear = currentDate.getFullYear();

//   // Get dates for the current week
//   const getCurrentWeekDates = () => {
//     const dates = [];
//     const today = new Date(currentDate);
//     const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

//     // Set to Sunday of this week
//     today.setDate(today.getDate() - currentDay);

//     for (let i = 0; i < 7; i++) {
//       dates.push(today.getDate().toString());
//       today.setDate(today.getDate() + 1);
//     }

//     return dates;
//   };

//   const currentWeekDates = getCurrentWeekDates();

//   // Generate calendar dates for month view
//   const generateCalendarDates = () => {
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();

//     const firstDay = new Date(year, month, 1).getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const daysInPrevMonth = new Date(year, month, 0).getDate();

//     const dates = [];
//     let week = [];

//     // Previous month's dates
//     for (let i = 0; i < firstDay; i++) {
//       week.push((daysInPrevMonth - firstDay + i + 1).toString());
//     }

//     // Current month's dates
//     for (let i = 1; i <= daysInMonth; i++) {
//       week.push(i.toString());
//       if (week.length === 7) {
//         dates.push([...week]);
//         week = [];
//       }
//     }

//     // Next month's dates
//     let nextMonthDay = 1;
//     while (week.length < 7) {
//       week.push(nextMonthDay.toString());
//       nextMonthDay++;
//     }
//     if (week.length > 0) dates.push([...week]);

//     // Ensure we have 6 weeks (some months need 6 rows)
//     while (dates.length < 6) {
//       week = [];
//       for (let i = 0; i < 7; i++) {
//         week.push(nextMonthDay.toString());
//         nextMonthDay++;
//       }
//       dates.push([...week]);
//     }

//     return dates;
//   };

//   const calendarDates = generateCalendarDates();

//   // Time slots for day view
//   const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8);

//   // Check if a date has events
//   const hasEvents = (date) => {
//     return events.some(event => event.date === date);
//   };

//   // Navigation functions
//   const navigateMonth = (direction) => {
//     const newDate = new Date(currentDate);
//     newDate.setMonth(direction === 'prev' ? newDate.getMonth() - 1 : newDate.getMonth() + 1);
//     setCurrentDate(newDate);
//   };

//   const navigateWeek = (direction) => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(direction === 'prev' ? newDate.getDate() - 7 : newDate.getDate() + 7);
//     setCurrentDate(newDate);
//   };

//   // Task functions
//   const addTask = () => {
//     if (newTaskText.trim()) {
//       const newTask = {
//         id: tasks.length + 1,
//         text: newTaskText,
//         completed: false
//       };
//       setTasks([...tasks, newTask]);
//       setNewTaskText('');
//     }
//   };

//   const toggleTask = (taskId) => {
//     setTasks(tasks.map(task =>
//       task.id === taskId ? { ...task, completed: !task.completed } : task
//     ));
//   };

//   // Event functions
//   const handleEventInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewEvent({
//       ...newEvent,
//       [name]: value
//     });
//   };

//   const addEvent = () => {
//     if (newEvent.title && newEvent.time) {
//       const colors = ['bg-blue-100', 'bg-purple-100', 'bg-green-100', 'bg-yellow-100', 'bg-indigo-100'];
//       const randomColor = colors[Math.floor(Math.random() * colors.length)];

//       const event = {
//         id: events.length + 1,
//         title: newEvent.title,
//         time: newEvent.time,
//         date: newEvent.date,
//         attendees: parseInt(newEvent.attendees),
//         category: newEvent.category,
//         color: randomColor
//       };

//       setEvents([...events, event]);
//       setNewEvent({
//         title: '',
//         time: '',
//         date: selectedDate,
//         attendees: 1,
//         category: 'work'
//       });
//       setShowEventForm(false);
//     }
//   };

//   // Render the component
//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64 bg-white border-r border-gray-200">
//         <div className="p-4">
//           <div className="flex items-center gap-3 mb-8">
//             <div className="bg-blue-600 p-2 rounded">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <h1 className="text-xl font-bold">TaskFlow</h1>
//           </div>

//           <nav className="mt-8 space-y-2">
//             <button className={`flex items-center w-full p-3 rounded-lg ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`} onClick={() => setCurrentView('dashboard')}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
//               </svg>
//               Dashboard
//             </button>

//             <button className={`flex items-center w-full p-3 rounded-lg ${currentView === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`} onClick={() => setCurrentView('calendar')}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
//               </svg>
//               Calendar
//             </button>

//             <button className={`flex items-center w-full p-3 rounded-lg ${currentView === 'tasks' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`} onClick={() => setCurrentView('tasks')}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
//                 <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
//               </svg>
//               Tasks
//             </button>

//             <button className={`flex items-center w-full p-3 rounded-lg ${currentView === 'team' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`} onClick={() => setCurrentView('team')}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
//               </svg>
//               Team
//             </button>
//           </nav>
//         </div>

//         {/* Month Calendar */}
//         <div className="mt-6 p-4 border-t border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-semibold text-lg">{currentMonth} {currentYear}</h2>
//             <div className="flex gap-1">
//               <button className="p-1 rounded hover:bg-gray-100" onClick={() => navigateMonth('prev')}>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//               </button>
//               <button className="p-1 rounded hover:bg-gray-100" onClick={() => navigateMonth('next')}>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-7 gap-1 text-center">
//             {daysOfWeek.map(day => (
//               <div key={day} className="text-xs font-medium text-gray-500 py-1">{day.charAt(0)}</div>
//             ))}

//             {/* {calendarDates.map((week, weekIndex) => (
//               week.map((date, dateIndex) => (
//                 <div
//                   key={`${weekIndex}-${dateIndex}`}
//                   className={`text-xs py-2 rounded-full cursor-pointer relative
//                     ${date === selectedDate ? 'bg-blue-600 text-white' : ''}
//                     ${(weekIndex === 0 && parseInt(date) > 20) || (weekIndex >= 4 && parseInt(date) < 10 ? 'text-gray-400' : ''}
//                     hover:bg-gray-100 ${date === selectedDate ? 'hover:bg-blue-600' : ''}`}
//                   onClick={() => setSelectedDate(date)}
//                 >
//                   {date}
//                   {hasEvents(date) && (
//                     <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${date === selectedDate ? 'bg-white' : 'bg-blue-600'}`}></div>
//                   )}
//                 </div>
//               ))

//             ))} */}


// {calendarDates.map((week, weekIndex) => (
//   week.map((date, dateIndex) => {
//     const isSelected = date === selectedDate;
//     const isFromOtherMonth =
//       (weekIndex === 0 && parseInt(date) > 20) ||
//       (weekIndex >= 4 && parseInt(date) < 10);

//     return (
//       <div
//         key={`${weekIndex}-${dateIndex}`}
//         className={`text-xs py-2 rounded-full cursor-pointer relative
//           ${isSelected ? 'bg-blue-600 text-white' : ''}
//           ${isFromOtherMonth ? 'text-gray-400' : ''}
//           hover:bg-gray-100 ${isSelected ? 'hover:bg-blue-600' : ''}`}
//         onClick={() => setSelectedDate(date)}
//       >
//         {date}
//         {hasEvents(date) && (
//           <div
//             className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
//               isSelected ? 'bg-white' : 'bg-blue-600'
//             }`}
//           />
//         )}
//       </div>
//     );
//   })
// ))}

//           </div>
//         </div>

//         {/* Team Section */}
//         <div className="mt-6 p-4 border-t border-gray-200">
//           <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">TEAM</h2>
//           <div className="space-y-3">
//             {team.map(member => (
//               <div key={member.id} className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-xs">
//                     {member.name.charAt(0)}
//                   </div>
//                   <span className="text-sm text-gray-700">{member.name}</span>
//                 </div>
//                 <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-600 rounded-full">{member.tasks}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="bg-white border-b border-gray-200 p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">{currentView === 'calendar' ? 'Calendar' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h1>
//               <p className="mt-1 text-sm text-gray-500">Manage your tasks and schedule efficiently</p>
//             </div>

//             <div className="flex items-center gap-4">
//               <button className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                 </svg>
//               </button>

//               <button className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 relative">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
//                 </svg>
//                 <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
//               </button>

//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
//                   AM
//                 </div>
//                 <span className="font-medium text-sm">Alex Morgan</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Calendar View */}
//         {currentView === 'calendar' && (
//           <div className="flex-1 overflow-auto p-6">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               {/* Calendar Header */}
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-4">
//                   <div className="text-lg font-semibold">
//                     {currentMonth} {currentYear}
//                   </div>
//                   <div className="flex gap-1">
//                     <button className="p-1 rounded hover:bg-gray-100" onClick={() => viewMode === 'month' ? navigateMonth('prev') : navigateWeek('prev')}>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                     </button>
//                     <button className="p-1 rounded hover:bg-gray-100" onClick={() => viewMode === 'month' ? navigateMonth('next') : navigateWeek('next')}>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   <button className={`px-4 py-2 text-sm rounded-md ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setViewMode('month')}>
//                     Month
//                   </button>
//                   <button className={`px-4 py-2 text-sm rounded-md ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setViewMode('week')}>
//                     Week
//                   </button>
//                   <button className={`px-4 py-2 text-sm rounded-md ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setViewMode('day')}>
//                     Day
//                   </button>
//                 </div>

//                 <button
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
//                   onClick={() => setShowEventForm(true)}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//                   </svg>
//                   Add Event
//                 </button>
//               </div>

//               {/* Week View */}
//               {viewMode === 'week' && (
//                 <div>
//                   {/* Days Header */}
//                   <div className="grid grid-cols-7 gap-4 mb-2">
//                     {daysOfWeek.map((day, index) => (
//                       <div key={day} className="text-center">
//                         <div className="text-sm font-medium text-gray-500">{day}</div>
//                         <div className={`text-lg font-semibold mt-1 ${currentWeekDates[index] === selectedDate ? 'text-white bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
//                           {currentWeekDates[index]}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Time Grid */}
//                   <div className="mt-6 relative">
//                     {/* Time Labels */}
//                     <div className="absolute left-0 w-12 top-0 bottom-0">
//                       {timeSlots.map(time => (
//                         <div key={time} className="h-24 border-t border-gray-200 text-xs text-gray-500 text-right pr-2">
//                           {time}:00
//                         </div>
//                       ))}
//                     </div>

//                     {/* Event Grid */}
//                     <div className="ml-12 grid grid-cols-7 gap-2">
//                       {daysOfWeek.map((day, dayIndex) => (
//                         <div key={day} className="relative border-l border-gray-100 first:border-l-0">
//                           {timeSlots.map(time => (
//                             <div key={time} className="h-24 border-t border-gray-200"></div>
//                           ))}

//                           {/* Events */}
//                           {events.filter(event => event.date === currentWeekDates[dayIndex]).map((event) => {
//                             const startTime = parseInt(event.time.split(':')[0]);
//                             const top = (startTime - 8) * 24;
//                             const duration = parseInt(event.time.split(' - ')[1].split(':')[0]) - startTime;
//                             const height = duration * 24;

//                             return (
//                               <div
//                                 key={event.id}
//                                 className={`absolute left-1 right-1 ${event.color} rounded-md p-2 border-l-4 ${event.color.replace('100', '600')}`}
//                                 style={{ top: `${top}px`, height: `${height}px` }}
//                               >
//                                 <div className="text-xs font-medium">{event.title}</div>
//                                 <div className="text-xs text-gray-500">{event.time}</div>
//                                 {event.attendees > 2 && (
//                                   <div className="flex mt-2">
//                                     <div className="flex -space-x-1">
//                                       {Array.from({ length: Math.min(3, event.attendees) }).map((_, i) => (
//                                         <div key={i} className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
//                                           {i === 2 && event.attendees > 3 ? `+${event.attendees - 2}` : ''}
//                                         </div>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Month View */}
//               {viewMode === 'month' && (
//                 <div>
//                   {/* Days Header */}
//                   <div className="grid grid-cols-7 gap-2 mb-2">
//                     {daysOfWeek.map(day => (
//                       <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
//                         {day}
//                       </div>
//                     ))}
//                   </div>

//                   {/* Calendar Grid */}
//                   <div className="grid grid-cols-7 gap-2">
//                     {calendarDates.map((week, weekIndex) => (
//                       week.map((date, dateIndex) => (
//                         <div
//                           key={`${weekIndex}-${dateIndex}`}
//                           className={`min-h-24 p-2 border rounded ${(weekIndex === 0 && parseInt(date) > 20) || (weekIndex >= 4 && parseInt(date) < 10) ? 'bg-gray-50' : ''}`}
//                           onClick={() => setSelectedDate(date)}
//                         >
//                           <div className={`text-sm ${date === selectedDate ? 'font-bold text-blue-600' : ''}`}>
//                             {date}
//                           </div>
//                           <div className="mt-1 space-y-1">
//                             {events.filter(event => event.date === date).slice(0, 2).map(event => (
//                               <div
//                                 key={event.id}
//                                 className={`text-xs p-1 rounded truncate ${event.color}`}
//                               >
//                                 {event.time} {event.title}
//                               </div>
//                             ))}
//                             {events.filter(event => event.date === date).length > 2 && (
//                               <div className="text-xs text-gray-500">
//                                 +{events.filter(event => event.date === date).length - 2} more
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Day View */}
//               {viewMode === 'day' && (
//                 <div className="relative">
//                   {/* Time Labels */}
//                   <div className="absolute left-0 w-12 top-0 bottom-0">
//                     {timeSlots.map(time => (
//                       <div key={time} className="h-24 border-t border-gray-200 text-xs text-gray-500 text-right pr-2">
//                         {time}:00
//                       </div>
//                     ))}
//                   </div>

//                   {/* Event Grid */}
//                   <div className="ml-12">
//                     {timeSlots.map(time => (
//                       <div key={time} className="h-24 border-t border-gray-200"></div>
//                     ))}

//                     {/* Events for selected date */}
//                     {events.filter(event => event.date === selectedDate).map((event) => {
//                       const startTime = parseInt(event.time.split(':')[0]);
//                       const top = (startTime - 8) * 24;
//                       const duration = parseInt(event.time.split(' - ')[1].split(':')[0]) - startTime;
//                       const height = duration * 24;

//                       return (
//                         <div
//                           key={event.id}
//                           className={`absolute left-12 right-0 mx-4 ${event.color} rounded-md p-2 border-l-4 ${event.color.replace('100', '600')}`}
//                           style={{ top: `${top}px`, height: `${height}px` }}
//                         >
//                           <div className="text-sm font-medium">{event.title}</div>
//                           <div className="text-xs text-gray-500">{event.time}</div>
//                           {event.attendees > 2 && (
//                             <div className="flex mt-2">
//                               <div className="flex -space-x-1">
//                                 {Array.from({ length: Math.min(3, event.attendees) }).map((_, i) => (
//                                   <div key={i} className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
//                                     {i === 2 && event.attendees > 3 ? `+${event.attendees - 2}` : ''}
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Tasks View */}
//         {currentView === 'tasks' && (
//           <div className="flex-1 overflow-auto p-6">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h2 className="text-xl font-bold mb-6">My Tasks</h2>

//               <div className="space-y-3">
//                 {tasks.map(task => (
//                   <div key={task.id} className="flex items-center p-3 bg-white border border-gray-200 rounded-md">
//                     <input
//                       type="checkbox"
//                       className="mr-3"
//                       checked={task.completed}
//                       onChange={() => toggleTask(task.id)}
//                     />
//                     <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : ''}`}>
//                       {task.text}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-6 flex gap-2">
//                 <input
//                   type="text"
//                   className="flex-1 p-2 border border-gray-300 rounded-md"
//                   placeholder="Add a new task..."
//                   value={newTaskText}
//                   onChange={(e) => setNewTaskText(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && addTask()}
//                 />
//                 <button
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md"
//                   onClick={addTask}
//                 >
//                   Add Task
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Right Sidebar */}
//       <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-auto">
//         <div className="mb-6">
//           <h2 className="font-semibold text-lg mb-4">Upcoming Events</h2>
//           <div className="space-y-3">
//             {events.map(event => (
//               <div key={event.id} className={`${event.color} p-3 rounded-md border-l-4 ${event.color.replace('100', '600')}`}>
//                 <div className="text-sm font-medium">{event.title}</div>
//                 <div className="text-xs text-gray-500 mt-1">{event.time} - {currentMonth} {event.date}</div>
//                 <div className="flex justify-between items-center mt-2">
//                   <div className="flex -space-x-1">
//                     {Array.from({ length: Math.min(3, event.attendees) }).map((_, i) => (
//                       <div key={i} className="w-5 h-5 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs">
//                         {i === 2 && event.attendees > 3 ? `+${event.attendees - 2}` : ''}
//                       </div>
//                     ))}
//                   </div>
//                   <button className="text-gray-400 hover:text-gray-600">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                       <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h2 className="font-semibold text-lg mb-4">Tasks</h2>
//           <div className="space-y-2">
//             {tasks.map(task => (
//               <div key={task.id} className="flex items-center p-3 bg-white border border-gray-200 rounded-md">
//                 <input
//                   type="checkbox"
//                   className="mr-3"
//                   checked={task.completed}
//                   onChange={() => toggleTask(task.id)}
//                 />
//                 <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : ''}`}>
//                   {task.text}
//                 </span>
//               </div>
//             ))}
//           </div>

//           <div className="mt-4 flex gap-2">
//             <input
//               type="text"
//               className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
//               placeholder="Add a new task..."
//               value={newTaskText}
//               onChange={(e) => setNewTaskText(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && addTask()}
//             />
//             <button
//               className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
//               onClick={addTask}
//             >
//               Add
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Event Form Modal */}
//       {showEventForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">Add New Event</h2>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={newEvent.title}
//                   onChange={handleEventInputChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                 <select
//                   name="date"
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={newEvent.date}
//                   onChange={handleEventInputChange}
//                 >
//                   {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
//                     <option key={day} value={day.toString()}>{day}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                   <input
//                     type="time"
//                     name="time"
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                     value={newEvent.time}
//                     onChange={handleEventInputChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
//                   <select
//                     name="attendees"
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                     value={newEvent.attendees}
//                     onChange={handleEventInputChange}
//                   >
//                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
//                       <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="category"
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={newEvent.category}
//                   onChange={handleEventInputChange}
//                 >
//                   <option value="work">Work</option>
//                   <option value="meeting">Meeting</option>
//                   <option value="personal">Personal</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 className="px-4 py-2 border border-gray-300 rounded-md"
//                 onClick={() => setShowEventForm(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md"
//                 onClick={addEvent}
//               >
//                 Add Event
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }