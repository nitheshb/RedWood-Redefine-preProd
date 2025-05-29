import React, { useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useAuth } from 'src/context/firebase-auth-context'

// Mock data for demonstration

const StarRating = ({ value, max = 5 }) => {
  const percentage = (value / 100) * max;
  const fullStars = Math.floor(percentage);
  const hasHalfStar = percentage % 1 !== 0;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(max)].map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${
            index < fullStars
              ? 'text-amber-400 fill-current'
              : index === fullStars && hasHalfStar
              ? 'text-amber-400 fill-current opacity-50'
              : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'hot lead':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warm lead':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'new lead':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cold lead':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const TimeDisplay = ({ timestamp }) => {
  if (!timestamp) return <span className="text-gray-400">-</span>;

  const now = Date.now();
  const diff = Math.abs(now - timestamp);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const isOverdue = timestamp < now;
  const colorClass = isOverdue ? 'text-red-600' : 'text-green-600';

  let timeText;
  if (days > 0) {
    timeText = `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    timeText = `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    timeText = `${minutes} min${minutes > 1 ? 's' : ''}`;
  }

  return (
    <span className={`text-sm font-medium ${colorClass}`}>
      {timeText} {isOverdue ? 'ago' : 'left'}
    </span>
  );
};

const SearchBar = ({ searchTerm, onSearchChange, totalResults }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="relative flex-1 max-w-md">
        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div> */}
        {/* <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        /> */}
      </div>
      <div className="flex items-center space-x-4 ml-4">
        <span className="text-sm text-gray-600">
          {totalResults} results
        </span>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
      </div>
    </div>
  );
};

const TableRow = ({ index, style, data }) => {
  const { leads, searchTerm, onRowClick, onPhoneClick , user} = data;
  const lead = leads[index];

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPhone = (phone) => {
    return phone?.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.toString().split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div
      style={style}
      className="flex items-center border-b border-gray-100 hover:bg-gray-50 cursor-pointer px-6"
      onClick={() => onRowClick(lead)}
    >
      {/* S.No */}
      <div className="w-12 flex-shrink-0">
        <span className="text-sm font-medium text-gray-600">{index + 1}</span>
      </div>

      {/* Created On */}
      <div className="w-32 flex-shrink-0">
        <span className="text-sm text-gray-900">{formatDate(lead.Date)}</span>
      </div>

      {/* Assigned On */}
      <div className="w-32 flex-shrink-0">
        <span className="text-sm text-gray-900">{formatDate(lead.assignT || lead.Date)}</span>
      </div>

      {/* Client Details */}
      <div className="w-32  flex-shrink-0">
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900 truncate">
            {highlightText(lead.Name, searchTerm)}
          </div>
          {/* <div className="text-sm text-gray-500 truncate">
            {highlightText(lead.Email, searchTerm)}
          </div> */}
          <button
            className="text-sm mt-1 text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
            onClick={(e) => {
              // e.stopPropagation();
              onPhoneClick(user?.uid, lead?.Name, lead?.Mobile)
              // Handle call functionality
            }}
          >
            {lead.countryCode} {highlightText(formatPhone(lead.Mobile), searchTerm)}
          </button>
        </div>
      </div>

      {/* Project */}
      <div className="w-48  py-3  flex-shrink-0">
        <span className="text-sm text-gray-900 truncate block">
          {highlightText(lead.Project, searchTerm)}
        </span>
      </div>

      {/* Unit No */}
      {/* <div className="w-32 flex-shrink-0 pr-4">
        <span className="text-sm text-gray-900">{lead.UnitNo}</span>
      </div> */}

      {/* Assigned To */}
      <div className="w-32 text-left   flex-shrink-0 pr-4">
        <span className="text-sm text-gray-900 truncate block">
          {lead.assignedToObj?.label}
        </span>
      </div>

      {/* Source */}
      <div className="w-48 flex-shrink-0 pr-4">
        <div className="space-y-1">
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {highlightText(lead.Source, searchTerm)}
          </span>
          <StarRating value={lead.leadstrength} />
        </div>
      </div>

      {/* Status */}
      <div className="w-28 flex-shrink-0 pr-4">
        <StatusBadge status={lead.Status} />
      </div>

      {/* Last Activity */}
      <div className="w-32 flex-shrink-0 pr-4">
        <TimeDisplay timestamp={lead.leadUpT} />
      </div>

      {/* Next Schedule */}
      {/* <div className="w-32 flex-shrink-0 pr-4">
        <TimeDisplay timestamp={lead.schTime} />
      </div> */}

      {/* Comments */}
      <div className="w-48 flex-shrink-0">
        <span className="text-sm text-gray-600  block" title={lead.Remarks}>
          {lead.Remarks}
        </span>
      </div>
    </div>
  );
};

const TableHeader = () => {
  const columns = [
    { key: 'sno', label: 'S.No', width: 'w-12' },
    { key: 'created', label: 'Created On', width: 'w-32' },
    { key: 'assigned', label: 'Assigned On', width: 'w-32' },
    { key: 'client', label: 'Client Details', width: 'w-32' },
    { key: 'project', label: 'Project', width: 'w-48' },
    // { key: 'unit', label: 'Unit No', width: 'w-32' },
    { key: 'assignedTo', label: 'Assigned To', width: 'w-32' },
    { key: 'source', label: 'Source', width: 'w-48' },
    { key: 'status', label: 'Status', width: 'w-32' },
    { key: 'lastActivity', label: 'Last Activity', width: 'w-32' },
    // { key: 'nextSch', label: 'Next Sch', width: 'w-32' },
    { key: 'comments', label: 'Comments', width: 'w-48' }
  ];

  return (
    <div className="flex items-center bg-gray-50 border-b border-gray-200 px-6 py-3 text-left text-[14px] font-medium text-[#374151] uppercase tracking-wider">
      {columns.map((column) => (
        <div key={column.key} className={`${column.width} flex-shrink-0 ${column.key !== 'client' ? 'pr-4' : ''}`}>
          <button className="group inline-flex items-center whitespace-nowrap hover:text-gray-700">
            {column.label}

          </button>
        </div>
      ))}
    </div>
  );
};

export default function LLeadsTableBody({selStatus,leadsTyper, rowsParent, selUserProfileF, newArray, fetchLeadsLoader, leadsFetchedData, mySelRows, searchVal}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLeads, setFilteredLeads] = useState(leadsFetchedData);
    const { user } = useAuth()

  useEffect(() => {
    const filtered = leadsFetchedData.filter(lead =>
      Object.values(lead).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredLeads(filtered);
  }, [searchTerm]);

  useEffect(() => {
    setFilteredLeads(leadsFetchedData);
  },[leadsFetchedData])

  const handleRowClick = (lead) => {
    console.log('Lead clicked:', lead);
    let newSelected = []

    selUserProfileF('Lead Profile', lead)
    setSelected(newSelected)

    // Handle row click functionality
  };

  const handleCallButtonClick =()=>{
console.log('phone no is clicked')
  }



  return (
    <div className="bg-white shadow-sm  border border-gray-200">
      <div className="">
        {/* <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalResults={filteredLeads.length}
        /> */}

        <div className="border border-gray-200  overflow-hidden">
          <TableHeader />

          <div className="relative">
            {filteredLeads.length > 0 ? (
              <List
                height={700}
                itemCount={filteredLeads.length}
                itemSize={80}
                itemData={{
                  leads: filteredLeads,
                  searchTerm,
                  onRowClick: handleRowClick,
                  onPhoneClick:handleCallButtonClick,
                  user: user
                }}
              >
                {TableRow}
              </List>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}