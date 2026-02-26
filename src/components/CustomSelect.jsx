/**
 * Custom Select Component with Yellow Theme
 * Production-ready dropdown with full styling control
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { COLORS } from '../hooks/useColors.js';

const CustomSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option",
  required = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef} style={{ zIndex: isOpen ? 50 : 10 }}>
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all bg-white cursor-pointer text-left flex items-center justify-between"
        style={{ 
          borderColor: COLORS.secondaryMain + '40',
          focusRingColor: COLORS.secondaryMain
        }}
      >
        <span className={selectedOption ? 'text-neutral-900' : 'text-neutral-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: COLORS.secondaryMain }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute w-full mt-2 bg-white border-2 rounded-lg shadow-xl overflow-hidden"
          style={{ 
            borderColor: COLORS.secondaryMain + '40',
            maxHeight: '300px',
            zIndex: 100
          }}
        >
          {/* Search Input */}
          {options.length > 5 && (
            <div className="p-2 border-b" style={{ borderColor: COLORS.secondaryMain + '20' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: COLORS.secondaryMain + '40',
                  focusRingColor: COLORS.secondaryMain
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-neutral-400 text-sm">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-opacity-90 transition-colors"
                    style={{
                      backgroundColor: isSelected ? COLORS.secondaryMain : 'white',
                      color: isSelected ? '#000000' : '#262626'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = COLORS.secondaryMain + '20';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <span className="font-medium">{option.label}</span>
                    {isSelected && (
                      <Check className="w-5 h-5" style={{ color: '#000000' }} />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
