import { useState, useRef, useEffect } from 'react'
import {
  Terminal as TerminalIcon,
  X,
  Minus,
  Square,
  Maximize2,
  Download,
  Mail,
  FileText,
  Folder
} from 'lucide-react'
import { GitHubIcon } from './icons/GitHubIcon'
import { LinkedInIcon } from './icons/LinkedInIcon'
import emailjs from '@emailjs/browser'

interface Command {
  command: string
  description: string
  action: (args: string[], terminal: TerminalController) => string | JSX.Element
  usage?: string
  aliases?: string[]
}

interface TerminalController {
  addLine: (input?: string, output?: string | JSX.Element) => void
  clearLines: () => void
  setTheme: (theme: TerminalTheme) => void
  getCurrentDirectory: () => string
  changeDirectory: (path: string) => void
  getFileSystem: () => FileSystemItem
  getCommandHistory: () => string[]
}

interface TerminalTheme {
  id: string
  name: string
  background: string
  text: string
  prompt: string
  directory: string
  selection: string
  accent: string
}

interface FileSystemItem {
  name: string
  type: 'file' | 'directory'
  content?: string
  children?: Record<string, FileSystemItem>
}

const WELCOME_MESSAGE = `Welcome to Portfolio Terminal v2.0.0
Type 'help' to see available commands or 'tutorial' for a guided tour.
Current path: ~/portfolio

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

// Terminal themes
const TERMINAL_THEMES: TerminalTheme[] = [
  {
    id: 'dark',
    name: 'Dark (Default)',
    background: '#1e1e1e',
    text: 'rgba(255, 255, 255, 0.8)',
    prompt: '#4EC9B0',
    directory: '#569CD6',
    selection: 'rgba(255, 255, 255, 0.1)',
    accent: '#C586C0'
  },
  {
    id: 'light',
    name: 'Light',
    background: '#f5f5f5',
    text: '#333333',
    prompt: '#0E7490',
    directory: '#0369A1',
    selection: 'rgba(0, 0, 0, 0.1)',
    accent: '#9333EA'
  },
  {
    id: 'monokai',
    name: 'Monokai',
    background: '#272822',
    text: '#F8F8F2',
    prompt: '#A6E22E',
    directory: '#66D9EF',
    selection: 'rgba(255, 255, 255, 0.1)',
    accent: '#F92672'
  },
  {
    id: 'github',
    name: 'GitHub',
    background: '#ffffff',
    text: '#24292e',
    prompt: '#2DA44E',
    directory: '#0969DA',
    selection: 'rgba(0, 0, 0, 0.1)',
    accent: '#8250DF'
  },
  {
    id: 'dracula',
    name: 'Dracula',
    background: '#282a36',
    text: '#f8f8f2',
    prompt: '#50fa7b',
    directory: '#8be9fd',
    selection: 'rgba(255, 255, 255, 0.1)',
    accent: '#ff79c6'
  }
]

// File system simulation
const createFileSystem = (): FileSystemItem => ({
  name: 'portfolio',
  type: 'directory',
  children: {
    'README.md': {
      name: 'README.md',
      type: 'file',
      content: `# Anuj Dubey's Portfolio

Welcome to my portfolio project! This is a VS Code-inspired interface to showcase my work and skills.

## Features
- Interactive terminal
- Project showcase
- Skills and experience
- Contact form

