/**
 * Main Application Component
 *
 * This file contains the main App component which serves as the root component for the
 * VS Code-inspired portfolio website. It manages the overall layout, navigation, and state
 * of the application, including:
 *
 * - File navigation and tab management
 * - Component lazy loading with preloading strategy
 * - Terminal and contact form integration
 * - Keyboard shortcuts for various actions
 * - VS Code-like UI components (sidebar, explorer, tabs, etc.)
 *
 * The application uses a component-based architecture with React and implements
 * performance optimizations like code splitting and lazy loading.
 *
 * @author Anuj Dubey
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatusBar from './components/StatusBar';
import FileExplorer from './components/FileExplorer';
import TabsBar from './components/TabsBar';
import Terminal from './components/Terminal';
import CommandPalette from './components/CommandPalette';
import Breadcrumbs from './components/Breadcrumbs';
import Extensions from './components/Extensions';
import SearchPanel from './components/SearchPanel';
import WelcomeScreen from './components/WelcomeScreen';
import CodePlayground from './components/CodePlayground';
import ChatBot from './components/ChatBot';
import { FileItem } from './types';
import { useTheme } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import { BUG_GAME_TAB, MEMORY_GAME_TAB } from './data/fileStructure';
import './App.css';

// Import lazy loading utility
import { lazyImport } from './utils/lazyImport';

/**
 * Lazy-loaded components with preloading capability
 *
 * Using the custom lazyImport utility to enable both lazy loading and
 * preloading of components. This improves initial load time while allowing
 * for preloading components when they're likely to be needed.
 */
import { useGT } from "gt-react";

const { Component: Settings } = lazyImport(() => import('./components/Settings'));
const { Component: BugGame, preload: preloadBugGame } = lazyImport(() => import('./components/BugGame'));
const { Component: MemoryGame, preload: preloadMemoryGame } = lazyImport(() => import('./components/MemoryGame'));
const { Component: Home, preload: preloadHome } = lazyImport(() => import('./pages/Home'));
const { Component: About, preload: preloadAbout } = lazyImport(() => import('./pages/About'));
const { Component: Work, preload: preloadWork } = lazyImport(() => import('./pages/Work'));
const { Component: Skills, preload: preloadSkills } = lazyImport(() => import('./pages/Skills'));
const { Component: Projects, preload: preloadProjects } = lazyImport(() => import('./pages/Projects'));
const { Component: Profile, preload: preloadProfile } = lazyImport(() => import('./pages/Profile'));

/**
 * Main App component that manages the VS Code-like portfolio interface
 *
 * @returns {JSX.Element} The rendered App component
 */
