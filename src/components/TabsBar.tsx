import React from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { FileItem } from '../types'

interface Tab {
  name: string
  path: string
}

interface TabsBarProps {
  openFiles: FileItem[]
  activeFile: FileItem | null
  onTabClick: (file: FileItem) => void
  onTabClose: (file: FileItem) => void
  className?: string
}

const TabsBar: React.FC<TabsBarProps> = ({
  openFiles,
  activeFile,
  onTabClick,
  onTabClose,
  className = ''
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [showScrollButtons, setShowScrollButtons] = React.useState(false)
  const [showLeftScroll, setShowLeftScroll] = React.useState(false)
  const [showRightScroll, setShowRightScroll] = React.useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowScrollButtons(scrollWidth > clientWidth)
      setShowLeftScroll(scrollLeft > 0)
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth)
    }
  }

  React.useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [openFiles])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className={`relative flex items-center bg-vscode-editor border-b border-[#2d2d2d] ${className}`}>
      {showScrollButtons && showLeftScroll && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 h-full px-1 bg-vscode-editor text-white/60 hover:text-white
            hover:bg-white/5 transition-colors duration-200"
        >
          <ChevronLeft size={16} />
        </motion.button>
      )}

      <div 
        ref={scrollRef}
        className="flex-1 flex overflow-x-auto scrollbar-hide"
        onScroll={checkScroll}
      >
        {openFiles.map((file) => (
          <motion.div
            key={file.path}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`group flex items-center min-w-[150px] max-w-[200px] h-9 px-3
              border-r border-[#2d2d2d] ${
                activeFile?.path === file.path
                  ? 'bg-vscode-editor text-white'
                  : 'bg-vscode-tabInactive text-white/60 hover:text-white'
              }`}
          >
            <button
              className="flex-1 flex items-center gap-2 text-sm truncate"
              onClick={() => onTabClick(file)}
            >
              <span className="truncate">{file.name}</span>
            </button>
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ 
                opacity: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-sm"
              onClick={(e) => {
                e.stopPropagation()
                onTabClose(file)
              }}
            >
              <X size={14} />
            </motion.button>
          </motion.div>
        ))}
      </div>

      {showScrollButtons && showRightScroll && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 h-full px-1 bg-vscode-editor text-white/60 hover:text-white
            hover:bg-white/5 transition-colors duration-200"
        >
          <ChevronRight size={16} />
        </motion.button>
      )}
    </div>
  )
}

export default TabsBar 