Feel free to explore using the terminal commands or the sidebar navigation.
`
    },
    'resume.pdf': {
      name: 'resume.pdf',
      type: 'file',
      content: '[PDF Content] My resume with detailed work experience and education.'
    },
    'src': {
      name: 'src',
      type: 'directory',
      children: {
        'components': {
          name: 'components',
          type: 'directory',
          children: {
            'Terminal.tsx': {
              name: 'Terminal.tsx',
              type: 'file',
              content: '// This is the terminal component you are currently using!'
            },
            'Header.tsx': {
              name: 'Header.tsx',
              type: 'file',
              content: '// Header component for the VS Code interface'
            }
          }
        },
        'pages': {
          name: 'pages',
          type: 'directory',
          children: {
            'Home.tsx': {
              name: 'Home.tsx',
              type: 'file',
              content: '// Home page component'
            },
            'About.tsx': {
              name: 'About.tsx',
              type: 'file',
              content: '// About page with my background'
            },
            'Projects.tsx': {
              name: 'Projects.tsx',
              type: 'file',
              content: '// Projects showcase page'
            }
          }
        },
        'App.tsx': {
          name: 'App.tsx',
          type: 'file',
          content: '// Main application component'
        },
        'index.tsx': {
          name: 'index.tsx',
          type: 'file',
          content: '// Entry point for the React application'
        }
      }
    },
    'projects': {
      name: 'projects',
      type: 'directory',
      children: {
        'project1.md': {
          name: 'project1.md',
          type: 'file',
          content: '# Project 1\nA detailed description of my first project.'
        },
        'project2.md': {
          name: 'project2.md',
          type: 'file',
          content: '# Project 2\nA detailed description of my second project.'
        }
      }
    },
    'contact.json': {
      name: 'contact.json',
      type: 'file',
      content: `{
  "email": "anuj.dubey@example.com",
  "github": "https://github.com/repo-anuj",
  "linkedin": "https://linkedin.com/in/anuj-dubey"
}`
    }
  }
})

// Define commands
const COMMANDS: Record<string, Command> = {
  help: {
    command: 'help',
    description: 'List all available commands',
    usage: 'help [command]',
    action: (args, _terminal) => {
      if (args.length > 0) {
        const cmdName = args[0].toLowerCase()
        const cmd = COMMANDS[cmdName]
        if (cmd) {
          return (
            <div className="text-white/80">
              <div className="mb-2">
                <span className="text-vscode-accent font-bold">{cmd.command}</span>
                {cmd.aliases && cmd.aliases.length > 0 && (
                  <span className="text-white/60 ml-2">(aliases: {cmd.aliases.join(', ')})</span>
                )}
              </div>
              <div className="mb-2">{cmd.description}</div>
              {cmd.usage && <div className="mb-2">Usage: {cmd.usage}</div>}
            </div>
          )
        } else {
          return `Command not found: ${cmdName}`
        }
      }

      return (
        <div className="text-white/80">
          <p className="mb-2">Available commands:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            {Object.values(COMMANDS).map(cmd => (
              <div key={cmd.command} className="flex items-start">
                <span className="text-vscode-accent font-medium w-24 inline-block">{cmd.command}</span>
                <span className="text-white/70">{cmd.description}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-white/60">Type 'help [command]' for more information about a specific command.</p>
        </div>
      )
    }
  },
  clear: {
    command: 'clear',
    description: 'Clear the terminal',
    aliases: ['cls'],
    action: (_, terminal) => {
      terminal.clearLines()
      return ''
    }
  },
  echo: {
    command: 'echo',
    description: 'Print text to the terminal',
    usage: 'echo [text...]',
    action: (args, _) => args.join(' ')
  },
  date: {
    command: 'date',
    description: 'Display current date and time',
    action: (_, __) => new Date().toLocaleString()
  },
  whoami: {
    command: 'whoami',
    description: 'Display current user',
    action: (_, __) => 'Anuj Dubey'
  },
  joke: {
    command: 'joke',
    description: 'Tell a programming joke',
    action: (_, __) => {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Why did the developer go broke? Because he used up all his cache!",
        "What's a programmer's favorite hangout spot? The Foo Bar!",
        "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25!",
        "Why did the programmer quit his job? Because he didn't get arrays!",
        "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
        "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings.",
        "Why did the developer quit his job? He didn't get arrays!",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
        "Why do Java developers wear glasses? Because they don't C#!"
      ]
      return jokes[Math.floor(Math.random() * jokes.length)]
    }
  },
  weather: {
    command: 'weather',
    description: 'Show current weather (simulated)',
    usage: 'weather [city]',
    action: (args, _) => {
      const city = args.length > 0 ? args.join(' ') : 'Current location'
      const conditions = ['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Stormy', 'Snowy', 'Foggy']
      const temp = Math.floor(Math.random() * 30) + 10
      const condition = conditions[Math.floor(Math.random() * conditions.length)]
      const humidity = Math.floor(Math.random() * 50) + 30

      return (
        <div className="space-y-1">
          <div className="font-bold">Weather for {city}:</div>
          <div>🌡️ Temperature: {temp}°C</div>
          <div>🌤️ Conditions: {condition}</div>
          <div>💧 Humidity: {humidity}%</div>
          <div className="text-white/50 text-xs mt-2">Note: This is simulated weather data</div>
        </div>
      )
    }
  },
  github: {
    command: 'github',
    description: 'Open my GitHub profile',
    action: (_, __) => {
      window.open('https://github.com/repo-anuj', '_blank')
      return (
        <div className="flex items-center gap-2">
          <GitHubIcon size={16} className="text-white" />
          <span>Opening GitHub profile in a new tab...</span>
        </div>
      )
    }
  },
  linkedin: {
    command: 'linkedin',
    description: 'Open my LinkedIn profile',
    action: (_, __) => {
      window.open('https://linkedin.com/in/anuj-dubey', '_blank')
      return (
        <div className="flex items-center gap-2">
          <LinkedInIcon size={16} className="text-blue-500" />
          <span>Opening LinkedIn profile in a new tab...</span>
        </div>
      )
    }
  },
  matrix: {
    command: 'matrix',
    description: 'Display Matrix-like animation',
    action: (_, __) => {
      return (
        <div className="font-mono text-green-500 animate-pulse">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="opacity-80">
              {Array.from({ length: 60 }, () =>
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
    action: (_, __) => {
      const skills = {
        'Frontend': ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'Next.js'],
        'Backend': ['Node.js', 'Express', 'Python', 'Django', 'SQL', 'MongoDB', 'Firebase'],
        'DevOps': ['Git', 'GitHub Actions', 'Docker', 'AWS', 'Vercel', 'Netlify'],
        'Tools': ['VS Code', 'Figma', 'Postman', 'Jest', 'Webpack']
      }
      return (
        <div className="text-white/80 space-y-3">
          <div className="text-lg font-bold text-vscode-accent">My Technical Skills</div>
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="mb-2">
              <div className="text-vscode-accent font-medium mb-1">{category}:</div>
              <div className="pl-4 flex flex-wrap gap-1">
                {items.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-white/10 rounded-md text-xs">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
  },
  pwd: {
    command: 'pwd',
    description: 'Print current working directory',
    action: (_, terminal) => terminal.getCurrentDirectory()
  },
  ls: {
    command: 'ls',
    description: 'List directory contents',
    aliases: ['dir'],
    usage: 'ls [path]',
    action: (args, terminal) => {
      // Get current directory path
      const currentPath = terminal.getCurrentDirectory()
      const targetPath = args.length > 0 ? args[0] : currentPath

      // Navigate to the target directory in our file system
      const fs = terminal.getFileSystem()
      let currentDir = fs

      // If we're not at root, navigate to the current directory
      if (targetPath !== '~') {
        const pathParts = targetPath.split('/').filter(Boolean)
        for (const part of pathParts) {
          if (part === '..') {
            // Not handling parent directory navigation in this simple example
            continue
          }
          if (!currentDir.children || !currentDir.children[part]) {
            return `ls: cannot access '${targetPath}': No such file or directory`
          }
          currentDir = currentDir.children[part]
        }
      }

      if (currentDir.type !== 'directory') {
        return `ls: cannot list '${targetPath}': Not a directory`
      }

      if (!currentDir.children || Object.keys(currentDir.children).length === 0) {
        return 'Directory is empty'
      }

      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Object.values(currentDir.children || {}).map(item => (
            <div key={item.name} className="flex items-center gap-1">
              {item.type === 'directory' ? (
                <Folder size={16} className="text-blue-400" />
              ) : (
                <FileText size={16} className="text-yellow-400" />
              )}
              <span className={item.type === 'directory' ? 'text-blue-400' : 'text-yellow-400'}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )
    }
  },
  cd: {
    command: 'cd',
    description: 'Change directory',
    usage: 'cd [directory]',
    action: (args, terminal) => {
      if (args.length === 0) {
        terminal.changeDirectory('~')
        return 'Changed to home directory'
      }

      const targetDir = args[0]
      terminal.changeDirectory(targetDir)
      return `Changed directory to ${terminal.getCurrentDirectory()}`
    }
  },
  cat: {
    command: 'cat',
    description: 'Display file contents',
    usage: 'cat <file>',
    action: (args, terminal) => {
      if (args.length === 0) {
        return 'Usage: cat <file>'
      }

      const fileName = args[0]
      const fs = terminal.getFileSystem()
      const currentPath = terminal.getCurrentDirectory().split('/').filter(Boolean)

      let currentDir = fs
      for (const part of currentPath) {
        if (!currentDir.children || !currentDir.children[part]) {
          return `cat: ${fileName}: No such file or directory`
        }
        currentDir = currentDir.children[part]
      }

      if (!currentDir.children || !currentDir.children[fileName]) {
        return `cat: ${fileName}: No such file or directory`
      }

      const file = currentDir.children[fileName]
      if (file.type !== 'file') {
        return `cat: ${fileName}: Is a directory`
      }

      return (
        <div className="whitespace-pre-wrap bg-black/20 p-2 rounded">
          {file.content}
        </div>
      )
    }
  },
  theme: {
    command: 'theme',
    description: 'Change terminal theme',
    usage: 'theme [theme-name]',
    action: (args, terminal) => {
      if (args.length === 0) {
        return (
          <div className="space-y-2">
            <div>Available themes:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TERMINAL_THEMES.map(theme => (
                <div
                  key={theme.id}
                  className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-white/10"
                  onClick={() => terminal.setTheme(theme)}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <span>{theme.name}</span>
                </div>
              ))}
            </div>
            <div className="text-white/60 text-xs">Click on a theme to apply it, or use 'theme [name]'</div>
          </div>
        )
      }

      const themeName = args[0].toLowerCase()
      const theme = TERMINAL_THEMES.find(t => t.id === themeName)

      if (!theme) {
        return `Theme '${themeName}' not found. Use 'theme' to see available themes.`
      }

      terminal.setTheme(theme)
      return `Applied theme: ${theme.name}`
    }
  },
  contact: {
    command: 'contact',
    description: 'Start the interactive contact form',
    action: (_, __) => CONTACT_WELCOME_MESSAGE
  },
  history: {
    command: 'history',
    description: 'Show command history',
    action: (_, terminal) => {
      const history = terminal.getCommandHistory()
      if (history.length === 0) {
        return 'No commands in history'
      }

      return (
        <div className="space-y-1">
          {history.map((cmd, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-white/50 w-6 text-right">{i + 1}</span>
              <span>{cmd}</span>
            </div>
          ))}
        </div>
      )
    }
  },
  resume: {
    command: 'resume',
    description: 'View or download my resume',
    action: (_, __) => {
      return (
        <div className="space-y-3">
          <div className="text-lg font-bold">Anuj Dubey - Resume</div>
          <div className="flex gap-4">
            <button
              onClick={() => window.open('/Anuj_Dubey_Resume.pdf', '_blank')}
              className="flex items-center gap-2 px-3 py-2 bg-vscode-accent/20 hover:bg-vscode-accent/30 rounded-md transition-colors"
            >
              <FileText size={16} />
              <span>View Resume</span>
            </button>
            <a
              href="/Anuj_Dubey_Resume.pdf"
              download
              className="flex items-center gap-2 px-3 py-2 bg-vscode-accent/20 hover:bg-vscode-accent/30 rounded-md transition-colors"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      )
    }
  },
  tutorial: {
    command: 'tutorial',
    description: 'Start an interactive terminal tutorial',
    action: (_, terminal) => {
      terminal.addLine('', (
        <div className="space-y-3 bg-vscode-accent/10 p-3 rounded-md border-l-4 border-vscode-accent">
          <div className="text-lg font-bold">Welcome to the Terminal Tutorial!</div>
          <p>This terminal is a fully interactive command-line interface that simulates a real terminal experience.</p>
          <p>Here are some commands to try:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-vscode-accent">ls</span> - List files in the current directory</li>
            <li><span className="text-vscode-accent">cd src</span> - Change to the src directory</li>
            <li><span className="text-vscode-accent">cat README.md</span> - View the content of a file</li>
            <li><span className="text-vscode-accent">skills</span> - See my technical skills</li>
            <li><span className="text-vscode-accent">theme</span> - Change the terminal theme</li>
            <li><span className="text-vscode-accent">contact</span> - Start the contact form</li>
          </ul>
          <p>Use the <span className="text-vscode-accent">help</span> command to see all available commands.</p>
          <p>Have fun exploring!</p>
        </div>
      ))
      return ''
    }
  },
  social: {
    command: 'social',
    description: 'Display my social media links',
    action: (_, __) => {
      return (
        <div className="space-y-3">
          <div className="text-lg font-bold">Connect with me</div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/repo-anuj"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-[#24292e]/80 hover:bg-[#24292e] text-white rounded-md transition-colors"
            >
              <GitHubIcon size={16} />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/anuj-dubey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-[#0077b5]/80 hover:bg-[#0077b5] text-white rounded-md transition-colors"
            >
              <LinkedInIcon size={16} />
              <span>LinkedIn</span>
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText('anuj.dubey@example.com')
                  .then(() => alert('Email copied to clipboard!'))
                  .catch(err => console.error('Could not copy email: ', err))
              }}
              className="flex items-center gap-2 px-3 py-2 bg-[#ea4335]/80 hover:bg-[#ea4335] text-white rounded-md transition-colors"
            >
              <Mail size={16} />
              <span>Email</span>
            </button>
          </div>
        </div>
      )
    }
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
  // Basic terminal state
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

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactFormState>({
    step: startContactForm ? 1 : 0,
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // File system and theme state
  const [fileSystem] = useState<FileSystemItem>(createFileSystem())
  const [currentDirectory, setCurrentDirectory] = useState<string>('~/portfolio')
  const setCurrentTheme = useState<TerminalTheme>(TERMINAL_THEMES[0])[1]

  // Refs
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

  // Terminal controller implementation
  const terminalController: TerminalController = {
    addLine: (input, output) => {
      setLines(prev => [...prev, { input, output }])
    },
    clearLines: () => {
      setLines([])
    },
    setTheme: (theme) => {
      setCurrentTheme(theme)
    },
    getCurrentDirectory: () => {
      return currentDirectory
    },
    changeDirectory: (path) => {
      // Simple directory navigation
      if (path === '~') {
        setCurrentDirectory('~/portfolio')
        return
      }

      if (path === '..') {
        // Go up one level
        const parts = currentDirectory.split('/')
        if (parts.length > 2) { // Don't go above ~/portfolio
          parts.pop()
          setCurrentDirectory(parts.join('/'))
        }
        return
      }

      // Handle absolute paths
      if (path.startsWith('~/')) {
        setCurrentDirectory(path)
        return
      }

      // Handle relative paths
      setCurrentDirectory(`${currentDirectory}/${path}`.replace(/\/+/g, '/'))
    },
    getFileSystem: () => {
      return fileSystem
    },
    getCommandHistory: () => {
      return commandHistory
    }
  }

  // Terminal output handling functions can be added here when needed

  // Handle command execution
  const handleCommand = (input: string) => {
    if (startContactForm && contactForm.step !== 0) {
      const output = handleContactForm(input)
      if (output) {
        terminalController.addLine('', output)
      }
      return
    }

    const args = input.trim().split(' ')
    const commandName = args[0].toLowerCase()

    // Check for aliases
    let foundCommand: Command | undefined = COMMANDS[commandName]
    if (!foundCommand) {
      // Look for command by alias
      foundCommand = Object.values(COMMANDS).find(cmd =>
        cmd.aliases?.includes(commandName)
      )
    }

    let output: string | JSX.Element
    if (foundCommand) {
      output = foundCommand.action(args.slice(1), terminalController)

      // Handle special commands
      if (foundCommand.command === 'contact') {
        setContactForm(prev => ({ ...prev, step: 1 }))
      }

      // Handle clear command
      if (foundCommand.command === 'clear') {
        terminalController.clearLines()
      } else {
        terminalController.addLine(input, output)
      }
    } else if (input.trim() === '') {
      output = ''
    } else {
      output = `Command not found: ${commandName}. Type 'help' for available commands.`
      terminalController.addLine(input, output)
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
