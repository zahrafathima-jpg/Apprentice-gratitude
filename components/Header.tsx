import React from 'react';

// Cool color palette
const CoolColors = {
  Teal: '#2dd4bf',   // teal-400
  Indigo: '#6366f1', // indigo-500
  Purple: '#a855f7', // purple-500
};

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            {/* Decorative dots hidden from screen readers */}
            <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: CoolColors.Teal }}></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: CoolColors.Indigo }}></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: CoolColors.Purple }}></div>
            </div>
            <h1 className="text-lg sm:text-xl font-medium text-gray-700 tracking-tight ml-2">
              Food for <span className="font-bold text-indigo-600">Thought</span>
            </h1>
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            2025 Edition
          </div>
        </div>
      </div>
    </header>
  );
};