import { Bug, Terminal, Mail, Settings, } from 'lucide-react'

interface SidebarProps {
  onBugClick: () => void
  onTerminalClick: () => void
  onContactClick: () => void
  onSettingsClick: () => void
}

const Sidebar = ({ 
  onBugClick, 
  onTerminalClick, 
  onContactClick, 
  onSettingsClick
}: SidebarProps) => {
  return (
    <div className="w-[48px] bg-vscode-sidebar border-r border-[#1e1e1e] flex flex-col items-center py-2">
      <div className="flex flex-col items-center gap-4">
        <button
          className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          onClick={onBugClick}
        >
          <Bug size={24} />
        </button>
        <button
          className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          onClick={onTerminalClick}
        >
          <Terminal size={24} />
        </button>
        <button
          className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          onClick={onContactClick}
        >
          <Mail size={24} />
        </button>
        <button
          className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-colors mt-auto"
          onClick={onSettingsClick}
        >
          <Settings size={24} />
        </button>
      </div>
    </div>
  )
}

export default Sidebar