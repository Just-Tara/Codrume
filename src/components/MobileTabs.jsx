import React from 'react';
import { X, Folder, FolderOpen } from 'lucide-react';

function MobileTabs({ activeView, onDeleteFile, onViewChange, files, onToggleSidebar, isSidebarOpen }) {
  return (
    <div className="md:hidden bg-gray-800 border-b border-gray-700 flex">
      
      <button
        className='flex items-center cursor-pointer text-gray-400 hover:text-gray-200 transition bg-gray-700 pl-2 pr-3' 
        aria-label="Toggle file explorer"
        title='File Explorer'
        onClick={onToggleSidebar}
      >
       {isSidebarOpen ?  <FolderOpen size={20}/> :  <Folder size={20} />}
      </button>

  
      {files.map(file => (
        <div 
          key={file.id} 
          className={`flex-1 py-3 px-2 text-xs font-medium border-b-2 transition flex items-center justify-center gap-1 ${
            activeView === file.id
              ? 'text-gray-200 border-blue-500'
              : 'text-gray-500 border-transparent'
          }`}
        >
          <span 
            onClick={() => onViewChange(file.id)}
            className="cursor-pointer truncate"
          >
            {file.name}
          </span>
          
          {files.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile(file.id);
              }}
              className="hover:text-red-400 transition"
              title="Delete file"
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}
      
  
      <button
        onClick={() => onViewChange('preview')}
        className={`flex-1 py-3 text-xs font-medium border-b-2 transition uppercase ${
          activeView === 'preview'
            ? 'text-gray-200 border-blue-500'
            : 'text-gray-500 border-transparent'
        }`}
      >
        Preview
      </button>
    </div>
  );
}

export default MobileTabs;