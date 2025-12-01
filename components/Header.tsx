import React from 'react';
import { BrandColor } from '../types';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: BrandColor.Blue }}></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: BrandColor.Red }}></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: BrandColor.Yellow }}></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: BrandColor.Green }}></div>
            </div>
            <h1 className="text-lg sm:text-xl font-medium text-gray-700 tracking-tight ml-2">
              Apprentice<span className="font-bold text-gray-900">Gratitude</span>
            </h1>
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            End-of-Year 2025
          </div>
        </div>
      </div>
    </header>
  );
};