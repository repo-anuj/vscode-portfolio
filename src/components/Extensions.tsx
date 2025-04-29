import React, { useState } from 'react'
import { X, Search, Download, RefreshCw, Package, Star, ExternalLink } from 'lucide-react'

interface ExtensionsProps {
  isOpen: boolean
  onClose: () => void
}

interface Extension {
  id: string
  name: string
  publisher: string
  description: string
  stars: number
  downloads: number
  verified: boolean
  installed: boolean
  icon: string
}

const Extensions: React.FC<ExtensionsProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'installed' | 'popular' | 'recommended'>('installed')
  
  // Mock data for extensions
  const extensions: Extension[] = [
    {
      id: 'react-tools',
      name: 'React Developer Tools',
      publisher: 'React',
      description: 'React debugging tools for the Chrome Developer Tools',
      stars: 4.8,
      downloads: 2500000,
      verified: true,
      installed: true,
      icon: '🔵'
    },
    {
      id: 'tailwind-intellisense',
      name: 'Tailwind CSS IntelliSense',
      publisher: 'Tailwind Labs',
      description: 'Intelligent Tailwind CSS tooling for VS Code',
      stars: 4.9,
      downloads: 3200000,
      verified: true,
      installed: true,
      icon: '🟣'
    },
    {
      id: 'prettier',
      name: 'Prettier - Code formatter',
      publisher: 'Prettier',
      description: 'Code formatter using prettier',
      stars: 4.7,
      downloads: 5100000,
      verified: true,
      installed: true,
      icon: '🟠'
    },
    {
      id: 'eslint',
      name: 'ESLint',
      publisher: 'Microsoft',
      description: 'Integrates ESLint JavaScript into VS Code',
      stars: 4.6,
      downloads: 4800000,
      verified: true,
      installed: false,
      icon: '🟢'
    },
    {
      id: 'github-copilot',
      name: 'GitHub Copilot',
      publisher: 'GitHub',
      description: 'Your AI pair programmer',
      stars: 4.5,
      downloads: 2000000,
      verified: true,
      installed: false,
      icon: '⚫'
    },
    {
      id: 'material-icons',
      name: 'Material Icon Theme',
      publisher: 'Philipp Kief',
      description: 'Material Design Icons for Visual Studio Code',
      stars: 4.8,
      downloads: 3500000,
      verified: true,
      installed: false,
      icon: '🟡'
    },
    {
      id: 'live-server',
      name: 'Live Server',
      publisher: 'Ritwick Dey',
      description: 'Launch a development local Server with live reload feature',
      stars: 4.7,
      downloads: 4200000,
      verified: true,
      installed: false,
      icon: '🔴'
    }
  ]
  
  // Filter extensions based on search term and active tab
  const filteredExtensions = extensions
    .filter(ext => 
      ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ext.publisher.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(ext => {
      if (activeTab === 'installed') return ext.installed
      if (activeTab === 'popular') return ext.downloads > 3000000
      return true // recommended tab shows all
    })
  
  if (!isOpen) return null
  
  return (
    <div className="w-[300px] h-full bg-vscode-sidebar border-l border-[#1e1e1e] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-[#3c3c3c]">
        <h2 className="text-sm font-medium text-white/90">Extensions</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-sm transition-colors"
        >
          <X size={16} className="text-white/60" />
        </button>
      </div>
      
      {/* Search */}
      <div className="p-2 border-b border-[#3c3c3c]">
        <div className="flex items-center bg-[#3c3c3c] rounded-sm px-2">
          <Search size={14} className="text-white/60 mr-1" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Extensions..."
            className="w-full bg-transparent border-none outline-none py-1 text-sm text-white/90 placeholder-white/40"
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-[#3c3c3c]">
        <button
          className={`flex-1 py-1 text-xs font-medium ${
            activeTab === 'installed' 
              ? 'text-white border-b-2 border-white/80' 
              : 'text-white/60 hover:text-white/80'
          }`}
          onClick={() => setActiveTab('installed')}
        >
          Installed
        </button>
        <button
          className={`flex-1 py-1 text-xs font-medium ${
            activeTab === 'popular' 
              ? 'text-white border-b-2 border-white/80' 
              : 'text-white/60 hover:text-white/80'
          }`}
          onClick={() => setActiveTab('popular')}
        >
          Popular
        </button>
        <button
          className={`flex-1 py-1 text-xs font-medium ${
            activeTab === 'recommended' 
              ? 'text-white border-b-2 border-white/80' 
              : 'text-white/60 hover:text-white/80'
          }`}
          onClick={() => setActiveTab('recommended')}
        >
          Recommended
        </button>
      </div>
      
      {/* Extension List */}
      <div className="flex-1 overflow-y-auto">
        {filteredExtensions.length === 0 ? (
          <div className="p-4 text-white/40 text-center text-sm">
            No extensions found
          </div>
        ) : (
          <div className="divide-y divide-[#3c3c3c]/30">
            {filteredExtensions.map(extension => (
              <div key={extension.id} className="p-3 hover:bg-[#2a2d2e] cursor-pointer">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">{extension.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white/90 truncate">{extension.name}</h3>
                      {extension.installed ? (
                        <button className="text-xs bg-[#4d4d4d] text-white/80 px-1.5 py-0.5 rounded-sm">
                          Installed
                        </button>
                      ) : (
                        <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 rounded-sm flex items-center">
                          <Download size={10} className="mr-1" />
                          Install
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-white/60 flex items-center mt-0.5">
                      {extension.publisher}
                      {extension.verified && (
                        <span className="ml-1 text-blue-400 text-[10px]">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-white/70 mt-1 line-clamp-2">
                      {extension.description}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-white/60">
                      <div className="flex items-center mr-3">
                        <Star size={12} className="mr-1 text-yellow-400" />
                        {extension.stars}
                      </div>
                      <div className="flex items-center">
                        <Download size={12} className="mr-1" />
                        {extension.downloads.toLocaleString()}
                      </div>
                      <a 
                        href="#" 
                        className="ml-auto text-white/50 hover:text-white/80"
                        title="View in Marketplace"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-2 border-t border-[#3c3c3c] flex justify-between">
        <button className="text-xs text-white/60 hover:text-white/80 flex items-center">
          <RefreshCw size={12} className="mr-1" />
          Refresh
        </button>
        <button className="text-xs text-white/60 hover:text-white/80 flex items-center">
          <Package size={12} className="mr-1" />
          More Extensions
        </button>
      </div>
    </div>
  )
}

export default Extensions
