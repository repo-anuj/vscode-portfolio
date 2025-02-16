import { Github, FileText, Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
  onContactClick: () => void
}

const Header = ({ onMenuClick, onContactClick }: HeaderProps) => {
  return (
    <header className="h-12 bg-vscode-titlebar flex items-center justify-between px-4 select-none">
      {/* Left side - VS Code Logo */}
      <div className="flex items-center">
        <img 
          src="/vscode-icon.svg" 
          alt="VS Code Logo" 
          className="h-5 w-5"
        />
      </div>

      {/* Middle - Title */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-white text-sm font-medium">
          Anuj Dubey - Portfolio
        </h1>
      </div>

      {/* Right side - Buttons */}
      <div className="flex items-center gap-2">
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/10"
        >
          <Github size={20} />
        </a>
        {/* <a
          href="mailto:your.email@example.com"
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/10"
        >
          <Mail size={20} />
        </a> */}
        <button
          onClick={() => window.open('/Anuj_Dubey_Resume.pdf', '_blank')}
          className="sm:flex items-center gap-1 text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/10"
        >
          <FileText size={20} />
          <span className="text-sm hidden sm:flex">Resume</span>
        </button>
        <button
        onClick={onContactClick}
          className="hidden sm:block text-sm text-white bg-vscode-accent hover:bg-vscode-accent/80 px-3 py-1 rounded"
        >
          Contact
        </button>
      </div>

      <button 
        onClick={onMenuClick}
        className="md:hidden text-white/60 hover:text-white transition-colors"
      >
        <Menu size={18} />
      </button>
    </header>
  )
}

export default Header 