import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FolderPlus, FilePlus, Trash2 } from 'lucide-react';
import FolderItem from './FolderItem';
import FileItem from './FileItem';

const ProjectItem = ({ 
  project, onFolderCreate, onFileCreate, onProjectDelete, onFolderDelete, 
  onFileDelete, onFileSelect, activeFileId, isDark, onProjectClick, isSelected 
}) => {
  const [isExpanded, setIsExpanded] = useState(project.expanded);

  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer group ${
          isSelected 
            ? (isDark ? 'bg-gray-800' : 'bg-gray-200')
            : (isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200')
        }`}
        onClick={() => { onProjectClick(); setIsExpanded(!isExpanded); }}
      >
        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="p-0.5">
          {isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
        </button>
        
        {isExpanded ? <FolderOpen size={16} className="text-blue-400" /> : <Folder size={16} className="text-blue-400" />}
        
        <span className={`flex-1 text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          {project.name}
        </span>
        
        <div className="md:hidden group-hover:flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onFolderCreate(project.id); }}
            className={`p-1 rounded transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}
            title="New Folder"
          >
            <FolderPlus size={12} className="text-gray-400" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onFileCreate(project.id, null); }}
            className={`p-1 rounded transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}
            title="New File"
          >
            <FilePlus size={12} className="text-gray-400" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onProjectDelete(project.id); }}
            className="p-1 hover:bg-red-600 rounded transition"
            title="Delete Project"
          >
            <Trash2 size={12} className="text-gray-400" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="ml-4">
          {project.folders?.map(folder => (
            <FolderItem
              key={folder.id}
              folder={folder}
              projectId={project.id}
              onFileCreate={onFileCreate}
              onFolderDelete={onFolderDelete}
              onFileDelete={onFileDelete}
              onFileSelect={onFileSelect}
              activeFileId={activeFileId}
              isDark={isDark}
            />
          ))}
          {project.files?.map(file => (
            <FileItem
              key={file.id}
              file={file}
              projectId={project.id}
              folderId={null}
              onFileSelect={onFileSelect}
              onFileDelete={onFileDelete}
              activeFileId={activeFileId}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectItem;