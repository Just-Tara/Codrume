import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FilePlus, Trash2 } from 'lucide-react';
import FileItem from './FileItem';

const FolderItem = ({ folder, projectId, onFileCreate, onFolderDelete, onFileDelete, onFileSelect, activeFileId, isDark }) => {
  const [isExpanded, setIsExpanded] = useState(folder.expanded);

  return (
    <div>
      <div 
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer group ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="p-0.5">
          {isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
        </button>
        
        {isExpanded ? <FolderOpen size={14} className="text-yellow-400" /> : <Folder size={14} className="text-yellow-400" />}
        
        <span className={`flex-1 text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          {folder.name}
        </span>
        
        <div className="md:hidden group-hover:flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onFileCreate(projectId, folder.id); }}
            className={`p-1 rounded transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}
            title="New File"
          >
            <FilePlus size={12} className="text-gray-400" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onFolderDelete(projectId, folder.id); }}
            className="p-1 hover:bg-red-600 rounded transition"
            title="Delete Folder"
          >
            <Trash2 size={12} className="text-gray-400" />
          </button>
        </div>
      </div>

      {isExpanded && folder.files && (
        <div className="ml-4">
          {folder.files.length === 0 ? (
            <div className="px-2 py-1 text-xs text-gray-500 italic">Empty folder</div>
          ) : (
            folder.files.map(file => (
              <FileItem
                key={file.id}
                file={file}
                projectId={projectId}
                folderId={folder.id}
                onFileSelect={onFileSelect}
                onFileDelete={onFileDelete}
                activeFileId={activeFileId}
                isDark={isDark}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FolderItem;