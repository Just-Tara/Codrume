import React from 'react';

function StatusBar({isAutoSaveEnabled}) {
  return (
    <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex text-xs text-gray-500">
      <div>
        {isAutoSaveEnabled ? 
         <span className="text-green-500">● Auto-save ON</span> :  
         <span className="text-gray-500">● Auto-save OFF</span> }
      </div>
     
    </div>
  );
}

export default StatusBar;
