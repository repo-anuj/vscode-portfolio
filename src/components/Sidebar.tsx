import { Bug, Terminal, Mail, Settings, Files, Package, Command, Grid, Bot } from 'lucide-react'
import { useState } from 'react'
import LikeButton from './LikeButton'

interface SidebarProps {
  onBugClick: () => void
  onMemoryGameClick: () => void
  onTerminalClick: () => void
  onContactClick: () => void
  onSettingsClick: () => void
  onExtensionsClick?: () => void
  onCommandPaletteClick?: () => void
  onChatBotClick?: () => void
  activeView?: string
}

const Sidebar = ({
  onBugClick,
  onMemoryGameClick,
  onTerminalClick,
  onContactClick,
  onSettingsClick,
  onExtensionsClick,
  onCommandPaletteClick,
  onChatBotClick,
  activeView = 'explorer'
}: SidebarProps) => {
  const [activeIcon, setActiveIcon] = useState<string>(activeView)

  const handleIconClick = (iconName: string, callback?: () => void) => {
    setActiveIcon(iconName === activeIcon ? '' : iconName)
    if (callback) callback()
  }

  return (
    <div className="w-[48px] bg-vscode-sidebar border-r border-[#1e1e1e] flex flex-col items-center py-2">
      <div className="flex flex-col items-center gap-1 w-full">
        {/* Explorer */}
        <button
          className={`w-12 h-12 flex items-center justify-center hover:text-white transition-colors relative ${
            activeIcon === 'explorer' ? 'text-white' : 'text-white/40'
          }`}
          onClick={() => handleIconClick('explorer')}
          title="Explorer"
        >
          <Files size={24} />
          {activeIcon === 'explorer' && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"></div>
          )}
        </button>

        {/* Bug Game */}
        <button
          className={`w-12 h-12 flex items-center justify-center hover:text-white transition-colors relative ${
            activeIcon === 'bug' ? 'text-white' : 'text-white/40'
          }`}
          onClick={() => {
            handleIconClick('bug', onBugClick)
          }}
          title="Bug Squasher Game"
        >
          <Bug size={24} />
          {activeIcon === 'bug' && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"></div>
          )}
        </button>

        {/* Memory Game */}
        <button
          className={`w-12 h-12 flex items-center justify-center hover:text-white transition-colors relative ${
            activeIcon === 'memory' ? 'text-white' : 'text-white/40'
          }`}
          onClick={() => {
            handleIconClick('memory', onMemoryGameClick)
          }}
          title="Memory Match Game"
        >
          <Grid size={24} />
          {activeIcon === 'memory' && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"></div>
          )}
        </button>

        {/* Extensions */}
        <button
          className={`w-12 h-12 flex items-center justify-center hover:text-white transition-colors relative ${
            activeIcon === 'extensions' ? 'text-white' : 'text-white/40'
          }`}
          onClick={() => handleIconClick('extensions', onExtensionsClick)}
          title="Extensions"
        >
          <Package size={24} />
          {activeIcon === 'extensions' && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"></div>
          )}
        </button>

        {/* Command Palette */}
        <button
          className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          onClick={onCommandPaletteClick}
          title="Command Palette (Ctrl+Shift+P)"
        >
          <Command size={24} />
        </button>

        {/* Chat Bot */}
        <button
          className={`w-12 h-12 flex items-center justify-center hover:text-white transition-colors relative ${
            activeIcon === 'chatbot' ? 'text-white' : 'text-white/40'
          }`}
          onClick={() => handleIconClick('chatbot', onChatBotClick)}
          title="AI Assistant"
        >
          <Bot size={24} />
          {activeIcon === 'chatbot' && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"></div>
          )}
        </button>

        {/* Bottom section */}
        <div className="mt-auto flex flex-col items-center gap-1 w-full">
          <button
            className={`w-12 h-12 flex items-center justify-center hover:text-white transition-colors relative ${
              activeIcon === 'contact' ? 'text-white' : 'text-white/40'
            }`}
            onClick={() => handleIconClick('contact', onContactClick)}
            title="Contact Me"
          >
            <Mail size={24} />
            {activeIcon === 'contact' && (
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"></div>
            )}
          </button>

          <button
            className={`w-12 h-12 flex items-center justify-center hover:text-white transition-colors relative ${
              activeIcon === 'terminal' ? 'text-white' : 'text-white/40'
            }`}
            onClick={() => handleIconClick('terminal', onTerminalClick)}
            title="Terminal"
          >
            <Terminal size={24} />
            {activeIcon === 'terminal' && (
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"></div>
            )}
          </button>

          <button
            className={`w-12 h-12 flex items-center justify-center hover:text-white transition-colors relative ${
              activeIcon === 'settings' ? 'text-white' : 'text-white/40'
            }`}
            onClick={() => handleIconClick('settings', onSettingsClick)}
            title="Settings"
          >
            <Settings size={24} />
            {activeIcon === 'settings' && (
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"></div>
            )}
          </button>

          {/* Like Button */}
          <div className="mt-4 border-t border-white/10 pt-4">
            <LikeButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
