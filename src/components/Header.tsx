import { Github as GithubIcon, FileText, Menu, Search } from 'lucide-react';

/**
 * Props for the Header component
 */
import { Var, T } from "gt-react";

interface HeaderProps {
  /** Handler for menu button click */
  onMenuClick: () => void;
  /** Handler for contact button click */
  onContactClick: () => void;
  /** Handler for search button click */
  onSearchClick?: () => void;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Header component that displays the top navigation bar
 *
 * @param {HeaderProps} props - Component props
 * @returns {JSX.Element} Rendered Header component
 */
const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onContactClick,
  onSearchClick,
  className = ''
}) => {
  const handleResumeClick = () => {
    // Create a link element
    const link = document.createElement('a');
    link.href = '/Anuj_Dubey_Resume.pdf';
    link.download = 'Anuj_Dubey_Resume.pdf'; // This will force download instead of opening in new tab
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (<T id="components.header.0">
    <header className={`h-12 bg-vscode-titlebar flex items-center justify-between px-4 select-none ${className}`}>
      {/* Left side - VS Code Logo */}
      <div className="flex items-center">
        <img
          src="/vscode-icon.svg"
          alt="VS Code Logo"
          className="h-5 w-5" />
        
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
          href="https://github.com/repo-anuj"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/10">
          
          <GithubIcon size={20} />
        </a>
        <Var>{onSearchClick && (
          <button
            onClick={onSearchClick}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/10"
            title="Search (Ctrl+F)">
            
            <Search size={20} />
          </button>
          )}</Var>
        <button
          onClick={handleResumeClick}
          className="sm:flex items-center gap-1 text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/10 group"
          title="Download Resume">
          
          <FileText size={20} className="group-hover:scale-105 transition-transform" />
          <span className="text-sm hidden sm:flex">Resume</span>
        </button>
        <button
          onClick={onContactClick}
          className="hidden sm:block text-sm text-white bg-vscode-accent hover:bg-vscode-accent/80 px-3 py-1 rounded">
          
          Hire Me
        </button>
        <button
          onClick={onMenuClick}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/10 md:hidden">
          
          <Menu size={20} />
        </button>
      </div>
    </header></T>
  );
};

export default Header;