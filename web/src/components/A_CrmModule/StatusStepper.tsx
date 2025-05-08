// // import React from "react";

// // const BookingProgressCard = () => {
// //   return (
// //     <div className="bg-white rounded-xl shadow-sm p-6">
// //       {/* Header Section */}
// //       <div className="flex justify-between items-center mb-6">
// //         <div className="flex items-center space-x-4">
// //           <div className="w-20 h-20 bg-purple-100 rounded-full flex flex-col justify-center items-center">
// //             <span className="text-sm font-medium text-gray-600">Unit No</span>
// //             <span className="text-2xl font-bold text-purple-700">132</span>
// //           </div>
// //           <div>
// //             <h2 className="text-lg font-semibold">S. Vishal Kumar</h2>
// //             <div className="text-sm text-gray-500 space-x-4">
// //               <span>Size: 1,365 sqft</span>
// //               <span>BUA: 1,365 sqft</span>
// //               <span>Facing: North</span>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="flex items-center space-x-4">
// //           <select className="border px-4 py-2 rounded-md text-sm">
// //             <option>CRM Owner</option>
// //           </select>
// //           <select className="border px-4 py-2 rounded-md text-sm">
// //             <option>Booking Review</option>
// //           </select>
// //           <button className="bg-purple-600 text-white px-6 py-2 rounded-md text-sm font-medium">
// //             Capture Payment
// //           </button>
// //         </div>
// //       </div>

// //       {/* Timeline */}
// //       {/* <div className="mt-4 border-t pt-6">
// //         <div className="flex justify-between items-center text-center">
// //           {[
// //             {
// //               title: "Booked",
// //               date: "Mar 20-2025",
// //               status: "completed",
// //             },
// //             {
// //               title: "Allotment",
// //               date: "Mar 20-2025",
// //               status: "completed",
// //             },
// //             {
// //               title: "Agreement",
// //               status: "delayed",
// //               delayText: "Delayed by 3 Days",
// //             },
// //             {
// //               title: "Registered",
// //               status: "upcoming",
// //               delayText: "In 77 Days",
// //             },
// //             {
// //               title: "Possession",
// //               status: "upcoming",
// //               delayText: "In 130 Days",
// //             },
// //           ].map((step, index) => (
// //             <div key={index} className="flex-1 relative">
// //               <div
// //                 className={`w-8 h-8 rounded-full mx-auto mb-2 ${
// //                   step.status === "completed"
// //                     ? "bg-purple-600 text-white"
// //                     : "border border-gray-400"
// //                 } flex items-center justify-center`}
// //               >
// //                 {step.status === "completed" ? "✓" : "●"}
// //               </div>
// //               <p className="text-sm font-medium text-gray-700">
// //                 {step.title}
// //               </p>
// //               {step.date && (
// //                 <p className="text-sm text-green-600 mt-1">{step.date}</p>
// //               )}
// //               {step.delayText && (
// //                 <p
// //                   className={`text-sm mt-1 ${
// //                     step.status === "delayed"
// //                       ? "text-red-600"
// //                       : "text-gray-600"
// //                   }`}
// //                 >
// //                   {step.delayText}
// //                 </p>
// //               )}
        
// //               {index < 4 && (
// //                 <div className="absolute top-4 right-0 left-[50%] h-0.5 bg-gray-300 z-[-1]"></div>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       </div> */}


// //       {/* Timeline */}
// // <div className="mt-4 border-t pt-6">
// //   <div className="flex items-center justify-between relative">
// //     {[
// //       {
// //         title: "Booked",
// //         date: "Mar 20-2025",
// //         status: "completed",
// //       },
// //       {
// //         title: "Allotment",
// //         date: "Mar 20-2025",
// //         status: "completed",
// //       },
// //       {
// //         title: "Agreement",
// //         status: "delayed",
// //         delayText: "Delayed by 3 Days",
// //       },
// //       {
// //         title: "Registered",
// //         status: "upcoming",
// //         delayText: "In 77 Days",
// //       },
// //       {
// //         title: "Possession",
// //         status: "upcoming",
// //         delayText: "In 130 Days",
// //       },
// //     ].map((step, index, arr) => (
// //       <div key={index} className="relative flex-1 flex flex-col items-center">
// //         {/* Connector line (except first) */}
// //         {index !== 0 && (
// //           <div
// //             className={`absolute top-4 -left-1/2 w-full h-0.5 z-[-1] ${
// //               arr[index - 1].status === "completed"
// //                 ? "bg-purple-600"
// //                 : "bg-gray-300"
// //             }`}
// //           ></div>
// //         )}

// //         {/* Circle */}
// //         <div
// //           className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-sm ${
// //             step.status === "completed"
// //               ? "bg-purple-600 text-white"
// //               : "border border-gray-400 text-gray-600"
// //           }`}
// //         >
// //           {step.status === "completed" ? "✓" : "●"}
// //         </div>

