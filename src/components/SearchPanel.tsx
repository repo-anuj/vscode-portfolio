import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowDown, ArrowUp, FileText, ChevronRight } from 'lucide-react';
import { FileItem } from '../types';

/**
 * Props for the SearchPanel component
 */


interface SearchPanelProps {
  /** Whether the search panel is open */
  isOpen: boolean;
  /** Handler for close button click */
  onClose: () => void;
  /** Handler for file click */
  onFileClick: (file: FileItem) => void;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Search result item structure
 */
interface SearchResult {
  file: FileItem;
  matches: {
    text: string;
    lineNumber: number;
  }[];
}

/**
 * SearchPanel component that provides global search functionality
 *
 * @param {SearchPanelProps} props - Component props
 * @returns {JSX.Element | null} Rendered SearchPanel component or null if not open
 */
const SearchPanel: React.FC<SearchPanelProps> = ({
  isOpen,
  onClose,
  onFileClick,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock content for search
  const mockContent = {
    '/pages/Home': {
      content: `
        # Welcome to my portfolio
        I'm a full-stack developer specializing in React, TypeScript, and modern web technologies.
        This portfolio is designed to showcase my projects and skills in a VS Code-inspired interface.
        Feel free to explore the different sections using the sidebar navigation.
      `
    },
    '/pages/About': {
      content: `
        # About Me
        I'm a passionate developer with experience in building web applications using modern technologies.
        My journey in programming started with HTML, CSS, and JavaScript, and has evolved to include
        frameworks like React, Next.js, and tools like TypeScript and Tailwind CSS.
        I enjoy solving complex problems and creating intuitive user experiences.
      `
    },
    '/pages/Projects': {
      content: `
        # Projects
        - ERP-AI System: A scalable ERP system with role-based access
        - LOSSER Portfolio: A modern portfolio website showcasing projects
        - RentRideRepeat: A responsive vehicle rental platform
        - Portfolio Generator: Dynamic tool for real-time portfolio generation
        - Pac-Man Game: A modernized Pac-Man game
        - Codeplayers Website: An engaging website optimized for SEO
        - Festiva Website: A responsive event management platform
        - Linkedin Post Generator: A tool for generating professional-looking LinkedIn posts
      `
    },
    '/pages/Work': {
      content: `
        # Work Experience
        - Frontend Web Developer at Codeplayer (2024-2025)
        - Web Developer for Festiva Portfolio Website (2025)
        - Catalog Management Intern at Mentorsity (April 2023-June 2023)
        - Web Developer Intern at Bharat Intern (June 2022-October 2022)
      `
    },
    '/pages/Skills': {
      content: `
        # Skills
        - Frontend: React, TypeScript, Next.js, Tailwind CSS, Framer Motion
        - Backend: Node.js, Express, RESTful APIs
        - Tools: Git, VS Code, Figma, Webpack
        - Other: Responsive Design, Performance Optimization, SEO
      `
    }
  };

  // Mock file structure for search results
  const mockFiles: Record<string, FileItem> = {
    '/pages/Home': {
      name: 'Home.tsx',
      path: '/pages/Home',
      type: 'file'
    },
    '/pages/About': {
      name: 'About.tsx',
      path: '/pages/About',
      type: 'file'
    },
    '/pages/Projects': {
      name: 'Projects.tsx',
      path: '/pages/Projects',
      type: 'file'
    },
    '/pages/Work': {
      name: 'Work.tsx',
      path: '/pages/Work',
      type: 'file'
    },
    '/pages/Skills': {
      name: 'Skills.tsx',
      path: '/pages/Skills',
      type: 'file'
    }
  };

  // Focus search input when panel opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Perform search when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate search delay
    const timer = setTimeout(() => {
      const searchResults: SearchResult[] = [];

      Object.entries(mockContent).forEach(([path, { content }]) => {
        const matches: {text: string;lineNumber: number;}[] = [];
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
            matches.push({
              text: line.trim(),
              lineNumber: index + 1
            });
          }
        });

        if (matches.length > 0) {
          searchResults.push({
            file: mockFiles[path],
            matches
          });
        }
      });

      setResults(searchResults);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Toggle expanded state for a file
  const toggleFileExpanded = (path: string) => {
    setExpandedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  // Handle result click
  const handleResultClick = (file: FileItem) => {
    onFileClick(file);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`w-[300px] h-full bg-vscode-sidebar border-l border-[#1e1e1e] flex flex-col z-50 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-[#3c3c3c]">
        <h2 className="text-sm font-medium text-white/90">Search</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-sm transition-colors">

          <X size={16} className="text-white/60" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-[#3c3c3c]">
        <div className="flex items-center bg-[#3c3c3c] rounded-sm px-2">
          <Search size={14} className="text-white/60 mr-1" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent border-none outline-none py-1 text-sm text-white/90 placeholder-white/40" />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-white/40 hover:text-white/60">

              <X size={14} />
            </button>
            )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
            <div className="flex items-center justify-center h-16 text-white/40">
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white/10 border-t-white/40 rounded-full"></div>
            <span className="text-sm">Searching...</span>
          </div>
          ) : searchTerm && results.length === 0 ? (
            <div className="p-4 text-white/40 text-center text-sm">
            No results found for "{searchTerm}"
          </div>
          ) : (
          <div className="divide-y divide-[#3c3c3c]/30">
            {results.map((result) => (
              <div key={result.file.path} className="py-2">
                <div
                  className="flex items-center px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer"
                  onClick={() => toggleFileExpanded(result.file.path)}>

                  {expandedFiles.has(result.file.path) ? (
                    <ArrowDown size={14} className="text-white/60 mr-1" />
                    ) : (
                    <ChevronRight size={14} className="text-white/60 mr-1" />
                    )}
                  <FileText size={14} className="text-[#519aba] mr-2" />
                  <span className="text-sm text-white/80">{result.file.name}</span>
                  <span className="ml-auto text-xs text-white/40">{result.matches.length} matches</span>
                </div>

                {expandedFiles.has(result.file.path) && (
                  <div className="ml-6 mt-1">
                    {result.matches.map((match, idx) => (
                    <div
                      key={idx}
                      className="px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer text-xs text-white/70 flex"
                      onClick={() => handleResultClick(result.file)}>

                        <span className="text-white/40 mr-2 w-6 text-right">{match.lineNumber}</span>
                        <span className="truncate">{match.text}</span>
                      </div>
                    ))}
                  </div>
                  )}
              </div>
            ))}
          </div>
          )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-[#3c3c3c] flex justify-between text-xs text-white/60">
        <div className="flex items-center">
          <span className="mr-4">{results.length} results</span>
          <button className="flex items-center mr-2 hover:text-white/80">
            <ArrowUp size={12} className="mr-1" />
            Previous
          </button>
          <button className="flex items-center hover:text-white/80">
            <ArrowDown size={12} className="mr-1" />
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;