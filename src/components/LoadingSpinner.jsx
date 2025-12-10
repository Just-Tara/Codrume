
function LoadingSpinner ({ isDark }) {
  return (
    <div className={`flex flex-col items-center justify-center h-full w-full ${
      isDark ? 'bg-[#1e1e1e]' : 'bg-white'
    }`}>
      <div className="relative w-12 h-12 mb-4">
        
        <div className={`absolute w-full h-full border-4 rounded-full opacity-20 ${
          isDark ? 'border-blue-400' : 'border-blue-600'
        }`}></div>

        <div className={`absolute w-full h-full border-4 rounded-full border-t-transparent animate-spin ${
          isDark ? 'border-blue-500' : 'border-blue-600'
        }`}></div>
        
      </div>

      <span className={`text-sm font-medium tracking-wide animate-pulse ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>
        INITIALIZING EDITOR...
      </span>
    </div>
  );
};

export default LoadingSpinner;