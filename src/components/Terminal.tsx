import { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalIcon, X, Minus, Square, Maximize2 } from 'lucide-react'
import emailjs from '@emailjs/browser'

interface Command {
  command: string
  description: string
  action: (args: string[]) => string | JSX.Element
}

const WELCOME_MESSAGE = `Welcome to Portfolio Terminal v1.0.0
Type 'help' to see available commands.
Current path: ~/portfolio/src

[Portfolio Terminal] Connected
`

const CONTACT_WELCOME_MESSAGE = `Welcome to Contact Form Terminal
I'm excited to hear from you! Let's get started...

[Contact Form] Ready
Enter you name:-
`

interface ContactFormState {
  step: number;
  name: string;
  email: string;
  message: string;
}

const COMMANDS: Record<string, Command> = {
  help: {
    command: 'help',
    description: 'List all available commands',
    action: () => {
      return (
        <div className="text-white/80">
          <p className="mb-2">Available commands:</p>
          {Object.values(COMMANDS).map(cmd => (
            <div key={cmd.command} className="pl-4 mb-1">
              <span className="text-vscode-accent">{cmd.command}</span> - {cmd.description}
            </div>
          ))}
        </div>
      )
    }
  },
  clear: {
    command: 'clear',
    description: 'Clear the terminal',
    action: () => ''
  },
  echo: {
    command: 'echo',
    description: 'Print text to the terminal',
    action: (args) => args.join(' ')
  },
  date: {
    command: 'date',
    description: 'Display current date and time',
    action: () => new Date().toLocaleString()
  },
  whoami: {
    command: 'whoami',
    description: 'Display current user',
    action: () => 'Anuj Dubey'
  },
  joke: {
    command: 'joke',
    description: 'Tell a programming joke',
    action: () => {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Why did the developer go broke? Because he used up all his cache!",
        "What's a programmer's favorite hangout spot? The Foo Bar!",
        "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25!",
        "Why did the programmer quit his job? Because he didn't get arrays!"
      ]
      return jokes[Math.floor(Math.random() * jokes.length)]
    }
  },
  weather: {
    command: 'weather',
    description: 'Show current weather (simulated)',
    action: () => {
      const conditions = ['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Stormy']
      const temp = Math.floor(Math.random() * 30) + 10
      const condition = conditions[Math.floor(Math.random() * conditions.length)]
      return `Current weather: ${condition}, ${temp}°C`
    }
  },
  github: {
    command: 'github',
    description: 'Open my GitHub profile',
    action: () => {
      window.open('https://github.com/repo-anuj', '_blank')
      return 'Opening GitHub profile...'
    }
  },
  matrix: {
    command: 'matrix',
    description: 'Display Matrix-like animation',
    action: () => {
      return (
        <div className="font-mono text-green-500 animate-matrix">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="opacity-80">
              {Array.from({ length: 40 }, () => 
                String.fromCharCode(Math.floor(Math.random() * 94) + 33)
              ).join('')}
            </div>
          ))}
        </div>
      )
    }
  },
  skills: {
    command: 'skills',
    description: 'List my technical skills',
    action: () => {
      const skills = {
        'Frontend': ['React', 'TypeScript', 'Tailwind CSS'],
        'Backend': ['Node.js', 'Python', 'SQL'],
        'Tools': ['Git', 'VS Code', 'Docker']
      }
      return (
        <div className="text-white/80">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="mb-2">
              <div className="text-vscode-accent">{category}:</div>
              <div className="pl-4">{items.join(', ')}</div>
            </div>
          ))}
        </div>
      )
    }
  },
  pwd: {
    command: 'pwd',
    description: 'Print current working directory',
    action: () => '~/portfolio/src'
  },
  ls: {
    command: 'ls',
    description: 'List directory contents',
    action: () => {
      return (
        <div className="grid grid-cols-4 gap-4">
          <span className="text-blue-400">components/</span>
          <span className="text-blue-400">pages/</span>
          <span className="text-yellow-400">App.tsx</span>
          <span className="text-yellow-400">index.tsx</span>
        </div>
      )
    }
  },
  cd: {
    command: 'cd',
    description: 'Change directory',
    action: (args) => {
      if (args.length === 0) return 'Usage: cd <directory>'
      return `Changed directory to ${args[0]}`
    }
  },
  contact: {
    command: 'contact',
    description: 'Start the interactive contact form',
    action: () => CONTACT_WELCOME_MESSAGE
  }
}

