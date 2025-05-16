import React, { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface LanguageSelectorProps {
  className?: string
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { currentLocale, setLocale, locales } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Get the current locale name
  const currentLocaleName = locales.find(locale => locale.code === currentLocale)?.name || 'English'

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        className="flex items-center gap-1 hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <Globe size={14} />
        <span className="hidden sm:inline">{currentLocaleName}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-1 bg-vscode-editor border border-vscode-border rounded shadow-lg z-50 min-w-32">
          <ul className="py-1">
            {locales.map(locale => (
              <li key={locale.code}>
                <button
                  className={`w-full text-left px-3 py-1.5 hover:bg-vscode-highlight ${
                    currentLocale === locale.code ? 'bg-vscode-highlight/50' : ''
                  }`}
                  onClick={() => {
                    setLocale(locale.code)
                    setIsOpen(false)
                  }}
                >
                  {locale.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