const App: React.FC = () => {
  // Theme context for applying the current theme
  const { currentTheme } = useTheme();
  // Get the GT translation function
  const t = useGT();

  // State for managing files, tabs, and UI components
  const [openFiles, setOpenFiles] = useState<FileItem[]>([]); // Currently open files/tabs
  const [activeFile, setActiveFile] = useState<FileItem | null>(null); // Currently active file/tab
  const [showTerminal, setShowTerminal] = useState(false); // Terminal visibility
  const [isContactMode, setIsContactMode] = useState(false); // Contact form mode in terminal
  const [showSettings, setShowSettings] = useState(false); // Settings panel visibility
  const [isExplorerOpen, setIsExplorerOpen] = useState(window.innerWidth >= 768); // File explorer visibility - closed by default on mobile
  const [showCommandPalette, setShowCommandPalette] = useState(false); // Command palette visibility
  const [showExtensions, setShowExtensions] = useState(false); // Extensions panel visibility
  const [showSearchPanel, setShowSearchPanel] = useState(false); // Search panel visibility
  const [showCodePlayground, setShowCodePlayground] = useState(false); // Code playground visibility
  const [showChatBot, setShowChatBot] = useState(false); // ChatBot visibility
  const [isChatBotFullscreen, setIsChatBotFullscreen] = useState(false); // ChatBot fullscreen mode

  // Reference to the main content container for scrolling
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle screen resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Close explorer on small screens
      if (window.innerWidth < 768) {
        setIsExplorerOpen(false);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette (Ctrl+Shift+P)
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(true);
      }

      // Quick Open (Ctrl+P)
      if (e.ctrlKey && !e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setShowCommandPalette(true);
      }

      // Search (Ctrl+F)
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setShowSearchPanel(true);
      }

      // Toggle Terminal (Ctrl+`)
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setShowTerminal((prev) => !prev);
        setIsContactMode(false);
      }

      // Toggle Settings (Ctrl+,)
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setShowSettings(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Preloads a component based on its file path
   *
   * This function triggers the preloading of a component when a user is likely
   * to navigate to it, improving perceived performance by starting the load
   * before the component is actually needed.
   *
   * @param {string} path - The path of the file/component to preload
   */
  const preloadComponent = (path: string) => {
    switch (path) {
      case '/pages/Home':
        preloadHome();
        break;
      case '/pages/About':
        preloadAbout();
        break;
      case '/pages/Work':
        preloadWork();
        break;
      case '/pages/Skills':
        preloadSkills();
        break;
      case '/pages/Projects':
        preloadProjects();
        break;
      case '/pages/Profile':
        preloadProfile();
        break;
      case '/game/BugSquasher':
        preloadBugGame();
        break;
      case '/game/MemoryMatch':
        preloadMemoryGame();
        break;
    }
  };

  /**
   * Handles clicking on a file in the explorer
   *
   * Opens the file in a new tab if it's not already open,
   * and sets it as the active file.
   *
   * @param {FileItem} file - The file item that was clicked
   */
  const handleFileClick = (file: FileItem) => {
    // Preload the component
    preloadComponent(file.path);

    if (!openFiles.find((f) => f.path === file.path)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFile(file);
  };

  const handleBugClick = () => {
    // Preload the bug game
    preloadBugGame();

    if (!openFiles.find((f) => f.path === BUG_GAME_TAB.path)) {
      setOpenFiles([...openFiles, BUG_GAME_TAB]);
    }
    setActiveFile(BUG_GAME_TAB);
  };

  const handleMemoryGameClick = () => {
    // Preload the memory game
    preloadMemoryGame();

    if (!openFiles.find((f) => f.path === MEMORY_GAME_TAB.path)) {
      setOpenFiles([...openFiles, MEMORY_GAME_TAB]);
    }
    setActiveFile(MEMORY_GAME_TAB);
  };

  const handleTerminalClick = () => {
    setShowTerminal((prev) => !prev);
    setIsContactMode(false);
  };

  const handleContactClick = () => {
    setShowTerminal(true);
    setIsContactMode(true);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleCommandPaletteClick = () => {
    setShowCommandPalette(true);
  };

  const handleExtensionsClick = () => {
    setShowExtensions(!showExtensions);
  };

  const handleSearchClick = () => {
    setShowSearchPanel(true);
  };

  const handleChatBotClick = () => {
    setShowChatBot(true);
    setIsChatBotFullscreen(false);
  };

  const handleToggleChatBotFullscreen = () => {
    setIsChatBotFullscreen(!isChatBotFullscreen);
  };

  const handleTabClick = (file: FileItem) => {
    setActiveFile(file);
  };

  const handleTabClose = (file: FileItem) => {
    const newOpenFiles = openFiles.filter((f) => f.path !== file.path);
    setOpenFiles(newOpenFiles);
    if (activeFile?.path === file.path) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1] || null);
    }
  };

  const renderContent = () => {
    // Create a loading component for Suspense fallback
    const LoadingFallback = () => (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-vscode-accent/30 border-t-vscode-accent rounded-full animate-spin"></div>
          <p className="mt-4 text-white/60">{t('Loading...', { id: 'app.0' })}</p>
        </div>
      </div>
    );

    // Wrap content in ErrorBoundary and Suspense
    const renderWithSuspense = (component: React.ReactNode) => (
    <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {component}
        </Suspense>
      </ErrorBoundary>
    );

    if (showSettings) {
      return renderWithSuspense(
        <Settings
          onClose={() => setShowSettings(false)} />

      );
    }

    if (!activeFile) {
      return (
      <WelcomeScreen
        onFileClick={handleFileClick}
        onContactClick={handleContactClick} />

      );
    }

    switch (activeFile.path) {
      case '/pages/Home':
        return renderWithSuspense(<Home onContactClick={handleContactClick} />);
      case '/pages/About':
        return renderWithSuspense(<About />);
      case '/pages/Work':
        return renderWithSuspense(<Work />);
      case '/pages/Skills':
        return renderWithSuspense(<Skills />);
      case '/pages/Projects':
        return renderWithSuspense(<Projects />);
      case '/pages/Profile':
        return renderWithSuspense(<Profile />);
      case '/game/BugSquasher':
        return renderWithSuspense(<BugGame />);
      case '/game/MemoryMatch':
        return renderWithSuspense(<MemoryGame />);
      default:
        return (
          <div className="p-4">
            <p>{t('Content for ' + activeFile.path + ' is not yet implemented.', { id: 'app.1' })}</p>
          </div>
        );
    }
  };

  return (
  <div
    className="h-screen flex flex-col main-layout"
    style={{
      backgroundColor: currentTheme.background,
      color: currentTheme.foreground
    }}>

      <Header
      onMenuClick={() => setIsExplorerOpen(!isExplorerOpen)}
      onContactClick={handleContactClick}
      onSearchClick={handleSearchClick}
      className="header" />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile overlay */}
        {isExplorerOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-30 md:hidden"
        onClick={() => setIsExplorerOpen(false)}>
      </div>
      )}
        <div className="flex">
          <Sidebar
          onBugClick={handleBugClick}
          onMemoryGameClick={handleMemoryGameClick}
          onTerminalClick={handleTerminalClick}
          onContactClick={handleContactClick}
          onSettingsClick={handleSettingsClick}
          onExtensionsClick={handleExtensionsClick}
          onCommandPaletteClick={handleCommandPaletteClick}
          onChatBotClick={handleChatBotClick} />

          <FileExplorer
          onFileClick={handleFileClick}
          isOpen={isExplorerOpen}
          onClose={() => setIsExplorerOpen(false)} />

        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <TabsBar
          openFiles={openFiles}
          activeFile={activeFile}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          className="tabs-bar tabs-container" />

          {activeFile && <Breadcrumbs activeFile={activeFile} />}
          <div className="flex-1 relative overflow-hidden">
            <div
            ref={contentRef}
            className="h-full overflow-y-auto main-content content-padding">

              {renderContent()}
            </div>
            {showTerminal && (
          <Terminal
            onClose={() => {
              setShowTerminal(false);
              setIsContactMode(false);
            }}
            startContactForm={isContactMode}
            className="terminal-container h-[280px]"
            onLaunchCodePlayground={() => setShowCodePlayground(true)}
            onLaunchChatBot={() => {
              setShowChatBot(true);
              setIsChatBotFullscreen(false);
            }} />

          )}
            {showCodePlayground && (
            <div className="fixed inset-0 z-50 bg-[#1e1e1e] overflow-auto">
                <div className="absolute top-4 right-4 z-10">
                  <button
                  onClick={() => setShowCodePlayground(false)}
                  className="p-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white/80 rounded-md">

                    Close
                  </button>
                </div>
                <CodePlayground onClose={() => setShowCodePlayground(false)} />
              </div>
          )}
            {showChatBot && !isChatBotFullscreen && (
          <div className="fixed bottom-0 right-0 w-[350px] h-[450px] z-50 shadow-lg">
                <ChatBot
              onClose={() => setShowChatBot(false)}
              onToggleFullscreen={handleToggleChatBotFullscreen} />

              </div>
          )}
            {showChatBot && isChatBotFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#1e1e1e] overflow-auto">
                <ChatBot
              onClose={() => setShowChatBot(false)}
              isFullscreen={true}
              onToggleFullscreen={handleToggleChatBotFullscreen} />

              </div>
          )}
          </div>
        </div>
        {showExtensions && (
      <Extensions
        isOpen={showExtensions}
        onClose={() => setShowExtensions(false)}
        className="extensions-panel" />

      )}
        {showSearchPanel && (
      <SearchPanel
        isOpen={showSearchPanel}
        onClose={() => setShowSearchPanel(false)}
        onFileClick={handleFileClick}
        className="search-panel" />

      )}
      </div>
      <StatusBar className="status-bar" />

      {/* Command Palette */}
      <CommandPalette
      isOpen={showCommandPalette}
      onClose={() => setShowCommandPalette(false)}
      onFileClick={handleFileClick}
      onBugClick={handleBugClick}
      onMemoryGameClick={handleMemoryGameClick}
      onTerminalClick={handleTerminalClick}
      onContactClick={handleContactClick}
      onSettingsClick={handleSettingsClick}
      onCodePlaygroundClick={() => setShowCodePlayground(true)}
      onChatBotClick={() => {
        setShowChatBot(true);
        setIsChatBotFullscreen(true);
      }} />

    </div>
  );
};

export default App;