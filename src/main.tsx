import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import './styles/responsive.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import { initFontLoading } from './utils/fontLoader'
import { initThemeLoading } from './utils/themeLoader'

// Initialize font loading
initFontLoading()

// Initialize theme loading to prevent flash of unstyled content
initThemeLoading()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
        <Analytics />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
