import React, { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import StatusBar from './components/StatusBar'
import FileExplorer from './components/FileExplorer'
import TabsBar from './components/TabsBar'
import BugGame from './components/BugGame'
import MemoryGame from './components/MemoryGame'
import Terminal from './components/Terminal'
import Settings from './components/Settings'
import CommandPalette from './components/CommandPalette'
import Breadcrumbs from './components/Breadcrumbs'
import Extensions from './components/Extensions'
import WelcomeScreen from './components/WelcomeScreen'
import { FileItem } from './types'
import { Theme, THEMES } from './components/Settings'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Profile from './pages/Profile'
import './App.css'

const BUG_GAME_TAB = {
  name: 'Bug Squasher.tsx',
  type: 'file',
  path: '/game/BugSquasher'
} as const

const MEMORY_GAME_TAB = {
  name: 'Memory Match.tsx',
  type: 'file',
  path: '/game/MemoryMatch'
} as const

const App: React.FC = () => {
  const [openFiles, setOpenFiles] = useState<FileItem[]>([])
  const [activeFile, setActiveFile] = useState<FileItem | null>(null)
  const [showTerminal, setShowTerminal] = useState(false)
  const [isContactMode, setIsContactMode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0])
  const [isExplorerOpen, setIsExplorerOpen] = useState(true)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showExtensions, setShowExtensions] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette (Ctrl+Shift+P)
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      
      // Quick Open (Ctrl+P)
      if (e.ctrlKey && !e.shiftKey && e.key === 'p') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      
      // Toggle Terminal (Ctrl+`)
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault()
        setShowTerminal(prev => !prev)
        setIsContactMode(false)
      }
      
      // Toggle Settings (Ctrl+,)
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault()
        setShowSettings(true)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleFileClick = (file: FileItem) => {
    if (!openFiles.find(f => f.path === file.path)) {
      setOpenFiles([...openFiles, file])
    }
    setActiveFile(file)
  }

  const handleBugClick = () => {
    if (!openFiles.find(f => f.path === BUG_GAME_TAB.path)) {
      setOpenFiles([...openFiles, BUG_GAME_TAB])
    }
    setActiveFile(BUG_GAME_TAB)
  }
  
  const handleMemoryGameClick = () => {
    if (!openFiles.find(f => f.path === MEMORY_GAME_TAB.path)) {
      setOpenFiles([...openFiles, MEMORY_GAME_TAB])
    }
    setActiveFile(MEMORY_GAME_TAB)
  }

  const handleTerminalClick = () => {
    setShowTerminal(prev => !prev)
    setIsContactMode(false)
  }

  const handleContactClick = () => {
    setShowTerminal(true)
    setIsContactMode(true)
  }

  const handleSettingsClick = () => {
    setShowSettings(true)
  }

  const handleCommandPaletteClick = () => {
    setShowCommandPalette(true)
  }

  const handleExtensionsClick = () => {
    setShowExtensions(!showExtensions)
  }

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    // Apply theme colors to root element
    const root = document.documentElement
    root.style.setProperty('--vscode-editor-background', theme.background)
    root.style.setProperty('--vscode-editor-foreground', theme.foreground)
    root.style.setProperty('--vscode-accent', theme.accent)
    root.style.setProperty('--vscode-sidebar-background', theme.sidebar)
    root.style.setProperty('--vscode-terminal-background', theme.terminal)
  }

  const handleTabClick = (file: FileItem) => {
    setActiveFile(file)
  }

  const handleTabClose = (file: FileItem) => {
    const newOpenFiles = openFiles.filter(f => f.path !== file.path)
    setOpenFiles(newOpenFiles)
    if (activeFile?.path === file.path) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1] || null)
    }
  }

  const renderContent = () => {
    if (showSettings) {
      return (
        <Settings 
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          onClose={() => setShowSettings(false)}
        />
      )
    }

    if (!activeFile) {
      return (
        <WelcomeScreen 
          onFileClick={handleFileClick}
          onContactClick={handleContactClick}
        />
      )
    }

    switch (activeFile.path) {
      case '/pages/Home':
        return <Home onContactClick={handleContactClick} />
      case '/pages/About':
        return <About />
      case '/pages/Work':
        return <Work />
      case '/pages/Skills':
        return <Skills />
      case '/pages/Projects':
        return <Projects />
      case '/pages/Profile':
        return <Profile />
      case '/game/BugSquasher':
        return <BugGame />
      case '/game/MemoryMatch':
        return <MemoryGame />
      default:
        return (
          <div className="p-4">
            <p>Content for {activeFile.path} is not yet implemented.</p>
          </div>
        )
    }
  }

  return (
    <div 
      className="h-screen flex flex-col"
      style={{ 
        backgroundColor: currentTheme.background,
        color: currentTheme.foreground
      }}
    >
      <Header 
        onMenuClick={() => setIsExplorerOpen(!isExplorerOpen)} 
        onContactClick={handleContactClick}
      />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex">
          <Sidebar 
            onBugClick={handleBugClick}
            onMemoryGameClick={handleMemoryGameClick}
            onTerminalClick={handleTerminalClick}
            onContactClick={handleContactClick}
            onSettingsClick={handleSettingsClick}
            onExtensionsClick={handleExtensionsClick}
            onCommandPaletteClick={handleCommandPaletteClick}
          />
          <FileExplorer 
            onFileClick={handleFileClick} 
            isOpen={isExplorerOpen}
            onClose={() => setIsExplorerOpen(false)}
          />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <TabsBar
            openFiles={openFiles}
            activeFile={activeFile}
            onTabClick={handleTabClick}
            onTabClose={handleTabClose}
          />
          {activeFile && <Breadcrumbs activeFile={activeFile} />}
          <div className="flex-1 relative overflow-hidden">
            <div 
              ref={contentRef}
              className="h-full overflow-y-auto"
            >
              {renderContent()}
            </div>
            {showTerminal && (
              <Terminal 
                onClose={() => {
                  setShowTerminal(false)
                  setIsContactMode(false)
                }} 
                startContactForm={isContactMode}
                className="h-[280px]"
              />
            )}
          </div>
        </div>
        {showExtensions && (
          <Extensions 
            isOpen={showExtensions}
            onClose={() => setShowExtensions(false)}
          />
        )}
      </div>
      <StatusBar />
      
      {/* Command Palette */}
      <CommandPalette 
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onFileClick={handleFileClick}
        onBugClick={handleBugClick}
        onMemoryGameClick={handleMemoryGameClick}
        onTerminalClick={handleTerminalClick}
        onContactClick={handleContactClick}
        onSettingsClick={handleSettingsClick}
      />
    </div>
  )
}

export default App
