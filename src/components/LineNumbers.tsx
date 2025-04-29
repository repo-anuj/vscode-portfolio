import React from 'react'

interface LineNumbersProps {
  content: string
  currentLine?: number
}

const LineNumbers: React.FC<LineNumbersProps> = ({ content, currentLine }) => {
  // Count the number of lines in the content
  const lines = content.split('\n')
  const lineCount = lines.length
  
  return (
    <div className="select-none text-right pr-2 pt-4 bg-[#1e1e1e] border-r border-[#303030] text-white/40 text-xs">
      {Array.from({ length: lineCount }).map((_, index) => (
        <div 
          key={index}
          className={`leading-6 ${currentLine === index + 1 ? 'text-white' : ''}`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  )
}

export default LineNumbers