// //         {/* Title */}
// //         <p className="text-sm font-medium text-gray-700">{step.title}</p>

// //         {/* Date or Delay */}
// //         {step.date && (
// //           <p className="text-sm text-green-600 mt-1">{step.date}</p>
// //         )}
// //         {step.delayText && (
// //           <p
// //             className={`text-sm mt-1 ${
// //               step.status === "delayed"
// //                 ? "text-red-600"
// //                 : "text-gray-600"
// //             }`}
// //           >
// //             {step.delayText}
// //           </p>
// //         )}
// //       </div>
// //     ))}
// //   </div>
// // </div>

// //     </div>
// //   );
// // };

// // export default BookingProgressCard;















// // import React from "react";

// // const steps = [
// //   {
// //     title: "Booked",
// //     date: "Mar 20-2025",
// //     status: "completed",
// //   },
// //   {
// //     title: "Allotment",
// //     date: "Mar 20-2025",
// //     status: "completed",
// //   },
// //   {
// //     title: "Agreement",
// //     delayText: "Delayed by 3 Days",
// //     status: "delayed",
// //   },
// //   {
// //     title: "Registered",
// //     delayText: "In 77 Days",
// //     status: "upcoming",
// //   },
// //   {
// //     title: "Possession",
// //     delayText: "In 130 Days",
// //     status: "upcoming",
// //   },
// // ];

// // const Timelines = () => {
// //   return (
// //     <div className="mt-6 px-4">
// //       <div className="flex items-center justify-between relative w-full">
// //         {steps.map((step, index) => (
// //           <div key={index} className="flex flex-col items-center w-full relative">
// //             {/* Horizontal line (between circles) */}
// //             {index !== 0 && (
// //               <div
// //                 className={`absolute top-4 left-[-50%] w-full h-1 ${
// //                   steps[index - 1].status === "completed"
// //                     ? "bg-purple-600"
// //                     : "bg-gray-300"
// //                 }`}
// //               />
// //             )}

// //             {/* Circle */}
// //             <div
// //               className={`w-8 h-8 rounded-full z-10 flex items-center justify-center text-sm mb-2 ${
// //                 step.status === "completed"
// //                   ? "bg-purple-600 text-white"
// //                   : "border border-gray-400 text-gray-600 bg-white"
// //               }`}
// //             >
// //               {step.status === "completed" ? "✓" : "●"}
// //             </div>

// //             {/* Title */}
// //             <div className="text-sm font-medium text-gray-800">{step.title}</div>

// //             {/* Date or Delay Text */}
// //             <div
// //               className={`text-sm mt-1 ${
// //                 step.date
// //                   ? "text-green-600"
// //                   : step.status === "delayed"
// //                   ? "text-red-600"
// //                   : "text-gray-600"
// //               }`}
// //             >
// //               {step.date || step.delayText}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Timelines;






// import React from "react";

// const steps = [
//   {
//     title: "Booked",
//     date: "Mar 20-2025",
//     status: "completed",
//   },
//   {
//     title: "Allotment",
//     date: "Mar 20-2025",
//     status: "completed",
//   },
//   {
//     title: "Agreement",
//     delayText: "Delayed by 3 Days",
//     status: "completed",
//   },
//   {
//     title: "Registered",
//     delayText: "In 77 Days",
//     status: "upcoming",
//   },
//   {
//     title: "Possession",
//     delayText: "In 130 Days",
//     status: "upcoming",
//   },
// ];

// const Timelines = () => {
//   return (
//     <div className="w-full px-6 py-4">
//       <div className="relative flex items-center justify-between w-full">
//         {steps.map((step, index) => (
//           <div key={index} className="flex flex-col items-center relative w-full">

//             {index !== steps.length - 1 && (
//               <div className="absolute top-4 left-1/2 w-full h-0.5 z-0">
//                 <div
//                   className={`w-full h-full ${
//                     step.status === "completed" ? "bg-purple-600" : "bg-gray-300"
//                   }`}
//                 />
//               </div>
//             )}

//             <div
//               className={`w-8 h-8 rounded-full z-10 flex items-center justify-center text-sm mb-2 ${
//                 step.status === "completed"
//                   ? "bg-purple-600 text-white"
//                   : "border border-gray-400 text-gray-600 bg-white"
//               }`}
//             >
//               {step.status === "completed" ? "✓" : "●"}
//             </div>


//             <div className="text-sm font-medium text-gray-800">{step.title}</div>


//             <div
//               className={`text-sm mt-1 ${
//                 step.date
//                   ? "text-green-600"
//                   : step.status === "delayed"
//                   ? "text-red-600"
//                   : "text-gray-600"
//               }`}
//             >
//               {step.date || step.delayText}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>























//   );
// };

// export default Timelines;
