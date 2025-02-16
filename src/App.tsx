import React, { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import StatusBar from './components/StatusBar'
import FileExplorer from './components/FileExplorer'
import TabsBar from './components/TabsBar'
import BugGame from './components/BugGame'
import Terminal from './components/Terminal'
import Settings from './components/Settings'
import { FileItem } from './types'
import { Theme, THEMES } from './components/Settings'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Profile from './pages/Profile'
import './App.css'

const GAME_TAB = {
  name: 'Bug Squasher.tsx',
  type: 'file',
  path: '/game/BugSquasher'
} as const

const App: React.FC = () => {
  const [openFiles, setOpenFiles] = useState<FileItem[]>([])
  const [activeFile, setActiveFile] = useState<FileItem | null>(null)
  const [showTerminal, setShowTerminal] = useState(false)
  const [isContactMode, setIsContactMode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0])
  const [isExplorerOpen, setIsExplorerOpen] = useState(true)

  const handleFileClick = (file: FileItem) => {
    if (!openFiles.find(f => f.path === file.path)) {
      setOpenFiles([...openFiles, file])
    }
    setActiveFile(file)
  }

  const handleBugClick = () => {
    if (!openFiles.find(f => f.path === GAME_TAB.path)) {
      setOpenFiles([...openFiles, GAME_TAB])
    }
    setActiveFile(GAME_TAB)
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
        <div className="h-full flex items-center justify-center text-white/40">
          <p>Select a file from the explorer to view its content</p>
        </div>
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
      <div className="flex flex-1 overflow-hidden">
        <div className="flex">
          <Sidebar 
            onBugClick={handleBugClick}
            onTerminalClick={handleTerminalClick}
            onContactClick={handleContactClick}
            onSettingsClick={handleSettingsClick}
          />
          <FileExplorer 
            onFileClick={handleFileClick} 
            isOpen={isExplorerOpen}
            onClose={() => setIsExplorerOpen(false)}
          />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <TabsBar
            openFiles={openFiles}
            activeFile={activeFile}
            onTabClick={handleTabClick}
            onTabClose={handleTabClose}
          />
          <div className={`flex-1 overflow-auto relative ${showTerminal ? 'pb-[280px]' : ''}`}>
            <div className="h-full overflow-y-auto main-content">
              {renderContent()}
            </div>
            {showTerminal && (
              <Terminal 
                onClose={() => {
                  setShowTerminal(false)
                  setIsContactMode(false)
                }} 
                startContactForm={isContactMode}
              />
            )}
          </div>
        </div>
      </div>
      <StatusBar />
    </div>
  )
}

export default App 