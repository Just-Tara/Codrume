import React, { useState } from 'react';
import { FileCode, Monitor, Tablet, Smartphone, Terminal, Maximize2, Minimize2 } from 'lucide-react';

function PreviewPanel({ activeMobileView, files, outputCode, fontSize, pistonOutput }) {
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const hasHtmlFiles = files.some(f => f.language === 'html');
  const isPistonResult = !!pistonOutput;


  const deviceSizes = {
    desktop: { width: '100%', height: '100vh' },
    tablet: { width: '768px', height: '100vh' }, 
    mobile: { width: '375px', height: '100vh' }   
  };

  return (
    <div
      className={`${
        isFullScreen 
          ? 'fixed inset-0 z-50 bg-gray-900 h-screen w-screen flex flex-col' 
          : `flex-1 md:flex flex-col ${activeMobileView !== 'preview' ? 'hidden md:flex' : 'flex'}`
      }`}
    >
     
      <div className="bg-gray-800 border-b border-gray-700 px-4 md:py-[9px] py-2 flex items-center justify-between shrink-0">
        <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
          {isPistonResult ? (
            <><Terminal size={16} /> Api Output</>
          ) : (
            <><FileCode size={16}/> Live Preview</>
          )}
        </span>

        {!isPistonResult && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 bg-gray-700/50 p-1 rounded-lg">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded transition ${deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Desktop"
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`p-1.5 rounded transition ${deviceMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Tablet"
              >
                <Tablet size={16} />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded transition ${deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Mobile"
              >
                <Smartphone size={16} />
              </button>
            </div>

           
            <div className="w-px h-4 bg-gray-600 hidden md:block"></div>
            
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 transition"
              title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            >
              {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        )}
      </div>

      <div className={`flex-1 bg-gray-100 dark:bg-[#0d1117] overflow-auto flex items-start justify-center transition-all ${
        deviceMode !== 'desktop' ? 'p-8' : '' 
      }`}>
        
        {isPistonResult ? (
            <div className="w-full h-full p-4">
                <h2 className="text-xl font-bold mb-2 text-white">
                    {pistonOutput.type === 'error' ? '❌ Execution Error' : 'Output'} 
                    <span className="text-sm font-normal ml-2 opacity-70 text-gray-500">
                        ({pistonOutput.language.toUpperCase()}) 
                    </span>
                </h2>
                <pre className={`p-4 rounded-lg whitespace-pre-wrap font-mono text-sm overflow-auto max-h-full ${
                    pistonOutput.type === 'error' 
                        ? 'bg-red-900/30 text-red-400 border border-red-800'
                        : 'bg-zinc-800 text-gray-200 border border-gray-700'
                }`}>
                    {pistonOutput.content} 
                </pre>
            </div>
        ) : (
            
            !outputCode || !hasHtmlFiles ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center text-gray-500 p-8">
                  <FileCode size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Preview Available</p>
                  <p className="text-sm">Run your code to see the result</p>
                </div>
              </div>
            ) : (
              <div 
                className={`bg-white transition-all duration-300 relative ${
                  deviceMode !== 'desktop' ? 'shadow-[0_0_50px_rgba(0,0,0,0.2)] border-8 border-gray-800 rounded-[30px] overflow-hidden' : 'h-full w-full'
                }`}
                style={{
                  width: deviceSizes[deviceMode].width,
                  height: deviceSizes[deviceMode].height,
                  maxWidth: deviceMode === 'desktop' ? '100%' : undefined,
                  maxHeight: deviceMode === 'desktop' ? '100%' : undefined,
                }}
              >
                <iframe 
                  srcDoc={outputCode} 
                  title="Live Preview" 
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-forms allow-modals allow-popups"
                  style={{ fontSize: `${fontSize}px` }}
                />
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default PreviewPanel;