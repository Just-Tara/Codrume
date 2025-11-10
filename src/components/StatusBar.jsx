import React from 'react';

function StatusBar( isAutoSaveEnabled) {
  return (
    <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-4">
        <span>Ln 9, Col 8</span>
        <span>UTF-8</span>
        <span>HTML</span>
      </div>

      <div className="flex items-center gap-4">
        {isAutoSaveEnabled ? 
         <span className="text-green-500">● Auto-save ON</span> :  
         <span className="text-gray-500">● Auto-save OFF</span> }
      </div>
     
    </div>
  );
}

export default StatusBar;
