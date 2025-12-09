import { useState, useEffect } from "react";
import { excutePistonCode } from "../utils/PistonApi";
import { getFilesFromProject, getActiveFile } from "../utils/fileHelpers";
import { PISTON_LANGUAGES } from "../constants/pistonConfig";

export const useCodeRunner = (projects, activeProjectId, activeTab) => {
  const [outputCode, setOutputCode] = useState("");
  const [pistonOutput, setPistonOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState("html");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);


  // console function
    const handleClearConsole = () => setConsoleLogs([]);

    useEffect(() => {
        const handleIframeMessage = (event) => {
        if (event.data && event.data.source === 'iframe-console') {
            const { type, message } = event.data;
            setConsoleLogs(prev => [...prev, {
            message: message,
            type: type,
            timestamp: new Date().toLocaleTimeString()
            }]);
            if (type === 'error') setIsConsoleOpen(true);
        }
        };
        window.addEventListener('message', handleIframeMessage);
        return () => window.removeEventListener('message', handleIframeMessage);
    }, []);

    // Execute pure JS (Console only)
    const executeFontendCode = (code, language) => {
        setConsoleLogs([]);
        setIsConsoleOpen(true);
    
        const addLog = (message, type = 'log') => {
        const timestamp = new Date().toLocaleTimeString();
        setConsoleLogs(prev => [...prev, {message, type, timestamp}]);
        };
    
        try{
        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
        };
    
        const customConsole ={
            log: (...args) => {
            addLog(args.join (''), 'log');
            originalConsole.log(...args);
            },
            error: (...args) => {
            addLog(args.join(''), 'error');
            originalConsole.error(...args);
            },
            warn: (...args) => {
            addLog(args.join(''), 'warn');
            originalConsole.error(...args);
            },
            info: (...args) => {
            addLog(args.join(''), 'info');
            originalConsole.error(...args);
            },
        };
    
        let excutableCode = code;
    
        if (language === 'typescript') {
            excutableCode = code
            .replace(/:\s*\w+(\[\])?/g, '') 
            .replace(/interface\s+\w+\s*{[^}]*}/g, '') 
            .replace(/type\s+\w+\s*=\s*[^;]+;/g, ''); 
        }
    
        const func = new Function('console', excutableCode);
        func(customConsole);
    
        addLog('Execution completed successfully', 'info');    
        } catch (error) {
        addLog(`Error: ${error.message}`, 'error');
        }
        };

    // FUNCTION TO GENERATE PREVIEW FOR HTML/CSS/JS PROJECTS

    const handleGeneratePreview = () => {
        const allFiles = getFilesFromProject(projects, activeProjectId);

        const htmlFiles = allFiles.filter(f => f.language === 'html');
        const cssFiles = allFiles.filter(f => f.language === 'css' || f.language === 'scss');
        const jsFiles = allFiles.filter(f => f.language === 'javascript' || f.language === 'typescript');
        


        const consoleInterceptorScript = `

            <script>
            (function() {
            const oldLog = console.log;
            const oldError = console.error;
            const oldWarn = console.warn;
            const oldInfo = console.info;

            function sendToParent(type, args) {
                try {

                const message = args.map(arg => {
                    if (typeof arg === 'object') {
                    try { return JSON.stringify(arg); } catch(e) 
                    { return '[Object]'; }
                    }
                    return String(arg);
                }).join(' ');

                
                window.parent.postMessage({
                    source: 'iframe-console',
                    type: type,
                    message: message
                }, '*');
                } catch (e) {
                
                }
            }

            console.log = function(...args)
            { sendToParent('log', args); 
                oldLog.apply(console, args); };
            console.error = function(...args) 
                { sendToParent('error', args); 
                oldError.apply(console, args); };
            console.warn = function(...args) 
                { sendToParent('warn', args); 
                oldWarn.apply(console, args); };
            console.info = function(...args)
            { sendToParent('info', args); 
                oldInfo.apply(console, args); };
            })();
        </script>
        
        `
        let mainHtmlFile = htmlFiles.find(f => f.name.toLowerCase().includes('index'));
        if (!mainHtmlFile) {
        mainHtmlFile = htmlFiles[0];
        }
        
        if (!mainHtmlFile) {
        console.log("No HTML files found");
        return;
        }
        
    
        const virtualHtmlFiles = {};
        const virtualCssFiles = {};
        const virtualJsFiles = {};

        const getFilePath = (file) => {
        if (file.folderId) {
            const project = projects.find( p => p.id === file.projectId);
            const folder = project?.folders.find(f => f.id === file.folderId);
            if (folder) {
            return `${folder.name}/${file.name}`;
            }
        }
        return file.name;
        }
        
        htmlFiles.forEach(file => {
        const path = getFilePath(file);
        virtualHtmlFiles[path] = file.content;
        virtualHtmlFiles[file.name] = file.content;
        });
        
        cssFiles.forEach(file => {
        let cssContent = file.content;

        const path = getFilePath(file);
        virtualCssFiles[path] = cssContent;
        virtualCssFiles[file.name] = cssContent;

        const nameWithoutExt = file.name.replace(/\.(css)$/, '');
        virtualCssFiles[nameWithoutExt] = cssContent;

        });
        
        jsFiles.forEach(file => {
        let jsContent = file.content;

        const path = getFilePath(file)
        virtualJsFiles[path] = jsContent;
        virtualJsFiles[file.name] = jsContent;

        const nameWithoutExt = file.name.replace(/\.(js)$/, '');
        virtualJsFiles[nameWithoutExt] = jsContent;
        });

    
        const rawScriptContent = `
        window.__virtualHtmlFiles__ = ${JSON.stringify(virtualHtmlFiles)};
        window.__virtualCssFiles__ = ${JSON.stringify(virtualCssFiles)};
        window.__virtualJsFiles__ = ${JSON.stringify(virtualJsFiles)};
        window.__currentPage__ = "${mainHtmlFile.name}";
        window.__loadedResources__ = { css: [], js: [] };
        window.__modules__ = {};
        
        function loadVirtualCSS(filename) {
            let content = window.__virtualCssFiles__[filename];
            if (!content) {
            const nameWithoutExt = filename.replace(/\\.(css|scss)$/, '');
            content = window.__virtualCssFiles__[nameWithoutExt];
            }
            if (!content) {
            return;
            }
            if (window.__loadedResources__.css.includes(filename)) {
            return;
            }
            window.__loadedResources__.css.push(filename);
            const styleElement = document.createElement('style');
            styleElement.setAttribute('data-virtual-css', filename);
            styleElement.textContent = content; 
            document.head.appendChild(styleElement);
            
        }
        
        
        
        function loadVirtualJS(filename) {
            let content = window.__virtualJsFiles__[filename];
            if (!content) {
            const nameWithoutExt = filename.replace(/\\.(js)$/, '');
            content = window.__virtualJsFiles__[nameWithoutExt];
            }
            if (!content) {
            console.warn('JS file not found:', filename);
            return;
            }
            if (window.__loadedResources__.js.includes(filename)) {
            return;
            }
            window.__loadedResources__.js.push(filename);

            try{
                const scriptElement = document.createElement('script');
                scriptElement.setAttribute('data-virtual-js', filename);
                scriptElement.textContent = content;
                document.body.appendChild(scriptElement);
            } catch(error) {
            console.error("Error loading JS:", filename, error);
            }  
        
        }
        
            function loadExternalResources(htmlContent) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.endsWith('.css'))) {  
                loadVirtualCSS(href);
            }
            });
            doc.querySelectorAll('script[src]').forEach(script => {
            const src = script.getAttribute('src');
            if (src && (src.endsWith('.js') || src.endsWith('.ts'))) {
                loadVirtualJS(src);
            }
            });
        } 
        
        function loadVirtualPage(filename) {
            const content = window.__virtualHtmlFiles__[filename];
            if (!content) {

            return;
            }
            window.__currentPage__ = filename;
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            
            document.body.innerHTML = doc.body.innerHTML; 
            
            loadExternalResources(content);
        
            attachLinkListeners();
        }
        
        function attachLinkListeners() {
            document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.endsWith('.html')) {
                e.preventDefault();
                loadVirtualPage(href);
                }
            });
            });
        }
        
        
        loadVirtualPage(window.__currentPage__);
        `;


        const encodedScript = btoa(unescape(encodeURIComponent(rawScriptContent)));

        const resourceLoadingScript = `
        (function() {
            try {
            const encoded = '${encodedScript}';
            const decoded = decodeURIComponent(escape(atob(encoded)));
            eval(decoded);
            } catch(e) {
            console.error('Failed to decode and run virtual script:', e);
            }
        })();
        `;
        
        const mainHtml = mainHtmlFile.content;
        const hasFullHtml = mainHtml.includes('<!DOCTYPE') || mainHtml.includes('<html');
        
        let combinedCode;
        
        if (hasFullHtml) {
        const bodyCloseIndex = mainHtml.lastIndexOf('</body>');
        
        if (bodyCloseIndex !== -1) {
            const parts = [
            mainHtml.slice(0, bodyCloseIndex),
            consoleInterceptorScript, 
            '<script>',
            resourceLoadingScript, 
            '</script>',
            mainHtml.slice(bodyCloseIndex)
            ];
            combinedCode = parts.join('');
        } else {
            combinedCode = [
                mainHtml, 
                consoleInterceptorScript,
                '<script>', 
                resourceLoadingScript, 
                '</script>'
            ].join('');
        }
        } else {
        const parts = [
            '<!DOCTYPE html>\n',
            '<html lang="en">\n',
            '<head>\n',
            '  <meta charset="UTF-8">\n',
            '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n',
            '  <title>Preview</title>\n',
            '</head>\n',
            '<body>\n',
            mainHtml,
            consoleInterceptorScript,
            '\n<script>\n',
            resourceLoadingScript, 
            '\n</script>\n',
            '</body>\n',
            '</html>'
        ];
        combinedCode = parts.join('');
        }
        setConsoleLogs([]);
        setOutputCode(combinedCode);
    };
 

    // RUN CODE HANDLER
    const handleRunCode = async () => {
        setIsRunning(true);
    
    console.log(" Running code...");
    setPistonOutput(null);
    
    const currentActiveFile = getActiveFile(projects, activeTab);
    console.log(" Current file:", currentActiveFile);
    console.log(" File language:", currentActiveFile.language); 
    
    
    
        if (currentActiveFile.language === 'javascript' || currentActiveFile.language === 'typescript') {
        console.log("Running JS/TS code");
        setOutputCode("");
        
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        executeFontendCode(currentActiveFile.content, currentActiveFile.language);
    
        if (isMobile) {
            setActiveMobileView("preview");
        }
        setIsRunning(false);
        return;
        }
    
    
    const projectFiles = getFilesFromProject(projects, activeProjectId);
    const hasWebFiles = projectFiles.some(f => 
        f.language === 'html' || 
        f.language === 'css' || 
        ((f.language === 'javascript' || f.language === 'typescript') && projectFiles.some(file => file.language === 'html'))
    );
    
    console.log(" Has web files?", hasWebFiles);
    console.log(" Current file language:", currentActiveFile.language);
    
        if (hasWebFiles && (currentActiveFile.language === 'html' || 
        currentActiveFile.language === 'css' )) {
        
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        handleGeneratePreview();
    
        if (isMobile) {
        setActiveMobileView("preview");
        }
        setIsRunning(false);
        return;
    }
    
    console.log(" Did not match HTML/CSS/SCSS condition");
    
    // Piston API execution for other languages
    
    if (PISTON_LANGUAGES.includes(currentActiveFile.language)) {
        setOutputCode("");
    
        try {
        console.log(`Executing ${currentActiveFile.language} code via Piston API...`);
        const result = await excutePistonCode(currentActiveFile.language, currentActiveFile.content);
    
        const runResult = result.run;
        const output = (runResult.stdout || runResult.output || "") + (runResult.stderr || "");
    
        if (runResult.code === 0 && !runResult.stderr) {
            setPistonOutput({
            type: 'success',
            content: output.trim() || `Execution finished successfully.`,
            language: currentActiveFile.language
            });
        } else {
            setPistonOutput({
            type: 'error',
            content: output.trim() || `Error during execution.`,
            language: currentActiveFile.language
            });
        }
        if (isMobile) {
            setActiveMobileView("preview");
        }
        setIsRunning(false);
        } catch (error) {
        console.log("Execution failed:", error);
        setPistonOutput({
            type: 'error',
            content: `Failed to connect or execute via API: ${error.message}`,
            language: currentActiveFile.language
        });
        setIsRunning(false);
        }  finally{
        setIsRunning(false);
        }
        return;
    }
    
    console.log(" No conditions matched!");
    setPistonOutput(null);
    setIsRunning(false);
    };
   
  

  return {
    outputCode,
    pistonOutput,
    isRunning,
    consoleLogs,
    isConsoleOpen,
    activeMobileView,
    setIsMobile,
    setIsConsoleOpen,
    setConsoleLogs,
    handleRunCode,
    handleClearConsole,
    handleGeneratePreview,
    isMobile,              
    setActiveMobileView
  };
};