// import React, { useState } from 'react';
// import { PieChart, Pie, Cell } from 'recharts';
// import { BellIcon, ChevronDownIcon } from 'lucide-react';

// const BookingSummaryHeader = () => {

//   const [query, setQuery] = useState('');

//   const handleChange = (e) => {
//     setQuery(e.target.value);
//   };

//   const data = [
//     { name: 'Paid', value: 10198 },
//     { name: 'Remaining', value: 6723523 - 10198 }
//   ];

//   const COLORS = ['#4CAF50', '#FF6347'];

//   const menuItems = [
//     {    icon: (
//       <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M2.64648 6.53467C2.64648 4.64905 2.64648 3.70624 3.23227 3.12046C3.81805 2.53467 4.76086 2.53467 6.64648 2.53467C8.5321 2.53467 9.47491 2.53467 10.0607 3.12046C10.6465 3.70624 10.6465 4.64905 10.6465 6.53467V8.53467C10.6465 10.4203 10.6465 11.3631 10.0607 11.9489C9.47491 12.5347 8.5321 12.5347 6.64648 12.5347C4.76086 12.5347 3.81805 12.5347 3.23227 11.9489C2.64648 11.3631 2.64648 10.4203 2.64648 8.53467V6.53467Z" stroke="#A6A6A6" stroke-width="1.5"/>
// <path d="M2.64648 19.5347C2.64648 18.6028 2.64648 18.1369 2.79872 17.7693C3.00171 17.2793 3.39106 16.8899 3.88111 16.6869C4.24866 16.5347 4.7146 16.5347 5.64648 16.5347H7.64648C8.57836 16.5347 9.0443 16.5347 9.41185 16.6869C9.9019 16.8899 10.2913 17.2793 10.4942 17.7693C10.6465 18.1369 10.6465 18.6028 10.6465 19.5347C10.6465 20.4666 10.6465 20.9325 10.4942 21.3001C10.2913 21.7901 9.9019 22.1795 9.41185 22.3825C9.0443 22.5347 8.57836 22.5347 7.64648 22.5347H5.64648C4.7146 22.5347 4.24866 22.5347 3.88111 22.3825C3.39106 22.1795 3.00171 21.7901 2.79872 21.3001C2.64648 20.9325 2.64648 20.4666 2.64648 19.5347Z" stroke="#A6A6A6" stroke-width="1.5"/>
// <path d="M14.6465 16.5347C14.6465 14.6491 14.6465 13.7063 15.2323 13.1205C15.8181 12.5347 16.7609 12.5347 18.6465 12.5347C20.5321 12.5347 21.4749 12.5347 22.0607 13.1205C22.6465 13.7063 22.6465 14.6491 22.6465 16.5347V18.5347C22.6465 20.4203 22.6465 21.3631 22.0607 21.9489C21.4749 22.5347 20.5321 22.5347 18.6465 22.5347C16.7609 22.5347 15.8181 22.5347 15.2323 21.9489C14.6465 21.3631 14.6465 20.4203 14.6465 18.5347V16.5347Z" stroke="#A6A6A6" stroke-width="1.5"/>
// <path d="M14.6465 5.53467C14.6465 4.60279 14.6465 4.13685 14.7987 3.7693C15.0017 3.27925 15.3911 2.8899 15.8811 2.68691C16.2487 2.53467 16.7146 2.53467 17.6465 2.53467H19.6465C20.5784 2.53467 21.0443 2.53467 21.4119 2.68691C21.9019 2.8899 22.2913 3.27925 22.4943 3.7693C22.6465 4.13685 22.6465 4.60279 22.6465 5.53467C22.6465 6.46655 22.6465 6.93249 22.4943 7.30004C22.2913 7.79009 21.9019 8.17944 21.4119 8.38243C21.0443 8.53467 20.5784 8.53467 19.6465 8.53467H17.6465C16.7146 8.53467 16.2487 8.53467 15.8811 8.38243C15.3911 8.17944 15.0017 7.79009 14.7987 7.30004C14.6465 6.93249 14.6465 6.46655 14.6465 5.53467Z" stroke="#A6A6A6" stroke-width="1.5"/>
// </svg>

//     ), text: "Summary" },
//     { icon: (
//       <svg width="25" height="27" viewBox="0 0 25 27" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M8.14648 4.28467C8.14648 3.31817 8.92999 2.53467 9.89648 2.53467H15.3965C16.363 2.53467 17.1465 3.31817 17.1465 4.28467C17.1465 5.25117 16.363 6.03467 15.3965 6.03467H9.89648C8.92999 6.03467 8.14648 5.25117 8.14648 4.28467Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linejoin="round"/>
// <path d="M8.15039 6.03467C6.59459 6.08134 5.667 6.25451 5.02516 6.89694C4.14648 7.77644 4.14648 9.19197 4.14648 12.023V18.5291C4.14648 21.3602 4.14648 22.7757 5.02516 23.6552C5.90384 24.5347 7.31806 24.5347 10.1465 24.5347H15.1465C17.9749 24.5347 19.3891 24.5347 20.2678 23.6552C21.1465 22.7757 21.1465 21.3602 21.1465 18.5291V12.023C21.1465 9.19197 21.1465 7.77644 20.2678 6.89695C19.626 6.25451 18.6984 6.08134 17.1426 6.03467" stroke="#A6A6A6" stroke-width="1.5"/>
// <path d="M8.64453 17.868H12.6445M8.64453 12.4513H16.6445" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// </svg>

//     ), text: "Applicant Details" },
//     { icon: (
//       <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M11.6465 6.53467H21.6465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// <path d="M11.6465 12.5347H21.6465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// <path d="M11.6465 18.5347H21.6465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// <path d="M3.64648 7.92753C3.64648 7.92753 4.64648 8.57933 5.14648 9.53467C5.14648 9.53467 6.64648 5.78467 8.64648 4.53467" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M3.64648 18.9276C3.64648 18.9276 4.64648 19.5794 5.14648 20.5347C5.14648 20.5347 6.64648 16.7847 8.64648 15.5347" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>

//     ), text: "Unit Details" },
//     { icon: (
//       <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M20.6625 2.53467C19.5491 2.53467 18.6465 5.22096 18.6465 8.53467H20.6625C21.6341 8.53467 22.1199 8.53467 22.4206 8.19922C22.7214 7.86376 22.669 7.422 22.5643 6.53848C22.2879 4.2061 21.5408 2.53467 20.6625 2.53467Z" stroke="#A6A6A6" stroke-width="1.5"/>
// <path d="M18.6465 8.58893V19.1805C18.6465 20.6922 18.6465 21.448 18.1845 21.7455C17.4296 22.2318 16.2626 21.2121 15.6756 20.842C15.1906 20.5361 14.9482 20.3832 14.679 20.3744C14.3882 20.3648 14.1414 20.5115 13.6174 20.842L11.7065 22.0471C11.191 22.3721 10.9333 22.5347 10.6465 22.5347C10.3597 22.5347 10.1019 22.3721 9.58648 22.0471L7.67561 20.842C7.19063 20.5361 6.94814 20.3832 6.67901 20.3744C6.3882 20.3648 6.14141 20.5115 5.61735 20.842C5.03043 21.2121 3.86335 22.2318 3.10843 21.7455C2.64648 21.448 2.64648 20.6922 2.64648 19.1805V8.58893C2.64648 5.73492 2.64648 4.30792 3.52516 3.4213C4.40384 2.53467 5.81805 2.53467 8.64648 2.53467H20.6465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M6.64648 6.53467H14.6465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M8.64648 10.5347H6.64648" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M13.1465 11.4097C12.3181 11.4097 11.6465 11.9973 11.6465 12.7222C11.6465 13.4471 12.3181 14.0347 13.1465 14.0347C13.9749 14.0347 14.6465 14.6223 14.6465 15.3472C14.6465 16.0721 13.9749 16.6597 13.1465 16.6597M13.1465 11.4097C13.7996 11.4097 14.3552 11.7749 14.5611 12.2847M13.1465 11.4097V10.5347M13.1465 16.6597C12.4934 16.6597 11.9378 16.2945 11.7319 15.7847M13.1465 16.6597V17.5347" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// </svg>

