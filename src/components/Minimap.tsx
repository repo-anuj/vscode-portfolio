import React, { useEffect, useRef } from 'react'

interface MinimapProps {
  content: string
  scrollPosition: number
  totalHeight: number
  visibleHeight: number
  onScroll: (position: number) => void
}

const Minimap: React.FC<MinimapProps> = ({
  content,
  scrollPosition,
  totalHeight,
  visibleHeight,
  onScroll
}) => {
  const minimapRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const startYRef = useRef(0)
  const startScrollRef = useRef(0)

  // Calculate the visible ratio and slider height
  const visibleRatio = Math.min(1, visibleHeight / totalHeight)
  const sliderHeight = Math.max(30, visibleRatio * 100) + '%'
  
  // Calculate the slider position
  const sliderPosition = (scrollPosition / totalHeight) * 100 + '%'

  // Handle mouse down on the slider
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRef.current = true
    startYRef.current = e.clientY
    startScrollRef.current = scrollPosition
    
    // Add event listeners for dragging
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Handle mouse move while dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !minimapRef.current) return
    
    const deltaY = e.clientY - startYRef.current
    const minimapHeight = minimapRef.current.clientHeight
    const scrollRatio = deltaY / minimapHeight
    const newScrollPosition = startScrollRef.current + (scrollRatio * totalHeight)
    
    // Clamp the scroll position
    const clampedPosition = Math.max(0, Math.min(totalHeight - visibleHeight, newScrollPosition))
    onScroll(clampedPosition)
  }

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    isDraggingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  // Handle click on the minimap (not on the slider)
  const handleMinimapClick = (e: React.MouseEvent) => {
    if (e.target !== minimapRef.current || !minimapRef.current) return
    
    const rect = minimapRef.current.getBoundingClientRect()
    const clickRatio = (e.clientY - rect.top) / rect.height
    const newScrollPosition = clickRatio * totalHeight
    
    // Clamp the scroll position
    const clampedPosition = Math.max(0, Math.min(totalHeight - visibleHeight, newScrollPosition))
    onScroll(clampedPosition)
  }

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Generate minimap content
  const generateMinimapContent = () => {
    // Simple representation of the content
    return content.split('\n').map((line, index) => (
      <div 
        key={index} 
        className="h-[2px] my-[1px] bg-white/10"
        style={{ 
          width: Math.min(100, line.length / 2) + '%',
          opacity: line.trim().length ? 0.3 : 0.1
        }}
      />
    ))
  }

  return (
    <div 
      ref={minimapRef}
      className="w-[60px] h-full bg-[#1e1e1e] border-l border-[#303030] overflow-hidden relative cursor-pointer"
      onClick={handleMinimapClick}
    >
      <div className="p-1 text-[4px] opacity-30">
        {generateMinimapContent()}
      </div>
      
      {/* Visible area slider */}
      <div 
        ref={sliderRef}
        className="absolute right-0 w-[60px] bg-white/10 hover:bg-white/15 cursor-ns-resize"
        style={{ 
          height: sliderHeight,
          top: sliderPosition
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

export default Minimap
