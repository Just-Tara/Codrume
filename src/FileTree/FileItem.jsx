import React from 'react';
import { File, Trash2 } from 'lucide-react';

const getFileIcon = (language) => {
  const colors = {
    html: 'text-orange-400', css: 'text-blue-400', scss: 'text-pink-400',
    javascript: 'text-yellow-400', typescript: 'text-blue-500', python: 'text-green-400',
    java: 'text-red-400', php: 'text-purple-400', ruby: 'text-red-500',
    go: 'text-cyan-400', c: 'text-gray-400', cpp: 'text-gray-400',
    json: 'text-yellow-300', xml: 'text-orange-300', yaml: 'text-red-300',
    sql: 'text-orange-500', shell: 'text-green-500', markdown: 'text-blue-300'
  };
  return colors[language] || 'text-gray-400';
};

const FileItem = ({ file, projectId, folderId, onFileSelect, onFileDelete, activeFileId, isDark }) => {
  const isActive = file.id === activeFileId;

  return (
    <div
      className={`flex items-center gap-2 px-2 py-1 cursor-pointer group ${
        isActive 
          ? (isDark ? 'bg-gray-800 border-l-2 border-blue-500' : 'bg-gray-300 border-l-2 border-blue-500')
          : (isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200')
      }`}
      onClick={() => onFileSelect(file.id)}
    >
      <File size={14} className={getFileIcon(file.language)} />
      <span className={`flex-1 text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
        {file.name}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFileDelete(projectId, folderId, file.id);
        }}
        className="md:hidden group-hover:block p-1 hover:bg-red-600 rounded transition"
        title="Delete File"
      >
        <Trash2 size={10} className="text-gray-400" />
      </button>
    </div>
  );
};

export default FileItem;