//     ), text: "Cost & Payments" },
//     { icon: (
//       <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M7.64648 11.5347H6.64648C3.33715 11.5347 2.64648 12.2254 2.64648 15.5347V18.5347C2.64648 21.844 3.33715 22.5347 6.64648 22.5347H18.6465C21.9558 22.5347 22.6465 21.844 22.6465 18.5347V15.5347C22.6465 13.3236 22.3382 12.2815 21.1465 11.8334" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M12.6465 18.5347H18.6465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M17.8907 3.66758C18.3378 3.18245 18.5614 2.93989 18.7989 2.79841C19.3721 2.45701 20.078 2.4464 20.6607 2.7704C20.9022 2.90468 21.1327 3.14042 21.5935 3.61188C22.0544 4.08335 22.2848 4.31908 22.4161 4.56616C22.7328 5.16234 22.7224 5.88438 22.3887 6.47078C22.2504 6.7138 22.0133 6.9425 21.5391 7.3999L15.8969 12.8422C14.4021 14.284 13.4762 14.583 11.4057 14.5288C11.0298 14.5189 10.8419 14.514 10.7327 14.3898C10.6234 14.2657 10.6383 14.074 10.6681 13.6905C10.8057 11.9228 11.1171 11.0171 12.3202 9.71173L17.8907 3.66758Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linejoin="round"/>
// </svg>

//     ), text: "Documents" },
//     { icon: (
//       <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M2.64648 5.03467H9.40384C10.1995 5.03467 10.9626 5.35074 11.5252 5.91335L14.6465 9.03467" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M5.64648 14.0347H2.64648" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M9.14648 8.03467L11.1465 10.0347C11.6988 10.587 11.6988 11.4824 11.1465 12.0347C10.5942 12.587 9.69877 12.587 9.14648 12.0347L7.64648 10.5347C6.78579 11.3954 5.42319 11.4922 4.44942 10.7619L4.14648 10.5347" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M5.64648 11.5347V16.0347C5.64648 17.9203 5.64648 18.8631 6.23227 19.4489C6.81805 20.0347 7.76086 20.0347 9.64648 20.0347H18.6465C20.5321 20.0347 21.4749 20.0347 22.0607 19.4489C22.6465 18.8631 22.6465 17.9203 22.6465 16.0347V13.0347C22.6465 11.1491 22.6465 10.2062 22.0607 9.62046C21.4749 9.03467 20.5321 9.03467 18.6465 9.03467H10.1465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M15.8965 14.5347C15.8965 15.5012 15.113 16.2847 14.1465 16.2847C13.18 16.2847 12.3965 15.5012 12.3965 14.5347C12.3965 13.5682 13.18 12.7847 14.1465 12.7847C15.113 12.7847 15.8965 13.5682 15.8965 14.5347Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>

//     ), text: "Loan Details" },

//     { icon: (
//       <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M19.6465 11.0347V10.5347C19.6465 6.76343 19.6465 4.87782 18.4749 3.70624C17.3034 2.53467 15.4177 2.53467 11.6465 2.53467C7.87524 2.53467 5.98963 2.53467 4.81805 3.70624C3.64648 4.87782 3.64648 6.76343 3.64648 10.5347V16.5347C3.64648 18.3985 3.64648 19.3303 3.95096 20.0654C4.35694 21.0455 5.13563 21.8242 6.11575 22.2302C6.85083 22.5347 7.78271 22.5347 9.64648 22.5347" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M7.64648 7.53467H15.6465M7.64648 11.5347H11.6465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// <path d="M15.929 19.5391C15.87 18.6504 15.7645 17.7005 15.3282 16.6264C14.956 15.7103 15.0597 13.5552 17.1465 13.5552C19.2333 13.5552 19.3129 15.7103 18.9407 16.6264C18.5043 17.7005 18.423 18.6504 18.364 19.5391M21.6465 22.5347H12.6465V21.289C12.6465 20.8425 12.9129 20.4501 13.2993 20.3275L15.5541 19.6117C15.7149 19.5606 15.8813 19.5347 16.0486 19.5347H18.2444C18.4117 19.5347 18.5781 19.5606 18.7389 19.6117L20.9937 20.3275C21.3801 20.4501 21.6465 20.8425 21.6465 21.289V22.5347Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>

//     ), text: "Brokerage Details" },
//     { icon: (
//       <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M3.14648 12.5347C3.14648 8.05633 3.14648 5.81716 4.53772 4.42591C5.92897 3.03467 8.16814 3.03467 12.6465 3.03467C17.1248 3.03467 19.364 3.03467 20.7553 4.42591C22.1465 5.81716 22.1465 8.05633 22.1465 12.5347C22.1465 17.013 22.1465 19.2522 20.7553 20.6435C19.364 22.0347 17.1248 22.0347 12.6465 22.0347C8.16814 22.0347 5.92897 22.0347 4.53772 20.6435C3.14648 19.2522 3.14648 17.013 3.14648 12.5347Z" stroke="#A6A6A6" stroke-width="1.5"/>
// <path d="M11.6465 7.53467H17.6465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// <path d="M7.64648 7.53467H8.64648" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// <path d="M7.64648 12.5347H8.64648" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// <path d="M7.64648 17.5347H8.64648" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// <path d="M11.6465 12.5347H17.6465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// <path d="M11.6465 17.5347H17.6465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// </svg>

//     ), text: "Tasks" },
//     { icon: (
//       <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M15.6465 9.53467L9.64648 15.5343M15.6465 15.5347L9.64648 9.53506" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M3.14648 12.5347C3.14648 8.05633 3.14648 5.81716 4.53772 4.42591C5.92897 3.03467 8.16814 3.03467 12.6465 3.03467C17.1248 3.03467 19.364 3.03467 20.7553 4.42591C22.1465 5.81716 22.1465 8.05633 22.1465 12.5347C22.1465 17.013 22.1465 19.2522 20.7553 20.6435C19.364 22.0347 17.1248 22.0347 12.6465 22.0347C8.16814 22.0347 5.92897 22.0347 4.53772 20.6435C3.14648 19.2522 3.14648 17.013 3.14648 12.5347Z" stroke="#A6A6A6" stroke-width="1.5"/>
// </svg>

//     ), text: "Cancel Booking" },
//     { icon: (
//       <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M12.6465 22.5347C18.1693 22.5347 22.6465 18.0575 22.6465 12.5347C22.6465 7.01182 18.1693 2.53467 12.6465 2.53467C7.12364 2.53467 2.64648 7.01182 2.64648 12.5347C2.64648 18.0575 7.12364 22.5347 12.6465 22.5347Z" stroke="#A6A6A6" stroke-width="1.5"/>
// <path d="M10.1465 10.0347L13.6464 13.5343M16.6465 8.53467L11.6465 13.5347" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>

//     ), text: "Timeline" },
//     { icon: (
//       <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M14.1465 20.5347C14.1465 20.5347 15.1465 20.5347 16.1465 22.5347C16.1465 22.5347 19.323 17.5347 22.1465 16.5347" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// <path d="M7.64648 16.5347H11.6465M7.64648 11.5347H15.6465" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// <path d="M7.14649 4.03467C5.59069 4.08134 4.6631 4.25451 4.02126 4.89694C3.14258 5.77644 3.14258 7.19197 3.14258 10.023V16.5291C3.14258 19.3602 3.14258 20.7757 4.02126 21.6552C4.89994 22.5347 6.31416 22.5347 9.14258 22.5347H11.6426M16.1387 4.03467C17.6945 4.08134 18.6221 4.25451 19.2639 4.89695C20.1426 5.77644 20.1426 7.19197 20.1426 10.023V14.0347" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round"/>
// <path d="M7.14258 4.28467C7.14258 3.31817 7.92609 2.53467 8.89258 2.53467H14.3926C15.3591 2.53467 16.1426 3.31817 16.1426 4.28467C16.1426 5.25117 15.3591 6.03467 14.3926 6.03467H8.89258C7.92609 6.03467 7.14258 5.25117 7.14258 4.28467Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linejoin="round"/>
// </svg>

//     ), text: "Unit Audit" }
//   ];

//   return (
//     <div className="bg-gray-50 p-6 max-w-[870px] mx-auto">
//       {/* Header Section */}
//       <div className="flex gap-8 items-center mb-6">

// <div className="bg-[#E6F3FC] p-4 rounded-lg flex items-center space-x-4">
//     <div className="bg-white p-4 rounded-[18px] flex flex-col items-center justify-center w-20 h-20">
//       <span className="text-2xl font-bold">11</span>
//       <span className="text-xs text-[#000]">Unit no</span>
//     </div>
//     <div className="flex flex-col ml-4 space-y-2">
//       <span className="text-xs font-semibold">Test</span>
//       <div className="flex space-x-2 items-center">
//         <span className="bg-white p-1 py-1  rounded-lg text-xs w-20 text-center">1,200 sqft</span>
//         <div className="bg-white p-1 rounded-lg text-xs w-20 text-center flex items-center justify-center space-x-1">
//           <span>East</span>
//           <svg
//             width="19"
//             height="19"
//             viewBox="0 0 19 19"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M5.89648 13.4346V7.97028C5.89648 7.63636 6.01538 7.35049 6.25318 7.1127C6.49098 6.8749 6.77684 6.756 7.11077 6.756H12.0893L11.1179 5.78457L11.9679 4.93457L14.3965 7.36314L11.9679 9.79171L11.1179 8.94171L12.0893 7.97028H7.11077V13.4346H5.89648Z"
//               fill="#484848"
//             />
//           </svg>
//         </div>
//       </div>
//       <div className="flex items-center space-x-2">
//         <span className="bg-white p-1 px-2 rounded-lg text-xs">Booked: 18-Aug</span>
//       </div>
//     </div>
//   </div>