interface TerminalProps {
  onClose: () => void
  startContactForm: boolean
  className?: string
}

interface TerminalLine {
  input?: string
  output?: string | JSX.Element
}

const Terminal = ({ onClose, startContactForm, className = '' }: TerminalProps) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { output: startContactForm ? CONTACT_WELCOME_MESSAGE : WELCOME_MESSAGE }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isMaximized, setIsMaximized] = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(300)
  const [startDragY, setStartDragY] = useState(0)
  const [startHeight, setStartHeight] = useState(0)
  const [contactForm, setContactForm] = useState<ContactFormState>({
    step: startContactForm ? 1 : 0,
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("kC1Y4Wukw4BWOvG1K")
  }, [])

  // Use resize variables
  useEffect(() => {
    if (isDraggingRef.current) {
      setStartDragY(0)
      setStartHeight(0)
    }
  }, [])

  // Handle terminal resize
  useEffect(() => {
    const handleResize = () => {
      if (resizeRef.current && isDraggingRef.current) {
        const currentHeight = startHeight + startDragY
        setTerminalHeight(Math.min(currentHeight, window.innerHeight))
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [startHeight, startDragY])

  // Use addLine in a cleanup effect
  useEffect(() => {
    return () => {
      if (lines.length > 1000) {
        addLine('', 'Clearing terminal history...')
      }
    }
  }, [lines.length])

  const handleContactForm = (input: string) => {
    let output: string | JSX.Element = ''
    
    switch (contactForm.step) {
      case 1: // Name entered
        if (input.trim().length < 2) {
          output = "Please enter a valid name (at least 2 characters):"
        } else {
          setContactForm(prev => ({ ...prev, name: input.trim(), step: 2 }))
          output = (
            <div>
              <p>👋 Nice to meet you, {input.trim()}!</p>
              <p className="mt-1">Please enter your email address:</p>
            </div>
          )
        }
        break

      case 2: // Email entered
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(input.trim())) {
          output = "Please enter a valid email address:"
        } else {
          setContactForm(prev => ({ ...prev, email: input.trim(), step: 3 }))
          output = (
            <div>
              <p>📧 Great! Now, what would you like to tell me?</p>
              <p className="text-white/60">(Type your message and press Enter)</p>
            </div>
          )
        }
        break

      case 3: // Message entered
        if (input.trim().length < 10) {
          output = "Please enter a longer message (at least 10 characters):"
        } else {
          setContactForm(prev => ({ ...prev, message: input.trim() }))
          handleContactSubmit()
        }
        break
    }

    return output
  }

  const handleContactSubmit = async () => {
    if (isSubmitting) return

    const { name, email, message } = contactForm
    if (!name || !email || !message) {
      setLines(prev => [...prev, { output: 'Please fill in all fields before submitting.' }])
      return
    }

    setIsSubmitting(true)
    setLines(prev => [...prev, { output: 'Sending message...' }])

    try {
      await emailjs.send(
        "service_cc300wk",
        "template_kahi2om",
        {
          from_name: name,
          from_email: email,
          message: message,
          to_name: "Anuj Dubey",
          reply_to: email,
          sent_at: new Date().toLocaleString()
        }
      )

      setLines(prev => [...prev, { 
        output: (
          <div className="space-y-2">
            <p className="text-green-400">✨ Thank you for your message! Here's a summary:</p>
            <div className="pl-4 border-l-2 border-white/20">
              <p>Name: {name}</p>
              <p>Email: {email}</p>
              <p>Message: {message}</p>
            </div>
            <p className="mt-4 text-green-400">🎉 Message sent successfully! I'll get back to you soon.</p>
          </div>
        )
      }])
      setContactForm({ step: 0, name: '', email: '', message: '' })
      
    } catch (error) {
      console.error('Email sending failed:', error)
      setLines(prev => [...prev, { 
        output: 'Failed to send message. Please try again or contact me directly at 00a20.j50@email.com'
      }])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCommand = (input: string) => {
    if (startContactForm && contactForm.step !== 0) {
      const output = handleContactForm(input)
      if (output) {
        setLines(prev => [...prev, { output }])
      }
      return
    }

    const args = input.trim().split(' ')
    const commandName = args[0].toLowerCase()
    const command = COMMANDS[commandName]

    let output: string | JSX.Element
    if (command) {
      output = command.action(args.slice(1))
      if (commandName === 'contact') {
        setContactForm(prev => ({ ...prev, step: 1 }))
      }
    } else if (input.trim() === '') {
      output = ''
    } else {
      output = `Command not found: ${commandName}. Type 'help' for available commands.`
    }

    if (commandName === 'clear') {
      setLines([])
    } else {
      setLines(prev => [...prev, { input, output }])
    }

    if (input.trim() !== '') {
      setCommandHistory(prev => [...prev, input])
      setHistoryIndex(-1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput)
      setCurrentInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    }
  }

  const addLine = (input: string, output: string | JSX.Element) => {
    setLines(prev => [...prev, { input, output }])
  }

  return (
    <div 
      className={`${className} fixed bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#2d2d2d] flex flex-col z-50 transition-all duration-200`}
      style={{ 
        height: isMaximized ? 'calc(100vh - 50px)' : `${terminalHeight}px`,
        maxHeight: 'calc(100vh - 50px)'
      }}
    >
      {/* Resize Handle */}
      <div
        className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize group z-50"
        onMouseDown={(e) => {
          const startDragY = e.clientY
          const startHeight = terminalHeight
          const handleMouseMove = (e: MouseEvent) => {
            const deltaY = startDragY - e.clientY
            const newHeight = Math.min(
              Math.max(200, startHeight + deltaY),
              window.innerHeight - 50
            )
            setTerminalHeight(newHeight)
          }

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
          }

          document.addEventListener('mousemove', handleMouseMove)
          document.addEventListener('mouseup', handleMouseUp)
        }}
      >
        <div className="w-full h-full group-hover:bg-vscode-accent/20 transition-colors" />
      </div>

      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] text-white/80 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} className="text-white/60" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setTerminalHeight(300)}
            className="hover:bg-[#3d3d3d] p-1.5 rounded-sm transition-colors"
            title="Minimize"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => setIsMaximized(prev => !prev)}
            className="hover:bg-[#3d3d3d] p-1.5 rounded-sm transition-colors mx-1"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Square size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={onClose}
            className="hover:bg-[#3d3d3d] p-1.5 rounded-sm transition-colors hover:bg-red-500/20"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className="mb-2 leading-relaxed">
            {line.input !== undefined && (
              <div className="flex items-center gap-2 text-white/80 select-text">
                <span className="text-green-400 whitespace-nowrap">portfolio@user</span>
                <span className="text-white/40">:</span>
                <span className="text-blue-400 whitespace-nowrap">~/portfolio/src</span>
                <span className="text-white/40">$</span>
                <span className="break-all">{line.input}</span>
              </div>
            )}
            {line.output && (
              <div className="mt-1 text-white/70 whitespace-pre-line break-words select-text">
                {line.output}
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 text-white/80">
          <span className="text-green-400 whitespace-nowrap">portfolio@user</span>
          <span className="text-white/40">:</span>
          <span className="text-blue-400 whitespace-nowrap">~/portfolio/src</span>
          <span className="text-white/40">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none min-w-0 break-all"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}

export default Terminal