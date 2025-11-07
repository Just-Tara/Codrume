import React, {useState} from "react"
import {Menu, Play, Save, Share2, Settings, Moon, Sun, Plus, X,  Code, FileText, FileCode} from 'lucide-react'


function Header () {
    const [isDark, setIsDark] = useState(true);
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('html');
    const [activeMobileView, setActiveMobileView] = useState('html');

    return(
        <>
       
        <header className="bg-white dark:bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-blue-500 font-bold text-lg flex items-center gap-2"> <Code size={20}/> CodeEditor</h1>
                <select className="bg-gray-700 text-gray-300 px-3 py-1.5 rounded text-sm border-gray-600 focus:outline-none focus-border-blue-500">
                    <option value="">HTML5</option>
                    <option value="">TypeScript</option>
                    <option value="">Vue</option>
                    <option value="">React</option>
                </select>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded flex items-center gap-2 text-sm font-medium transition"><Play size={14}/> Run Code</button>
                <div className="hidden md:flex items-center gap-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded flex items-center gap-2 text-sm transition"><Save size={14}/> Save</button>
                    <button  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded flex items-center gap-2 text-sm transition"><Share2 size={14}/> Share</button>
                    <button className="bg-gray-700 px-3 py-1.5 rounded flex hover:bg-gray-600 items-center text-sm text-gray-300 border-gray-600 transition">Format</button>
                </div>
                 <div className="flex items-center gap-2">
                        <button className="hidden md:block bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded border border-gray-600 transition"><Settings size={16}/></button>
                        <button className="hidden md:block bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1.5 rounded text-xs border border-gray-600 transition">A- A+</button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded flex items-center gap-2 text-sm border border-gray-600 transition"
                                onClick={() => setIsDark(!isDark)}>{isDark ? <Moon size={14}/> : <Sun size={14}/>}
                                                {isDark? 'Dark' : 'Light'}</button>
                </div>
                <button className="md:hidden bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded border border-gray-600 transition"
                        onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}><Menu size={18}/></button>
            </div>
           
        </header>
        <div className="md:hidden bg-gray-800 border-b border-gray-700 flex">
                <button onClick={() => setActiveMobileView('html')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeMobileView === 'html' ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent' }`}>HTML
                </button>

                 <button onClick={() => setActiveMobileView('css')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeMobileView === 'css' ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent' }`}>CSS
                </button>

                 <button onClick={() => setActiveMobileView('js')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeMobileView === 'js' ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent' }`}>JS
                </button>

                <button onClick={() => setActiveMobileView('preview')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeMobileView === 'preview' ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent' }`}>Preview
                </button>

        </div>
        </>
    )
}

export default Header