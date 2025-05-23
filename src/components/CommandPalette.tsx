import React, { useState, useEffect, useRef } from 'react';
import { FileText, Bug, Terminal, Mail, Settings, X, Command, Package, Zap, Grid, Code, Bot } from 'lucide-react';
import { FileItem } from '../types';



interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onFileClick: (file: FileItem) => void;
  onBugClick: () => void;
  onMemoryGameClick: () => void;
  onTerminalClick: () => void;
  onContactClick: () => void;
  onSettingsClick: () => void;
  onCodePlaygroundClick?: () => void;
  onChatBotClick?: () => void;
}

interface CommandItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: string;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onFileClick,
  onBugClick,
  onMemoryGameClick,
  onTerminalClick,
  onContactClick,
  onSettingsClick,
  onCodePlaygroundClick,
  onChatBotClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandListRef = useRef<HTMLDivElement>(null);

  // Define all available commands
  const commands: CommandItem[] = [
  // File navigation commands
  {
    id: 'home',
    name: 'Go to Home',
    icon: <FileText size={16} />,
    action: () => {
      onFileClick({ name: 'Home.tsx', type: 'file', path: '/pages/Home' });
      onClose();
    },
    category: 'Navigation'
  },
  {
    id: 'about',
    name: 'Go to About',
    icon: <FileText size={16} />,
    action: () => {
      onFileClick({ name: 'About.tsx', type: 'file', path: '/pages/About' });
      onClose();
    },
    category: 'Navigation'
  },
  {
    id: 'projects',
    name: 'Go to Projects',
    icon: <FileText size={16} />,
    action: () => {
      onFileClick({ name: 'Projects.tsx', type: 'file', path: '/pages/Projects' });
      onClose();
    },
    category: 'Navigation'
  },
  {
    id: 'skills',
    name: 'Go to Skills',
    icon: <FileText size={16} />,
    action: () => {
      onFileClick({ name: 'Skills.tsx', type: 'file', path: '/pages/Skills' });
      onClose();
    },
    category: 'Navigation'
  },
  {
    id: 'work',
    name: 'Go to Work Experience',
    icon: <FileText size={16} />,
    action: () => {
      onFileClick({ name: 'Work.tsx', type: 'file', path: '/pages/Work' });
      onClose();
    },
    category: 'Navigation'
  },

  // Feature commands
  {
    id: 'bug-game',
    name: 'Play Bug Squasher Game',
    icon: <Bug size={16} />,
    action: () => {
      onBugClick();
      onClose();
    },
    category: 'Features'
  },
  {
    id: 'memory-game',
    name: 'Play Memory Match Game',
    icon: <Grid size={16} />,
    action: () => {
      onMemoryGameClick();
      onClose();
    },
    category: 'Features'
  },
  {
    id: 'code-playground',
    name: 'Open Code Playground',
    icon: <Code size={16} />,
    action: () => {
      if (onCodePlaygroundClick) {
        onCodePlaygroundClick();
        onClose();
      }
    },
    category: 'Features'
  },
  {
    id: 'chatbot',
    name: 'Open AI Assistant',
    icon: <Bot size={16} />,
    action: () => {
      if (onChatBotClick) {
        onChatBotClick();
        onClose();
      }
    },
    category: 'Features'
  },
  {
    id: 'terminal',
    name: 'Toggle Terminal',
    icon: <Terminal size={16} />,
    shortcut: 'Ctrl+`',
    action: () => {
      onTerminalClick();
      onClose();
    },
    category: 'View'
  },
  {
    id: 'contact',
    name: 'Contact Me',
    icon: <Mail size={16} />,
    action: () => {
      onContactClick();
      onClose();
    },
    category: 'Features'
  },
  {
    id: 'settings',
    name: 'Open Settings',
    icon: <Settings size={16} />,
    shortcut: 'Ctrl+,',
    action: () => {
      onSettingsClick();
      onClose();
    },
    category: 'View'
  },
  {
    id: 'extensions',
    name: 'View Extensions',
    icon: <Package size={16} />,
    action: () => {
      // This would be handled by the parent component
      onClose();
    },
    category: 'View'
  },
  {
    id: 'theme',
    name: 'Change Color Theme',
    icon: <Zap size={16} />,
    action: () => {
      onSettingsClick();
      onClose();
    },
    category: 'Preferences'
  }];


  // Improved filtering with fuzzy search and scoring
  const filteredCommands = searchTerm.trim() === '' ?
  commands :
  commands.
  map((command) => {
    // Calculate match score (higher is better)
    const nameLower = command.name.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const categoryLower = command.category.toLowerCase();

    // Exact match gets highest score
    if (nameLower === searchLower) return { command, score: 100 };

    // Starts with search term gets high score
    if (nameLower.startsWith(searchLower)) return { command, score: 80 };

    // Contains search term as a word gets medium-high score
    if (nameLower.includes(` ${searchLower}`)) return { command, score: 70 };

    // Contains search term gets medium score
    if (nameLower.includes(searchLower)) return { command, score: 60 };

    // Category matches get lower score
    if (categoryLower.includes(searchLower)) return { command, score: 40 };

    // Check for acronym match (e.g. "gth" matches "Go to Home")
    const words = nameLower.split(' ');
    const acronym = words.map((word) => word[0]).join('');
    if (acronym.includes(searchLower)) return { command, score: 50 };

    // Check for partial word matches
    const partialMatches = words.filter((word) => word.includes(searchLower)).length;
    if (partialMatches > 0) return { command, score: 30 + partialMatches * 5 };

    // No match
    return { command, score: 0 };
  }).
  filter((item) => item.score > 0).
  sort((a, b) => b.score - a.score).
  map((item) => item.command);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => prev > 0 ? prev - 1 : 0);
          break;
        case 'Enter':
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (commandListRef.current) {
      const selectedElement = commandListRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[10vh] animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#252526] rounded-md shadow-xl overflow-hidden">
        {/* Header with search input */}
        <div className="flex items-center p-2 border-b border-[#3c3c3c]">
          <Command size={16} className="text-white/60 mr-2" />
          <div className="relative flex-1">
            <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 pr-8"
            autoFocus
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="command-list"
            aria-activedescendant={filteredCommands[selectedIndex]?.id || ''} />

            {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedIndex(0);
              inputRef.current?.focus();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-sm transition-colors"
            aria-label="Clear search">

                <X size={14} className="text-white/60" />
              </button>
          )}
          </div>
          <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-sm transition-colors ml-2"
          aria-label="Close command palette">

            <X size={16} className="text-white/60" />
          </button>
        </div>

        {/* Command list */}
        <div
        ref={commandListRef}
        className="max-h-[60vh] overflow-y-auto"
        id="command-list"
        role="listbox"
        aria-label="Available commands">

          {filteredCommands.length === 0 ? (
          <div className="p-4 text-white/40 text-center">
              No commands found
            </div>
        ) : (
        <>
              {/* Group commands by category */}
              {Array.from(new Set(filteredCommands.map((cmd) => cmd.category))).map((category) => (
          <div key={category}>
                  <div className="px-3 py-1 text-xs text-white/40 bg-[#2d2d2d]">
                    {category}
                  </div>
                  {filteredCommands.
            filter((cmd) => cmd.category === category).
            map((command) => {
              const commandIndex = filteredCommands.findIndex((c) => c.id === command.id);
              const isSelected = commandIndex === selectedIndex;

              return (
              <div
                key={command.id}
                id={command.id}
                className={`px-3 py-2 flex items-center justify-between cursor-pointer ${
                isSelected ? 'bg-[#04395e]' : 'hover:bg-[#2a2d2e]'}`
                }
                onClick={() => command.action()}
                onMouseEnter={() => setSelectedIndex(commandIndex)}
                role="option"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    command.action();
                  }
                }}>

                          <div className="flex items-center">
                            <span className={`mr-3 ${isSelected ? 'text-white' : 'text-white/60'}`}>
                              {command.icon}
                            </span>
                            <span className={isSelected ? 'text-white' : 'text-white/80'}>
                              {command.name}
                            </span>
                          </div>
                          {command.shortcut && (
                <span className="text-xs text-white/40 bg-[#2d2d2d] px-2 py-1 rounded">
                              {command.shortcut}
                            </span>
                )}
                        </div>
              );
            })}
                </div>
          ))}
            </>
        )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;