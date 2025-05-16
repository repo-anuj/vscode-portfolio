import { Home, User, Briefcase, Code, FolderGit } from 'lucide-react'
import { FileItem, FolderItem } from '../types'

// Define the file structure for the file explorer
export const portfolioStructure: FolderItem = {
  name: 'Portfolio',
  type: 'folder',
  isOpen: true,
  children: [
    { name: 'Home.tsx', type: 'file', path: '/pages/Home', icon: Home },
    { name: 'About.tsx', type: 'file', path: '/pages/About', icon: User },
    { name: 'Work.tsx', type: 'file', path: '/pages/Work', icon: Briefcase },
    { name: 'Skills.tsx', type: 'file', path: '/pages/Skills', icon: Code },
    { name: 'Projects.tsx', type: 'file', path: '/pages/Projects', icon: FolderGit },
    // { name: 'Profile.tsx', type: 'file', path: './components/Profile', icon: User },
  ]
}

// Define the recent files for the welcome screen
export const recentFiles: FileItem[] = [
  { name: 'Home.tsx', type: 'file', path: '/pages/Home' },
  { name: 'About.tsx', type: 'file', path: '/pages/About' },
  { name: 'Projects.tsx', type: 'file', path: '/pages/Projects' },
  { name: 'Skills.tsx', type: 'file', path: '/pages/Skills' }
]

// Define the game tabs
export const BUG_GAME_TAB: FileItem = {
  name: 'Bug Squasher.tsx',
  type: 'file',
  path: '/game/BugSquasher'
}

export const MEMORY_GAME_TAB: FileItem = {
  name: 'Memory Match.tsx',
  type: 'file',
  path: '/game/MemoryMatch'
}
