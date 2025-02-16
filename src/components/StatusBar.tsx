import { GitBranch, Wifi, Zap, FileJson, Globe, Check } from 'lucide-react'

const StatusBar = () => {
  return (
    <div className="h-[22px] bg-vscode-titlebar text-white/80 text-xs px-2 flex items-center justify-between select-none">
      {/* Left Section */}
      <div className="flex items-center divide-x divide-white/20">
        <div className="flex items-center gap-2 pr-2">
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <GitBranch size={14} />
            <span className="hidden sm:inline">main</span>
          </button>
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <Wifi size={14} />
            <span className="hidden sm:inline">Portfolio</span>
          </button>
        </div>
        <div className="flex items-center gap-2 px-2">
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <Check size={14} className="text-green-500" />
            <span className="hidden sm:inline">0</span>
            <Zap size={14} className="text-yellow-500" />
            <span className="hidden sm:inline">0</span>
          </button>
        </div>
      </div>

      {/* Middle Section - Title */}
      <div className="md:block absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-white text-sm font-medium">
          Anuj Dubey - Portfolio
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center divide-x divide-white/20">
        <div className="hidden sm:flex items-center gap-2 px-2">
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <FileJson size={14} />
            <span>TypeScript</span>
          </button>
        </div>
        <div className="flex items-center gap-2 px-2">
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <Globe size={14} />
            <span className="hidden sm:inline">UTF-8</span>
          </button>
        </div>
        <div className="flex items-center gap-2 pl-2">
          <button className="flex items-center gap-1 hover:text-white transition-colors group">
            <Zap size={14} className="text-green-500 group-hover:animate-pulse" />
            <span className="hidden sm:inline">Ready</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatusBar