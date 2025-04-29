import React from 'react'
import { ChevronRight, FileText, FolderOpen } from 'lucide-react'
import { FileItem } from '../types'

interface BreadcrumbsProps {
  activeFile: FileItem
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activeFile }) => {
  // Parse the path into segments
  const getPathSegments = () => {
    if (!activeFile || !activeFile.path) return []
    
    // Remove leading slash if present
    const cleanPath = activeFile.path.startsWith('/') 
      ? activeFile.path.substring(1) 
      : activeFile.path
    
    // Split by slashes
    return cleanPath.split('/')
  }
  
  const segments = getPathSegments()
  
  // Get a display name for the file/folder
  const getDisplayName = (segment: string, isLast: boolean) => {
    // For the last segment (the file itself), use the file name from activeFile if available
    if (isLast && activeFile.name) {
      return activeFile.name
    }
    
    // Otherwise format the segment name
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }
  
  if (!activeFile) return null
  
  return (
    <div className="h-[22px] bg-vscode-editor-background border-b border-[#1e1e1e] flex items-center px-3 text-xs text-white/60 overflow-x-auto whitespace-nowrap">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        const displayName = getDisplayName(segment, isLast)
        
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight size={14} className="mx-1 text-white/40" />
            )}
            <div className="flex items-center">
              {isLast ? (
                <FileText size={14} className="mr-1 text-blue-400" />
              ) : (
                <FolderOpen size={14} className="mr-1 text-yellow-400" />
              )}
              <span className={`${isLast ? 'text-white/80' : 'hover:text-white/80 cursor-pointer'}`}>
                {displayName}
              </span>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Breadcrumbs
