import React from 'react';
import { DesignOption, BrandColor } from '../types';

interface DesignSelectorProps {
  options: DesignOption[];
  selectedOptionId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
}

export const DesignSelector: React.FC<DesignSelectorProps> = ({ options, selectedOptionId, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {options.map((option) => {
        const isSelected = option.id === selectedOptionId;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
            className={`
              relative p-6 rounded-2xl text-left transition-all duration-200 border-2
              ${isSelected 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-transparent bg-white shadow-sm hover:shadow-md hover:border-gray-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-bold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                {option.title}
              </h3>
              {isSelected && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {option.description}
            </p>
            <div className="flex gap-2">
               <span className="text-xs font-medium px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-500">
                 Front & Back
               </span>
               <span className="text-xs font-medium px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-500">
                 3x3" Card
               </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};