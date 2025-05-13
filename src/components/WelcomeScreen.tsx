import React from 'react'
import {
  Home,
  User,
  Code,
  Briefcase,
  Terminal,
  Star,
  Lightbulb,
  Github,
  ExternalLink,
  Mail,
  Download,
  GraduationCap,
  Award
} from 'lucide-react'
import './WelcomeScreen.css'

interface WelcomeScreenProps {
  onFileClick: (file: any) => void
  onContactClick: () => void
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFileClick, onContactClick }) => {
  // Recent files mock data
  const recentFiles = [
    { name: 'Home.tsx', path: '/pages/Home' },
    { name: 'About.tsx', path: '/pages/About' },
    { name: 'Projects.tsx', path: '/pages/Projects' },
    { name: 'Skills.tsx', path: '/pages/Skills' }
  ]

  return (
    <div className="h-full w-full flex flex-col px-4 py-8 overflow-auto welcome-screen-container">
      <div className="max-w-5xl w-full mx-auto">
        {/* Header - VS Code style with portfolio focus */}
        <div className="mb-10 welcome-screen-header">
          <h1 className="text-4xl font-semibold text-white mb-1">
            Anuj Dubey's Portfolio
          </h1>
          <p className="text-[#9d9d9d] text-xl">
            Full-Stack Developer
          </p>
        </div>

        {/* Main content - Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Navigation */}
          <div>
            <h2 className="text-white text-xl mb-4">Explore</h2>
            <div className="space-y-3">
              <button
                onClick={() => onFileClick({ name: 'Home.tsx', type: 'file', path: '/pages/Home' })}
                className="w-full text-left px-3 py-2 rounded flex items-center text-[#0098ff] hover:bg-[#2a2d2e] transition-colors welcome-button"
              >
                <Home size={16} className="mr-3" />
                <span>Home Page</span>
              </button>
              <button
                onClick={() => onFileClick({ name: 'About.tsx', type: 'file', path: '/pages/About' })}
                className="w-full text-left px-3 py-2 rounded flex items-center text-[#0098ff] hover:bg-[#2a2d2e] transition-colors welcome-button"
              >
                <User size={16} className="mr-3" />
                <span>About Me</span>
              </button>
              <button
                onClick={() => onFileClick({ name: 'Projects.tsx', type: 'file', path: '/pages/Projects' })}
                className="w-full text-left px-3 py-2 rounded flex items-center text-[#0098ff] hover:bg-[#2a2d2e] transition-colors welcome-button"
              >
                <Code size={16} className="mr-3" />
                <span>My Projects</span>
              </button>
              <button
                onClick={() => onFileClick({ name: 'Skills.tsx', type: 'file', path: '/pages/Skills' })}
                className="w-full text-left px-3 py-2 rounded flex items-center text-[#0098ff] hover:bg-[#2a2d2e] transition-colors welcome-button"
              >
                <Briefcase size={16} className="mr-3" />
                <span>Skills & Technologies</span>
              </button>
              <button
                onClick={onContactClick}
                className="w-full text-left px-3 py-2 rounded flex items-center text-[#0098ff] hover:bg-[#2a2d2e] transition-colors welcome-button"
              >
                <Terminal size={16} className="mr-3" />
                <span>Contact Me</span>
              </button>
            </div>

            {/* Recent section */}
            <h2 className="text-white text-xl mt-8 mb-4">Recent</h2>
            <div className="space-y-2">
              {recentFiles.map((file, index) => (
                <button
                  key={index}
                  onClick={() => onFileClick({ name: file.name, type: 'file', path: file.path })}
                  className="w-full text-left px-3 py-1 rounded flex items-center text-[#0098ff] hover:bg-[#2a2d2e] transition-colors welcome-button"
                >
                  <span className="truncate">{file.name}</span>
                  <span className="ml-2 text-[#6c6c6c] text-xs welcome-screen-recent-path">src/pages/{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right column - Portfolio Highlights */}
          <div>
            <h2 className="text-white text-xl mb-4">Portfolio Highlights</h2>

            {/* Featured Projects Card */}
            <div className="bg-[#252526] rounded-md border border-[#3c3c3c] mb-4 overflow-hidden walkthrough-card">
              <div className="p-4">
                <div className="flex items-start">
                  <Star className="text-white mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-white font-medium text-base">Featured Projects</h3>
                    <p className="text-[#9d9d9d] text-sm mt-1">
                      Explore my recent work including Pac-Man Game, Codeplayers Website, and more
                    </p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-[#3c3c3c] h-1 rounded-full overflow-hidden">
                  <div className="bg-[#0098ff] h-full w-[60%] progress-bar-fill"></div>
                </div>
              </div>
              <button
                onClick={() => onFileClick({ name: 'Projects.tsx', type: 'file', path: '/pages/Projects' })}
                className="w-full text-left px-4 py-2 bg-[#2d2d2d] text-[#0098ff] hover:bg-[#3a3a3a] transition-colors"
              >
                View Projects
              </button>
            </div>

            {/* Skills & Technologies Card */}
            <div className="bg-[#252526] rounded-md border border-[#3c3c3c] mb-4 overflow-hidden walkthrough-card">
              <div className="p-4">
                <div className="flex items-start">
                  <Lightbulb className="text-white mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-white font-medium text-base">Skills & Technologies</h3>
                    <p className="text-[#9d9d9d] text-sm mt-1">
                      React, TypeScript, Node.js, Next.js, Tailwind and more
                    </p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-[#3c3c3c] h-1 rounded-full overflow-hidden">
                  <div className="bg-[#0098ff] h-full w-[75%] progress-bar-fill"></div>
                </div>
              </div>
              <button
                onClick={() => onFileClick({ name: 'Skills.tsx', type: 'file', path: '/pages/Skills' })}
                className="w-full text-left px-4 py-2 bg-[#2d2d2d] text-[#0098ff] hover:bg-[#3a3a3a] transition-colors"
              >
                View Skills
              </button>
            </div>

            {/* Education & Certifications Card */}
            <div className="bg-[#252526] rounded-md border border-[#3c3c3c] mb-4 overflow-hidden walkthrough-card">
              <div className="p-4">
                <div className="flex items-start">
                  <GraduationCap className="text-white mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-white font-medium text-base">Education & Certifications</h3>
                    <p className="text-[#9d9d9d] text-sm mt-1">
                      BCA from Shri Shankaracharya Professional University, Postman API Expert, and more
                    </p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-[#3c3c3c] h-1 rounded-full overflow-hidden">
                  <div className="bg-[#0098ff] h-full w-[90%] progress-bar-fill"></div>
                </div>
              </div>
              <button
                onClick={() => onFileClick({ name: 'About.tsx', type: 'file', path: '/pages/About' })}
                className="w-full text-left px-4 py-2 bg-[#2d2d2d] text-[#0098ff] hover:bg-[#3a3a3a] transition-colors"
              >
                View Details
              </button>
            </div>

            {/* Connect section */}
            <div className="bg-[#252526] rounded-md border border-[#3c3c3c] overflow-hidden mt-6 walkthrough-card">
              <div className="p-4">
                <h3 className="text-white font-medium text-base mb-3">Connect</h3>
                <div className="space-y-3">
                  <a
                    href="https://github.com/anujdubey-22"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-3 py-2 rounded flex items-center text-[#0098ff] hover:bg-[#2a2d2e] transition-colors welcome-button"
                  >
                    <Github size={16} className="mr-3" />
                    <span>GitHub</span>
                    <ExternalLink size={12} className="ml-2 text-white/40" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/anuj-dubey-26a01a246/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-3 py-2 rounded flex items-center text-[#0098ff] hover:bg-[#2a2d2e] transition-colors welcome-button"
                  >
                    <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>LinkedIn</span>
                    <ExternalLink size={12} className="ml-2 text-white/40" />
                  </a>
                  <button
                    onClick={onContactClick}
                    className="w-full text-left px-3 py-2 rounded flex items-center text-[#0098ff] hover:bg-[#2a2d2e] transition-colors welcome-button"
                  >
                    <Mail size={16} className="mr-3" />
                    <span>Contact Me</span>
                  </button>
                  <a
                    href="/Anuj_Dubey_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-3 py-2 rounded flex items-center text-[#0098ff] hover:bg-[#2a2d2e] transition-colors welcome-button"
                  >
                    <Download size={16} className="mr-3" />
                    <span>Download Resume</span>
                    <ExternalLink size={12} className="ml-2 text-white/40" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Simplified */}
        <div className="mt-8 text-[#6c6c6c] text-xs">
          <p>© {new Date().getFullYear()} Anuj Dubey. Built with React, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
