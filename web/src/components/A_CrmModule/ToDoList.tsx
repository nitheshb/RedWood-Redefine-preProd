import React, { useState } from 'react';

const ToDoList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
    { id: 2, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
    { id: 3, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
    { id: 4, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
    { id: 5, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
    { id: 6, text: 'Need to call contractor and update about Plastering and budget', date: '20 Mar 2025', priority: 'High Priority', completed: false },
  ]);
  
  const [activeTab, setActiveTab] = useState('ALL');
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('High Priority');
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const priorityOptions = [
    { value: 'High Priority', color: 'bg-red-100 text-red-800' },
    { value: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Low Priority', color: 'bg-green-100 text-green-800' },
    { value: 'No Priority', color: 'bg-gray-100 text-gray-800' }
  ];
  
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
  
  return (
    <div className="max-w-full mr-6 mx-auto p-6 bg-white rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">TO DO LIST</h1>
      
      <div className="flex space-x-4 mb-8">
        <div 
          className={`flex items-center space-x-2 cursor-pointer ${activeTab === 'ALL' ? 'text-violet-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('ALL')}
        >
          <div className={`w-6 h-12 rounded ${activeTab === 'ALL' ? 'bg-violet-200' : 'bg-gray-200'}`}></div>
          <span className="font-medium">ALL</span>
          <span className="bg-violet-100 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
            {tasks.length}
          </span>
        </div>
        
        <div 
          className={`flex items-center space-x-2 cursor-pointer ${activeTab === 'TO DO' ? 'text-violet-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('TO DO')}
        >
          <div className={`w-6 h-12 rounded ${activeTab === 'TO DO' ? 'bg-violet-200' : 'bg-gray-200'}`}></div>
          <span className="font-medium">TO DO</span>
          <span className="bg-violet-100 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
            {tasks.filter(task => !task.completed).length}
          </span>
        </div>
        
        <div 
          className={`flex items-center space-x-2 cursor-pointer ${activeTab === 'COMPLETED' ? 'text-violet-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('COMPLETED')}
        >
          <div className={`w-6 h-12 rounded ${activeTab === 'COMPLETED' ? 'bg-violet-200' : 'bg-gray-200'}`}></div>
          <span className="font-medium">COMPLETED</span>
          <span className="bg-violet-100 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
            {tasks.filter(task => task.completed).length}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredTasks().map(task => (
          <div key={task.id} className="p-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-gray-500">{task.date}</div>
                <div className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.text}
                </div>
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
        
        {isAddingTask ? (
          <div className="p-4 border-b">
            <div className="mb-4">
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter task"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map(option => (
                  <button
                    key={option.value}
                    className={`${option.color} px-3 py-1 rounded-full text-xs ${newTaskPriority === option.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    onClick={() => setNewTaskPriority(option.value)}
                  >
                    {option.value}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setIsAddingTask(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={addNewTask}
              >
                Add Task
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-full p-3 border-2 border-dashed border-gray-300 text-gray-500 rounded flex items-center justify-center"
            onClick={() => setIsAddingTask(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Task
          </button>
        )}
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





