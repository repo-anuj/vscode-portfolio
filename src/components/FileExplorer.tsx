import { ChevronDown, ChevronRight, Folder, FileText, Home, User, Briefcase, Code, FolderGit } from 'lucide-react';
import { useState } from 'react';
import { FileItem, FolderItem } from '../types';
import { Var, T } from "gt-react";


const portfolioStructure: FolderItem = {
  name: 'Portfolio',
  type: 'folder',
  isOpen: true,
  children: [
  { name: 'Home.tsx', type: 'file', path: '/pages/Home', icon: Home },
  { name: 'About.tsx', type: 'file', path: '/pages/About', icon: User },
  { name: 'Work.tsx', type: 'file', path: '/pages/Work', icon: Briefcase },
  { name: 'Skills.tsx', type: 'file', path: '/pages/Skills', icon: Code },
  { name: 'Projects.tsx', type: 'file', path: '/pages/Projects', icon: FolderGit }
  // { name: 'Profile.tsx', type: 'file', path: './components/Profile', icon: User },
  ]
};

interface FileExplorerProps {
  onFileClick: (file: FileItem) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const FileExplorer = ({ onFileClick, isOpen = true, onClose }: FileExplorerProps) => {
  const [structure, setStructure] = useState<FolderItem>(portfolioStructure);

  const handleFileClick = (file: FileItem) => {
    onFileClick(file);
    // Close sidebar on mobile only
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  const toggleFolder = (path: string[], folder: FolderItem) => {
    if (path.length === 0) {
      setStructure({ ...folder, isOpen: !folder.isOpen });
      return;
    }

    const newStructure = { ...folder };
    let current = newStructure;
    for (let i = 0; i < path.length - 1; i++) {
      const child = current.children.find((c) => c.type === 'folder' && c.name === path[i]) as FolderItem;
      if (!child) return;
      current = child;
    }

    const target = current.children.find(
      (c) => c.type === 'folder' && c.name === path[path.length - 1]
    ) as FolderItem;
    if (!target) return;

    target.isOpen = !target.isOpen;
    setStructure(newStructure);
  };

  const renderItem = (item: FileItem | FolderItem, path: string[] = []) => {
    if (item.type === 'file') {
      const Icon = (item as any).icon || FileText;
      return (
      <div
        key={item.path}
        className="flex items-center gap-1 px-2 py-[2px] hover:bg-[#37373d] cursor-pointer text-[13px] text-[#cccccc] group"
        onClick={() => handleFileClick(item)}>

          <Icon size={16} className="text-[#519aba] shrink-0" />
          <span className="group-hover:text-white transition-colors">{item.name}</span>
        </div>
      );
    }

    return (
    <div key={item.name}>
        <div
        className="flex items-center gap-1 px-2 py-[2px] hover:bg-[#37373d] cursor-pointer text-[13px] text-[#cccccc] group"
        onClick={() => toggleFolder([...path], item)}>

          {item.isOpen ? (
        <ChevronDown size={16} className="min-w-4 text-white/60" />
        ) : (
        <ChevronRight size={16} className="min-w-4 text-white/60" />
        )}
          <Folder size={16} className="text-[#e6b62a] shrink-0" />
          <span className="group-hover:text-white transition-colors">{item.name}</span>
        </div>
        {item.isOpen && (
      <div className="ml-4">
            {item.children.map((child) => renderItem(child, [...path, item.name]))}
          </div>
      )}
      </div>
    );
  };

  return (<T id="components.fileexplorer.0">
    <div className={`
      ${isOpen ? 'w-[240px]' : 'w-0 md:w-0'}
      fixed md:relative
      left-[48px] md:left-0
      h-[calc(100vh-48px)]
      bg-vscode-sidebar
      border-r border-[#1e1e1e]
      overflow-y-auto
      transition-all duration-300 ease-in-out
      z-40
    `}>
      <div className={`
        sticky top-0
        p-2
        text-xs
        text-white/60
        font-medium
        bg-vscode-sidebar
        ${!isOpen && 'hidden'}
      `}>
        EXPLORER
      </div>
      <div className={`
        ${!isOpen && 'hidden'}
        min-h-[calc(100vh-80px)]
      `}>
        <Var>{renderItem(structure)}</Var>
      </div>
    </div></T>
  );
};

export default FileExplorer;