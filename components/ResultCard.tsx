import React from 'react';

interface ResultCardProps {
  title: string;
  imageUrl: string | null;
  isLoading: boolean;
  side: 'Front' | 'Back';
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, imageUrl, isLoading, side }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-baseline mb-3">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{side} Side</h4>
        <span className="text-xs text-gray-500">1K Resolution</span>
      </div>
      
      <div className="relative aspect-square w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <p className="text-sm text-gray-500 font-medium animate-pulse">Designing {side.toLowerCase()}...</p>
          </div>
        ) : imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={`${title} - ${side}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100">
               <a 
                 href={imageUrl} 
                 download={`google-apprentice-card-${side.toLowerCase()}.png`}
                 className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
                 Download
               </a>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Preview will appear here</span>
            </div>
          </div>
        )}
      </div>
      {imageUrl && (
        <p className="mt-2 text-xs text-gray-500">
          Generated with Gemini 3 Pro
        </p>
      )}
    </div>
  );
};