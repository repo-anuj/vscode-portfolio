import React, { useState } from 'react'
import { Moon, Sun, Monitor, Palette, Type, Layout, X } from 'lucide-react'

export interface Theme {
  id: string
  name: string
  background: string
  foreground: string
  accent: string
  sidebar: string
  terminal: string
}

export const THEMES: Theme[] = [
  {
    id: 'vs-dark',
    name: 'Dark+ (default)',
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    accent: '#007acc',
    sidebar: '#252526',
    terminal: '#1e1e1e'
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    background: '#24292e',
    foreground: '#e1e4e8',
    accent: '#2188ff',
    sidebar: '#1f2428',
    terminal: '#1f2428'
  },
  {
    id: 'monokai',
    name: 'Monokai',
    background: '#272822',
    foreground: '#f8f8f2',
    accent: '#a6e22e',
    sidebar: '#1e1f1c',
    terminal: '#272822'
  },
  {
    id: 'dracula',
    name: 'Dracula',
    background: '#282a36',
    foreground: '#f8f8f2',
    accent: '#bd93f9',
    sidebar: '#21222c',
    terminal: '#282a36'
  },
  {
    id: 'nord',
    name: 'Nord',
    background: '#2e3440',
    foreground: '#d8dee9',
    accent: '#88c0d0',
    sidebar: '#2e3440',
    terminal: '#2e3440'
  }
]

interface SettingsProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
  onClose: () => void
}

interface EditorSettings {
  fontSize: string;
  fontFamily: string;
  lineHeight: string;
  minimap: boolean;
  breadcrumbs: boolean;
  lineNumbers: boolean;
}

