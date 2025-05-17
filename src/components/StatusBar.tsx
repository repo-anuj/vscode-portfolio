import React, { memo } from 'react'
import { GitBranch, Wifi, Zap, FileJson, Globe, Coffee, Code } from 'lucide-react'


/**
 * Props for the StatusBar component
 */
interface StatusBarProps {
  /** Optional CSS class name */
  className?: string
}

/**
 * StatusBar component that displays the bottom status bar with various indicators
 * Memoized to prevent unnecessary re-renders
 *
 * @param {StatusBarProps} props - Component props
 * @returns {JSX.Element} Rendered StatusBar component
 */
const StatusBar: React.FC<StatusBarProps> = memo(({ className = '' }) => {
  return (
    <div className={`h-[22px] bg-vscode-titlebar text-white/80 text-xs px-2 flex items-center select-none border-t border-[#2d2d2d] ${className}`}>
      {/* Left Section */}
      <div className="flex-1 flex items-center">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-white/10">
            <GitBranch size={14} />
            <span className="hidden sm:inline">main</span>
          </button>
          <button className="hidden sm:flex items-center gap-1 hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-white/10">
            <Wifi size={14} />
            <span className="hidden sm:inline">Portfolio</span>
          </button>
          <button className="hidden md:flex items-center gap-1 hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-white/10">
            <Coffee size={14} className="text-amber-400" />
            <span className="hidden md:inline">Buy me a coffee</span>
          </button>
        </div>
      </div>

      {/* Middle Section - Title */}
      <div className="flex-shrink-0 mx-2 text-center">
        <h1 className="text-white/90 text-xs font-medium whitespace-nowrap">
          Anuj Dubey - Portfolio
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-end">
        <div className="hidden sm:flex items-center gap-2">
          <button className="flex items-center gap-1 hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-white/10">
            <Code size={14} className="text-blue-400" />
            <span>React</span>
          </button>
          <button className="flex items-center gap-1 hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-white/10">
            <FileJson size={14} className="text-yellow-400" />
            <span>TypeScript</span>
          </button>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button className="flex items-center gap-1 hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-white/10">
            <Globe size={14} />
            <span className="hidden sm:inline">UTF-8</span>
          </button>
          <button className="flex items-center gap-1 hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-white/10 group">
            <Zap size={14} className="text-green-500 group-hover:animate-pulse" />
            <span className="hidden sm:inline">Ready</span>
          </button>
        </div>
      </div>
    </div>
  )
})

export default StatusBar
