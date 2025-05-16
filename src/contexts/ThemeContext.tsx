import React, { createContext, useState, useContext, useEffect } from 'react'
import { saveTheme, getSavedTheme, getSystemThemePreference } from '../utils/themeLoader'

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
  },
  {
    id: 'vs-light',
    name: 'Light',
    background: '#ffffff',
    foreground: '#333333',
    accent: '#007acc',
    sidebar: '#f3f3f3',
    terminal: '#ffffff'
  }
]

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
  toggleDarkMode: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with saved theme or system preference
  const initialTheme = getSavedTheme() ||
    (getSystemThemePreference() === 'dark' ? THEMES[0] : THEMES[5])

  const [currentTheme, setCurrentTheme] = useState<Theme>(initialTheme)
  const [isDarkMode, setIsDarkMode] = useState(initialTheme.id !== 'vs-light')

  // Apply theme to document root and save to localStorage
  useEffect(() => {
    applyThemeToDOM(currentTheme)
    saveTheme(currentTheme)
  }, [currentTheme])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      if (!getSavedTheme()) {
        // Only auto-switch if user hasn't explicitly set a theme
        toggleDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const applyThemeToDOM = (theme: Theme) => {
    const root = document.documentElement
    root.style.setProperty('--vscode-editor-background', theme.background)
    root.style.setProperty('--vscode-editor-foreground', theme.foreground)
    root.style.setProperty('--vscode-accent', theme.accent)
    root.style.setProperty('--vscode-sidebar-background', theme.sidebar)
    root.style.setProperty('--vscode-terminal-background', theme.terminal)
  }

  const toggleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    // Apply the appropriate theme
    if (isDark) {
      setCurrentTheme(THEMES[0]) // VS Dark
    } else {
      // Light theme
      setCurrentTheme(THEMES[5]) // VS Light
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: setCurrentTheme,
        isDarkMode,
        toggleDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
