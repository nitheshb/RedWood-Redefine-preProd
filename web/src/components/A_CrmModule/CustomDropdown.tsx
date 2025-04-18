import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({ 
  options = [], // Add default empty array to prevent undefined error
  selectedValue, 
  onChange, 
  placeholder = "Select an option",
  className = "",
  dropdownClassName = "",
  optionClassName = "",
  selectedClassName = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle selection
  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };
  
  // Get selected option label
  const getSelectedLabel = () => {
    if (!selectedValue && placeholder) return placeholder;
    
    if (!options || options.length === 0) return placeholder;
    
    const selected = options.find(opt => 
      (typeof opt === 'object' && opt !== null ? opt.value === selectedValue : opt === selectedValue)
    );
    
    if (selected) {
      return typeof selected === 'object' && selected !== null ? selected.label : selected;
    }
    
    return placeholder;
  };
  
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown button */}
      <button
        type="button"
        className={`w-full flex items-center justify-between px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none ${selectedClassName}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{getSelectedLabel()}</span>
        <svg 
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Dropdown menu */}
      {isOpen && options && options.length > 0 && (
        <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto ${dropdownClassName}`}>
          <ul className="py-1">
            {options.map((option, index) => {
              const value = typeof option === 'object' && option !== null ? option.value : option;
              const label = typeof option === 'object' && option !== null ? option.label : option;
              const isSelected = value === selectedValue;
              
              return (
                <li key={index}>
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${isSelected ? 'bg-blue-50 text-blue-600' : ''} ${optionClassName}`}
                    onClick={() => handleSelect(value)}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;