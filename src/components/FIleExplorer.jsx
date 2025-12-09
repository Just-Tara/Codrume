import React, { useState } from 'react';
import { Plus, FolderPlus, FilePlus } from 'lucide-react';
import ProjectItem from '../FileTree/ProjectItem.jsx';

const FileExplorer = ({ 
  projects, onProjectCreate, onProjectDelete, onFolderCreate,
  onFolderDelete, onFileCreate, onFileDelete, onFileSelect,
  activeFileId, isDark
}) => {
  
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id);

  return (
    <div className={`w-64 h-full flex flex-col border-r ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
      
      <div className={`shrink-0 p-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-sm font-semibold uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Projects
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={onProjectCreate} className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'}`} title="New Project">
            <Plus size={14} />
            <span className="hidden sm:inline">Project</span>
          </button>
          <button onClick={() => selectedProjectId ? onFolderCreate(selectedProjectId) : alert("Select a project!")} className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'}`} title="New Folder">
            <FolderPlus size={14} />
            <span className="hidden sm:inline">Folder</span>
          </button>
          <button onClick={() => selectedProjectId ? onFileCreate(selectedProjectId, null) : alert("Select a project!")} className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'}`} title="New File">
            <FilePlus size={14} />
            <span className="hidden sm:inline">File</span>
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100%-100px)]">
        {projects.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            <p className="mb-2">No projects yet</p>
            <button onClick={onProjectCreate} className="text-blue-500 hover:text-blue-400 text-xs">Create your first project</button>
          </div>
        ) : (
          projects.map(project => (
            <ProjectItem
              key={project.id}
              project={project}
              onFolderCreate={onFolderCreate}
              onFileCreate={onFileCreate}
              onProjectDelete={onProjectDelete}
              onFolderDelete={onFolderDelete}
              onFileDelete={onFileDelete}
              onFileSelect={onFileSelect}
              activeFileId={activeFileId}
              isDark={isDark}
              onProjectClick={() => setSelectedProjectId(project.id)}
              isSelected={selectedProjectId === project.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FileExplorer;