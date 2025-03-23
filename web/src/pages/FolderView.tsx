// import React from 'react';

// const FolderView = ({ title, items, onItemClick, onBack }) => {
//   return (
//     <div>
//       <h2 className="text-lg font-bold mb-4">{title}</h2>
//       <p className="text-gray-600 mb-2">Total Projects: {items.length}</p>

//       {onBack && (
//         <button onClick={onBack} className="bg-gray-200 px-4 py-2 rounded mb-4">
//           Back
//         </button>
//       )}
//       <div className="grid grid-cols-3 gap-4">
//         {items.map((item, index) => (
//           <div
//             key={index}
//             onClick={() => onItemClick(item)}
//             className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
//           >
//             <h3 className="font-semibold">{item.projectName || item.blockName || item.unit_no}</h3>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FolderView;




import React from 'react';


 import folder from '../../public/folder.png'


const FolderView = ({ title, items, onItemClick, onBack }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <p className="text-gray-600 mb-2">Total Projects: {items.length}</p>

      {onBack && (
        <button onClick={onBack} className="bg-gray-200 px-4 py-2 rounded mb-4">
          Back
        </button>
      )}
      
      <div className="grid grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => onItemClick(item)}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 flex items-center gap-3"
          >
   
            <span className="text-2xl">📁</span>
            {/* <img src={folder} alt="Folder" className="w-10 h-10" /> */}

            
      
            <h3 className="font-semibold">{item.projectName || item.blockName || item.unit_no}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderView;