//   <div className="flex space-x-4 bg-[#E6F3FC] p-8 rounded-lg">
//     <div className="relative inline-block text-left">
//       <button className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm px-4 py-3 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
//         CRM Owner
//         <svg
//           className="ml-8 h-5 w-5"
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//           aria-hidden="true"
//         >
//           <path
//             fillRule="evenodd"
//             d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>
//     </div>

//     <div className="relative inline-block text-left">
//       <button className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm px-4 py-3 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
//         Status
//         <svg
//           className="ml-8 h-5 w-5"
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//           aria-hidden="true"
//         >
//           <path
//             fillRule="evenodd"
//             d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>
//     </div>

//     <button className="bg-white border border-gray-300 rounded-full py-3 px-4 text-xs flex items-center">
//       <svg
//         width="18"
//         className="mr-2"
//         height="18"
//         viewBox="0 0 23 23"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           d="M1.64648 8.10124H21.6465M8.31315 21.4346V8.10124M3.86871 1.43457H19.4243C20.6516 1.43457 21.6465 2.42949 21.6465 3.65679V19.2123C21.6465 20.4396 20.6516 21.4346 19.4243 21.4346H3.86871C2.64141 21.4346 1.64648 20.4396 1.64648 19.2123V3.65679C1.64648 2.42949 2.64141 1.43457 3.86871 1.43457Z"
//           stroke="#3E3E3E"
//           strokeWidth="1.44444"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//       Payment
//     </button>
//   </div>
//       </div>

// <div className='bg-[#E6F3FC] p-8  rounded-lg'>

// <div className="grid bg-[#E6F3FC]  rounded-lg grid-cols-3 gap-4 mb-3">
//   <div className="bg-white p-4 rounded-lg">
//     <div className="flex justify-between ">
//       <span className="font-medium">Stage Balance</span>
//       <span className='font-semibold'>...</span>
//     </div>
//     <div className="relative flex justify-center items-center">
//       <PieChart width={200} height={200}>
//         <Pie
//           data={data}
//           cx={100}
//           cy={100}
//           innerRadius={60}
//           outerRadius={80}
//           startAngle={90}
//           endAngle={-270}
//           dataKey="value"
//         >
//           <Cell fill="#00D4FF" />
//           <Cell fill="#E5E7EB" />
//         </Pie>
//       </PieChart>
//       {/* Centered Text */}
//       <div className="absolute text-center">
//         <div className="text-xs text-gray-500">Amount Borrowed</div>
//         <div className="font-bold">₹ 67,23,523</div>
//       </div>
//     </div>
//     <div className="text-center">
//       <div className="text-sm text-gray-500">Paid</div>
//       <div className="font-bold">₹ 10,198</div>
//     </div>
//   </div>

//   <div className="bg-white  p-4 rounded-lg">
//     <div className="flex justify-between items-center">
//       <span className="font-medium">Cost sheet</span>
//       <ChevronDownIcon size={16} className="ml-2" />
//     </div>
//     <div className="relative flex justify-center items-center">
//       <PieChart width={200} height={200}>
//         <Pie
//           data={data}
//           cx={100}
//           cy={100}
//           innerRadius={60}
//           outerRadius={80}
//           startAngle={90}
//           endAngle={-270}
//           dataKey="value"
//         >
//           <Cell fill="#00D4FF" />
//           <Cell fill="#E5E7EB" />
//         </Pie>
//       </PieChart>
//          {/* <PieChart width={400} height={400}>
//         <Pie data={data} dataKey="value" innerRadius={60} outerRadius={80} fill="#8884d8">
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//       </PieChart> */}
//       {/* Centered Text */}
//       <div className="absolute text-center">
//         <div className="text-xs text-gray-500">Amount Borrowed</div>
//         <div className="font-bold">₹ 67,23,523</div>
//       </div>
//     </div>
//     <div className="text-center">
//       <div className="text-sm text-gray-500">Paid</div>
//       <div className="font-bold">₹ 10,198</div>
//     </div>
//   </div>

//   <div className="bg-white p-4 rounded-lg">
//     {/* <div className="flex justify-between">
//       <span className="font-medium">Payment schedule</span>
//       <BellIcon size={16} />
//     </div> */}
//     <div className="flex justify-between items-center">
//   <span className="font-medium">Payment schedule</span>
//   <BellIcon size={16} className="ml-2" />
// </div>

//     <div className="flex flex-col items-center mt-8">
//       <div className="text-sm text-gray-500 mb-2">Amount Borrowed</div>
//       <div className="font-bold mb-4">₹ 67,23,523</div>
//       <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
//         <div className="bg-cyan-400 h-2 rounded-full w-1/3"></div>
//       </div>
//       <div className="text-sm text-gray-500 mb-2">Received</div>
//       <div className="font-bold">₹ 10,198</div>
//     </div>
//   </div>

// </div>

// <div className="bg-white   rounded-xl shadow-sm">
//       <div className="border rounded-xl">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
//               <h3 className="font-semibold">Activity</h3>
//             </div>
//             <div className="flex gap-2">
//             <button className="px-2 py-1 border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition-colors">
//             <svg width="5" height="17" viewBox="0 0 5 17" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M2.64648 16.5347C2.09648 16.5347 1.62565 16.3388 1.23398 15.9472C0.842318 15.5555 0.646484 15.0847 0.646484 14.5347C0.646484 13.9847 0.842318 13.5138 1.23398 13.1222C1.62565 12.7305 2.09648 12.5347 2.64648 12.5347C3.19648 12.5347 3.66732 12.7305 4.05898 13.1222C4.45065 13.5138 4.64648 13.9847 4.64648 14.5347C4.64648 15.0847 4.45065 15.5555 4.05898 15.9472C3.66732 16.3388 3.19648 16.5347 2.64648 16.5347ZM2.64648 10.5347C2.09648 10.5347 1.62565 10.3388 1.23398 9.94717C0.842318 9.5555 0.646484 9.08467 0.646484 8.53467C0.646484 7.98467 0.842318 7.51383 1.23398 7.12217C1.62565 6.7305 2.09648 6.53467 2.64648 6.53467C3.19648 6.53467 3.66732 6.7305 4.05898 7.12217C4.45065 7.51383 4.64648 7.98467 4.64648 8.53467C4.64648 9.08467 4.45065 9.5555 4.05898 9.94717C3.66732 10.3388 3.19648 10.5347 2.64648 10.5347ZM2.64648 4.53467C2.09648 4.53467 1.62565 4.33883 1.23398 3.94717C0.842318 3.5555 0.646484 3.08467 0.646484 2.53467C0.646484 1.98467 0.842318 1.51383 1.23398 1.12217C1.62565 0.730501 2.09648 0.534668 2.64648 0.534668C3.19648 0.534668 3.66732 0.730501 4.05898 1.12217C4.45065 1.51383 4.64648 1.98467 4.64648 2.53467C4.64648 3.08467 4.45065 3.5555 4.05898 3.94717C3.66732 4.33883 3.19648 4.53467 2.64648 4.53467Z" fill="#5F6368"/>
// </svg>

//               </button>
//               <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
//                 All actions
//               </button>
//               <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
//                 Filter
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
//               <div className="flex items-center border rounded-md bg-white shadow-md w-full max-w-md mx-auto">
//       <span className="material-icons text-gray-500 ml-3">search</span>
//       <input
//         type="text"
//         value={query}
//         onChange={handleChange}
//         placeholder="Search..."
//         className="flex-grow py-2 px-3 outline-none border-none text-gray-700"
//       />
//     </div>
//             </div>
//             <div className="flex gap-2">
//               <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
//               Booked
//               </button>
//               <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
//               Review
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>

// </div>

//       <div className="bg-[#E6F3FC] p-4 rounded-lg mt-5">
//         <div className="space-y-4">
//           {menuItems.map((item, index) => (
//             <div
//               key={index}
//               className="flex items-center gap-3 text-gray-500 hover:bg-gray-50 p-2 rounded cursor-pointer w-60"
//             >
//               <span>{item.icon}</span>
//               <span className='mt-[2px]'>{item.text}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingSummaryHeader;