const Settings: React.FC<SettingsProps> = ({ currentTheme, onThemeChange, onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    fontSize: '14px',
    fontFamily: 'Consolas',
    lineHeight: '1.5',
    minimap: true,
    breadcrumbs: true,
    lineNumbers: true
  })

  const handleDarkModeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark)
    // Apply the appropriate theme
    if (isDark) {
      onThemeChange(THEMES[0]) // VS Dark
    } else {
      // Light theme version of VS Code
      onThemeChange({
        id: 'vs-light',
        name: 'Light',
        background: '#ffffff',
        foreground: '#333333',
        accent: '#007acc',
        sidebar: '#f3f3f3',
        terminal: '#ffffff'
      })
    }
  }

  const handleThemeChange = (theme: Theme) => {
    onThemeChange(theme)
    const root = document.documentElement

    // Core theme colors
    root.style.setProperty('--vscode-editor-background', theme.background)
    root.style.setProperty('--vscode-editor-foreground', theme.foreground)
    root.style.setProperty('--vscode-accent', theme.accent)
    root.style.setProperty('--vscode-sidebar-background', theme.sidebar)
    root.style.setProperty('--vscode-terminal-background', theme.terminal)

    // Text colors
    root.style.setProperty('--vscode-text-primary', theme.foreground)
    root.style.setProperty('--vscode-text-secondary', adjustColor(theme.foreground, -30))
    root.style.setProperty('--vscode-text-link', theme.accent)
    root.style.setProperty('--vscode-text-active', '#ffffff')
    root.style.setProperty('--vscode-text-inactive', adjustColor(theme.foreground, -50))

    // UI Element colors
    root.style.setProperty('--vscode-border', adjustColor(theme.background, 10))
    root.style.setProperty('--vscode-button-background', theme.accent)
    root.style.setProperty('--vscode-button-hover-background', adjustColor(theme.accent, 10))
    root.style.setProperty('--vscode-button-active-background', adjustColor(theme.accent, 15))
    root.style.setProperty('--vscode-dropdown-background', adjustColor(theme.background, 15))
    root.style.setProperty('--vscode-dropdown-border', adjustColor(theme.background, 15))
    root.style.setProperty('--vscode-input-background', adjustColor(theme.background, 15))
    root.style.setProperty('--vscode-input-border', adjustColor(theme.background, 15))

    // List and tree colors
    root.style.setProperty('--vscode-list-active-selection-background', adjustColor(theme.accent, -20))
    root.style.setProperty('--vscode-list-hover-background', adjustColor(theme.background, 5))
    root.style.setProperty('--vscode-list-inactive-selection-background', adjustColor(theme.background, 10))

    // Tab colors
    root.style.setProperty('--vscode-tab-active-background', theme.background)
    root.style.setProperty('--vscode-tab-inactive-background', adjustColor(theme.background, 10))
    root.style.setProperty('--vscode-tab-active-foreground', theme.foreground)
    root.style.setProperty('--vscode-tab-inactive-foreground', adjustColor(theme.foreground, -30))

    // Status bar colors
    root.style.setProperty('--vscode-statusbar-background', theme.accent)
    root.style.setProperty('--vscode-statusbar-foreground', '#ffffff')
    root.style.setProperty('--vscode-statusbar-border', theme.accent)

    // Scrollbar colors
    root.style.setProperty('--vscode-scrollbarSlider-background', theme.accent + '66')
    root.style.setProperty('--vscode-scrollbarSlider-hoverBackground', theme.accent + 'b3')
    root.style.setProperty('--vscode-scrollbarSlider-activeBackground', theme.accent + '66')
  }

  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number): string => {
    const clamp = (num: number) => Math.min(255, Math.max(0, num))
    
    // Convert hex to RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    // Adjust each component
    const adjustR = clamp(r + amount)
    const adjustG = clamp(g + amount)
    const adjustB = clamp(b + amount)
    
    // Convert back to hex
    const toHex = (n: number) => n.toString(16).padStart(2, '0')
    return `#${toHex(adjustR)}${toHex(adjustG)}${toHex(adjustB)}`
  }

  const updateEditorSetting = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => {
    setEditorSettings(prev => {
      const newSettings = { ...prev, [key]: value }
      
      // Apply settings to document
      document.documentElement.style.setProperty('--editor-font-size', newSettings.fontSize)
      document.documentElement.style.setProperty('--editor-font-family', newSettings.fontFamily)
      document.documentElement.style.setProperty('--editor-line-height', newSettings.lineHeight)
      
      return newSettings
    })
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Settings Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2d2d2d] bg-[#1e1e1e] text-white/80">
        <h1 className="text-xl font-semibold">Settings</h1>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-sm transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto bg-[#1e1e1e] text-white/80 settings-content">
        <div className="max-w-3xl mx-auto p-6 space-y-8">
          {/* Theme Section */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-medium mb-4">
              <Palette size={20} />
              Color Theme
            </h2>
            <div className="space-y-3">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    currentTheme.id === theme.id
                      ? 'bg-vscode-accent/20 text-white'
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => handleThemeChange(theme)}
                >
                  <div 
                    className="w-6 h-6 rounded border border-white/20"
                    style={{ backgroundColor: theme.background }}
                  >
                    <div 
                      className="w-1/2 h-full rounded-l"
                      style={{ backgroundColor: theme.sidebar }}
                    />
                  </div>
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Appearance Section */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-medium mb-4">
              <Monitor size={20} />
              Appearance
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border border-white/10 transition-colors ${
                  !isDarkMode ? 'bg-vscode-accent/20' : 'hover:bg-white/5'
                }`}
                onClick={() => handleDarkModeToggle(false)}
              >
                <Sun size={16} />
                <span>Light Mode</span>
              </button>
              <button 
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border border-white/10 transition-colors ${
                  isDarkMode ? 'bg-vscode-accent/20' : 'hover:bg-white/5'
                }`}
                onClick={() => handleDarkModeToggle(true)}
              >
                <Moon size={16} />
                <span>Dark Mode</span>
              </button>
            </div>
          </section>

          {/* Editor Section */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-medium mb-4">
              <Type size={20} />
              Editor
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Font Size</span>
                <select 
                  className="bg-[#3c3c3c] border border-white/10 rounded px-2 py-1"
                  value={editorSettings.fontSize}
                  onChange={(e) => updateEditorSetting('fontSize', e.target.value)}
                >
                  <option>12px</option>
                  <option>14px</option>
                  <option>16px</option>
                  <option>18px</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>Font Family</span>
                <select 
                  className="bg-[#3c3c3c] border border-white/10 rounded px-2 py-1"
                  value={editorSettings.fontFamily}
                  onChange={(e) => updateEditorSetting('fontFamily', e.target.value)}
                >
                  <option>Consolas</option>
                  <option>Fira Code</option>
                  <option>JetBrains Mono</option>
                  <option>Monaco</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>Line Height</span>
                <select 
                  className="bg-[#3c3c3c] border border-white/10 rounded px-2 py-1"
                  value={editorSettings.lineHeight}
                  onChange={(e) => updateEditorSetting('lineHeight', e.target.value)}
                >
                  <option>1.4</option>
                  <option>1.5</option>
                  <option>1.6</option>
                  <option>1.8</option>
                </select>
              </div>
            </div>
          </section>

          {/* Layout Section */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-medium mb-4">
              <Layout size={20} />
              Layout
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Minimap</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={editorSettings.minimap}
                    onChange={(e) => updateEditorSetting('minimap', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-[#3c3c3c] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vscode-accent"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Breadcrumbs</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={editorSettings.breadcrumbs}
                    onChange={(e) => updateEditorSetting('breadcrumbs', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-[#3c3c3c] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vscode-accent"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Line Numbers</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={editorSettings.lineNumbers}
                    onChange={(e) => updateEditorSetting('lineNumbers', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-[#3c3c3c] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vscode-accent"></div>
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Settings 