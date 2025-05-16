/**
 * Theme loading utility to prevent flash of unstyled content
 */

import { Theme, THEMES } from '../contexts/ThemeContext'

// Add a script to the head to set the theme before the app loads
export const addThemeScript = (): void => {
  const script = document.createElement('script')
  script.innerHTML = `
    (function() {
      // Try to get the theme from localStorage
      var savedTheme = localStorage.getItem('vscode-portfolio-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Default to dark theme if no saved theme or system preference is dark
      var themeId = savedTheme || (prefersDark ? 'vs-dark' : 'vs-light');
      
      // Find the theme in the THEMES array
      var themes = ${JSON.stringify(THEMES)};
      var theme = themes.find(function(t) { return t.id === themeId; }) || themes[0];
      
      // Apply the theme to the document
      var root = document.documentElement;
      root.style.setProperty('--vscode-editor-background', theme.background);
      root.style.setProperty('--vscode-editor-foreground', theme.foreground);
      root.style.setProperty('--vscode-accent', theme.accent);
      root.style.setProperty('--vscode-sidebar-background', theme.sidebar);
      root.style.setProperty('--vscode-terminal-background', theme.terminal);
      
      // Add a class to the document to indicate the theme
      document.documentElement.classList.add('theme-' + theme.id);
      
      // Store the theme in localStorage
      localStorage.setItem('vscode-portfolio-theme', theme.id);
    })();
  `
  document.head.appendChild(script)
}

// Save the current theme to localStorage
export const saveTheme = (theme: Theme): void => {
  localStorage.setItem('vscode-portfolio-theme', theme.id)
  
  // Update the theme class on the document
  document.documentElement.classList.forEach((className) => {
    if (className.startsWith('theme-')) {
      document.documentElement.classList.remove(className)
    }
  })
  document.documentElement.classList.add(`theme-${theme.id}`)
}

// Get the saved theme from localStorage
export const getSavedTheme = (): Theme | null => {
  const savedThemeId = localStorage.getItem('vscode-portfolio-theme')
  if (savedThemeId) {
    const theme = THEMES.find((t) => t.id === savedThemeId)
    if (theme) {
      return theme
    }
  }
  return null
}

// Get the system preference for dark mode
export const getSystemThemePreference = (): 'dark' | 'light' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Initialize theme loading
export const initThemeLoading = (): void => {
  addThemeScript()
}
