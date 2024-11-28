import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, ChevronsUpDown, MoveDown, MoveUp } from 'lucide-react';

const CRMInventoryReport = () => {
  const [projects, setProjects] = useState([
    { name: 'Test_1', totalUnits: 100, available: 20, sold: 60, blocked: 10, mortgaged: 10 },
    { name: 'A', totalUnits: 80, available: 10, sold: 50, blocked: 15, mortgaged: 5 },
    { name: 'B', totalUnits: 90, available: 30, sold: 40, blocked: 10, mortgaged: 10 },
    { name: 'C', totalUnits: 75, available: 25, sold: 40, blocked: 5, mortgaged: 5 },
    { name: 'D', totalUnits: 110, available: 35, sold: 50, blocked: 15, mortgaged: 10 },
    { name: 'E', totalUnits: 95, available: 20, sold: 55, blocked: 10, mortgaged: 10 },
    { name: 'F', totalUnits: 85, available: 15, sold: 50, blocked: 15, mortgaged: 5 },
    { name: 'G', totalUnits: 70, available: 10, sold: 50, blocked: 5, mortgaged: 5 },
    { name: 'H', totalUnits: 60, available: 15, sold: 30, blocked: 10, mortgaged: 5 },
    { name: 'I', totalUnits: 100, available: 20, sold: 60, blocked: 15, mortgaged: 5 },
  ]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedProjects = React.useMemo(() => {
    if (!sortConfig.key) return projects;

    return [...projects].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [projects, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="p-4 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-800">CRM Inventory Report</h1>
      </div>

      <div className="w-full bg-white rounded-lg overflow-hidden shadow-md">
        <div className="bg-[#F8F9FC] p-4 rounded-t-lg">
          <h2 className="text-lg text-center font-medium text-[#000000]">
            Inventory Summary Report By Project
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse rounded-lg">
            <thead>
              <tr className="bg-[#F8F9FC] border-t border-b border-[#E8ECF4]">
                {['name', 'totalUnits', 'available', 'sold', 'blocked', 'mortgaged'].map((key) => (
                  <th
                    key={key}
                    className="text-left p-2 font-medium text-[#000000] whitespace-nowrap border-r border-[#E8ECF4] cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    {key === 'name' ? 'Project Name' : key.charAt(0).toUpperCase() + key.slice(1)}
                    <span className="inline-block ml-2">
                      {sortConfig.key === key ? (
                        sortConfig.direction === 'asc' ? (
                          <MoveUp  className="w-4 h-4 text-gray-600" />
                        ) : (
                          <MoveDown  className="w-4 h-4 text-gray-600" />
                        )
                      ) : (
                        <ArrowUpDown  className="w-4 h-4 text-gray-400" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((project, index) => (
                <tr
                  key={`${project.name}-${index}`} // Unique key
                  className="hover:bg-gray-50 border-b border-[#E8ECF4]"
                >
                  <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{project.name}</td>
                  <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">
                    {project.totalUnits}
                  </td>
                  <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">
                    {project.available}
                  </td>
                  <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{project.sold}</td>
                  <td className="p-4 text-gray-700 border-r border-[#E8ECF4]">{project.blocked}</td>
                  <td className="p-4 text-gray-700">{project.mortgaged}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CRMInventoryReport;


