import React, { useState, useEffect } from 'react'
import { Command, FileText, Play, Coffee, Github, ExternalLink, Mail, Download } from 'lucide-react'

interface WelcomeScreenProps {
  onFileClick: (file: any) => void
  onContactClick: () => void
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFileClick, onContactClick }) => {
  const [currentTip, setCurrentTip] = useState(0)
  
  // VS Code-like tips
  const tips = [
    "Press Ctrl+P to quickly navigate to any file",
    "Use the Command Palette (Ctrl+Shift+P) to access all commands",
    "Try the Bug Squasher game by clicking the bug icon in the sidebar",
    "Check out the terminal to see more interactive features",
    "Toggle between light and dark themes in Settings"
  ]
  
  // Rotate tips every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [tips.length])
  
  // Recent files mock data
  const recentFiles = [
    { name: 'Home.tsx', path: '/pages/Home' },
    { name: 'About.tsx', path: '/pages/About' },
    { name: 'Projects.tsx', path: '/pages/Projects' },
    { name: 'Skills.tsx', path: '/pages/Skills' }
  ]
  
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-4 py-8 overflow-auto">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to Anuj Dubey's Portfolio
          </h1>
          <p className="text-white/60 mt-2 text-lg">
            Explore my work and skills in this VS Code-inspired interface
          </p>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Start section */}
            <section className="bg-[#1e1e1e] rounded-lg p-6 border border-[#3c3c3c] shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-white/90 flex items-center">
                <Play size={18} className="mr-2 text-blue-400" />
                Start
              </h2>
              <div className="space-y-3">
                <button 
                  onClick={() => onFileClick({ name: 'Home.tsx', type: 'file', path: '/pages/Home' })}
                  className="w-full text-left px-4 py-2 rounded flex items-center text-white/80 hover:bg-[#2a2d2e] transition-colors"
                >
                  <FileText size={16} className="mr-3 text-blue-400" />
                  <span>Home Page</span>
                </button>
                <button 
                  onClick={() => onFileClick({ name: 'About.tsx', type: 'file', path: '/pages/About' })}
                  className="w-full text-left px-4 py-2 rounded flex items-center text-white/80 hover:bg-[#2a2d2e] transition-colors"
                >
                  <FileText size={16} className="mr-3 text-blue-400" />
                  <span>About Me</span>
                </button>
                <button 
                  onClick={() => onFileClick({ name: 'Projects.tsx', type: 'file', path: '/pages/Projects' })}
                  className="w-full text-left px-4 py-2 rounded flex items-center text-white/80 hover:bg-[#2a2d2e] transition-colors"
                >
                  <FileText size={16} className="mr-3 text-blue-400" />
                  <span>My Projects</span>
                </button>
                <button 
                  onClick={() => onFileClick({ name: 'Skills.tsx', type: 'file', path: '/pages/Skills' })}
                  className="w-full text-left px-4 py-2 rounded flex items-center text-white/80 hover:bg-[#2a2d2e] transition-colors"
                >
                  <FileText size={16} className="mr-3 text-blue-400" />
                  <span>Skills & Technologies</span>
                </button>
              </div>
            </section>
            
            {/* Recent section */}
            <section className="bg-[#1e1e1e] rounded-lg p-6 border border-[#3c3c3c] shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-white/90 flex items-center">
                <Coffee size={18} className="mr-2 text-green-400" />
                Recent
              </h2>
              <div className="space-y-2">
                {recentFiles.map((file, index) => (
                  <button 
                    key={index}
                    onClick={() => onFileClick({ name: file.name, type: 'file', path: file.path })}
                    className="w-full text-left px-4 py-2 rounded flex items-center text-white/80 hover:bg-[#2a2d2e] transition-colors"
                  >
                    <FileText size={16} className="mr-3 text-white/60" />
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Help section */}
            <section className="bg-[#1e1e1e] rounded-lg p-6 border border-[#3c3c3c] shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-white/90 flex items-center">
                <Command size={18} className="mr-2 text-purple-400" />
                Help & Tips
              </h2>
              <div className="bg-[#2d2d2d] p-4 rounded border border-[#3c3c3c] mb-4">
                <p className="text-white/80 italic">
                  "{tips[currentTip]}"
                </p>
                <div className="mt-2 flex justify-center">
                  {tips.map((_, index) => (
                    <div 
                      key={index} 
                      className={`w-2 h-2 rounded-full mx-1 ${
                        index === currentTip ? 'bg-blue-400' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-white/80">
                  <span className="bg-[#2d2d2d] px-2 py-1 rounded text-xs mr-2 min-w-[80px] text-center">Ctrl+P</span>
                  <span>Quick Open, Go to File</span>
                </div>
                <div className="flex items-center text-white/80">
                  <span className="bg-[#2d2d2d] px-2 py-1 rounded text-xs mr-2 min-w-[80px] text-center">Ctrl+Shift+P</span>
                  <span>Command Palette</span>
                </div>
                <div className="flex items-center text-white/80">
                  <span className="bg-[#2d2d2d] px-2 py-1 rounded text-xs mr-2 min-w-[80px] text-center">Ctrl+`</span>
                  <span>Toggle Terminal</span>
                </div>
              </div>
            </section>
            
            {/* Connect section */}
            <section className="bg-[#1e1e1e] rounded-lg p-6 border border-[#3c3c3c] shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-white/90 flex items-center">
                <Github size={18} className="mr-2 text-orange-400" />
                Connect
              </h2>
              <div className="space-y-3">
                <a 
                  href="https://github.com/anujdubey-22" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full text-left px-4 py-2 rounded flex items-center text-white/80 hover:bg-[#2a2d2e] transition-colors"
                >
                  <Github size={16} className="mr-3 text-white/60" />
                  <span>GitHub</span>
                  <ExternalLink size={12} className="ml-2 text-white/40" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/anuj-dubey-26a01a246/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full text-left px-4 py-2 rounded flex items-center text-white/80 hover:bg-[#2a2d2e] transition-colors"
                >
                  <svg className="w-4 h-4 mr-3 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                  <ExternalLink size={12} className="ml-2 text-white/40" />
                </a>
                <button 
                  onClick={onContactClick}
                  className="w-full text-left px-4 py-2 rounded flex items-center text-white/80 hover:bg-[#2a2d2e] transition-colors"
                >
                  <Mail size={16} className="mr-3 text-white/60" />
                  <span>Contact Me</span>
                </button>
                <a 
                  href="/Anuj_Dubey_Resume.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full text-left px-4 py-2 rounded flex items-center text-white/80 hover:bg-[#2a2d2e] transition-colors"
                >
                  <Download size={16} className="mr-3 text-white/60" />
                  <span>Download Resume</span>
                  <ExternalLink size={12} className="ml-2 text-white/40" />
                </a>
              </div>
            </section>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-white/40 text-sm">
          <p>Built with React, TypeScript, and Tailwind CSS</p>
          <p className="mt-1">© {new Date().getFullYear()} Anuj Dubey. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
