import React, { createContext, useState, useContext, useEffect } from 'react'

// Define the supported locales
export const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: 'Chinese' }
]

// Define the context type
interface LanguageContextType {
  currentLocale: string
  setLocale: (locale: string) => void
  locales: typeof SUPPORTED_LOCALES
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLocale: 'en',
  setLocale: () => {},
  locales: SUPPORTED_LOCALES
})

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext)

// Save the current locale to localStorage
export const saveLocale = (locale: string): void => {
  localStorage.setItem('vscode-portfolio-locale', locale)
}

// Get the saved locale from localStorage
export const getSavedLocale = (): string | null => {
  return localStorage.getItem('vscode-portfolio-locale')
}

// Get the browser's preferred language
export const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0]
  const isSupported = SUPPORTED_LOCALES.some(locale => locale.code === browserLang)
  return isSupported ? browserLang : 'en'
}

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with saved locale, browser preference, or default to English
  const [currentLocale, setCurrentLocale] = useState<string>(
    getSavedLocale() || getBrowserLanguage() || 'en'
  )

  // Update localStorage when locale changes
  useEffect(() => {
    saveLocale(currentLocale)
  }, [currentLocale])

  // Set locale function
  const setLocale = (locale: string) => {
    setCurrentLocale(locale)
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLocale,
        setLocale,
        locales: SUPPORTED_LOCALES
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext
